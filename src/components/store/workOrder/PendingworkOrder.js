import React from 'react';
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
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
import {useState} from "react";
import {usePaginate} from "../../../lib/hooks/paginations";
import {useEffect} from "react";
import WorkflowActionService from "../../../service/WorkflowActionService";
import {getErrorMessage} from "../../../lib/common/helpers";
import WorkOrderService from "../../../service/store/WorkOrderService";
import RequestforQuotationService from "../../../service/procurment/RequestforQuotationService";
import ActiveInactiveRejected from "../../common/ActiveInactiveRejected";
import ApproveDenyButtons from "../../common/ApproveDenyButtons";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import {Status} from "../../../lib/constants/status-button";
import {notifyError, notifySuccess} from "../../../lib/common/notifications";
import subModules from "../../auth/sub_module";

const PendingworkOrder = () => {
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
    } = usePaginate('pendingWorkOrder', '/store-work-order/search');
    useEffect(() => {
        getAllWorkFlow(true).catch(console.error)
    }, []);
    console.log("pendingWorkOrder", collection);
    const getAllWorkFlow = async (status) => {
        try {
            let {data} = await WorkflowActionService.getAllWorkflows(status,subModules.STORE_DEMANDS)
            setWorkFlowActions(data.model)
        } catch (er) {
            notifyError(getErrorMessage(er))
        }
    }
    const handleStatus = async (id) => {
        try {
            await WorkOrderService.toggleStatus(
                id,
              isActive !== Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE
            );
            notifySuccess('Status Changed Successfully!')
            const values = form.getFieldsValue()
            isActive === Status.REJECTED ? fetchData({isActive, type: 'REJECTED', page: page, ...values }) : refreshPagination()
        } catch (e) {
            notifyError(getErrorMessage(e))
        }
    }

    const handleApprove = async (id, status, description = null) => {
        try {
            const {data} = await WorkOrderService.toggleApprove(id, status, description = null)
            refreshPagination();
            notifySuccess('Status changed successfully!')
        } catch (e) {
            notifyError(getErrorMessage(e))
        }
    }

    const resetData = () => {
        form.resetFields()
        isActive === Status.REJECTED ? fetchData({type: 'REJECTED'}) : fetchData()
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

                        &nbsp;Pending Work Order

                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

            <ARMCard title={
                getLinkAndTitle('Pending Work Order LIST', '/store/work-order', true)
            }
            >
                <Form form={form}
                      onFinish={(values) => isActive === Status.REJECTED ? fetchData({type: 'REJECTED',...values}) : fetchData({...values}) }>
                    <Row gutter={20}>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item name="query" label='Work Order No.'>
                                <Input placeholder={"Work Order No."}/>
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

                <ActiveInactive isActive={isActive} setIsActive={setIsActive} workFlow={true} />

                <ResponsiveTable>
                    <ARMTable>
                        <thead>
                        <tr>
                            <th rowSpan={2}>Work Order No.</th>
                            <th colSpan={workFlowActions.length}>APPROVALS</th>
                            <th rowSpan={2}>Status</th>
                            { isActive === Status.ACTIVE && <th rowSpan={2}>Approve</th>}
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
                                    <td>{data.workOrderNo}</td>
                                    {
                                        workFlowActions?.map(action => (
                                            <td key={action.id}>{data.approvalStatuses[action.id]?.updatedByName || ''}</td>
                                        ))
                                    }
                                    <td>{data.workflowName}</td>
                                    {
                                      isActive === Status.ACTIVE &&
                                        <td>
                                            <ApproveDenyButtons
                                                data={data}
                                                handleOk={handleApprove}
                                            />
                                        </td>
                                    }

                                    <td>
                                        <Space size='small'>
                                           <Link to={`/store/pending-work-order/details/${data.id}`}>
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
                                           </Link>
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

export default PendingworkOrder;