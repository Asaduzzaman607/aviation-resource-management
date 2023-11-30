import {Col, Form, Input, Row, Empty, Space, Breadcrumb, Popconfirm, Pagination, Select} from "antd";
import { Link } from "react-router-dom";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import ARMCard from "../../common/ARMCard";
import ResponsiveTable from "../../common/ResposnsiveTable";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import ActiveInactive from "../../common/ActiveInactive";
import { EditOutlined, FilterOutlined, LockOutlined, RollbackOutlined, UnlockOutlined } from "@ant-design/icons";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import React from "react"
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import Permission from "../../auth/Permission";
import {usePaginate} from "../../../lib/hooks/paginations";
import {Status} from "../../../lib/constants/status-button";
import {notifyError, notifyResponseError, notifySuccess} from "../../../lib/common/notifications";
import {getErrorMessage} from "../../../lib/common/helpers";
import UsersService from "../../../service/UsersService";
import {useEffect, useState} from "react";
import RoleService from "../../../service/RoleService";

const { Option } = Select;


export default function Users() {
  const [roles,setRoles]=useState([]);
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
    size,
  } = usePaginate('user', '/user/search');
  console.log("user",collection)
  const handleStatus =  async (id) => {
    try {
      await UsersService.toggleStatus(
          id,
          isActive !== Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE
      );
      notifySuccess('Status Changed Successfully!')
      const values = form.getFieldsValue()
      refreshPagination()
    } catch (er) {
      notifyError(getErrorMessage(er))
    }
  }
  const getAllRoles = async () =>{
    try{
      const {data} = await RoleService.getAllRole();
      setRoles(data);
    }catch(er){
      notifyResponseError(er);
    }

  }
  useEffect(() => {
    getAllRoles().catch(console.error)
  }, []);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/configurations">
              <i className="fas fa-cog" /> &nbsp;Configurations
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Users</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="CONFIGURATION_ADMINISTRATION_USERS_SEARCH">
      <ARMCard title={getLinkAndTitle(
        "Users List",
        "/configurations/users/add",
        true,
        'CONFIGURATION_ADMINISTRATION_USERS_SAVE'
      )}>
        <Form
          name="basic"
          form={form}
          wrapperCol={{
            span: 24,
          }}
          onFinish={ (values) =>  fetchData({...values}) }
          autoComplete="off"
        >
          <Row gutter={[20, 0]}>
            <Col xs={24} lg={8} md={8}>
              <Form.Item label="" name="name">
                <Input placeholder="Enter Name" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8} md={8}>
              <Form.Item label="" name="roleId">
               <Select
               placeholder="Select Role"
               >
               {roles?.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
               </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={8} md={8}>
              <Form.Item
                wrapperCol={{
                  span: 12,
                }}
              >
                <Space>
                  <ARMButton type="primary" htmlType="submit">
                    <FilterOutlined />
                    Filter
                  </ARMButton>
                  <ARMButton  size="middle"
                              type="primary"
                              onClick={() => {
                                form.resetFields();
                                fetchData()
                              }}
                  >
                    <RollbackOutlined />
                    Reset
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
                <th>Name</th>
                <th>Login</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {collection?.map((user, index) => (
                <tr key={user.id}>
                  <td>
                    {user.name}
                  </td>
                  <td>{user.login}</td>
                  <td>{user.roleName}</td>
                  <td>
                    <Space size="small">
                      <Link to={`edit/${user.id}`}>
                        <ARMButton
                          type="primary"
                          size="small"
                          style={{
                            backgroundColor: "#6e757c",
                            borderColor: "#6e757c",
                          }}
                        >
                          <EditOutlined />
                        </ARMButton>
                      </Link>
                      <ActiveInactiveButton
                          isActive={isActive}
                          handleOk={() => handleStatus(user.id, !isActive)}
                      />
                    </Space>
                  </td>
                </tr>
              ))}
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
            </Row> }
          </Col>
        </Row>
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
