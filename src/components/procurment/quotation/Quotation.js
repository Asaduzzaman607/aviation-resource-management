import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
  notification,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useARMFileUpload } from '../../../lib/common/ARMFileUpload';
import ARMForm from '../../../lib/common/ARMForm';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { getErrorMessage } from '../../../lib/common/helpers';
import {
  notifyError,
  notifyResponseError,
  notifySuccess,
} from '../../../lib/common/notifications';
import { formLayout } from '../../../lib/constants/layout';
import API from '../../../service/Api';
import ManufacturerService from '../../../service/ManufacturerService';
import SupplierService from '../../../service/SupplierService';
import {
  default as QuotationServices,
  default as quotationServices,
} from '../../../service/procurment/QuotationServices';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import DebounceSelect from '../../common/DebounceSelect';
import ARMButton from '../../common/buttons/ARMButton';
import RibbonCard from '../../common/forms/RibbonCard';
import CommonLayout from '../../layout/CommonLayout';
import FormControl from '../../store/common/FormControl';
import Loading from '../../store/common/Loading';
import SubmitReset from '../../store/common/SubmitReset';
import InnerFieldsQuotation, { conditions } from './InnerFieldsQuotation';

const Quotation = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { id } = useParams();
  const [part, setPart] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [exchangeType, setExchangeType] = useState([]);
  const [vendorQuotationPartIds, setVendorQuotationPartIds] = useState([]);
  const [condList, setCondList] = useState([]);
  const {
    handleFileInput,
    selectedFile,
    setSelectedFile,
    handleFilesUpload,
    fileProcessForEdit,
  } = useARMFileUpload();

  let feesForm = [
    {
      feeName: '',
      feeCost: null,
      currencyId: null,
    },
  ];

  feesForm = Form.useWatch('vendorQuotationFees', form) || feesForm;

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const PartDetails = async (rfqData) => {
    try {
      const { data } = await quotationServices.getQuotationByRFQId(rfqData);
      setPart(data.rfqPartViewModels);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getVendor = async (value) => {
    if (!value) setVendor([]);
    else {
      const { data } = await QuotationServices.vendorSearch(true, value);
      setVendor(data.model);
    }
  };

  const getQuotation = async () => {
    try {
      setLoading(true);
      let fileList = [];
      const { data } = await quotationServices.getQuotationById(id);

      if (data.attachments != null) {
        fileList = fileProcessForEdit(data?.attachments);
      }

      setAttachmentList(fileList);
      setSelectedFile(fileList);

      let exType = [];
      let vendorQuotationDetail = [];
      let vendorQuotatedPartId = [];
      const condList = [];
      data.vendorQuotationDetails?.forEach((data) => {
        vendorQuotationDetail.push({
          ...data,
          loanStartDate: data.loanStartDate ? moment(data.loanStartDate) : null,
          loanEndDate: data.loanEndDate ? moment(data.loanEndDate) : null,
          alternatePartId: {
            label: data.alternatePartNo,
            value: data.alternatePartId,
          },
          uomId: {
            label: data.unitMeasurementCode,
            value: data.unitMeasurementId,
          },
          condition: conditions.includes(data.condition)
            ? data.condition
            : 'Other',
          other: conditions.includes(data.condition) ? '' : data.condition,
        });
        vendorQuotatedPartId.push(data.partId);
        if (data.exchangeType) {
          exType.push(data.exchangeType);
        } else {
          exType.push('');
        }
        if (conditions.includes(data.condition)) {
          condList.push(data.condition);
        } else {
          condList.push('Other');
        }
      });
      setCondList(setCondList);
      setExchangeType(exType);
      setVendorQuotationPartIds(vendorQuotatedPartId);
      await getVendor(data.quoteRequestId);
      await PartDetails(data.quoteRequestId);
      form.setFieldsValue({
        ...data,
        quoteRequestId: {
          label: data.quoteRequestNo,
          value: data.quoteRequestId,
        },
        date: data.date ? moment(data.date) : null,
        validUntil: data.validUntil ? moment(data.validUntil) : null,
        vendorQuotationDetails: vendorQuotationDetail,
      });
    } catch (error) {
      notifyResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const getVendorDetails = async (vId) => {
    const { vendorType, vendorId } = vendor.find((v) => v.id === vId);
    try {
      let vendorDetails = {};
      if (vendorType === 'MANUFACTURER') {
        const { data } = await ManufacturerService.getManufacturerById(
          vendorId
        );
        vendorDetails = {
          officePhone: data.officePhone,
          website: data.website,
          address: data.address,
        };
      } else {
        const { data } = await SupplierService.getSupplierById(vendorId);
        vendorDetails = {
          officePhone: data.officePhone,
          website: data.website,
          address: data.address,
        };
      }
      form.setFieldsValue({
        vendorAddress: vendorDetails?.address,
        vendorTel: vendorDetails?.officePhone,
        vendorWebsite: vendorDetails?.website,
      });
    } catch (error) {
      notifyError(getErrorMessage(error));
    }
  };

  const clearVendorDetails = () => {
    form.setFieldsValue({
      vendorAddress: null,
      vendorTel: null,
      vendorWebsite: null,
    });
  };

  function getMovMoqMlvValue(value) {
    if (value === '' || value === undefined || value === null) {
      return 0;
    } else {
      return value;
    }
  }

  const onFinish = async (values) => {
    //file uploading
    const files = await handleFilesUpload('Quotation', selectedFile);

    let vendorQuotationDetail = [];
    values.vendorQuotationDetails.map((data) => {
      vendorQuotationDetail.push({
        ...data,
        loanStartDate: data['loanStartDate']?.format('YYYY-MM-DD'),
        loanEndDate: data['loanEndDate']?.format('YYYY-MM-DD'),
        mov: getMovMoqMlvValue(data.mov),
        moq: getMovMoqMlvValue(data.moq),
        mlv: getMovMoqMlvValue(data.mlv),
        alternatePartId: data.alternatePartId?.value,
        uomId: data.uomId?.value,
        condition: data.condition === 'Other' ? data.other : data.condition,
      });
    });

    const quotationFees = values.vendorQuotationFees?.filter(
      (fee) => fee.feeName
    );

    const data = {
      ...values,
      quoteRequestId: values.quoteRequestId.value,
      date: values['date']?.format('YYYY-MM-DD'),
      validUntil: values['validUntil']?.format('YYYY-MM-DD'),
      attachments: files,
      vendorQuotationDetails: vendorQuotationDetail,
      vendorQuotationFees: quotationFees,
    };

    try {
      if (id) {
        await quotationServices.updateQuotation(id, data);
      } else {
        await quotationServices.SaveQuotation(data);
      }
      form.resetFields();
      navigate('/material-management/quotation');
      notifySuccess(id ? 'Successfully updated!' : 'Successfully added!');
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const onReset = () => {
    if (!id) {
      form.resetFields();
    } else {
      getQuotation();
    }
  };

  //fetching currencies
  useEffect(() => {
    (async () => {
      try {
        const {
          data: { model },
        } = await API.get('store/currencies');
        setCurrencies(model);
      } catch (e) {
        notifyError(getErrorMessage(e));
      }
    })();
  }, []);

  useEffect(() => {
    id && getQuotation(id);
  }, [id]);

  let rfqNo = Form.useWatch('quoteRequestId', form);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fa fa-shopping-basket" />
            <Link to="/material-management">&nbsp; material-management</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/material-management/quotation">&nbsp;Quotation</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission={[
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_QUOTE_REQUEST_MATERIAL_MANAGEMENT_REQUEST_FOR_QUOTATION_SAVE',
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_QUOTE_REQUEST_MATERIAL_MANAGEMENT_REQUEST_FOR_QUOTATION_EDIT',
        ]}
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            id ? 'Update Quotation' : 'Add Quotation',
            '/material-management/quotation'
          )}
        >
          {!loading ? (
            <>
              <ARMForm
                scrollToFirstError
                {...layout}
                form={form}
                name="basic"
                initialValues={{
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
              >
                <Row>
                  <Col
                    sm={20}
                    md={10}
                  >
                    <Form.Item
                      name="quoteRequestId"
                      label="RFQ"
                      rules={[
                        {
                          required: true,
                          message: 'RFQ No is required!',
                        },
                      ]}
                    >
                      <DebounceSelect
                        mapper={(v) => ({
                          label: v.rfqNo,
                          value: v.id,
                        })}
                        showSearch
                        placeholder="---Select RFQ---"
                        url={`/procurement/quote-requests/search?page=1&size=20`}
                        params={{ type: 'APPROVED', rfqType: 'PROCUREMENT' }}
                        selectedValue={rfqNo}
                        onChange={(rfqId) => {
                          getVendor(rfqId.value);
                          PartDetails(rfqId.value);
                          const list = form.getFieldValue(
                            'vendorQuotationDetails'
                          );
                          const quotationList = list.map((quotation) => ({
                            ...quotation,
                            partId: null,
                            partDescription: '',
                          }));

                          form.setFieldsValue({
                            quoteRequestVendorId: null,
                            vendorAddress: null,
                            vendorTel: null,
                            vendorWebsite: null,
                            vendorQuotationDetails: quotationList,
                          });
                        }}
                        //type="multi"
                      />
                    </Form.Item>

                    <Form.Item
                      name="quoteRequestVendorId"
                      label="Vendor Name"
                      rules={[
                        {
                          required: true,
                          message: 'Vendor Name is required!',
                        },
                      ]}
                    >
                      <Select
                        placeholder="--Select Vendor--"
                        allowClear
                        onChange={(vId) => vId && getVendorDetails(vId)}
                        onClear={() => clearVendorDetails()}
                        showSearch
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {vendor?.map((data, index) => (
                          <Option
                            key={index}
                            value={data.id}
                          >
                            {data.vendorName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="vendorAddress"
                      label="Address"
                    >
                      <TextArea rows={5} />
                    </Form.Item>

                    <Form.Item
                      name="vendorFax"
                      label="Fax"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="vendorTel"
                      label="Tel"
                    >
                      <Input type="tel" />
                    </Form.Item>

                    <Form.Item
                      name="vendorWebsite"
                      label="Website"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="vendorQuotationNo"
                      label="Vendor Quotation No."
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="remark"
                      label="Remark"
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col
                    sm={20}
                    md={10}
                  >
                    <Form.Item
                      name="vendorFrom"
                      label="From"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="vendorEmail"
                      label="Email"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="toAttention"
                      label="Attention"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="toFax"
                      label="To Fax"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="toTel"
                      label="To Tel"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="quotationNo"
                      label="Quotation Number"
                      hidden={!id}
                    >
                      <Input
                        disabled
                        style={{
                          backgroundColor: 'white',
                          color: '#000',
                          opacity: '0.8',
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="date"
                      label="Quotation Date"
                      rules={[
                        {
                          required: true,
                          message: 'Date is required!',
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        size="medium"
                      />
                    </Form.Item>
                    <Form.Item
                      name="validUntil"
                      label="Quotation Valid Until"
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        size="medium"
                      />
                    </Form.Item>

                    {!loading && (
                      <Form.Item label="Upload">
                        <Upload.Dragger
                          multiple
                          onChange={handleFileInput}
                          showUploadList={true}
                          type="file"
                          listType="picture"
                          defaultFileList={[...attachmentList]}
                          beforeUpload={() => false}
                        >
                          <Button icon={<UploadOutlined />}>
                            Click to upload
                          </Button>{' '}
                          &nbsp;
                        </Upload.Dragger>
                      </Form.Item>
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col sm={20}>
                    <Form.Item
                      wrapperCol={{
                        offset: 0,
                        span: 20,
                      }}
                      labelCol={{
                        offset: 0,
                        span: 4,
                      }}
                      name="termsCondition"
                      label="Terms and Conditions"
                    >
                      <TextArea rows={8} />
                    </Form.Item>
                  </Col>
                </Row>

                <FormControl>
                  <RibbonCard ribbonText="QUOTATION DETAILS">
                    <Form.List name="vendorQuotationDetails">
                      {(fields, { remove }) => (
                        <>
                          {fields?.map(({ key, name, ...restField }, index) => {
                            if (
                              form.getFieldValue('vendorQuotationDetails')[
                                index
                              ]?.isActive
                            )
                              return (
                                <Row
                                  key={key}
                                  gutter={[
                                    16,
                                    { xs: 8, sm: 12, md: 12, lg: 12 },
                                  ]}
                                >
                                  <InnerFieldsQuotation
                                    uoms={uoms}
                                    form={form}
                                    name={name}
                                    restField={restField}
                                    index={index}
                                    part={part}
                                    currencies={currencies}
                                    exchangeType={exchangeType[index]}
                                    partId={vendorQuotationPartIds[index]}
                                    id={id}
                                    cond={condList[index]}
                                  />
                                  <Col
                                    xs={24}
                                    sm={24}
                                    md={1}
                                  >
                                    <Button
                                      danger
                                      onClick={() => {
                                        form.getFieldValue(
                                          'vendorQuotationDetails'
                                        )[index].id
                                          ? form.setFieldsValue(
                                              (form.getFieldValue(
                                                'vendorQuotationDetails'
                                              )[index].isActive = false)
                                            )
                                          : remove(index);
                                        form.setFieldsValue({ ...form });
                                      }}
                                    >
                                      <MinusCircleOutlined />
                                    </Button>
                                  </Col>
                                  <Divider />
                                </Row>
                              );
                          })}
                          <Form.Item wrapperCol={{ ...formLayout.labelCol }}>
                            <ARMButton
                              type="primary"
                              onClick={() => {
                                form.setFieldsValue({
                                  vendorQuotationDetails: [
                                    ...form.getFieldValue(
                                      'vendorQuotationDetails'
                                    ),
                                    {
                                      isActive: true,
                                      id: null,
                                    },
                                  ],
                                });
                              }}
                              icon={<PlusOutlined />}
                            >
                              Add
                            </ARMButton>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </RibbonCard>
                </FormControl>

                <FormControl>
                  <RibbonCard ribbonText="FEES DETAILS">
                    <p />
                    <Form.List name="vendorQuotationFees">
                      {(fields, { remove }) => (
                        <>
                          {fields?.map(({ key, name, ...restField }, index) => {
                            if (
                              form.getFieldValue('vendorQuotationFees')[index]
                                ?.isActive
                            )
                              return (
                                <Row
                                  key={key}
                                  gutter={16}
                                >
                                  <Col
                                    xs={24}
                                    sm={24}
                                    md={7}
                                    className="parent"
                                    style={{ marginBottom: 15 }}
                                  >
                                    <label>
                                      {!!(
                                        feesForm[index]?.feeCost ||
                                        feesForm[index]?.currencyId
                                      ) && (
                                        <span style={{ color: 'red' }}>*</span>
                                      )}{' '}
                                      CIA Fees
                                    </label>
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'feeName']}
                                      style={{ marginBottom: '20px' }}
                                      rules={[
                                        {
                                          required: !!(
                                            feesForm[index]?.feeCost ||
                                            feesForm[index]?.currencyId
                                          ),
                                          message: 'required!',
                                        },
                                      ]}
                                    >
                                      <Input
                                      //placeholder="CIA Fees"
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col
                                    xs={24}
                                    sm={24}
                                    md={7}
                                    className="parent"
                                  >
                                    <label>
                                      {!!(
                                        feesForm[index]?.feeName ||
                                        feesForm[index]?.currencyId
                                      ) && (
                                        <span style={{ color: 'red' }}>*</span>
                                      )}{' '}
                                      Price
                                    </label>
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'feeCost']}
                                      rules={[
                                        {
                                          required: !!(
                                            feesForm[index]?.feeName ||
                                            feesForm[index]?.currencyId
                                          ),
                                          message: 'required!',
                                        },
                                      ]}
                                    >
                                      <InputNumber
                                        min={1}
                                        //placeholder="Price"
                                        style={{
                                          backgroundColor: '#fff',
                                          color: '#000',
                                          width: '100%',
                                        }}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col
                                    xs={24}
                                    sm={24}
                                    md={7}
                                    className="parent"
                                  >
                                    <label>
                                      {!!(
                                        feesForm[index]?.feeName ||
                                        feesForm[index]?.feeCost
                                      ) && (
                                        <span style={{ color: 'red' }}>*</span>
                                      )}{' '}
                                      Currency
                                    </label>
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'currencyId']}
                                      rules={[
                                        {
                                          required: !!(
                                            feesForm[index]?.feeName ||
                                            feesForm[index]?.feeCost
                                          ),
                                          message: 'required!',
                                        },
                                      ]}
                                    >
                                      <Select
                                        allowClear
                                        showSearch
                                        //placeholder="--Select Currency--"
                                        filterOption={(input, option) =>
                                          option.children
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                        }
                                      >
                                        {currencies?.map((currency) => {
                                          return (
                                            <Select.Option
                                              key={currency.id}
                                              value={currency.id}
                                            >
                                              {currency.code}
                                            </Select.Option>
                                          );
                                        })}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                  <Col
                                    xs={24}
                                    sm={24}
                                    md={1}
                                  >
                                    <Button
                                      danger
                                      onClick={() => {
                                        form.getFieldValue(
                                          'vendorQuotationFees'
                                        )[index].id
                                          ? form.setFieldsValue(
                                              (form.getFieldValue(
                                                'vendorQuotationFees'
                                              )[index].isActive = false)
                                            )
                                          : remove(index);
                                        form.setFieldsValue({ ...form });
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
                              type="primary"
                              onClick={() => {
                                form.setFieldsValue({
                                  ...form,
                                  vendorQuotationFees: [
                                    ...form.getFieldValue(
                                      'vendorQuotationFees'
                                    ),
                                    {
                                      isActive: true,
                                      id: null,
                                    },
                                  ],
                                });
                              }}
                              icon={<PlusOutlined />}
                            >
                              Add
                            </ARMButton>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </RibbonCard>
                </FormControl>

                <SubmitReset
                  id={id}
                  onReset={onReset}
                />
              </ARMForm>
            </>
          ) : (
            <Loading />
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default Quotation;
