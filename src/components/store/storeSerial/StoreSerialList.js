import React from 'react';
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMButton from "../../common/buttons/ARMButton";
import {EditOutlined, EyeOutlined, FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import ActiveInactive from "../../common/ActiveInactive";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ARMTable from "../../common/ARMTable";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import UnitofMeasurementService from "../../../service/UnitofMeasurementService";
import {getErrorMessage} from "../../../lib/common/helpers";
import {useEffect} from "react";
import {usePaginate} from "../../../lib/hooks/paginations";
import SerialService from "../../../service/store/SerialService";

const StoreSerialList = () => {
    const {Option} = Select;

    useEffect(() => {
        fetchData();
    }, []);

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
        size,
    } = usePaginate('serial', '/store_part_serial/search');
    console.log("serial", collection)
    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        {" "}
                        <Link to="/store">
                            {" "}
                            <i className="fas fa-archive"/> &nbsp;Store
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Serial</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <ARMCard title={getLinkAndTitle(
              "Serial LIST",
              "/store/store-serial",
              true,
            )}>
                <Form form={form} onFinish={fetchData}>
                    <Row gutter={20}>
                        <Col xs={24} md={6}>
                            <Form.Item name="query">
                                <Input placeholder="Enter Serial No "/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item name="size" label="Page Size" initialValue="10">
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
                                        <FilterOutlined/> Filter
                                    </ARMButton>
                                    <ARMButton
                                        size="middle"
                                        type="primary"
                                        htmlType="submit"
                                        onClick={resetFilter}
                                    >
                                        <RollbackOutlined/> Reset
                                    </ARMButton>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <ActiveInactive
                    isActive={isActive} setIsActive={setIsActive}
                />
                <ResponsiveTable>
                    <ARMTable
                    >
                        <thead>
                        <tr>
                            <th>Serial No</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>

                        {collection?.map((data, index) => (
                            <tr key={data.id}>
                                <td>{data.serialNo}</td>
                                <td>
                                    <Space size="small">
                                        <ARMButton
                                            type="primary"
                                            size="small"
                                            style={{
                                                backgroundColor: '#4aa0b5',
                                                borderColor: '#4aa0b5',
                                            }}
                                        >
                                            <EyeOutlined/>
                                        </ARMButton>

                                        <Link to={`/store/edit-store-serial/${data.id}`}>
                                            <ARMButton
                                                type="primary"
                                                size="small"
                                                style={{
                                                    backgroundColor: '#6e757c',
                                                    borderColor: '#6e757c',
                                                }}
                                            >
                                                <EditOutlined/>
                                            </ARMButton>
                                        </Link>

                                        <ActiveInactiveButton
                                            isActive={isActive}
                                            handleOk={async () => {
                                                try {
                                                    await SerialService.toggleStatus(
                                                        data.id,
                                                        !isActive
                                                    );
                                                    notification['success']({
                                                        message: 'Status Changed Successfully!',
                                                    });
                                                    refreshPagination();
                                                } catch (e) {
                                                    notification['error']({
                                                        message: getErrorMessage(e),
                                                    });
                                                }
                                            }}
                                        />
                                    </Space>
                                </td>
                            </tr>
                        ))}

                        </tbody>
                    </ARMTable>
                </ResponsiveTable>
                <Row>
                    {collection.length === 0 ? (
                        <Col style={{margin: '30px auto'}}>
                            <Empty/>
                        </Col>
                    ) : null}
                </Row>

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
            </ARMCard>
        </CommonLayout>
    );
};

export default StoreSerialList;