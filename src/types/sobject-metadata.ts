import { z } from "zod";
import { metadataFieldSchema, sObjectMetadataSchema } from "../validator/sobject-metadata.mjs";

export type SObjectMetadataFieldProps = z.infer<typeof metadataFieldSchema>;
export type SObjectMetadataProps = z.infer<typeof sObjectMetadataSchema>;

