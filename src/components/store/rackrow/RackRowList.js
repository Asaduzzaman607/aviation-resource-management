import {
    EditOutlined,
    EyeOutlined,
    FilterOutlined, LockOutlined,
    RollbackOutlined,
    UnlockOutlined,
} from "@ant-design/icons";
import {
    Breadcrumb,
    Col, Empty,
    Form,
    Input,
    notification, Pagination,
    Popconfirm,
    Row,
    Select,
    Space,
} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { getRacks } from "../../../reducers/rack.reducers";
import RackService from "../../../service/RackService";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import { scrollToTop } from "../../configaration/company/Company";
import CommonLayout from "../../layout/CommonLayout";
import RoomService from "../../../service/RoomService";
import {getErrorMessage} from "../../../lib/common/helpers";
import {getRackList} from "../../../store/actions/rack.action";
import {useActiveInactive} from "../../../lib/hooks/active-inactive";
import RackRowService from "../../../service/RackRowService";
import {getRackRow} from "../../../reducers/rackRow.reducers";
import {getRackRowList} from "../../../store/actions/RackRow.action";
import {usePaginate} from "../../../lib/hooks/paginations";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import rackService from "../../../service/RackService";
import rackRowService from "../../../service/RackRowService";
import {useTranslation} from "react-i18next";
import Permission from "../../auth/Permission";

const RackRowList = () => {
    const {Option} = Select;
    const dispatch = useDispatch();
    const {
        form,
        collection,
        page,
        totalPages,
        totalElements,
        paginate,
        isActive,
        setIsActive,
        fetchData,
        refreshPagination,
        resetFilter,
        size
    } = usePaginate('rackRow', '/store-management/rack-rows/search')
    console.log("rackRows",collection)
    useEffect(() => {
        refreshPagination()
        fetchData()
    }, []);
    const { t } = useTranslation();

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        {" "}
                        <Link to="/store">
                            {" "}
                            <i className="fas fa-archive" /> &nbsp;{t("store.Store")}
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item> &nbsp;{t("store.Rack Row.Rack Rows")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="STORE_STORE_CONFIGURATION_RACK_ROW_SEARCH" showFallback>
            <ARMCard
                title={getLinkAndTitle(
                  t("store.Rack Row.Rack Row List"),
                  "/store/rack-row/add",
                  true,
                  'STORE_STORE_CONFIGURATION_RACK_ROW_SAVE'
                )}
            >
                <Form form={form} onFinish={fetchData}>
                    <Row gutter={20}>
                        <Col xs={24} md={6}>
                            <Form.Item  name="query" 
                            label="Rack Row">
                                <Input placeholder={t("store.Rack Row.Search Rack Row")} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item
                                name='size'
                                label={t("common.Page Size")}
                                initialValue="10"
                            >
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
                                        <FilterOutlined /> {t("common.Filter")}
                                    </ARMButton>
                                    <ARMButton size="middle" type="primary" htmlType="submit" onClick={resetFilter}>
                                        <RollbackOutlined /> {t("common.Reset")}
                                    </ARMButton>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <ActiveInactive isActive={isActive} setIsActive={setIsActive}/>
                <Row className="table-responsive">
                    <ARMTable>
                        <thead>
                        <tr>
                            <th>{t("store.Rack Row.Code")}</th>
                            <th>{t("store.Rack Row.Store")}</th>
                            <th>{t("store.Rack Row.Room")}</th>
                            <th>{t("store.Rack Row.Rack")}</th>
                            <th>{t("common.Actions")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {collection?.map((model, index) => (
                            <tr key={index}>
                                <td>{model.rackRowCode}</td>
                                <td>{model.officeCode}</td>
                                <td>{model.roomCode}</td>
                                <td>{model.rackCode}</td>
                                <td>
                                    <Space size="small">
                                        {/*<ARMButton*/}
                                        {/*    type="primary"*/}
                                        {/*    size="small"*/}
                                        {/*    style={{*/}
                                        {/*        backgroundColor: "#4aa0b5",*/}
                                        {/*        borderColor: "#4aa0b5",*/}
                                        {/*    }}*/}
                                        {/*>*/}
                                        {/*    <EyeOutlined />*/}
                                        {/*</ARMButton>*/}
                                        <Permission permission='STORE_STORE_CONFIGURATION_RACK_ROW_EDIT'>
                                        <ARMButton
                                            type="primary"
                                            size="small"
                                            style={{
                                                backgroundColor: "#6e757c",
                                                borderColor: "#6e757c",
                                            }}
                                        >
                                            <Link to={`/store/rack-row/edit/${model.rackRowId}`}>
                                                <EditOutlined />
                                            </Link>
                                        </ARMButton>
                                        </Permission>
                                        <Permission permission='STORE_STORE_CONFIGURATION_RACK_ROW_DELETE'>
                                        <ActiveInactiveButton
                                            isActive={isActive}
                                            handleOk={async () => {
                                                try {
                                                    await rackRowService.toggleStatus(model.rackRowId, !isActive);


                                                    notification['success']({message: t("common.Status Changed Successfully")});
                                                    refreshPagination();
                                                } catch (e) {
                                                    notification['error']({message: getErrorMessage(e)});
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
                </Row>

                    {collection?.length === 0 ? (
                        <Row>
                            <Col style={{ margin: '30px auto' }}>
                                <Empty />
                            </Col>
                        </Row>
                    ) : (
                        <Row justify="center">
                            <Col style={{ marginTop: 10 }}>
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

export default RackRowList;
