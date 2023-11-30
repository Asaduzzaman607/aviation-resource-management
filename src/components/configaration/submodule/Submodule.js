import CommonLayout from "../../layout/CommonLayout";
import {Breadcrumb, Checkbox, Col, Form, Input, InputNumber, notification, Row, Select, Space} from "antd";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import React, {useEffect, useState} from "react";
import {getErrorMessage} from "../../../lib/common/helpers";
import SubModuleService from "../../../service/SubModuleService";
import {Link, useNavigate, useParams} from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMForm from "../../../lib/common/ARMForm";
import {useSelector} from "react-redux";
import ModuleService from "../../../service/ModuleService";
import Permission from "../../auth/Permission";

const { Option } = Select;

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const Submodule = () => {

    const {id} = useParams()
    const navigate  =useNavigate()
    const [form] = Form.useForm();
    const [subModuleItem,setSubModuleItem] = useState({})
    const [modules, setModules] = useState([])

    /*const modules = useSelector((state) => state.pagination.modules.model);*/

    useEffect(() => {
        getAllModule()
    },[])

    const getAllModule = async () => {
        const {data} = await ModuleService.getAllModule()
        setModules(data.model)
        console.log("modules from sub module",data)
    }

    useEffect(() => {
        if (!id) {
            //form.resetFields()
            return
        }
        getSubModuleById().catch(console.error)

    }, [id])

    const getSubModuleById = async () => {
        try {
            const {data} = await SubModuleService.getSubModuleById(id)
            form.setFieldsValue({...data})
            setSubModuleItem({...data})
            //console.log("single module",data)

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }

    const onFinish = async (values) => {
        console.log("sub module values",values)
        try {
            if (id) {
                await SubModuleService.updateSubModule(id, values)
            } else {
                let {data} = await SubModuleService.saveSubModule(values)
            }
            form.resetFields()
            navigate('/configurations/sub-modules')
            notification["success"]({
                message: id ? "Successfully updated!" : "Successfully added!",
            });

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }

    };

    const onReset = () => {
        if (id) {
            form.setFieldsValue({...subModuleItem})
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
                        <Link to='/configurations/sub-modules'>
                            Sub-Modules
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {id ? 'Edit' : 'Add'}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

           <Permission permission={["CONFIGURATION_ADMINISTRATION_SUB_MODULE_SAVE","CONFIGURATION_ADMINISTRATION_SUB_MODULE_EDIT"]}>
            <ARMCard
                title={
                    getLinkAndTitle(id ? 'SUB-MODULE EDIT' : 'SUB-MODULE ADD ', '/configurations/sub-modules')
                }
            >
                <Row>
                    <Col sm={24} md={12}>
                        <ARMForm
                            {...layout}
                            form={form} name="admin_sub_module"
                            onFinish={onFinish}
                            initialValues={{
                                order: 0,
                                image: null,
                                isActive: true
                            }}
                            scrollToFirstError
                        >
                            <Form.Item
                                name="moduleId"
                                label="Module"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select module!',
                                    },
                                ]}
                            >
                            <Select placeholder="--Select Module--">
                                {
                                    modules?.map((module) => {
                                        if(module.isActive) {
                                            return <Option key={module.id} value={module.id}>{module.moduleName}</Option>
                                        }
                                    })
                                }
                            </Select>
                            </Form.Item>

                            <Form.Item
                                name="submoduleName"
                                label="Sub Module"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input Sub module!',
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

                            <Form.Item
                                name="order"
                                label="Ordering"
                                rules={[
                                    {
                                        type: 'number',
                                        min: 0,
                                        message: 'Order cannot be less than 0'
                                    },
                                ]}
                            >
                                <InputNumber type="number" />
                            </Form.Item>

                            <Form.Item
                                name="isActive"
                                valuePropName="checked"
                                label="Is Active"
                            >
                            <Checkbox/>
                            </Form.Item>

                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
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
export default Submodule