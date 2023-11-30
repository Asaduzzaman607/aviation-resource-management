import { SolutionOutlined } from "@ant-design/icons";
import { Breadcrumb, Col, DatePicker, Form, Input, Row, Space } from "antd";
import React from "react";
import { Link, useParams } from "react-router-dom";
import ARMForm from "../../../lib/common/ARMForm";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { formLayout } from "../../../lib/constants/layout";
import Permission from "../../auth/Permission";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import { useGrn } from "../hooks/grn";

const PAGE_TITLE = "Grn";

const Grn = () => {
  const { form, onFinish, id, onReset } = useGrn();

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/storeInspector">
              {" "}
              <SolutionOutlined /> &nbsp;Store Inspector
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/storeInspector/grn-list"> Grn List</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{!id ? "Add" : "Edit"}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission={[
          "STORE_INSPECTOR_STORE_INSPECTOR_STORE_INSPECTION_GRN_SAVE",
          "STORE_INSPECTOR_STORE_INSPECTOR_STORE_INSPECTION_GRN_EDIT",
        ]}
      >
        <ARMCard
          title={getLinkAndTitle(
            PAGE_TITLE,
            "/storeInspector/grn-list/",
            false,
          )}
        >
          <ARMForm
            {...formLayout}
            form={form}
            name="acCheckDone"
            onFinish={onFinish}
            initialValues={{
              grnNo: null,
              createdDate: null,
            }}
            scrollToFirstError
          >
            <Row>
              <Col sm={20} md={10}>
                <Form.Item
                  name="grnNo"
                  label="Grn No"
                  rules={[
                    {
                      required: false,
                      message: "Grn No is required",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} min={0} maxLength={9} />
                </Form.Item>

                <Form.Item
                  name="createdDate"
                  label="Created Date"
                  rules={[
                    {
                      required: true,
                      message: "Created date is required",
                    },
                  ]}
                >
                  <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col sm={20} md={10}>
                <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
                  <Space>
                    <ARMButton size="medium" type="primary" htmlType="submit">
                      {id ? "Update" : "Submit"}
                    </ARMButton>
                    <ARMButton
                      onClick={onReset}
                      size="medium"
                      type="primary"
                      danger
                    >
                      Reset
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

export default Grn;
