import { SObjectDescribeDTO, SObjectDescribeFieldDTO, sObjectDescribeSchema } from "@schema/sobject-describe";
import { SObjectMetadataDTO, sObjectMetadataSchema } from "@schema/sobject-metadata";
import { TRPCError } from "@trpc/server";
import { z, ZodError } from "zod";
import jsforce from 'jsforce';

/**
 * Util method to reconstruct sObject field type to more readable context
 * @param describeField 
 * @returns void
 */
export const fieldValueTransformer = (describeField: SObjectDescribeFieldDTO) => {
    if (!describeField) return;

    // Int | Double Type
    if (describeField.type === 'int' || describeField.type === 'double') {
        // const precision = describeField.precision ?? 0;
        // const scale = describeField.scale ?? 0;
        // const finalPrecision = precision - scale;
        describeField['type'] =
            describeField.type === 'int'
                ? `${describeField.type}`
                : `${describeField.type} (${describeField.precision}, ${describeField?.scale})`;
    }

    // Reference Type
    if (describeField.type === 'reference' && describeField.referenceTo != null) {
        describeField['type'] = `reference (${describeField['referenceTo']})`;
    }

    // Picklist Type
    if (describeField.type === 'picklist') {
        describeField['type'] = describeField['restrictedPicklist']
            ? `${describeField.type} (${describeField['length']}), restricted`
            : `${describeField.type} (${describeField['length']})`;
    }

    // Text |  Textarea | String Type
    if ((describeField.type === 'textarea' || describeField.type === 'string'
        || describeField.type === 'phone' || describeField.type === 'url')
        && describeField['length'] != null) {

        describeField['type'] = `${describeField.type} (${describeField['length']})`;
    }

    // Currency Type
    if (describeField.type === 'currency' && describeField['length'] != null) {
        describeField['type'] = `${describeField.type} (${describeField['precision']}, ${describeField['length']})`;
    }

    // Formula Type
    if (describeField.calculatedFormula != null) {
        describeField['type'] += ', formula'
    }

    // Check if the field is nillable then append (Unique)
    if (describeField?.unique) {
        describeField['type'] += ', unique';
    }

    // Check if the field is externalId then append (External ID)
    if (describeField?.externalId) {
        describeField['type'] += ', external id';
    }
}

/**
 *  Utility method to read SObject Metadata by passing SObject Array Name.
 * @param conn Salesforce jsForce Connection.
 * @param selectedSObject List of Selected SObject in String of Array.
 * @returns Promise<unknown>
 */
export const readSObjectMetadata = async (conn: jsforce.Connection, selectedSObject: string[]) => {
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
export const describeSObject = async (conn: jsforce.Connection, sObjectName: string) => {
    return new Promise<SObjectDescribeDTO>((resolve, reject) => {
        conn.describe(sObjectName, (err, meta) => {
            if (err) {
                return reject(err);
            }
            resolve(sObjectDescribeSchema.parse(meta));
        });
    });
};