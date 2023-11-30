import {
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Checkbox,
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
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError } from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { usePaginate } from '../../../lib/hooks/paginations';
import ProqurementRequisitionService from '../../../service/procurment/ProqurementRequisitionService';
import issueDemandService from '../../../service/store/IssueDemandService';
import WorkflowActionService from '../../../service/WorkflowActionService';
import Permission from '../../auth/Permission';
import subModules from '../../auth/sub_module';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import Loading from '../common/Loading';
import ViewDetailsIssueAndRequisition from '../itemDemad/ViewDetailsIssueAndRequisition';
const { Option } = Select;

const ApproveDemandList = () => {
  const [workFlowActions, setWorkFlowActions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issue, setIssue] = useState([]);
  const [requisition, setRequisition] = useState([]);
  const [isIssue, setIsIssue] = useState();
  const [loading, setLoading] = useState(false);

  const { form, collection, page, totalElements, paginate, fetchData, size } =
    usePaginate('approveDemand', '/store-demands/search', { type: 'APPROVED' });

  console.log('approved  demand list', collection);

  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);

  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true);
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        subModules.STORE_DEMANDS
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

  const handleIssueModalView = async (id) => {
    try {
      setIsModalOpen(true);
      const { data } = await issueDemandService.getIssueDemandById(id);
      setIssue(data);
      setIsIssue(true);
    } catch (e) {
      notifyError(getErrorMessage(e));
    }
  };

  const handleRequisitionModalView = async (id) => {
    try {
      setIsModalOpen(true);
      const { data } = await ProqurementRequisitionService.getRequisitionById(
        id
      );
      setRequisition(data);
      setIsIssue(false);
    } catch (e) {
      notifyError(getErrorMessage(e));
    }
  };
  
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-archive" />
            <Link to="/store">&nbsp; Store</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>approved Demands</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="STORE_PARTS_DEMAND_APPROVED_DEMAND_SEARCH"
        showFallback
      >
        <ARMCard title={getLinkAndTitle('Approve Demand List', '/store')}>
          <Form
            form={form}
            onFinish={onFinish}
            initialValues={{
              notIssued: false,
              notRequisition: false,
            }}
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
                {/* hidden field for paginating approve demand */}
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
                lg={5}
                style={{ display: 'flex', gap: '20px' }}
              >
                <Form.Item
                  label="Not Issued"
                  name="notIssued"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
                <Form.Item
                  name="notRequisition"
                  label="Not Requisition"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={12}
                lg={5}
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
                      <th rowSpan={2}>Voucher No.</th>
                      <th colSpan={workFlowActions.length}>APPROVALS</th>
                      <th rowSpan={2}>Status</th>
                      <th rowSpan={2}>Not Issue</th>
                      <th rowSpan={2}>Not Requisition</th>
                      <th rowSpan={2}>View Details</th>
                    </tr>
                    <tr>
                      {workFlowActions?.map((action) => (
                        <td key={action.id}>{action.label.toUpperCase()}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {collection?.map((data, index) => (
                      <tr key={data.id}>
                        <td>{data.voucherNo}</td>
                        {workFlowActions?.map((action) => (
                          <td key={action.id}>
                            {data.approvalStatuses[action.id]?.updatedByName ||
                              ''}
                          </td>
                        ))}
                        <td>{data.workflowName}</td>
                        <td>
                          {data.issued
                            ? data.issued.map((d, i) => (
                                <span
                                  style={{
                                    color: '#00D5D6',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => handleIssueModalView(d.id)}
                                  key={i}
                                >
                                  {d.voucher} <br />
                                </span>
                              ))
                            : ''}
                        </td>
                        <td>
                          {data.requisition
                            ? data.requisition.map((d, i) => (
                                <span
                                  style={{
                                    color: '#00B8EA',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() =>
                                    handleRequisitionModalView(d.id)
                                  }
                                  key={i}
                                >
                                  {d.voucher} <br />
                                </span>
                              ))
                            : ''}
                        </td>
                        <td>
                          <Link to={`/store/approve-demand/details/${data.id}`}>
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ARMTable>
              </ResponsiveTable>
              {/*** for pagination ***/}
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
              <ViewDetailsIssueAndRequisition
                isIssue={isIssue}
                issue={issue}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                requisition={requisition}
              />
            </>
          ) : (
            <Loading />
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};
export default ApproveDemandList;
