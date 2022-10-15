import { z } from "zod";

export const actionOverrideSchema = z.object({
    actionName: z.string().optional(),
    type: z.string().optional(),
});

export const fieldSchema = z.object({
    fullName: z.string().optional(),
    type: z.string().optional(),
});

export const sObjectMetadataSchema = z.object({
    fullName: z.string().optional(),
    actionOverrides: z.array(actionOverrideSchema).optional(),
    compactLayoutAssignment: z.string().optional(),
    enableFeeds: z.string().optional(),
    externalSharingModel: z.string().optional(),
    fields: z.array(fieldSchema).optional(),
    label: z.string().optional(),
    sharingModel: z.string().optional(),
});
