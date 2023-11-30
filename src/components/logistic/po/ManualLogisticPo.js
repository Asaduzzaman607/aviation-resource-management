import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
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
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError } from '../../../lib/common/notifications';
import { formLayout } from '../../../lib/constants/form';
import API from '../../../service/Api';
import ShipmentService from '../../../service/procurment/ShipmentService';
import DebounceSelect from '../../common/DebounceSelect';
import ARMButton from '../../common/buttons/ARMButton';
import RibbonCard from '../../common/forms/RibbonCard';
import FormControl from '../../store/common/FormControl';

const ManualLogisticPo = ({
  id,
  form,
  attachmentList,
  loading,
  handleFileInput,
  getPartById,
  inputType,
  poParts,
}) => {
  const [currencies, setCurrencies] = useState([]);
  const vendor = Form.useWatch('vendorId', form);

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

  let feesForm = [
    {
      feeName: '',
      feeCost: null,
      currencyId: null,
    },
  ];

  feesForm = Form.useWatch('vendorQuotationFees', form) || feesForm;

  const getVendorDetails = async (vId) => {
    try {
      let vendorDetails = {};
      const {
        data: { officePhone, website, address },
      } = await ShipmentService.singleShipmentProvider(vId);
      vendorDetails = { officePhone, website, address };

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

  return (
    <>
      <RibbonCard ribbonText="SHIPMENT PROVIDER DETAILS">
        <Row>
          <Col
            sm={20}
            md={10}
          >
            <Form.Item
              name="vendorId"
              label="Vendor Name"
              rules={[
                {
                  required: true,
                  message: 'This field is required!',
                },
              ]}
            >
              <DebounceSelect
                mapper={(v) => ({
                  label: v.name,
                  value: v.id,
                })}
                showSearch
                placeholder="Select Shipment Provider"
                url={`/material-management/config/shipment_provider/search?page=1&size=20`}
                params={{ type: 'APPROVED' }}
                onChange={(newValue) => {
                  getVendorDetails(newValue.value);
                }}
                selectedValue={vendor}
              />
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
                  message: 'This field is required!',
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
            <Form.Item
              name={'quoteRequestId'}
              hidden={true}
            >
              <Input type={'number'} />
            </Form.Item>
          </Col>
        </Row>
      </RibbonCard>

      <FormControl>
        <RibbonCard ribbonText="ORDER DETAILS">
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
                        <Form.Item
                          {...restField}
                          name={[name, 'id']}
                          hidden
                        >
                          <InputNumber
                            style={{
                              backgroundColor: '#fff',
                              color: '#000',
                            }}
                          />
                        </Form.Item>
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
                            hidden={false}
                          >
                            <Select
                              allowClear
                              showSearch
                              disabled={inputType === 'CS'}
                              onChange={(partId) => {
                                getPartById(partId, index);
                              }}
                            >
                              {poParts?.map((part) => (
                                <Select.Option
                                  key={part.partId}
                                  value={part.partId}
                                >
                                  {part.partNo}
                                </Select.Option>
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
                          <label><span style={{color: 'red'}}>*</span> Quantity</label>
                          <Form.Item
                            {...restField}
                            name={[name, 'partQuantity']}
                            rules={[
                              {
                                required: true,
                                message: 'required!',
                              },
                            ]}
                          >
                            <InputNumber
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
                          <label><span style={{color: 'red'}}>*</span> Incoterms</label>
                          <Form.Item
                            {...restField}
                            name={[name, 'incoterms']}
                            style={{ marginBottom: '20px' }}
                            rules={[
                              {
                                required: true,
                                message: 'IncoTerm is required!',
                              },
                            ]}
                          >
                            <Input
                            />
                          </Form.Item>
                        </Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={4}
                          className="parent"
                        >
                          <label> <span style={{color: 'red'}}>*</span>Unit Price</label>
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
                            hidden={!!id}
                            onClick={() => {
                              form.getFieldValue('vendorQuotationDetails')[
                                index
                              ].id
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
                    disabled={inputType === 'CS'}
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
                    form.getFieldValue('vendorQuotationFees')[index]?.isActive
                  )
                    return (
                      <Row
                        key={key}
                        gutter={16}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'id']}
                          hidden
                        >
                          <InputNumber
                            style={{
                              backgroundColor: '#fff',
                              color: '#000',
                            }}
                          />
                        </Form.Item>
                        <Col
                          xs={24}
                          sm={24}
                          md={7}
                          className="parent"
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
                              form.getFieldValue('vendorQuotationFees')[index]
                                .id
                                ? form.setFieldsValue(
                                    (form.getFieldValue('vendorQuotationFees')[
                                      index
                                    ].isActive = false)
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
                    disabled={inputType === 'CS'}
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
    </>
  );
};

export default ManualLogisticPo;
