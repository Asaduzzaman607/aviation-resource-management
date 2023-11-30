import {usePaginate} from "../../../lib/hooks/paginations";
import {useTranslation} from "react-i18next";
import {notifyResponseError} from "../../../lib/common/notifications";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {EditOutlined, FilterOutlined, ProfileOutlined, RollbackOutlined} from "@ant-design/icons";
import CommonLayout from "../../layout/CommonLayout";
import {Breadcrumb, Col,  Empty, Form, notification, Pagination, Row, Select, Space} from "antd";
import Permission from "../../auth/Permission";
import ARMCard from "../../common/ARMCard";
import {LinkAndTitle} from "../../../lib/common/TitleOrLink";
import {Option} from "antd/lib/mentions";
import ARMButton from "../../common/buttons/ARMButton";
import ActiveInactive from "../../common/ActiveInactive";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ARMTable from "../../common/ARMTable";
import {DateFormat} from "../../planning/report/Common";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import CancellationServices from "../../../service/CancellationServices";
import {getErrorMessage} from "../../../lib/common/helpers";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ModelTreeService from "../../../service/ModelTreeService";
import SystemServices from "../../../service/SystemServices";

const Systems = () => {
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
        "systems",
        "/systems/search"
    );

    const {t} = useTranslation();

    const [locations, setLocations] = useState([]);



    const getAllLocation = async () => {
        try {
            const {data} = await ModelTreeService.getAllLocation();
            setLocations(data.model);
        } catch (er) {
            notifyResponseError(er)
        }
    };

    useEffect(() => {
        getAllLocation();
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

                    <Breadcrumb.Item>Systems</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="" showFallback>
                <ARMCard title={<LinkAndTitle title="Systems" link="/reliability/system/add" addBtn
                                              permission=""/>}>
                    <Form formData={form} onFinish={fetchData}>
                        <Row gutter={20}>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    name="locationId"
                                    label={'ATA'}
                                    style={{marginBottom: "12px"}}
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please Select ATA',
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        filterOption={(inputValue, option) =>
                                            option.children
                                                .toString("")
                                                .toLowerCase()
                                                .includes(inputValue.toLowerCase())
                                        }
                                        placeholder={"Please Select ATA"}
                                    >
                                        {locations?.map((loc) => {
                                            return (
                                                <Select.Option key={loc.id} value={loc.id}>
                                                    {loc.name}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
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
                                    <th>ATA</th>
                                    <th>System Name</th>
                                    <th>{t("common.Actions")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {collection.map((sys) => (
                                    <tr key={sys.id}>
                                        <td>{sys.locationName}</td>
                                        <td>{sys.name}</td>
                                        <td>
                                            <Space size="small">
                                                <Link to={`/reliability/system/edit/${sys.id}`}>
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
                                                                await SystemServices.toggleStatus(sys.id, !isActive);
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

export default Systems;

