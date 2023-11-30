import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {usePaginate} from "../../../../lib/hooks/paginations";
import {getErrorMessage} from "../../../../lib/common/helpers";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, DatePicker, Empty, Form, notification, Pagination, Row, Select, Space} from "antd";
import {Link, useParams} from "react-router-dom";
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
import AircraftService from "../../../../service/AircraftService";
import {notifyResponseError} from "../../../../lib/common/notifications";
import InterruptionServices from "../../../../service/InterruptionServices";
import {DateFormat} from "../../../planning/report/Common";


const Interruption = () => {
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
        "aircraftInterruption",
        "/aircraft-interruptions/search"
    );

    const {t} = useTranslation();

    const [aircrafts, setAircrafts] = useState([]);


    const getAllAircraft = async () => {
        try {
            const {data} = await AircraftService.getAllAircraftList();
            setAircrafts(data);
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

                    <Breadcrumb.Item>Interruption</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="" showFallback>
                <ARMCard title={<LinkAndTitle title="Interruption" link="/reliability/interruption/add" addBtn
                                              permission=""/>}>
                    <Form formData={form} onFinish={fetchData}>
                        <Row gutter={20}>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    name="aircraftId"
                                    label={'Aircraft'}
                                    rules={[
                                        {
                                            required: false,
                                            message: "Aircraft is required",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Please Select Aircraft"
                                    >
                                        {aircrafts?.map((item) => {
                                            return (
                                                <Select.Option key={item.id} value={item.aircraftId}>
                                                    {item?.aircraftName}{" "}
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
                                    <th>Aircraft</th>
                                    <th>Location</th>
                                    <th>Defect Description</th>
                                    <th>Rect Description</th>
                                    <th>Date</th>
                                    <th>{t("common.Actions")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {collection.map((interruption) => (
                                    <tr key={interruption.id}>
                                        <td>{interruption.aircraftName}</td>
                                        <td>{interruption.locationName}</td>
                                        <td>{interruption.defectDescription}</td>
                                        <td>{interruption.rectDescription}</td>
                                        <td>{DateFormat(interruption.date)}</td>
                                        <td>
                                            <Space size="small">
                                                <Link to={`/reliability/interruption/view/${interruption.id}`}>
                                                    <ARMButton
                                                        type="primary"
                                                        size="small"
                                                        style={{
                                                            backgroundColor: "#4aa0b5",
                                                            borderColor: "#4aa0b5",
                                                        }}
                                                    >
                                                        <EyeOutlined/>
                                                    </ARMButton>
                                                </Link>


                                                <Link to={`/reliability/interruption/edit/${interruption.id}`}>
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
                                                                await InterruptionServices.toggleStatus(interruption.id, !isActive);
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

export default Interruption;

