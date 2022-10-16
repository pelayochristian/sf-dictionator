import { protectedProcedure, router } from "../trpc";
import jsforce from 'jsforce';
import { CustomizableSObject } from "schema-object";
import { TRPCError } from "@trpc/server";
import { z, ZodError } from "zod";
import { sObjectMetadataSchema } from "../../../validator/sobject-metadata.mjs";
import { fieldSchema, sObjectDescribeSchema } from "../../../validator/sobject-describe.mjs";

const arrSObjectMetada = z.array(sObjectMetadataSchema)
export type SObjectMetadataResponse = z.infer<typeof sObjectMetadataSchema>;

const arrSObjectDescribe = z.array(sObjectDescribeSchema)
export type SObjectDescribeResponse = z.infer<typeof sObjectDescribeSchema>

export const schemaObjectRouter = router({
    //Method use to retrieve SObjects that are customizable.
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

    getSObjectsWithFields: protectedProcedure
        .input(z.object({ selectedSObject: z.array(z.string()) }).nullish())
        .query(async ({ input, ctx }) => {
            const jwt = ctx.jwt?.sfdc
            const conn = new jsforce.Connection({
                instanceUrl: jwt?.instanceURL,
                accessToken: jwt?.accessToken,
            });

            const sObjectMetadata = await readSObjectMetadata(conn, input?.selectedSObject ?? [])

            const sObjectsDescribe = await Promise.all(
                input?.selectedSObject.map(async (sObjectName) => {
                    return await describeSObject(conn, sObjectName);
                }) as SObjectDescribeResponse[]
            );

            // Map the fields from Describe SObject
            const sObjectDescribeMap = sObjectsDescribe.map((sobject) => {
                return {
                    name: sobject.name,
                    fields: sobject.fields
                };
            })

            // Map the fields from the ReadMetadataSObject
            const sObjectMetadataMap = sObjectMetadata.map((sobject) => {
                return {
                    name: sobject.fullName,
                    fields: sobject.fields
                };
            })

            return new Promise(async (resolve, reject) => {
                resolve(sObjectDescribeMap)
            })
        }),
});

// const sObjectDescribeWrapper = z.object({
//     name: z.string().optional(),
//     fields: z.array(fieldSchema).optional()
// });

// export type SObjectDescribeWrapper = z.infer<typeof sObjectDescribeWrapper>;

/**
 *  Utility method to read SObject Metadata by passing SObject Array Name.
 * @param conn Salesforce jsForce Connection.
 * @param selectedSObject List of Selected SObject in String of Array.
 * @returns Promise<unknown>
 */
const readSObjectMetadata = async (conn: jsforce.Connection, selectedSObject: string[]) => {
    return new Promise<SObjectMetadataResponse[]>((resolve, reject) => {
        conn.metadata.read('CustomObject', selectedSObject ?? [], (err, metadata) => {
            if (err) {
                reject(new TRPCError({
                    message: err.message,
                    code: 'INTERNAL_SERVER_ERROR'
                }));
            }

            try {
                resolve(Array.isArray(metadata)
                    ? arrSObjectMetada.parse(metadata)
                    : arrSObjectMetada.parse([sObjectMetadataSchema.parse(metadata)]));
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
    return new Promise<SObjectDescribeResponse>((resolve, reject) => {
        conn.describe(sObjectName, (err, meta) => {
            if (err) {
                return reject(err);
            }
            resolve(sObjectDescribeSchema.parse(meta));
        });
    });
};
