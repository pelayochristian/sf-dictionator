import { SObjectDescribeMapProps } from "../types/schema-common";
import { Button } from "flowbite-react";
import React from "react";
// import XLSX from "xlsx";
import XLSX from "sheetjs-style";

const ExportToExcelButton = ({
    sObjectsWithDetailsData,
}: {
    sObjectsWithDetailsData: SObjectDescribeMapProps;
}) => {
    /**
     * Handle the export to Excel.
     */
    const exportToCSV = () => {
        // Initialize new Book
        const workbook = XLSX.utils.book_new();

        // Iterate SObject and create new sheet per SObject.
        Object.keys(sObjectsWithDetailsData).forEach((key) => {
            if (!sObjectsWithDetailsData[key]) return;

            const worksheet = XLSX.utils.json_to_sheet(
                sObjectsWithDetailsData[key] ?? []
            );

            worksheet["A1"].s = {
                fill: {
                    patternType: "solid",
                },
            };
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
