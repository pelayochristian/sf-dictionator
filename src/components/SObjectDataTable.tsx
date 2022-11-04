import { SObjectDescribeFieldsWithKeyDTO } from "@schema/sobject-describe";
import React, { useState } from "react";
import DataTable, {
    createTheme,
    ExpanderComponentProps,
    TableColumn,
} from "react-data-table-component";
import ExportExcelButton from "./misc/ExportExcelButton";
import FilterComponent from "./misc/FilterComponent";

/**
 * Custom theme Configuration.
 */
createTheme(
    "solarized",
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
    name: string;
    fieldDescription: string;
    inlineHelpText: string;
    updateable: string;
    nillable: string;
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
        selector: (row) => row.name,
        sortable: true,
    },
    {
        name: "Description",
        selector: (row) => row.fieldDescription,
        sortable: true,
    },
    {
        name: "HelpText",
        selector: (row) => row.inlineHelpText,
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
                label: field.label,
                name: field.name,
                fieldDescription: field.fieldDescription,
                inlineHelpText: field.inlineHelpText,
                updateable: field.updateable ? "true" : "false",
                nillable: field.nillable ? "true" : "false",
                type: field.type,
                calculatedFormula: field.calculatedFormula,
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
        return <pre>{JSON.stringify(data, null, 2)}</pre>;
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
     * Append FilterComponent to the Table SubHeader.
     */
    const searchComponent = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText("");
            }
        };

        return (
            <FilterComponent
                onFilter={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFilterText(e.target.value)
                }
                onClear={handleClear}
                filterText={filterText}
            />
        );
    }, [filterText, resetPaginationToggle]);

    return (
        <section className="container mx-auto mt-20  mb-20 items-center justify-between">
            <DataTable
                title={defaultSObjectName}
                columns={columns}
                data={filteredItems ?? []}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                subHeader
                subHeaderComponent={searchComponent}
                actions={exportToExcel}
                pagination
                theme="solarized"
            />
        </section>
    );
};

export default SObjectDataTable;
