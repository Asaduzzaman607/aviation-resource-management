import { Breadcrumb, Col, DatePicker, Form, InputNumber, Row, Select } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ARMForm from "../../../../lib/common/ARMForm";
import { LinkAndTitle } from "../../../../lib/common/TitleOrLink";
import useNrcControlList from "../../../../lib/hooks/planning/useNrcControlList";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import ARMButton from "../../../common/buttons/ARMButton";
import CommonLayout from "../../../layout/CommonLayout";
import { formLayout as layout } from "../../../../lib/constants/form";
import Permission from "../../../auth/Permission";

const validateMessages = {
    required: "${label} is required!",
    types: {
        email: "${label} is not a valid email!",
        number: "${label} is not a valid number!",
    },
    number: {
        range: "${label} must be between ${min} and ${max}",
    },
};


export default function NRCControlAdd() {

    const { id, form, onFinish, allAircrafts, onReset, workOrders, acCheckIndexs } = useNrcControlList()
    const { t } = useTranslation()
    const title = id ? `${t("planning.NRC Control List.NRC Control List")} ${t("common.Update")}` : `${t("planning.NRC Control List.NRC Control List")} ${t("common.Add")}`;

    return (
        <div>
            <CommonLayout>
                <ARMBreadCrumbs>
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item>
                            <i className="fas fa-chart-line" />
                            <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
                        </Breadcrumb.Item>

                        <Breadcrumb.Item>
                            <Link to="/planning/nrc-control-list">{t("planning.NRC Control List.NRC Control List")}</Link>
                        </Breadcrumb.Item>

                        <Breadcrumb.Item> {id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
                    </Breadcrumb>
                </ARMBreadCrumbs>
                <Permission permission={["PLANNING_CHECK_NRC_CONTROL_LIST_SAVE","PLANNING_CHECK_NRC_CONTROL_LIST_EDIT"]} showFallback>
                <ARMCard title={<LinkAndTitle title={title} link="/planning/nrc-control-list" addBtn={false} permission="PLANNING_CHECK_NRC_CONTROL_LIST_SAVE" />}>
                    {/*-------------FORM---------------*/}
                    <ARMForm
                        {...layout}
                        form={form}
                        name="nest-messages"
                        onFinish={onFinish}
                        validateMessages={validateMessages}
                        initialValues={{
                            aircraftModelId: null,
                            checkId: [],
                            flyingHour: null,
                            flyingDay: null,
                            tasks: []
                        }}
                    >
                        <Row gutter={[12, 12]}>
                            <Col span={10}>

                                <Form.Item
                                    name="aircraftId"
                                    label={t("planning.Aircrafts.Aircraft")}
                                    rules={[
                                        {
                                            required: true,
                                        }
                                    ]}
                                >
                                    <Select
                                        placeholder={t("planning.Aircrafts.Aircraft")}
                                        allowClear
                                    >
                                        {
                                            allAircrafts?.map(({ aircraftId, aircraftName }) => <Select.Option value={aircraftId} key={aircraftId}>{aircraftName}</Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="aircraftCheckIndexId"
                                    label={t("planning.A/C Checks.A/C Check Index")}
                                >
                                    <Select
                                        placeholder={t("planning.A/C Checks.A/C Check Index")}
                                        allowClear
                                    >
                                        {
                                            acCheckIndexs.map((ac: any) => <Select.Option value={ac.id} key={ac.id}>{ac.titles.map((title: any) => title).join(' + ')}</Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="woId"
                                    label={t("planning.A/C Checks.Work Order")}
                                >
                                    <Select
                                        placeholder={t("planning.A/C Checks.Work Order")}
                                        allowClear
                                    >
                                        {
                                            workOrders.map((w: any) => <Select.Option value={w.woId} key={w.woId}>{w.woNo}</Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>


                                <Form.Item label="Date" name="date" >
                                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                                </Form.Item>
                                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                    <ARMButton type="primary" htmlType="submit">
                                        {id ? t("common.Update") : t("common.Submit")}
                                    </ARMButton>{" "}
                                    <ARMButton onClick={onReset} type="primary" danger>
                                        {t("common.Reset")}
                                    </ARMButton>
                                </Form.Item>
                            </Col>
                        </Row>
                    </ARMForm>
                </ARMCard>
                </Permission>
            </CommonLayout>
        </div>
    );
}