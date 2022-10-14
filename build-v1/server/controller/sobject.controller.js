import { sfdcConnection } from './oauth.controller';

export const SObjectsWithFields = async (request, response, next) => {
    let selectedSObjects = request.body;
    if (!selectedSObjects) {
        return response.status(401).json({ error: 'No SObject Selected' });
    }

    // Get Salesforce Connection
    const conn = await sfdcConnection(request, response, next);
    if (!conn) {
        next(
            new Error('No Salesforce connection found at customizableSObjects.')
        );
    }

    // Read Custom SObject Metadata to use for mapping in
    // the description field.
    let sObjectsReadMetadata = await readSObjectMetadata(
        request,
        response,
        next,
        selectedSObjects
    );

    // Describe every SObject selected.
    let sObjectsDescribe = await Promise.all(
        selectedSObjects.map(async (sObject) => {
            return await describeSObject(request, response, next, sObject);
        })
    );

    // Map the fields from Describe SObject
    let describeObjectMap = {};
    for (const [_key, value] of Object.entries(sObjectsDescribe)) {
        if (value) {
            describeObjectMap[value.name] = value.fields;
        }
    }

    // Map the fields from the ReadMetadataSObject
    let arraySObjectReadMetadata = !Array.isArray(sObjectsReadMetadata)
        ? new Array(sObjectsReadMetadata)
        : sObjectsReadMetadata;
    let readMetadataSObject = {};
    for (const [_key, value] of Object.entries(arraySObjectReadMetadata)) {
        if (value) {
            readMetadataSObject[value.fullName] = fieldsMapper(value.fields);
        }
    }

    // From the Describe SObject Get the description fields from
    // ReadMetadata SObject and then append description to the Describe
    // Object map as new field.
    for (const index of Object.keys(describeObjectMap)) {
        const sObjectField = describeObjectMap[index];
        for (const [_key, value] of Object.entries(sObjectField)) {
            if (readMetadataSObject[index][value.name]?.description) {
                value['description'] =
                    readMetadataSObject[index][value.name]?.description;
            }
            reconstructFieldType(value);
        }
    }

    response.status(200).send(describeObjectMap);
};

/**
 * Util method to reconstruct sobject field type to more
 * readable context.
 * @param {*} value
 */
const reconstructFieldType = (value) => {
    let fieldType = value?.type;
    // Int | Double
    if (fieldType === 'int' || fieldType === 'double') {
        let precision = parseInt(value?.precision);
        let scale = parseInt(value?.scale);
        let finalPrecision = precision - scale;
        value['type'] =
            fieldType === 'int'
                ? `${fieldType}`
                : `${fieldType}(${finalPrecision}, ${value?.scale})`;
    }

    // Picklist
    if (fieldType === 'picklist') {
        value['type'] = value['restrictedPicklist']
            ? `${fieldType}(${value['length']}), (restricted)`
            : `${fieldType}(${value['length']})`;
    }

    // Phone
    if (fieldType === 'phone' || fieldType === 'url') {
        value['type'] = `${fieldType}(${value['length']})`;
    }

    // Reference
    if (fieldType === 'reference' && value['referenceTo'] != null) {
        value['type'] = `reference(${value['referenceTo']})`;
    }

    // Text |  Textarea | String
    if (
        (fieldType == 'text' ||
            fieldType == 'textarea' ||
            fieldType == 'string') &&
        value['length'] != null
    ) {
        value['type'] = `${fieldType}(${value['length']})`;
    }

    // calculatedFormula => Formula
    if (value['calculatedFormula'] != null) {
        value['type'] = `Formula(${value['type']})`;
    }

    // TODO: Check MasterDetail type

    // Check if the field is nillable then append (Unique)
    if (!value?.nillable) {
        value['type'] += ', (unique)';
    }

    // Check if the field is externalId then append (External ID)
    if (value?.externalId) {
        value['type'] += ', (external id)';
    }
};

