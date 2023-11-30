import CommonLayout from "../../layout/CommonLayout";
import {Breadcrumb, Checkbox, Col, Form, Input, InputNumber, notification, Row, Select, Space} from "antd";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import SubModuleItemService from "../../../service/SubModuleItemService";
import {getErrorMessage} from "../../../lib/common/helpers";
import ARMForm from "../../../lib/common/ARMForm";
import {useSelector} from "react-redux";
import ModuleService from "../../../service/ModuleService";
import SubModuleService from "../../../service/SubModuleService";
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

const SubModuleItem = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {id} = useParams()

    const [isBase, setIsBase] = useState(false)
    const [moduleId,setModuleId] = useState('')
    const [subModuleItem,setSubModuleItem] = useState({})

    const [modules, setModules] = useState([])
    const [subModules, setSubModules] = useState([])
    const [subModuleItems, setSubModuleItems] = useState([])

   /* const modules = useSelector((state) => state.pagination.modules.model);
    const subModules = useSelector((state) => state.pagination.subModules.model);
    const subModuleItems = useSelector((state) => state.pagination.subModuleItems.model);*/

    useEffect(() => {
        getAllModules()
        getAllSubModules()
        getAllSubModuleItems()
    },[])

    useEffect(() => {
        if (!id) {
            //form.resetFields()
            return
        }
        getSubModuleItemById().catch(console.error)

    }, [id])

    const getAllModules = async () => {
        const {data} = await ModuleService.getAllModule()
        setModules(data.model)
    }

    const getAllSubModules = async () => {
        const {data} = await SubModuleService.getAllSubModule()
        console.log("Sub module",data)
        setSubModules(data.model)
    }


    const getAllSubModuleItems = async () => {
        const {data} = await SubModuleItemService.getAllSubModuleItems()
        setSubModuleItems(data.model)
    }


    const selectedModule = (moduleId) => {
        console.log("selected module",moduleId)
        setModuleId(moduleId)
        form.setFieldsValue({...form, subModuleId: null})
    }

    const getSubModuleItemById = async () => {
        try {
            const {data} = await SubModuleItemService.getSubModuleItemById(id)
            form.setFieldsValue({...data, baseItem: data.isBase ? null : data.baseItem})
            setIsBase(data.isBase)
            setModuleId(data.moduleId)
            setSubModuleItem({...data})

            console.log("edit data",data)

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }

    const onFinish = async (values) => {
        console.log("Sub module item form values", values)
        try {
            if (id) {
                await SubModuleItemService.updateSubModuleItem(id, values)
            } else {
                let {data} = await SubModuleItemService.saveSubModuleItem(values)
            }
            form.resetFields()
            navigate('/configurations/sub-module-items')
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
            setIsBase(subModuleItem.isBase)
        } else {
            form.resetFields();
        }
    }

    const handleIsBase = (e) => {
        setIsBase(e.target.checked)
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
                        <Link to='/configurations/sub-module-items'>
                            Sub-Module Items
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {id ? 'Edit' : 'Add'}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

          <Permission permission={["CONFIGURATION_ADMINISTRATION_SUB_MODULE_ITEM_SAVE","CONFIGURATION_ADMINISTRATION_SUB_MODULE_ITEM_EDIT"]}>
           <ARMCard title={
               getLinkAndTitle( id ? 'SUB MODULE ITEM EDIT' : 'SUB MODULE ITEM ADD', '/configurations/sub-module-items')
            }>
                    <Row>
                        <Col sm={24} md={12}>
                            <ARMForm
                                {...layout} form={form}
                                name="nest-messages"
                                onFinish={onFinish}
                                initialValues={{
                                    order: 0,
                                    isActive: true,
                                    isBase: false
                                }}
                                scrollToFirstError
                            >
                                <Form.Item
                                    name="moduleId"
                                    label="Module"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required!',
                                        },
                                    ]}
                                >
                                    <Select onChange={(module) => selectedModule(module)} size="middle" placeholder="--Select Module--">
                                        {
                                            modules?.map((module) => {
                                                return <Option key={module.id} value={module.id}>{module.moduleName}</Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="subModuleId"
                                    label="Sub Module"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required!',
                                        },
                                    ]}
                                >
                                    <Select placeholder="--Select Sub Module--">
                                        {
                                            subModules?.map((subModule) => {
                                                if(subModule.moduleId === moduleId) {
                                                  return <Option key={subModule.id} value={subModule.id}>{subModule.submoduleName}</Option>
                                                }
                                            })
                                        }
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="itemName"
                                    label="Sub Module Item"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="urlPath"
                                    label="Url Path"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required!',
                                        },
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
                                    <InputNumber type="number"/>
                                </Form.Item>

                                <Form.Item
                                    name="isBase"
                                    valuePropName="checked"
                                    label="is Base?"
                                >
                                 <Checkbox onChange={handleIsBase}/>
                                </Form.Item>

                                <Form.Item
                                    name="baseItem"
                                    label="Base Item"
                                    rules={[
                                        {
                                            required: !isBase,
                                            message: 'This field is required!',
                                        },
                                    ]}
                                >

                                    <Select disabled={isBase} placeholder="--Select Base Item--">
                                        {
                                            subModuleItems?.map((subModuleItem) => {
                                                return <Option key={subModuleItem.id} value={subModuleItem.id}>{subModuleItem.itemName}</Option>
                                            })
                                        }
                                    </Select>
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
export default SubModuleItem