import {Breadcrumb, Col, Form, Input, InputNumber, Row, Space} from "antd";
import React from "react";
import CommonLayout from "../../layout/CommonLayout";
import ARMForm from "../../../lib/common/ARMForm";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Link, useParams} from "react-router-dom";
import {ProfileOutlined} from "@ant-design/icons";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import {formLayout} from "../../../lib/constants/layout";
import ARMCard from "../../common/ARMCard";
import {t} from "i18next";
import Permission from "../../auth/Permission";
import ARMButton from "../../common/buttons/ARMButton";
import {useRevision} from "../../../lib/hooks/planning/useRevision";

const AddRevision = () => {

    const {
        onFinish,
        onReset,
        form,
    } = useRevision();

    let {id} = useParams();
    const title = id ? `AMP Revision ${t("common.Edit")}` : `AMP Revision ${t("common.Add")}`;

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/planning">
                            <ProfileOutlined/>
                            &nbsp; Planning
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <Link to="/planning/amp-revisions">AMP Revisions</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission={["PLANNING_SETTINGS_AMP_REVISION_SAVE", "PLANNING_SETTINGS_AMP_REVISION_EDIT"]} showFallback>
                <ARMCard title={getLinkAndTitle(title, "/planning/amp-revisions", false, "PLANNING_SETTINGS_AMP_REVISION_SAVE")}>
                    <ARMForm
                        {...formLayout}
                        form={form}
                        name="revisionForm"
                        onFinish={onFinish}
                        scrollToFirstError
                    >
                        <Row>
                            <Col sm={20} md={10}>

                                <Form.Item
                                    name="headerKey"
                                    label="Header Name"
                                    placeholder="Please Enter AMP Header Name"
                                    rules={[
                                        {
                                            required: false,
                                            message: "This field is required",
                                        }
                                    ]}
                                >
                                    <Input size="medium" disabled value={'AMP_HEADER'} defaultValue={'AMP HEADER'}/>
                                </Form.Item>
                                <Form.Item
                                    name="headerValue"
                                    placeholder="Please Enter AMP Header version"
                                    label="Header Version"
                                    rules={[
                                        {
                                            required: false,
                                            message: "This field is required",
                                        }
                                    ]}
                                >
                                    <Input size="medium"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={20} md={10}>
                                <Form.Item wrapperCol={{...formLayout.wrapperCol, offset: 8}}>
                                    <Space size="small">
                                        <ARMButton size="medium" type="primary" htmlType="submit">
                                            {id ? t("common.Update") : t("common.Submit")}
                                        </ARMButton>
                                        <ARMButton
                                            onClick={onReset}
                                            size="medium"
                                            type="primary"
                                            danger
                                        >
                                            {t("common.Reset")}
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

export default AddRevision;