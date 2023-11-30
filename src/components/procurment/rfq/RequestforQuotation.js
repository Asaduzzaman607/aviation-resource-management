import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Space,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyResponseError } from '../../../lib/common/notifications';
import { getLinkAndTitle} from '../../../lib/common/TitleOrLink';
import ProqurementRequisitionService from '../../../service/procurment/ProqurementRequisitionService';
import RequestforQuotationService from '../../../service/procurment/RequestforQuotationService';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ARMButton from '../../common/buttons/ARMButton';
import DebounceSelect from '../../common/DebounceSelect';
import RibbonCard from '../../common/forms/RibbonCard';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import FormControl from '../../store/common/FormControl';
import InnerFields from './InnerFields';
import POService from '../../../service/procurment/POService';
import { useSelector } from 'react-redux';
import Loading from "../../store/common/Loading";
import {getVendorStatus} from "../../../lib/common/manufacturerSupplierUtils";

const RequestforQuotation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editRfq, setEditRfq] = useState([]);
  const [pr, setPr] = useState([]);
  const [isRepair, setIsRepair] = useState('');
  const po = Form.useWatch('partOrderId', form);
  const requisition = Form.useWatch('requisitionId', form);
  const layout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
  };
  const stringToMomentDate = (dateString) => {
    if (!dateString) return '';
    return moment(dateString, 'YYYY-MM-DD');
  };

  const getRequestQuotationById = async () => {
    setLoading(true);
    try {
      const {data} =
        await RequestforQuotationService.getRequestforQuotationById(id);
      let vlist = [];
      setPr(data.rfqPartViewModels);
      data.rfqVendorResponseDto.quoteRequestVendorModelList?.map(
        (data) => (
          vlist.push({
            ...data,
            vendorId:{label:data.vendorName, value:data.vendorId},
            vendorStatus: getVendorStatus( data.vendorWorkFlowName),
            requestDate: stringToMomentDate(data.requestDate),
          })
        )
      );

      const modifiedValue = {
        ...data,
        quoteRequestVendorModelList: vlist,
      };
      form.setFieldsValue({
        ...modifiedValue,
        rfqNo: modifiedValue.rfqVendorResponseDto.rfqNo,
        requisitionId: {
          value: modifiedValue.rfqVendorResponseDto.requisitionId,
          label: modifiedValue.rfqVendorResponseDto.voucherNo,
        },
        partOrderId: {
          value: modifiedValue.rfqVendorResponseDto.partOrderId,
          label: modifiedValue.rfqVendorResponseDto.orderNo,
        },
      });
      setEditRfq(modifiedValue);
    } catch (er) {
      notification['error']({message: getErrorMessage(er)});
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    getRequestQuotationById().catch(console.error);
  }, [id]);

  const onFinish = async (values) => {
    let vlist = [];
    values.quoteRequestVendorModelList?.map((data) =>
      vlist.push({
        ...data,
        requestDate: data['requestDate']?.format('YYYY-MM-DD'),
        vendorId:data?.vendorId?.value,
      })
    );
    const modifiedValue = {
      ...values,
      requisitionId: values.requisitionId?.value,
      partOrderId: values.partOrderId?.value,
      quoteRequestVendorModelList: vlist,
    };
    try {
      if (id) {
        await RequestforQuotationService.updateRequestforQuotation(id, modifiedValue);
      } else {
        if (isRepair === 'REPAIR') {
          await RequestforQuotationService.saveRequestforQuotation({...modifiedValue, isRepair: true,});
        } else {
          await RequestforQuotationService.saveRequestforQuotation(modifiedValue);
        }
      }
      form.resetFields();
      navigate('/material-management/pending-rfq');
      notification['success']({
        message: id ? 'Successfully updated!' : 'Successfully added!',
      });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const onReset = () => {
    id ? form.setFieldsValue({ ...editRfq }) : form.resetFields();
  };

  const getPR = async (value, type) => {
    try {
      if (value === '' || value === undefined) setPr([]);
      else {
        if (type === 'po') {
          let { data } = await POService.getPOById(value);
          setPr(data.poItemResponseDtoList);
        }
        if (type === 'requisition') {
          let { data } = await ProqurementRequisitionService.getRequisitionById(
            value
          );
          setPr(data.requisitionItemViewModels);
        }
      }
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const route = useSelector((state) => state.routeLocation.previousRoute);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fa fa-shopping-basket" />
            <Link to="/material-management">&nbsp; Material Management</Link>
          </Breadcrumb.Item>
          {route === 'list' ? (
            <Breadcrumb.Item>
              <Link to="/material-management/pending-rfq">
                Pending Rfq List
              </Link>
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item>Request for Quotation(RFQ)</Breadcrumb.Item>
          )}

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
        {
          !loading?<>
            <ARMCard
              title={
                route === 'list'
                  ? getLinkAndTitle(
                    'Request for Quotation(RFQ)',
                    '/material-management/pending-rfq'
                  )
                  : getLinkAndTitle(
                    'Request for Quotation(RFQ)',
                    '/material-management'
                  )
              }
            >
              <ARMForm
                {...layout}
                form={form}
                initialValues={{
                  quoteRequestVendorModelList: [
                    {
                      id: null,
                    },
                  ],
                }}
                name="RFQ"
                onFinish={onFinish}
                scrollToFirstError
              >
                <Row>
                  <Col
                    sm={20}
                    md={10}
                  >
                    <Form.Item
                      name="rfqNo"
                      label="RFQ No"
                      rules={[
                        {
                          required: !!id,
                          message: 'This field is required!',
                        },
                      ]}
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
                      name="requisitionId"
                      label="Requisition"
                      hidden={id && form.getFieldValue('partOrderId')?.value}
                    >
                      <DebounceSelect
                        mapper={(v) => ({
                          label: v.voucherNo,
                          value: v.id,
                        })}
                        showSearch
                        placeholder="--- Select Requisition No. ---"
                        url={`/procurement-requisitions/search?page=1&size=20`}
                        params={{ type: 'APPROVED' }}
                        disabled={
                          !!(id || form.getFieldValue('partOrderId')?.value)
                        }
                        onChange={(newValue) => {
                          getPR(newValue.value, 'requisition');
                        }}
                        selectedValue={requisition}
                        allowClear
                      />
                    </Form.Item>
                    <Form.Item
                      name="partOrderId"
                      label="Repair Order"
                      hidden={id && form.getFieldValue('requisitionId')?.value}
                    >
                      <DebounceSelect
                        mapper={(v) => ({
                          label: v.orderNo,
                          value: v.id,
                        })}
                        showSearch
                        placeholder="--- Select Repair Order No. ---"
                        url={`/procurement/part-orders/search?page=1&size=20`}
                        params={{
                          type: 'APPROVED',
                          rfqType: 'PROCUREMENT',
                          orderType: 'REPAIR',
                        }}
                        disabled={
                          !!(id || form.getFieldValue('requisitionId')?.value)
                        }
                        onChange={(newValue) => {
                          getPR(newValue.value, 'po');
                          setIsRepair('REPAIR');
                        }}
                        selectedValue={po}
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <FormControl>
                  <RibbonCard ribbonText={'Vendor'}>
                    <p />
                    <Form.List name="quoteRequestVendorModelList">
                      {(fields, { add, remove }) => (
                        <>
                          {fields?.map(({ key, name, ...restField }, index) => (
                            <Row
                              key={key}
                              gutter={16}
                              style={{marginTop:'10px'}}
                            >
                              <InnerFields
                                form={form}
                                name={name}
                                restField={restField}
                                index={index}
                              />
                              <Col
                                xs={24}
                                sm={24}
                                md={1}
                              >
                                {form.getFieldValue('quoteRequestVendorModelList')[
                                  index
                                  ]?.id ? (
                                  ''
                                ) : (
                                  <Button
                                    onClick={() => remove(index)}
                                    danger
                                  >
                                    <MinusCircleOutlined />
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          ))}
                          <Form.Item wrapperCol={{ ...layout.labelCol }}>
                            <ARMButton
                              type="primary"
                              onClick={() => {
                                add();
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
                    <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
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
            &nbsp;
            <ARMCard title="Parts List">
              <ResponsiveTable>
                <ARMTable>
                  <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Part No</th>
                    <th>Description</th>
                    <th>Order QTY</th>
                    <th>Priority</th>
                  </tr>
                  </thead>
                  <tbody>
                  {pr?.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.partNo}</td>
                      <td>{data.partDescription}</td>
                      <td>
                        {data.requisitionQuantity ||
                          data.quantity ||
                          data.quantityRequested}
                      </td>
                      <td>{data.requisitionPriority || data.priority}</td>
                    </tr>
                  ))}
                  </tbody>
                </ARMTable>
              </ResponsiveTable>
            </ARMCard>
          </>:<Loading/>
        }
      </Permission>
    </CommonLayout>
  );
};

export default RequestforQuotation;
