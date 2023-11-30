import { Button, Form, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import {
  getDiscountUnitPrice,
  getExchangeType,
  getLow,
  getMov,
  getTotal,
  getVendorName,
} from '../../procurment/ComparativeStatement/csHelper';
import CommentSection from './CommentSection';

const CSTable = ({ generateCS, vendorLength, csNo }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [partDetailId, setPartDetailId] = useState(null);
  const [visible, setVisible] = useState(false);

  const columns = [
    {
      title: 'Comparative Statement',
      children: [
        {
          title: `${csNo}`,
          children: [
            {
              title: 'S/N',
              width: 60,
              dataIndex: 'sn',
              fixed: 'left',
              className: 'pointer-events-none',
            },
            {
              title: 'Description',
              width: 150,
              dataIndex: 'description',
              fixed: 'left',
              className: 'pointer-events-none',
            },
            {
              title: 'Part Number',
              dataIndex: 'partNo',
              width: 100,
              fixed: 'left',
              className: 'pointer-events-none',
            },
            {
              title: 'Alternate',
              dataIndex: 'alternate',
              width: 100,
              fixed: 'left',
              className: 'pointer-events-none',
            },
            {
              title: 'Requested Qty',
              dataIndex: 'qty',
              width: 100,
              fixed: 'left',
              className: 'pointer-events-none',
            },
            {
              title: 'Requested UOM',
              dataIndex: 'uomCode',
              width: 100,
              fixed: 'left',
              className: 'pointer-events-none',
            },
          ],
        },
      ],
    },
    {
      title: 'Lowest Price',
      dataIndex: 'lowestPrice',
      width: 100,
      className: 'pointer-events-none',
    },
    {
      title: 'Total Price',
      dataIndex: 'lowestTotalPrice',
      width: 100,
      className: 'pointer-events-none',
    },
    {
      title: 'Lowest Quoted Vendor',
      dataIndex: 'lowQuotedVendorName',
      width: 120,
      className: 'pointer-events-none',
    },
    {
      title: 'Remark',
      dataIndex: 'moqRemark',
      width: 100,
      editable: true,
      className: 'pointer-events-none',
    },
    {
      title: 'Audit Disposal',
      dataIndex: 'auditDisposal',
      width: 145,
      render: (_, record) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              setPartDetailId(record.id);
              setVisible(true);
            }}
          >
            Comment
          </Button>
        );
      },
    },
  ];

  for (let j = 0; j < vendorLength.length; j++) {
    columns[0].children.push({
      title: vendorLength[j].vendorName,
      children: [
        {
          title: 'Unit Price',
          dataIndex: 'unitPrice' + vendorLength[j].vendorName,
          width: 100,
          className: 'pointer-events-none',
        },
        {
          title: 'CD/LT',
          dataIndex: 'leadTime' + vendorLength[j].vendorName,
          width: 250,
          className: 'pointer-events-none',
        },
        {
          title: 'VENDOR APPROVAL',
          dataIndex: 'vendorApproval' + vendorLength[j].vendorName,
          width: 150,
          className:
            vendorLength[j].vendorWorkFlowName === 'APPROVED'
              ? 'green-color pointer-events-none'
              : 'red-color pointer-events-none',
        },
        {
          title: 'Total',
          dataIndex: 'total' + vendorLength[j].vendorName,
          width: 100,
          className: 'pointer-events-none',
        },
      ],
    });
  }

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });

  useEffect(() => {
    if (generateCS) {
      let lowPrice = [];
      let lowTotalPrice = [];
      let lowQuotedVendorName = [];

      const originData = [];

      for (let i = 0; i < generateCS?.length; i++) {
        let csDetailKeys = {};
        for (let j = 0; j < generateCS[i].vendors.length; j++) {
          csDetailKeys['unitPrice' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].unitPrice;
          csDetailKeys['leadTime' + generateCS[i].vendors[j].vendorName] = [
            generateCS[i].vendors[j].condition,
            generateCS[i].vendors[j].leadTime,
            `moq: ${generateCS[i].vendors[j].moq}`,
            `mlv: ${generateCS[i].vendors[j].mlv}`,
            `mov: ${generateCS[i].vendors[j].mov}`,
            `discount: ${generateCS[i].vendors[j].discount}%`,
            `Discounted Unit Price: ${getDiscountUnitPrice(
              generateCS[i].vendors[j].discount,
              generateCS[i].vendors[j].unitPrice
            )}`,
            `Vendor UOM: ${generateCS[i].vendors[j].vendorUomCode}`,
            `Quantity: ${generateCS[i].vendors[j].vendorPartQuantity}`,
            `Exchange Type: ${
              getExchangeType(generateCS[i].vendors[j].exchangeType) || 'N/A'
            }`,
            `Exchange Fee: ${generateCS[i].vendors[j].exchangeType || 'N/A'}`,
            `Repair Cost: ${generateCS[i].vendors[j].repairCost || 'N/A'}`,
            `Ber Limit: ${generateCS[i].vendors[j].berLimit || 'N/A'}`,
            `Currency: ${generateCS[i].vendors[j].currencyCode || 'N/A'}`,
            `To Meet MOV: ${
              getMov(
                generateCS[i].vendors[j].mov,
                csDetailKeys['total' + generateCS[i].vendors[j].vendorName]
              ) || 'N/A'
            }`,
          ].join('\n');
          csDetailKeys['total' + generateCS[i].vendors[j].vendorName] =
            getTotal(
              generateCS[i].vendors[j].vendorPartQuantity,
              generateCS[i].vendors[j].moq,
              generateCS[i].vendors[j].unitPrice,
              generateCS[i].vendors[j].mlv
            );

          lowPrice[j] =
            generateCS[i].vendors[j].unitPrice &&
            generateCS[i].vendors[j].vendorPartQuantity >= generateCS[i].qty
              ? generateCS[i].vendors[j].unitPrice
              : 0;
          lowTotalPrice[j] =
            (generateCS[i].vendors[j].unitPrice &&
            generateCS[i].vendors[j].vendorPartQuantity >= generateCS[i].qty
              ? generateCS[i].vendors[j].unitPrice
              : 0) * generateCS[i].vendors[j].vendorPartQuantity;
          lowQuotedVendorName[j] = {
            lowTotalPrice:
              (generateCS[i].vendors[j].unitPrice &&
              generateCS[i].vendors[j].vendorPartQuantity >= generateCS[i].qty
                ? generateCS[i].vendors[j].unitPrice
                : 0) * generateCS[i].vendors[j].vendorPartQuantity,
            vendorName: generateCS[i].vendors[j].vendorName,
          };
        }
        originData.push({
          key: i.toString(),
          id: generateCS[i]?.id,
          sn: i + 1,
          qty: generateCS[i]?.qty,
          description: generateCS[i]?.partDescription,
          partNo: generateCS[i]?.partNo,
          itemId: generateCS[i]?.itemId,
          uomCode: generateCS[i]?.uomCode,
          lowestPrice: getLow(lowPrice),
          lowestTotalPrice: getLow(lowTotalPrice),
          lowQuotedVendorName: getVendorName(
            lowQuotedVendorName,
            getLow(lowTotalPrice)
          ),
          moqRemark: generateCS[i]?.moqRemark,
          ...csDetailKeys,
        });
      }
      setData(originData);
    }
  }, [generateCS]);

  return (
    <>
      {generateCS && (
        <Form
          form={form}
          component={false}
        >
          <Table
            bordered
            style={{ whiteSpace: 'pre-line' }}
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={false}
            scroll={{
              x: 1000,
              y: 500,
            }}
          />

          <Modal
            title="Comments"
            centered
            visible={visible}
            onCancel={() => setVisible(false)}
            onOk={() => setVisible(false)}
            width={1000}
            destroyOnClose
          >
            <CommentSection partDetailId={partDetailId} />
          </Modal>
        </Form>
      )}
    </>
  );
};

export default CSTable;
