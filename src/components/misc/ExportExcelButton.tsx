import { SObjectDescribeFieldsWithKeyDTO } from "@schema/sobject-describe";
import { Button } from "flowbite-react";
import React from "react";
import * as excelJS from "exceljs";
import { saveAs } from "file-saver";

const ExportExcelButton = ({
    sObjectsWithDetailsData,
}: {
    sObjectsWithDetailsData: SObjectDescribeFieldsWithKeyDTO;
}) => {
    const exportToCSV = () => {
        const workbook = new excelJS.Workbook();
        // Optional
        workbook.creator = "test";
        workbook.lastModifiedBy = "test";
        workbook.created = new Date();
        workbook.modified = new Date();

        // Iterate SObjects.
        Object.keys(sObjectsWithDetailsData).forEach((key) => {
            if (!sObjectsWithDetailsData[key]) return;
            const ws = workbook.addWorksheet(key);

            // Set Header of the Table.
            ws.getRow(1).values = [
                "API Name".toUpperCase(),
                "Label".toUpperCase(),
                "Description".toUpperCase(),
                "HelpText".toUpperCase(),
                "Read Only".toUpperCase(),
                "Mandatory".toUpperCase(),
                "Is Custom".toUpperCase(),
                "Is External ID".toUpperCase(),
                "Type".toUpperCase(),
                "Formula Text".toUpperCase(),
                "Picklist Values".toUpperCase(),
            ];

            // Filter Object Fields that only need for rows.
            const rows = sObjectsWithDetailsData[key]?.map((row) => ({
                label: row.label ?? "",
                name: row.name ?? "",
                fieldDescription: row.fieldDescription ?? "",
                inlineHelpText: row.inlineHelpText ?? "",
                updateable: row.updateable ?? false,
                nillable: !row.nillable ?? false,
                custom: row.custom ?? false,
                externalId: row.externalId ?? false,
                type: row.type ?? "",
                calculatedFormula: row.calculatedFormula ?? "",
                picklistValues:
                    row.picklistValues
                        ?.map((picklist) => picklist.label)
                        .join(",\n") ?? "",
            }));

            // Set Columns Width.
            ws.columns = [
                {
                    key: "label",
                    width: rows?.reduce(
                        (w, r) => Math.max(w, r.label.length),
                        10
                    ),
                },
                {
                    key: "name",
                    width: rows?.reduce(
                        (w, r) => Math.max(w, r.name.length),
                        10
                    ),
                },
                {
                    key: "fieldDescription",
                    width: rows?.reduce(
                        (w, r) => Math.max(w, r.fieldDescription.length),
                        12
                    ),
                },
                {
                    key: "inlineHelpText",
                    width: rows?.reduce(
                        (w, r) => Math.max(w, r.inlineHelpText.length),
                        10
                    ),
                },
                { key: "updateable", width: 16 },
                { key: "nillable", width: 16 },
                { key: "custom", width: 16 },
                { key: "externalId", width: 16 },
                {
                    key: "type",
                    width: rows?.reduce(
                        (w, r) => Math.max(w, r.type.length),
                        10
                    ),
                },
                {
                    key: "calculatedFormula",
                    width: rows?.reduce(
                        (w, r) => Math.max(w, r.calculatedFormula.length),
                        14
                    ),
                },
                {
                    key: "picklistValues",
                    width: Math.max(
                        ...(rows?.map((row) =>
                            row.picklistValues
                                .split(",\n")
                                .reduce((w, r) => Math.max(w, r.length), 17)
                        ) ?? [])
                    ),
                },
            ];

            // Add Row to the Worksheet.
            ws.addRows(rows ?? []);

            // Get the first row to set as the base.
            const row = ws.getRow(1);

            const HEADER_ROW = 1;
            const LABEL_COL = 1;
            const TYPE_COL = 9;
            const READ_ONLY_COL = 5;
            const MANDATORY_COL = 6;
            const IS_CUSTOM_COL = 7;
            const IS_EXTERNAL_ID_COL = 8;
            row.eachCell((cell, rowNumber) => {
                // iterate over all current cells in this column including empty cells
                const dobCol = ws.getColumn(rowNumber);

                // Style for Global Cell
                dobCol.eachCell(
                    { includeEmpty: false },
                    (cell, rowPerCellNumber) => {
                        cell.border = {
                            top: { style: "thin", color: { argb: "9ca3af" } },
                            left: { style: "thin", color: { argb: "9ca3af" } },
                            bottom: {
                                style: "thin",
                                color: { argb: "9ca3af" },
                            },
                            right: { style: "thin", color: { argb: "9ca3af" } },
                        };
                        cell.font = {
                            size: 12,
                            name: "Calibri",
                            scheme: "minor",
                        };
                        cell.alignment = {
                            vertical: "middle",
                            horizontal: "left",
                        };

                        // Set Row Height of the Cell
                        ws.getRow(rowPerCellNumber).height =
                            rowPerCellNumber > HEADER_ROW ? 17.25 : 22.25;

                        // Stipe Fill Row
                        if (rowPerCellNumber % 2) {
                            cell.fill = {
                                type: "pattern",
                                pattern: "solid",
                                fgColor: { argb: "f3f4f6" },
                            };
                        }

                        // Header Style
                        if (rowPerCellNumber === HEADER_ROW) {
                            cell.fill = {
                                type: "pattern",
                                pattern: "solid",
                                fgColor: { argb: "0365f3" },
                            };
                            cell.font["bold"] = true;
                            cell.font["color"] = { argb: "FFFFFF" };

                            cell.border = {
                                top: {
                                    style: "thin",
                                    color: { argb: "0365f3" },
                                },
                                left: {
                                    style: "thin",
                                    color: { argb: "0365f3" },
                                },
                                bottom: {
                                    style: "thin",
                                    color: { argb: "0365f3" },
                                },
                                right: {
                                    style: "thin",
                                    color: { argb: "0365f3" },
                                },
                            };
                        }
                    }
                );

                // Style for Ready Only, Mandatory, Is_Custom and Is_External_Id Cell
                if (
                    rowNumber === READ_ONLY_COL ||
                    rowNumber === MANDATORY_COL ||
                    rowNumber === IS_CUSTOM_COL ||
                    rowNumber === IS_EXTERNAL_ID_COL
                ) {
                    dobCol.eachCell(
                        { includeEmpty: false },
                        (cell, booleanRowNumber) => {
                            if (booleanRowNumber > HEADER_ROW) {
                                if (cell.value === true) {
                                    cell.fill = {
                                        type: "pattern",
                                        pattern: "solid",
                                        fgColor: { argb: "bbf7d0" },
                                    };
                                    cell.font["color"] = { argb: "15803d" };
                                } else {
                                    cell.fill = {
                                        type: "pattern",
                                        pattern: "solid",
                                        fgColor: { argb: "fed7aa" },
                                    };
                                    cell.font["color"] = { argb: "c2410c" };
                                }
                            }
                        }
                    );
                }

                // Style for Type Cell
                if (rowNumber === TYPE_COL) {
                    dobCol.eachCell(
                        { includeEmpty: false },
                        (cell, typeRowNumber) => {
                            if (typeRowNumber > HEADER_ROW)
                                cell.font["italic"] = true;
                        }
                    );
                }

                // Style for Label Cell
                if (rowNumber === LABEL_COL) {
                    dobCol.eachCell(
                        { includeEmpty: false },
                        (cell, labelRowNumer) => {
                            if (labelRowNumer > 1) cell.font["bold"] = true;
                        }
                    );
                }
            });
        });

        // Saving working in excel.
        workbook.xlsx.writeBuffer().then(function (buffer) {
            const blob = new Blob([buffer], { type: "applicationi/xlsx" });
            saveAs(blob, "SF_DATA_DICTIONARY.xlsx");
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

export default ExportExcelButton;
