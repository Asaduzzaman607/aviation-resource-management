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
import { notifyError } from '../../../lib/common/notifications';
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
import React from "react";

const ApprovedRfq = () => {
  const { Option } = Select;
  const [workFlowActions, setWorkFlowActions] = useState([]);

  const { form, collection, page, totalElements, paginate, fetchData, size } =
    usePaginate('approvedQuoteRequests', 'procurement/quote-requests/search', {
      rfqType: 'PROCUREMENT',
      type: 'APPROVED',
    });
  console.log('Approve rfq', collection);
  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);

  const getAllWorkFlow = async (status) => {
    try {
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        permissions.subModuleItems.REQUEST_FOR_QUOTATION_RFQ
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
      rfqType: 'PROCUREMENT',
    });
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fa fa-shopping-basket" />
            <Link to="/material-management">&nbsp; Material Management</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Approved RFQ List</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_QUOTE_REQUEST_MATERIAL_MANAGEMENT_APPROVED_RFQ_SEARCH"
        showFallback
      >
        <ARMCard title={getLinkAndTitle(
          `Approve RFQ details`,
          `/material-management`,
          false,
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_QUOTE_REQUEST_MATERIAL_MANAGEMENT_REQUEST_FOR_QUOTATION_SAVE'
        )}>
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
                  label="Voucher no"
                  name="query"
                >
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
                  name="rfqType"
                  initialValue={'PROCUREMENT'}
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
                        fetchData({ type: 'APPROVED', rfqType: 'PROCUREMENT' });
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
                  <th rowSpan={2}>RFQ No</th>
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
                    <td>{data.rfqNo}</td>
                    {workFlowActions?.map((action) => (
                      <td key={action.id}>
                        {data.approvalStatuses[action.id]?.updatedByName || ''}
                      </td>
                    ))}
                    <td>{data.workflowName}</td>
                    <td>
                      <Permission permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_QUOTE_REQUEST_MATERIAL_MANAGEMENT_APPROVED_RFQ_SEARCH">
                        <Link
                          to={`/material-management/request-for-quotation-details/${data.id}`}
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

export default ApprovedRfq;
