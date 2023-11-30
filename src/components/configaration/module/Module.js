import CommonLayout from "../../layout/CommonLayout";
import {Breadcrumb, Checkbox, Col, Form, Input, InputNumber, notification, Row, Select, Space} from "antd";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import {Link, useNavigate, useParams} from "react-router-dom";
import ModuleService from "../../../service/ModuleService";
import {getErrorMessage} from "../../../lib/common/helpers";
import React, {useEffect, useState} from "react";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMForm from "../../../lib/common/ARMForm";
import Permission from "../../auth/Permission";
import { notifyError } from "../../../lib/common/notifications";

const {Option} = Select;

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const Module = () => {

    const {id} = useParams()
    const navigate  =useNavigate()
    const [form] = Form.useForm();

    const [moduleItem,setModuleItem] = useState({})


    useEffect(() => {
        if (!id) {
            //form.resetFields()
            return
        }
        getModuleById().catch(console.error)

    }, [id])

    const getModuleById = async () => {
        try {
            const {data} = await ModuleService.getModuleById(id)
            form.setFieldsValue({...data})
            setModuleItem({...data})
            //console.log("single module",data)

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }

    const onFinish = async (values) => {
        console.log("values", values)
        try {
            if (id) {
                await ModuleService.updateModule(id, values)
            } else {
                let {data} = await ModuleService.saveModule(values)
            }
            form.resetFields()
            navigate('/configurations/modules')
            notification["success"]({
                message: id ? "Successfully updated!" : "Successfully added!",
            });

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    };

    const onReset = () => {
        if (id) {
            form.setFieldsValue({...moduleItem})
        } else {
            form.resetFields();
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
                        <Link to='/configurations/modules'>
                            Modules
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {id ? 'Edit' : 'Add'}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
             <Permission permission={["CONFIGURATION_ADMINISTRATION_MODULE_SAVE","CONFIGURATION_ADMINISTRATION_MODULE_EDIT"]}>
                <ARMCard title={
                    getLinkAndTitle(id ? 'MODULE EDIT' : 'MODULE ADD', '/configurations/modules')
                }
                >
                    <Row>
                        <Col sm={24} md={12}>
                            <ARMForm
                                {...layout}
                                form={form}
                                name="admin_module"
                                onFinish={onFinish}
                                initialValues={{
                                    order: 0,
                                    image: null,
                                    isActive: true
                                }}
                                scrollToFirstError
                            >
                                <Form.Item
                                    name="moduleName"
                                    label="Module"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required!',
                                        },
                                        {
                                            max: 255,
                                            message: 'Maximum 255 characters allowed',
                                        },
                                        {
                                            whitespace: true,
                                            message: 'Only space is not allowed',
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                {/*<Form.Item
                                    name="image"
                                    label="Image Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required!',
                                        },
                                        {
                                            max: 255,
                                            message: 'Maximum 255 characters allowed',
                                        },
                                        {
                                            whitespace: true,
                                            message: 'Only space is not allowed',
                                        }
                                    ]}
                                >
                                 <Input/>
                                </Form.Item>*/}

                                <Form.Item
                                    name="order"
                                    label="Ordering"
                                    rules={[
                                        {
                                            type: 'number',
                                            min: 0,
                                            message: 'Order cannot be less than 0'
                                        }
                                    ]}
                                >
                                    <InputNumber type="number"/>
                                </Form.Item>

                                <Form.Item
                                    name="isActive"
                                    valuePropName="checked"
                                    label="Is Active"
                                >
                                    <Checkbox/>
                                </Form.Item>

                                <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                                    <Space size="small">
                                        <ARMButton type="primary" htmlType="submit">
                                            {id ? 'Update' : 'Submit'}
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
    )
}
export default Module