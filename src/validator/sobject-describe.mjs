import { z } from "zod";

export const picklistValueSchema = z.object({
    active: z.boolean().optional(),
    defaultValue: z.boolean().optional(),
    label: z.string().optional().nullable(),
    validFor: z.null().optional(),
    value: z.string().optional(),
});

// export const recordTypeInfoUrlsSchema = z.object({
//     layout: z.string().optional(),
// });

// export const supportedScopeSchema = z.object({
//     label: z.string().optional(),
//     name: z.string().optional(),
// });

export const describeFieldSchema = z.object({
    // aggregatable: z.boolean().optional(),
    // autoNumber: z.boolean().optional(),
    // byteLength: z.number().optional(),
    // calculated: z.boolean().optional(),
    // calculatedFormula: z.null().optional(),
    // cascadeDelete: z.boolean().optional(),
    // caseSensitive: z.boolean().optional(),
    // controllerName: z.null().optional(),
    // createable: z.boolean().optional(),
    // custom: z.boolean().optional(),
    // defaultValue: z.union([z.boolean(), z.string()]).optional().nullable(),
    // defaultValueFormula: z.string().optional().nullable(),
    // defaultedOnCreate: z.boolean().optional(),
    // dependentPicklist: z.boolean().optional(),
    // deprecatedAndHidden: z.boolean().optional(),
    // digits: z.number().optional(),
    // displayLocationInDecimal: z.boolean().optional(),
    // encrypted: z.boolean().optional(),
    // externalID: z.boolean().optional(),
    // extraTypeInfo: z.string().optional().nullable(),
    // filterable: z.boolean().optional(),
    // filteredLookupInfo: z.null().optional(),
    // groupable: z.boolean().optional(),
    // highScaleNumber: z.boolean().optional(),
    // htmlFormatted: z.boolean().optional(),
    // idLookup: z.boolean().optional(),
    inlineHelpText: z.string().optional().nullable(), // add
    label: z.string().optional(), // add
    length: z.number().optional(), // add
    // mask: z.null().optional(),
    // maskType: z.null().optional(),
    name: z.string().optional(), // add
    // nameField: z.boolean().optional(),
    // namePointing: z.boolean().optional(),
    nillable: z.boolean().optional(), //add
    // permissionable: z.boolean().optional(),
    // picklistValues: z.array(picklistValueSchema).optional(),
    // polymorphicForeignKey: z.boolean().optional(),
    precision: z.number().optional(), //add
    // queryByDistance: z.boolean().optional(),
    // referenceTargetField: z.null().optional(),
    referenceTo: z.array(z.string()).optional(), // add
    // relationshipName: z.string().optional().nullable(),
    // relationshipOrder: z.null().optional(),
    // restrictedDelete: z.boolean().optional(),
    restrictedPicklist: z.boolean().optional(), // add
    scale: z.number().optional(), //add
    // searchPrefilterable: z.boolean().optional(),
    // sortable: z.boolean().optional(),
    type: z.string().optional(), // add
    // unique: z.boolean().optional(),
    // updateable: z.boolean().optional(),
    // writeRequiresMasterRead: z.boolean().optional(),
    fieldDescription: z.string().optional(),
});

// export const recordTypeInfoSchema = z.object({
//     active: z.boolean().optional(),
//     available: z.boolean().optional(),
//     defaultRecordTypeMapping: z.boolean().optional(),
//     master: z.boolean().optional(),
//     name: z.string().optional(),
//     recordTypeID: z.string().optional(),
//     urls: recordTypeInfoUrlsSchema.optional(),
// });

export const sObjectDescribeSchema = z.object({
    // actionOverrides: z.array(z.any()).optional(),
    // activateable: z.boolean().optional(),
    // compactLayoutable: z.boolean().optional(),
    // createable: z.boolean().optional(),
    // custom: z.boolean().optional(),
    // customSetting: z.boolean().optional(),
    // deletable: z.boolean().optional(),
    // deprecatedAndHidden: z.boolean().optional(),
    // feedEnabled: z.boolean().optional(),
    fields: z.array(describeFieldSchema).optional(),
    // hasSubtypes: z.boolean().optional(),
    // isSubtype: z.boolean().optional(),
    // keyPrefix: z.string().optional(),
    label: z.string().optional(),
    labelPlural: z.string().optional(),
    // layoutable: z.boolean().optional(),
    // listviewable: z.null().optional(),
    // lookupLayoutable: z.null().optional(),
    // mergeable: z.boolean().optional(),
    // mruEnabled: z.boolean().optional(),
    name: z.string().optional(),
    // namedLayoutInfos: z.array(z.any()).optional(),
    // networkScopeFieldName: z.null().optional(),
    // queryable: z.boolean().optional(),
    // recordTypeInfos: z.array(recordTypeInfoSchema).optional(),
    // replicateable: z.boolean().optional(),
    // retrieveable: z.boolean().optional(),
    // searchLayoutable: z.boolean().optional(),
    // searchable: z.boolean().optional(),
    // sobjectDescribeOption: z.string().optional(),
    // supportedScopes: z.array(supportedScopeSchema).optional(),
    // triggerable: z.boolean().optional(),
    // undeletable: z.boolean().optional(),
    // updateable: z.boolean().optional(),
});
