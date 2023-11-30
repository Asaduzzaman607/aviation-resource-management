import {Breadcrumb, Col, Form, Input, Row, Select} from "antd";
import {Link, useNavigate} from "react-router-dom";
import React from "react";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import {LinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import {formLayout} from "../../../lib/constants/form"
import ARMTable from "../../common/ARMTable";
import useCheckIndexAdd from "./useCheckIndexAdd";
import Permission from "../../auth/Permission";


type Task = {
  taskId: number,
  taskNo: string,
  taskCardRef: string
}

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

type TITLE = "Check Index Update" | "Check Index Add";

export default function CheckIndexAdd() {
  const { id, form, checks, aircraftModels, onFinish, onReset } = useCheckIndexAdd();
  const title: TITLE = id ? "Check Index Update" : "Check Index Add";

  return (
    <div>
      <CommonLayout>
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <i className="fas fa-chart-line"/>
              <Link to="/planning">&nbsp; Planning</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <Link to="/planning/ac-checks">Check Indexes </Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item> {id ? "Edit" : "Add"}</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>

        <Permission permission={["PLANNING_CHECK_AC_CHECK_INDEX_SAVE","PLANNING_CHECK_AC_CHECK_INDEX_EDIT"]} showFallback>
        <ARMCard title={<LinkAndTitle title={title} link="/planning/ac-checks"/>}>
          <ARMForm
            initialValues={{
              aircraftModelId: null,
              checkId: null,
              tasks: [],
            }}
            {...formLayout}
            form={form}
            name="checkIndex"
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[12, 12]}>
              <Col span={12}>

                <Form.Item
                  name="aircraftModelId"
                  label="A/C Type"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <Select
                    allowClear
                    placeholder="A/C Type"
                  >
                    {
                      aircraftModels.map(({id, name}) => <Select.Option value={id} key={id}>{name}</Select.Option>)
                    }
                  </Select>
                </Form.Item>

                <Form.Item
                  name="checkId"
                  label="Check"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <Select
                    placeholder="Check"
                    allowClear
                  >
                    {
                      checks.map(({label, value}) =>
                        <Select.Option value={value} key={value}>{label}</Select.Option>
                      )
                    }
                  </Select>
                </Form.Item>


                <Form.Item wrapperCol={{...formLayout.wrapperCol, offset: 8}}>
                  <ARMButton type="primary" htmlType="submit">
                    {id ? "Update" : "Submit"}
                  </ARMButton>{" "}
                  <ARMButton onClick={onReset} type="primary" danger>
                    Reset
                  </ARMButton>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.List name="tasks">
                  {
                    (fields, {add, remove, move}) => (
                      <>

                        <ARMTable>
                          <thead>
                          <tr>
                            <th>Task No</th>
                            <th>Ref</th>
                          </tr>
                          </thead>

                          <tbody>

                          {
                            fields.map(({key, ...rest}) => (
                              <tr key={key}>

                                <td>
                                  <Form.Item
                                    style={{marginLeft: "1em"}}
                                    {...rest}
                                    name={[key, 'taskNo']}
                                  >
                                    <Input placeholder="Task No" readOnly/>
                                  </Form.Item>
                                </td>

                                <td>
                                  <Form.Item
                                    style={{marginLeft: "1em"}}
                                    {...rest}
                                    name={[key, 'taskCardRef']}
                                  >
                                    <Input placeholder="Task Card Ref"/>
                                  </Form.Item>
                                </td>


                              </tr>
                            ))
                          }

                          </tbody>
                        </ARMTable>


                      </>
                    )
                  }
                </Form.List>
              </Col>
            </Row>
          </ARMForm>
        </ARMCard>
        </Permission>
      </CommonLayout>
    </div>
  );
}