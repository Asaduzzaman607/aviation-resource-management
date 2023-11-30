import {Breadcrumb, Col, Form,notification, Pagination, Select, Space} from "antd";
import {Link} from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import {Row} from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import {EditOutlined, FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import ARMTable from "../../common/ARMTable";
import ActiveInactive from "../../common/ActiveInactive";
import ViewButton from "../../common/buttons/ViewButton";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import {usePaginate} from "../../../lib/hooks/paginations";
import {getErrorMessage} from "../../../lib/common/helpers";
import React from "react";
import NonRoutineCardServices from "../../../service/NonRoutineCardServices";
import {useTranslation} from "react-i18next";
import {useAircraftsList} from "../../../lib/hooks/planning/aircrafts";
import {useEffect} from "react";
import Permission from "../../auth/Permission";
import { DateFormat } from "../report/Common";

export default function NonRoutineCardList() {
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
    size
  } =
    usePaginate("non-routine-card", "non-routine-card/search");

  const {allAircrafts, getAllAircrafts} = useAircraftsList()

  useEffect(() => {
    (async () => {
      await getAllAircrafts();
    })();
  }, [])

  const {t} = useTranslation()

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line"/> &nbsp;Planning
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Non Routine Card</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_NON_ROUTINE_CARD_SEARCH" showFallback >
      <ARMCard title={getLinkAndTitle("NON ROUTINE CARD LIST", "/planning/non-routine-card/add", true,"PLANNING_AIRCRAFT_TECHNICAL_LOG_NON_ROUTINE_CARD_SAVE")}>
        <Form form={form} name="filter-form" initialValues={{aircraftId: ""}} onFinish={fetchData}>
          <Row gutter={20}>
            <Col xs={24} md={8}>
              <Form.Item
                name="aircraftId"
                label={t("planning.Aircrafts.Aircraft")}
                rules={[
                  {
                    required: false,
                    message: "Please select Aircraft ",
                  },
                ]}
              >
                <Select placeholder={t("planning.Aircrafts.Select Aircraft")} allowClear>
                  {allAircrafts?.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.aircraftId}>
                        {item.aircraftName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item>
                <Space>
                  <ARMButton size="middle" type="primary" htmlType="submit">
                    <FilterOutlined name="filter"/> Filter
                  </ARMButton>
                  <ARMButton
                    size="middle"
                    type="primary"
                    onClick={() => {
                      form.resetFields();
                    }}
                  >
                    <RollbackOutlined name="reset"/> Reset
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
              <th>NRC No</th>
              <th>Reference</th>
              <th>Issue Date</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {collection?.map((data, index) => (
              <tr key={index}>
                <td> {data.nrcNo}</td>
                <td> {data.reference}</td>
                <td> {DateFormat(data.issueDate)}</td>
                <td>
                  <Space size="small">
                    <Link to={`view/${data.nonRoutineCardId}`}>
                      <ViewButton/>
                    </Link>
                    {isActive? <Link to={`edit/${data.nonRoutineCardId}`}>
                      <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_NON_ROUTINE_CARD_EDIT">
                        <ARMButton
                            type="primary"
                            size="small"
                            style={{
                              backgroundColor: "#6e757c",
                              borderColor: "#6e757c",
                            }}
                        >
                          <EditOutlined/>
                        </ARMButton>
                      </Permission>
                    </Link> : null}
                    <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_NON_ROUTINE_CARD_DELETE" >
                    <ActiveInactiveButton
                      isActive={isActive}
                      handleOk={async () => {
                        try {
                          await NonRoutineCardServices.toggleStatus(data.nonRoutineCardId, !data.isActive);
                          notification["success"]({message: t("common.Status Changed Successfully")});
                          refreshPagination();
                        } catch (e) {
                          notification["error"]({message: getErrorMessage(e)});
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
        <Row justify="center">
          <Col style={{marginTop: 10}}>
            <Pagination showSizeChanger={false}
                        onShowSizeChange={console.log}
                        pageSize={size}
                        current={page}
                        onChange={paginate}
                        total={totalElements}/>
          </Col>
        </Row>
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
