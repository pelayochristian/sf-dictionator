import { z } from "zod";

export const customizableSObjectSchema = z.object({
    value: z.string(),
    label: z.string(),
});

