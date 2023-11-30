import CommonLayout from "../../layout/CommonLayout";
import {
    Breadcrumb,
    Col,
    DatePicker,
    Empty,
    Form,
    notification,
    Pagination,
    Row,
    Select,
    Space
} from "antd";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import ARMTable from "../../common/ARMTable";
import {Link} from "react-router-dom";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ResponsiveTable from "../../common/ResposnsiveTable";

import {
    EditOutlined,
    EyeOutlined,
    FilterOutlined, LockOutlined,
    RollbackOutlined,
} from "@ant-design/icons";

import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ActiveInactive from "../../common/ActiveInactive";
import {usePaginate} from "../../../lib/hooks/paginations";
import {getErrorMessage} from "../../../lib/common/helpers";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import GoodsReceiveService from "../../../service/GoodsReceiveService";
import {useEffect} from "react";

const {Option} = Select;

const GoodsReceiveList = () => {

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
        size
    } = usePaginate('goodsReceive', '/store/receive-goods/search');

    console.log("goods receive list",collection)


    const handleStatus =  async (id) => {
        try {
            await GoodsReceiveService.toggleStatus(
                id,
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
    }

    return (
        <CommonLayout>

            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to='/frs'>
                            <i className="fa fa-file-certificate" />&nbsp; FRS
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        Goods Receive
                    </Breadcrumb.Item>

                </Breadcrumb>
            </ARMBreadCrumbs>

            <ARMCard title={
                getLinkAndTitle('Goods Receive List', '/frs/goods-receive',true)
            }
            >
                <Form form={form} onFinish={ (values) => fetchData({goodReceiveDate: values['goodReceiveDate']}) }>
                    <Row gutter={20}>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item label="GR Date" name="goodReceiveDate">
                               <DatePicker style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12} lg={6}>
                            <Form.Item name="pageSize" label="Page Size" initialValue="10">
                                <Select id="antSelect">
                                    <Option value="10">10</Option>
                                    <Option value="20">20</Option>
                                    <Option value="30">30</Option>
                                    <Option value="40">40</Option>
                                    <Option value="50">50</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12} lg={4}>
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

                <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

                <ResponsiveTable>
                    <ARMTable>

                        <thead>
                        <tr>
                            <th>GR Date</th>
                            <th>Stock Inward Number</th>
                            <th>Actions</th>
                        </tr>

                        </thead>
                        <tbody>
                        {
                            collection?.map((goodsReceive, index) => (
                                <tr key={index}>
                                    <td>{goodsReceive.grDate}</td>
                                    <td>{goodsReceive.storeStockInwardId}</td>
                                    <td>
                                        <Space size='small'>
                                            <ARMButton
                                                type="primary"
                                                size="small"
                                                style={{
                                                    backgroundColor: "#4aa0b5",
                                                    borderColor: "#4aa0b5",
                                                }}
                                            >
                                                <EyeOutlined />
                                            </ARMButton>
                                            <Link
                                                to={`/frs/receive-goods/${goodsReceive.id}`}
                                            >
                                                <ARMButton type="primary" size="small" style={{
                                                    backgroundColor: '#6e757c',
                                                    borderColor: '#6e757c',

                                                }}>
                                                    <EditOutlined />
                                                </ARMButton>
                                            </Link>
                                            <ActiveInactiveButton
                                                isActive={isActive}
                                                handleOk={() => handleStatus(goodsReceive.id)}
                                            />
                                        </Space>
                                    </td>
                                </tr>
                            ))
                        }

                        </tbody>
                    </ARMTable>
                </ResponsiveTable>
                <Row>
                    <Col style={{margin: '0 auto'}}>
                        {collection.length === 0 ? (
                            <Row justify="end">
                                <Empty style={{marginTop: "10px"}}/>
                            </Row>
                        ) : null}
                    </Col>
                </Row>
                {collection.length !== 0 ? (
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
                ) : null
                }
            </ARMCard>
        </CommonLayout>
    )
}
export default GoodsReceiveList