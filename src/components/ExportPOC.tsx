import React, { useCallback, useEffect, useState } from "react";
import { utils, writeFile } from "xlsx-js-style";

const ExportPOC = () => {
    const dataTMP = [
        { firstName: "Christian", lastName: "pelayo" },
        { firstName: "Christian", lastName: "pelayo" },
        { firstName: "Christian", lastName: "pelayo" },
    ];
    /* get state data and export to XLSX */
    const exportFile = (data: { firstName: string; lastName: string }[]) => {
        const worksheet = utils.json_to_sheet(data);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Sheet1");
        //let buffer = write(workbook, { bookType: ", type: "buffer" });
        //write(workbook, { bookType: ", type: "binary" });
        writeFile(workbook, "DataSheet.xlsx");
    };

    return (
        <>
            <button onClick={() => exportFile(dataTMP)}>Export XLSX</button>
        </>
    );
};

export default ExportPOC;
