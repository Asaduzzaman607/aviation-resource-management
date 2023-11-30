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
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError, notifySuccess } from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { Status } from '../../../lib/constants/status-button';
import { usePaginate } from '../../../lib/hooks/paginations';
import shipmentService from '../../../service/procurment/ShipmentService';
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
import MSPDetails from '../../configaration/manufacturer/MSPDetails';
import CommonLayout from '../../layout/CommonLayout';
import useViewDetails from '../../store/hooks/ViewDetails';
import React from "react";
import { useDispatch } from 'react-redux';
import { setLocation } from '../../../reducers/routeLocation.reducers';

const PendingShipmentProvider = () => {
  const { Option } = Select;
  const [workFlowActions, setWorkFlowActions] = useState([]);
  const dispatch = useDispatch();
  dispatch(setLocation({ value:'list'}));
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
  } = usePaginate(
    'pendingShipmentProvider',
    '/material-management/config/shipment_provider/search',
    {
      workflowType: 'OWN_DEPARTMENT',
    }
  );

  const { isModalOpen, setIsModalOpen, data, handleViewDetails } =
    useViewDetails();

  console.log('pending  demand list', collection);

  const getAllWorkFlow = async (status) => {
    try {
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        permissions.subModuleItems.MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER
      );
      setWorkFlowActions(data.model);
    } catch (er) {
      notifyError(getErrorMessage(er));
    }
  };

  const handleStatus = async (id) => {
    try {
      await shipmentService.toggleStatus(
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
      const { data } = await shipmentService.toggleApprove(
        id,
        status,
        (description = null)
      );
      //await  getItemDemand(isActive)
      refreshPagination();
      notifySuccess('Status changed successfully!');
    } catch (er) {
      notifyError(getErrorMessage(er));
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

  console.log('workFlowActions', workFlowActions);
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/material-management">
              <i className="fa fa-shopping-basket" /> &nbsp;Material Management
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Pending Shipment Provider List</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_PENDING_LIST_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            'Pending Shipment Provider LIST',
            '/material-management/shipment-provider/add',
            true,
            'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_PENDING_LIST_SAVE'
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
                md={6}
              >
                <Form.Item name="query">
                  <Input placeholder="Enter Name" />
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

          <Row className="table-responsive">
            <ResponsiveTable>
              <ARMTable>
                <thead>
                  <tr>
                    <th rowSpan={2}>Name</th>
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
                      <td>{data.name}</td>
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
                          <Permission permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_PENDING_LIST_EDIT">
                            <Link
                              to={`/material-management/shipment-provider/edit/${data.id}`}
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
                          <Permission permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_PENDING_LIST_DELETE">
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
          </Row>

          {collection.length === 0 ? (
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
              <MSPDetails
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                data={data}
                shipmentProvider
                details='Shipment Provider Details'
              />
            </Row>
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default PendingShipmentProvider;
