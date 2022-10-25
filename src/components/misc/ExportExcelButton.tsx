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
                        .join("\n") ?? "",
            }));

            sheet.columns = [
                {
                    key: "R/O",
                    width: rows?.reduce(
                        (w, r) => Math.max(w, r["R/O"].length),
                        4
                    ),
                },
                {
                    key: "M",
                    width: rows?.reduce((w, r) => Math.max(w, r.M.length), 2),
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
                                .split("\n")
                                .reduce((w, r) => Math.max(w, r.length), 17)
                        ) ?? [])
                    ),
                },
            ];

            console.log("rows", rows);
            sheet.addRows(rows ?? []);
        });

        workbook.xlsx.writeBuffer().then(function (buffer) {
            const blob = new Blob([buffer], { type: "applicationi/xlsx" });
            saveAs(blob, "myexcel.xlsx");
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
