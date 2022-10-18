import { protectedProcedure, router } from "../trpc";
import jsforce from 'jsforce';
import { TRPCError } from "@trpc/server";
import { z, ZodError } from "zod";
import {
    metadataFieldSchema,
    SObjectMetadataDTO,
    SObjectMetadataFieldsWithKeyDTO,
    sObjectMetadataSchema
} from "@schema/sobject-metadata";
import {
    describeFieldSchema,
    SObjectDescribeDTO,
    SObjectDescribeFieldsWithKeyDTO,
    sObjectDescribeSchema
} from "@schema/sobject-describe";
import { CustomizableSObjectDTO } from "@schema/sobject-customizable";

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

                const sObjects: CustomizableSObjectDTO[] = [];
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
            const sObjectMetadataMap: SObjectMetadataFieldsWithKeyDTO = {}
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
                }) as SObjectDescribeDTO[]
            );

            // Map the fields from Describe SObject.
            const sObjectDescribeFieldList_Schema = z.array(describeFieldSchema);
            const sObjectDescribeMap: SObjectDescribeFieldsWithKeyDTO = {}
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
            return sObjectDescribeMap;
        }),
});

const fieldTransformer = () => {
    return;
}

/**
 *  Utility method to read SObject Metadata by passing SObject Array Name.
 * @param conn Salesforce jsForce Connection.
 * @param selectedSObject List of Selected SObject in String of Array.
 * @returns Promise<unknown>
 */
const readSObjectMetadata = async (conn: jsforce.Connection, selectedSObject: string[]) => {
    return new Promise<SObjectMetadataDTO[]>((resolve, reject) => {
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
    return new Promise<SObjectDescribeDTO>((resolve, reject) => {
        conn.describe(sObjectName, (err, meta) => {
            if (err) {
                return reject(err);
            }
            resolve(sObjectDescribeSchema.parse(meta));
        });
    });
};
