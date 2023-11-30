import React from 'react';
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMButton from "../../common/buttons/ARMButton";
import {EditOutlined, EyeOutlined, FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import ActiveInactive from "../../common/ActiveInactive";
import ARMTable from "../../common/ARMTable";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import roomService from "../../../service/RoomService";
import {getErrorMessage} from "../../../lib/common/helpers";
import {usePaginate} from "../../../lib/hooks/paginations";

const QuoteCollectionList = () => {
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
  } = usePaginate('', '')
  return (
    <div>
      <CommonLayout>
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <i className="fas fa-shopping-basket"/>
              <Link to='/procurment'>
                &nbsp; Procurement
              </Link>
            </Breadcrumb.Item>


            <Breadcrumb.Item>Quote Collection</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>
        <ARMCard title={getLinkAndTitle("Quote Collection LIST", "/procurment/quote-collection/add", "addBtn")}>
          <Form form={form} onFinish={fetchData}>
            <Row gutter={20}>
              <Col xs={24} md={6}>
                <Form.Item name="query">
                  <Input placeholder="Enter Search Text"/>
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  name="size"
                  label="Page Size"
                  initialValue="10"
                >
                  <Select id="antSelect">
                    <Option value="3">3</Option>
                    <Option value="5">5</Option>
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
            <ARMTable
            >
              <thead>
              <tr>
                <th>Part No</th>
                <th>Alt Part No</th>
                <th>Description</th>
                <th>Unit</th>
                <th>Unit Price</th>
                <th>Condition</th>
                <th>Lead Time</th>
                <th>Min Order Qty</th>
                <th>Tag Info</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>

              {collection.map((model, index) => (
                <tr key={index}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
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
                        <Link to={`/store/room/edit/${model.roomId}`}>
                          <EditOutlined/>
                        </Link>
                      </ARMButton>

                      <ActiveInactiveButton
                        isActive={isActive}
                        handleOk={async () => {
                          // try {
                          //   await roomService.toggleStatus(model.roomId, !isActive);
                          //
                          //
                          //   notification['success']({message: "Status Changed Successfully!"});
                          //   refreshPagination();
                          // } catch (e) {
                          //   notification['error']({message: getErrorMessage(e)});
                          // }
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
            </Row>
          )}
        </ARMCard>
      </CommonLayout>
    </div>
  );
};

export default QuoteCollectionList;