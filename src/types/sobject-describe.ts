import { z } from "zod";
import { describeFieldSchema, sObjectDescribeSchema } from "../validator/sobject-describe.mjs";

export type SObjectDescribeFieldProps = z.infer<typeof describeFieldSchema>;
export type SObjectDescribeProps = z.infer<typeof sObjectDescribeSchema>