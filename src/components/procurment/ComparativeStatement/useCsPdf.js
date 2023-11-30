import { useState } from 'react';

const useCsPdf = () => {
  const [tableData, setTableData] = useState({});

  // preparing data for cs pdf
  const prepareCSPdfData = (mergedColumns, generatedCSData) => {

    // console.log({mergedColumns, generatedCSData});

    // generating the headers
    let headers = [...mergedColumns[0]?.children];
    let headers2 = [
      {
        label: 'Lowest \nPrice',
        rowSpan: 2,
      },
      {
        label: 'Total \nPrice',
        rowSpan: 2,
      },
      {
        label: 'Lowest \nQuoted \nVendor',
        rowSpan: 2,
      },
      {
        label: 'Remark',
        rowSpan: 2,
      },
      {
        label: 'Audit \nDisposal',
        rowSpan: 2,
      },
    ];
    // generating the rows
    let rows = [];
    generatedCSData.forEach((cs, index) => {
      rows.push([
        {
          sn: index + 1,
          description: cs.partDescription,
          partNo: cs.partNo,
          remark: cs.moqRemark,
          comments: cs.comments,
          alternate: cs.alternate,
          reqQty: cs.qty,
          reqUOM: cs.uomCode,
        },
        ...cs.vendors,
      ]);
    });

    const tableData = {
      headers,
      headers2,
      rows,
    };

    setTableData(tableData);

    // console.log({ headers, headers2, rows });
  };

  return {
    prepareCSPdfData,
    tableData,
  };
};

export default useCsPdf;
