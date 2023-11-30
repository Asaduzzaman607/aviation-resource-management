import React, {useState, useEffect} from 'react';
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMButton from "../../../common/buttons/ARMButton";
import {
    EditOutlined,
    FilterOutlined,
    RollbackOutlined,
} from "@ant-design/icons";
import ActiveInactive from "../../../common/ActiveInactive";
import ARMTable from "../../../common/ARMTable";


import {getErrorMessage} from "../../../../lib/common/helpers";
import ARMForm from "../../../../lib/common/ARMForm";
import {usePaginate} from "../../../../lib/hooks/paginations";
import ActiveInactiveButton from "../../../common/buttons/ActiveInactiveButton";
import AmlBookServices from "../../../../service/AmlBookServices";
import AircraftService from "../../../../service/AircraftService";
import {scrollToTop} from "../../../configaration/company/Company";
import { useTranslation } from 'react-i18next';
import Permission from '../../../auth/Permission';


const AmlBooks = () => {


    const [ aircrafts, setAircrafts] = useState([]);

    const { t } = useTranslation()


    const getAllAircraft =async () => {
        const {data} = await AircraftService.getAllAircraftList()
        setAircrafts(data);
    };
    useEffect(() => {
        getAllAircraft();
        scrollToTop();
    }, []);



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
    } = usePaginate('AmlBooks', 'aml-book/search')




    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item> <Link to='/planning'> <i className="fas fa-chart-line"/> &nbsp;{t("planning.Planning")}
                    </Link></Breadcrumb.Item>

                    <Breadcrumb.Item>
                        {t("planning.ATL Books.ATL Books")}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_BOOKS_SEARCH" showFallback>
            <ARMCard
                title={
                    getLinkAndTitle(t("planning.ATL Books.ATL Book List"), '/planning/atl-books/add', true,"PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_BOOKS_SAVE")
                }
            >
                <ARMForm
                    onFinish={fetchData} form={form}
                >        <Row gutter={20}>
                    <Col xs={24} md={12} lg={6}>
                        <Form.Item name="aircraftId">
                            <Select placeholder="--Select an Aircraft--">
                                {aircrafts?.map((item, index) => {
                                    return (
                                        <Select.Option key={index} value={item.aircraftId}>
                                            {item.aircraftName}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={6}>
                        <Form.Item label="" name="bookNo">
                            <Input placeholder={t("planning.ATL Books.Enter Book No")}/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12} lg={6}>
                        <Form.Item name="size"
                                   label={t("common.Page Size")}
                                   initialValue="10">
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
                                <ARMButton
                                    size="middle"
                                    type="primary"
                                    htmlType="submit"
                                    onClick={resetFilter}
                                >
                                    <RollbackOutlined/> {t("common.Reset")}
                                </ARMButton>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
                </ARMForm>
                <ActiveInactive isActive={isActive} setIsActive={setIsActive}/>

                <Row className='table-responsive'>
                    <ARMTable>
                        <thead>
                        <tr>
                            <th>{t("planning.Aircrafts.Aircraft")}</th>
                            <th>{t("planning.ATL Books.Book No")}</th>
                            <th>{t("planning.ATL Books.Start Page No")}</th>
                            <th>{t("planning.ATL Books.End Page No")}</th>
                            <th>{t("common.Actions")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            collection?.map((amlBook, index) => (

                                <tr key={index}>
                                    <td>{amlBook.aircraftName}</td>
                                    <td> {amlBook.bookNo}</td>
                                    <td>  {amlBook.startPageNo}</td>
                                    <td>  {amlBook.endPageNo}</td>
                                    <td>
                                        <Space size='small'>

                                            {isActive? <Link to={`edit/${amlBook.id}`}>
                                                <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_BOOKS_EDIT">
                                                    <ARMButton type="primary" size="small" style={{
                                                        backgroundColor: '#6e757c',
                                                        borderColor: '#6e757c',

                                                    }}>
                                                        <EditOutlined/>

                                                    </ARMButton>
                                                </Permission>
                                            </Link>: null}
                                            <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_BOOKS_DELETE">
                                                <ActiveInactiveButton
                                                    isActive={isActive}
                                                    handleOk={async () => {
                                                        try {
                                                            await AmlBookServices.toggleStatus(amlBook.id, !amlBook.isActive);
                                                            notification['success']({message: "Status Changed Successfully!"});
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
                            ))


                        }
                        </tbody>
                    </ARMTable>
                </Row>
                {collection.length === 0 ? (
                <Row>
                    <Col style={{ margin: "30px auto" }}>
                    <Empty />
                    </Col>
                </Row>
                ) : (
                <Row justify="center">
                    <Col style={{marginTop: 10}}>
                        <Pagination showSizeChanger={false} onShowSizeChange={console.log} pageSize={size} current={page} onChange={paginate}
                                    total={totalElements}/>
                    </Col>
                </Row>
                )}

            </ARMCard>
            </Permission>
        </CommonLayout>
    );
};

export default AmlBooks;
