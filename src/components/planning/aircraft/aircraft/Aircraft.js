import {EditOutlined, EyeOutlined, FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import {getErrorMessage} from "../../../../lib/common/helpers";
import { LinkAndTitle} from "../../../../lib/common/TitleOrLink";
import {usePaginate} from "../../../../lib/hooks/paginations";
import AircraftService from "../../../../service/AircraftService";
import ActiveInactive from "../../../common/ActiveInactive";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import ARMTable from "../../../common/ARMTable";
import ActiveInactiveButton from "../../../common/buttons/ActiveInactiveButton";
import ARMButton from "../../../common/buttons/ARMButton";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import CommonLayout from "../../../layout/CommonLayout";
import {useTranslation} from "react-i18next"
import Permission from "../../../auth/Permission";

const {Option} = Select;

const Aircraft = () => {
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
        "aircrafts",
        "/aircrafts/search"
    );

    const {t} = useTranslation();


    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/planning">
                            <i className="fas fa-chart-line"/>
                            &nbsp; {t("planning.Planning")}
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{t("planning.Aircrafts.Aircrafts")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="PLANNING_AIRCRAFT_AIRCRAFT_SEARCH" showFallback>
                <ARMCard
                    title={<LinkAndTitle title={t("planning.Aircrafts.Aircraft List")} link="/planning/aircraft/add"
                                         addBtn permission="PLANNING_AIRCRAFT_AIRCRAFT_SAVE"/>}>
                    <Form formData={form} onFinish={fetchData}>
                        <Row gutter={20}>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    name="query"
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
                                    <Input placeholder={t("planning.Aircrafts.Search Aircraft Registration")}/>
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
                                    <th>{t("planning.Aircrafts.A/C Type")}</th>
                                    <th>{t("planning.Aircrafts.A/C Registration")}</th>
                                    <th>{t("planning.Aircrafts.A/C Serial")}</th>

                                    <th>{t("common.Actions")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {collection.map((aircraft) => (
                                    <tr key={aircraft.id}>
                                        <td>{aircraft.aircraftModelName}</td>
                                        <td>{aircraft.aircraftName}</td>
                                        <td>{aircraft.airframeSerial}</td>
                                        <td>
                                            <Space size="small">
                                                <Link to={`/planning/aircraft/view/${aircraft.id}`}>
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


                                                {isActive ?
                                                    <Link to={`/planning/aircraft/edit/${aircraft.id}`}>
                                                        <Permission permission="PLANNING_AIRCRAFT_AIRCRAFT_EDIT">
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
                                                    </Link> :
                                                    null
                                                }

                                                <Permission permission="PLANNING_AIRCRAFT_AIRCRAFT_DELETE">
                                                    <ActiveInactiveButton
                                                        isActive={isActive}
                                                        handleOk={async () => {
                                                            try {
                                                                await AircraftService.toggleAircraftStatus(aircraft.id, !isActive);
                                                                notification["success"]({
                                                                    message: t("common.Status Changed Successfully"),
                                                                });
                                                                refreshPagination();
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

export default Aircraft;
