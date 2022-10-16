import { protectedProcedure, router } from "../trpc";
import jsforce from 'jsforce';
import { CustomizableSObject } from "schema-object";
import { TRPCError } from "@trpc/server";
import { z, ZodError } from "zod";
import { sObjectMetadataSchema } from "../../../validator/sobject-metadata.mjs";
import { describeFieldSchema, sObjectDescribeSchema } from "../../../validator/sobject-describe.mjs";
import { metadataFieldSchema } from "../../../validator/sobject-metadata.mjs";
import { SObjectMetadataFieldProps, SObjectMetadataProps } from "../../../types/sobject-metadata";
import { SObjectDescribeFieldProps, SObjectDescribeProps } from "../../../types/sobject-describe";

export const schemaObjectRouter = router({
    // Method use to retrieve SObjects that are customizable.
    getCustomizableSObjects: protectedProcedure
        .query(({ ctx }) => {
            return new Promise((resolve, reject) => {
                const jwt = ctx.jwt?.sfdc
                const conn = new jsforce.Connection({
                    instanceUrl: jwt?.instanceURL,
                    accessToken: jwt?.accessToken,
                });

                const sObjects: CustomizableSObject[] = [];
                conn.query(
                    'SELECT Label, QualifiedApiName ' +
                    'FROM EntityDefinition ' +
                    'WHERE IsCustomizable = true ' +
                    'Order By Label'
                )
                    .on('record', function (record) {
                        sObjects.push({
                            value: record.QualifiedApiName,
                            label: record.Label
                        });
                    })
                    .on('end', function () {
                        resolve(sObjects)
                    })
                    .on('error', function (err) {
                        reject(new TRPCError({ message: err.message, code: 'UNAUTHORIZED' }));
                    })
                    .run({ autoFetch: true, maxFetch: 4000 });
            })
        }),

    // Method use to retrieve SObjects with it's fields.
    getSObjectsWithFields: protectedProcedure
        .input(z.object({ selectedSObject: z.array(z.string()) }).nullish())
        .query(async ({ input, ctx }) => {
            const jwt = ctx.jwt?.sfdc
            const conn = new jsforce.Connection({
                instanceUrl: jwt?.instanceURL,
                accessToken: jwt?.accessToken,
            });

            // Retrieve SObject Metadata from Salesforce.
            const sObjectMetadata = await readSObjectMetadata(conn, input?.selectedSObject ?? [])

            // Map the fields from Describe SObject
            const sObjectMetadataFieldList_Schema = z.array(metadataFieldSchema);
            const sObjectMetadataMap: { [key: string]: SObjectMetadataFieldProps[] } = {}
            for (const [, sObject] of Object.entries(sObjectMetadata)) {
                if (!sObject.fullName) return;
                const fieldWithDescription = sObjectMetadataFieldList_Schema
                    .parse(sObject.fields)
                    .filter(field => {
                        if (field.description) return field;
                    })
                sObjectMetadataMap[sObject.fullName] = sObjectMetadataFieldList_Schema.parse(fieldWithDescription);
            }

            // Retrieve SObject Describe from Salesforce.
            const sObjectsDescribe = await Promise.all(
                input?.selectedSObject.map(async (sObjectName) => {
                    return await describeSObject(conn, sObjectName);
                }) as SObjectDescribeProps[]
            );

            // Map the fields from Describe SObject.
            const sObjectDescribeFieldList_Schema = z.array(describeFieldSchema);
            const sObjectDescribeMap: { [key: string]: SObjectDescribeFieldProps[] } = {}
            for (const [, sObject] of Object.entries(sObjectsDescribe)) {
                if (!sObject.name) return;

                const updateFieldsWithDescription = sObjectDescribeFieldList_Schema
                    .parse(sObject.fields)
                    .map(describeField => {
                        if (!sObject.name) return;
                        sObjectMetadataMap[sObject.name]?.map(metadataField => {
                            if (describeField.name === metadataField.fullName) {
                                describeField.fieldDescription = metadataField.description;
                            }
                        })
                        return describeField;
                    })
                sObjectDescribeMap[sObject.name] = sObjectDescribeFieldList_Schema.parse(updateFieldsWithDescription)
            }

            return new Promise(async (resolve, reject) => {
                resolve(sObjectDescribeMap)
            })
        }),
});

/**
 *  Utility method to read SObject Metadata by passing SObject Array Name.
 * @param conn Salesforce jsForce Connection.
 * @param selectedSObject List of Selected SObject in String of Array.
 * @returns Promise<unknown>
 */
const readSObjectMetadata = async (conn: jsforce.Connection, selectedSObject: string[]) => {
    return new Promise<SObjectMetadataProps[]>((resolve, reject) => {
        conn.metadata.read('CustomObject', selectedSObject ?? [], (err, metadata) => {
            if (err) {
                reject(new TRPCError({
                    message: err.message,
                    code: 'INTERNAL_SERVER_ERROR'
                }));
            }

            try {
                const sObjectMetadaList_Schema = z.array(sObjectMetadataSchema)
                resolve(Array.isArray(metadata)
                    ? sObjectMetadaList_Schema.parse(metadata)
                    : sObjectMetadaList_Schema.parse([sObjectMetadataSchema.parse(metadata)]));
            } catch (err) {
                if (err instanceof ZodError) {
                    reject(new TRPCError({
                        message: err.message,
                        code: 'INTERNAL_SERVER_ERROR'
                    }));
                }
            }
        });
    })
}

/**
 *  Utility method use to retrieve the SObject Details
 * @param conn Salesforce jsForce Connection.
 * @param sObjectName SObject in string data type.
 * @returns Promise<unknown>
 */
const describeSObject = async (conn: jsforce.Connection, sObjectName: string) => {
    return new Promise<SObjectDescribeProps>((resolve, reject) => {
        conn.describe(sObjectName, (err, meta) => {
            if (err) {
                return reject(err);
            }
            resolve(sObjectDescribeSchema.parse(meta));
        });
    });
};
