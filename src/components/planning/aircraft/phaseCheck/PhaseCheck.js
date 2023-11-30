import { EditOutlined } from "@ant-design/icons";
import { Breadcrumb, Col, Form, notification, Pagination, Row, Select, Space } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../../../lib/common/helpers";
import { getLinkAndTitle } from "../../../../lib/common/TitleOrLink";
import { refreshPagination } from "../../../../lib/hooks/paginations";
import { usePhaseCheck } from "../../../../lib/hooks/planning/usePhaseCheck";
import PhaseCheckService from "../../../../service/planning/PhaseCheckService";
import ActiveInactive from "../../../common/ActiveInactive";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import ARMTable from "../../../common/ARMTable";
import ActiveInactiveButton from "../../../common/buttons/ActiveInactiveButton";
import ARMButton from "../../../common/buttons/ARMButton";
import CommonLayout from "../../../layout/CommonLayout";
const { Option } = Select;

export default function PhaseCheck() {
  const { isActive, setIsActive, aircrafts, currentPage, totalPages, setCurrentPage, filterAircrafts, phaseCheck, handleStatus } = usePhaseCheck();
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" /> &nbsp;Planning
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>A Phase Check</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard title={getLinkAndTitle("A Phase Check", "/planning/phase-check/add", true)}>
        <Row>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item label="Aircraft name">
              <Select defaultValue="--select--" onChange={(aircraftId) => filterAircrafts(aircraftId, isActive)} style={{ width: "100%" }}>
                {aircrafts?.map((aircraft, index) => (
                  <Option key={index} value={aircraft.id}>
                    {aircraft.aircraftName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

        <Row className="table-responsive">
          <ARMTable>
            <thead>
              <tr>
                <th>Aircraft Name</th>
                <th>Date</th>
                <th>Flight Hour</th>
                <th>Flight CYcle</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {phaseCheck?.map((data, index) => (
                <tr key={index}>
                  <td>{data.aircraftName}</td>
                  <td> {data.doneDate}</td>
                  <td> {data.doneFlightHour}</td>
                  <td> {data.doneFlightCycle}</td>
                  <td>
                    <Space size="small">
                      <Link to={`view/${data.id}`}></Link>
                      <Link to={`edit/${data.id}`}>
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

                      <ActiveInactiveButton isActive={isActive} handleOk={() => handleStatus(data.id, !isActive)} />
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </ARMTable>
        </Row>
        <Row justify="center">
          <Col style={{ marginTop: 10 }}>
            <Pagination defaultCurrent={currentPage} onChange={setCurrentPage} total={totalPages * 10} />
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
}
