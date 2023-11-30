import CommonLayout from "../../layout/CommonLayout";
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space} from "antd";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import ARMTable from "../../common/ARMTable";
import {Link} from "react-router-dom";
import React,{useState} from "react";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ActiveInactive from "../../common/ActiveInactive";
import {
    EditOutlined, EyeOutlined,
    FilterOutlined,
    RollbackOutlined,
} from "@ant-design/icons";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ResponsiveTable from "../../common/ResposnsiveTable";
import {getErrorMessage} from "../../../lib/common/helpers";
import SubModuleItemService from "../../../service/SubModuleItemService";
import {usePaginate} from "../../../lib/hooks/paginations";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import Permission from "../../auth/Permission";
import { notifyError } from "../../../lib/common/notifications";
import ViewSubModuleItem from "./ViewSubModuleItem";

const {Option} = Select;

const SubModuleItemList = () => {

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
    } = usePaginate('subModuleItems', '/item/search');

    console.log("sub module item list",collection)

    const handleStatus =  async (id) => {
        try {
            await SubModuleItemService.toggleStatus(
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [base,setBase] = useState([]); 
    const handleBaseModalView = async (id) => {
        try{
            setIsModalOpen(true)
            const {data} = await SubModuleItemService.getSubModuleItemById(id);
            setBase(data); 
        }catch (e) {
            notifyError(getErrorMessage(e));
        }
    }
    return (
        <CommonLayout>

            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <i className="fas fa-cog" />
                        <Link to='/configurations'>
                            &nbsp; Configurations
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Sub Module Items
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

            <Permission permission="CONFIGURATION_ADMINISTRATION_SUB_MODULE_ITEM_SEARCH">
            <ARMCard title={
                //'SUB MODULE ITEM LIST'
                 getLinkAndTitle('SUB MODULE ITEM LIST',
                   '/configurations/sub-module-item',
                   'blank',
                   'CONFIGURATION_ADMINISTRATION_SUB_MODULE_ITEM_SAVE'
                   )
            }
            >
                <Form form={form} onFinish={fetchData}>
                    <Row gutter={20}>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item label="Sub module item" name="query">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12} lg={6}>
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
                            <th>Sub Module</th>
                            <th>Sub Module Item</th>
                            <th>Url Path</th>
                            <th>Ordering</th>
                            <th>Base Item</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>

                        {
                            collection?.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{item.subModuleName}</td>
                                    <td>{item.itemName}</td>
                                    <td>{item.urlPath}</td>
                                    <td>{item.order}</td>
                                    <td>{item.isBase ? item.itemName : item.baseItemName}</td>
                                    <td>
                                        <Space size='small'>
                                            <ARMButton
                                                type="primary"
                                                size="small"
                                                style={{
                                                    backgroundColor: "#4aa0b5",
                                                    borderColor: "#4aa0b5",
                                                }}
                                                onClick={()=>handleBaseModalView(item.id)} 
                                            >
                                                <EyeOutlined />
                                            </ARMButton>
                                            {/*<Link*/}
                                            {/*    to={`/configurations/sub-module-item/${item.id}`}*/}
                                            {/*>*/}
                                            {/*    <ARMButton type="primary" size="small"   style={{*/}
                                            {/*        backgroundColor: '#6e757c',*/}
                                            {/*        borderColor: '#6e757c',*/}

                                            {/*    }}>*/}
                                            {/*        <EditOutlined />*/}
                                            {/*    </ARMButton>*/}
                                            {/*</Link>*/}
                                            <ActiveInactiveButton
                                                isActive={isActive}
                                                handleOk={() => handleStatus(item.id)}
                                            />
                                        </Space>
                                    </td>
                                </tr>
                            ))
                        }

                        </tbody>
                    </ARMTable>
                </ResponsiveTable>
                {/*** for pagination ***/}
                <Row>
                    <Col style={{margin: '0 auto'}}>
                        {collection.length === 0 ? (
                            <Row justify="end">
                                <Empty style={{marginTop: "10px"}}/>
                            </Row>
                        ) : <Row justify="center">
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
                            <ViewSubModuleItem
                                isModalOpen={isModalOpen}
                                setIsModalOpen={setIsModalOpen}
                                base={base}
                            />
                        </Row>}
                    </Col>
                </Row>
            </ARMCard>
           </Permission>
        </CommonLayout>
    )
}
export default SubModuleItemList