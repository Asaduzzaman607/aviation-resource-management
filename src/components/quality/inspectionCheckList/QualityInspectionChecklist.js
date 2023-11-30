import React, {useState} from 'react';
import CommonLayout from "../../layout/CommonLayout";
import {Breadcrumb, Col, Form, Input, notification, Row, Space} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {SolutionOutlined} from "@ant-design/icons";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import TextArea from "antd/es/input/TextArea";

import {getErrorMessage} from "../../../lib/common/helpers";
import InspectionChecklistService from "../../../service/storeInspector/InspectionChecklistService";
import {useEffect} from "react";
import Permission from "../../auth/Permission";
import QualityInspectionCheckListService from "../../../service/quality/QualityInspectionCheckListService";

const layout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 14,
    },
};

const QualityInspectionChecklist = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [inschecklist, setInsChecklist] = useState([])
    const getInspectionChecklistById = async () => {
        try {
            const {data} = await QualityInspectionCheckListService.getInspectionChecklistById(id);
            console.log("QualityInspectionChecklist by id::", data);

            form.setFieldsValue({...data})
            setInsChecklist(data)
        } catch (er) {
            notification['error']({message: getErrorMessage(er)});
        }
    }
    useEffect(() => {
        if (!id) {
            return
        }
        getInspectionChecklistById().catch(console.error)

    }, [id])
    const onFinish = async (value) => {
        console.log("submit", value)
        try {
            if (id) {
                let {data} = await QualityInspectionCheckListService.updateInspectionChecklist(id, value);
            }
            form.resetFields();
            navigate('/quality/pending-inspection-checklist');
            notification['success']({
                message: id ? 'Successfully updated!' : 'Successfully added!',
            });
        } catch (er) {
            notification['error']({message: getErrorMessage(er)});
        }
    }
    const onReset = () => {
        id ? form.setFieldsValue({...inschecklist}) : form.resetFields();
    }
    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>

                        <Link to='/quality'>
                            <i className="fas fa-clipboard-check"></i>    &nbsp; Quality
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to='/quality/pending-inspection-checklist'>Pending Inspection Checklist</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        edit
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission={["STORE_INSPECTOR_INSPECTION_CHECKLIST_INSPECTION_CHECKLIST_SAVE","STORE_INSPECTOR_INSPECTION_CHECKLIST_INSPECTION_CHECKLIST_EDIT"]}>
            <ARMCard title={"Inspection Checklist"}
            >
                <Row>
                    <Col sm={20} md={10}>

                        <ARMForm
                            {...layout}
                            form={form}
                            name="inspectionChecklist"
                            onFinish={onFinish}
                            initialValues={{}}
                            scrollToFirstError
                        >
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    {
                                       required:true,
                                        message: 'Description is required!',
                                    },
                                    {
                                        max: 255,
                                        message: 'Maximum 255 character allowed',
                                    },
                                    {
                                        whitespace: true,
                                        message: 'Only space is not allowed!',
                                    },
                                ]}

                            >
                                <TextArea/>
                            </Form.Item>


                            <Form.Item wrapperCol={{...layout.wrapperCol, offset: 10}}>
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
    );
};

export default QualityInspectionChecklist;