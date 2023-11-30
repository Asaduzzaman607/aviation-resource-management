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
  Pagination,
  Row,
  Select,
  Space,
} from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError, notifySuccess } from '../../../lib/common/notifications';
import { Status } from '../../../lib/constants/status-button';
import { usePaginate } from '../../../lib/hooks/paginations';
import { setLocation } from '../../../reducers/routeLocation.reducers';
import WorkflowActionService from '../../../service/WorkflowActionService';
import ProqurementRequisitionService from '../../../service/procurment/ProqurementRequisitionService';
import Permission from '../../auth/Permission';
import subModules from '../../auth/sub_module';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ActiveInactive from '../../common/ActiveInactive';
import ApproveDenyButtons from '../../common/ApproveDenyButtons';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import CommonLayout from '../../layout/CommonLayout';
import Loading from '../common/Loading';

const { Option } = Select;

const PendingRequisitionList = () => {
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
  } = usePaginate('pendingRequisition', '/procurement-requisitions/search');

  const [workFlowActions, setWorkFlowActions] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  dispatch(setLocation({ value: 'list' }));

  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true);
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        subModules.PROCUREMENT_REQUISITIONS
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
      await ProqurementRequisitionService.toggleStatus(
        id,
        isActive !== Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE
      );
      notifySuccess('Status Changed Successfully!');
      const values = form.getFieldsValue();
      isActive === Status.REJECTED
        ? fetchData({ isActive, type: 'REJECTED', page: page, ...values })
        : refreshPagination();
    } catch (e) {
      notifyError(getErrorMessage(e));
    }
  };

  const handleApprove = async (id, status, description = null) => {
    try {
      await ProqurementRequisitionService.toggleApprove(
        id,
        status,
        description
      );
      refreshPagination();
      notifySuccess('Status Changed Successfully!');
    } catch (er) {
      notifyError(getErrorMessage(er));
    }
  };

  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-archive" />
            <Link to="/store">&nbsp; Store</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Pending Requisition</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="STORE_PARTS_REQUISITION_PENDING_MANAGEMENT_REQUISITION_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            'Pending Requisition List',
            '/store/material-management/requisition',
            true,
            'STORE_PARTS_REQUISITION_PENDING_MANAGEMENT_REQUISITION_SAVE'
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
                lg={4}
              >
                <Form.Item
                  label="Search Type"
                  name="searchType"
                >
                  <Select defaultValue="query">
                    <Option value="query">Voucher No</Option>
                    <Option value="partNo">Part Number</Option>
                    <Option value="demandBy">Demand By</Option>
                    <Option value="priority">Priority</Option>
                    <Option value="aircraftName">Aircraft Name</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={12}
                lg={8}
              >
                <Form.Item
                  label=""
                  name={Form.useWatch('searchType', form)}
                >
                  <Input
                    onInput={(e) =>
                      (e.target.value = e.target.value.toUpperCase())
                    }
                  />
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
                      <th rowSpan={2}>Voucher No.</th>
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
                            <Link
                              to={`/store/material-management/requisition/pending/details/${data.id}`}
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

                            <Permission permission="STORE_PARTS_REQUISITION_PENDING_MANAGEMENT_REQUISITION_SAVE">
                              <Link
                                to={`/store/material-management/requisition/edit/${data.id}`}
                              >
                                <ARMButton
                                  disabled={!data.editable}
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
                            <Permission permission="STORE_PARTS_REQUISITION_PENDING_MANAGEMENT_REQUISITION_DELETE">
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
            </>
          ) : (
            <Loading />
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};
export default PendingRequisitionList;
