import * as FileSaver from 'file-saver';
import { Tooltip } from 'react-bootstrap';
import XlSX from 'sheetjs-style';
import React from 'react';

import { Modal, Button, Form } from 'react-bootstrap';

const ExportExcel = ({data, fileName}) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XlSX.utils.json_to_sheet(data);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XlSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data1 = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data1, fileName + fileExtension);
    }
    // const workBook = XlSX.utils.book_new();
    
    // XlSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');

    return (
        <>
        <button onClick={(e) => exportToExcel(fileName)}>Export</button>
        </>
    );
}

export default ExportExcel;