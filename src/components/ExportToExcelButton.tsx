import { SObjectDescribeMapProps } from "../types/schema-common";
import { Button } from "flowbite-react";
import React from "react";
import XLSX from "xlsx";

const ExportToExcelButton = ({
    sObjectsWithDetailsData,
}: {
    sObjectsWithDetailsData: SObjectDescribeMapProps;
}) => {
    /**
     * Handle the export to Excel.
     */
    const exportToCSV = () => {
        const workbook = XLSX.utils.book_new();
        Object.keys(sObjectsWithDetailsData).forEach((key) => {
            if (!sObjectsWithDetailsData[key]) return;
            const worksheet = XLSX.utils.json_to_sheet(
                sObjectsWithDetailsData[key] ?? []
            );
            XLSX.utils.book_append_sheet(workbook, worksheet, key);
        });
        XLSX.writeFile(workbook, "MySalesforceDictionary.xlsx", {
            compression: true,
        });
    };

    return (
        <div className="flex flex-wrap justify-end">
            <div>
                <Button gradientDuoTone="greenToBlue" onClick={exportToCSV}>
                    Export
                </Button>
            </div>
        </div>
    );
};

export default ExportToExcelButton;
