import { Checkbox, Table } from 'flowbite-react';
import React, { useState } from 'react';

const SObjectTable = ({ sObjectsWithDetails }) => {
    const [sObjectNameState, setSObjectNameState] = useState('');

    /**
     * Get the table data and construct the table body
     */
    const getRowItem = (sObjectName = '') => {
        let sObject = getDefaultSObjectName(sObjectName);
        return (
            <>
                {sObjectsWithDetails[sObject]?.map((element, index) => {
                    const isReadOnly = element.updateable ? '✓' : '☐';
                    const isMandatory =
                        !element.nillable &&
                        element.updateable &&
                        element.type !== 'boolean'
                            ? '*'
                            : '';
                    const description =
                        element.description != null ? element.description : '';
                    const helpText =
                        element.inlineHelpText != null
                            ? element.inlineHelpText
                            : '';
                    return (
                        <Table.Row
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                            key={index}>
                            <Table.Cell className="!p-4">
                                {isReadOnly}
                            </Table.Cell>
                            <Table.Cell>{isMandatory}</Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {element.label}
                            </Table.Cell>
                            <Table.Cell>{description}</Table.Cell>
                            <Table.Cell>{helpText}</Table.Cell>
                            <Table.Cell>{element.name}</Table.Cell>
                            <Table.Cell>{element.type}</Table.Cell>
                            <Table.Cell>
                                <a
                                    href="/tables"
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                                    Edit
                                </a>
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </>
        );
    };

    /**
     * Method to get the default sObject name wether from
     * state or the first item key of the sObjectsWithDetails.
     * @param sObjectName
     * @returns
     */
    const getDefaultSObjectName = (sObjectName) => {
        const sObject =
            sObjectName === '' && !sObjectNameState
                ? Object.keys(sObjectsWithDetails)[0]
                : sObjectNameState;
        return sObject;
    };

    /**
     * Method to update table SObject data when clicking
     * the SObject tabs.
     * @param e
     */
    const updateSObjectDataViaTab = (e) => {
        let sObjectName =
            e.currentTarget.attributes.getNamedItem('data-sobject').value;
        setSObjectNameState(sObjectName);
    };

    /**
     * Construct Tabs for SObject that is being selected.
     * @returns
     */
    const getSObjectButtonTabs = () => {
        return (
            <>
                {Object.keys(sObjectsWithDetails).map((item, index) => {
                    if (sObjectNameState === '') {
                        setSObjectNameState(
                            Object.keys(sObjectsWithDetails)[0]
                        );
                    }

                    if (sObjectNameState === item) {
                        return (
                            <li className="mr-2" key={index}>
                                <button
                                    className="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
                                    onClick={updateSObjectDataViaTab}
                                    data-sobject={item}>
                                    {item}
                                </button>
                            </li>
                        );
                    } else {
                        return (
                            <li className="mr-2" key={index}>
                                <button
                                    className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                                    onClick={updateSObjectDataViaTab}
                                    data-sobject={item}>
                                    {item}
                                </button>
                            </li>
                        );
                    }
                })}
            </>
        );
    };

    return (
        <>
            <section className="mt-20 container  justify-between items-center mx-auto">
                {/* SObject Tabs */}
                <div className="overflow-x-auto">
                    <ul className="flex text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                        {getSObjectButtonTabs()}
                    </ul>
                </div>

                <div className="overflow-x-auto relative shadow-md h-[36rem] dark:bg-gray-800">
                    <Table hoverable={true}>
                        <Table.Head>
                            <Table.HeadCell className="!p-4">
                                R/O
                            </Table.HeadCell>
                            <Table.HeadCell>M</Table.HeadCell>
                            <Table.HeadCell>Name</Table.HeadCell>
                            <Table.HeadCell>Description</Table.HeadCell>
                            <Table.HeadCell>Helptext</Table.HeadCell>
                            <Table.HeadCell>API Name</Table.HeadCell>
                            <Table.HeadCell>Type</Table.HeadCell>
                            <Table.HeadCell>Value/Formula</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {getRowItem()}
                        </Table.Body>
                    </Table>
                </div>
            </section>
        </>
    );
};

export default SObjectTable;
