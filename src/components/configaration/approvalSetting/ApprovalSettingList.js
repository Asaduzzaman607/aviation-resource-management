import React, {useEffect, useState} from 'react';
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
import ApprovalSettingService from "../../../service/ApprovalSettingService";
import {usePaginate} from "../../../lib/hooks/paginations";
import Permission from "../../auth/Permission";
import ItemDemandService from "../../../service/ItemDemandService";
import {getErrorMessage} from "../../../lib/common/helpers";
import CountryService from "../../../service/CountryService";
import ApprovalSettingView from "./ApprovalSettingView";
import API from "../../../service/Api";
import {notifyError} from "../../../lib/common/notifications";

const {Option} = Select;
const ApprovalSettingList = () => {
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
  } = usePaginate('approvalSettingsList', '/approval-settings/search');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approval, setApproval] = useState({});

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleOpenModal = (approval) => async () => {
    const { subModuleItemId, workFlowActionId} = approval;

    try {
      const res = await API.post('approval-settings/selected', {
        subModuleItemId,
        workFlowActionId
      })

      setApproval({...res.data})
      setIsModalOpen(true);

    } catch (e) {
      notifyError("Something Went Wrong!");
    }
  }

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-cog"/>
            <Link to='/configurations'>
              &nbsp; Configurations
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            &nbsp;Approval Settings
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
    <Permission permission="CONFIGURATION_ADMINISTRATION_APPROVAL_SETTINGS_SEARCH">
        <ARMCard title={
            getLinkAndTitle(
              'Approval Setting List',
              '/configurations/approval-setting',
              true,
              'CONFIGURATION_ADMINISTRATION_APPROVAL_SETTINGS_SAVE'
            )
        }
        >

          <ApprovalSettingView
              approval={approval}
              handleCloseModal={handleCloseModal}
              isModalOpen={isModalOpen}
          />

        <Form form={form} onFinish={fetchData}>
          <Row gutter={20}>
            <Col xs={24} md={6}>
              <Form.Item name="workFlowActionName">
                <Input placeholder="-- Workflow Action --"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="subModuleItemName">
                <Input placeholder="-- Submodule Item --"/>
              </Form.Item>
            </Col>

            <Col xs={24} md={6} lg={5}>
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

        <ActiveInactive isActive={isActive} setIsActive={setIsActive}/>

        <ResponsiveTable>
          <ARMTable>
            <thead>
            <tr>
              <th>Sub Module Item</th>
              <th>Workflow Action</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>

            {
              collection?.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.subModuleItemName}</td>
                  <td>{item.workFlowActionName}</td>
                  <td>
                    <Space size='small'>
                      <ARMButton
                        type="primary"
                        size="small"
                        style={{
                          backgroundColor: "#4aa0b5",
                          borderColor: "#4aa0b5",
                        }}
                        onClick={handleOpenModal(item)}
                      >
                        <EyeOutlined/>
                      </ARMButton>
                      {
                        isActive && 
                        <Link
                        to={`/configurations/edit-approval-setting/${item.id}`}
                      >
                        <ARMButton type="primary" size="small" style={{
                          backgroundColor: '#6e757c',
                          borderColor: '#6e757c',

                        }}>
                          <EditOutlined/>
                        </ARMButton>
                      </Link>
                      }
                      <ActiveInactiveButton
                        isActive={isActive}
                        handleOk={async () => {
                          try {
                            await ApprovalSettingService.toggleStatus(
                              item.id,
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
            </Row>}
          </Col>
        </Row>
      </ARMCard>
    </Permission>
    </CommonLayout>
  );
};

export default ApprovalSettingList;