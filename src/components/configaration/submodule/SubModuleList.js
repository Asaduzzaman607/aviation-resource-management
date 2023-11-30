import CommonLayout from "../../layout/CommonLayout";
import {
    Breadcrumb,
    Col,
    Empty,
    Form,
    Input,
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
import {getErrorMessage} from "../../../lib/common/helpers";
import React,{useState} from "react";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import SubModuleService from "../../../service/SubModuleService";
import {
    EditOutlined, EyeOutlined,
    FilterOutlined,
    RollbackOutlined,
} from "@ant-design/icons";
import ActiveInactive from "../../common/ActiveInactive";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {usePaginate} from "../../../lib/hooks/paginations";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import Permission from "../../auth/Permission";
import ViewSubModule from "./ViewSubModule";
import { notifyError } from "../../../lib/common/notifications";

const {Option} = Select;

const SubModuleList = () => {

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
    } = usePaginate('subModules', '/submodule/search');

    console.log("sub module list",collection)

    const handleStatus =  async (id) => {
        try {
            await SubModuleService.toggleStatus(
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
            const {data} = await SubModuleService.getSubModuleById(id);
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
                        Sub Modules
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

            <Permission permission="CONFIGURATION_ADMINISTRATION_SUB_MODULE_SEARCH">
            <ARMCard title={
                getLinkAndTitle('SUB MODULE LIST',
                  '/configurations/sub-module',
                  'blank',
                  'CONFIGURATION_ADMINISTRATION_SUB_MODULE_SAVE'
                )
            }
            >
                <Form form={form} onFinish={fetchData}>
                    <Row gutter={20}>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item label="Sub module" name="query">
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
                            <th>Module</th>
                            <th>Sub Module</th>
                            <th>Ordering</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>

                        {
                            collection?.map((subModule, index) => (
                                <tr key={subModule.id}>
                                    <td>{subModule.moduleName}</td>
                                    <td>{subModule.submoduleName}</td>
                                    <td>{subModule.order}</td>
                                    <td>
                                        <Space size='small'>
                                            <ARMButton
                                                type="primary"
                                                size="small"
                                                style={{
                                                    backgroundColor: "#4aa0b5",
                                                    borderColor: "#4aa0b5",
                                                }}
                                                onClick={()=>handleBaseModalView(subModule.id)} 
                                            >
                                                <EyeOutlined />
                                            </ARMButton>
                                            {/*<Link*/}
                                            {/*    to={`/configurations/sub-module/${subModule.id}`}*/}
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
                                                handleOk={() => handleStatus(subModule.id)}
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
                            <ViewSubModule
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
export default SubModuleList