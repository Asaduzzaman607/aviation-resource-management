import { UploadOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  notification,
  Radio,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useARMFileUpload } from '../../../lib/common/ARMFileUpload';
import ARMForm from '../../../lib/common/ARMForm';
import { getErrorMessage } from '../../../lib/common/helpers';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import API from '../../../service/Api';
import LogisticPIService from '../../../service/logistic/LogisticPIService';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import DebounceSelect from '../../common/DebounceSelect';
import CommonLayout from '../../layout/CommonLayout';
import Loading from '../../store/common/Loading';

const LogisticPurchaseInvoice = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { id } = useParams();
  const [currency, setCurrency] = useState([]);
  const [part, setPart] = useState([]);
  const [value, setValue] = useState('INVOICE');
  const [attachmentList, setAttachmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { handleFileInput, selectedFile, setSelectedFile, handleFilesUpload, fileProcessForEdit } =
    useARMFileUpload();
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  console.log('partData: ', part);

  const getPIById = async (id) => {
    try {
      let fileList = [];
      setLoading(true);
      const { data } = await LogisticPIService.getInvoiceById(id);
      getPart(data?.partOrderId);
      if (data?.attachment != null) {
        fileList = fileProcessForEdit(data?.attachment);
      }
      setAttachmentList(fileList);
      setSelectedFile(fileList);
      form.setFieldsValue(data);
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    id && getPIById(id);
  }, [id]);

  const onChange = (e) => {
    //console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const onFinish = async (values) => {
    const files = await handleFilesUpload('LogisticPI', selectedFile);
    const data = {
      ...values,
      attachment: files,
      vendorQuotationDetails: [],
      vendorQuotationFees: [],
    };
    id ? updateInvoice(id, data) : submitInvoice(data);
  };

  const onReset = () => {
    if (!id) {
      form.resetFields();
    } else {
      getPIById(id);
    }
  };

  const submitInvoice = async (values) => {
    console.log('awaq1', values);
    await LogisticPIService.SaveInvoice(values)
      .then((response) => {
        if (response.status === 200) {
          notification['success']({
            message: 'Successfully Created',
          });

          form.resetFields();
          navigate('/logistic/purchase-invoice/pending');
        }
      })
      .catch((error) => {
        notification['error']({
          message: error.response.data.apiErrors[0].message,
        });
        console.log('something went wrong', error);
      });
  };

  const updateInvoice = async (id, data) => {
    try {
      await LogisticPIService.UpdateInvoice(id, data);
      notification['success']({
        message: 'Purchase Invoice updated successfully',
      });
      form.resetFields();
      navigate(-1);
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  const getPartById = async (id, index) => {
    let poItem = part.find((item) => item.partId === id);
    try {
      const { data } = await API.get(`/part-order-items/${poItem.id}`);
      console.log('qwqw: ', data);
      form.setFieldsValue(
        (form.getFieldValue('vendorQuotationDetails')[index].partDescription =
          data.partDescription)
      );
      form.setFieldsValue(
        (form.getFieldValue('vendorQuotationDetails')[index].itemId =
          data.itemId)
      );
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getPart = async (value) => {
    try {
      const { data } = await API.get(`/logistic/part-orders/${value}`);
      console.log('parts: ', data.poItemResponseDtoList);
      setPart(data.poItemResponseDtoList);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const route = useSelector((state) => state.routeLocation.previousRoute);

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
            {id ? (
              <Link to="/logistic/purchase-invoice/pending">
                &nbsp;Pending Logistic Purchase Invoice List
              </Link>
            ) : (
              <Link to="#">&nbsp;Logistic Purchase Invoice</Link>
            )}
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission={[
          'LOGISTIC_LOGISTIC_PARTS_INVOICE_LOGISTIC_PARTS_INVOICE_SAVE',
          'LOGISTIC_LOGISTIC_PARTS_INVOICE_LOGISTIC_PARTS_INVOICE_EDIT',
        ]}
        showFallback
      >
        {!loading ? (
          <ARMCard
            title={
              route === 'list'
                ? getLinkAndTitle(
                    `Logistic Purchase Invoice ${id ? 'Edit' : 'Add'}`,
                    '/logistic/purchase-invoice/pending',
                    false
                  )
                : getLinkAndTitle(
                    `Logistic Purchase Invoice ${id ? 'Edit' : 'Add'}`,
                    '/logistic',
                    false
                  )
            }
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
              <div
                style={{
                  marginBottom: '15px',
                  textAlign: 'left',
                  padding: '20px',
                }}
              ></div>
              <Row>
                <Col
                  sm={20}
                  md={10}
                >
                  <Form.Item
                    name="invoiceType"
                    label="Invoice Type"
                    rules={[
                      {
                        required: true,
                        message: 'Invoice type is required!',
                      },
                    ]}
                  >
                    <Radio.Group
                      onChange={onChange}
                      value={value}
                    >
                      <Radio value={'INVOICE'}>INVOICE</Radio>
                      <Radio value={'PROFORMA_INVOICE'}>PROFORMA-INVOICE</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {id && (
                    <Form.Item
                      name="invoiceNo"
                      label="Invoice No"
                    >
                      <Input disabled />
                    </Form.Item>
                  )}

                  <Form.Item
                    name="partOrderId"
                    label="Part Order No."
                    rules={[
                      {
                        required: true,
                        message: 'Part order no. required!',
                      },
                    ]}
                  >
                    <DebounceSelect
                      mapper={(v) => ({
                        label: v.orderNo,
                        value: v.id,
                      })}
                      showSearch
                      placeholder="---Select PO No. ---"
                      type="multi"
                      url={`/logistic/part-orders/search?page=1&size=20`}
                      params={{ type: 'APPROVED' }}
                      // disabled={id?true:false}
                      onChange={(newValue) => {
                        console.log('selected requisition no...', newValue);
                        // let data = getPR(newValue)
                        getPart(newValue);
                      }}
                      disabled={id ? true : false}
                    />
                  </Form.Item>
                  <Form.Item
                    name="tac"
                    label="Tac"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="vendorAddress"
                    label="Address"
                  >
                    <TextArea rows={4} />
                  </Form.Item>

                  <Form.Item
                    name="vendorEmail"
                    label="Email"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="vendorTelephone"
                    label="Tel"
                  >
                    <Input type="tel" />
                  </Form.Item>

                  <Form.Item
                    name="vendorFax"
                    label="Fax"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="vendorWebsite"
                    label="Website"
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
                    name="followUpBy"
                    label="FollowUp"
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
                    <Input type="tel" />
                  </Form.Item>

                  <Form.Item
                    name="remark"
                    label="Remark"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="shipTo"
                    label="Ship To"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="billTo"
                    label="Bill To"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="paymentTerms"
                    label="Payment Terms"
                  >
                    <Input />
                  </Form.Item>
                  {!loading && (
                    <Form.Item
                      label="Attachment"
                      name="attachment"
                      rules={[
                        {
                          required: true,
                          message: 'Attachment is required!',
                        },
                      ]}
                    >
                      <Upload.Dragger
                        multiple
                        onChange={(e) => {
                          handleFileInput(e);
                          const fileList =
                            form.getFieldValue('attachment').fileList;
                          if (fileList.length === 0) {
                            form.setFieldValue('attachment', []);
                          }
                        }}
                        showUploadList={true}
                        type="file"
                        listType="picture"
                        defaultFileList={[...attachmentList]}
                        beforeUpload={() => false}
                      >
                        <Button icon={<UploadOutlined />}>
                          Click to upload
                        </Button>
                      </Upload.Dragger>
                    </Form.Item>
                  )}
                </Col>
              </Row>

              {/*<FormControl>*/}
              {/*  <RibbonCard ribbonText={'Vendor Quotation Details'}>*/}
              {/*    <Form.List name="vendorQuotationDetails">*/}
              {/*      {(fields, { add, remove }) => (*/}
              {/*        <>*/}
              {/*          {fields?.map(({ key, name, ...restField }, index) => {*/}
              {/*            if (*/}
              {/*              form.getFieldValue('vendorQuotationDetails')[index]*/}
              {/*                ?.isActive*/}
              {/*            )*/}
              {/*              return (*/}
              {/*                <Row*/}
              {/*                  gutter={16}*/}
              {/*                  key={key}*/}
              {/*                >*/}
              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                      {...restField}*/}
              {/*                      name={[name, 'vendorRequestType']}*/}
              {/*                      initialValue="INVOICE"*/}
              {/*                    >*/}
              {/*                      <Input disabled />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}

              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                      {...restField}*/}
              {/*                      name={[name, 'partId']}*/}
              {/*                    >*/}
              {/*                      <Select*/}
              {/*                        showSearch*/}
              {/*                        placeholder="---Search Part---"*/}
              {/*                        onChange={(newValue) => {*/}
              {/*                          console.log('newValue: ', newValue);*/}
              {/*                          getPartById(newValue, index);*/}
              {/*                        }}*/}
              {/*                      >*/}
              {/*                        {part?.map((data) => (*/}
              {/*                          <Option*/}
              {/*                            key={data.id}*/}
              {/*                            value={data.partId}*/}
              {/*                          >*/}
              {/*                            {data.partNo}*/}
              {/*                          </Option>*/}
              {/*                        ))}*/}
              {/*                      </Select>*/}
              {/*                    </Form.Item>*/}
              {/*                    <Form.Item*/}
              {/*                      {...restField}*/}
              {/*                      name={[name, 'itemId']}*/}
              {/*                      initialValue={9}*/}
              {/*                      hidden*/}
              {/*                    >*/}
              {/*                      <Input />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}
              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                      {...restField}*/}
              {/*                      name={[name, 'partDescription']}*/}
              {/*                    >*/}
              {/*                      <Input*/}
              {/*                        placeholder="Part Desc...."*/}
              {/*                        disabled={true}*/}
              {/*                      />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}

              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                      {...restField}*/}
              {/*                      name={[name, 'condition']}*/}
              {/*                      rules={[*/}
              {/*                        {*/}
              {/*                          required: true,*/}
              {/*                          message: 'required!',*/}
              {/*                        },*/}
              {/*                      ]}*/}
              {/*                    >*/}
              {/*                      <Input placeholder="Condition.." />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}
              {/*                  <Col*/}
              {/*                      xs={24}*/}
              {/*                      sm={24}*/}
              {/*                      md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                        {...restField}*/}
              {/*                        name={[name, 'moq']}*/}
              {/*                        hidden={false}*/}
              {/*                        rules={[*/}
              {/*                          {*/}
              {/*                            required: true,*/}
              {/*                            message: 'required!',*/}
              {/*                          },*/}
              {/*                        ]}*/}
              {/*                    >*/}
              {/*                      <InputNumber*/}
              {/*                          placeholder="MOQ..."*/}
              {/*                          style={{*/}
              {/*                            backgroundColor: '#fff',*/}
              {/*                            color: '#000',*/}
              {/*                            width: '100%'*/}
              {/*                          }}*/}
              {/*                      />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}
              {/*                  <Col*/}
              {/*                      xs={24}*/}
              {/*                      sm={24}*/}
              {/*                      md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                        {...restField}*/}
              {/*                        name={[name, 'mov']}*/}
              {/*                        hidden={false}*/}
              {/*                        rules={[*/}
              {/*                          {*/}
              {/*                            required: true,*/}
              {/*                            message: 'required!',*/}
              {/*                          },*/}
              {/*                        ]}*/}
              {/*                    >*/}
              {/*                      <InputNumber*/}
              {/*                          placeholder="MOV..."*/}
              {/*                          style={{*/}
              {/*                            backgroundColor: '#fff',*/}
              {/*                            color: '#000',*/}
              {/*                            width: '100%'*/}
              {/*                          }}*/}
              {/*                      />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}
              {/*                  <Col*/}
              {/*                      xs={24}*/}
              {/*                      sm={24}*/}
              {/*                      md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                        {...restField}*/}
              {/*                        name={[name, 'mlv']}*/}
              {/*                        hidden={false}*/}
              {/*                        rules={[*/}
              {/*                          {*/}
              {/*                            required: true,*/}
              {/*                            message: 'required!',*/}
              {/*                          },*/}
              {/*                        ]}*/}
              {/*                    >*/}
              {/*                      <InputNumber*/}
              {/*                          placeholder="MLV..."*/}
              {/*                          style={{*/}
              {/*                            backgroundColor: '#fff',*/}
              {/*                            color: '#000',*/}
              {/*                            width: '100%'*/}
              {/*                          }}*/}
              {/*                      />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}
              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                      {...restField}*/}
              {/*                      name={[name, 'leadTime']}*/}
              {/*                      rules={[*/}
              {/*                        {*/}
              {/*                          required: true,*/}
              {/*                          message: 'required!',*/}
              {/*                        },*/}
              {/*                      ]}*/}
              {/*                    >*/}
              {/*                      <Input placeholder="Lead time.." />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}

              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                      {...restField}*/}
              {/*                      name={[name, 'incoterms']}*/}
              {/*                      rules={[*/}
              {/*                        {*/}
              {/*                          required: true,*/}
              {/*                          message: 'required!',*/}
              {/*                        },*/}
              {/*                      ]}*/}
              {/*                    >*/}
              {/*                      <Input placeholder="Incoterms.." />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}

              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                      {...restField}*/}
              {/*                      name={[name, 'unitPrice']}*/}
              {/*                      rules={[*/}
              {/*                        {*/}
              {/*                          required: true,*/}
              {/*                          message: 'required!',*/}
              {/*                        },*/}
              {/*                      ]}*/}
              {/*                    >*/}
              {/*                      <Input*/}
              {/*                        type={'number'}*/}
              {/*                        placeholder="Unit price.."*/}
              {/*                      />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}

              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                      {...restField}*/}
              {/*                      name={[name, 'extendedPrice']}*/}
              {/*                      rules={[*/}
              {/*                        {*/}
              {/*                          required: true,*/}
              {/*                          message: 'required!',*/}
              {/*                        },*/}
              {/*                      ]}*/}
              {/*                    >*/}
              {/*                      <Input*/}
              {/*                        type={'number'}*/}
              {/*                        placeholder="Extended price.."*/}
              {/*                      />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}

              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                      {...restField}*/}
              {/*                      name={[name, 'currencyId']}*/}
              {/*                      rules={[*/}
              {/*                        {*/}
              {/*                          required: true,*/}
              {/*                          message: 'required!',*/}
              {/*                        },*/}
              {/*                      ]}*/}
              {/*                    >*/}
              {/*                      <DebounceSelect*/}
              {/*                        mapper={(v) => ({*/}
              {/*                          label: v.code,*/}
              {/*                          value: v.id,*/}
              {/*                        })}*/}
              {/*                        showSearch*/}
              {/*                        placeholder="---Search Currency---"*/}
              {/*                        url={`/store/currencies/search/?size=20`}*/}
              {/*                        selectedValue={currency}*/}
              {/*                        onChange={(newValue) => {*/}
              {/*                          console.log('selected uom...', newValue);*/}
              {/*                          setCurrency(newValue);*/}
              {/*                        }}*/}
              {/*                        type="multi"*/}
              {/*                      />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}
              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Button*/}
              {/*                      danger*/}
              {/*                      onClick={() => {*/}
              {/*                        form.getFieldValue(*/}
              {/*                          'vendorQuotationDetails'*/}
              {/*                        )[index].id*/}
              {/*                          ? form.setFieldsValue(*/}
              {/*                              (form.getFieldValue(*/}
              {/*                                'vendorQuotationDetails'*/}
              {/*                              )[index].isActive = false)*/}
              {/*                            )*/}
              {/*                          : remove(index);*/}
              {/*                        form.setFieldsValue({ ...form });*/}
              {/*                      }}*/}
              {/*                    >*/}
              {/*                      <MinusCircleOutlined />*/}
              {/*                    </Button>*/}
              {/*                  </Col>*/}
              {/*                </Row>*/}
              {/*              );*/}
              {/*          })}*/}
              {/*          <Form.Item wrapperCol={{ ...layout.labelCol }}>*/}
              {/*            <ARMButton*/}
              {/*              type="primary"*/}
              {/*              onClick={() => {*/}
              {/*                form.setFieldsValue({*/}
              {/*                  ...form,*/}
              {/*                  vendorQuotationDetails: [*/}
              {/*                    ...form.getFieldValue('vendorQuotationDetails'),*/}
              {/*                    {*/}
              {/*                      isActive: true,*/}
              {/*                      id: null,*/}
              {/*                    },*/}
              {/*                  ],*/}
              {/*                });*/}
              {/*              }}*/}
              {/*              icon={<PlusOutlined />}*/}
              {/*            >*/}
              {/*              Add*/}
              {/*            </ARMButton>*/}
              {/*          </Form.Item>*/}
              {/*        </>*/}
              {/*      )}*/}
              {/*    </Form.List>*/}
              {/*  </RibbonCard>*/}
              {/*</FormControl>*/}
              {/*<FormControl>*/}
              {/*  <RibbonCard ribbonText={'Vendor Quotation Fees'}>*/}
              {/*    <Form.List name="vendorQuotationFees">*/}
              {/*      {(fields, { add, remove }) => (*/}
              {/*        <>*/}
              {/*          {fields?.map(({ key, name, ...restField }, index) => {*/}
              {/*            if (*/}
              {/*              form.getFieldValue('vendorQuotationFees')[index]*/}
              {/*                ?.isActive*/}
              {/*            )*/}
              {/*              return (*/}
              {/*                <Row*/}
              {/*                  gutter={16}*/}
              {/*                  key={key}*/}
              {/*                >*/}
              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                      {...restField}*/}
              {/*                      name={[name, 'feeName']}*/}
              {/*                    >*/}
              {/*                      <Input placeholder="Fee Name" />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}

              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                      {...restField}*/}
              {/*                      name={[name, 'feeCost']}*/}
              {/*                      rules={[*/}
              {/*                        {*/}
              {/*                          required: true,*/}
              {/*                          message: 'required!',*/}
              {/*                        },*/}
              {/*                      ]}*/}
              {/*                    >*/}
              {/*                      <Input*/}
              {/*                        type={'number'}*/}
              {/*                        placeholder=" Fee Cost .."*/}
              {/*                      />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}

              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Form.Item*/}
              {/*                      {...restField}*/}
              {/*                      name={[name, 'currencyId']}*/}
              {/*                      rules={[*/}
              {/*                        {*/}
              {/*                          required: true,*/}
              {/*                          message: 'required!',*/}
              {/*                        },*/}
              {/*                      ]}*/}
              {/*                    >*/}
              {/*                      <DebounceSelect*/}
              {/*                        mapper={(v) => ({*/}
              {/*                          label: v.code,*/}
              {/*                          value: v.id,*/}
              {/*                        })}*/}
              {/*                        showSearch*/}
              {/*                        placeholder="---Search Currency---"*/}
              {/*                        url={`/store/currencies/search/?size=20`}*/}
              {/*                        selectedValue={currency}*/}
              {/*                        onChange={(newValue) => {*/}
              {/*                          console.log('selected uom...', newValue);*/}
              {/*                          setCurrency(newValue);*/}
              {/*                        }}*/}
              {/*                        type="multi"*/}
              {/*                      />*/}
              {/*                    </Form.Item>*/}
              {/*                  </Col>*/}
              {/*                  <Col*/}
              {/*                    xs={24}*/}
              {/*                    sm={24}*/}
              {/*                    md={4}*/}
              {/*                  >*/}
              {/*                    <Button*/}
              {/*                      danger*/}
              {/*                      onClick={() => {*/}
              {/*                        form.getFieldValue('vendorQuotationFees')[*/}
              {/*                          index*/}
              {/*                        ].id*/}
              {/*                          ? form.setFieldsValue(*/}
              {/*                              (form.getFieldValue(*/}
              {/*                                'vendorQuotationFees'*/}
              {/*                              )[index].isActive = false)*/}
              {/*                            )*/}
              {/*                          : remove(index);*/}
              {/*                        form.setFieldsValue({ ...form });*/}
              {/*                      }}*/}
              {/*                    >*/}
              {/*                      <MinusCircleOutlined />*/}
              {/*                    </Button>*/}
              {/*                  </Col>*/}
              {/*                </Row>*/}
              {/*              );*/}
              {/*          })}*/}
              {/*          <Form.Item wrapperCol={{ ...layout.labelCol }}>*/}
              {/*            <ARMButton*/}
              {/*              type="primary"*/}
              {/*              onClick={() => {*/}
              {/*                form.setFieldsValue({*/}
              {/*                  ...form,*/}
              {/*                  vendorQuotationFees: [*/}
              {/*                    ...form.getFieldValue('vendorQuotationFees'),*/}
              {/*                    {*/}
              {/*                      isActive: true,*/}
              {/*                      id: null,*/}
              {/*                    },*/}
              {/*                  ],*/}
              {/*                });*/}
              {/*              }}*/}
              {/*              icon={<PlusOutlined />}*/}
              {/*            >*/}
              {/*              Add*/}
              {/*            </ARMButton>*/}
              {/*          </Form.Item>*/}
              {/*        </>*/}
              {/*      )}*/}
              {/*    </Form.List>*/}
              {/*  </RibbonCard>*/}
              {/*</FormControl>*/}

              <Row>
                <Col
                  sm={20}
                  md={10}
                >
                  <Form.Item
                    style={{ marginTop: '10px' }}
                    wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
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
        ) : (
          <Loading />
        )}
      </Permission>
    </CommonLayout>
  );
};

export default LogisticPurchaseInvoice;
