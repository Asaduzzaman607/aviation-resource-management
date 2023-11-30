import { Breadcrumb, Col, Form,  Pagination, Row, Select, Space } from "antd";
import { Link } from "react-router-dom";
import { LinkAndTitle } from "../../../../lib/common/TitleOrLink";
import useNrcControlList from "../../../../lib/hooks/planning/useNrcControlList";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import CommonLayout from "../../../layout/CommonLayout";
import { useTranslation } from "react-i18next";
import ARMButton from "../../../common/buttons/ARMButton";
import { EditOutlined, EyeOutlined, FilterOutlined, RollbackOutlined } from "@ant-design/icons";
import ARMTable from "../../../common/ARMTable";
import Permission from "../../../auth/Permission";
import React, {useCallback, useEffect, useState} from "react";
import AircraftService from "../../../../service/AircraftService";

export default function NRCControlList() {

    const { t } = useTranslation()

    const [allAircrafts, setAircrafts] = useState([]);

    const getAllAircrafts = useCallback(async () => {
        const res = await AircraftService.getAllAircraftList();
        setAircrafts(
            res.data.map(({ aircraftId , aircraftName  } : any) => ({
                aircraftId,
                aircraftName,
            }))
        );
    }, []);

    useEffect(() => {
        (async () => {
            await getAllAircrafts();
        })();
    }, []);

    const { form, onSearch,  nrcControlLists, totalPages,currentPage, setCurrentPage, submitting, reset } = useNrcControlList()


    const validateMessages = {
        required: "${label} is required!"
    };

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <i className="fas fa-chart-line" />
                        <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>NRC Control List</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

            <Permission permission="PLANNING_CHECK_NRC_CONTROL_LIST_SEARCH" showFallback>
            <ARMCard title={<LinkAndTitle title="NRC Control List" link="add" addBtn permission="PLANNING_CHECK_NRC_CONTROL_LIST_SAVE" />}>

                <Form
                    form={form}
                    name="filter-form"
                    onFinish={onSearch}
                    validateMessages={validateMessages}
                    initialValues={{ aircraftId: "" }}
                >
                    <Row gutter={20}>
                        <Col xs={24} md={4}>
                            <Form.Item
                                name="aircraftId"
                                label="Aircraft"
                                rules={[
                                    {
                                        required: true,
                                    }
                                ]}
                            >
                                <Select
                                    placeholder={t("planning.Aircrafts.Select Aircraft")}
                                    allowClear
                                >
                                    {
                                        allAircrafts?.map(({ aircraftId, aircraftName }) => <Select.Option value={aircraftId} key={aircraftId}>{aircraftName}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item>
                                <Space>
                                    <ARMButton loading={submitting} size="middle" type="primary" htmlType="submit">
                                        <FilterOutlined name="filter" /> {t("common.Filter")}
                                    </ARMButton>
                                    <ARMButton
                                        size="middle"
                                        type="primary"
                                        onClick={reset}
                                    >
                                        <RollbackOutlined name="reset" /> {t("common.Reset")}
                                    </ARMButton>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                {/* <ActiveInactive isActive={isActive} setIsActive={setIsActive} /> */}

                <Row className="table-responsive">
                    <ARMTable>
                        <thead>
                            <tr>
                                <th>Aircraft</th>
                                <th>Checks</th>
                                <th>Work No</th>
                                <th>{t("common.Actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nrcControlLists?.map((check: any) => (
                                <tr key={check.id}>
                                    <td>{check.aircraftName}</td>
                                    <td>{check.typeOfCheckList?.map((data: any) => data).join(' + ')}</td>
                                    <td>{check.woNo}</td>
                                    <td>
                                        <Space size="small">
                                            <Link to={`view/${check.id}`}>
                                                <ARMButton
                                                    type="primary"
                                                    size="small"
                                                    style={{
                                                        backgroundColor: "#4aa0b5",
                                                        borderColor: "#4aa0b5",
                                                    }}
                                                >
                                                    <EyeOutlined />
                                                </ARMButton>
                                            </Link>

                                            <Link to={`edit/${check.id}`}>
                                                <Permission permission="PLANNING_CHECK_NRC_CONTROL_LIST_EDIT">
                                                <ARMButton
                                                    type="primary"
                                                    size="small"
                                                    style={{
                                                        backgroundColor: "#6e757c",
                                                        borderColor: "#6e757c",
                                                    }}
                                                >
                                                    <EditOutlined />
                                                </ARMButton>
                                                </Permission>
                                            </Link>
                                        </Space>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </ARMTable>
                </Row>
                <Row justify="center">
                    <Col style={{ marginTop: 10 }}>
                        {/*<Pagination onChange={setCurrentPage} total={totalPages * 10} />*/}
                        <Pagination showSizeChanger={false} onShowSizeChange={console.log} pageSize={10} current={currentPage}
                                    onChange={setCurrentPage} total={totalPages * 10}/>
                    </Col>
                </Row>

            </ARMCard>
            </Permission>
        </CommonLayout >
    )
};
