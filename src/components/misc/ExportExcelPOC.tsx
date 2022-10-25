import { Button } from "flowbite-react";
import React from "react";
import { trpc } from "utils/trpc";
import XLSX from "xlsx-js-style";
import * as excelJS from "exceljs";
import { saveAs } from "file-saver";

const ExportExcelPOC = () => {
    const excelExport = trpc.schemaObjectRouter.textExportExcel.useQuery();
    const handleClickOpen = () => {
        if (!excelExport.data) return;
        const mediaType =
            "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";

        window.location.href = `${mediaType}${excelExport.data.xxx}`;
    };

    const test2 = () => {
        const workbook = new excelJS.Workbook();
        workbook.creator = "test";
        workbook.lastModifiedBy = "test";
        workbook.created = new Date();
        workbook.modified = new Date();

        const sheet = workbook.addWorksheet("2018-10报表");
        sheet.getRow(1).values = ["种类", "销量", , , , "店铺"];
        sheet.getRow(2).values = [
            "种类",
            "2018-05",
            "2018-06",
            "2018-07",
            "2018-08",
            "店铺",
        ];

        sheet.columns = [
            { key: "category", width: 30 },
            { key: "2018-05", width: 30 },
            { key: "2018-06", width: 30 },
            { key: "2018-07", width: 30 },
            { key: "2018-08", width: 30 },
            { key: "store", width: 30 },
        ];

        const data = [
            {
                category: "衣服",
                "2018-05": 300,
                "2018-06": 230,
                "2018-07": 730,
                "2018-08": 630,
                store: "王小二旗舰店",
            },
            {
                category: "零食",
                "2018-05": 672,
                "2018-06": 826,
                "2018-07": 302,
                "2018-08": 389,
                store: "吃吃货",
            },
        ];
        sheet.addRows(data);
        sheet.mergeCells(`B1:E1`);
        sheet.mergeCells("A1:A2");
        sheet.mergeCells("F1:F2");

        const row = sheet.getRow(1);
        row.eachCell((cell, rowNumber) => {
            sheet.getColumn(rowNumber).alignment = {
                vertical: "middle",
                horizontal: "center",
            };
            sheet.getColumn(rowNumber).font = { size: 14, family: 2 };
        });

        console.log(workbook.xlsx);

        workbook.xlsx.writeBuffer().then(function (buffer) {
            // done
            console.log(buffer);

            const blob = new Blob([buffer], { type: "applicationi/xlsx" });
            saveAs(blob, "myexcel.xlsx");
        });
    };
    return (
        <div>
            <Button onClick={test2}>Test2</Button>
            <Button onClick={handleClickOpen}>Test</Button>
        </div>
    );
};

export default ExportExcelPOC;
