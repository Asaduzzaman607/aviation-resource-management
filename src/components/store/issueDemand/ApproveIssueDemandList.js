import {
  CheckOutlined,
  ExclamationCircleFilled,
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
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Tooltip,
  notification,
} from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError, notifySuccess } from '../../../lib/common/notifications';
import { usePaginate } from '../../../lib/hooks/paginations';
import WorkflowActionService from '../../../service/WorkflowActionService';
import IssueDemandService from '../../../service/store/IssueDemandService';
import Permission from '../../auth/Permission';
import subModules from '../../auth/sub_module';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import Loading from '../common/Loading';

const { Option } = Select;
const { confirm } = Modal;

const ApproveIssueDemandList = () => {
  const [workFlowActions, setWorkFlowActions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { form, collection, page, totalElements, paginate, fetchData, size } =
    usePaginate('approveIssueDemands', '/store/issues/search', {
      type: 'APPROVED',
    });

  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);

  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true);
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        subModules.ISSUE_DEMANDS
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

  function getStatus(workflowName, isReturnApproved) {
    let status;
    if (isReturnApproved === false) {
      status = workflowName + '  ' + 'Pending on return';
    } else {
      status = workflowName;
    }
    return status;
  }

  const returnPendingStatus = (id) => {
    confirm({
      title: 'Do you want to approve?',
      icon: <ExclamationCircleFilled />,
      content: '',
      async onOk() {
        try {
          await IssueDemandService.returnPendingStatus(id);
          fetchData({
            type: 'APPROVED',
            page: page,
          });
          notifySuccess('Status Changed Successfully!');
        } catch (er) {
          notifyError(getErrorMessage(er));
        }
      },
      onCancel() {},
    });
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-archive" />
            <Link to="/store">&nbsp; Store</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Approve Issues </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission="STORE_PARTS_ISSUE_APPROVED_ISSUE_SEARCH"
        showFallback
      >
        <ARMCard title={getLinkAndTitle('Approve Issue List', '/store')}>
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
                  label="Voucher No."
                  name="query"
                >
                  <Input placeholder="Enter Voucher No." />
                </Form.Item>
                <Form.Item
                  name="type"
                  hidden
                  initialValue="APPROVED"
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
                      <th rowSpan={2}>Voucher No</th>
                      <th colSpan={workFlowActions.length}>APPROVALS</th>
                      <th rowSpan={2}>Status</th>
                      <th rowSpan={2}>Actions</th>
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
                        <td>{data.voucherNo}</td>
                        {workFlowActions?.map((action) => (
                          <td key={action.id}>
                            {data.approvalStatuses[action.id]?.updatedByName ||
                              ''}
                          </td>
                        ))}
                        <td>
                          {data?.isReturnApproved
                            ? getStatus(
                                data?.workflowName,
                                data?.isReturnApproved
                              )
                            : 'Return Pending'}
                        </td>
                        <td>
                          <Tooltip
                            placement="top"
                            title="View Details"
                          >
                            <Link
                              to={`/store/approve-issues/details/${data.id}`}
                            >
                              <ARMButton
                                type="primary"
                                size="small"
                                style={{
                                  backgroundColor: '#4aa0b5',
                                  borderColor: '#4aa0b5',
                                }}
                              >
                                <EyeOutlined />
                              </ARMButton>
                            </Link>
                          </Tooltip>
                          <Tooltip
                            placement="top"
                            title="Return Approve"
                          >
                            <ARMButton
                              disabled={data?.isReturnApproved}
                              type="primary"
                              size="small"
                              style={{
                                backgroundColor: data?.isReturnApproved
                                  ? ''
                                  : '#04aa6d',
                                borderColor: data?.isReturnApproved
                                  ? ''
                                  : '#04aa6d',
                                marginLeft: '5px',
                              }}
                              onClick={() => returnPendingStatus(data?.id)}
                            >
                              <CheckOutlined />
                            </ARMButton>
                          </Tooltip>
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
export default ApproveIssueDemandList;
