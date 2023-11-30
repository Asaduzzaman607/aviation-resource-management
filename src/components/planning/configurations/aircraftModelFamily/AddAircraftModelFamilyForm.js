import {Col, Form, Input, InputNumber, Row, Select, Space, TimePicker} from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import ARMForm from "../../../../lib/common/ARMForm";
import ARMButton from "../../../common/buttons/ARMButton";
import PropTypes from "prop-types";
import {Option} from "antd/lib/mentions";
import {DoubleLeftOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {max_size} from "../../../../lib/common/validation";

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const AddAircraftModelFamilyForm = ({formData, onFinish, onReset, id}) => {

    const {t} = useTranslation()


    return (
        <div>
            <Row>
                <Col span={10}>
                    <ARMForm
                        {...layout}
                        form={formData}
                        name="aircraftFamilyModel"
                        onFinish={onFinish}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="aircraftModelName"
                            label={t("planning.A/C Type.Name")}
                            rules={[
                                {
                                    required: true,
                                    message: t("planning.A/C Type.Name is required"),
                                },
                                {
                                    max: 255,
                                    message: t("common.Maximum 255 characters allowed"),
                                },
                                {
                                    whitespace: true,
                                    message: t("common.Only space is not allowed"),
                                },
                            ]}
                        >
                            <Input  disabled={id}/>
                        </Form.Item>
                        <Form.Item
                            name="checkHourForA"
                            label={t("planning.A/C Type.A Check Hour")}
                            rules={[
                                {
                                    required: false,
                                    message: t("planning.A/C Type.A Check Hour is required"),
                                },
                            ]}
                        >
                            <Input min={0} maxLength={max_size} style={{width: "100%"}}/>
                        </Form.Item>
                        <Form.Item
                            name="checkDaysForA"
                            label={t("planning.A/C Type.A Check Days")}
                            rules={[
                                {
                                    required: false,
                                    message: t("planning.A/C Type.A Check Days is required"),
                                },
                            ]}
                        >
                            <Input maxLength={max_size}/>
                        </Form.Item>
                        <Form.Item
                            name="checkHourForC"
                            label="C Check Hour"
                            rules={[
                                {
                                    required: false,
                                    message: "C Check Hour is required",
                                },
                            ]}
                        >
                            <Input min={0} maxLength={max_size} style={{width: "100%"}}/>
                        </Form.Item>
                        <Form.Item
                            name="checkDaysForC"
                            label="C Check Days"
                            rules={[
                                {
                                    required: false,
                                    message: "C Check Days is required",
                                },
                            ]}
                        >
                            <Input maxLength={max_size}/>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label={t("planning.A/C Type.Description")}
                            rules={[
                                {
                                    max: 255,
                                    message: t("common.Maximum 255 characters allowed"),
                                },
                                {
                                    whitespace: true,
                                    message: t("common.Only space is not allowed"),
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                            <Space size="small">
                                <ARMButton type="primary" htmlType="submit">
                                    {id ? t("common.Update") : t("common.Submit")}
                                </ARMButton>
                                <ARMButton onClick={onReset} type="primary" danger>
                                    {t("common.Reset")}
                                </ARMButton>
                            </Space>
                        </Form.Item>
                    </ARMForm>
                </Col>
            </Row>
        </div>
    );
};

AddAircraftModelFamilyForm.propTypes = {
    form: PropTypes.object.isRequired,
    onFinish: PropTypes.func.isRequired,
    id: PropTypes.number,
    onReset: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
};

export default AddAircraftModelFamilyForm;
