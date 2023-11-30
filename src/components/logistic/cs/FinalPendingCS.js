import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { Col, Empty, Form, Input, Pagination, Row, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError, notifySuccess } from '../../../lib/common/notifications';
import { Status } from '../../../lib/constants/status-button';
import { usePaginate } from '../../../lib/hooks/paginations';
import WorkflowActionService from '../../../service/WorkflowActionService';
import LogisticCSService from '../../../service/logistic/LogisticCSService';
import Permission from '../../auth/Permission';
import subModules from '../../auth/sub_module';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ActiveInactive from '../../common/ActiveInactive';
import ApproveDenyButtons from '../../common/ApproveDenyButtons';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import Loading from '../../store/common/Loading';

const { Option } = Select;

const FinalPendingCS = () => {
  const [workFlowActions, setWorkFlowActions] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    form,
    collection,
    page,
    totalElements,
    paginate,
    isActive,
    setIsActive,
    fetchData,
    refreshPagination,
    size,
  } = usePaginate(
    'finalLogisticPendingCS',
    '/logistic/comparative-statements/final-management/search'
  );

  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true);
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        subModules.LOGISTIC_FINAL_CS
      );
      setWorkFlowActions(data.model);
    } catch (er) {
      notifyError(getErrorMessage(er));
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id) => {
    try {
      await LogisticCSService.finalPendingToggleStatus(id, isActive !== Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE);
      notifySuccess('Status Changed Successfully!');
      const values = form.getFieldsValue();
      isActive === Status.REJECTED
        ? fetchData({ isActive, type: 'REJECTED', page: page, ...values })
        : refreshPagination();
    } catch (er) {
      notifyError(getErrorMessage(er));
    }
  };

  const handleApprove = async (id, status, description = null) => {
    try {
      await LogisticCSService.toggleApproveFinal(
        id,
        status,
        (description = null)
      );
      refreshPagination();
      notifySuccess('Status changed successfully!');
    } catch (e) {
      notifyError(getErrorMessage(e));
    }
  };

  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);

  return (
    <Permission
      permission="LOGISTIC_LOGISTIC_COMPARATIVE_STATEMENT_LOGISTIC_FINAL_PENDING_CS_SEARCH"
      showFallback
    >
      <ARMCard
        style={{ marginTop: '30px' }}
        title={getLinkAndTitle(
          'Audit Approved Pending Logistic CS LIST',
          '/logistic/comparative-statement',
          true,
          'LOGISTIC_LOGISTIC_COMPARATIVE_STATEMENT_LOGISTIC_FINAL_PENDING_CS_SAVE',
          'LOGISTIC_LOGISTIC_COMPARATIVE_STATEMENT_LOGISTIC_FINAL_PENDING_CS_EDIT'
        )}
      >
        <Form
          form={form}
          onFinish={(values) =>
            isActive === Status.REJECTED
              ? fetchData({ type: 'REJECTED', ...values })
              : fetchData({ ...values })
          }
        >
          <Row gutter={20}>
            <Col
              xs={24}
              md={12}
              lg={8}
            >
              <Form.Item
                label="CS No"
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
                    onClick={() => {
                      form.resetFields();
                      isActive === Status.REJECTED
                        ? fetchData({ type: 'REJECTED' })
                        : fetchData();
                    }}
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
          workFlow={true}
        />

        {!loading ? (
          <>
            <ResponsiveTable>
              <ARMTable>
                <thead>
                  <tr>
                    <th rowSpan={2}>CS No</th>
                    <th colSpan={workFlowActions.length}>APPROVALS</th>
                    <th rowSpan={2}>Status</th>
                    {isActive === Status.ACTIVE && <th rowSpan={2}>Approve</th>}
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
                      <td>{data.csNo}</td>
                      {workFlowActions?.map((action) => (
                        <td key={action.id}>
                          {data.finalApprovalStatuses[action.id]
                            ?.updatedByName || ''}
                        </td>
                      ))}
                      <td>{data.workflowName}</td>
                      {isActive === Status.ACTIVE && (
                        <td>
                          <ApproveDenyButtons
                            data={data}
                            handleOk={handleApprove}
                          />
                        </td>
                      )}
                      <td>
                        <Space size="small">
                          <Permission permission="LOGISTIC_LOGISTIC_COMPARATIVE_STATEMENT_LOGISTIC_FINAL_PENDING_CS_SEARCH">
                            <Link
                              to={`/logistic/comparative-statement/edit/${data.id}`}
                            >
                              <ARMButton
                                type="primary"
                                size="small"
                                style={{
                                  backgroundColor: '#6e757c',
                                  borderColor: '#6e757c',
                                }}
                              >
                                <EditOutlined />
                              </ARMButton>
                            </Link>
                          </Permission>
                          <Permission permission="LOGISTIC_LOGISTIC_COMPARATIVE_STATEMENT_LOGISTIC_FINAL_PENDING_CS_SEARCH">
                            <Link
                              to={`/logistic/comparative-statement/detail/${data.id}`}
                              state={{
                                isAuditApproved: true,
                              }}
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
                          </Permission>
                          <Permission permission="LOGISTIC_LOGISTIC_COMPARATIVE_STATEMENT_LOGISTIC_FINAL_PENDING_CS_DELETE">
                            <ActiveInactiveButton
                              isActive={isActive}
                              handleOk={() => handleStatus(data.id)}
                            />
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
  );
};

export default FinalPendingCS;
