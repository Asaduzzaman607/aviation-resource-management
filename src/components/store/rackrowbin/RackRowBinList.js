import React, {useState,useEffect,useCallback} from 'react';
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Popconfirm, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMButton from "../../common/buttons/ARMButton";
import {
    EditOutlined,
    EyeOutlined,
    FilterOutlined,
    RollbackOutlined,
} from "@ant-design/icons";
import ActiveInactive from "../../common/ActiveInactive";
import ARMTable from "../../common/ARMTable";
import {getErrorMessage} from "../../../lib/common/helpers";
import {usePaginate} from "../../../lib/hooks/paginations";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import rackRowBinService from "../../../service/RackRowBinService";
import {useTranslation} from "react-i18next";
import Permission from "../../auth/Permission";

const RackRowBinList = () => {
    const {Option} = Select;
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
    } = usePaginate('rackRowBin', '/store-management/rack-row-bins/search')


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
                    <Breadcrumb.Item> &nbsp;{t("store.Rack Row Bin.Rack Row Bins")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="STORE_STORE_CONFIGURATION_RACK_ROW_BIN_SEARCH" showFallback>
            <ARMCard
                title={getLinkAndTitle(
                  t("store.Rack Row Bin.Rack Row Bin List"),
                  "/store/rack-row-bin/add",
                  true,
                  'STORE_STORE_CONFIGURATION_RACK_ROW_BIN_SAVE'
                )}
            >
                <Form form={form} onFinish={fetchData}>
                    <Row gutter={20}>
                        <Col xs={24} md={6}>
                            <Form.Item name="query" label="Rack-Row-Bin">
                                <Input placeholder={t("store.Rack Row Bin.Search Rack Row Bin")} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item
                                name="size"
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
                            <th>{t("store.Rack Row Bin.Code")}</th>
                            <th>{t("store.Rack Row Bin.Store")}</th>
                            <th>{t("store.Rack Row Bin.Room")}</th>
                            <th>{t("store.Rack Row Bin.Rack")}</th>
                            <th>{t("store.Rack Row Bin.Rack Row")}</th>
                            <th>{t("common.Actions")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {collection?.map((model, index) => (
                            <tr key={index}>
                                <td>{model.rackRowBinCode}</td>
                                <td>{model.officeCode}</td>
                                <td>{model.roomCode}</td>
                                <td>{model.rackCode}</td>
                                <td>{model.rackRowCode}</td>

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
                                        <Permission permission='STORE_STORE_CONFIGURATION_RACK_ROW_BIN_EDIT'>
                                        <ARMButton
                                            type="primary"
                                            size="small"
                                            style={{
                                                backgroundColor: "#6e757c",
                                                borderColor: "#6e757c",
                                            }}
                                        >
                                            <Link to={`/store/rack-row-bin/edit/${model.rackRowBinId}`}>
                                                <EditOutlined />
                                            </Link>
                                        </ARMButton>
                                        </Permission>
                                        <Permission permission='STORE_STORE_CONFIGURATION_RACK_ROW_BIN_DELETE'>
                                        <ActiveInactiveButton
                                            isActive={isActive}
                                            handleOk={async () => {
                                                try {
                                                    await rackRowBinService.toggleStatus(model.rackRowBinId, !isActive);


                                                    notification['success']({message:t("common.Status Changed Successfully")});
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

export default RackRowBinList;