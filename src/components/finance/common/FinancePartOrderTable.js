import {
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  notification,
} from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../../../lib/common/helpers';
import CurrencyService from '../../../service/CurrencyService';
import PurchaseInvoiceService from '../../../service/procurment/PurchaseInvoiceService';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';

const { TextArea } = Input;
const { Option } = Select;
const EditableContext = React.createContext(null);

const FinancePartOrderTable = ({
  loadSingleData,
  breadcrumbListTitle,
  partInvoiceItemDtoList,
}) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [data, setData] = useState(() =>
    partInvoiceItemDtoList?.map((item) => {
      return {
        ...item,
        key: item.id,
        vendorName: item.vendorName,
        cdLt: `${item.condition}\n${item.leadTime}`,
        paymentCurrencyId: item.paymentCurrencyCode,
        approvedQuantity: 0,
      };
    })
  );
  const isApproved = breadcrumbListTitle.split(' ');
  console.log(isApproved);

  const searchCurrency = async () => {
    try {
      const {
        data: { model },
      } = await CurrencyService.getAllCurrency(true);
      setCurrencies(model);
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  function getCurrencyId(currencyCode) {
    let currency = currencies.find((data) => data.code === currencyCode);
    return currency?.id;
  }

  useEffect(() => {
    searchCurrency();
  }, []);

  useEffect(() => {
    setData(
      partInvoiceItemDtoList?.map((item) => {
        return {
          ...item,
          key: item.id,
          vendorName: item.vendorName,
          cdLt: `${item.condition}\n${item.leadTime}`,
          paymentCurrencyId: item.paymentCurrencyCode,
          approvedQuantity: 0,
        };
      })
    );
  }, [partInvoiceItemDtoList]);

  const handleSave = (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    newData.splice(index, 1, { ...item, ...row });
    setData(newData);
  };

  const onFinish = async () => {
    const values = data.map((item) => {
      return {
        id: item.id,
        paymentCurrencyId: getCurrencyId(item.paymentCurrencyId) || null,
        paymentMode: item.paymentMode || null,
        remarks: item.remarks,
        quantity: item.quantity,
        approvedQuantity:
          item.approvedQuantity === 0 ? null : parseInt(item.approvedQuantity),
      };
    });
    try {
      await PurchaseInvoiceService.partiallyApproved({
        partInvoiceItemDtoList: values,
      });
      notification['success']({
        message: 'Partially Approved',
      });
      loadSingleData();
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  const onReset = () => {
    setIsDisabled(true);
    setData(
      partInvoiceItemDtoList?.map((item) => {
        return {
          ...item,
          key: item.id,
          vendorName: item.vendorName,
          cdLt: `${item.condition}\n${item.leadTime}`,
          paymentCurrencyId: item.paymentCurrencyCode,
          approvedQuantity: 0,
        };
      })
    );
  };

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form
        form={form}
        component={false}
      >
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const columns = [
    {
      title: 'Part No.',
      dataIndex: 'partNo',
    },
    {
      title: 'Part Description',
      dataIndex: 'partDescription',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
    },
    {
      title: 'Priority',
      dataIndex: 'priorityType',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Already Approved Quantity',
      dataIndex: 'alreadyApprovedQuantity',
    },
    {
      title: 'To Be Approved Quantity',
      dataIndex: 'approvedQuantity',
      editable: true,
    },
    {
      title: 'UOM',
      dataIndex: 'uomCode',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
    },
    {
      title: 'Aircraft',
      dataIndex: 'airCraftName',
    },
    {
      title: 'Currency',
      dataIndex: 'currencyCode',
    },
    {
      title: 'Payment Mode',
      dataIndex: 'paymentMode',
      editable: true,
    },
    {
      title: 'Payment Currency',
      dataIndex: 'paymentCurrencyId',
      editable: true,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      editable: true,
    },
    {
      title: 'CD/LT',
      dataIndex: 'cdLt',
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        inputType:
          col.dataIndex === 'approvedQuantity'
            ? 'number'
            : col.dataIndex === 'remarks'
            ? 'textArea'
            : col.dataIndex === 'paymentCurrencyId'
            ? 'selectPaymentCurrencyId'
            : col.dataIndex === 'paymentMode'
            ? 'selectPaymentMode'
            : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const EditableCell = ({
    title,
    inputType,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    console.log('record: ', record);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);

    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        setIsDisabled(false);
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    const inputNode =
      inputType === 'number' ? (
        <InputNumber
          max={record?.quantity - record?.alreadyApprovedQuantity}
          min={0}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          disabled={record?.isPartiallyApproved}
        />
      ) : inputType === 'textArea' ? (
        <TextArea
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          disabled={
            record?.isPartiallyApproved || record?.approvedQuantity === 0
          }
        />
      ) : inputType === 'selectPaymentCurrencyId' ? (
        <Select
          allowClear
          onBlur={save}
          ref={inputRef}
          showSearch
          disabled={
            record?.isPartiallyApproved || record?.approvedQuantity === 0
          }
        >
          {currencies.map((currency) => (
            <Option
              key={currency.id}
              value={currency.code}
            >
              {currency.code}
            </Option>
          ))}
        </Select>
      ) : inputType === 'selectPaymentMode' ? (
        <Select
          allowClear
          onBlur={save}
          ref={inputRef}
          showSearch
          disabled={
            record?.isPartiallyApproved || record?.approvedQuantity === 0
          }
        >
          <Option
            key={1}
            value="LC"
          >
            LC
          </Option>
          <Option
            key={2}
            value="TT"
          >
            TT
          </Option>
          <Option
            key={3}
            value="CASH"
          >
            CASH
          </Option>
        </Select>
      ) : (
        <InputNumber
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          disabled={
            record?.isPartiallyApproved || record?.approvedQuantity === 0
          }
        />
      );

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
            paddingBottom: '2px',
          }}
          name={dataIndex}
        >
          {inputNode}
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
            minHeight: '33px',
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const components =
    isApproved[0] === 'Approved'
      ? false
      : {
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        };

  return (
    <ResponsiveTable>
      <Table
        components={components}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
        style={{ whiteSpace: 'pre-line' }}
      />
      {isApproved[0] === 'Pending' && (
        <Space
          size="small"
          style={{ marginTop: '15px' }}
        >
          <ARMButton
            type="primary"
            onClick={onFinish}
            disabled={isDisabled}
          >
            Submit
          </ARMButton>
          <ARMButton
            onClick={() => {
              onReset();
            }}
            type="primary"
            danger
          >
            Reset
          </ARMButton>
        </Space>
      )}
    </ResponsiveTable>
  );
};

export default FinancePartOrderTable;
