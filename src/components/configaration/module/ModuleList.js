import CommonLayout from "../../layout/CommonLayout";
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space} from "antd";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import ARMTable from "../../common/ARMTable";
import {Link} from "react-router-dom";
import ModuleService from "../../../service/ModuleService";
import {getErrorMessage} from "../../../lib/common/helpers";
import React from "react";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ActiveInactive from "../../common/ActiveInactive";
import {useState} from "react";
import {
    EditOutlined,
    EyeOutlined,
    FilterOutlined,
    RollbackOutlined,
} from "@ant-design/icons";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {usePaginate} from "../../../lib/hooks/paginations";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import Permission from "../../auth/Permission";
import { notifyError } from "../../../lib/common/notifications";
import ViewModel from "./ViewModel";

const {Option} = Select;

const ModuleList = () => {

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
    } = usePaginate('modules', '/module/search');

    console.log("module list",collection)

    const handleStatus =  async (id) => {
        try {
            await ModuleService.toggleStatus(
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
          const {data} = await ModuleService.getModuleById(id);
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
                            Modules
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

              <Permission permission="CONFIGURATION_ADMINISTRATION_MODULE_SEARCH">
                <ARMCard title={
                    getLinkAndTitle(
                      'MODULE LIST',
                      '/configurations/module','blank',
                      'CONFIGURATION_ADMINISTRATION_MODULE_SAVE'
                    )
                  }
                >
                    <Form form={form} onFinish={fetchData}>
                        <Row gutter={20}>
                            <Col xs={24} md={12} lg={8}>
                                <Form.Item label="Module" name="query">
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
                                            htmlType="button"
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
                               {/* <th>Image Name</th>*/}
                                <th>Ordering</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                collection?.map((module, index) => (
                                    <tr key={module.id}>
                                        <td>{module.moduleName}</td>
                                        {/*<td>{module.image}</td>*/}
                                        <td>{module.order}</td>
                                        <td>
                                          <Space size='small'>
                                            <ARMButton
                                                type="primary"
                                                size="small"
                                                style={{
                                                    backgroundColor: "#4aa0b5",
                                                    borderColor: "#4aa0b5",
                                                }}
                                                onClick={()=>handleBaseModalView(module.id)}   
                                            >
                                                <EyeOutlined />
                                            </ARMButton>
                                            {/*<Link*/}
                                            {/*        to={`/configurations/module/${module.id}`}*/}
                                            {/*    >*/}
                                            {/*    <ARMButton type="primary" size="small" style={{*/}
                                            {/*        backgroundColor: '#6e757c',*/}
                                            {/*        borderColor: '#6e757c',*/}

                                            {/*    }}>*/}
                                            {/*    <EditOutlined />*/}
                                            {/*    </ARMButton>*/}
                                            {/*</Link>*/}
                                              <ActiveInactiveButton
                                                  isActive={isActive}
                                                  handleOk={() => handleStatus(module.id)}
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

                                <ViewModel
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
export default ModuleList