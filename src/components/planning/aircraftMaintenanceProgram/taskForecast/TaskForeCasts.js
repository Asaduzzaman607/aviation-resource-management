import React from 'react';
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMButton from "../../../common/buttons/ARMButton";
import {
  EditOutlined, EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import ActiveInactive from "../../../common/ActiveInactive";
import ARMTable from "../../../common/ARMTable";
import {getErrorMessage} from "../../../../lib/common/helpers";
import ARMForm from "../../../../lib/common/ARMForm";
import {usePaginate} from "../../../../lib/hooks/paginations";
import ActiveInactiveButton from "../../../common/buttons/ActiveInactiveButton";
import { useTranslation } from 'react-i18next';
import TaskForecastServices from "../../../../service/TaskForecastServices";
import {dateFormat} from "../../report/AirframeAndApplianceADStatus";
import Permission from '../../../auth/Permission';



const TaskForeCasts = () => {


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
  } = usePaginate('taskForecast', 'forecast-task/search')



  const { t } = useTranslation();

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item> <Link to='/planning'> <i className="fas fa-chart-line"/> &nbsp;{t("planning.Planning")}
          </Link></Breadcrumb.Item>

          <Breadcrumb.Item>
            {t("planning.Task Forecasts.Task Forecasts")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_SCHEDULE_TASKS_TASK_FORECASTS_SEARCH" showFallback>
      <ARMCard
        title={
          getLinkAndTitle(t("planning.Task Forecasts.Task Forecast List"), '/planning/task-forecasts/add', true,"PLANNING_SCHEDULE_TASKS_TASK_FORECASTS_SAVE")
        }
      >
        <ARMForm
          onFinish={fetchData} form={form}
        >
          <Row gutter={20}>

            <Col xs={24} md={12} lg={6}>
              <Form.Item label="Forecast" name="name">
                <Input placeholder="Enter Forecast Name"/>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <Form.Item name="size"
                         label="Page Size"
                         initialValue="10">
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
                    <FilterOutlined/> {t("common.Filter")}
                  </ARMButton>
                  <ARMButton
                    size="middle"
                    type="primary"
                    htmlType="submit"
                    onClick={resetFilter}
                  >
                    <RollbackOutlined/> {t("common.Reset")}
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </ARMForm>

        <ActiveInactive isActive={isActive} setIsActive={setIsActive}/>

        <Row className='table-responsive'>
          <ARMTable>
            <thead>
            <tr>
              <th>Forecast</th>
              <th>Creation Date</th>
              <th>{t("common.Actions")}</th>
            </tr>
            </thead>
            <tbody>
            {
              collection?.map((task, index) => (

                <tr key={index}>
                  <td>{task.name}</td>
                  <td>{dateFormat(task.creationDate)}</td>
                  <td>
                    <Space size='small'>
                      <Link to={`view/${task.forecastId}`}>
                        <ARMButton type="primary" size="small" style={{
                          backgroundColor: '#4aa0b5',
                          borderColor: '#4aa0b5',

                        }}>
                          <EyeOutlined/>
                        </ARMButton>
                      </Link>
                      <Permission permission="PLANNING_SCHEDULE_TASKS_TASK_FORECASTS_EDIT">
                        {isActive? <Link to={`edit/${task.forecastId}`}>
                          <ARMButton type="primary" size="small" style={{
                            backgroundColor: '#6e757c',
                            borderColor: '#6e757c',

                          }}>
                            <EditOutlined/>

                          </ARMButton>
                        </Link> : null}
                      </Permission>
                      <Permission permission="PLANNING_SCHEDULE_TASKS_TASK_FORECASTS_DELETE">
                        <ActiveInactiveButton
                          isActive={isActive}
                          handleOk={async () => {
                            try {
                              await TaskForecastServices.toggleStatus(task.forecastId, !task.isActive);
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
              ))


            }
            </tbody>
          </ARMTable>
        </Row>
        <Row justify="center">
          <Col style={{marginTop: 10}}>
            <Pagination showSizeChanger={false} onShowSizeChange={console.log} pageSize={size} current={page}
                        onChange={paginate}
                        total={totalElements}/>
          </Col>
        </Row>

        <Row>
          <Col style={{margin: '0 auto'}}>
            {collection?.length === 0 ? (
              <Row justify="end">
                <tbody>
                <Empty style={{marginTop: "10px"}}/>
                </tbody>
              </Row>
            ) : null}
          </Col>
        </Row>

      </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default TaskForeCasts;
