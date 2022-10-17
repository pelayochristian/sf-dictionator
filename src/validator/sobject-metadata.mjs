import { z } from "zod";

// export const actionOverrideSchema = z.object({
//     actionName: z.string().optional(),
//     type: z.string().optional(),
// });

export const metadataFieldSchema = z.object({
    fullName: z.string().optional(),
    type: z.string().optional(),
    description: z.string().optional(),
});

export const sObjectMetadataSchema = z.object({
    fullName: z.string().optional(),
    // actionOverrides: z.array(actionOverrideSchema).optional(),
    // compactLayoutAssignment: z.string().optional(),
    // enableFeeds: z.string().optional(),
    // externalSharingModel: z.string().optional(),
    fields: z
        .union([metadataFieldSchema, metadataFieldSchema.array()])
        .transform((rel) => {
            return Array.isArray(rel) ? rel : [rel];
        }),
    label: z.string().optional(),
    // sharingModel: z.string().optional(),
});
