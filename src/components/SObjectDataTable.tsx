import { SObjectDescribeFieldsWithKeyDTO } from "@schema/sobject-describe";
import { useTheme } from "flowbite-react";
import React, { useState } from "react";
import DataTable, {
    createTheme,
    ExpanderComponentProps,
    TableColumn,
} from "react-data-table-component";
import ExportExcelButton from "./ExportExcelButton";
import FilterComponent from "./FilterComponent";

/**
 * Custom theme Configuration.
 */
createTheme(
    "custom-dark",
    {
        text: {
            primary: "#fafafa",
            secondary: "#2aa198",
        },
        background: {
            default: "#202a37",
        },
        context: {
            background: "#cb4b16",
            text: "#FFFFFF",
        },
        divider: {
            default: "#374151",
        },
        action: {
            button: "rgba(0,0,0,.54)",
            hover: "rgba(0,0,0,.08)",
            disabled: "rgba(0,0,0,.12)",
        },
    },
    "dark"
);

interface DataRow {
    label: string;
    apiName: string;
    description: string;
    helptext: string;
    readOnly: string;
    mandatory: string;
    type: string;
    calculatedFormula: string;
    picklistValues: string;
}

/**
 * Setup Table Column
 */
const columns: TableColumn<DataRow>[] = [
    {
        name: "Label",
        selector: (row) => row.label,
        sortable: true,
    },
    {
        name: "API Name",
        selector: (row) => row.apiName,
        sortable: true,
    },
    {
        name: "Description",
        selector: (row) => row.description,
        sortable: true,
    },
    {
        name: "HelpText",
        selector: (row) => row.helptext,
        sortable: true,
    },
    {
        name: "Type",
        selector: (row) => row.type,
        sortable: true,
    },
];

const SObjectDataTable = ({
    sObjectsWithDetailsData,
}: {
    sObjectsWithDetailsData: SObjectDescribeFieldsWithKeyDTO;
}) => {
    const [sObjectNameState, setSObjectNameState] = useState("");
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    /**
     * Method to get the default sObject name wether from
     * state or the first item key of the sObjectsWithDetails.
     */
    const defaultSObjectName = !sObjectNameState
        ? Object.keys(sObjectsWithDetailsData)[0] ?? ""
        : sObjectNameState;

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

    /**
     * Get the table data and construct the table body
     */
    const getTableRows = sObjectsWithDetailsData[defaultSObjectName]?.map(
        (field) =>
            ({
                label: field.label ?? "",
                apiName: field.name ?? "",
                description: field.fieldDescription ?? "",
                helptext: field.inlineHelpText ?? "",
                readOnly: field.updateable ? "true" : "false",
                mandatory: field.nillable ? "true" : "false",
                type: field.type,
                calculatedFormula: field.calculatedFormula ?? "",
                picklistValues:
                    field.picklistValues
                        ?.map((picklist) => picklist.label)
                        .join(",") ?? "",
            } as DataRow)
    );

    /**
     * Component use to showcase data access to row data.
     */
    const ExpandedComponent: React.FC<ExpanderComponentProps<DataRow>> = ({
        data,
    }) => {
        return (
            <div className="m-5">
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        );
    };

    /**
     * Used refined or filtered data to expose in the data-table.
     */
    const filteredItems = getTableRows?.filter(
        (item) =>
            item.label &&
            item.label.toLowerCase().includes(filterText.toLowerCase())
    );

    /**
     * Method used to export data to excel.
     */
    const exportToExcel = React.useMemo(
        () => (
            <ExportExcelButton
                sObjectsWithDetailsData={sObjectsWithDetailsData}
            />
        ),
        [sObjectsWithDetailsData]
    );

    /**
     * Construct Tabs for SObject that is being selected.
     */
    const getSObjectButtonTabs = React.useMemo(
        () => (
            <>
                {Object.keys(sObjectsWithDetailsData).map((item, index) => {
                    if (sObjectNameState === item) {
                        return (
                            <li className="mr-2" key={index}>
                                <button
                                    className="active inline-block rounded-t-lg border-b-2 border-blue-600 p-4 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                                    onClick={updateSObjectDataViaTab}
                                    data-sobject={item}
                                >
                                    {item}
                                </button>
                            </li>
                        );
                    } else {
                        return (
                            <li
                                className="mr-2"
                                key={index}
                                onClick={updateSObjectDataViaTab}
                                data-sobject={item}
                            >
                                <button
                                    className="inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
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
        ),
        [sObjectsWithDetailsData, sObjectNameState]
    );

    /**
     * Append FilterComponent to the Table SubHeader.
     */
    const subHeaderComponent = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText("");
            }
        };

        return (
            <>
                {Object.keys(sObjectsWithDetailsData).length === 0 ? (
                    <></>
                ) : (
                    <div className="flex w-full gap-6">
                        <div className="w-full">
                            <div className="mb-5 border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                <ul className="-mb-px flex flex-wrap">
                                    {getSObjectButtonTabs}
                                </ul>
                            </div>
                            <p className="text-lg font-semibold">
                                {sObjectNameState}
                            </p>
                        </div>
                        <div>
                            <div className="float-right">
                                <div className="mb-5">{exportToExcel}</div>
                                <FilterComponent
                                    onFilter={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setFilterText(e.target.value)}
                                    onClear={handleClear}
                                    filterText={filterText}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }, [
        filterText,
        resetPaginationToggle,
        getSObjectButtonTabs,
        exportToExcel,
        sObjectNameState,
        sObjectsWithDetailsData,
    ]);

    return (
        <section className="container mx-auto mt-20  mb-20 items-center justify-between">
            <DataTable
                columns={columns}
                data={filteredItems ?? []}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                subHeader={
                    Object.keys(sObjectsWithDetailsData).length === 0
                        ? false
                        : true
                }
                subHeaderComponent={subHeaderComponent}
                pagination
                theme={useTheme().mode === "dark" ? "custom-dark" : "default"}
            />
        </section>
    );
};

export default SObjectDataTable;
