// SObject Metadata
declare module "sobject-metadata" {

    interface SObjectMetadata {
        fullName?: string;
        enableFeeds?: string;
        externalSharingModel?: string;
        fields?: Field[];
        label?: string;
        sharingModel?: string;
    }

    interface Field {
        fullName?: string;
        type?: string;
    }


}

// SObject Describe
declare module 'sobject-describe' {

    export interface SObjectDescribe {
        actionOverrides?: any[];
        activateable?: boolean;
        childRelationships?: ChildRelationship[];
        compactLayoutable?: boolean;
        createable?: boolean;
        custom?: boolean;
        customSetting?: boolean;
        deletable?: boolean;
        deprecatedAndHidden?: boolean;
        feedEnabled?: boolean;
        fields?: Field[];
        hasSubtypes?: boolean;
        isSubtype?: boolean;
        keyPrefix?: string;
        label?: string;
        labelPlural?: string;
        layoutable?: boolean;
        listviewable?: null;
        lookupLayoutable?: null;
        mergeable?: boolean;
        mruEnabled?: boolean;
        name?: string;
        namedLayoutInfos?: any[];
        networkScopeFieldName?: null;
        queryable?: boolean;
        recordTypeInfos?: RecordTypeInfo[];
        replicateable?: boolean;
        retrieveable?: boolean;
        searchLayoutable?: boolean;
        searchable?: boolean;
        sobjectDescribeOption?: string;
        supportedScopes?: SupportedScope[];
        triggerable?: boolean;
        undeletable?: boolean;
        updateable?: boolean;
        urls?: WelcomeUrls;
    }

    export interface ChildRelationship {
        cascadeDelete?: boolean;
        childSObject?: string;
        deprecatedAndHidden?: boolean;
        field?: string;
        junctionIDListNames?: any[];
        junctionReferenceTo?: any[];
        relationshipName?: null | string;
        restrictedDelete?: boolean;
    }

    export interface Field {
        aggregatable?: boolean;
        autoNumber?: boolean;
        byteLength?: number;
        calculated?: boolean;
        calculatedFormula?: null;
        cascadeDelete?: boolean;
        caseSensitive?: boolean;
        compoundFieldName?: CompoundFieldName | null;
        controllerName?: null;
        createable?: boolean;
        custom?: boolean;
        defaultValue?: DefaultValue;
        defaultValueFormula?: null | string;
        defaultedOnCreate?: boolean;
        dependentPicklist?: boolean;
        deprecatedAndHidden?: boolean;
        digits?: number;
        displayLocationInDecimal?: boolean;
        encrypted?: boolean;
        externalID?: boolean;
        extraTypeInfo?: null | string;
        filterable?: boolean;
        filteredLookupInfo?: null;
        groupable?: boolean;
        highScaleNumber?: boolean;
        htmlFormatted?: boolean;
        idLookup?: boolean;
        inlineHelpText?: null | string;
        label?: string;
        length?: number;
        mask?: null;
        maskType?: null;
        name?: string;
        nameField?: boolean;
        namePointing?: boolean;
        nillable?: boolean;
        permissionable?: boolean;
        picklistValues?: PicklistValue[];
        polymorphicForeignKey?: boolean;
        precision?: number;
        queryByDistance?: boolean;
        referenceTargetField?: null;
        referenceTo?: string[];
        relationshipName?: null | string;
        relationshipOrder?: null;
        restrictedDelete?: boolean;
        restrictedPicklist?: boolean;
        scale?: number;
        searchPrefilterable?: boolean;
        soapType?: SoapType;
        sortable?: boolean;
        type?: string;
        unique?: boolean;
        updateable?: boolean;
        writeRequiresMasterRead?: boolean;
    }

    export enum CompoundFieldName {
        BillingAddress = "BillingAddress",
        Name = "Name",
        ShippingAddress = "ShippingAddress",
    }

    export type DefaultValue = boolean | null | string;

    export interface PicklistValue {
        active?: boolean;
        defaultValue?: boolean;
        label?: string;
        validFor?: null;
        value?: string;
    }

    export enum SoapType {
        TnsID = "tns:ID",
        UrnAddress = "urn:address",
        XSDBoolean = "xsd:boolean",
        XSDDate = "xsd:date",
        XSDDateTime = "xsd:dateTime",
        XSDDouble = "xsd:double",
        XSDInt = "xsd:int",
        XSDString = "xsd:string",
    }

    export interface RecordTypeInfo {
        active?: boolean;
        available?: boolean;
        defaultRecordTypeMapping?: boolean;
        master?: boolean;
        name?: string;
        recordTypeID?: string;
        urls?: RecordTypeInfoUrls;
    }

    export interface RecordTypeInfoUrls {
        layout?: string;
    }

    export interface SupportedScope {
        label?: string;
        name?: string;
    }

    export interface WelcomeUrls {
        compactLayouts?: string;
        rowTemplate?: string;
        approvalLayouts?: string;
        uiDetailTemplate?: string;
        uiEditTemplate?: string;
        listviews?: string;
        describe?: string;
        uiNewRecord?: string;
        quickActions?: string;
        layouts?: string;
        sobject?: string;
    }
}

declare module 'describe-object-wrapper' {
    interface DescribeObjectWrapper {
        name?: string
        fields?: object
    }
}