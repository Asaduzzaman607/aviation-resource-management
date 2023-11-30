import {
    EditOutlined,
    EyeOutlined,
    FilterOutlined,
    RollbackOutlined
} from '@ant-design/icons';
import {
    Breadcrumb,
    Col,
    Empty,
    Form,
    Input, Pagination,
    Row,
    Select,
    Space
} from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError, notifySuccess } from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { Status } from '../../../lib/constants/status-button';
import { usePaginate } from '../../../lib/hooks/paginations';
import API from '../../../service/Api';
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
import Loading from '../../store/common/Loading';
import useViewDetails from '../../store/hooks/ViewDetails';
import React from "react";
import { useDispatch } from 'react-redux';
import { setLocation } from '../../../reducers/routeLocation.reducers';

const PendingSupplier = () => {
  const [workFlowActions, setWorkFlowActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Option } = Select;
  const dispatch = useDispatch();
  dispatch(setLocation({ value:'list'}));
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
    'pendingSupplier',
    '/material-management/config/supplier/own_department/search',
    {
      workflowType: 'OWN_DEPARTMENT',
    }
  );

  const { isModalOpen, setIsModalOpen, data, handleViewDetails } =
  useViewDetails();

  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true);
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        permissions.subModuleItems.MATERIAL_MANAGEMENT_SUPPLIER
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
      await API.patch(
        `/material-management/config/supplier/own_department/${id}?active=${
          isActive !== Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE
        }`
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

  const handleApprove = async (id, status) => {
    try {
      await API.put(
        `/material-management/config/supplier/own_department/decide/${id}`,
        status
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
            <Link to="/material-management">
              {' '}
              <i className="fa fa-shopping-basket" />
              &nbsp; material-management
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Pending Supplier List</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_SUPPLIER_MATERIAL_MANAGEMENT_SUPPLIER_PENDING_LIST_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            'Pending Supplier LIST',
            '/material-management/supplier/add',
            true,
            'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_SUPPLIER_MATERIAL_MANAGEMENT_SUPPLIER_SAVE'
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
                  label="Supplier Name"
                  name="query"
                >
                  <Input />
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

          {!loading ? (
            <>
              <ResponsiveTable>
                <ARMTable>
                  <thead>
                    <tr>
                      <th rowSpan={2}>Supplier Name</th>
                      <th colSpan={workFlowActions.length}>APPROVALS</th>
                      <th rowSpan={2}>Status</th>
                      {isActive === Status.ACTIVE && (
                        <th rowSpan={2}>Approve</th>
                      )}
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
                            <Permission permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_SUPPLIER_MATERIAL_MANAGEMENT_SUPPLIER_PENDING_LIST_EDIT">
                              <Link
                                to={`/material-management/supplier/edit/${data.id}`}
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
                            <Permission permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_SUPPLIER_MATERIAL_MANAGEMENT_SUPPLIER_PENDING_LIST_DELETE">
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
                      <MSPDetails
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        data={data}
                        details='Supplier Details'
                      />
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

export default PendingSupplier;
