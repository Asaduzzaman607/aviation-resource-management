import React, { useEffect } from "react";
import { Col, Form, Input, Row, Select, Space, Breadcrumb, notification, Empty, Pagination } from "antd";
import {usePaginate} from "../../../../lib/hooks/paginations";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMForm from "../../../../lib/common/ARMForm";
import ARMButton from "../../../common/buttons/ARMButton";
import {FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import ActiveInactive from "../../../common/ActiveInactive";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import EditButton from "../../../common/buttons/EditButton";
import ActiveInactiveButton from "../../../common/buttons/ActiveInactiveButton";
import {getErrorMessage} from "../../../../lib/common/helpers";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import CommonLayout from "../../../layout/CommonLayout";
import ARMTable from "../../../common/ARMTable";
import TaskTypeServices from "../../../../service/TaskTypeServices";
import Permission from "../../../auth/Permission";


const TaskTypes = () => {
  const { form, collection, page, totalPages, totalElements, paginate, isActive, setIsActive, fetchData, refreshPagination, resetFilter, size } =
    usePaginate("task-type", "task-type/search");


  useEffect(() => {
    fetchData();
  }, []);

  const { t } = useTranslation()

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {" "}
            <Link to="/planning">
              {" "}
              <i className="fas fa-chart-line" /> &nbsp;{t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Task Types</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_SCHEDULE_TASKS_TASK_TYPE_SEARCH" showFallback>
      <ARMCard title={getLinkAndTitle('Task Type List', "/planning/task-type/add", true,"PLANNING_SCHEDULE_TASKS_TASK_TYPE_SAVE")}>
        <ARMForm initialValues={{ pageSize: 10 }} onFinish={fetchData} form={form}>
          <Row gutter={20}>
            <Col xs={24} md={12} lg={6}>
              <Form.Item label="Name" name="name">
                <Input placeholder="Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Form.Item name="size" label="Page Size" initialValue="10">
                <Select id="antSelect">
                  <Select.Option value="10">10</Select.Option>
                  <Select.Option value="20">20</Select.Option>
                  <Select.Option value="30">30</Select.Option>
                  <Select.Option value="40">40</Select.Option>
                  <Select.Option value="50">50</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={6}>
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
        </ARMForm>
        <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

        <Row className="table-responsive">
          <ResponsiveTable>
            <ARMTable>
              <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>{t("common.Actions")}</th>
              </tr>
              </thead>
              <tbody>
              {collection?.map((taskType, index) => (
                <tr key={index}>
                  <td>{taskType.name}</td>
                  <td> {taskType.description}</td>
                  <td>
                    <Space size="small">
                      {isActive ? <Link to={`edit/${taskType.id}`}>
                        <Permission permission="PLANNING_SCHEDULE_TASKS_TASK_TYPE_EDIT">
                          <EditButton/>
                        </Permission>
                      </Link> : null}
                      <Permission permission="PLANNING_SCHEDULE_TASKS_TASK_TYPE_DELETE">
                      <ActiveInactiveButton
                        isActive={isActive}
                        handleOk={async () => {
                          try {
                            await TaskTypeServices.toggleStatus(taskType.id, !taskType.isActive);
                            notification["success"]({ message: t("common.Status Changed Successfully") });
                            refreshPagination();
                          } catch (e) {
                            notification["error"]({ message: getErrorMessage(e) });
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
          </ResponsiveTable>
        </Row>

        {collection.length === 0 ? (
          <Row>
            <Col style={{ margin: "30px auto" }}>
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

export default TaskTypes;
