import React from 'react';
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMForm from "../../../../lib/common/ARMForm";
import ARMButton from "../../../common/buttons/ARMButton";
import {EyeOutlined, FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import ActiveInactive from "../../../common/ActiveInactive";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import ARMTable from "../../../common/ARMTable";
import EditButton from "../../../common/buttons/EditButton";
import ActiveInactiveButton from "../../../common/buttons/ActiveInactiveButton";
import {getErrorMessage} from "../../../../lib/common/helpers";
import {useTranslation} from "react-i18next";
import {usePaginate} from "../../../../lib/hooks/paginations";
import WorkPackageSummaryServices from "../../../../service/WorkPackageSummaryServices";
import {useAircraftsList} from "../../../../lib/hooks/planning/aircrafts";
import {useEffect} from "react";
import Permission from '../../../auth/Permission';
import {DateFormat} from "../Common";
import { HourFormat } from '../Common';

const WorkPackageSummaryList = () => {
  const { form, collection, page, totalElements, paginate, isActive, setIsActive, fetchData, refreshPagination, resetFilter, size } =
    usePaginate("workPackageSummary", "work-package/search");

  const {allAircrafts, getAllAircrafts} = useAircraftsList();

  useEffect(() => {
    (async () => {
      await getAllAircrafts();

    })();
  }, [getAllAircrafts])

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

          <Breadcrumb.Item>Work Package Summary</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_CHECK_WORK_PACKAGE_SUMMARY_SEARCH" showFallback>
      <ARMCard title={getLinkAndTitle('Work Package Summary', "/planning/work-package-summary/add",true,"PLANNING_CHECK_WORK_PACKAGE_SUMMARY_SAVE" )}>
        <ARMForm initialValues={{aircraftId : null, pageSize: 10,packageType : 0 }} onFinish={fetchData} form={form}>
          <Row gutter={20}>
            <Col xs={24} md={12} lg={6}>
              <Form.Item

                name="aircraftId"
                label="Aircraft"
                rules={[
                  {
                    required: false,
                    message: "Aircraft is required",
                  }
                ]}

              >
                <Select  placeholder={t("planning.Task Done.Select Aircraft")} allowClear

                >
                  {allAircrafts?.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.aircraftId}>
                        {item.aircraftName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                hidden
                name="packageType"
                label='Package Type'
                rules={[
                  {
                    required: false,
                    message: "Package Type is required ",
                  },
                ]}
              >
                <Input defaultValue={0}/>
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
                <th>Input Date</th>
                <th>Release Date</th>
                <th>AC Hours</th>
                <th>AC Cycle</th>
                <th>{t("common.Actions")}</th>
              </tr>
              </thead>
              <tbody>
              {collection?.filter(({packageType})=> packageType === 'WORK_PACKAGE_SUMMARY')?.map((workPackage, index) => (
                <tr key={index}>
                  <td>{DateFormat(workPackage?.inputDate)}</td>
                  <td> {DateFormat(workPackage?.releaseDate)}</td>
                  <td> {HourFormat(workPackage?.acHours)}</td>
                  <td> {workPackage?.acCycle}</td>
                  <td>
                    <Space size="small">
                      <Link to={`view/${workPackage?.workPackageId}`}>
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
                      </Link>
                      {isActive? <Link to={`edit/${workPackage?.workPackageId}`}>
                        <Permission permission="PLANNING_CHECK_WORK_PACKAGE_SUMMARY_EDIT">
                          <EditButton/>
                        </Permission>
                      </Link> : null}
                      <Permission permission="PLANNING_CHECK_WORK_PACKAGE_SUMMARY_DELETE">
                        <ActiveInactiveButton
                          isActive={isActive}
                          handleOk={async () => {
                            try {
                              await WorkPackageSummaryServices.toggleStatus(workPackage?.workPackageId, !workPackage.isActive);
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

export default WorkPackageSummaryList;
