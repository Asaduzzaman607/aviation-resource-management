import { Form, Input, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import CommentsList from './CommentsList';

import {
  getDiscountUnitPrice,
  getExchangeType,
  getLow,
  getMov,
  getString,
  getTotal,
  getVendorName,
} from './csHelper';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const CSDetailsTable = ({
  csID,
  generateCS,
  vendorLength,
  setExcelData,
  setExcelDataColumn,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [partDetailId, setPartDetailId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');

  let lowPrice = [];
  let lowTotalPrice = [];
  let lowQuotedVendorName = [];

  const isEditing = (record) => record.key === editingKey;

  useEffect(() => {
    if (generateCS) {
      const originData = [];

      for (let i = 0; i < generateCS?.length; i++) {
        let csDetailKeys = {};
        for (let j = 0; j < generateCS[i].vendors.length; j++) {
          csDetailKeys['unitPrice' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].unitPrice;
          csDetailKeys['discount' + generateCS[i].vendors[j].vendorName] =
            getDiscountUnitPrice(
              generateCS[i].vendors[j].discount,
              generateCS[i].vendors[j].unitPrice
            );

          csDetailKeys['exchangeFee' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].exchangeFee;
          csDetailKeys['berLimit' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].berLimit;
          csDetailKeys['repairCost' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].repairCost;
          csDetailKeys['exchangeType' + generateCS[i].vendors[j].vendorName] =
            getExchangeType(generateCS[i].vendors[j].exchangeType);
          csDetailKeys['leadTime' + generateCS[i].vendors[j].vendorName] = `${
            generateCS[i].vendors[j].condition
          }\n${generateCS[i].vendors[j].leadTime}\n${getString(
            'moq: ',
            generateCS[i].vendors[j].moq
          )}\n${getString('mlv: ', generateCS[i].vendors[j].mlv)}\n${getString(
            'mov: ',
            generateCS[i].vendors[j].mov
          )}`;
          csDetailKeys['total' + generateCS[i].vendors[j].vendorName] =
            getTotal(
              generateCS[i].vendors[j].vendorPartQuantity,
              generateCS[i].vendors[j].moq,
              generateCS[i].vendors[j].unitPrice,
              generateCS[i].vendors[j].mlv
            );
          csDetailKeys[
            'vendorPartQuantity' + generateCS[i].vendors[j].vendorName
          ] = generateCS[i].vendors[j].vendorPartQuantity;
          csDetailKeys['vendorUomCode' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].vendorUomCode;

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

          csDetailKeys['currencyCode' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].currencyCode;
          csDetailKeys['mov' + generateCS[i].vendors[j].vendorName] = getMov(
            generateCS[i].vendors[j].mov,
            csDetailKeys['total' + generateCS[i].vendors[j].vendorName]
          );
        }
        originData.push({
          key: i.toString(),
          id: generateCS[i]?.id,
          //a change with detailcstable
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
      console.log('originData: ', originData);
      setData(originData);
      setExcelData(originData);
    }
    setExcelDataColumn(mergedColumns);
  }, [generateCS]);
  const columns = [
    {
      title: 'Comparative Statement',
      children: [
        {
          title: 'Comparative Statement',
          children: [
            {
              title: 'S/N',
              width: 60,
              dataIndex: 'sn',
              fixed: 'left',
            },
            {
              title: 'Description',
              width: 150,
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
              width: 110,
              fixed: 'left',
            },
            {
              title: 'Qty',
              dataIndex: 'qty',
              width: 60,
              fixed: 'left',
            },
            {
              title: 'UOM',
              dataIndex: 'uomCode',
              width: 80,
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
        return 'DD';
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
          title: 'Discounted Unit Price',
          dataIndex: 'discount' + vendorLength[j],
          width: 150,
        },
        {
          title: 'CD/LT',
          dataIndex: 'leadTime' + vendorLength[j],
          width: 100,
        },
        {
          title: 'Exchange Type',
          dataIndex: 'exchangeType' + vendorLength[j],
          width: 150,
        },
        {
          title: 'Exchange Fee',
          dataIndex: 'exchangeFee' + vendorLength[j],
          width: 150,
        },
        {
          title: 'Repair Cost',
          dataIndex: 'repairCost' + vendorLength[j],
          width: 150,
        },
        {
          title: 'Ber Limit',
          dataIndex: 'berLimit' + vendorLength[j],
          width: 150,
        },
        {
          title: 'Currency',
          dataIndex: 'currencyCode' + vendorLength[j],
          width: 110,
        },
        {
          title: 'To Meet MOV',
          dataIndex: 'mov' + vendorLength[j],
          width: 130,
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
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      {generateCS && (
        <Form
          form={form}
          component={false}
        >
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            style={{ whiteSpace: 'pre' }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={false}
            scroll={{
              x: 1000,
              y: 500,
            }}
          />
          {/* testing */}
          <Modal
            title="Comments"
            centered
            visible={visible}
            onCancel={() => setVisible(false)}
            onOk={() => setVisible(false)}
            width={1000}
          >
            <CommentsList
              csID={csID}
              partDetailId={partDetailId}
            />
          </Modal>
        </Form>
      )}
    </>
  );
};

export default CSDetailsTable;
