import { z } from "zod";

export const customizableSObjectSchema = z.object({
    value: z.string(),
    label: z.string(),
});

// Single Object Type for SObject that is Customizable
export type CustomizableSObjectDTO = z.infer<
    typeof customizableSObjectSchema
>;