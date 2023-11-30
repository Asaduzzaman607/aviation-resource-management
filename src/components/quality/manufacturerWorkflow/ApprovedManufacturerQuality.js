import {
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined
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
  Space
} from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError } from '../../../lib/common/notifications';
import { usePaginate } from '../../../lib/hooks/paginations';
import WorkflowActionService from '../../../service/WorkflowActionService';
import Permission from '../../auth/Permission';
import permissions from '../../auth/permissions';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import MSPDetails from '../../configaration/manufacturer/MSPDetails';
import CommonLayout from '../../layout/CommonLayout';
import Loading from '../../store/common/Loading';
import useViewDetails from '../../store/hooks/ViewDetails';
import React from "react";

const { Option } = Select;

const ApprovedManufacturerQuality = () => {
  const [workFlowActions, setWorkFlowActions] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    form,
    collection,
    page,
    totalElements,
    paginate,
    fetchData,
    size,
    resetFilter,
  } = usePaginate(
    'approvedManufacturerQuality',
    '/config/quality/manufacturer/search',
    {
      workflowType: 'QUALITY',
      type: 'APPROVED',
    }
  );

  const { isModalOpen, setIsModalOpen, data, handleViewDetails } =
    useViewDetails();

  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);

  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true);
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        permissions.subModuleItems.QUALITY_MANUFACTURER_PENDING_LIST
      );
      setWorkFlowActions(data.model);
    } catch (er) {
      notifyError(getErrorMessage(er));
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    fetchData({
      ...values,
      type: 'APPROVED',
      workflowType: 'QUALITY',
    });
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-clipboard-check"></i>
            <Link to="/quality">&nbsp; Quality</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Approve Manufacturer List</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission="QUALITY_QUALITY_MANUFACTURER_QUALITY_MANUFACTURER_APPROVED_LIST_SEARCH"
        showFallback
      >
        <ARMCard title="Approved Manufacturers List">
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
                  label="Manufacturer Name"
                  name="query"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="type"
                  initialValue="APPROVED"
                  hidden
                >
                  <Input />
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
                      htmlType="submit"
                      onClick={() => {
                        form.resetFields();
                        fetchData({
                          type: 'APPROVED',
                          workflowType: 'QUALITY',
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
          {!loading ? (
            <>
              <ResponsiveTable>
                <ARMTable>
                  <thead>
                    <tr>
                      <th rowSpan={2}>Manufacturer Name</th>
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
                    {collection?.map((data) => (
                      <tr key={data.id}>
                        <td>{data.name}</td>
                        {workFlowActions?.map((action) => (
                          <td key={action.id}>
                            {data.qualityApprovalStatuses[action.id]
                              ?.updatedByName || ''}
                          </td>
                        ))}
                        <td>{data.workflowName}</td>
                        <td>
                          <Link to={``}>
                            <ARMButton
                              type="primary"
                              size="small"
                              style={{
                                backgroundColor: '#4aa0b5',
                                borderColor: '#4aa0b5',
                              }}
                              onClick = {() => handleViewDetails(data)}
                            >
                              <EyeOutlined />
                            </ARMButton>
                          </Link>
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
                        details='Manufacturer Details'
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

export default ApprovedManufacturerQuality;
