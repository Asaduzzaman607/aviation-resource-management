import { notification, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSetState } from 'react-use';
import { getErrorMessage } from '../../../lib/common/helpers';
import CSService from '../../../service/procurment/CSService';
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
    condition: csDetail.condition,
    mov: csDetail.mov,
    moq: csDetail.moq,
    mlv: csDetail.mlv,
    exchangeType: csDetail.exchangeType,
    exchangeFee: csDetail.exchangeFee,
    repairCost: csDetail.repairCost,
    berLimit: csDetail.berLimit,
    currencyCode: csDetail.currencyCode,
    leadTime: csDetail.leadTime,
    discount: csDetail.discount,
    vendorUomCode: csDetail.vendorUomCode,
    vendorPartQuantity: csDetail.vendorPartQuantity,
    vendorName: vendor.vendorName,
    vendorWorkFlowName: vendor.vendorWorkFlowName,
  }));
}

const SelectTable = ({
  existingCS,
  rfqNo,
  remarks,
  orderType,
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

  const [generateCS, setGenerateCS] = useState(null);

  const onSubmit = async () => {
    try {
      const {
        data: {
          csItemPartResponseDtoList: csItemPartResponse,
          csVendorResponseDtoList: vendors,
        },
      } = await CSService.generateCS(orderType, {
        rfqId: rfqNo,
        quotationIdList: selectedRowKeys,
      });

      setRfq({
        rfqId: rfqNo,
        quotationIdList: selectedRowKeys,
      });

      const csDetails = vendors.map(modifiedCsDetailsData).flat();
      const vendorNameListLength = vendors.map((v) => {
        return {
          vendorName: v.vendorName,
          vendorWorkFlowName: v.vendorWorkFlowName,
        };
      });
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
                condition: null,
                mov: null,
                moq: null,
                mlv: null,
                currencyCode: null,
                exchangeType: null,
                exchangeFee: null,
                repairCost: null,
                berLimit: null,
                discount: null,
                vendorPartQuantity: null,
                vendorUomCode: null,
              })),
          ],
          restObjects,
        };
      });
      setGenerateCS(mappedItems);
      notification['success']({ message: 'Generated successfully' });
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
              title="COMPARATIVE STATEMENT LIST"
              style={{
                marginTop: '30px',
              }}
            >
              <Row>
                <GenerateTable
                  existingCS={existingCS}
                  rfq={rfq}
                  orderType={orderType}
                  remarks={remarks}
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
