import {
  Breadcrumb,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useARMFileUpload } from '../../../lib/common/ARMFileUpload';
import ARMForm from '../../../lib/common/ARMForm';
import { getErrorMessage } from '../../../lib/common/helpers';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import LogisticPOService from '../../../service/logistic/LogisticPOService';
import POService from '../../../service/procurment/POService';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import DebounceSelect from '../../common/DebounceSelect';
import CommonLayout from '../../layout/CommonLayout';
import CsPoDetails from './CsPoDetails';
import { invoiceTo, shipTo, tac } from './LogisticPoData';
import ManualLogisticPo from './ManualLogisticPo';

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

const LogisticPO = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [csID, setCsID] = useState(null);
  const [value, setValue] = useState([]);
  const [inputType, setInputType] = useState('');
  const [vendorQuotationId, setVendorQuotationId] = useState(null);
  const [attachmentList, setAttachmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fullDataSet, setFullDataSet] = useState({});
  const { handleFileInput, selectedFile, setSelectedFile, handleFilesUpload, fileProcessForEdit } =
    useARMFileUpload();
  const selectCsId = Form.useWatch('csId', form);
  const navigate = useNavigate();
  const [poParts, setPoParts] = useState([]);
  const [pPoData, setPPoData] = useState([]);

  const getPoPartsByPoId = async (id) => {
    try {
      const { data } = await POService.getPOById(id);
      setPoParts(data.poItemResponseDtoList);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getPartById = async (id, index) => {
    try {
      let partData = {};
      for (let i = 0; i < poParts.length; i++) {
        if (id === poParts[i].partId) {
          partData = poParts[i];
          break;
        }
      }
      const quotationDetails = form.getFieldValue('vendorQuotationDetails');
      const quotationList = quotationDetails.map((quotation, idx) => {
        if (idx === index) {
          return {
            ...quotation,
            itemId: partData.id,
            partDescription: partData.partDescription,
            unitMeasurementCode: partData.uomCode,
            uomId: partData.uomId,
          };
        } else {
          return quotation;
        }
      });
      form.setFieldValue('vendorQuotationDetails', quotationList);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getPoById = async () => {
    try {
      setLoading(true);
      let fileList = [];
      const { data } = await LogisticPOService.getPOById(id);
      await getPoPartsByPoId(data.vendorQuotationViewModel?.parentOrder.id);
      setPPoData([
        {
          value: data.vendorQuotationViewModel?.parentOrder.id,
          label: data.vendorQuotationViewModel?.parentOrder.orderNo,
        },
      ]);
      if (data.vendorQuotationViewModel?.attachments != null) {
        fileList = fileProcessForEdit(data.vendorQuotationViewModel?.attachments);
      }
      setAttachmentList(fileList);
      setSelectedFile(fileList);
      const testData = data.vendorQuotationViewModel;
      setFullDataSet(testData);
      setVendorQuotationId(data.vendorQuotationViewModel.id);
      setInputType(data.inputType);
      let vendorQuotationDetail = [];
      data?.vendorQuotationViewModel?.vendorQuotationDetails?.map((item) => {
        vendorQuotationDetail.push({
          ...item,
          partId: item.partId,
          uomId: item.unitMeasurementId,
        });
      });
      const testData1 = {
        ...data,
        ...testData,
        vendorId: { lable: testData.vendorName, value: testData.vendorId },
      };
      console.log({testData1});
      form.setFieldsValue({
        ...testData1,
        vendorName: data.vendorName,
        validUntil: data?.vendorQuotationViewModel.validUntil
          ? moment(testData1.validUntil)
          : null,
        date: data?.vendorQuotationViewModel.date
          ? moment(testData1.date)
          : null,
        vendorQuotationDetails: vendorQuotationDetail,
        ppoId: {
          value: data.vendorQuotationViewModel?.parentOrder.id,
          label: data.vendorQuotationViewModel?.parentOrder.orderNo,
        },
      });
    } catch (e) {
      notification['error']({ message: getErrorMessage(e) });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    const files = await handleFilesUpload('Logistic-Quotation', selectedFile);
    let modifiedValue = {
      id: id,
      ppoId: values.ppoId?.value,
      discount: values.discount,
      remark: values.remark,
      tac: values.tac,
      shipTo: values.shipTo,
      invoiceTo: values.invoiceTo,
      companyName: values.companyName,
      pickUpAddress: values.pickUpAddress,
      inputType: values.inputType,
      partOrderDtoList: value,
      date: values['date']?.format('YYYY-MM-DD'),
      validUntil: values['validUntil']?.format('YYYY-MM-DD'),
      rfqType: 'LOGISTIC',
      vendorQuotationDto: {
        ...values,
        id: vendorQuotationId,
        attachments: files,
        rfqType: 'LOGISTIC',
        vendorId: values.vendorId?.value,
        quoteRequestVendorId: fullDataSet.quoteRequestVendorId,
        vendorQuotationDetails: values.vendorQuotationDetails,
        vendorQuotationFees: values.vendorQuotationFees?.filter(
          (fee) => fee.feeName
        ),
      },
    };
    try {
      if (!id && inputType === 'CS') {
        await LogisticPOService.SavePO(modifiedValue);
      } else if (!id && inputType === 'MANUAL') {
        await LogisticPOService.manualSavePO(modifiedValue);
      } else {
        await LogisticPOService.manualUpdatePO(id, modifiedValue);
      }
      notification['success']({
        message: 'Saved successfully',
      });
      form.resetFields();
      navigate('/logistic/pending-purchase-order');
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  const onReset = () => {
    if (!id) {
      form.resetFields();
      setCsID(null);
    } else {
      getPoById();
    }
  };

  useEffect(() => {
    id && getPoById();
  }, [id]);

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
            {route === 'list' ? (
              <Link to={`/logistic/pending-purchase-order`}>
                Add Order List
              </Link>
            ) : null}
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'Edit' : 'Add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission={[
          'LOGISTIC_LOGISTIC_ORDER_LOGISTIC_PURCHASE_ORDER_SAVE',
          'LOGISTIC_LOGISTIC_ORDER_LOGISTIC_PURCHASE_ORDER_EDIT',
        ]}
        showFallback
      >
        <ARMCard
          title={
             getLinkAndTitle('Logistic Order')
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
                    disabled={id}
                    placeholder="--- Select Input Type ---"
                    allowClear
                    onChange={(e) => {
                      setInputType(e);
                    }}
                  >
                    <Option value="CS">CS</Option>
                    <Option value="MANUAL">Manual</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="ppoId"
                  label="Material Management PO"
                  hidden={inputType === 'CS' || inputType === ''}
                >
                  <DebounceSelect
                    mapper={(v) => ({
                      label: v.orderNo,
                      value: v.id,
                    })}
                    showSearch
                    placeholder="--- Select Purchase Order No. ---"
                    url={`/procurement/part-orders/search?page=1&size=20`}
                    params={{
                      type: 'APPROVED',
                      rfqType: 'PROCUREMENT',
                    }}
                    disabled={id}
                    onChange={(newValue) => {
                      getPoPartsByPoId(newValue.value);
                      setPPoData(newValue);
                    }}
                    selectedValue={pPoData}
                  />
                </Form.Item>

                <Form.Item
                  label="Select CS"
                  name="csId"
                  hidden={inputType === 'MANUAL' || inputType === ''}
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
                    url={`/logistic/comparative-statements/final-management/search?page=1&size=10`}
                    selectedValue={selectCsId}
                    params={{ type: 'APPROVED' }}
                    onChange={(newValue) => {
                      setCsID(newValue.value);
                      setSubTotal(0);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="remark"
                  label="Remark"
                >
                  <TextArea rows={4} />
                </Form.Item>

                <Form.Item
                  name="tac"
                  label="Terms & Conditions"
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
                  name="companyName"
                  label="Company Name"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="pickUpAddress"
                  label="Pick-up Address"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {inputType === '' ? null : (
              <>
                {inputType === 'CS' && id === undefined && csID !== null && (
                  <ARMCard
                    title="Purchase Order Detail"
                    style={{ marginTop: '10px' }}
                  >
                    <CsPoDetails
                      id={csID}
                      form={form}
                      setSubTotal={setSubTotal}
                      subTotal={subTotal}
                      value={value}
                      setValue={setValue}
                    />
                  </ARMCard>
                )}
                {(inputType === 'MANUAL' || id !== undefined) && (
                  <ManualLogisticPo
                    id={id}
                    form={form}
                    attachmentList={attachmentList}
                    loading={loading}
                    handleFileInput={handleFileInput}
                    getPartById={getPartById}
                    inputType={inputType}
                    poParts={poParts}
                  />
                )}

                <Form.Item
                  wrapperCol={{ ...layout.wrapperCol }}
                  style={{ marginTop: '30px' }}
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
              </>
            )}
          </ARMForm>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default LogisticPO;
