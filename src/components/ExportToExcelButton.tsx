import { SObjectDescribeFieldsWithKeyDTO } from "@schema/sobject-describe";
import { Button } from "flowbite-react";
import React from "react";
import XLSX from "sheetjs-style";

const ExportToExcelButton = ({
    sObjectsWithDetailsData,
}: {
    sObjectsWithDetailsData: SObjectDescribeFieldsWithKeyDTO;
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

            // Filter Rows Data
            const rows = sObjectsWithDetailsData[key]?.map((row) => ({
                label: row.label ?? "",
                name: row.name ?? "",
                fieldDescription: row.fieldDescription ?? "",
                inlineHelpText: row.inlineHelpText ?? "",
                type: row.type ?? "",
                calculatedFormula: row.calculatedFormula ?? "",
                picklistValues:
                    row.picklistValues
                        ?.map((picklist) => picklist.label)
                        .join("\n") ?? "",
            }));

            const worksheet = XLSX.utils.json_to_sheet(rows ?? []);

            // Modify Header Names
            XLSX.utils.sheet_add_aoa(
                worksheet,
                [
                    [
                        "Label",
                        "Name",
                        "Description",
                        "HelpText",
                        "Type",
                        "Formula",
                        "Picklist",
                    ],
                ],
                {
                    origin: "A1",
                }
            );

            worksheet["A1"].s = {
                font: {
                    bold: true,
                },
                fill: {
                    bgColor: { rgb: "FFFFAA00" },
                },
            };

            // Width Configuration for each Fields
            const labelMaxWidth = rows?.reduce(
                (w, r) => Math.max(w, r.label.length),
                10
            );
            const nameMaxWidth = rows?.reduce(
                (w, r) => Math.max(w, r.name.length),
                10
            );
            const descriptionMaxWidth = rows?.reduce(
                (w, r) => Math.max(w, r.fieldDescription.length),
                10
            );
            const helptextMaxWidth = rows?.reduce(
                (w, r) => Math.max(w, r.inlineHelpText.length),
                10
            );
            const typeMaxWidth = rows?.reduce(
                (w, r) => Math.max(w, r.type.length),
                10
            );
            const formulaMaxWidth = rows?.reduce(
                (w, r) => Math.max(w, r.calculatedFormula.length),
                10
            );
            const picklistMaxWidth = Math.max(
                ...(rows?.map((row) =>
                    row.picklistValues
                        .split("\n")
                        .reduce((w, r) => Math.max(w, r.length), 10)
                ) ?? [])
            );

            // Set the Max Width for each field
            worksheet["!cols"] = [
                { wch: nameMaxWidth },
                { wch: labelMaxWidth },
                { wch: descriptionMaxWidth },
                { wch: helptextMaxWidth },
                { wch: typeMaxWidth },
                { wch: formulaMaxWidth },
                { wch: picklistMaxWidth },
            ];

            XLSX.utils.book_append_sheet(workbook, worksheet, key);
        });

        // Execute export
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
