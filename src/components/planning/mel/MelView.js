import { Breadcrumb, Col, DatePicker, Form, Pagination, Popconfirm, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import { Row } from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import { EditOutlined, FilterOutlined, LockOutlined, RollbackOutlined, UnlockOutlined } from "@ant-design/icons";
import ARMTable from "../../common/ARMTable";
import ActiveInactive from "../../common/ActiveInactive";
import { useMel } from "../../../lib/hooks/planning/useMel";
const { Title } = Typography;

export default function MELView() {
  const { currentPage, setCurrentPage, totalPages, form, onMelSearch, melReport } = useMel();
  console.log("mel report", melReport);
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" /> &nbsp;Planning
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Mel View</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard title="MEL View">
        <Form form={form} name="filter-form" initialValues={{ fromDate: "", toDate: "" }} onFinish={onMelSearch}>
          <Row gutter={20}>
            <Col xs={24} md={4}>
              <Form.Item
                name="fromDate"
                rules={[
                  {
                    required: true,
                    message: "From date is required",
                  },
                ]}
              >
                <DatePicker placeholder="From Date" style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item
                name="toDate"
                rules={[
                  {
                    required: true,
                    message: "To date is required",
                  },
                ]}
              >
                <DatePicker placeholder="To Date" style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item>
                <Space>
                  <ARMButton size="middle" type="primary" htmlType="submit">
                    <FilterOutlined name="filter" /> Filter
                  </ARMButton>
                  <ARMButton
                    size="middle"
                    type="primary"
                    onClick={() => {
                      form.resetFields();
                    }}
                  >
                    <RollbackOutlined name="reset" /> Reset
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row style={{ textAlign: "center" }}>
          <Col md={12}>
            <Title level={5}>REGN: {melReport[0]?.aircraftName}</Title>
            <Title level={5}>MSN: {melReport[0]?.aircraftRgNo}</Title>
          </Col>
          <Col md={12}>
            <Title level={5}>AC TYPE: {melReport[0]?.acType}</Title>
          </Col>
        </Row>
        <Row className="table-responsive">
          <ARMTable>
            <thead>
              <tr>
                <th rowSpan={2}>SL NO.</th>
                <th rowSpan={2}>DATE</th>
                <th rowSpan={2}>STN</th>
                <th rowSpan={2}>
                  REF
                  <br />
                  (ATL&amp;NRC)
                </th>
                <th rowSpan={2}>ATA</th>
                <th rowSpan={2}>DEFECT</th>
                <th rowSpan={2}>INTERMEDIATE ACTION</th>
                <th rowSpan={2}>
                  MEL
                  <br />
                  CAT
                </th>
                <th rowSpan={2}>
                  MEL DUE <br /> DATE
                </th>
                <th rowSpan={2}>
                  MEL <br /> CLEARED
                </th>
                <th rowSpan={2}>
                  REF(W.O, ATL <br /> &amp; NRC)
                </th>
                <th rowSpan={2}>CORRECTIVE ATL</th>
                <th rowSpan={2}>POSN</th>
                <th colSpan={2}>REMOVAL</th>
                <th colSpan={2}>INSTALLED</th>
                <th rowSpan={2}>GRN</th>
                <th rowSpan={2}>STATUS</th>
              </tr>
              <tr>
                <th>P/N</th>
                <th>S/N</th>
                <th>P/N</th>
                <th>S/N</th>
              </tr>
            </thead>
            <tbody>
              {melReport.map((mel, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{mel.melDate}</td>
                  <td>{mel.stationName}</td>
                  <td>ATL: {mel.itAmlPageNo}</td>
                  <td>{mel.itAta}</td>
                  <td>{mel.itDefectDescription}</td>
                  <td>{mel.intermediateAction}</td>
                  <td>{mel.melCategory === 1 ? "A" : mel.melCategory === 2 ? "B" : mel.melCategory === 3 ? "C" : "D"}</td>
                  <td>{mel.dueDate}</td>
                  <td>{mel.clearedDate}</td>
                  <td>ATL: {mel.ctAmlPageNo}</td>
                  <td>{mel.ctAction}</td>
                  <td>{mel.ctPosition}</td>
                  <td>{mel.ctRectPnOff}</td>
                  <td>{mel.ctRectSnOff}</td>
                  <td>{mel.ctRectPnOn}</td>
                  <td>{mel.ctRectSnOn}</td>
                  <td>{mel.ctRectGrn}</td>
                  {mel.status === 1 ? <td style={{ color: "red" }}>Open</td> : <td style={{ color: "#04aa6d" }}>Close</td>}
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
