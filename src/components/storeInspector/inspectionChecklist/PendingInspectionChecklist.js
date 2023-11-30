import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
  SolutionOutlined,
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
import useViewDetails from '../../store/hooks/ViewDetails';
import InspectionCheckListDetails from './InspectionCheckListDetails';
import React from "react";

const PendingInspectionChecklist = () => {
  const { Option } = Select;
  const { id } = useParams();
  const navigate = useNavigate();
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
    resetFilter,
    size,
  } = usePaginate(
    'pendingInspectionChecklist',
    '/store-inspector/own_department/inspection-checklists/search',
    {
      workflowType: 'OWN_DEPARTMENT',
    }
  );

  const { isModalOpen, setIsModalOpen, data, handleViewDetails } =
    useViewDetails();

  const getAllWorkFlow = async (status) => {
    try {
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        permissions.subModuleItems.STORE_INSPECTOR_INSPECTION_CHECKLIST
      );
      setWorkFlowActions(data.model);
    } catch (er) {
      notifyError(getErrorMessage(er));
    }
  };

  const handleStatus = async (id) => {
    try {
      await InspectionChecklistService.toggleStatus(
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
      await InspectionChecklistService.toggleApprove(
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

  const resetData = () => {
    form.resetFields();
    isActive === Status.REJECTED
      ? fetchData({
          type: 'REJECTED',
          workflowType: 'OWN_DEPARTMENT',
        })
      : fetchData({ workflowType: 'OWN_DEPARTMENT' });
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <SolutionOutlined />
            <Link to="/storeInspector">&nbsp; Store Inspector</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Pending Inspection Checklist</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="STORE_INSPECTOR_INSPECTION_CHECKLIST_STORE_INSPECTOR_PENDING_INSPECTION_CHECKLIST_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            'Pending Inspection Checklist',
            '/storeInspector/inspection-checklist',
            'true',
            'STORE_INSPECTOR_INSPECTION_CHECKLIST_STORE_INSPECTOR_PENDING_INSPECTION_CHECKLIST_SAVE'
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
                <Form.Item name="query">
                  <Input placeholder="Enter Description" />
                </Form.Item>
                <Form.Item
                  name="workflowType"
                  initialValue="OWN_DEPARTMENT"
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
                      htmlType="submit"
                      onClick={resetData}
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
                  <th rowSpan={2}>S/L. No.</th>
                  <th colSpan={workFlowActions.length}>APPROVALS</th>
                  <th rowSpan={2}>Status</th>
                  {isActive === Status.ACTIVE && <th rowSpan={2}>Approve</th>}
                  <th rowSpan={2}>Actions</th>
                </tr>
                <tr>
                  {
                    workFlowActions?.map((action) => (
                      <td key={action.id}>{action.label.toUpperCase()}</td>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {collection?.map((data, index) => (
                  <tr key={data.id}>
                    <td>{index + 1}</td>
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
                        <Permission permission="STORE_INSPECTOR_INSPECTION_CHECKLIST_STORE_INSPECTOR_PENDING_INSPECTION_CHECKLIST_EDIT">
                          <Link
                            to={`/storeInspector/edit-inspection-checklist/${data.id}`}
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
                        <Permission permission="STORE_INSPECTOR_INSPECTION_CHECKLIST_STORE_INSPECTOR_PENDING_INSPECTION_CHECKLIST_EDIT">
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
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default PendingInspectionChecklist;
