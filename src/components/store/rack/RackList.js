import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Col, Empty,
  Form,
  Input,
  notification, Pagination,
  Row,
  Select,
  Space,
} from "antd";
import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import {getErrorMessage} from "../../../lib/common/helpers";
import {usePaginate} from "../../../lib/hooks/paginations";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import rackService from "../../../service/RackService";
import {useTranslation} from "react-i18next";
import Permission from "../../auth/Permission";

const RackList = () => {
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
  } = usePaginate('rackall', 'store-management/racks/search')
console.log("sdadasdas",collection)

  useEffect(() => {
    refreshPagination()
    fetchData()
  }, []);

  const { t } = useTranslation();
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {" "}
            <Link to="/store">
              {" "}
              <i className="fas fa-archive" /> &nbsp;{t("store.Store")}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item> &nbsp;{t("store.Racks.Racks")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="STORE_STORE_CONFIGURATION_RACK_SEARCH" showFallback>
      <ARMCard
        title={getLinkAndTitle(
          t("store.Racks.Rack List"),
          "/store/rack/add",
          true,
          'STORE_STORE_CONFIGURATION_RACK_SAVE'
        )}

      >
        <Form form={form} onFinish={fetchData}>
          <Row gutter={20}>
            <Col xs={24} md={6}>
              <Form.Item  name="query" 
              label="Rack">
                <Input placeholder="Search Rack" />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item
                name='size'
                label={t("common.Page Size")}
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
                    <FilterOutlined /> {t("common.Filter")}
                  </ARMButton>
                  <ARMButton size="middle" type="primary" htmlType="submit" onClick={resetFilter}>
                    <RollbackOutlined /> {t("common.Reset")}
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
                <th>{t("store.Racks.Code")}</th>
                <th>{t("store.Racks.Store")}</th>
                <th>{t("store.Racks.Room")}</th>
                <th>{t("store.Racks.Height")}</th>
                <th>{t("store.Racks.Width")}</th>
                <th>{t("common.Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {collection?.map((model, index) => (
                <tr key={index}>
                  <td>{model.rackCode}</td>
                  <td>{model.officeCode}</td>
                  <td>{model.roomCode}</td>
                  <td>{model.rackHeight}</td>
                  <td>{model.rackWidth}</td>
                  <td>
                    <Space size="small">
                      {/*<ARMButton*/}
                      {/*  type="primary"*/}
                      {/*  size="small"*/}
                      {/*  style={{*/}
                      {/*    backgroundColor: "#4aa0b5",*/}
                      {/*    borderColor: "#4aa0b5",*/}
                      {/*  }}*/}
                      {/*>*/}
                      {/*  <EyeOutlined />*/}
                      {/*</ARMButton>*/}
                      <Permission permission='STORE_STORE_CONFIGURATION_RACK_SAVE'>
                      <ARMButton
                        type="primary"
                        size="small"
                        style={{
                          backgroundColor: "#6e757c",
                          borderColor: "#6e757c",
                        }}
                      >
                        <Link to={`/store/rack/edit/${model.rackId}`} >
                          <EditOutlined />
                        </Link>
                      </ARMButton>
                      </Permission>
                      <Permission permission='STORE_STORE_CONFIGURATION_RACK_DELETE'>
                      <ActiveInactiveButton
                          isActive={isActive}
                          handleOk={async () => {
                            try {
                              await rackService.toggleStatus(model.rackId, !isActive);


                              notification['success']({message: t("common.Status Changed Successfully")});
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
              ))}
            </tbody>
          </ARMTable>
        </Row>
        {collection?.length === 0 ? (
            <Row>
              <Col style={{ margin: '30px auto' }}>
                <Empty />
              </Col>
            </Row>
        ) : (
            <Row justify="center">
              <Col style={{ marginTop: 10 }}>
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
        )}
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default RackList;
