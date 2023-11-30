import React from "react";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import { Breadcrumb, Col, Form, Row, Select, Space, Transfer } from "antd";
import { Link } from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import { getLinkAndTitle } from "../../../../lib/common/TitleOrLink";
import ARMButton from "../../../common/buttons/ARMButton";
import ARMForm from "../../../../lib/common/ARMForm";
import { formLayout } from "../../../../lib/constants/layout";
import { useAircraftTasks } from "../../../../lib/hooks/planning/useAircraftTasks";
import { useTranslation } from "react-i18next";
import Permission from "../../../auth/Permission";

const AircraftTasks = () => {
  const { form, onFinish, allAircrafts, getTaskByAircraftId, taskDataSource, targetKeys, selectedKeys, onChange, onSelectChange, onScroll, onReset } =
    useAircraftTasks();

  const { t } = useTranslation()

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" />
              &nbsp; {t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("planning.Aircrafts Tasks.Aircrafts Tasks")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["PLANNING_SCHEDULE_TASKS_AIRCRAFT_TASK_SAVE","PLANNING_SCHEDULE_TASKS_AIRCRAFT_TASK_EDIT"]} showFallback>
      <ARMCard title={getLinkAndTitle(t("planning.Aircrafts Tasks.Aircrafts Tasks"), "/planning")}>
        <ARMForm {...formLayout} form={form} name="aircraftTasks" onFinish={onFinish} scrollToFirstError>
          <Row>
            <Col sm={20} md={10}>
              <Form.Item
                name="aircraft"
                label={t("planning.Aircrafts.Aircraft")}
                rules={[
                  {
                    required: true,
                    message: t("planning.Aircrafts Tasks.Please select an Aircraft"),
                  },
                ]}
              >
                <Select placeholder={t("planning.Aircrafts.Select Aircraft")} allowClear onChange={(e) => getTaskByAircraftId(e)}>
                  {allAircrafts?.map((item) => {
                    return (
                      <Select.Option key={item.aircraftId} value={item.aircraftId}>
                        {item.aircraftName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Form.Item label={t("planning.Aircrafts Tasks.Effectivity Type")} name="effectiveAircraftDtoList">
                <Transfer
                  style={{
                    width: 1200,
                  }}
                  listStyle={{
                    width: 1200,
                  }}
                  className={"transferAircraft"}
                  dataSource={taskDataSource}
                  titles={[t("planning.Task Records.APPLICABLE"), t("planning.Task Records.NOT APPLICABLE")]}
                  targetKeys={targetKeys}
                  selectedKeys={selectedKeys}
                  onChange={onChange}
                  onSelectChange={onSelectChange}
                  onScroll={onScroll}
                  render={(item) => (
                    <Space align="center">
                      <h4>{item.title}</h4>
                      {item.input}
                    </Space>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={20} md={10}>
              <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
                <Space>
                  <ARMButton size="medium" type="primary" htmlType="submit">
                    {t("common.Submit")}
                  </ARMButton>
                  <ARMButton onClick={onReset} size="medium" type="primary" danger>
                    {t("common.Reset")}
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </ARMForm>
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default AircraftTasks;
