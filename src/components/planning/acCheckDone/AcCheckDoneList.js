import React, {useEffect, useState} from 'react';
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, DatePicker, Empty, Form, notification, Pagination, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import Permission from "../../auth/Permission";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import {FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import ActiveInactive from "../../common/ActiveInactive";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ARMTable from "../../common/ARMTable";
import EditButton from "../../common/buttons/EditButton";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import {getErrorMessage} from "../../../lib/common/helpers";
import CommonLayout from "../../layout/CommonLayout";
import {usePaginate} from "../../../lib/hooks/paginations";
import {useTranslation} from "react-i18next";
import {useAircraftsList} from "../../../lib/hooks/planning/aircrafts";
import AcCheckDoneServices from "../../../service/acCheckDoneServices";
import {DailyFlyingHourFormat, DashboardDateFormat} from "../report/Common";
import AircraftService from '../../../service/AircraftService';

const AcCheckDoneList = () => {
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
    } =
        usePaginate("acCheckDoneList", "ac-check-done/search");

        const [ aircrafts, setAircrafts ] = useState([]);

        const getAllAircraftList =async () =>{
            const {data} = await AircraftService.getAllAircraftList();
            setAircrafts(data);
        }
    
        useEffect(()=>{
            (async()=>{
                await getAllAircraftList();
    
            })();
        },[])


    useEffect(() => {
        fetchData();
    }, []);


    const {t} = useTranslation()
    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        {" "}
                        <Link to="/planning">
                            {" "}
                            <i className="fas fa-chart-line"/> &nbsp;{t("planning.Planning")}
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>Aircraft Check Done List</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="PLANNING_AIRCRAFT_AC_CHECK_DONE_SEARCH" showFallback>
                <ARMCard title={getLinkAndTitle('Aircraft Check Done List', "/planning/ac-check-done/add", true, "PLANNING_AIRCRAFT_AC_CHECK_DONE_SAVE")}>
                    <ARMForm initialValues={{pageSize: 10}} onFinish={fetchData} form={form}>
                        <Row gutter={20}>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item
                                    name="aircraftId"
                                    label={t("planning.Aircrafts.Aircraft")}
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Aircraft is required',
                                        }
                                    ]}
                                >
                                    <Select
                                        placeholder={t("planning.Aircrafts.Aircraft")}
                                        allowClear
                                    >
                                        {
                                            aircrafts.map(({aircraftId, aircraftName}) => <Select.Option value={aircraftId}
                                                                                         key={aircraftId}>{aircraftName}</Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item
                                    name="date"
                                    label="Check Done Date"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Description is missing',
                                        },
                                    ]}
                                >
                                    <DatePicker  style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item name="size" label="Page Size" initialValue="10">
                                    <Select id="antSelect">
                                        <Select.Option value="10">10</Select.Option>
                                        <Select.Option value="20">20</Select.Option>
                                        <Select.Option value="30">30</Select.Option>
                                        <Select.Option value="40">40</Select.Option>
                                        <Select.Option value="50">50</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12} lg={6}>
                                <Form.Item>
                                    <Space>
                                        <ARMButton size="middle" type="primary" htmlType="submit">
                                            <FilterOutlined/> {t("common.Filter")}
                                        </ARMButton>
                                        <ARMButton size="middle" type="primary" htmlType="submit" onClick={resetFilter}>
                                            <RollbackOutlined/> {t("common.Reset")}
                                        </ARMButton>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </ARMForm>
                    <ActiveInactive isActive={isActive} setIsActive={setIsActive}/>

                    <Row className="table-responsive">
                        <ResponsiveTable>
                            <ARMTable>
                                <thead>
                                <tr>
                                    <th>Aircraft</th>
                                    <th>Check Done Hour</th>
                                    <th>Check Done Date</th>
                                    <th>Check Type</th>
                                    <th>{t("common.Actions")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {collection?.map((checkDone, index) => (
                                    <tr key={index}>
                                        <td>{checkDone.aircraftName}</td>
                                        <td>{DailyFlyingHourFormat(checkDone.aircraftCheckDoneHour)}</td>
                                        <td> {DashboardDateFormat(checkDone.aircraftCheckDoneDate)}</td>
                                        <td>{checkDone.checkType}</td>
                                        <td>
                                            <Space size="small">
                                                {isActive? <Link to={`edit/${checkDone.id}`}>
                                                    <Permission
                                                        permission="PLANNING_AIRCRAFT_AC_CHECK_DONE_EDIT">
                                                        <EditButton/>
                                                    </Permission>
                                                </Link> : null}
                                                <Permission
                                                    permission="PLANNING_AIRCRAFT_AC_CHECK_DONE_DELETE">
                                                    <ActiveInactiveButton
                                                        isActive={isActive}
                                                        handleOk={async () => {
                                                            try {
                                                                await AcCheckDoneServices.toggleStatus(checkDone.id, !checkDone.isActive);
                                                                notification["success"]({message: t("common.Status Changed Successfully")});
                                                                refreshPagination();
                                                            } catch (e) {
                                                                notification["error"]({message: getErrorMessage(e)});
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

                    {collection?.length === 0 ? (
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

export default AcCheckDoneList;