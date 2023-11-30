import {
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
  Pagination,
  Row,
  Select,
  Space,
} from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError, notifySuccess } from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { Status } from '../../../lib/constants/status-button';
import { usePaginate } from '../../../lib/hooks/paginations';
import LogisticPIService from '../../../service/logistic/LogisticPIService';
import WorkflowActionService from '../../../service/WorkflowActionService';
import Permission from '../../auth/Permission';
import permissions from '../../auth/permissions';
import ActiveInactive from '../../common/ActiveInactive';
import ApproveDenyButtons from '../../common/ApproveDenyButtons';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import Loading from '../../store/common/Loading';

const PendingAuditLogisticPi = () => {
  const [workFlowActions, setWorkFlowActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Option } = Select;
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
    'pendingAuditLogisticInvoice',
    '/logistic/audit/parts-invoice/search'
  );

  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);

  console.log('Pending Invoice list', collection);

  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true);
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        permissions.subModuleItems.LOGISTIC_PENDING_PARTS_INVOICE_AUDIT
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
      await LogisticPIService.toggleStatusAudit(
        id,
        isActive !== Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE
      );
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
      await LogisticPIService.toggleApproveAudit(
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

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/audit">
              {' '}
              <i className="fas fa-user-shield" />
              &nbsp; Audit
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Pending Logistic Purchase Invoice</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission="AUDIT_LOGISTIC_PARTS_INVOICE_AUDIT_LOGISTIC_PENDING_PARTS_INVOICE_AUDIT_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            'Pending Logistic Purchase Invoice',
            '/logistic/purchase-invoice',
            'blank',
            'AUDIT_LOGISTIC_PARTS_INVOICE_AUDIT_LOGISTIC_PENDING_PARTS_INVOICE_AUDIT_SAVE'
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
                lg={6}
              >
                <Form.Item name="query">
                  <Input placeholder={'Enter PI No.'} />
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
                      <th rowSpan={2}>Invoice No.</th>
                      <th colSpan={workFlowActions.length}>APPROVALS</th>
                      <th rowSpan={2}>Status</th>
                      {isActive === Status.ACTIVE && (
                        <th rowSpan={2}>Approve</th>
                      )}
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
                        <td>{data.invoiceNo}</td>
                        {workFlowActions?.map((action) => (
                          <td key={action.id}>
                            {data.auditApprovalStatuses[action.id]
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
                            <Permission permission="AUDIT_LOGISTIC_PARTS_INVOICE_AUDIT_LOGISTIC_PENDING_PARTS_INVOICE_AUDIT_SEARCH">
                              <Link
                                to={`/audit/logistic/pending-purchase-invoice/details/${data.id}`}
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

                            <Permission permission="AUDIT_LOGISTIC_PARTS_INVOICE_AUDIT_LOGISTIC_PENDING_PARTS_INVOICE_AUDIT_DELETE">
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
    </CommonLayout>
  );
};

export default PendingAuditLogisticPi;
