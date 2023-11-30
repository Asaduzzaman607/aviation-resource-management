import { createRef, useState } from 'react';
import API from '../../../service/Api';
import { sleep } from '../../../lib/common/helpers';
import { notifyResponseError } from '../../../lib/common/notifications';

const printStyle = `
 @media print {
    .mel-table {
      page-break-after:always!important;
    }
    .stock-record {
        display: block !important;
    }   
    @page{
       size: A4 portrait !important;
       margin: 0;
    }
 }
`;

const useStockRecord = () => {
  const [stockRecords, setStockRecord] = useState([]);
  const stockRecordRef = createRef(null);

  async function fetchStockRecordData({ partId }) {
    try {
      const { data } = await API.post('/part/dashboard/stock-card', {
        partId: partId,
      });
      prepareData(data);
      return sleep(1000);
    } catch (error) {
      notifyResponseError(error);
    }
  }

  function chunkArray(array, chunkSize) {
    const chunks = [];
    let i = 0;

    while (i < array.length) {
      chunks.push(array.slice(i, i + chunkSize));
      i += chunkSize;
    }

    return chunks;
  }

  function prepareData(data) {
    const emptyObject = {
      lineNo: null,
      createdAt: null,
      consignee: null, //unknown
      voucherNo: null,
      releaseNote: null, //unknown
      serialNumber: null,
      receivedQty: null,
      issuedQty: null,
      inStock: null,
      unitPrice: null,
      submittedUser: null, //known as initial
    };

    const { stockDataList, ...rest } = data;
    const result = [];

    if (stockDataList.length === 0) {
      result.push({
        ...rest,
        stockDataList: [...Array(15).fill(emptyObject)],
      });
    } else {
      const firstChunk = stockDataList.slice(0, 15);
      const remainingChunks = chunkArray(stockDataList.slice(15), 25);

      result.push({
        ...rest,
        stockDataList: [
          ...firstChunk,
          ...Array(15 - firstChunk.length).fill(emptyObject),
        ],
      });

      const { partNo, description } = rest;

      for (const chunk of remainingChunks) {
        result.push({
          partNo,
          description,
          stockDataList: [
            ...chunk,
            ...Array(25 - chunk.length).fill(emptyObject),
          ],
        });
      }
    }
    // console.log({ result });
    setStockRecord(result);
  }

  return {
    stockRecords,
    stockRecordRef,
    fetchStockRecordData,
    printStyle,
  };
};

export default useStockRecord;
