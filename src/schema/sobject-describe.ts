import { z } from "zod";

export const picklistValueSchema = z.object({
    active: z.boolean().optional(),
    defaultValue: z.boolean().optional(),
    label: z.string().optional().nullable(),
    validFor: z.null().optional(),
    value: z.string().optional(),
});

export const describeFieldSchema = z.object({
    custom: z.boolean().optional(),
    inlineHelpText: z.string().optional().nullable(),
    label: z.string().optional(),
    length: z.number().optional(),
    name: z.string().optional(),
    nillable: z.boolean().optional(),
    picklistValues: z.array(picklistValueSchema).optional(),
    calculatedFormula: z.string().nullable().optional(),
    precision: z.number().optional(),
    referenceTo: z.array(z.string()).optional(),
    restrictedPicklist: z.boolean().optional(),
    scale: z.number().optional(),
    type: z.string().optional(),
    updateable: z.boolean().optional(),
    fieldDescription: z.string().optional(),
    externalId: z.boolean().optional(),
    unique: z.boolean().optional()
});

export const sObjectDescribeSchema = z.object({
    fields: z.array(describeFieldSchema).optional(),
    label: z.string().optional(),
    labelPlural: z.string().optional(),
    name: z.string().optional(),
});

export const sObjectDescribeFieldsWithKeySchema = z.record(
    z.string(),
    z.array(describeFieldSchema)
);

// Array Object Type of SObjectDescribe
export type SObjectDescribeDTO = z.infer<typeof sObjectDescribeSchema>;

// Single Object Type of SObjectDescribe Fields
export type SObjectDescribeFieldDTO = z.infer<typeof describeFieldSchema>;

// Single Object Type of SObjectDescribe with Key
export type SObjectDescribeFieldsWithKeyDTO = z.infer<typeof sObjectDescribeFieldsWithKeySchema>;

