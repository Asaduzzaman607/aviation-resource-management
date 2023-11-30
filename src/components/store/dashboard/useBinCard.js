import { createRef, useState } from 'react';
import { sleep } from '../../../lib/common/helpers';
import { notifyResponseError } from '../../../lib/common/notifications';
import API from '../../../service/Api';

const printStyle = `
 @media print {
   * {
     background-color: #829053 !important;
    }
    .mel-table {
      page-break-after:always!important;
    }   
    .part1 {
      width: 30%;
    }
    .part2 {
      width: 35%;
    }
    .part3 {
      width: 35%;
    }
    .accessor {
      font-size: 28px !important;
      letter-spacing: 2px;
    }
    .bin-card {
        display: block !important;
    }
    html {
        zoom: 102%;
    }
    @page{
       size: A4 landscape !important;
       margin: 0;
    }
 }
`;

const useBinCard = () => {
  const [binCards, setBinCard] = useState([]);
  const componentRef = createRef(null);

  async function fetchBinData({ partId, partSerialId }) {
    try {
      const { data } = await API.post('/part/dashboard/bin-card', {
        partId: partId,
        partSerialId: partSerialId,
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
      serialNumber: null,
      grn: null, 
      recFrom: null, // unknown
      receivedQty: null,
      tso: null,
      selfLife: null,
      voucherNo: null,
      issuedToAir: null, // unknown
      issuedQty: null,
      inStock: null,
      submittedUser: null, // known as initial
    };

    const { binDataList, ...rest } = data;
    const result = [];

    if (binDataList.length === 0) {
      result.push({
        ...rest,
        binDataList: [...Array(15).fill(emptyObject), { dummyRow: true }],
      });
    } else {
      const firstChunk = binDataList.slice(0, 15);
      const remainingChunks = chunkArray(binDataList.slice(15), 20);

      result.push({
        ...rest,
        binDataList: [
          ...firstChunk,
          ...Array(15 - firstChunk.length).fill(emptyObject),
          { dummyRow: true },
        ],
      });

      const { partNo, description, rackCode, rackRowCode, rackRowBinCode, otherLocation } = rest;

      for (const chunk of remainingChunks) {
        result.push({
          partNo,
          description,
          rackCode,
          rackRowCode,
          rackRowBinCode,
          otherLocation,
          binDataList: [
            ...chunk,
            ...Array(20 - chunk.length).fill(emptyObject),
            { dummyRow: true },
          ],
        });
      }
    }
    // console.log({ result });
    setBinCard(result);
  }

  return {
    binCards,
    componentRef,
    fetchBinData,
    printStyle,
  };
};

export default useBinCard;
