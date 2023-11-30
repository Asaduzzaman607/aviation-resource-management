import React, {useEffect, useState} from 'react';
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Checkbox, Col, Form, Input, InputNumber, notification, Row, Select, Space} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import CompanyService from "../../../service/CompanyService";
import WorkflowActionService from "../../../service/WorkflowActionService";
import Permission from "../../auth/Permission";


const WorkflowActions = () => {
    const navigate=useNavigate()
    const [form] = Form.useForm();
    const {Option} = Select;
    const [singleWorkflow, setSingleWorkflow] = useState();
    let {id} = useParams();
    const onFinish = async (values) => {
        if (id) {
            try {

                await WorkflowActionService.updateWorkflow(id, values);

                notification["success"]({
                    message: "Workflow successfully updated",
                });
                navigate(-1)

            } catch (er) {
                notification["error"]({
                    message: er.response.data.apiErrors[0].message,
                });
            }
        } else {
            await WorkflowActionService.SaveWorkflow(values)
                .then((response) => {
                    console.log("response.status", response);
                    if (response.status === 200) {
                        notification["success"]({
                            message: "Successfully Created",
                        });

                        form.resetFields();
                    }
                    navigate(-1)
                })
                .catch((error) => {
                    notification["error"]({
                        message: error.response.data.apiErrors[0].message,
                    });
                    console.log("something went wrong", error);
                });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    const onReset = () => {
        if (id) {
            form.setFieldsValue({...singleWorkflow});
        } else {
            form.resetFields()
        }
    };
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const loadSingleWorkflow = async () => {
        try {
            const {data} = await WorkflowActionService.singleWorkflow(id);
            console.log("data", data);
            form.setFieldsValue({...data})
            setSingleWorkflow({...data});
        } catch (er) {
            console.log(er);
        }
    };

    useEffect(() => {
        if (!id) return form.resetFields();
        loadSingleWorkflow();
    }, [id]);
    return (
        <CommonLayout>

            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <i className="fas fa-cog"/>
                        <Link to='/configurations'>
                            &nbsp; Configurations
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to='/configurations/workflow-actions'>
                            Workflow Actions
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {id ? 'edit' : 'add'}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
          <Permission permission={["CONFIGURATION_ADMINISTRATION_WORKFLOW_ACTIONS_SAVE","CONFIGURATION_ADMINISTRATION_WORKFLOW_ACTIONS_EDIT"]}>
            <ARMCard
                title={
                    getLinkAndTitle('Workflow actions', '/configurations/workflow-actions')
                }
            >
                <Row>
                    <Col sm={24} md={12}>
                        <ARMForm
                            {...layout}
                            form={form} name="workflowAction"
                            onFinish={onFinish}
                            initialValues={{
                                order: 0,
                                image: null,
                                isActive: true
                            }}
                            scrollToFirstError
                        >
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter a name',
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                name="label"
                                label="Display Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter display name',
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                name="orderNumber"
                                label="Ordering"
                                rules={[
                                    {
                                        required: true,
                                        type: 'number',
                                         min: 1,
                                         message: 'Order cannot be less than 0'
                                    },
                                ]}
                            >
                                <InputNumber type="number"/>
                            </Form.Item>


                            <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                                <Space size="small">
                                    <ARMButton type="primary" htmlType="submit">
                                        {id ? 'update' : 'Submit'}
                                    </ARMButton>
                                    <ARMButton onClick={onReset} type="primary" danger>
                                        Reset
                                    </ARMButton>
                                </Space>
                            </Form.Item>
                        </ARMForm>
                    </Col>
                </Row>
            </ARMCard>
          </Permission>
        </CommonLayout>
    );
};

export default WorkflowActions;