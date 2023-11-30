import React from 'react';
import {
    Breadcrumb,
    Button,
    Col,
    Empty,
    Form,
    Input,
    notification,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Space
} from "antd";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {usePaginate} from "../../../lib/hooks/paginations";
import WorkflowActionService from "../../../service/WorkflowActionService";
import {getErrorMessage} from "../../../lib/common/helpers";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMButton from "../../common/buttons/ARMButton";
import {
    CheckOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    FilterOutlined, LockOutlined,
    RollbackOutlined, UnlockOutlined
} from "@ant-design/icons";
import ActiveInactive from "../../common/ActiveInactive";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ARMTable from "../../common/ARMTable";
import UnserviceableItemService from "../../../service/store/UnserviceableItemService";
import WorkOrderService from "../../../service/store/WorkOrderService";
import ActiveInactiveRejected from "../../common/ActiveInactiveRejected";
import ApproveDenyButtons from "../../common/ApproveDenyButtons";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";

const PendingUnserviceableItem = () => {
    const {Option} = Select;
    const [workFlowActions, setWorkFlowActions] = useState([])
    const [isRejected, setIsRejected] = useState(false)

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
    } = usePaginate('pendingUnserviceableItem', '/return-unserviceable-parts/search');
    useEffect(() => {
        getAllWorkFlow().catch(console.error)
        fetchData({
            type: 'PENDING'
        });
    }, []);
    console.log("pendingUI", collection);
    const getAllWorkFlow = async (status) => {
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

    const handleStatus = async (id) => {
        try {
            await UnserviceableItemService.toggleStatus(
                id,
                isRejected ? isActive : !isActive
            );
            notification['success']({
                message: 'Status Changed Successfully!',
            });
            const values = form.getFieldsValue()
            isRejected ? fetchData({isActive: true, type: 'REJECTED', page: page, ...values}) : refreshPagination()
        } catch (e) {
            notification['error']({
                message: getErrorMessage(e),
            });
        }
    }

    const handleApprove = async (id, status, description = null) => {
        try {
            const {data} = await UnserviceableItemService.toggleApprove(id, status, description = null)
            refreshPagination();
            notification["success"]({
                message: "Status changed successfully!",
            });
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)})
        }
    }


    useEffect(() => {
        console.log("rendered...")
        isRejected && fetchData({
            isActive: true,
            type: 'REJECTED'
        })
    }, [isRejected])

    console.log("isActive", isActive)
    console.log("isRejected", isRejected)

    const resetData = () => {
        form.resetFields()
        fetchData({type: 'REJECTED'})
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

                        &nbsp;Pending Unserviceable Item

                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

            <ARMCard title={
                getLinkAndTitle('Pending Unserviceable Item LIST', '/store/unserviceable-item', true)
            }
            >
                <Form form={form}
                      onFinish={(values) => isRejected ? fetchData({type: 'REJECTED', ...values}) : fetchData({...values})}>
                    <Row gutter={20}>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item label="voucher no" name="query">
                                <Input/>
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
                                        onClick={resetData}
                                    >
                                        <RollbackOutlined/> Reset
                                    </ARMButton>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <ActiveInactiveRejected isActive={isActive} setIsActive={setIsActive} isRejected={isRejected}
                                        setIsRejected={setIsRejected}/>

                <ResponsiveTable>
                    <ARMTable>
                        <thead>
                        <tr>
                            <th rowSpan={2}>voucher No</th>
                            <th colSpan={workFlowActions.length}>APPROVALS</th>
                            <th rowSpan={2}>Status</th>
                            {(isActive && !isRejected) && <th rowSpan={2}>Approve</th>}
                            <th rowSpan={2}>Actions</th>
                        </tr>
                        <tr>
                            {
                                workFlowActions?.map((action) => (
                                    <td key={action.id}>{action.label}</td>
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
                                    {
                                        (isActive && !isRejected) &&
                                        <td>
                                            <ApproveDenyButtons
                                                data={data}
                                                handleOk={handleApprove}
                                            />
                                        </td>
                                    }

                                    <td>
                                        <Space size='small'>
                                            <ARMButton
                                                type="primary"
                                                size="small"
                                                style={{
                                                    backgroundColor: "#4aa0b5",
                                                    borderColor: "#4aa0b5",
                                                }}
                                            >
                                                <EyeOutlined/>
                                            </ARMButton>
                                            <Link
                                                to={`/store/edit-work-order/${data.id}`}
                                            >
                                                <ARMButton disabled={!data.editable} type="primary" size="small"
                                                           style={{
                                                               backgroundColor: '#6e757c',
                                                               borderColor: '#6e757c',

                                                           }}>
                                                    <EditOutlined/>
                                                </ARMButton>
                                            </Link>
                                            <ActiveInactiveButton
                                                isActive={isActive}
                                                handleOk={() => handleStatus(data.id)}
                                                isRejected={isRejected}
                                            />
                                        </Space>
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
    )
};

export default PendingUnserviceableItem;