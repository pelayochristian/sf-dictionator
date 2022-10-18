import { Button, Table } from "flowbite-react";
import React, { useState } from "react";
import { SObjectDescribeMapProps } from "../types/schema-common";
import ExportToExcelButton from "./ExportToExcelButton";

const SObjectTable = ({
    sObjectsWithDetailsData,
}: {
    sObjectsWithDetailsData: SObjectDescribeMapProps;
}) => {
    const [sObjectNameState, setSObjectNameState] = useState("");

    /**
     * Method to get the default sObject name wether from
     * state or the first item key of the sObjectsWithDetails.
     */
    const defaultSObjectName = !sObjectNameState
        ? Object.keys(sObjectsWithDetailsData)[0] ?? ""
        : sObjectNameState;

    /**
     * Get the table data and construct the table body
     */
    const getTableRows = sObjectsWithDetailsData[defaultSObjectName]?.map(
        (field, index) => {
            return (
                <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                >
                    <Table.Cell className="!p-4">
                        {field.updateable ? "✓" : "☐"}
                    </Table.Cell>
                    <Table.Cell className="text-red-600">
                        {!field.nillable &&
                        field.updateable &&
                        field.type !== "boolean"
                            ? "*"
                            : ""}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {field.label}
                    </Table.Cell>
                    <Table.Cell>{field.fieldDescription}</Table.Cell>
                    <Table.Cell>{field.inlineHelpText}</Table.Cell>
                    <Table.Cell>{field.name}</Table.Cell>
                    <Table.Cell>{field.type}</Table.Cell>
                    <Table.Cell>
                        <a
                            href="/tables"
                            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                        >
                            Edit
                        </a>
                    </Table.Cell>
                </Table.Row>
            );
        }
    );

    /**
     * Construct Tabs for SObject that is being selected.
     * @returns
     */
    const getSObjectButtonTabs = () => {
        return (
            <>
                {Object.keys(sObjectsWithDetailsData).map((item, index) => {
                    if (sObjectNameState === item) {
                        return (
                            <li className="mr-2" key={index}>
                                <button
                                    className="active inline-block rounded-t-md bg-gray-100 p-4 text-blue-600 dark:bg-gray-800 dark:text-blue-500"
                                    onClick={updateSObjectDataViaTab}
                                    data-sobject={item}
                                >
                                    {item}
                                </button>
                            </li>
                        );
                    } else {
                        return (
                            <li className="mr-2" key={index}>
                                <button
                                    className="inline-block rounded-t-md p-4 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                                    onClick={updateSObjectDataViaTab}
                                    data-sobject={item}
                                >
                                    {item}
                                </button>
                            </li>
                        );
                    }
                })}
            </>
        );
    };

    /**
     * Method to update table SObject data when clicking
     * the SObject tabs.
     * @param e
     * @returns
     */
    const updateSObjectDataViaTab = (e: React.MouseEvent) => {
        const sObjectName = (e.target as HTMLButtonElement).getAttribute(
            "data-sobject"
        );
        if (!sObjectName) return;
        setSObjectNameState(sObjectName);
    };

    return (
        <section className="container mx-auto mt-20  mb-20 items-center justify-between">
            {Object.keys(sObjectsWithDetailsData).length === 0 ? (
                <div className="shadow-md dark:bg-gray-800 p-14 rounded-md">
                    <p>No data Available.</p>
                </div>
            ) : (
                <div>
                    {/* Export Button */}
                    <ExportToExcelButton
                        sObjectsWithDetailsData={sObjectsWithDetailsData}
                    />

                    {/* SObject Tabs */}
                    <div className="overflow-x-auto">
                        <ul className="flex border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
                            {getSObjectButtonTabs()}
                        </ul>
                    </div>

                    {/* SObject Fields Table */}
                    <div className="relative h-[36rem] overflow-x-auto shadow-md dark:bg-gray-800">
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
                                {getTableRows}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SObjectTable;
