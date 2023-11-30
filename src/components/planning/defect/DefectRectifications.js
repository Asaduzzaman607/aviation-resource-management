import { Breadcrumb, Col, Form, Input, Pagination, Space } from "antd";
import { Link } from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import { Row } from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { EditOutlined, FilterOutlined, RollbackOutlined } from "@ant-design/icons";
import ARMTable from "../../common/ARMTable";
import { useDefect } from "../../../lib/hooks/planning/useDefect";
import ActiveInactive from "../../common/ActiveInactive";
import ViewButton from "../../common/buttons/ViewButton";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";

export default function DefectRectifications() {
  const { isActive, setIsActive, handleStatus, allDefectRect, currentPage, setCurrentPage, totalPages, form, onSearch } = useDefect();

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" /> &nbsp;Planning
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Defect &amp; Rectifications</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard title={getLinkAndTitle("Defect & Rectifications", "/planning/defect-rectifications/add", true)}>
        <Form form={form} name="filter-form" initialValues={{ pageNo: "" }} onFinish={onSearch}>
          <Row gutter={20}>
            <Col xs={24} md={8}>
              <Form.Item name="pageNo">
                <Input placeholder="Page No" />
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
        <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

        <Row className="table-responsive">
          <ARMTable>
            <thead>
              <tr>
                <th>Sequence No</th>
                <th>ATL Page No</th>
                <th>Defect Description</th>
                <th>Rectification Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allDefectRect?.map((data, index) => (
                <tr key={index}>
                  <td> {data.seqNo}</td>
                  <td> {data.amlPageNo}</td>
                  <td> {data.defectDescription}</td>
                  <td> {data.rectDescription}</td>
                  <td>
                    <Space size="small">
                      <Link to={`view/${data.id}`}>
                        <ViewButton />
                      </Link>
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

                      <ActiveInactiveButton isActive={isActive} handleOk={() => handleStatus(data.id, !data.isActive)} />
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
