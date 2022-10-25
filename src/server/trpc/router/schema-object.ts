import { protectedProcedure, router } from "../trpc";
import jsforce from 'jsforce';
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { CustomizableSObjectDTO } from "@schema/sobject-customizable";
import {
    metadataFieldSchema,
    SObjectMetadataFieldsWithKeyDTO,
} from "@schema/sobject-metadata";
import {
    describeFieldSchema,
    SObjectDescribeDTO,
    SObjectDescribeFieldsWithKeyDTO,
} from "@schema/sobject-describe";
import { describeSObject, fieldValueTransformer, readSObjectMetadata } from "utils/sobject.util";
import ExcelJs from 'exceljs'
import fs from 'fs';


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

            // Map the fields from Metadata SObject
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
                        });

                        // Transform Selected Fields.
                        fieldValueTransformer(describeField);
                        return describeField;
                    })
                sObjectDescribeMap[sObject.name] = sObjectDescribeFieldList_Schema.parse(updateFieldsWithDescription)
            }
            return sObjectDescribeMap;
        }),

    textExportExcel: protectedProcedure
        .query(async ({ ctx }) => {
            const wb = await new ExcelJs.Workbook();
            const PUBLIC_FILE_PATH = "./MySalesforceDictionary.xlsx";
            await wb.xlsx.readFile(PUBLIC_FILE_PATH).then(() => {
                const ws = wb.getWorksheet(1);
                ws.getCell("H4").value = "OKM";
            });



            await wb.xlsx.writeFile(PUBLIC_FILE_PATH);
            const stream = fs.readFileSync(PUBLIC_FILE_PATH);
            return { xxx: stream.toString("base64") }
        })
});


