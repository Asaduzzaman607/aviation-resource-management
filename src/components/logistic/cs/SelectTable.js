import { notification, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSetState } from 'react-use';
import { getErrorMessage } from '../../../lib/common/helpers';
import LogisticCSService from '../../../service/logistic/LogisticCSService';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import GenerateTable from './GenerateTable';

const columns = [
  {
    title: 'Quotation No',
    dataIndex: 'quotationNo',
  },
  {
    title: 'Date',
    dataIndex: 'date',
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendorName',
  },
  {
    title: 'Vendor Type',
    dataIndex: 'vendorType',
  },
  {
    title: 'Valid Until',
    dataIndex: 'validUntil',
  },
];

function modifiedCsDetailsData(vendor) {
  return vendor.csqDetailResponseDtoList.map((csDetail) => ({
    detailId: csDetail.detailId,
    partId: csDetail.partId,
    unitPrice: csDetail.unitPrice,
    leadTime: csDetail.leadTime,
    vendorName: vendor.vendorName,
    currencyCode: csDetail.currencyCode,
    condition: csDetail.condition,
    discount: csDetail.discount,
    vendorUomCode: csDetail.vendorUomCode,
    vendorPartQuantity: csDetail.vendorPartQuantity,
  }));
}

const SelectTable = ({
  existingCS,
  remarks,
  rfqNo,
  quotationList,
  quotationIdList,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [vendorLength, setVendorLength] = useState([]);
  const [validTill, setValidTill] = useState([]);
  const [rfq, setRfq] = useState({});
  const [showTable, setShowTable] = useSetState(false);
  useEffect(() => {
    setSelectedRowKeys([...quotationIdList]);
  }, [quotationIdList]);

  const data = [];
  const quotationListLength = quotationList.length;

  for (let i = 0; i < quotationListLength; i++) {
    data.push({
      key: quotationList[i].id,
      quotationNo: quotationList[i].quotationNo,
      date: quotationList[i].date,
      vendorName: quotationList[i].vendorName,
      vendorType: quotationList[i].vendorType,
      validUntil: quotationList[i].validUntil,
    });
  }

  const onSelectChange = (e) => {
    setSelectedRowKeys(e);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const [generateCS, setGenerateCS] = useState({});

  const onSubmit = async () => {
    try {
      const {
        data: {
          csItemPartResponseDtoList: csItemPartResponse,
          csVendorResponseDtoList: vendors,
        },
      } = await LogisticCSService.generateCS({
        rfqId: rfqNo,
        quotationIdList: selectedRowKeys,
      });

      setRfq({
        rfqId: rfqNo,
        quotationIdList: selectedRowKeys,
      });

      const csDetails = vendors.map(modifiedCsDetailsData).flat();
      const vendorNameListLength = vendors.map((v) => v.vendorName);
      const validTill = vendors.map((v) => v.validTill);

      const mappedItemParts = csItemPartResponse.map((itemPart) => {
        const { partId } = itemPart;
        const vendors = csDetails.filter((vendor) => partId === vendor.partId);

        return {
          ...itemPart,
          vendors,
        };
      });

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
                currencyCode: null,
                condition: null,
                discount: null,
                vendorPartQuantity: null,
                vendorUomCode: null,
              })),
          ],
          restObjects,
        };
      });
      setGenerateCS(mappedItems);
      notification['success']({ message: 'Created successfully' });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  return (
    <>
      {rfqNo && (
        <>
          <ARMCard
            title="Quotation LIST"
            style={{
              marginTop: '30px',
            }}
          >
            <Row>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered
                scroll={{
                  x: 1000,
                  y: 400,
                }}
              />
              <ARMButton
                type="primary"
                htmlType="submit"
                style={{
                  marginTop: '15px',
                }}
                onClick={() => {
                  onSubmit();
                  setShowTable(true);
                }}
              >
                <a href="#generate-table">Generate CS</a>
              </ARMButton>
            </Row>
          </ARMCard>

          {generateCS && showTable && (
            <ARMCard
              id="generate-table"
              title="Logistic CS LIST"
              style={{
                marginTop: '30px',
              }}
            >
              <Row>
                <GenerateTable
                  existingCS={existingCS}
                  remarks={remarks}
                  rfq={rfq}
                  generateCS={generateCS}
                  vendorLength={vendorLength}
                  validTill={validTill}
                />
              </Row>
            </ARMCard>
          )}
        </>
      )}
    </>
  );
};

export default SelectTable;
