import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {usePaginate} from "../../../../lib/hooks/paginations";
import {getErrorMessage} from "../../../../lib/common/helpers";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, DatePicker, Empty, Form, notification, Pagination, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import Permission from "../../../auth/Permission";
import ARMCard from "../../../common/ARMCard";
import {Option} from "antd/lib/mentions";
import ARMButton from "../../../common/buttons/ARMButton";
import {EditOutlined, EyeOutlined, FilterOutlined, ProfileOutlined, RollbackOutlined} from "@ant-design/icons";
import ActiveInactive from "../../../common/ActiveInactive";
import ARMTable from "../../../common/ARMTable";
import ActiveInactiveButton from "../../../common/buttons/ActiveInactiveButton";
import {LinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import {notifyResponseError} from "../../../../lib/common/notifications";
import {DateFormat} from "../../../planning/report/Common";
import CancellationServices from "../../../../service/CancellationServices";
import ModelsService from "../../../../service/ModelsService";


const Cancellation = () => {
    const {
        form,
        collection,
        page,
        totalElements,
        paginate,
        isActive,
        setIsActive,
        fetchData,
        refreshPagination,
        resetFilter,
        size
    } = usePaginate(
        "aircraftCancellation",
        "/ac-cancellations/search"
    );

    const {t} = useTranslation();

    const [aircraft, setAircraft] = useState([]);


    const getAllAircraft = async () => {
        try {
            const {data} = await ModelsService.getAllAircraftModel();
            setAircraft(data.model);
        } catch (er) {
            notifyResponseError(er);
        }
    };

    useEffect(() => {
        getAllAircraft();
    }, []);


    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/reliability">
                            <ProfileOutlined/>
                            &nbsp; Reliability
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>Cancellation</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="" showFallback>
                <ARMCard title={<LinkAndTitle title="Cancellation" link="/reliability/cancellation/add" addBtn
                                              permission=""/>}>
                    <Form formData={form} onFinish={fetchData}>
                        <Row gutter={20}>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    name="aircraftModelId"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("planning.A/C Type.Please Select A/C Type"),
                                        },
                                    ]}
                                >
                                    <Select placeholder={t("planning.A/C Type.Select A/C Type")}>
                                        {aircraft?.map((item) => {
                                            return (
                                                <Select.Option key={item.id} value={item.id}>
                                                    {item?.aircraftModelName}{" "}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                                <Form.Item
                                    name="startDate"
                                >
                                    <DatePicker placeholder={t("planning.ATL.From Date")} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={4}>
                                <Form.Item
                                    name="endDate">
                                    <DatePicker placeholder={t("planning.ATL.To Date")} style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={4}>
                                <Form.Item name="size" label={t("common.Page Size")} initialValue="10">
                                    <Select id="antSelect">
                                        <Option value="10">10</Option>
                                        <Option value="20">20</Option>
                                        <Option value="30">30</Option>
                                        <Option value="40">40</Option>
                                        <Option value="50">50</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item>
                                    <Space>
                                        <ARMButton size="middle" type="primary" htmlType="submit">
                                            <FilterOutlined/> {t("common.Filter")}
                                        </ARMButton>
                                        <ARMButton size="middle" type="primary" htmlType="reset" onClick={resetFilter}>
                                            <RollbackOutlined/> {t("common.Reset")}
                                        </ARMButton>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    <ActiveInactive isActive={isActive} setIsActive={setIsActive}/>

                    <Row className="table-responsive">
                        <ResponsiveTable>
                            <ARMTable>
                                <thead>
                                <tr>
                                    <th>Cancellation Type</th>
                                    <th>Date</th>
                                    <th>{t("common.Actions")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {collection.map((cancellation) => (
                                    <tr key={cancellation.id}>
                                        <td>{cancellation.cancellationTypeEnum}</td>
                                        <td>{DateFormat(cancellation.date)}</td>
                                        <td>
                                            <Space size="small">
                                                <Link to={`/reliability/cancellation/edit/${cancellation.id}`}>
                                                    <Permission permission="">
                                                        <ARMButton
                                                            type="primary"
                                                            size="small"
                                                            style={{
                                                                backgroundColor: "#6e757c",
                                                                borderColor: "#6e757c",
                                                            }}
                                                        >
                                                            <EditOutlined/>
                                                        </ARMButton>
                                                    </Permission>
                                                </Link>

                                                <Permission permission="">
                                                    <ActiveInactiveButton
                                                        isActive={isActive}
                                                        handleOk={async () => {
                                                            try {
                                                                await CancellationServices.toggleStatus(cancellation.id, !isActive);
                                                                notification["success"]({
                                                                    message: t("common.Status Changed Successfully"),
                                                                });
                                                                await refreshPagination();
                                                            } catch (e) {
                                                                notification["error"]({
                                                                    message: getErrorMessage(e),
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </Permission>
                                            </Space>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </ARMTable>
                        </ResponsiveTable>
                    </Row>

                    {collection.length === 0 ? (
                        <Row>
                            <Col style={{margin: "30px auto"}}>
                                <Empty/>
                            </Col>
                        </Row>
                    ) : (
                        <Row justify="center">
                            <Col style={{marginTop: 10}}>
                                <Pagination
                                    showSizeChanger={false}
                                    onShowSizeChange={console.log}
                                    pageSize={size}
                                    current={page}
                                    onChange={paginate}
                                    total={totalElements}
                                />
                            </Col>
                        </Row>
                    )}
                </ARMCard>
            </Permission>
        </CommonLayout>
    );
};

export default Cancellation;

