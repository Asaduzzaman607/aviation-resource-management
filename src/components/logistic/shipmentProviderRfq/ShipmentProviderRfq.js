import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
} from 'antd';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import {getLinkAndTitle, LinkAndTitle} from '../../../lib/common/TitleOrLink';
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
import {useShipmentProviderRfq} from '../hooks/shipmentProviderRfq';
import Loading from "../../store/common/Loading";

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
const dateFormat = 'YYYY/MM/DD';
const ShipmentProviderRfq = () => {
  const {id, form, purchaseOrder, getPurchaseOrder, onFinish, onReset, loading} =
    useShipmentProviderRfq();


  const route = useSelector((state) => state.routeLocation.previousRoute);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-hand-holding-box"/>
            <Link to="/logistic">&nbsp; Logistic</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>

            {route === "list" ? <Link to="/logistic/pending-shipment-provider-rfq">
                Pending Shipment Provider RFQ
              </Link> :
              "Shipment Provider RFQ"
            }
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission={[
          'LOGISTIC_LOGISTIC_QUOTE_REQUEST_LOGISTIC_REQUEST_FOR_QUOTATION_SAVE',
          'LOGISTIC_LOGISTIC_QUOTE_REQUEST_LOGISTIC_REQUEST_FOR_QUOTATION_EDIT',
        ]}
        showFallback
      >
        {
          !loading ? <>
            <ARMCard
              //title="Shipment Provider RFQ"
              title={
                route === 'list'
                  ? getLinkAndTitle(
                    'Part Return',
                    '/logistic/pending-shipment-provider-rfq'
                  )
                  : getLinkAndTitle('Shipment Provider RFQ', '/logistic')
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
                name="SPRFQ"
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
                      hidden={!id}
                    >
                      <Input disabled/>
                    </Form.Item>
                    <Form.Item
                      name="partOrderId"
                      label="PO No."
                      rules={[
                        {
                          required: true,
                          message: 'PO No. is required!',
                        },
                      ]}
                    >
                      <DebounceSelect
                        mapper={(v) => ({
                          label: v.orderNo,
                          value: v.id,
                        })}
                        showSearch
                        placeholder="---Select PO No.---"
                        type="multi"
                        url={`/procurement/part-orders/search?page=1&size=20`}
                        params={{isActive: true, type: 'APPROVED'}}
                        disabled={!!id}
                        onChange={(newValue) => {
                          getPurchaseOrder(newValue);
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <FormControl>
                  <RibbonCard ribbonText={'Shipment Provider'}>
                    <Form.List name="quoteRequestVendorModelList">
                      {(fields, {add, remove}) => (
                        <>
                          {fields?.map(({key, name, ...restField}) => (
                            <Row
                              gutter={50}
                              key={key}
                            >
                              <Col
                                xs={24}
                                sm={24}
                                md={10}
                              >
                                <Form.Item
                                  {...restField}
                                  name={[name, 'requestDate']}
                                  initialValue={moment()}
                                  rules={[
                                    {
                                      required: true,
                                      message: ' Request Date required',
                                    },
                                  ]}
                                >
                                  <DatePicker
                                    size="medium"
                                    placeholder="Request Date"
                                    format={dateFormat}
                                    style={{width: '100%'}}
                                  ></DatePicker>
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={10}
                              >
                                <Form.Item
                                  {...restField}
                                  name={[name, 'vendorId']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Shipment Provider required',
                                    },
                                  ]}
                                  style={{width: '100%'}}
                                >
                                  <DebounceSelect
                                    mapper={(v) => ({
                                      label: v.name,
                                      value: v.id,
                                    })}
                                    showSearch
                                    placeholder="---Select Shipment Provider---"
                                    type="multi"
                                    url={`/material-management/config/shipment_provider/search?page=1&size=20`}
                                    params={{type: 'APPROVED'}}
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={1}
                              >
                                {id ? (
                                  ''
                                ) : (
                                  <Button
                                    onClick={() => remove(name)}
                                    danger
                                  >
                                    <MinusCircleOutlined/>
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          ))}
                          <Form.Item wrapperCol={{...layout.labelCol}}>
                            <ARMButton
                              type="primary"
                              onClick={() => {
                                add();
                              }}
                              icon={<PlusOutlined/>}
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
                    <Form.Item wrapperCol={{...layout.wrapperCol}}>
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
                    <th>QTY</th>
                    <th>Unit Price</th>
                  </tr>
                  </thead>
                  <tbody>
                  {purchaseOrder?.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.partNo}</td>
                      <td>{data.partDescription}</td>
                      <td>
                        {data.quantity > data.vendorQuotationInvoiceDetails?.moq
                          ? data.quantity
                          : data.vendorQuotationInvoiceDetails?.moq}
                      </td>
                      <td>{data.unitPrice}</td>
                    </tr>
                  ))}
                  </tbody>
                </ARMTable>
              </ResponsiveTable>
            </ARMCard>
          </> : <Loading/>
        }

      </Permission>
    </CommonLayout>
  );
};

export default ShipmentProviderRfq;
