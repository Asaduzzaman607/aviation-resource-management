import React from 'react';
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space} from "antd";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {usePaginate} from "../../../lib/hooks/paginations";
import WorkflowActionService from "../../../service/WorkflowActionService";
import {getErrorMessage} from "../../../lib/common/helpers";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import {EyeOutlined, FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ARMTable from "../../common/ARMTable";

const ApprovedUnserviceableItem = () => {
    const { Option } = Select;
    const { id } = useParams()
    const[workFlowActions,setWorkFlowActions]=useState([])


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
    } = usePaginate('approvedUnserviceableItem', '/return-unserviceable-parts/search');
    useEffect(() => {
        getAllWorkFlow().catch(console.error)
        fetchData({
            type: 'APPROVED'
        });
    }, []);
    console.log("Approved UI",collection)
    const getAllWorkFlow = async () => {
        try {
            let {data} = await WorkflowActionService.workflowSearch(50,{
                query:"",
                isActive:true
            })
            let actions = data.model.filter(action => action.actionable)
            console.log("workflowaction",actions)
            setWorkFlowActions(actions)
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        {" "}
                        <Link to="/store">
                            {" "}
                            <i className="fas fa-archive"/> &nbsp;Store
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>

                        &nbsp;Approved Unserviceable Item

                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <ARMCard title="Approved Unserviceable Item List">
                <Form form={form} onFinish={fetchData}>
                    <Row gutter={20}>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item label="Voucher no" name="query">
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
                                        onClick={resetFilter}
                                    >
                                        <RollbackOutlined/> Reset
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
                            <th rowSpan={2}>Voucher No</th>
                            <th colSpan={workFlowActions.length}>APPROVALS</th>
                            <th rowSpan={2}>Status</th>
                            <th rowSpan={2}>View Details</th>
                        </tr>
                        <tr>
                            {
                                workFlowActions?.map((action) => (
                                    <td key={action.id}>{action.name}</td>
                                ))
                            }

                        </tr>

                        </thead>
                        <tbody>
                        {
                            collection?.map((data, index) => (
                                <tr key={data.id}>
                                    <td>{data.voucherNo}</td>
                                    {
                                        workFlowActions?.map(action => (
                                            <td key={action.id}>{data.approvalStatuses[action.id]?.updatedByName || ''}</td>
                                        ))
                                    }
                                    <td>{data.workflowName}</td>
                                    <td>
                                        {/*<Link to={`/material-management/request-for-quotation-details/${data.rfqId}`}>*/}
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
            </ARMCard>
        </CommonLayout>
    );
};

export default ApprovedUnserviceableItem;