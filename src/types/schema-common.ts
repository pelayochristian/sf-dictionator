import { z } from "zod";
import { customizableSObjectSchema } from "../validator/sobject-common.mjs";
import { SObjectDescribeFieldProps } from "./sobject-describe.js";
import { SObjectMetadataFieldProps } from "./sobject-metadata.js";

export type CustomizableSObjectSchema = z.infer<
    typeof customizableSObjectSchema
>;

export interface SObjectDescribeMapProps {
    [key: string]: SObjectDescribeFieldProps[]
}

export interface SObjectMetadataMapProps {
    [key: string]: SObjectMetadataFieldProps[]
}
