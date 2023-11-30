import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  EditTwoTone,
} from '@ant-design/icons';
import {
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
  notification,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import CSService from '../../../service/procurment/CSService';
import ARMButton from '../../common/buttons/ARMButton';
import {
  getDiscountUnitPrice,
  getExchangeType,
  getLow,
  getMov,
  getTotal,
  getVendorName,
} from './csHelper';

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const { TextArea } = Input;

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
  const inputNode = (
    <TextArea
      style={{
        height: 30,
      }}
    />
  );

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

const GenerateTable = ({
  existingCS,
  rfq,
  orderType,
  remarks,
  generateCS,
  vendorLength,
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  let lowPrice = [];
  let lowTotalPrice = [];
  let lowQuotedVendorName = [];

  useEffect(() => {
    if (generateCS) {
      const originData = [];
      for (let i = 0; i < generateCS?.length; i++) {
        let csDetailKeys = {};
        for (let j = 0; j < generateCS[i].vendors.length; j++) {
          csDetailKeys['unitPrice' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].unitPrice;
          csDetailKeys['total' + generateCS[i].vendors[j].vendorName] =
            getTotal(
              generateCS[i].vendors[j].vendorPartQuantity,
              generateCS[i].vendors[j].moq,
              generateCS[i].vendors[j].unitPrice,
              generateCS[i].vendors[j].mlv
            );
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
            `Exchange Fee: ${generateCS[i].vendors[j].exchangeFee || 'N/A'}`,
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
          moqRemark: '',
          ...csDetailKeys,
        });
      }
      setData(originData);
    }
  }, [generateCS]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      moqRemark: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (e) {
      notification['error']({ message: getErrorMessage(e) });
    }
  };

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
              className: 'pointer-events-none',
            },
            {
              title: 'Description',
              width: 120,
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
    },
    {
      title: 'Edit Remark',
      dataIndex: 'operation',
      width: 135,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: '25px', marginRight: '5px' }}
              />
            </Typography.Link>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={cancel}
            >
              <CloseCircleTwoTone
                twoToneColor="#eb2f96"
                style={{ fontSize: '25px', marginLeft: '5px' }}
              />
            </Popconfirm>
          </span>
        ) : (
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              <EditTwoTone style={{ fontSize: '25px' }} />
            </Typography.Link>
          </span>
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
        editing: isEditing(record),
      }),
    };
  });

  const onFinish = async () => {
    const filteredData = data.map(({ itemId, moqRemark }) => {
      return { itemId, moqRemark };
    });
    const saveData = {
      ...rfq,
      existingCSId: existingCS,
      orderType: orderType,
      remarks: remarks,
      csPartDetailDtoSet: filteredData,
    };
    try {
      await CSService.csSave(saveData);
      notification['success']({
        message: 'Successfully saved!',
      });
      navigate('/material-management/pending-comparative-statement');
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  return (
    <>
      {generateCS && (
        <Form
          form={form}
          component={false}
        >
          <Row style={{ marginLeft: '10px' }}>
            <Col
              sm={20}
              md={10}
            >
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 0 }}>
                <Space size="small">
                  <ARMButton
                    type="primary"
                    htmlType="submit"
                    onClick={onFinish}
                  >
                    Save
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            style={{ whiteSpace: 'pre-line' }}
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
        </Form>
      )}
    </>
  );
};

export default GenerateTable;
