import React,{useState,useEffect} from 'react';
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Form, Input, notification, Popconfirm, Row, Select, Space} from "antd";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMButton from "../../common/buttons/ARMButton";
import {useSelector} from "react-redux";
import {
    EditOutlined,
    EyeOutlined,
    FilterOutlined,
    LockOutlined,
    RollbackOutlined,
    UnlockOutlined
} from "@ant-design/icons";
import ActiveInactive from "../../common/ActiveInactive";
import {Link} from "react-router-dom";
import ARMTable from "../../common/ARMTable";
import CountryService from "../../../service/CountryService";
import {getErrorMessage} from "../../../lib/common/helpers";
import WorkshopService from "../../../service/WorkshopService";


const WorkshopList = () => {
    const racks = useSelector((state) => state.racks.model);
    const { Option } = Select;
    const [isActive, setIsActive] = useState(true);
    const [workshopList, setWorkshoplists] = useState([]);



    const getWorkshop = async () => {
        try {
            let {data} = await WorkshopService.getAllWorkshop(isActive)
            console.log(data)
            setWorkshoplists(data.model)
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }
    const handleStatus = async (id,status) => {
        try {
            const {data} = await WorkshopService.toggleStatus(id,status);
            await getWorkshop();
            notification["success"]({
                message: "Status changed successfully!",
            });
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }

    useEffect(() => {
        getWorkshop().catch(console.error)
    }, [])
    useEffect(() => {
        getWorkshop().catch(console.error)
    }, [isActive])


    return (
        <div>
            <CommonLayout>
                <ARMBreadCrumbs>
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item>
                            {" "}
                            <Link to="/store">
                                {" "}
                                <i className="fas fa-archive" /> &nbsp;Store
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item> &nbsp;Workshop</Breadcrumb.Item>
                    </Breadcrumb>
                </ARMBreadCrumbs>
                <ARMCard
                    title={getLinkAndTitle("Workshop LIST", "/store/workshop/add", "addBtn")}
                >
                    <Form initialValues={{ pageSize: 10 }}>
                        <Row gutter={20}>
                            <Col xs={24} md={6}>
                                <Form.Item>
                                    <Input placeholder="Enter Search Text" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                                <Form.Item
                                    name="pageSize"
                                    label="Page Size"
                                    rules={[
                                        {
                                            message: "Field should not be empty",
                                        },
                                    ]}
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
                                            <FilterOutlined /> Filter
                                        </ARMButton>
                                        <ARMButton size="middle" type="primary" htmlType="submit">
                                            <RollbackOutlined /> Reset
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
                                <th>Code</th>
                                <th>City</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {workshopList.map((workshop, index) => (
                                <tr key={index}>
                                    <td>{workshop.code}</td>
                                    <td>{workshop.cityName}</td>
                                    <td>{workshop.address}</td>
                                    <td>
                                        <Space size="small">
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
                                            <ARMButton
                                                type="primary"
                                                size="small"
                                                style={{
                                                    backgroundColor: "#6e757c",
                                                    borderColor: "#6e757c",
                                                }}
                                            >
                                                <Link to={`/store/workshop/add/${workshop.id}`}>
                                                    <EditOutlined />
                                                </Link>
                                            </ARMButton>

                                            <Popconfirm
                                                title="Are you Sure?" okText="Yes" cancelText="No"
                                                onConfirm={() => handleStatus(workshop.id, !isActive)}
                                            >
                                                {
                                                    isActive ?
                                                        <ARMButton type="primary" size="small"  style={{
                                                            backgroundColor: "#53a351",
                                                            borderColor: "#53a351",
                                                        }}>
                                                            <LockOutlined/>
                                                        </ARMButton>
                                                        :
                                                        <ARMButton type="primary" size="small" danger>
                                                            <UnlockOutlined/>
                                                        </ARMButton>

                                                }

                                            </Popconfirm>
                                        </Space>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </ARMTable>
                    </Row>
                </ARMCard>
            </CommonLayout>
        </div>
    );
};
export default WorkshopList;