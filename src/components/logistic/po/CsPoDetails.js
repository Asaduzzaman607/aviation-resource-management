import { notification } from 'antd';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../../lib/common/helpers';
import API from '../../../service/Api';
import CsPoTable from './CsPoTable';

function modifiedCsPoDetailsData(vendor) {
  return vendor.csqDetailResponseDtoList.map((csDetail) => ({
    detailId: csDetail.detailId,
    partId: csDetail.partId,
    unitPrice: csDetail.unitPrice,
    leadTime: csDetail.leadTime,
    vendorName: vendor.vendorName,
    csDetailId: vendor.csDetailId,
    discount: csDetail.discount,
    vendorUomCode:csDetail.vendorUomCode,
    vendorPartQuantity:csDetail.vendorPartQuantity,
  }));
}

const CsPoDetails = ({ id, form, setSubTotal, subTotal, value, setValue }) => {
  const [rfqNo, setRfqNo] = useState(null);
  const [quotationIdList, setQuotationIdList] = useState([]);

  const getTableInfo = async () => {
    try {
      const { data } = await API.get(
        `/logistic/comparative-statements/material-management/existing/${id}`
      );
      setRfqNo(data.rfqId);
      setQuotationIdList(data.quotationIdList);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  useEffect(() => {
    getTableInfo();
    onSubmit();
  }, [id]);

  const [vendorLength, setVendorLength] = useState([]);
  const [validTill, setValidTill] = useState([]);
  const [rfq, setRfq] = useState({});

  const data = [];
  const quotationIdListLength = quotationIdList?.length;

  for (let i = 0; i < quotationIdListLength; i++) {
    data.push({
      key: quotationIdList[i].id,
      quotationNo: quotationIdList[i].quotationNo,
      date: quotationIdList[i].date,
      vendorName: quotationIdList[i].vendorName,
      vendorType: quotationIdList[i].vendorType,
      validUntil: quotationIdList[i].validUntil,
    });
  }

  const [generateCS, setGenerateCS] = useState({});

  const onSubmit = async () => {
    try {
      const {
        data: {
          csItemPartResponseDtoList: csItemPartResponse,
          csVendorResponseDtoList: vendors,
        },
      } = await API.get(
        `/logistic/comparative-statements/material-management/existing/${id}`,
        {
          rfqId: rfqNo,
          quotationIdList: quotationIdList,
        }
      );
      // notification['success']({ message: 'Created successfully' });
      console.log('data', data);
      setRfq({
        rfqId: rfqNo,
        quotationIdList: quotationIdList,
      });
      const CsPoDetails = vendors.map(modifiedCsPoDetailsData).flat();
      console.log('CsPoDetails', CsPoDetails);
      const vendorNameListLength = vendors.map((v) => v.vendorName);
      const validTill = vendors.map((v) => v.validTill);

      const mappedItemParts = csItemPartResponse.map((itemPart) => {
        const { partId } = itemPart;
        const vendors = CsPoDetails.filter(
          (vendor) => partId === vendor.partId
        );

        return {
          ...itemPart,
          vendors,
        };
      });
      console.log('mappedItemParts', mappedItemParts);
      const MAX_COLUMNS = Math.max(
        ...mappedItemParts.map((item) => item.vendors.length)
      );

      setVendorLength(vendorNameListLength);
      setValidTill(validTill);

      const mappedItems = mappedItemParts.map((itemPart) => {
        if (itemPart.vendors.length === MAX_COLUMNS) return itemPart;

        const { vendors } = itemPart;
        const restObjects = MAX_COLUMNS - vendors.length;

        return {
          ...itemPart,
          vendors: [
            ...vendors,
            ...Array(restObjects)
              .fill()
              .map(() => ({
                detailId: null,
                partId: null,
                unitPrice: null,
                leadTime: null,
                discount: null,
                vendorUomCode:null,
                vendorPartQuantity:null,
              })),
          ],
          restObjects,
        };
      });
      setGenerateCS(mappedItems);
      console.log('items: ', mappedItems);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  return (
    <>
      {rfqNo && (
        <>
          {generateCS && (
            <>
              <CsPoTable
                form={form}
                setSubTotal={setSubTotal}
                generateCS={generateCS}
                vendorLength={vendorLength}
                validTill={validTill}
                subTotal={subTotal}
                value={value}
                setValue={setValue}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default CsPoDetails;
