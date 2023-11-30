import React, {useEffect,useState} from 'react';
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMButton from "../../common/buttons/ARMButton";
import {EditOutlined, EyeOutlined, FilterOutlined, RollbackOutlined,} from "@ant-design/icons";
import ActiveInactive from "../../common/ActiveInactive";
import ARMTable from "../../common/ARMTable";
import CommonLayout from "../../layout/CommonLayout";
import {getErrorMessage} from "../../../lib/common/helpers";
import {usePaginate} from "../../../lib/hooks/paginations";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import externalDepartmentService from "../../../service/ExternalDepartmentService";
import Permission from "../../auth/Permission";
import ViewCompanyList from './ViewCompanyList';
import { notifyError } from '../../../lib/common/notifications';

const ExternalDepartmentList = () => {
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
    } = usePaginate('externalDept', 'config/external/departments/search')



    useEffect(() => {
        refreshPagination()
        fetchData()
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
  const [base,setBase] = useState([]); 
  const handleBaseModalView = async (id) => {
    try{
        setIsModalOpen(true)
        const {data} = await externalDepartmentService.singleExternal(id);
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
                        {" "}
                        <Link to="/configurations">
                            {" "}
                            <i className="fas fa-cog"/> &nbsp; Configurations
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item> &nbsp;Contracted Operator</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="CONFIGURATION_CONFIGURATION_EXTERNAL_COMPANY_SEARCH">
            <ARMCard
                title={getLinkAndTitle(
                  "Contracted  Operator List",
                  "/configurations/operator/add",
                  true,
                  'CONFIGURATION_CONFIGURATION_EXTERNAL_COMPANY_SAVE'
                )}
            >
                <Form form={form} onFinish={fetchData}>
                    <Row gutter={20}>
                        <Col xs={24} md={6}>
                            <Form.Item name="query" label="Search Name">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item
                                name="size"
                                label="Page Size"
                                rules={[
                                    {
                                        message: "Field should not be empty",
                                    },
                                ]}
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
                                        <FilterOutlined/> Filter
                                    </ARMButton>
                                    <ARMButton size="middle" type="primary" htmlType="submit" onClick={resetFilter}>
                                        <RollbackOutlined/> Reset
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
                            <th>Name</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>Office Phone</th>
                            <th>Contact Details</th>
                            <th>Website</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {collection.map((model, index) => (
                            <tr key={index}>
                                <td>{model.name}</td>
                                <td>{model.address}</td>
                                <td>{model.cityName}</td>
                                <td>{model.officePhone}</td>
                                <td>{model.contactPerson}</td>
                                <td>{model.website}</td>

                                <td>
                                    <Space size="small">
                                        <ARMButton
                                            type="primary"
                                            size="small"
                                            style={{
                                                backgroundColor: "#4aa0b5",
                                                borderColor: "#4aa0b5",
                                            }}
                                            onClick={()=>handleBaseModalView(model.id)} 
                                        >
                                            <EyeOutlined/>
                                        </ARMButton>
                                        <ARMButton
                                            type="primary"
                                            size="small"
                                            style={{
                                                backgroundColor: "#6e757c",
                                                borderColor: "#6e757c",
                                            }}
                                        >
                                            <Link to={`/configurations/operator/edit/${model.id}`}>
                                                <EditOutlined/>
                                            </Link>
                                        </ARMButton>

                                        <ActiveInactiveButton
                                            isActive={isActive}
                                            handleOk={async () => {
                                                try {
                                                    await externalDepartmentService.toggleStatus(model.id, !isActive);
                                                    notification['success']({message: "Status Changed Successfully!"});
                                                    refreshPagination();
                                                } catch (e) {
                                                    notification['error']({message: getErrorMessage(e)});
                                                }
                                            }}
                                        />
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
                        <ViewCompanyList
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            base={base}
                        />
                    </Row>
                )}
            </ARMCard>
            </Permission>
        </CommonLayout>
    );
};

export default ExternalDepartmentList;