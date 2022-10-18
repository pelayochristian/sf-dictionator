import { z } from "zod";

export const metadataFieldSchema = z.object({
    fullName: z.string().optional(),
    type: z.string().optional(),
    description: z.string().optional(),
});

export const sObjectMetadataSchema = z.object({
    fullName: z.string().optional(),
    fields: z
        .union([metadataFieldSchema
            , metadataFieldSchema
                .array()])
        .transform((rel) => {
            return Array.isArray(rel) ? rel : [rel];
        }),
    label: z.string().optional(),
    // sharingModel: z.string().optional(),
});

export const sObjectMetadataFieldsWithKeySchema = z.record(
    z.string(),
    z.array(metadataFieldSchema)
);

// Array Object Type of SObjectMetadata
export type SObjectMetadataDTO = z.infer<typeof sObjectMetadataSchema>;

// Single Object Type of SObjectMetadata Fields
export type SObjectMetadataFieldDTO = z.infer<typeof metadataFieldSchema>;

// Single Object Type of SObjectMetadataFields with Key
export type SObjectMetadataFieldsWithKeyDTO = z.infer<typeof sObjectMetadataFieldsWithKeySchema>;
