import React from 'react';
import {
  Breadcrumb,
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
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePaginate } from '../../../lib/hooks/paginations';
import WorkflowActionService from '../../../service/WorkflowActionService';
import { getErrorMessage } from '../../../lib/common/helpers';
import CommonLayout from '../../layout/CommonLayout';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMTable from '../../common/ARMTable';
import permissions from '../../auth/permissions';
import { notifyError } from '../../../lib/common/notifications';
import Permission from '../../auth/Permission';
import useViewDetails from '../../store/hooks/ViewDetails';
import MSPDetails from '../../configaration/manufacturer/MSPDetails';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';

const ApprovedShipmentProvider = () => {
  const { Option } = Select;
  const [workFlowActions, setWorkFlowActions] = useState([]);

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
    'approvedShipmentProvider',
    '/material-management/config/shipment_provider/search',
    {
      workflowType: 'OWN_DEPARTMENT',
      type: 'APPROVED',
    }
  );

  const { isModalOpen, setIsModalOpen, data, handleViewDetails } =
    useViewDetails();

  console.log('approved  demand list', collection);
  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);
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
  const onFinish = (values) => {
    fetchData({
      ...values,
      type: 'APPROVED',
      workflowType: 'OWN_DEPARTMENT',
    });
  };
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/material-management">
              <i className="fa fa-shopping-basket" /> &nbsp;Material Management
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Approved Shipment Provider List</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_APPROVED_LIST_SEARCH"
        showFallback
      >
        <ARMCard title={getLinkAndTitle("Approve Shipment Provider List", '/material-management')}>
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
                  name="query"
                  label="SP Name"
                >
                  <Input placeholder="Shipment Provider Name" />
                </Form.Item>
                <Form.Item
                  name="type"
                  initialValue={'APPROVED'}
                  hidden
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="workflowType"
                  initialValue={'OWN_DEPARTMENT'}
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
                      onClick={() => {
                        form.resetFields();
                        fetchData({
                          type: 'APPROVED',
                          workflowType: 'OWN_DEPARTMENT',
                        });
                      }}
                    >
                      <RollbackOutlined /> Reset
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <ResponsiveTable>
            <ARMTable>
              <thead>
                <tr>
                  <th rowSpan={2}>Shipment Provider Name</th>
                  <th colSpan={workFlowActions.length}>APPROVALS</th>
                  <th rowSpan={2}>Status</th>
                  <th rowSpan={2}>View Details</th>
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
                        {data.approvalStatuses[action.id]?.updatedByName || ''}
                      </td>
                    ))}
                    <td>{data.workflowName}</td>
                    <td>
                      <Space size="small">
                      {/*<Link to={`/material-management/request-for-quotation-details/${data.id}`}>*/}
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
                      {/*</Link>*/}
                      <Link
                        to={`/material-management/shipment-provider/edit/${data.id}`}
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
                  <MSPDetails
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    data={data}
                    shipmentProvider
                    details='Shipment Provider Details'
                  />
                </Row>
              )}
            </Col>
          </Row>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default ApprovedShipmentProvider;
