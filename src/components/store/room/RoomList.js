import {EditOutlined, EyeOutlined, FilterOutlined, RollbackOutlined,} from "@ant-design/icons";
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space,} from "antd";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import {getErrorMessage} from "../../../lib/common/helpers";
import {usePaginate} from "../../../lib/hooks/paginations";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import roomService from "../../../service/RoomService";
import {useTranslation} from "react-i18next";
import Permission from "../../auth/Permission";

const RoomList = () => {
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
    } = usePaginate('room', 'store-management/rooms/search')


    console.log('Collection====>', collection)
    useEffect(() => {
        refreshPagination()
        fetchData()
    }, []);
    const { t } = useTranslation();

    return (
        <div>
            <CommonLayout>
                <ARMBreadCrumbs>
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item>
                            {" "}
                            <Link to="/store">
                                {" "}
                                <i className="fas fa-archive"/> &nbsp;{t("store.Store")}
                            </Link>
                        </Breadcrumb.Item>


                        <Breadcrumb.Item>{t("store.Rooms.Rooms")}</Breadcrumb.Item>
                    </Breadcrumb>
                </ARMBreadCrumbs>
                <Permission permission="STORE_STORE_CONFIGURATION_ROOM_SEARCH" showFallback>
                <ARMCard title={
                    getLinkAndTitle(
                      t("store.Rooms.Room List"),
                      "/store/room/add",
                      true,
                      'STORE_STORE_CONFIGURATION_ROOM_SAVE'
                    )}>
                    <Form form={form} onFinish={fetchData}>
                        <Row gutter={20}>
                            <Col xs={24} md={6}>
                                <Form.Item name="query"
                                label='Room '>
                                    <Input placeholder={t("store.Rooms.Search Room")} />
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
                                            <FilterOutlined/> {t("common.Filter")}
                                        </ARMButton>
                                        <ARMButton size="middle" type="primary" htmlType="submit" onClick={resetFilter}>
                                            <RollbackOutlined/> {t("common.Reset")}
                                        </ARMButton>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    <ActiveInactive isActive={isActive} setIsActive={setIsActive}/>
                    <Row className="table-responsive">
                        <ARMTable
                        >
                            <thead>
                            <tr>
                                <th>{t("store.Rooms.Code")}</th>
                                <th>{t("store.Rooms.Name")}</th>
                                <th>{t("store.Rooms.Store")}</th>
                                <th>{t("common.Actions")}</th>
                            </tr>
                            </thead>
                            <tbody>

                            {collection.map((model, index) => (
                                <tr key={index}>
                                    <td>{model.roomCode}</td>
                                    <td>{model.roomName}</td>
                                    <td>{model.officeCode}</td>
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
                                            {/*    <EyeOutlined/>*/}
                                            {/*</ARMButton>*/}
                                            <Permission permission='STORE_STORE_CONFIGURATION_ROOM_EDIT'>
                                            <ARMButton
                                                type="primary"
                                                size="small"
                                                style={{
                                                    backgroundColor: "#6e757c",
                                                    borderColor: "#6e757c",
                                                }}
                                            >
                                                <Link to={`/store/room/edit/${model.roomId}`}>
                                                    <EditOutlined/>
                                                </Link>
                                            </ARMButton>
                                            </Permission>
                                            <Permission permission='STORE_STORE_CONFIGURATION_ROOM_DELETE'>
                                            <ActiveInactiveButton
                                                isActive={isActive}
                                                handleOk={async () => {
                                                    try {
                                                        await roomService.toggleStatus(model.roomId, !isActive);


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
                            <Col style={{margin: '30px auto'}}>
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
        </div>
    );
};

export default RoomList;
