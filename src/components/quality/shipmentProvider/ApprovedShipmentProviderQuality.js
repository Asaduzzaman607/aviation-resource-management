import React from 'react';
import {useEffect, useState} from "react";
import {usePaginate} from "../../../lib/hooks/paginations";
import WorkflowActionService from "../../../service/WorkflowActionService";
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space} from "antd";
import {getErrorMessage} from "../../../lib/common/helpers";
import shipmentService from "../../../service/procurment/ShipmentService";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Link, useParams} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMButton from "../../common/buttons/ARMButton";
import {EditOutlined, EyeOutlined, FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import ActiveInactiveRejected from "../../common/ActiveInactiveRejected";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ARMTable from "../../common/ARMTable";
import ApproveDenyButtons from "../../common/ApproveDenyButtons";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import permissions from "../../auth/permissions";
import {notifyError} from "../../../lib/common/notifications";
import Loading from "../../store/common/Loading";
import Permission from "../../auth/Permission";

const ApprovedShipmentProviderQuality = () => {
  const { Option } = Select;
  const[workFlowActions,setWorkFlowActions]=useState([])
  const[loading,setLoading]=useState(false)

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
    size
  } = usePaginate('approvedShipmentProviderQuality', '/material-management/config/quality/shipment_provider/search',{
    workflowType:'QUALITY',
    type:'APPROVED'
      }
  );

  console.log("approved  demand list", collection)
  useEffect(() => {
    getAllWorkFlow(true).catch(console.error)
  }, []);
  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true)
      let { data } = await WorkflowActionService.getAllWorkflows(status, permissions.subModuleItems.QUALITY_SHIPMENT_PROVIDER_PENDING_LIST);
      setWorkFlowActions(data.model);
    } catch (er) {
      notifyError(getErrorMessage(er));
    }finally {
      setLoading(false)
    }
  };
  const onFinish = (values) => {
    fetchData({
      ...values,
      type: 'APPROVED',
      workflowType:'QUALITY'
    });
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-clipboard-check" />
            <Link to='/quality'>
              &nbsp; Quality
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            Approved Shipment Provider List
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
<Permission permission='QUALITY_QUALITY_SHIPMENT_PROVIDER_QUALITY_SHIPMENT_PROVIDER_APPROVED_LIST_SEARCH'showFallback>
  <ARMCard title="Approve Shipment Provider List">
    <Form form={form} onFinish={onFinish}>
      <Row gutter={20}>
        <Col xs={24} md={12} lg={8}>
          <Form.Item name="query">
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

        <Col xs={24} md={12} lg={6}>
          <Form.Item name="size" label="Page Size" initialValue="10">
            <Select id="antSelect">
              <Option value="10">10</Option>
              <Option value="20">20</Option>
              <Option value="30">30</Option>
              <Option value="40">40</Option>
              <Option value="50">50</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12} lg={4}>
          <Form.Item>
            <Space>
              <ARMButton size="middle" type="primary" htmlType="submit">
                <FilterOutlined/> Filter
              </ARMButton>
              <ARMButton
                  size="middle"
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    form.resetFields();
                    fetchData({ type: 'APPROVED',workflowType:'QUALITY' });
                  }}
              >
                <RollbackOutlined/> Reset
              </ARMButton>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>

    {
      !loading?<>
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
            {
              collection?.map((data, index) => (
                  <tr key={data.id}>
                    <td>{data.name}</td>
                    {
                      workFlowActions?.map(action => (
                          <td key={action.id}>{data.qualityApprovalStatuses[action.id]?.updatedByName || ''}</td>
                      ))
                    }
                    <td>{data.workflowName}</td>
                    <td>
                      {/*<Link to={`/material-management/request-for-quotation-details/${data.id}`}>*/}
                      <ARMButton
                          type="primary"
                          size="small"
                          style={{
                            backgroundColor: "#4aa0b5",
                            borderColor: "#4aa0b5",
                          }}
                      >
                        <EyeOutlined />
                      </ARMButton>
                      {/*</Link>*/}
                    </td>
                  </tr>
              ))
            }

            </tbody>
          </ARMTable>
        </ResponsiveTable>
        {/*** for pagination ***/}
        <Row>
          <Col style={{margin: '0 auto'}}>
            {collection.length === 0 ? (
                <Row justify="end">
                  <Empty style={{marginTop: "10px"}}/>
                </Row>
            ) : <Row justify="center">
              <Col style={{marginTop: 10}}>
                <Pagination
                    showSizeChanger={false}
                    onShowSizeChange={console.log}
                    pageSize={size}
                    current={page}
                    onChange={paginate}
                    total={totalElements}
                />
              </Col>
            </Row>}
          </Col>
        </Row>
      </>:<Loading/>
    }
  </ARMCard>
</Permission>
    </CommonLayout>
  );
};

export default ApprovedShipmentProviderQuality;