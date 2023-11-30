import React, {useState} from 'react';
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
import CountryService from "../../../service/CountryService";
import {getErrorMessage} from "../../../lib/common/helpers";
import CommonLayout from "../../layout/CommonLayout";

const PurchaseOrderReportList = () => {
    const[collection,setCollection]=useState([])
    const[isActive,setIsActive]=useState(true)
    const { Option } = Select;

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/material-management">
                            <i className="fas fa-shopping-basket"  /> &nbsp;Material Management
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>Purchase Order Report</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

            <ARMCard
                title={getLinkAndTitle(
                    'Purchase Order Report List',
                    '/material-management/purchase-order-report',
                    'addBtn'
                )}
            >
                {/*<Form form={form} onFinish={fetchData}>*/}
                <Form>
                    <Row gutter={20}>
                        <Col xs={24} md={6}>
                            <Form.Item name="query">
                                <Input  />
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
                                        <FilterOutlined /> Filter
                                    </ARMButton>
                                    <ARMButton
                                        size="middle"
                                        type="primary"
                                        htmlType="submit"
                                        // onClick={resetFilter}
                                    >
                                        <RollbackOutlined /> Reset
                                    </ARMButton>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

                <ResponsiveTable>
                    <ARMTable>
                        <thead>
                        <tr>
                            <th>POR NO</th>
                            <th>RFQ</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {collection?.map((data) => (
                            <tr key={data.id}>
                                <td>{data.code}</td>
                                <td>{data.name}</td>
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
                                            <EyeOutlined />
                                        </ARMButton>


                                        <ActiveInactiveButton
                                            isActive={isActive}
                                            // handleOk={async () => {
                                            //     try {
                                            //         await CountryService.toggleStatus(
                                            //             data.id,
                                            //             !isActive
                                            //         );
                                            //         notification['success']({
                                            //             message: 'Status Changed Successfully!',
                                            //         });
                                            //         refreshPagination();
                                            //     } catch (e) {
                                            //         notification['error']({
                                            //             message: getErrorMessage(e),
                                            //         });
                                            //     }
                                            // }}
                                        />
                                    </Space>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </ARMTable>
                </ResponsiveTable>

                {collection.length === 0 ? (
                    <Row>
                        <Col style={{ margin: '30px auto' }}>
                            <Empty />
                        </Col>
                    </Row>
                ) : (
                    <Row justify="center">
                        <Col style={{ marginTop: 10 }}>
                            <Pagination
                                // showSizeChanger={false}
                                // onShowSizeChange={console.log}
                                // pageSize={size}
                                // current={page}
                                // onChange={paginate}
                                // total={totalElements}
                            />
                        </Col>
                    </Row>
                )}
            </ARMCard>
        </CommonLayout>
    );
};

export default PurchaseOrderReportList;