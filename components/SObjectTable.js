import React, { useState } from 'react';

const SObjectTable = ({ sObjectsWithDetails }) => {
    const [sObjectNameState, setSObjectNameState] = useState('');

    /**
     * Get the table data and construct the table body
     */
    const getRowItem = (sObjectName) => {
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
                        <tr
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            key={index}>
                            <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {isReadOnly}
                            </td>
                            <td className="py-4 px-6">{isMandatory}</td>
                            <th
                                scope="row"
                                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {element.label}
                            </th>
                            <td className="py-4 px-6">{description}</td>
                            <td className="py-4 px-6">{helpText}</td>
                            <td className="py-4 px-6">{element.name}</td>
                            <td className="py-4 px-6">{element.type}</td>
                            <td className="py-4 px-6">
                                <a
                                    href="/"
                                    className="font-medium text-blue-600 hover:underline">
                                    Edit
                                </a>
                            </td>
                        </tr>
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
            <div className="mt-20 container  justify-between items-center mx-auto">
                {/* SObject Tabs */}
                <div className="overflow-x-auto">
                    <ul className="flex text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                        {getSObjectButtonTabs()}
                    </ul>
                </div>

                <div className="overflow-x-auto relative shadow-md h-[36rem] dark:bg-gray-800">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">
                                    R/O
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    M
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Name
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Description
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Helptext
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    API Name
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Type
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Value / Formula
                                </th>
                            </tr>
                        </thead>
                        <tbody>{getRowItem('')}</tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default SObjectTable;
