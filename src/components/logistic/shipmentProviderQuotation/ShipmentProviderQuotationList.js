import React from 'react';
import CommonLayout from '../../layout/CommonLayout';
import {
  Breadcrumb,
  Col,
  Empty,
  Form,
  Input,
  notification,
  Pagination,
  Row,
  Select,
  Space,
} from 'antd';
import { usePaginate } from '../../../lib/hooks/paginations';
import { useEffect } from 'react';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import { Link } from 'react-router-dom';
import ARMCard from '../../common/ARMCard';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import ARMButton from '../../common/buttons/ARMButton';
import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import ActiveInactive from '../../common/ActiveInactive';
import ARMTable from '../../common/ARMTable';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import quotationServices from '../../../service/procurment/QuotationServices';
import { getErrorMessage } from '../../../lib/common/helpers';
import Permission from '../../auth/Permission';

const ShipmentProviderQuotationList = () => {
  const { Option } = Select;
  const {
    form,
    collection,
    page,
    totalPages,
    totalElements,
    paginate,
    isActive,
    setIsActive,
    fetchData,
    refreshPagination,
    resetFilter,
    size,
  } = usePaginate('QuotationLogisticList', 'logistic/vendor/quotations/search');

  console.log('Shipment Quotation LIst', collection);
  useEffect(() => {
    refreshPagination();
    fetchData();
  }, []);
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/logistic">
              {' '}
              <i className="fas fa-hand-holding-box" />
              &nbsp; Logistic
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item> &nbsp;Shipment Provider Quotations</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission="LOGISTIC_LOGISTIC_QUOTE_REQUEST_LOGISTIC_QUOTATION_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            'Shipment Provider QUOTATION LIST',
            '/logistic/add-shipment-provider-quotation',
            true,
            'LOGISTIC_LOGISTIC_QUOTE_REQUEST_LOGISTIC_QUOTATION_SAVE'
          )}
        >
          <Form
            form={form}
            onFinish={fetchData}
          >
            <Row gutter={20}>
              <Col
                xs={24}
                md={6}
              >
                <Form.Item name="query">
                  <Input placeholder="Enter Search Text" />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                md={4}
              >
                <Form.Item
                  name="size"
                  label="Page Size"
                  initialValue="10"
                >
                  <Select id="antSelect">
                    <Option value="10">10</Option>
                    <Option value="20">20</Option>
                    <Option value="30">30</Option>
                    <Option value="40">40</Option>
                    <Option value="50">50</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={8}
              >
                <Form.Item>
                  <Space>
                    <ARMButton
                      size="middle"
                      type="primary"
                      htmlType="submit"
                    >
                      <FilterOutlined /> Filter
                    </ARMButton>
                    <ARMButton
                      size="middle"
                      type="primary"
                      htmlType="submit"
                      onClick={resetFilter}
                    >
                      <RollbackOutlined /> Reset
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <ActiveInactive
            isActive={isActive}
            setIsActive={setIsActive}
          />
          <Row className="table-responsive">
            <ARMTable>
              <thead>
                <tr>
                  <th>Quotation Number</th>
                  <th>Vendor Defined Quotation No.</th>
                  <th>RFQ</th>
                  <th>Shipment Provider Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collection?.map((model, index) => (
                  <tr key={index}>
                    <td>{model.quotationNo}</td>
                    <td>{model.vendorQuotationNo}</td>
                    <td>{model.quoteRequestNo}</td>
                    <td>{model.vendorName}</td>
                    <td>
                      <Space size="small">
                        <Permission permission="LOGISTIC_LOGISTIC_QUOTE_REQUEST_LOGISTIC_QUOTATION_SEARCH">
                          <ARMButton
                            type="primary"
                            size="small"
                            style={{
                              backgroundColor: '#4aa0b5',
                              borderColor: '#4aa0b5',
                            }}
                          >
                            <Link
                              to={`/logistic/shipment-provider-quotation/details/${model.id}`}
                            >
                              <EyeOutlined />
                            </Link>
                          </ARMButton>
                        </Permission>

                        <Permission permission="LOGISTIC_LOGISTIC_QUOTE_REQUEST_LOGISTIC_QUOTATION_EDIT">
                          <ARMButton
                            type="primary"
                            size="small"
                            style={{
                              backgroundColor: '#6e757c',
                              borderColor: '#6e757c',
                            }}
                          >
                            <Link
                              to={`/logistic/edit-shipment-provider-quotation/${model.id}`}
                            >
                              <EditOutlined />
                            </Link>
                          </ARMButton>
                        </Permission>

                        <Permission permission="LOGISTIC_LOGISTIC_QUOTE_REQUEST_LOGISTIC_QUOTATION_EDIT">
                          <ActiveInactiveButton
                            isActive={isActive}
                            handleOk={async () => {
                              try {
                                await quotationServices.toggleStatus(
                                  model.id,
                                  !isActive
                                );

                                notification['success']({
                                  message: 'Status Changed Successfully!',
                                });
                                refreshPagination();
                              } catch (e) {
                                notification['error']({
                                  message: getErrorMessage(e),
                                });
                              }
                            }}
                          />
                        </Permission>
                      </Space>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ARMTable>
          </Row>
          {collection?.length === 0 ? (
            <Row>
              <Col style={{ margin: '30px auto' }}>
                <Empty />
              </Col>
            </Row>
          ) : (
            <Row justify="center">
              <Col style={{ marginTop: 10 }}>
                <Pagination
                  showSizeChanger={false}
                  onShowSizeChange={console.log}
                  pageSize={size}
                  current={page}
                  onChange={paginate}
                  total={totalElements}
                />
              </Col>
            </Row>
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default ShipmentProviderQuotationList;