/**
 * Utility method to read SObject Metadata by passing SObject Array Name.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
const readSObjectMetadata = async (request, response, next, sObjectNames) => {
    // Get Salesforce Connection
    const conn = await sfdcConnection(request, response, next);
    if (!conn) {
        next(
            new Error('No Salesforce connection found at customizableSObjects.')
        );
    }

    if (!sObjectNames) {
        next(new Error('No SObjects selected'));
    }

    return new Promise((resolve, reject) => {
        conn.metadata.read('CustomObject', sObjectNames, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            resolve(metadata);
        });
    });
};

/**
 * Utility method use to retrieve the SObject Details
 * @param {*} request
 * @param {*} response
 * @param {*} any
 * @param {*} sObjectName
 * @returns
 */
const describeSObject = async (request, response, next, sObjectName) => {
    const conn = await sfdcConnection(request, response, next);
    if (!conn) {
        next(
            new Error('No Salesforce connection found at customizableSObjects.')
        );
    }
    return new Promise((resolve, reject) => {
        conn.describe(sObjectName, (err, meta) => {
            if (err) {
                return reject(err);
            }
            resolve(meta);
        });
    });
};

/**
 * Utility Method use to return an Object with unique key
 * based on the specification.
 * @param fields
 * @returns
 */
const fieldsMapper = (fields) => {
    var fieldMap = {};
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        fieldMap[field.fullName] = field;
    }
    return fieldMap;
};

/**
 * Method use to retrieve SObjects that are customizable.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
export const customizableSObjects = async (request, response, next) => {
    const conn = await sfdcConnection(request, response, next);
    if (!conn) {
        next(
            new Error('No Salesforce connection found at customizableSObjects.')
        );
    }
    try {
        let records = [];
        conn.query(
            'SELECT Label, QualifiedApiName ' +
                'FROM EntityDefinition ' +
                'WHERE IsCustomizable = true ' +
                'Order By Label'
        )
            .on('record', function (record) {
                records.push({
                    value: record.QualifiedApiName,
                    label: record.Label,
                });
            })
            .on('end', function () {
                response.status(200).send(records);
            })
            .on('error', function (err) {
                console.error(err);
            })
            .run({ autoFetch: true, maxFetch: 4000 });
    } catch (error) {
        next(error);
    }
};

export const test = async (request, response, next) => {
    let selectedSObjects = ['Opportunity'];

    // Get Salesforce Connection
    const conn = await sfdcConnection(request, response, next);
    if (!conn) {
        next(
            new Error('No Salesforce connection found at customizableSObjects.')
        );
    }

    // Read Custom SObject Metadata to use for mapping in
    // the description field.
    let sObjectsReadMetadata = await readSObjectMetadata(
        request,
        response,
        next,
        selectedSObjects
    );

    // Describe every SObject selected.
    let sObjectsDescribe = await Promise.all(
        selectedSObjects.map(async (sObject) => {
            return await describeSObject(request, response, next, sObject);
        })
    );

    // Map the fields from Describe SObject
    let describeObjectMap = {};
    for (const [_key, value] of Object.entries(sObjectsDescribe)) {
        if (value) {
            describeObjectMap[value.name] = value.fields;
        }
    }

    // Map the fields from the ReadMetadataSObject
    let arraySObjectReadMetadata = !Array.isArray(sObjectsReadMetadata)
        ? new Array(sObjectsReadMetadata)
        : sObjectsReadMetadata;
    let readMetadataSObject = {};
    for (const [_key, value] of Object.entries(arraySObjectReadMetadata)) {
        if (value) {
            readMetadataSObject[value.fullName] = fieldsMapper(value.fields);
        }
    }

    // From the Describe SObject Get the description fields from
    // ReadMetadata SObject and then append description to the Describe
    // Object map as new field.
    for (const index of Object.keys(describeObjectMap)) {
        const sObjectField = describeObjectMap[index];
        for (const [_key, value] of Object.entries(sObjectField)) {
            if (readMetadataSObject[index][value.name]?.description) {
                value['description'] =
                    readMetadataSObject[index][value.name]?.description;
            }
            reconstructFieldType(value);
        }
    }

    response.status(200).send(describeObjectMap);
};
