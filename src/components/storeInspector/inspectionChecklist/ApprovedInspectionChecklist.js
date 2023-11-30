import {
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
  notification,
  Pagination,
  Row,
  Select,
  Space,
} from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { usePaginate } from '../../../lib/hooks/paginations';
import WorkflowActionService from '../../../service/WorkflowActionService';
import Permission from '../../auth/Permission';
import permissions from '../../auth/permissions';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import useViewDetails from '../../store/hooks/ViewDetails';
import InspectionCheckListDetails from './InspectionCheckListDetails';
import React from "react";

const ApprovedInspectionChecklist = () => {
  const { Option } = Select;
  const { id } = useParams();
  const [workFlowActions, setWorkFlowActions] = useState([]);

  const {
    form,
    collection,
    page,
    totalElements,
    paginate,
    fetchData,
    size,
    loading,
  } = usePaginate(
    'approvedInspectionChecklist',
    '/store-inspector/own_department/inspection-checklists/search',
    { workflowType: 'OWN_DEPARTMENT', type: 'APPROVED' }
  );

  const { isModalOpen, setIsModalOpen, data, handleViewDetails } =
    useViewDetails();

  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);

  const getAllWorkFlow = async (status) => {
    try {
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        permissions.subModuleItems.STORE_INSPECTOR_INSPECTION_CHECKLIST
      );
      setWorkFlowActions(data.model);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
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
            <SolutionOutlined />
            <Link to="/storeInspector">&nbsp; Store Inspector</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Approved Inspection Checklist</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="STORE_INSPECTOR_INSPECTION_CHECKLIST_STORE_INSPECTOR_APPROVED_INSPECTION_CHECKLIST_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            ' Approved Inspection Checklist',
            '/storeInspector'
          )}
        >
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
                <Form.Item name="query">
                  <Input />
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
                    <Option value="4">10</Option>
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
                  <th rowSpan={2}>Des No</th>
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
                    <td>{index + 1}</td>
                    {workFlowActions?.map((action) => (
                      <td key={action.id}>
                        {data.approvalStatuses[action.id]?.updatedByName || ''}
                      </td>
                    ))}
                    <td>{data.workflowName}</td>
                    <td>
                      {/*<Link to={`/material-management/request-for-quotation-details/${data.rfqId}`}>*/}
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
                  <InspectionCheckListDetails
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    data={data}
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

export default ApprovedInspectionChecklist;
