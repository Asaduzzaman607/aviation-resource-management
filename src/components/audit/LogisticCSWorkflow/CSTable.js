import { Button, Form, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import {
  getDiscountUnitPrice,
  getLow,
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
            },
            {
              title: 'Description',
              width: 100,
              dataIndex: 'description',
              fixed: 'left',
            },
            {
              title: 'Part Number',
              dataIndex: 'partNo',
              width: 100,
              fixed: 'left',
            },
            {
              title: 'Alternate',
              dataIndex: 'alternate',
              width: 100,
              fixed: 'left',
            },
          ],
        },
      ],
    },
    {
      title: 'Lowest Price',
      dataIndex: 'lowestPrice',
      width: 100,
    },
    {
      title: 'Total Price',
      dataIndex: 'lowestTotalPrice',
      width: 100,
    },
    {
      title: 'Lowest Quoted Vendor',
      dataIndex: 'lowQuotedVendorName',
      width: 120,
    },
    {
      title: 'Remark',
      dataIndex: 'moqRemark',
      width: 100,
      editable: true,
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
      title: vendorLength[j],
      children: [
        {
          title: 'Unit Price',
          dataIndex: 'unitPrice' + vendorLength[j],
          width: 100,
        },
        {
          title: 'CD/LT',
          dataIndex: 'leadTime' + vendorLength[j],
          width: 250,
        },
        {
          title: 'Total',
          dataIndex: 'total' + vendorLength[j],
          width: 100,
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
            `discount: ${generateCS[i].vendors[j].discount}%`,
            `Discounted Unit Price: ${getDiscountUnitPrice(
              generateCS[i].vendors[j].discount,
              generateCS[i].vendors[j].unitPrice
            )}`,
            `Vendor UOM: ${generateCS[i].vendors[j].vendorUomCode}`,
            `Quantity: ${generateCS[i].vendors[j].vendorPartQuantity}`,
            `Currency: ${generateCS[i].vendors[j].currencyCode || 'N/A'}`,
          ].join('\n');
          csDetailKeys['total' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].vendorPartQuantity *
            generateCS[i].vendors[j].unitPrice;

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
