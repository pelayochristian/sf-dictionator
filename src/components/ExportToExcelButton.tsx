import { SObjectDescribeFieldsWithKeyDTO } from "@schema/sobject-describe";
import { Button } from "flowbite-react";
import React from "react";
import XLSX from "xlsx-js-style";

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
            const worksheet = XLSX.utils.json_to_sheet(
                sObjectsWithDetailsData[key] ?? []
            );
            XLSX.utils.book_append_sheet(workbook, worksheet, key);
        });

        // Execute export
        XLSX.writeFile(workbook, "MySalesforceDictionary.xlsx", {
            compression: true,
        });
    };

    const setCustomStyling = (worksheet: XLSX.WorkSheet) => {
        const HEADER_ROW = 0;
        const READ_ONLY_COL = 0;
        const REQUIRED_COL = 1;
        const LABEL_COL = 2;
        const TYPE_COL = 8;
        for (const i in worksheet) {
            if (typeof worksheet[i] != "object") continue;
            const cell = XLSX.utils.decode_cell(i);

            // Global Cell Styling
            worksheet[i].s = {
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
                worksheet[i].s = {
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
                    worksheet[i].s = {
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
                    worksheet[i].s = {
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
                    worksheet[i].s = {
                        font: {
                            sz: 12,
                            bold: true,
                        },
                    };
                }

                // Type Column Styling
                if (cell.c === TYPE_COL) {
                    worksheet[i].s = {
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
                worksheet[i].s.fill = {
                    patternType: "solid",
                    fgColor: { rgb: "f2f1f3" },
                    bgColor: { rgb: "f2f1f3" },
                };
            }

            worksheet[i].s.border = {
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
