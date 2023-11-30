
import { Breadcrumb, Col, Form, notification, Row, Select, Space, Transfer } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import ARMForm from '../../lib/common/ARMForm';
import { getErrorMessage } from '../../lib/common/helpers';
import NotificationSettingService from '../../service/NotificationSettingService';
import SubModuleItemService from '../../service/SubModuleItemService';
import WorkflowActionService from '../../service/WorkflowActionService';
import ARMBreadCrumbs from '../common/ARMBreadCrumbs';
import ARMCard from '../common/ARMCard';
import ARMButton from '../common/buttons/ARMButton';
import CommonLayout from '../layout/CommonLayout';
import Permission from "../auth/Permission";
const { Option } = Select;


const NotificationSetting = () => {

    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [department, setDepartment] = useState([]);
    const [section, setSection] = useState([]);
    const [subModuleItems, setSubModuleItems] = useState([]);
    const [designation, setDesignation] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [departmentValue, setDepartmentValue] = useState([]);
    const [sectionValue, setSectionValue] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [workflowAction, setWorkflowAction] = useState([])
    const [form] = Form.useForm();
    // let subModuleItems = useSelector((state) => state.pagination.subModuleItems.model);
    // console.log("ssssss", subModuleItems)
    // let workflowAction = useSelector((state) => state.workflow.model);
    // console.log("WorkflowAction", workflowAction)
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const getSubmoduleItem = async () => {
        try {

            let { data } = await SubModuleItemService.getAllSubModuleItems(30, {
                query: '',
                isActive: true,
            })
            setSubModuleItems(data.model)
        } catch (er) {
            notification["error"]({ message: getErrorMessage(er) });
        }
    }
    const getWorkflowAction = async () => {
        try {

            let { data } = await WorkflowActionService.getAllWorkflows(true)
            setWorkflowAction(data.model)
        } catch (er) {
            notification["error"]({ message: getErrorMessage(er) });
        }
    }
    const getDepartment = async () => {

        try {
            let { data } = await NotificationSettingService.getAllDepartment()
            console.log("department", data.model)
            setDepartment(data.model)
        } catch (er) {
            notification["error"]({ message: getErrorMessage(er) });
        }
    }
    const getSection = async () => {
        try {

            let { data } = await NotificationSettingService.getAllSection()
            setSection(data.model)
        } catch (er) {
            notification["error"]({ message: getErrorMessage(er) });
        }
    }
    const getDesignation = async () => {
        try {
            let { data } = await NotificationSettingService.getAllDesignation()
            setDesignation(data.model)
        } catch (er) {
            notification["error"]({ message: getErrorMessage(er) });
        }
    }
    const getEmployeeList = async () => {
        try {
            let { data } = await NotificationSettingService.getAllEmployeeList()
            console.log("Employee", data.model)
            setEmployee(data.model);
        } catch (er) {
            notification["error"]({ message: getErrorMessage(er) });
        }
    }

    useEffect(() => {
        getDepartment().catch(console.error)
        getEmployeeList().catch(console.error)
        getDesignation().catch(console.error)
        getSection().catch(console.error)
        getSubmoduleItem().catch(console.error)
        getWorkflowAction().catch(console.error)
    }, [])

    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);

    }
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const employeeListDependonDesignation = (e) => {
        let emp = [];
        for (let i = 0; i < employee.length; i++) {
            if (e === employee[i].designationId) {
                emp.push({
                    key: employee[i].id,
                    title: employee[i].name
                })
            }
        }
        setEmployeeList(emp)
    }
    const onFinish = async (values) => {

        let submitData = {
            ...values,
            employeeIds: targetKeys
        }
        console.log("values", submitData)

        try {

            await NotificationSettingService.saveNotificationSetting(submitData)
            notification['success']({
                message: 'Successfully Submit',
            });
        } catch (er) {
            notification['error']({ message: getErrorMessage(er) });
        }

    }
    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <i className="fas fa-cog" />
                        <Link to='/configurations'>
                            &nbsp; Configurations
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        &nbsp;Notification Settings
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="CONFIGURATION_ADMINISTRATION_NOTIFICATION_SETTINGS_SEARCH">
            <ARMCard title="Notification Settings">
                <ARMForm
                    {...layout}
                    form={form}
                    name="notificationSetting"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Row>
                        <Col sm={24} md={12}>


                            <Form.Item
                                name="workflowAction"
                                label="Workflow Action"
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required!"
                                    },
                                ]}
                            >
                                <Select


                                    size="small" placeholder="--Select--">
                                    {
                                        workflowAction?.map((data) => (<Option key={data.id} value={data.id}>{data.name}</Option>)
                                        )
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="submoduleItemId"
                                label="Submodule Item"
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required!"
                                    },
                                ]}
                            >
                                <Select


                                    size="small" placeholder="--Select--">
                                    {subModuleItems.map((data, index) => (
                                        <Option key={data.id} value={data.id}>{data.itemName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ padding: '20px', border: "1px solid black" }}>
                            <Row>
                                <Col lg={6}>
                                    Filter in Available Employees
                                </Col>
                                <Col lg={6}>
                                    <Form.Item

                                    >
                                        <Select
                                            onChange={(e) => setDepartmentValue(e)}

                                            size="small" placeholder="--Select Department--">
                                            {department?.map((data, index) => (
                                                <Option key={data.id} value={data.id}>{data.name}</Option>
                                            ))}

                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col lg={6}>
                                    <Form.Item

                                    >
                                        <Select
                                            onChange={(e) => setSectionValue(e)}

                                            size="small" placeholder="--Select Section--">
                                            {section?.map((data, index) => (
                                                (departmentValue === data.departmentId) ? <Option key={data.id} value={data.id}>{data.name}</Option> : null
                                            ))}

                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col lg={6}>
                                    <Form.Item

                                    >
                                        <Select
                                            onChange={employeeListDependonDesignation}

                                            size="small" placeholder="--Select Designation--">
                                            {designation?.map((data, index) => (
                                                (sectionValue === data.sectionId) ? <Option key={data.id} value={data.id}>{data.name}</Option> : null
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row style={{ paddingTop: '10px' }}>
                                <Col span={20} offset={4}>
                                    <Form.Item

                                    >
                                        <Transfer
                                            dataSource={employeeList}
                                            titles={['Available Employees', 'Selected Employees']}
                                            listStyle={{
                                                width: '50vh',
                                                height: '50vh',
                                                border: '1px solid black',
                                                fontWeight: '500',

                                            }}
                                            targetKeys={targetKeys}
                                            selectedKeys={selectedKeys}
                                            onChange={onChange}
                                            onSelectChange={onSelectChange}
                                            render={(item) => item.title}
                                            header={false}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 20 }}>
                                <Space size="small">
                                    <ARMButton type="primary" htmlType="submit">
                                        Submit
                                    </ARMButton>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </ARMForm>
            </ARMCard>
           </Permission>
        </CommonLayout>
    );
};

export default NotificationSetting;