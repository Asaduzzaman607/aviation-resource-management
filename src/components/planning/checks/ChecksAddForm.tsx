import { Col, Form, Input, Row } from "antd";
import { useTranslation } from "react-i18next";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";

interface Props {
    id: number;
    form: any,
    handleSubmit: any;
    handleReset: any;
    layout: any;
    validateMessages: any;
}

export default function ChecksAddForm({ id, form, handleSubmit, handleReset, layout, validateMessages }: Props) {
    const { t } = useTranslation()
    return (
        <div>
            <Row>
                <Col span={10}>
                    <ARMForm {...layout} form={form} name="nest-messages" onFinish={handleSubmit} validateMessages={validateMessages}>

                        <Form.Item
                            name="title"
                            label={t("planning.Checks.Title")}
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    max: 50,
                                    message: t("planning.Checks.Exceeds 50 characters"),
                                },
                                {
                                  whitespace: true,
                                  message: t("common.Only space is not allowed"),
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label={t("planning.Checks.Description")}
                            rules={[
                                {
                                    max: 255,
                                    message: t("planning.Checks.Exceeds 255 characters"),
                                },
                                {
                                  whitespace: true,
                                  message: t("common.Only space is not allowed"),
                                },
                            ]}
                        >
                            <Input.TextArea />
                        </Form.Item>


                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                            <ARMButton type="primary" htmlType="submit">
                                {id ? t("common.Update") : t("common.Submit")}
                            </ARMButton>{" "}
                            <ARMButton onClick={handleReset} type="primary" danger>
                                {t("common.Reset")}
                            </ARMButton>
                        </Form.Item>
                    </ARMForm>
                </Col>
            </Row>
        </div>
    )
}