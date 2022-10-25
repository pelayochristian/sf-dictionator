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

        Object.keys(sObjectsWithDetailsData).forEach((key) => {
            if (!sObjectsWithDetailsData[key]) return;
            const sheet = workbook.addWorksheet(key);
            sheet.getRow(1).values = [
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
            ];

            const rows = sObjectsWithDetailsData[key]?.map((row) => ({
                "R/O": row.updateable ? "✓" : "☐",
                M: !row.nillable ? "*" : "",
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
                        .join(",\n") ?? "",
            }));

            sheet.columns = [
                {
                    key: "R/O",
                    width: rows?.reduce(
                        (w, r) => Math.max(w, r["R/O"].length),
                        5
                    ),
                },
                {
                    key: "M",
                    width: rows?.reduce((w, r) => Math.max(w, r.M.length), 3),
                },
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
                { key: "custom", width: 11 },
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
            sheet.addRows(rows ?? []);

            const row = sheet.getRow(1);
            const READ_ONLY_ROW = 1;
            const MANDATORY_ROW = 2;
            const LABEL_ROW = 3;
            const TYPE_ROW = 9;

            row.eachCell((cell, rowNumber) => {
                switch (rowNumber) {
                    case READ_ONLY_ROW || MANDATORY_ROW:
                        sheet.getColumn(rowNumber).font = {
                            size: 12,
                            name: "Calibri",
                            scheme: "minor",
                        };
                        sheet.getColumn(rowNumber).alignment = {
                            vertical: "middle",
                            horizontal: "center",
                        };
                        break;
                    case MANDATORY_ROW:
                        sheet.getColumn(rowNumber).font = {
                            size: 12,
                            name: "Calibri",
                            scheme: "minor",
                            color: { argb: "dc2626" },
                        };
                        sheet.getColumn(rowNumber).alignment = {
                            vertical: "middle",
                            horizontal: "center",
                        };
                        break;
                    case TYPE_ROW:
                        sheet.getColumn(rowNumber).font = {
                            size: 12,
                            name: "Calibri",
                            scheme: "minor",
                            italic: true,
                        };
                        break;
                    case LABEL_ROW:
                        sheet.getColumn(rowNumber).font = {
                            size: 12,
                            name: "Calibri",
                            scheme: "minor",
                            bold: true,
                        };
                        break;
                    default:
                        sheet.getColumn(rowNumber).font = {
                            size: 12,
                            name: "Calibri",
                            scheme: "minor",
                        };
                    // sheet.getColumn(rowNumber).border = {
                    //     top: { style: "thin", color: { argb: "d1d5db" } },
                    //     left: { style: "thin", color: { argb: "d1d5db" } },
                    //     bottom: {
                    //         style: "thin",
                    //         color: { argb: "d1d5db" },
                    //     },
                    //     right: { style: "thin", color: { argb: "d1d5db" } },
                    // };
                }
            });

            // sheet.eachRow(function (row, rowNumber) {
            //     if (rowNumber % 2) {
            //         row.fill = {
            //             type: "pattern",
            //             pattern: "solid",
            //             fgColor: { argb: "f2f1f3" },
            //             bgColor: { argb: "f2f1f3" },
            //         };
            //     }
            // row.border = {
            //     top: { style: "thin", color: { argb: "d1d5db" } },
            //     left: { style: "thin", color: { argb: "d1d5db" } },
            //     bottom: {
            //         style: "thin",
            //         color: { argb: "d1d5db" },
            //     },
            //     right: { style: "thin", color: { argb: "d1d5db" } },
            // };
            // });

            sheet.getRow(1).font = {
                size: 12,
                name: "Calibri",
                scheme: "minor",
                bold: true,
                color: { argb: "FFFFFF" },
            };
            sheet.getRow(1).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "0365f3" },
            };
        });

        workbook.xlsx.writeBuffer().then(function (buffer) {
            const blob = new Blob([buffer], { type: "applicationi/xlsx" });
            saveAs(blob, "SF_DATA_DICTIONARY.xlsx");
        });
    };
    return (
        <div className="flex flex-wrap justify-end">
            <div>
                <Button gradientDuoTone="greenToBlue" onClick={exportToCSV}>
                    Export V2
                </Button>
            </div>
        </div>
    );
};

export default ExportExcelButton;
