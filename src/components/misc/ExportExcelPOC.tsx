import { Button } from "flowbite-react";
import React from "react";
import { trpc } from "utils/trpc";

const ExportExcelPOC = () => {
    const excelExport = trpc.schemaObjectRouter.textExportExcel.useQuery();
    const handleClickOpen = () => {
        if (!excelExport.data) return;
        const mediaType =
            "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";

        window.location.href = `${mediaType}${excelExport.data.xxx}`;
    };
    return (
        <div>
            <Button onClick={handleClickOpen}>Test</Button>
        </div>
    );
};

export default ExportExcelPOC;
