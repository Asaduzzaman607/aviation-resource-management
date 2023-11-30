import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Table,
} from 'antd';
import { isArray } from 'lodash';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-use';
import ARMForm from '../../../lib/common/ARMForm';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError, notifyWarning } from '../../../lib/common/notifications';
import { formLayout } from '../../../lib/constants/layout';
import API from '../../../service/Api';
import IssueDemandService from '../../../service/store/IssueDemandService';
import SerialService from '../../../service/store/SerialService';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import DebounceSelect from '../../common/DebounceSelect';
import RibbonCard from '../../common/forms/RibbonCard';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import SubmitReset from '../common/SubmitReset';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { useSelector } from 'react-redux';
import UnitofMeasurementService from "../../../service/UnitofMeasurementService";

const { TextArea } = Input;
const { Option } = Select;
const EditableContext = React.createContext(null);

const IssueDemand = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const sdId = location.state.usr?.singleData;
  const { id } = useParams();
  const [selectedStockRoom, setSelectedStockRoom] = useState([]);
  const [selectedDemandNo, setSelectedDemandNo] = useState(null);
  const [serial, setSerial] = useState([]);
  const [partId, setPartId] = useState(null);
  const [uniqueModalId, setUniqueModalId] = useState(null);
  const [quantityIssued, setQuantityIssued] = useState(0);
  const [open, setOpen] = useState(false);
  const [uomId, setUomId] = useState();
  const [uom, setUom] = useState([]);
  const [data, setData] = useState([]);
  const partClassification = Form.useWatch('partClassification', form);
  const route = useSelector((state) => state.routeLocation.previousRoute);

  const filteredDemands = useMemo(() => {
    return data.filter((d) =>
      partClassification ? d.partClassification === partClassification : true
    );
  }, [data, partClassification]);

  const getSerial = async (partId, uomId) => {
    try {
      let { data } = await SerialService.getAllSerial(50, {
        partId: partId,
        uomId:uomId,
        status: 'SERVICEABLE',
        onlyAvailable: true,
      });
      setSerial(data.model);
    } catch (errInfo) {
      notification['error']({ message: getErrorMessage(errInfo) });
    }
  };

  useEffect(() => {
    (uomId || partId) && getSerial(partId, uomId);
  }, [partId, uomId]);

  const getAllUom = async () => {
    try {
      let {data} = await UnitofMeasurementService.getAllUnitofMeasurement(500, {isActive: true});
      setUom(data.model);
    } catch (e) {
      notifyError(getErrorMessage(e))
    }
  }

  useEffect(()=>{
    getAllUom().catch(console.error)
  },[])
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
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    const inputNode =
      inputType === 'number' ? (
        <InputNumber
          max={record.availablePart}
          min={0}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          style={{ width: '100%' }}
        />
      ) : inputType === 'textArea' ? (
        <TextArea
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          style={{ width: '100%' }}
        />
      )
          : inputType==='select'?(
            <Select
              onBlur={save}
              ref={inputRef}
              showSearch
            >
              {
                uom?.map((data)=>(
                  <Option key={data.id} value={data.code}>{data.code}</Option>
                ))
              }
            </Select>

          ):
        (
        <Input
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          disabled={record?.issuedQuantity === 0}
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
          // rules = {
          //   dataIndex === 'issuedQuantity' ? [
          //     {
          //       type: 'number',
          //       max: record.quantityDemanded,
          //       message: 'Invalid!'
          //     }
          //   ] : []
          // }
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

  const columns = [
    {
      title: 'Part No.',
      dataIndex: 'partNo',
      width: '8%',
      editable: false,
    },
    {
      title: 'Alternate Part No.',
      dataIndex: 'alterPart',
      width: '13%',
      editable: false,
    },
    {
      title: 'Priority',
      dataIndex: 'showedPriority',
      width: '7%',
      editable: false,
    },
    {
      title: 'Available Part',
      dataIndex: 'availablePart',
      width: '10%',
      editable: false,
    },
    {
      title: 'Qty. Demanded',
      dataIndex: 'quantityDemanded',
      width: '5%',
      editable: false,
    },
    {
      title: 'Already Issued Quantity',
      dataIndex: 'totalIssuedQty',
      width: '5%',
      editable: false,
    },
    {
      title: 'Qty. Issued',
      dataIndex: 'issuedQuantity',
      width: '5%',
      editable: partClassification !== 2,
    },
    {
      title: 'UOM',
      dataIndex: 'uomId',
      width: '20%',
      editable: !id
    },
    {
      title: 'Card Line No.',
      dataIndex: 'cardLineNo',
      width: '20%',
      editable: true,
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      width: '25%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
            setPartId(record.partId);
            setUomId(getUomId(record.uomId))
            setUniqueModalId(record.demandItemId);
            setQuantityIssued(record?.issuedQuantity || 0);
            form.setFieldValue(
              'serial' + record.demandItemId,
              record.grnAndSerialDtoList
            );
          }}
          disabled={!partClassification}
        >
          Add
        </Button>
      ),
    },
  ];

  const handleSave = (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    newData.splice(index, 1, { ...item, ...row });
    setData(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

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
          col.dataIndex === 'issuedQuantity'
            ? 'number'
            : col.dataIndex === 'remark'
            ? 'textArea'
            :col.dataIndex==='uomId'
                ?'select'
            : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const getIssueDemand = async () => {
    try {
      const { data } = await IssueDemandService.getIssueDemandById(id);
      const issueData = data.storeIssueItemResponseDtos.map((demand) => ({
        id: demand.id,
        key: demand.id,
        demandItemId: demand.demandItemId,
        partId: demand.partId,
        partNo: demand.parentPartId === null ? demand.partNo : '',
        alterPart: demand.parentPartId !== null ? demand.partNo : '',
        partClassification: demand.partClassification,
        availablePart: demand.availablePart,
        quantityDemanded: demand.parentPartId !== null ? '' : demand.quantityDemanded,
        parentPartId:demand.parentPartId,
        issuedQuantity: demand.issuedQuantity,
        alreadyIssuedQuantity: demand.issuedQuantity,
        totalIssuedQty: demand.totalIssuedQty,
        cardLineNo: demand.cardLineNo,
        uomId:demand.unitMeasurementCode,
        remark: demand.remark,
        priority: demand.priorityType,
        showedPriority: demand.parentPartId !== null ? '' :demand.priorityType,
        grnAndSerialDtoList: demand.grnAndSerialDtoList,
      }));
      setData(issueData);
      form.setFieldsValue({
        ...data,
        storeStockRoomId: {
          value: data.storeStockRoomId,
          label: data.storeStockRoom,
        },
        demandId: {
          value: data.storeDemandId,
          label: data.storeDemandNo,
        },
      });
      setSelectedStockRoom([
        {
          value: data.storeStockRoomId,
          label: data.storeStockRoom,
        },
      ]);
      setSelectedDemandNo([
        {
          value: data.storeDemandId,
          label: data.storeDemandNo,
        },
      ]);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const storeDemandDetailsList = async (demandId) => {
    try {
      const {
        data: { storeDemandDetailsDtoList },
      } = await API.get(`/store-demands/${demandId}`);

      let list = storeDemandDetailsDtoList.map((demand) => ({
        key: demand.id,
        demandItemId: demand.id,
        partId: demand.partId,
        partNo: demand.parentPartId === null ? demand.partNo : '',
        alterPart: demand.parentPartId !== null ? demand.partNo : '',
        partClassification: demand.partClassification, // for filtering
        availablePart: demand.availablePart,
        quantityDemanded: demand.parentPartId !== null ? '' : demand.quantityDemanded,
        parentPartId: demand.parentPartId,
        issuedQuantity: 0,
        alreadyIssuedQuantity: 0,
        totalIssuedQty:demand.totalIssuedQty,
        cardLineNo: demand.cardLineNo,
        uomId: demand.unitMeasurementCode,
        priority: demand.priorityType,
        showedPriority: demand.parentPartId !== null ? '' :demand.priorityType,
      }));
      setData(list);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const approveDemandDetails = async (demandId) => {
    if (sdId?.id) {
      form.setFieldsValue({
        demandId: {
          value: sdId?.id,
          label: sdId?.voucherNo,
        },
      });
      setSelectedDemandNo([
        {
          value: sdId?.id,
          label: sdId?.voucherNo,
        },
      ]);
      //setDemandId(sdId?.id);
    }
    await storeDemandDetailsList(sdId?.id);
  };

  const validateQuantity = (data) => {
    let warning = true;
    data.forEach((item) => {
      if (item.issuedQuantity > 0) {
        warning = false;
        return warning;
      }
    });
    return warning;
  };

  function getUomId(uomCode) {
    let unitMeasure = uom.find((data)=>data.code===uomCode)
    return unitMeasure.id;
  }

  const onFinish = async (values) => {
    const isEmpty = validateQuantity(data);
    if (isEmpty) {
      notifyError('At least one parts Issue Quantity must be greater than 0!');
      return;
    }

    const modifiedValue = {
      demandId: values.demandId.value,
      remarks: values.remarks,
      storeStockRoomId: values.storeStockRoomId.value,
      stockRoomType: values.stockRoomType,
      partClassification: values.partClassification,
      storeIssueItems: data
        .filter((item) => item.issuedQuantity > 0)
        .map((data,index) => {
          return {
            id: data.id,
            demandItemId: data.demandItemId,
            issuedQuantity: data.issuedQuantity,
            alreadyIssuedQuantity: id ? data.alreadyIssuedQuantity : 0,
            cardLineNo: data.cardLineNo,
            grnAndSerialDtoList: data.grnAndSerialDtoList,
            uomId: getUomId(data.uomId),
            remark: data.remark,
            priorityType: data.priority,
            parentPartId:data.parentPartId
          };
        }),
    };

    try {
      if (id) {
        await IssueDemandService.updateIssueDemand(id, modifiedValue);
      } else {
        await IssueDemandService.saveIssueDemand(modifiedValue);
      }
      form.resetFields();
      navigate('/store/pending-issues');
      notification['success']({
        message: id ? 'Successfully updated!' : 'Successfully added!',
      });
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  const onReset = () => {
    if (id) {
      getIssueDemand().then((r) => console.log(r));
    } else if (sdId?.id) {
      setSelectedStockRoom([]);
      approveDemandDetails(sdId?.id).then((r) => console.log(r));
    } else {
      form.resetFields();
      setSelectedDemandNo([]);
      setSelectedStockRoom([]);
      setData([]);
    }
  };

  /**
   *  Creating new Issue when data will come from Approved Demand
   *
   * **/
  useEffect(() => {
    sdId?.id && approveDemandDetails(sdId?.id).then((r) => console.log(r));
  }, [sdId?.id]);

  useEffect(() => {
    id && getIssueDemand();
  }, [id]);

  return (
    <>
      <CommonLayout>
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <Link to="/store">
                <i className="fas fa-archive" /> &nbsp;Store
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {route === 'list' ? (
                <Link to="/store/pending-issues">&nbsp;Pending Issues</Link>
              ) : (
                'Issue'
              )}
            </Breadcrumb.Item>

            <Breadcrumb.Item>&nbsp;{id ? 'edit' : 'add'}</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>
        <Permission
          permission={[
            'STORE_PARTS_ISSUE_ISSUE_DEMAND_SAVE',
            'STORE_PARTS_ISSUE_ISSUE_DEMAND_EDIT',
          ]}
          showFallback
        >
          <ARMForm
            {...formLayout}
            form={form}
            name="issueDemand"
            onFinish={onFinish}
            scrollToFirstError
          >
            <ARMCard
              title={
                route==='list'
                  ? getLinkAndTitle('Issue', '/store/pending-issues')
                  : getLinkAndTitle('Issue', '/store')
              }
            >
              <Row>
                <Col
                  sm={20}
                  md={10}
                >
                  <Form.Item
                    name="voucherNo"
                    label="Issue Voucher No"
                    hidden={!id}
                  >
                    <Input
                      disabled
                      style={{ backgroundColor: '#fff', color: '#000' }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="storeStockRoomId"
                    label="Stock Room"
                    rules={[
                      {
                        required: true,
                        message: 'Stock Room is required!',
                      },
                    ]}
                  >
                    <DebounceSelect
                      debounceTimeout={1000}
                      mapper={(v) => ({
                        value: v.stockRoomId,
                        label: v.stockRoomCode,
                      })}
                      showSearch
                      value={selectedStockRoom}
                      placeholder="--- Select Stock Room ---"
                      url="store-management/store-stock-rooms/search"
                      selectedValue={selectedStockRoom}
                      onChange={(newValue) => {
                        setSelectedStockRoom(newValue);
                      }}
                      style={{
                        width: '100%',
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="stockRoomType"
                    label="Stock Room Type"
                    rules={[
                      {
                        required: true,
                        message: 'Stock Room Type is required!',
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      placeholder="--- Select Stock Room Type ---"
                    >
                      <Option value="Issue/Demand Consumable">
                        Issue/Demand Consumable
                      </Option>
                      <Option value="Issue/Demand Component">
                        Issue/Demand Component
                      </Option>
                      <Option value="Store/Return Consumable">
                        Store/Return Consumable
                      </Option>
                      <Option value="Store/Return Component">
                        Store/Return Component
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="demandId"
                    label="Demand No"
                    rules={[
                      {
                        required: true,
                        message: 'Demand No. is required!',
                      },
                    ]}
                  >
                    <DebounceSelect
                      disabled={!!id}
                      debounceTimeout={1000}
                      mapper={(v) => ({
                        value: v.id,
                        label: v.voucherNo,
                      })}
                      showSearch
                      value={selectedDemandNo}
                      placeholder="--- Select Demand No. ---"
                      url="/store-demands/search"
                      params={{ type: 'APPROVED' }}
                      selectedValue={selectedDemandNo}
                      onChange={(newValue) => {
                        //setDemandId(newValue.value)
                        setSelectedDemandNo(newValue);
                        storeDemandDetailsList(newValue.value);
                      }}
                      style={{
                        width: '100%',
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="partClassification"
                    label="Part Type"
                    rules={[
                      {
                        required: true,
                        message: 'Part Type. is required!',
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      placeholder="--- Select Part Type ---"
                      disabled={!(selectedDemandNo && !id)}
                    >
                      <Option value={1}>ROTABLE</Option>
                      <Option value={2}>CONSUMABLE</Option>
                      <Option value={3}>EXPENDABLE</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="remarks"
                    label="Remarks"
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                </Col>
              </Row>
            </ARMCard>
            &nbsp;
            <ARMCard title="Issue Parts List">
              <ResponsiveTable>
                <Table
                  components={components}
                  bordered
                  dataSource={filteredDemands}
                  columns={mergedColumns}
                  rowClassName={() => 'editable-row'}
                  pagination={false}
                />
              </ResponsiveTable>
            </ARMCard>
            <Modal
              title="Serial"
              centered
              open={open}
              onOk={() => {
                const val = form.getFieldValue('serial' + uniqueModalId);

                const serialIds = new Set();
                if (!val || (isArray(val) && val.length === 0)) {
                  notifyWarning('Please Provide Lot/Serial and Grn No!');
                  return;
                }
                for (let i = 0; i < val.length; i++) {
                  if (!val[i]?.serialId) {
                    // !val[i].grnNo || (This condition will appear again)
                    notifyError('Lot/Serial and Grn No is Required');
                    return;
                  }
                  if (serialIds.has(val[i].serialId)) {
                    notifyError("Serial can't be same!");
                    return;
                  } else {
                    serialIds.add(val[i].serialId);
                  }
                }
                if (partClassification !== 2) {
                  if (val.length > quantityIssued) {
                    notifyWarning(
                      'Count of Serial can not be greater than issue Quantity!'
                    );
                    return;
                  } else if (val.length < quantityIssued) {
                    notifyWarning(
                      'Count of serial no. and quantity must be equal!'
                    );
                    return;
                  }
                }

                const newData = [...filteredDemands];
                const index = newData.findIndex(
                  (d) => d.demandItemId === uniqueModalId
                );
                const item = newData[index];
                const totalQuantity = val?.reduce(
                  (initial, current) => current.quantity + initial,
                  0
                );
                newData.splice(index, 1, {
                  ...item,
                  grnAndSerialDtoList: val,
                  issuedQuantity: totalQuantity || 0,
                });

                setOpen(false);
                setData(newData);
              }}
              onCancel={() => {
                const val = form.getFieldValue('serial' + uniqueModalId);
                if (!val || (isArray(val) && val.length === 0)) {
                  notifyWarning('Please Provide Serial and Grn No!');
                }
                setOpen(false);
              }}
              maskClosable={false}
              width={1200}
            >
              <RibbonCard ribbonText="SERIAL INFOS">
                <Form.List name={'serial' + uniqueModalId}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }, index) => {
                        return (
                          <Row
                            key={key}
                            gutter="10"
                          >
                            <Col
                              xs={24}
                              sm={24}
                              md={partClassification === 2 ? 6 : 7}
                            >
                              <Form.Item
                                {...restField}
                                name={[name, 'serialId']}
                                rules={[
                                  {
                                    required: quantityIssued > 0,
                                    message: 'required!',
                                  },
                                ]}
                              >
                                <Select
                                  style={{ width: '150%' }}
                                  placeholder={
                                    partClassification === 2
                                      ? '--Lot no--'
                                      : '--Serial No--'
                                  }
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .includes(input.toLowerCase())
                                  }
                                  onChange={(value) => {
                                    let serialGrnInfos = form.getFieldValue(
                                      'serial' + uniqueModalId
                                    );
                                    const { grnNo, price, quantity } =
                                      serial.find((s) => s.id === value);

                                    const serialInfos = serialGrnInfos.map(
                                      (info, idx) => {
                                        if (index === idx) {
                                          return {
                                            ...info,
                                            grnNo: grnNo,
                                            price: price,
                                            quantity: quantity || 1,
                                          };
                                        } else {
                                          return info;
                                        }
                                      }
                                    );
                                    form.setFieldValue(
                                      'serial' + uniqueModalId,
                                      serialInfos
                                    );
                                  }}
                                >
                                  {serial?.map((data) => (
                                    <Option
                                      key={data.id}
                                      value={data.id}
                                    >
                                      {data.serialNo}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col
                              xs={24}
                              sm={24}
                              md={partClassification === 2 ? 6 : 7}
                            >
                              <Form.Item
                                style={{ width: '150%' }}
                                {...restField}
                                name={[name, 'grnNo']}
                              >
                                <Input
                                  placeholder="GRN No."
                                  disabled={
                                    !!form.getFieldValue(
                                      'serial' + uniqueModalId
                                    )[index]?.grnNo
                                  }
                                />
                              </Form.Item>
                            </Col>
                            <Col
                              xs={24}
                              sm={24}
                              md={partClassification === 2 ? 6 : 7}
                            >
                              <Form.Item
                                style={{ width: '150%' }}
                                {...restField}
                                name={[name, 'price']}
                              >
                                <Input
                                  disabled
                                  placeholder="Unit Rate"
                                />
                              </Form.Item>
                            </Col>
                            {partClassification === 2 && (
                              <Col
                                xs={24}
                                sm={24}
                                md={4}
                              >
                                <Form.Item
                                  style={{ width: '150%' }}
                                  {...restField}
                                  name={[name, 'quantity']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'required!',
                                    },
                                    {
                                      type: 'number',
                                      min: 1,
                                      message: 'Invalid!',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    min={1}
                                    type="number"
                                    style={{ width: '100%' }}
                                    placeholder="quantity"
                                    //disabled={}
                                  />
                                </Form.Item>
                              </Col>
                            )}
                            <Col
                              xs={24}
                              sm={24}
                              md={1}
                            >
                              <Button
                                danger
                                onClick={() => {
                                  remove(index);
                                }}
                              >
                                <MinusCircleOutlined />
                              </Button>
                            </Col>
                          </Row>
                        );
                      })}
                      <Form.Item wrapperCol={{ ...formLayout.labelCol }}>
                        <ARMButton
                          onClick={() => {
                            add();
                          }}
                          icon={<PlusOutlined />}
                          type="primary"
                        >
                          Add field
                        </ARMButton>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </RibbonCard>
            </Modal>
            <SubmitReset
              id={id}
              onReset={onReset}
            />
          </ARMForm>
        </Permission>
      </CommonLayout>
    </>
  );
};

export default IssueDemand;
