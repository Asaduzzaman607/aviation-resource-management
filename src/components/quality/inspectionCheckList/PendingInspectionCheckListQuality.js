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
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError, notifySuccess } from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { Status } from '../../../lib/constants/status-button';
import { usePaginate } from '../../../lib/hooks/paginations';
import InspectionChecklistService from '../../../service/storeInspector/InspectionChecklistService';
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
import useViewDetails from '../../store/hooks/ViewDetails';
import InspectionCheckListDetails from '../../storeInspector/inspectionChecklist/InspectionCheckListDetails';

const PendingInspectionCheckListQuality = () => {
  const { Option } = Select;
  const { id } = useParams();
  const navigate = useNavigate();
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
    resetFilter,
    size,
  } = usePaginate(
    'pendingInspectionChecklistQuality',
    '/store-inspector/quality/inspection-checklists/search',
    {
      workflowType: 'QUALITY',
    }
  );

  const { isModalOpen, setIsModalOpen, data, handleViewDetails } =
  useViewDetails();

  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true);
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        permissions.subModuleItems.QUALITY_PENDING_INSPECTION_CHECKLIST
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
      await InspectionChecklistService.toggleStatusQuality(
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
    } catch (er) {
      notifyError(getErrorMessage(er));
    }
  };

  const handleApprove = async (id, params) => {
    try {
      await InspectionChecklistService.toggleApproveQuality(id, params);
      refreshPagination();
      notifySuccess('Status changed successfully!');
    } catch (e) {
      notifyError(getErrorMessage(e));
    }
  };

  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);
  const resetData = () => {
    form.resetFields();
    isActive === Status.REJECTED
      ? fetchData({
          type: 'REJECTED',
          workflowType: 'QUALITY',
        })
      : fetchData({ workflowType: 'QUALITY' });
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-clipboard-check"></i>
            <Link to="/quality">&nbsp; Quality</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Pending Inspection Checklist</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="QUALITY_QUALITY_INSPECTION_CHECKLIST_QUALITY_PENDING_INSPECTION_CHECKLIST_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            'Pending Inspection Checklist',
            '/storeInspector/inspection-checklist',
            true,
            'QUALITY_QUALITY_INSPECTION_CHECKLIST_QUALITY_PENDING_INSPECTION_CHECKLIST_SAVE'
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
                <Form.Item name="query">
                  <Input placeholder="Enter Description" />
                </Form.Item>
                <Form.Item
                  name="workflowType"
                  initialValue="QUALITY"
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
                      <th rowSpan={2}>S/L. No.</th>
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
                      <tr key={index + 1}>
                        <td>{index + 1}</td>
                        {workFlowActions?.map((action) => (
                          <td key={action.id}>
                            {data.qualityApprovalStatuses[action.id]
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
                            <ARMButton
                              type="primary"
                              size="small"
                              style={{
                                backgroundColor: '#4aa0b5',
                                borderColor: '#4aa0b5',
                              }}
                              onClick={() => handleViewDetails(data)}
                            >
                              <EyeOutlined />
                            </ARMButton>
                            <Permission permission="QUALITY_QUALITY_INSPECTION_CHECKLIST_QUALITY_PENDING_INSPECTION_CHECKLIST_EDIT">
                              <Link
                                to={`/quality/inspection-checklist-edit/${data.id}`}
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
                            <Permission permission="QUALITY_QUALITY_INSPECTION_CHECKLIST_QUALITY_PENDING_INSPECTION_CHECKLIST_DELETE">
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
                        <InspectionCheckListDetails
                          isModalOpen={isModalOpen}
                          setIsModalOpen={setIsModalOpen}
                          data={data}
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

export default PendingInspectionCheckListQuality;
