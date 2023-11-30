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
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError, notifySuccess } from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { Status } from '../../../lib/constants/status-button';
import { usePaginate } from '../../../lib/hooks/paginations';
import { setLocation } from '../../../reducers/routeLocation.reducers';
import RequestforQuotationService from '../../../service/procurment/RequestforQuotationService';
import WorkflowActionService from '../../../service/WorkflowActionService';
import Permission from '../../auth/Permission';
import subModules from '../../auth/sub_module';
import ActiveInactive from '../../common/ActiveInactive';
import ApproveDenyButtons from '../../common/ApproveDenyButtons';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';

const { Option } = Select;

const PendingRfq = () => {
  const dispatch = useDispatch();
  dispatch(setLocation({ value: 'list' }));
  const [workFlowActions, setWorkFlowActions] = useState([]);
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
  } = usePaginate('pendingQuoteRequests', 'procurement/quote-requests/search', {
    rfqType: 'PROCUREMENT',
  });

  const getAllWorkFlow = async (status) => {
    try {
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        subModules.REQUEST_FOR_QUOTATION_RFQ
      );
      setWorkFlowActions(data.model);
    } catch (er) {
      notifyError(getErrorMessage(er));
    }
  };

  const handleStatus = async (id) => {
    try {
      await RequestforQuotationService.toggleStatus(
        id,
        isActive !== Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE
      );
      notifySuccess('Status Changed Successfully!');
      const values = form.getFieldsValue();
      isActive === Status.REJECTED
        ? fetchData({
            isActive,
            type: 'REJECTED',
            page: page,
            ...values,
          })
        : refreshPagination();
    } catch (e) {
      notifyError(getErrorMessage(e));
    }
  };

  const handleApprove = async (id, status, description = null) => {
    try {
      await RequestforQuotationService.toggleApprove(
        id,
        status,
        (description = null)
      );
      refreshPagination();
      notifySuccess('Status changed successfully!');
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
            <i className="fa fa-shopping-basket" />
            <Link to="/material-management">&nbsp; Material Management</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Pending RFQ List</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_QUOTE_REQUEST_MATERIAL_MANAGEMENT_PENDING_RFQ_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            'Pending RFQ LIST',
            '/material-management/add-request-for-quotation',
            true,
            'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_QUOTE_REQUEST_MATERIAL_MANAGEMENT_PENDING_RFQ_SAVE'
          )}
        >
          <Form
            form={form}
            onFinish={(values) =>
              isActive === Status.REJECTED
                ? fetchData({
                    type: 'REJECTED',
                    ...values,
                  })
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
                  label="RFQ no"
                  name="query"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="rfqType"
                  initialValue="PROCUREMENT"
                  hidden
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
                        isActive === Status.REJECTED
                          ? fetchData({
                              type: 'REJECTED',
                              rfqType: 'PROCUREMENT',
                            })
                          : fetchData({ rfqType: 'PROCUREMENT' });
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

          <ResponsiveTable>
            <ARMTable>
              <thead>
                <tr>
                  <th rowSpan={2}>RFQ No</th>
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
                    <td>{data.rfqNo}</td>
                    {workFlowActions?.map((action) => (
                      <td key={action.id}>
                        {data.approvalStatuses[action.id]?.updatedByName || ''}
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
                        <Permission permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_QUOTE_REQUEST_MATERIAL_MANAGEMENT_PENDING_RFQ_SEARCH">
                          <Link
                            to={`/material-management/request-for-quotation-pending-details/${data.id}`}
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
                        <Permission permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_QUOTE_REQUEST_MATERIAL_MANAGEMENT_PENDING_RFQ_EDIT">
                          <Link
                            to={`/material-management/edit-request-for-quotation/${data.id}`}
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
                        <Permission permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_QUOTE_REQUEST_MATERIAL_MANAGEMENT_PENDING_RFQ_DELETE">
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
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default PendingRfq;
