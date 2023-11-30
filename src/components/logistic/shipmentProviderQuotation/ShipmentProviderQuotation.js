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
  notification,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useARMFileUpload } from '../../../lib/common/ARMFileUpload';
import ARMForm from '../../../lib/common/ARMForm';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError } from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { formLayout } from '../../../lib/constants/layout';
import API from '../../../service/Api';
import LogisticQuotationService from '../../../service/logistic/LogisticQuotationService';
import ManufacturerService from '../../../service/ManufacturerService';
import QuotationServices from '../../../service/procurment/QuotationServices';
import SupplierService from '../../../service/SupplierService';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import DebounceSelect from '../../common/DebounceSelect';
import RibbonCard from '../../common/forms/RibbonCard';
import CommonLayout from '../../layout/CommonLayout';
import FormControl from '../../store/common/FormControl';

const ShipmentProviderQuotation = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { id } = useParams();
  const [rfq, setRfq] = useState('');
  //const [currency, setCurrency] = useState([]);
  const [part, setPart] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const { handleFileInput, selectedFile, setSelectedFile, handleFilesUpload, fileProcessForEdit } =
    useARMFileUpload();

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
      const { data } = await LogisticQuotationService.getQuotationByRFQId(
        rfqData
      );
      setPart(data.rfqPartViewModels);
      console.log('parts: ', data.rfqPartViewModels);
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

  const submitQuotation = async (values) => {
    //file uploading
    const files = await handleFilesUpload('Quotation', selectedFile);
    const quotationFees = values.vendorQuotationFees?.filter(
      (fee) => fee.feeName
    );

    const mod = {
      ...values,
      quoteRequestId: values.quoteRequestId,
      date: values['date']?.format('YYYY-MM-DD'),
      validUntil: values['validUntil']?.format('YYYY-MM-DD'),
      attachments: files,
      vendorQuotationFees: quotationFees,
    };
    console.log('final', mod);
    await LogisticQuotationService.SaveQuotation(mod)
      .then((response) => {
        if (response.status === 200) {
          notification['success']({
            message: 'Successfully Created',
          });
          console.log('========== Form Submitted=====================');

          form.resetFields();
          navigate(-1);
        }
      })
      .catch((error) => {
        notification['error']({
          message: error.response.data.apiErrors[0].message,
        });
        console.log('something went wrong', error);
      });
  };

  const updateQuotation = async (id, values) => {
    //file uploading
    const files = await handleFilesUpload('Quotation', selectedFile);
    const quotationFees = values.vendorQuotationFees?.filter(
      (fee) => fee.feeName
    );

    try {
      const { data } = await LogisticQuotationService.updateQuotation(id, {
        ...values,
        quoteRequestId: values.quoteRequestId,
        date: values['date']?.format('YYYY-MM-DD'),
        validUntil: values['validUntil']?.format('YYYY-MM-DD'),
        attachments: files,
        vendorQuotationFees: quotationFees,
      });
      console.log('qData: ', data);

      notification['success']({
        message: 'Quotation updated successfully',
      });
      form.resetFields();
      navigate(-1);
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  const getPartById = async (id, index) => {
    try {
      const partData = part.find((item) => item.partId === id);
      const quotationDetails = form.getFieldValue('vendorQuotationDetails');
      const quotationList = quotationDetails.map((quotation, idx) => {
        if (idx === index) {
          return {
            ...quotation,
            partDescription: partData.partDescription,
            itemId: partData.id,
            unitMeasurementCode: partData.unitMeasurementCode,
            uomId:partData.unitMeasurementId,
          };
        } else {
          return quotation;
        }
      });
      console.log('test: ', quotationList);
      form.setFieldValue('vendorQuotationDetails', quotationList);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getQuotation = async () => {
    try {
      setLoading(true);
      let fileList = [];
      const { data } = await LogisticQuotationService.getQuotationById(id);
      if (data.attachments != null) {
        fileList = fileProcessForEdit(data?.attachments);
      }
      let list= data?.vendorQuotationDetails.map((data)=>{
        return{
          ...data,
          uomId:data.unitMeasurementId,
        }
    })
      setAttachmentList(fileList);
      setSelectedFile(fileList);

      console.log('dataId: ', data);

      setRfq(data.quoteRequestId);
      await getVendor(data.quoteRequestId);

      const updateData = {
        ...data,
        vendorName: data.vendorName,
        date: data.date ? moment(data.date) : null,
        validUntil: data.validUntil ? moment(data.validUntil) : null,
        vendorQuotationDetails:list
      };

      form.setFieldsValue(updateData);
      PartDetails(data.quoteRequestId);
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
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

  const onFinish = async (values) => {
    console.log('values: ', values);
    id ? await updateQuotation(id, values) : await submitQuotation(values);
  };

  const onReset = () => {
    if(!id) {
      form.resetFields(); 
    } else {
      getQuotation(id);
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

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/logistic">
              {' '}
              <i className="fas fa-hand-holding-box" />
              &nbsp; Logistic
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/logistic/shipment-provider-quotation">
              &nbsp;Quotation
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission={[
          'LOGISTIC_LOGISTIC_QUOTE_REQUEST_LOGISTIC_QUOTATION_SAVE',
          'LOGISTIC_LOGISTIC_QUOTE_REQUEST_LOGISTIC_QUOTATION_EDIT',
        ]}
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            id ? 'Update Quotation' : 'Add Quotation',
            '/logistic/shipment-provider-quotation'
          )}
        >
          <ARMForm
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
                      message: 'RFQ No. is required!',
                    },
                  ]}
                >
                  <DebounceSelect
                    mapper={(v) => ({
                      label: v.rfqNo,
                      value: v.id,
                    })}
                    showSearch
                    placeholder="---Select RFQ No.---"
                    url={`/logistic/quote-requests/search?page=1&size=20`}
                    params={{ type: 'APPROVED', rfqType: 'LOGISTIC' }}
                    value={rfq}
                    onChange={(newValue) => {
                      setRfq(newValue);
                      getVendor(newValue);
                      newValue && PartDetails(newValue);
                      let list = form.getFieldValue('vendorQuotationDetails');
                      let quotationList = list.map((l) => ({
                        ...l,
                        partId: null,
                        description: '',
                      }));
                      form.setFieldsValue({
                        vendorQuotationDetails: quotationList,
                      });
                      form.setFieldsValue({
                        vendorType: null,
                        quoteRequestVendorId: null,
                      });
                    }}
                    type="multi"
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
                    placeholder="--Select Vendor Name--"
                    allowClear
                    onChange={(vId) => vId && getVendorDetails(vId)}
                    onClear={() => clearVendorDetails()}
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
                      message: 'Quotation Date is required!',
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
                  <Form.Item label="Attachments">
                    <Upload.Dragger
                      multiple
                      onChange={handleFileInput}
                      showUploadList={true}
                      type="file"
                      listType="picture"
                      defaultFileList={[...attachmentList]}
                      beforeUpload={() => false}
                    >
                      <Button icon={<UploadOutlined />}>Click to upload</Button>{' '}
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
                          form.getFieldValue('vendorQuotationDetails')[index]
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
                                md={4}
                              >
                                <Form.Item
                                  {...restField}
                                  name={[name, 'vendorRequestType']}
                                  hidden={false}
                                  initialValue={'QUOTATION'}
                                >
                                  <Input
                                    disabled
                                    style={{
                                      backgroundColor: '#fff',
                                      color: '#000',
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={4}
                                className="parent"
                              >
                                <label><span style={{color: 'red'}}>*</span> Select Part</label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'partId']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Part No. is required!',
                                    },
                                  ]}
                                >
                                  <Select
                                    showSearch
                                    // placeholder="Select Part"
                                    onChange={(newValue) => {
                                      console.log('newValue: ', newValue);
                                      getPartById(newValue, index);
                                    }}
                                  >
                                    {part?.map((data) => (
                                      <Option
                                        key={data.partId}
                                        value={data.partId}
                                      >
                                        {data.partNo}
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={4}
                                className="parent"
                              >
                                <label>Description</label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'partDescription']}
                                  hidden={false}
                                  style={{ marginBottom: '20px' }}
                                >
                                  <TextArea
                                    disabled
                                    //placeholder="Description"
                                    style={{
                                      backgroundColor: '#fff',
                                      color: '#000',
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={4}
                                className="parent"
                              >
                                <label>UOM</label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'unitMeasurementCode']}
                                  hidden={false}
                                >
                                  <Input
                                    disabled
                                    //placeholder="UOM"
                                    style={{
                                      backgroundColor: '#fff',
                                      color: '#000',
                                    }}
                                  />
                                </Form.Item>

                                <Form.Item
                                  {...restField}
                                  name={[name, 'uomId']}
                                  hidden={true}
                                >
                                  <Input/>
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={4}
                                className="parent"
                              >
                                <label><span style={{color: 'red'}}>*</span> Quantity</label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'partQuantity']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Qty is required!',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    // placeholder="Quantity"
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
                                md={4}
                                className="parent"
                              >
                                <label><span style={{color: 'red'}}>*</span> Condition</label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'condition']}
                                  style={{ marginBottom: '35px' }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Condition is required!',
                                    },
                                  ]}
                                >
                                  <TextArea
                                  //placeholder="COND"
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={4}
                                className="parent"
                              >
                                <label><span style={{color: 'red'}}>*</span> Lead Time</label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'leadTime']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Lead Time is required!',
                                    },
                                  ]}
                                >
                                  <TextArea
                                  //placeholder="LEAD TIME"
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={4}
                                className="parent"
                              >
                                <label><span style={{color: 'red'}}>*</span> Incoterms</label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'incoterms']}
                                  style={{ marginBottom: '20px' }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Incoterm is required!',
                                    },
                                  ]}
                                >
                                  <Input
                                  //placeholder="INCOTERMS"
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={4}
                                className="parent"
                              >
                                <label><span style={{color: 'red'}}>*</span> Unit Price</label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'unitPrice']}
                                  style={{ marginBottom: '20px' }}
                                  rules={[
                                    {
                                      required: true,
                                      message: ' Unit price is required',
                                    },
                                    {
                                      type: 'number',
                                      min: 0,
                                      message: 'Price cannot be less than Zero',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    min={0}
                                    //placeholder="UNIT PRICE"
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
                                md={4}
                                className="parent"
                              >
                                <label>Extended Price</label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'extendedPrice']}
                                  rules={[
                                    {
                                      type: 'number',
                                      min: 0,
                                      message: 'Price cannot be less than Zero',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    min={0}
                                    //placeholder="EXTENDED PRICE"
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
                                md={4}
                                className="parent"
                              >
                                <label>Discount %</label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'discount']}
                                >
                                  <InputNumber
                                    min={0}
                                    max={100}
                                    //placeholder="Discount %"
                                    formatter={(value) => `${value}`}
                                    parser={(value) => value.replace('%', '')}
                                    style={{
                                      backgroundColor: '#fff',
                                      color: '#000',
                                      width: '100%',
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Form.Item
                                {...restField}
                                name={[name, 'itemId']}
                                hidden={true}
                              >
                                <Input type={'number'} />
                              </Form.Item>
                              <Col
                                xs={24}
                                sm={24}
                                md={4}
                                className="parent"
                              >
                                <label>Currency</label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'currencyId']}
                                >
                                  <Select
                                    allowClear
                                    showSearch
                                    // placeholder="Select Currency"
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
                                ...form.getFieldValue('vendorQuotationDetails'),
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
                                style={{marginBottom: 15}}
                              >
                                <label>
                                  {!!(feesForm[index]?.feeCost ||
                                        feesForm[index]?.currencyId)
                                        && <span style={{color: 'red'}}>*</span>
                                    } CIA Fees
                                </label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'feeName']}
                                  style={{ marginBottom: '20px' }}
                                  rules={[
                                    {
                                      required:
                                        feesForm[index]?.feeCost ||
                                        feesForm[index]?.currencyId
                                          ? true
                                          : false,
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
                                    {!!(feesForm[index]?.feeName ||
                                            feesForm[index]?.currencyId)
                                              && <span style={{color: 'red'}}>*</span>
                                      } Price
                                 </label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'feeCost']}
                                  rules={[
                                    {
                                      required:
                                        feesForm[index]?.feeName ||
                                        feesForm[index]?.currencyId
                                          ? true
                                          : false,
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
                                    {!!(feesForm[index]?.feeName ||
                                          feesForm[index]?.feeCost)
                                          && <span style={{color: 'red'}}>*</span>
                                      } Currency
                                 </label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'currencyId']}
                                  rules={[
                                    {
                                      required:
                                        feesForm[index]?.feeName ||
                                        feesForm[index]?.feeCost
                                          ? true
                                          : false,
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
                                    form.getFieldValue('vendorQuotationFees')[
                                      index
                                    ].id
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
                                ...form.getFieldValue('vendorQuotationFees'),
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

            <Row>
              <Col
                sm={20}
                md={10}
              >
                <Form.Item
                  style={{ marginTop: '10px' }}
                  wrapperCol={{ ...layout.wrapperCol }}
                >
                  <Space size="small">
                    <ARMButton
                      type="primary"
                      htmlType="submit"
                    >
                      {id ? 'Update' : 'Submit'}
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
              </Col>
            </Row>
          </ARMForm>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default ShipmentProviderQuotation;
