import { Breadcrumb, Col, Form, notification, Row, Select, Space, Transfer } from 'antd';
import React, { useEffect, useState } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import { getErrorMessage } from '../../../lib/common/helpers';
import ApprovalSettingService from '../../../service/ApprovalSettingService';
import SubModuleItemService from '../../../service/SubModuleItemService';
import WorkflowActionService from '../../../service/WorkflowActionService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import UsersService from "../../../service/UsersService";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import Permission from "../../auth/Permission";
import { notifyWarning } from '../../../lib/common/notifications';
const { Option } = Select;


const ApprovalSetting = () => {
    const [form] = Form.useForm();
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [department, setDepartment] = useState([]);
    const [section, setSection] = useState([]);
    const [subModuleItems, setSubModuleItems] = useState([]);
    const [designation, setDesignation] = useState([]);

    const [departmentValue, setDepartmentValue] = useState([]);
    const [sectionValue, setSectionValue] = useState([]);
    const [designationValue, setDesignationValue] = useState();
    const [employeeList, setEmployeeList] = useState([]);
    const [secondaryEmployeeList, setSecondaryEmployeeList] = useState([]);
    const [workflowAction, setWorkflowAction] = useState([])
    const [workflowActionAndSubmoduleId, setWorkflowActionAndSubmoduleId] = useState(
        {
            ActionId: null,
            submoduleItemId: null
        }
    )
    const [employeeFilterItems, setEmployeeFilterItems] = useState(
        {
            deptId: null, sectionId: null, designationId: null
        }
    )
    const { id } = useParams();
    const navigate = useNavigate();

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

            let { data } = await SubModuleItemService.getAllSubModuleItems(500, {
                query: '',
                isActive: true,
                isWorkflow: true
            })
            setSubModuleItems(data.model)
        } catch (er) {
            notification["error"]({ message: getErrorMessage(er) });
        }
    }

    const getWorkflowAction = async () => {
        try {
            let { data } = await WorkflowActionService.workflowSearch(50,{
                query:"",
                isActive: true
            })
             let workflow=data.model.filter((workflow)=>workflow.name!=="APPROVED")
            setWorkflowAction(workflow)
        } catch (er) {
            notification["error"]({ message: getErrorMessage(er) });
        }
    }

    const getDepartment = async () => {

        try {
            let { data } = await ApprovalSettingService.getAllDepartment()
            setDepartment(data.model)
        } catch (er) {
            notification["error"]({ message: getErrorMessage(er) });
        }
    }

    const getUsersForSpecificActionAndSubmodule = async () => {

        let headerValue={
            "workFlowActionId":workflowActionAndSubmoduleId.ActionId,
            "subModuleItemId":workflowActionAndSubmoduleId.submoduleItemId,
            "designationId":null,
            "sectionId":null,
            "departmentId":null
        }

        try {
            let { data } = await ApprovalSettingService.getPermittedUser(headerValue)
            let valueOfId = data?.selectedUsers.map(user => user.userId)

            if(!valueOfId.length)
                  notifyWarning('No approved user found, please approve some user')
            setTargetKeys([...valueOfId])
            //console.log("value of Id: ", valueOfId)
        } catch (er) {
            setTargetKeys([])
            await getAllUsers()
        }
    }

    const getSection = async () => {
        try {
            let { data } = await ApprovalSettingService.getAllSection()
            setSection(data.model)
        } catch (er) {
            notification["error"]({ message: getErrorMessage(er) });
        }
    }

    const getDesignation = async () => {
        try {
            let { data } = await ApprovalSettingService.getAllDesignation()
            setDesignation(data.model)
        } catch (er) {
            notification["error"]({ message: getErrorMessage(er) });
        }
    }

    const getAllUsers = async () => {
        try {
            const { data } = await UsersService.getAllUsers();
            console.log("all data user data: ",data)
            let emp = [];

            for (let i = 0; i < data?.list.length; i++) {
                 emp.push({
                        key: parseInt(data.list[i][2]),
                        title: data.list[i][4],
                        departmentId: parseInt(data.list[i][1]),
                        sectionId: parseInt(data.list[i][5]),
                        designationId: parseInt(data.list[i][0])
                    })
                }
            setSecondaryEmployeeList(emp)
            setEmployeeList(emp)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllUsers().catch(console.error)
        getDepartment().catch(console.error)
        getSection().catch(console.error)
        getDesignation().catch(console.error)
        getWorkflowAction().catch(console.error)
        getSubmoduleItem().catch(console.error)
    }, [])

    useEffect(() => {
        if(workflowActionAndSubmoduleId.ActionId && workflowActionAndSubmoduleId.submoduleItemId) {
            getUsersForSpecificActionAndSubmodule().catch(console.error)
        }
    }, [workflowActionAndSubmoduleId])

    useEffect(() => {
        console.log("i see employee filter employeeFilterItems: ",employeeFilterItems)
        updateEmployeeList()
    }, [employeeFilterItems])


    useEffect(() => {
        if (!id) {
            return;
        }
        getApprovalSettingById().catch(console.error);
    }, [id]);

    const getApprovalSettingById = async () => {
        try {
            let { data } = await ApprovalSettingService.getApprovalSettingById(id)

            console.log("edit data",data)

            form.setFieldsValue({
                workFlowActionId: data.workFlowActionId,
                subModuleItemId: data.subModuleItemId
            })
            let selectedUserIds = data.selectedUsers.map(user => user.userId);
            setTargetKeys([...selectedUserIds])
            setWorkflowActionAndSubmoduleId({
                ActionId: data.workFlowActionId,
                submoduleItemId: data.subModuleItemId
            })

        } catch (er) {
            notification["error"]({ message: getErrorMessage(er) });
        }
    }
    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
        console.log("on Change value fo nextTargetKeys", nextTargetKeys)
        console.log("value fo targetKey", targetKeys)

    }
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
        console.log('onSelected chagne', sourceSelectedKeys)
    };

    const updateEmployeeList = () => {
           let updateValue = employeeList.filter(employee =>  (
               (employeeFilterItems.deptId === null || employee.departmentId === employeeFilterItems.deptId)
               && (employeeFilterItems.sectionId === null || employee.sectionId === employeeFilterItems.sectionId)
               && (employeeFilterItems.designationId === null || employee.designationId === employeeFilterItems.designationId)))
           setSecondaryEmployeeList(updateValue)
    }

    const setSlectedDepartment = (deptId) => {
        if(!deptId){
            setDepartmentValue(null)
            setSectionValue(null)
            setDesignationValue(null)
            setEmployeeFilterItems({deptId: null, sectionId: null, designationId: null})
        }else{
            setDepartmentValue(deptId)
            setEmployeeFilterItems({...employeeFilterItems, deptId})
        }
    }

    const setSectionId = (sectionId) => {
        if(!sectionId){
            setSectionValue(null)
            setDesignationValue(null)
            setEmployeeFilterItems({deptId: employeeFilterItems.deptId, sectionId: null, designationId: null})
        }else{
            setEmployeeFilterItems({...employeeFilterItems, sectionId})
            setSectionValue(sectionId)
        }
    }

    const onFinish = async (values) => {

        let submitData = {
            ...values,
            employeeIds: targetKeys
        }
        console.log("values", submitData)

        try {
            await ApprovalSettingService.saveApprovalSetting(submitData)
            notification['success']({
                message: 'Successfully Approved',
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
                        <Link to='/configurations/approval-setting-list'>
                        &nbsp;Approval Settings
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {id? "edit":"add"}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
          <Permission permission={["CONFIGURATION_ADMINISTRATION_APPROVAL_SETTINGS_SAVE","CONFIGURATION_ADMINISTRATION_APPROVAL_SETTINGS_EDIT"]}>
            <ARMCard title={
                getLinkAndTitle('Approval Settings', '/configurations/approval-setting-list')
            }>
                <ARMForm
                    {...layout}
                    form={form}
                    name="approvalSetting"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Row>
                        <Col sm={24} md={12}>
                            <Form.Item
                                name="workFlowActionId"
                                label="Workflow Action"
                                rules={[
                                    {
                                        required: true,
                                        message: "Workflow Action is required!"
                                    },
                                ]}
                            >
                                <Select
                                    disabled={!!id}
                                    placeholder="--Select Workflow Action--"
                                    showSearch
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    onChange={(ActionId)=> setWorkflowActionAndSubmoduleId({...workflowActionAndSubmoduleId, ActionId})}
                                    >
                                    {
                                        workflowAction?.map((data) => (<Option key={data.id} value={data.id}>{data.name}</Option>)
                                        )
                                    }

                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="subModuleItemId"
                                label="Submodule Item"
                                rules={[
                                    {
                                        required: true,
                                        message: "Submodule Item is required!"
                                    },
                                ]}
                            >
                                <Select
                                    disabled={!!id}
                                    placeholder="--Select Submodule Item--"
                                    showSearch
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    onChange={(submoduleItemId)=> setWorkflowActionAndSubmoduleId({...workflowActionAndSubmoduleId, submoduleItemId})}
                                    >
                                    {subModuleItems.map((data, index) => (
                                        <Option key={data.id} value={data.id}>{data.itemNameHrf}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ padding: '20px', border: "1px solid #e2e8f0", borderRadius: '15px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'}}>
                            <Row>
                                <Col lg={6}>
                                    <h3>Filter in Available Employees</h3>
                                </Col>
                                <Col lg={6}>
                                    <Form.Item
                                    >
                                        <Select
                                          allowClear
                                           onChange={ (deptId) => {
                                            setDepartmentValue(deptId)
                                            setSlectedDepartment(deptId);
                                           }}
                                            size="small" placeholder="--Select Department--">
                                            {department?.map((data) => (
                                                <Option key={data.id} value={data.id}>{data.name}</Option>
                                            ))
                                            }

                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col lg={6}>
                                    <Form.Item
                                    >
                                        <Select
                                             allowClear
                                             value={sectionValue}
                                              onChange={ (sectionId) => {
                                                setSectionValue(sectionId)
                                                setSectionId(sectionId)

                                              //  setEmployeeFilterItems({...employeeFilterItems, sectionId})
                                               }}
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
                                            allowClear
                                            value={designationValue}
                                            onChange={ (designationId) => {
                                            setDesignationValue(designationId)
                                            setEmployeeFilterItems({...employeeFilterItems, designationId})
                                               }}

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
                                            dataSource={secondaryEmployeeList}
                                            titles={['Available Employees', 'Selected Employees']}
                                            listStyle={{
                                                width: '50vh',
                                                height: '50vh',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '15px',
                                                fontWeight: '500',
                                                padding: "15px",
                                                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
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
                                        {id ? 'Update' : 'Submit'}
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

export default ApprovalSetting;