import { SObjectDescribeFieldsWithKeyDTO } from "@schema/sobject-describe";
import { Button } from "flowbite-react";
import React from "react";
import { utils, WorkSheet, writeFile, write } from "xlsx-js-style";
import * as FileSaver from "file-saver";

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
        const wb = utils.book_new();

        // Iterate SObject and create new sheet per SObject.
        Object.keys(sObjectsWithDetailsData).forEach((key) => {
            if (!sObjectsWithDetailsData[key]) return;

            // Filter Rows Data
            const rows = sObjectsWithDetailsData[key]?.map((row) => ({
                "R/O": row.updateable ? "✓" : "☐",
                R: !row.nillable ? "*" : "",
                label: row.label ?? "",
                name: row.name ?? "",
                fieldDescription: row.fieldDescription ?? "",
                inlineHelpText: row.inlineHelpText ?? "",
                custom: row.custom ?? false,
                externalId: row.externalId ?? false,
                type: row.type ?? "",
                calculatedFormula: row.calculatedFormula ?? "",
                picklistValues:
                    row.picklistValues
                        ?.map((picklist) => picklist.label)
                        .join("\n") ?? "",
            }));

            const ws = utils.json_to_sheet(rows ?? []);

            // Modify Header Names
            utils.sheet_add_aoa(
                ws,
                [
                    [
                        "R/O",
                        "M",
                        "Label",
                        "API Name",
                        "Description",
                        "HelpText",
                        "Is Custom",
                        "Is External ID",
                        "Type",
                        "Formula Text",
                        "Picklist Values",
                    ],
                ],
                {
                    origin: "A1",
                }
            );

            // Add Custom Styling
            setCustomStyling(ws);

            // Width Configuration for each Fields
            const readOnlyMaxWidth = rows?.reduce(
                (w, r) => Math.max(w, r["R/O"].length),
                4
            );
            const requiredMaxWidth = rows?.reduce(
                (w, r) => Math.max(w, r.R.length),
                2
            );
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
                12
            );
            const helptextMaxWidth = rows?.reduce(
                (w, r) => Math.max(w, r.inlineHelpText.length),
                10
            );
            const isCustomMaxWidth = 11;
            const isExternalMaxWidth = 16;
            const typeMaxWidth = rows?.reduce(
                (w, r) => Math.max(w, r.type.length),
                10
            );
            const formulaMaxWidth = rows?.reduce(
                (w, r) => Math.max(w, r.calculatedFormula.length),
                14
            );
            const picklistMaxWidth = Math.max(
                ...(rows?.map((row) =>
                    row.picklistValues
                        .split("\n")
                        .reduce((w, r) => Math.max(w, r.length), 17)
                ) ?? [])
            );

            // Set the Max Width for each field
            ws["!cols"] = [
                { wch: readOnlyMaxWidth },
                { wch: requiredMaxWidth },
                { wch: nameMaxWidth },
                { wch: labelMaxWidth },
                { wch: descriptionMaxWidth },
                { wch: helptextMaxWidth },
                { wch: isCustomMaxWidth },
                { wch: isExternalMaxWidth },
                { wch: typeMaxWidth },
                { wch: formulaMaxWidth },
                { wch: picklistMaxWidth },
            ];

            utils.book_append_sheet(wb, ws, key);
        });

        // Execute export
        writeFile(wb, "MySalesforceDictionary.xlsx");
    };

    /**
     * Add Custom Styling
     * @param ws WorkSheet
     */
    const setCustomStyling = (ws: WorkSheet) => {
        const HEADER_ROW = 0;
        const READ_ONLY_COL = 0;
        const REQUIRED_COL = 1;
        const LABEL_COL = 2;
        const TYPE_COL = 8;
        for (const i in ws) {
            if (typeof ws[i] != "object") continue;
            const cell = utils.decode_cell(i);

            // Global Cell Styling
            ws[i].s = {
                font: {
                    sz: 12,
                    name: "Calibri",
                },
                alignment: {
                    wrapText: "1",
                },
            };

            // Header Column Styling
            if (cell.r === HEADER_ROW) {
                ws[i].s = {
                    fill: {
                        fgColor: { rgb: "0365f3" },
                    },
                    font: {
                        sz: 12,
                        bold: true,
                        color: { rgb: "FFFFFF" },
                    },
                };
            }

            // Header Column Not Include Styling
            if (cell.r != HEADER_ROW) {
                // Read Only Column Styling
                if (cell.c === READ_ONLY_COL) {
                    ws[i].s = {
                        font: {
                            sz: 12,
                        },
                        alignment: {
                            vertical: "center",
                            horizontal: "center",
                            wrapText: "1",
                        },
                    };
                }

                // Required Column Styling
                if (cell.c === REQUIRED_COL) {
                    ws[i].s = {
                        font: {
                            sz: 12,
                            bold: true,
                            color: { rgb: "dc2626" },
                        },
                        alignment: {
                            vertical: "center",
                            horizontal: "center",
                            wrapText: "1",
                        },
                    };
                }

                // Label Column Styling
                if (cell.c === LABEL_COL) {
                    ws[i].s = {
                        font: {
                            sz: 12,
                            bold: true,
                        },
                    };
                }

                // Type Column Styling
                if (cell.c === TYPE_COL) {
                    ws[i].s = {
                        font: {
                            sz: 12,
                            name: "Calibri",
                            italic: true,
                        },
                    };
                }
            }

            // Every other row Styling
            if (cell.r % 2) {
                ws[i].s.fill = {
                    patternType: "solid",
                    fgColor: { rgb: "f2f1f3" },
                    bgColor: { rgb: "f2f1f3" },
                };
            }

            ws[i].s.border = {
                right: {
                    style: "thin",
                    color: { rgb: "d1d5db" },
                },
                left: {
                    style: "thin",
                    color: { rgb: "d1d5db" },
                },
                top: {
                    style: "thin",
                    color: { rgb: "d1d5db" },
                },
                bottom: {
                    style: "thin",
                    color: { rgb: "d1d5db" },
                },
            };
        }
    };

    const testExport = () => {
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";

        const apiData = [
            {
                firstName: "Christian1",
                lastName: "Pelayo1",
            },
            {
                firstName: "Christian2",
                lastName: "Pelayo2",
            },
        ];
        const ws = utils.json_to_sheet(apiData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, "testSheet" + fileExtension);
    };

    return (
        <div className="flex flex-wrap justify-end">
            <div>
                <Button gradientDuoTone="greenToBlue" onClick={testExport}>
                    Test
                </Button>
                <Button gradientDuoTone="greenToBlue" onClick={exportToCSV}>
                    Export
                </Button>
            </div>
        </div>
    );
};

export default ExportToExcelButton;
