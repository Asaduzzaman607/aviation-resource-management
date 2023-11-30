import {
  Breadcrumb,
  Col,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Space,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useARMFileUpload } from '../../../lib/common/ARMFileUpload';
import ARMForm from '../../../lib/common/ARMForm';
import { getErrorMessage } from '../../../lib/common/helpers';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import POService from '../../../service/procurment/POService';
import QualityManufacturerService from '../../../service/quality/QualityManufacturerService';
import QualitySupplierService from '../../../service/quality/QualitySupplierService';
import SerialService from '../../../service/store/SerialService';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import DebounceSelect from '../../common/DebounceSelect';
import CommonLayout from '../../layout/CommonLayout';
import { conditions } from '../quotation/InnerFieldsQuotation';
import CsPoDetails from './CsPoDetails';
import ManualPO from './ManualPO';
import { invoiceTo, shipTo, tac } from './poData';

const { TextArea } = Input;
const { Option } = Select;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const AMOUNT = 0;

const Po = () => {
  const { id } = useParams();
  const location = useLocation();
  const locationData = location?.state?.pendingOrApproved
    ? location.state.pendingOrApproved
    : '';

  const [form] = Form.useForm();
  const [showDiscount, setShowDiscount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [csID, setCsID] = useState(null);
  const [value, setValue] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRfqModal, setIsRfqModal] = useState(false);
  const [po, setPo] = useState([]);
  const [poId, setPoId] = useState();
  const navigate = useNavigate();
  const [manualOrNot, setManualOrNot] = useState('');
  const [inputType, setInputType] = useState('');
  const [vendorQuotationId, setVendorQuotationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const [orderType, setOrderType] = useState(null);
  const [serial, setSerial] = useState([]);
  const [exchangeType, setExchangeType] = useState([]);
  const [exchangeTypeInput, setExchangeTypeInput] = useState([]);
  const [condList, setCondList] = useState([]);
  const [fullDataSet, setFullDataSet] = useState({});
  const {
    handleFileInput,
    selectedFile,
    setSelectedFile,
    handleFilesUpload,
    fileProcessForEdit,
  } = useARMFileUpload();
  const discountedAmount = (showDiscount / 100) * subTotal;
  const grandTotal = subTotal - discountedAmount;
  const selectCsId = Form.useWatch('csId', form);
  const [requisitionId, setRequisitionId] = useState(null);
  const requisition = Form.useWatch('requisitionId', form);
  const reqId = requisition?.value;


  const handleChange = async (value) => {
    if (!value) {
      setVendorList([]);
    }
    if (value === 'SUPPLIER') {
      let {
        data: { model },
      } = await QualitySupplierService.getAllSupplier(
        true,
        'APPROVED',
        'QUALITY'
      );

      setVendorList(
        model.map((m) => ({
          vendorId: m.id,
          vendorName: m.name,
        }))
      );
    }
    if (value === 'MANUFACTURER') {
      const {
        data: { model },
      } = await QualityManufacturerService.getAllManufacturer(
        true,
        'APPROVED',
        'QUALITY'
      );
      setVendorList(
        model.map((m) => ({
          vendorId: m.id,
          vendorName: m.name,
        }))
      );
    }
  };

  const serialDetails = async (partId) => {
    try {
      let { data } = await SerialService.getAllSerial(500, {
        partId: partId,
        onlyAvailable: true,
      });
      setSerial(data.model);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getPOById = async () => {
    try {
      setLoading(true);
      let fileList = [];
      const { data } = await POService.getPOById(id);
      if (data?.vendorQuotationViewModel?.attachments != null) {
        fileList = fileProcessForEdit(
          data?.vendorQuotationViewModel?.attachments
        );
      }
      setAttachmentList(fileList);
      setSelectedFile(fileList);
      setOrderType(data.orderType);
      setManualOrNot(data.inputType);
      await handleChange(data.vendorQuotationViewModel.vendorType);
      setInputType(data.inputType);
      const testData = data.vendorQuotationViewModel;
      setFullDataSet(testData);
      setVendorQuotationId(data.vendorQuotationViewModel.id);
      setManualOrNot(data.inputType);
      serialDetails(data.vendorQuotationViewModel.partId);
      setRequisitionId(data?.requisitionId);
      let exType = [];
      let vendorQuotationDetail = [];
      const condList = [];
      data?.vendorQuotationViewModel?.vendorQuotationDetails?.forEach(
        (item) => {
          vendorQuotationDetail.push({
            ...item,
            loanStartDate: item.loanStartDate
              ? moment(item.loanStartDate)
              : null,
            loanEndDate: item.loanEndDate ? moment(item.loanEndDate) : null,
            partId:
              data.inputType === 'MANUAL' && reqId
                ? item.partId
                : { label: item.partNo, value: item.partId },
            alternatePartId: {
              label: item.alternatePartNo,
              value: item.alternatePartId,
            },
            uomId: {
              label: item.unitMeasurementCode,
              value: item.unitMeasurementId,
            },
            condition: conditions.includes(item.condition)
              ? item.condition
              : 'Other',
            other: conditions.includes(item.condition) ? '' : item.condition,
          });
          if (item.exchangeType) {
            exType.push(item.exchangeType);
          } else {
            exType.push('');
          }
          if (conditions.includes(item.condition)) {
            condList.push(item.condition);
          } else {
            condList.push('Other');
          }
        }
      );
      const testData1 = {
        ...data,
        ...testData,
      };
      setExchangeType(exType);
      setCondList(condList);
      form.setFieldsValue({
        ...testData1,
        orderNo: data.orderNo,
        requisitionId: {
          value: data?.requisitionId,
          label: data?.requisitionNo,
        },
        validUntil: data?.vendorQuotationViewModel.validUntil
          ? moment(testData1.validUntil)
          : null,
        date: data?.vendorQuotationViewModel.date
          ? moment(testData1.date)
          : null,
        vendorQuotationDetails: vendorQuotationDetail,
        csId: { label: data.csNo, value: data.csId },
      });
    } catch (e) {
      notification['error']({ message: getErrorMessage(e) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    id && getPOById();
  }, [id]);

  useEffect(() => {
    if (!reqId) return;
    setRequisitionId(reqId);
  }, [reqId]);

  const onFinish = async (values) => {
    //file uploading
    const files = await handleFilesUpload('PO', selectedFile);
    let vendorQuotationDetails = values.vendorQuotationDetails?.map((d) => {
      return {
        ...d,
        partId: manualOrNot === 'MANUAL' && reqId ? d.partId : d.partId.value,
        loanStartDate: d['loanStartDate']?.format('YYYY-MM-DD'),
        loanEndDate: d['loanEndDate']?.format('YYYY-MM-DD'),
        alternatePartId: d.alternatePartId?.value,
        uomId: d.uomId.value,
        condition: d.condition === 'Other' ? d.other : d.condition,
      };
    });

    let modifiedValue = {
      id: id,
      requisitionId: values.inputType === 'MANUAL' ? requisitionId : null,
      vendorQuotationDto: {
        ...values,
        date: values['date']?.format('YYYY-MM-DD'),
        validUntil: values['validUntil']?.format('YYYY-MM-DD'),
        id: vendorQuotationId,
        quoteRequestVendorId: fullDataSet.quoteRequestVendorId,
        attachments: files,
        rfqType: 'PROCUREMENT',
        vendorQuotationDetails: vendorQuotationDetails,
        vendorQuotationFees: values.vendorQuotationFees?.filter(
          (fee) => fee.feeName
        ),
      },
      discountType: values.discountType,
      discount: values.discount,
      remark: values.remark,
      tac: values.tac,
      shipTo: values.shipTo,
      invoiceTo: values.invoiceTo,
      orderType: values.orderType,
      orderNo: values.orderNo,
      inputType: values.inputType,
      partOrderDtoList: value,
      rfqType: 'PROCUREMENT',
    };

    try {
      if (inputType === 'MANUAL' || id) {
        if (id) {
          await POService.manualUpdatePO(id, modifiedValue);
        } else {
          await POService.manualSavePO(modifiedValue);
        }
      } else {
        await POService.SavePO(modifiedValue);
      }
      notification['success']({
        message: id ? 'Updated successfully' : 'Saved successfully',
      });
      form.resetFields();
      // const { data } = await POService.poList(value.length);
      // setPo(data.model);
      // setIsModalOpen(true);
      navigate('/material-management/pending-purchase-order');
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  const onReset = () => {
    if (!id) {
      form.resetFields();
      setCsID(false);
    } else {
      getPOById();
    }
  };

  function handleInputTypeChange(e) {
    if (e === '' || e === undefined || e === null) {
      setManualOrNot('');
      setInputType('');
    } else {
      setManualOrNot(e);
      setInputType(e);
    }
  }


  const onChangeRequisition = () => {
    const quotationDetails = form.getFieldValue('vendorQuotationDetails');
    const currentRequisitionId = form.getFieldValue('requisitionId');

    const quotationList = quotationDetails.map((quotation) => {
      if (!currentRequisitionId || quotation.requisitionId !== currentRequisitionId) {
        return {
          ...quotation,
          exchangeType: null,
          partId: null,
          alternatePartId: null,
          partDescription: null,
          uomId: null,
          partSerialId: null,
        };
      } else {
        return quotation;
      }
    });

    form.setFieldValue('vendorQuotationDetails', quotationList);
  };

  const route = useSelector((state) => state.routeLocation.previousRoute);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-shopping-basket" />
            <Link to="/material-management">&nbsp; Material Management</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {route === 'pendingList' ? (
              <Link to={`/material-management/pending-purchase-order`}>
                Pending Order List
              </Link>
            ) : route === 'approvedList' ? (
              <Link to={`/material-management/approved-purchase-order`}>
                Approved Order List
              </Link>
            ) : (
              <Link to={`/material-management/pending-purchase-order`}>
                Order List
              </Link>
            )}
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'Edit' : 'Add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission={[
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_ORDER_MATERIAL_MANAGEMENT_PURCHASE_ORDER_SAVE',
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_ORDER_MATERIAL_MANAGEMENT_PURCHASE_ORDER_EDIT',
        ]}
        showFallback
      >
        <ARMCard
          title={
            route === 'pendingList'
              ? getLinkAndTitle(
                  'Orders',
                  `/material-management/pending-purchase-order`
                )
              : route === 'approvedList'
              ? getLinkAndTitle(
                  'Orders',
                  `/material-management/approved-purchase-order`
                )
              : getLinkAndTitle('Orders', '/material-management')
          }
        >
          <ARMForm
            {...layout}
            form={form}
            name="basic"
            initialValues={{
              tac: tac,
              shipTo: shipTo,
              invoiceTo: invoiceTo,
              poDetailsDtoList: [],
              partOrderDtoList: [],
              discountType: AMOUNT,
              //discount: 0,
              vendorQuotationDetails: [
                {
                  isActive: true,
                  id: null,
                },
              ],
              vendorQuotationFees: [
                {
                  isActive: true,
                  id: null,
                },
              ],
            }}
            onFinish={onFinish}
            autoComplete="off"
            style={{
              backgroundColor: '#ffffff',
            }}
            scrollToFirstError
          >
            <Row>
              <Col
                sm={20}
                md={10}
              >

                <Form.Item
                    name="orderNo"
                    label="Order No"
                    rules={[
                      {
                        required: true,
                        message: 'This field is required!',
                      },
                    ]}
                >
                  <Input/>
                </Form.Item>
                <Form.Item
                  label="Order Type"
                  name="orderType"
                  rules={[
                    {
                      required: true,
                      message: 'This field is required!',
                    },
                  ]}
                >
                  <Select
                    placeholder="--- Select Order Type ---"
                    onChange={(e) => setOrderType(e)}
                    allowClear
                  >
                    <Option value={'PURCHASE'}>Purchase</Option>
                    <Option value={'LOAN'}>Loan</Option>
                    <Option value={'REPAIR'}>Repair</Option>
                    <Option value={'EXCHANGE'}>Exchange</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Input Type"
                  name="inputType"
                  rules={[
                    {
                      required: true,
                      message: 'This field is required!',
                    },
                  ]}
                >
                  <Select
                    disabled={!!id}
                    placeholder="--- Select Input Type ---"
                    allowClear
                    onChange={(e) => {
                      handleInputTypeChange(e);
                    }}
                  >
                    <Option value="CS">CS</Option>
                    <Option value="MANUAL">Manual</Option>
                  </Select>
                </Form.Item>

                {manualOrNot === 'MANUAL' && (
                  <>
                    <Form.Item
                      name="requisitionId"
                      label="Requisition"
                      rules={[
                        {
                          required: false,
                          message: 'This field is required!',
                        },
                      ]}
                    >
                      <DebounceSelect
                        mapper={(v) => ({
                          label: v.voucherNo,
                          value: v.id,
                        })}
                        showSearch
                        url={`/procurement-requisitions/search?page=1&size=20`}
                        params={{ type: 'APPROVED' }}
                        disabled={!!id}
                        onChange={onChangeRequisition}

                        //selectedValue={requisition}
                        allowClear
                      />
                    </Form.Item>
                  </>
                )}
                {/*{manualOrNot === 'MANUAL' && id && (*/}
                {/*  <Form.Item*/}
                {/*    name="requisition"*/}
                {/*    label="Requisition"*/}
                {/*  >*/}
                {/*    <Input disabled />*/}
                {/*  </Form.Item>*/}
                {/*)}*/}

                {manualOrNot === 'CS' && (
                  <>
                    <Form.Item
                      label="Select CS"
                      name="csId"
                      required
                      hidden={manualOrNot === 'MANUAL' || manualOrNot === ''}
                    >
                      <DebounceSelect
                        disabled={!!id}
                        placeholder={'Select CS'}
                        mapper={(v) => ({
                          label: v.csNo,
                          value: v.id,
                        })}
                        searchParam="query"
                        showSearch
                        url={`/procurement/comparative-statements/final-management/search?page=1&size=10`}
                        selectedValue={selectCsId}
                        params={{ type: 'APPROVED', orderType: orderType }}
                        onChange={(newValue) => {
                          setCsID(newValue.value);
                          setShowDiscount(0);
                          setSubTotal(0);
                        }}
                      />
                    </Form.Item>
                  </>
                )}

                <Form.Item
                  name="shipTo"
                  label="Ship To"
                >
                  <TextArea rows={4} />
                </Form.Item>

                <Form.Item
                  name="invoiceTo"
                  label="Invoice To"
                >
                  <TextArea rows={4} />
                </Form.Item>

                <Form.Item
                  name="partOrderDtoList"
                  hidden
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col
                sm={20}
                md={10}
              >
                <Form.Item
                  name="tac"
                  label="Terms & Conditions"
                >
                  <TextArea rows={4} />
                </Form.Item>

                <Form.Item
                  name="remark"
                  label="Remark"
                >
                  <TextArea rows={4} />
                </Form.Item>

                <Form.Item
                  name="discountType"
                  label="Discount Type"
                >
                  <Select placeholder="--- Select Discount Type ---">
                    <Option value={0}>Amount</Option>
                    <Option value={1}>Percentage</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="discount"
                  label="Discount"
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>

            {manualOrNot === 'CS' && csID && (
              <>
                <ARMCard
                  title="Purchase Order Detail"
                  style={{ marginTop: '10px' }}
                >
                  {csID ? (
                    <CsPoDetails
                      id={csID}
                      form={form}
                      setSubTotal={setSubTotal}
                      subTotal={subTotal}
                      value={value}
                      setValue={setValue}
                    />
                  ) : (
                    <CsPoDetails
                      id={id}
                      form={form}
                      setSubTotal={setSubTotal}
                      subtotal={subTotal}
                      value={value}
                      setValue={setValue}
                    />
                  )}
                </ARMCard>

                <Form.Item
                  wrapperCol={{ ...layout.wrapperCol }}
                  style={{ marginTop: '30px' }}
                >
                  <Space size="small">
                    <ARMButton
                      type="primary"
                      htmlType="submit"
                    >
                      Submit
                    </ARMButton>
                    <ARMButton
                      onClick={onReset}
                      type="primary"
                      danger
                    >
                      Reset
                    </ARMButton>
                  </Space>
                </Form.Item>
              </>
            )}
            {(manualOrNot === 'MANUAL' || id) && (
              <ManualPO
                poId={id}
                form={form}
                loading={loading}
                manualOrNot={manualOrNot}
                attachmentList={attachmentList}
                handleFileInput={handleFileInput}
                handleChange={handleChange}
                vendorList={vendorList}
                serial={serial}
                setSerial={setSerial}
                exchangeType={exchangeType}
                setExchangeTypeInput={setExchangeTypeInput}
                onReset={onReset}
                requisitionId={requisitionId}
                reqId={reqId}
                cond={condList}
              />
            )}
          </ARMForm>
          {/* <Modal
            title="Purchase Order List"
            style={{
              top: 20,
              zIndex: 9999,
            }}
            onOk={(e) => {
              setIsModalOpen(false);
              navigate('/material-management/pending-purchase-order');
            }}
            onCancel={(e) => {
              setIsModalOpen(false);
              navigate('/material-management/pending-purchase-order');
            }}
            centered
            visible={isModalOpen}
            width={1080}
            footer={null}
          >
            <ResponsiveTable>
              <ARMTable>
                <thead>
                  <tr>
                    <th>PO No.</th>
                    <th>Create Logistic RFQ</th>
                  </tr>
                </thead>
                <tbody>
                  {po?.map((data) => (
                    <tr key={data.id}>
                      <td>{data.orderNo}</td>
                      <td>
                        <ARMButton
                          type="primary"
                          size="small"
                          onClick={() => {
                            setIsRfqModal(true);
                            setPoId(data.id);
                          }}
                        >
                          <PlusOutlined />
                        </ARMButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ARMTable>
            </ResponsiveTable>
          </Modal>
          <Modal
            title="Shipment Provider Rfq"
            style={{
              top: 20,
              zIndex: 9999,
            }}
            onOk={(e) => setIsRfqModal(false)}
            onCancel={(e) => setIsRfqModal(false)}
            centered
            visible={isRfqModal}
            width={1080}
            footer={null}
          >
            <ShipmentProviderRfqAddForm
              id={poId}
              setIsRfqModal={setIsRfqModal}
            />
          </Modal> */}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default Po;
