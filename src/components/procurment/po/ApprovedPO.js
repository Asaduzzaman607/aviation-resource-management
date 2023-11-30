import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
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
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { usePaginate } from '../../../lib/hooks/paginations';
import { setLocation } from '../../../reducers/routeLocation.reducers';
import WorkflowActionService from '../../../service/WorkflowActionService';
import Permission from '../../auth/Permission';
import subModules from '../../auth/sub_module';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import Loading from '../../store/common/Loading';

const { Option } = Select;

const ApprovedPO = () => {
  const [workFlowActions, setWorkFlowActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  dispatch(setLocation({ value: 'approvedList' }));

  const { form, collection, page, totalElements, paginate, fetchData, size } =
    usePaginate('approvedPO', '/procurement/part-orders/search', {
      type: 'APPROVED',
      rfqType: 'PROCUREMENT',
    });

  console.log('approvedPO: ', collection);

  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);

  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true);
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        subModules.PO
      );
      setWorkFlowActions(data.model);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    fetchData({
      ...values,
      type: 'APPROVED',
    });
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/material-management">
              {' '}
              <i className="fa fa-shopping-basket" />
              &nbsp; material-management
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Approve Order</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_ORDER_MATERIAL_MANAGEMENT_PURCHASE_ORDER_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle('Approved Order LIST', '/material-management')}
        >
          <Form
            form={form}
            onFinish={onFinish}
          >
            <Row gutter={20}>
              <Col
                xs={24}
                md={12}
                lg={8}
              >
                <Form.Item
                  label="PO No"
                  name="type"
                  initialValue="APPROVED"
                  hidden
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="PO No"
                  name="query"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={12}
                lg={6}
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
                md={12}
                lg={4}
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
                      htmlType="button"
                      onClick={() => {
                        form.resetFields();
                        fetchData({ type: 'APPROVED' });
                      }}
                    >
                      <RollbackOutlined /> Reset
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {!loading ? (
            <>
              <ResponsiveTable>
                <ARMTable>
                  <thead>
                    <tr>
                      <th rowSpan={2}>PO No</th>
                      <th colSpan={workFlowActions.length}>APPROVALS</th>
                      <th rowSpan={2}>Status</th>
                      <th rowSpan={2}>View Details</th>
                    </tr>
                    <tr>
                      {workFlowActions?.map((action) => (
                        <td key={action.id}>{action.label.toUpperCase()}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {collection?.map((data) => (
                      <tr key={data.id}>
                        <td>{data.orderNo}</td>
                        {workFlowActions?.map((action) => (
                          <td key={action.id}>
                            {data.approvalStatuses[action.id]?.updatedByName ||
                              ''}
                          </td>
                        ))}
                        <td>{data.workflowName}</td>
                        <td>
                          <Space size="small">
                            <Permission permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_ORDER_MATERIAL_MANAGEMENT_PURCHASE_ORDER_SEARCH">
                              <ARMButton
                                type="primary"
                                size="small"
                                style={{
                                  backgroundColor: '#4aa0b5',
                                  borderColor: '#4aa0b5',
                                }}
                                onClick={() => {
                                  navigate(
                                    `/material-management/purchase-order/detail/${data.id}`,
                                    {
                                      state: { pendingOrApproved: 'approved' },
                                    }
                                  );
                                }}
                              >
                                <EyeOutlined />
                              </ARMButton>
                            </Permission>

                            <Permission permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_ORDER_MATERIAL_MANAGEMENT_PURCHASE_ORDER_SEARCH">
                              <ARMButton
                                type="primary"
                                size="small"
                                style={{
                                  backgroundColor: '#6e757c',
                                  borderColor: '#6e757c',
                                }}
                                onClick={() => {
                                  navigate(
                                    `/material-management/purchase-order/edit/${data.id}`,
                                    {
                                      state: { pendingOrApproved: 'approved' },
                                    }
                                  );
                                }}
                              >
                                <EditOutlined />
                              </ARMButton>
                            </Permission>
                          </Space>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ARMTable>
              </ResponsiveTable>

              <Row>
                <Col style={{ margin: '0 auto' }}>
                  {collection.length === 0 ? (
                    <Row justify="end">
                      <Empty style={{ marginTop: '10px' }} />
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
                </Col>
              </Row>
            </>
          ) : (
            <Loading />
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default ApprovedPO;
