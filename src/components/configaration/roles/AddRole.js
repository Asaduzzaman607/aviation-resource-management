import React, { useEffect, useState } from "react";
import CommonLayout from "../../layout/CommonLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import { Space, Row, Col, Form, Input, notification, Breadcrumb } from "antd";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { getErrorMessage } from "../../../lib/common/helpers";
import RoleService from "../../../service/RoleService";
import ARMButton from "../../common/buttons/ARMButton";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMForm from "../../../lib/common/ARMForm";
import { notifyError, notifyResponseError, notifySuccess } from "../../../lib/common/notifications";
import Permission from "../../auth/Permission";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
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

const constantMessage={
  success:{
    save:"Role successfully created",
    update:"Role successfully updated",
    duplicate:"Role successfully duplicated"
  }
}

const AddRole = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  let { name } = useParams();
  const [form] = Form.useForm();
  const [roleData, setRoleData] = useState([]);
  const [singleData, setSingleData] = useState();

  const getAllRole = () => {
    RoleService.getAllRole()
      .then((response) => {
        setRoleData(response.data);
      })
      .catch((error) => {
        console.log("something went wrong", error);
      });
  };

  const updateRole = async (values) => {
    try {
      const single = {
        id: id.toString(),
        name: values.name,
      };
      const { data } = await RoleService.updateRole(id, single);
      navigate("/configurations/roles");
      form.setFieldsValue({ name: "" });
      //getAllRole();
      notifySuccess(constantMessage.success.update)
    } catch (er) {
      notifyResponseError(er)
    }
  }

  const duplicateRole = async (values) => {
    try {
      const { data } = await RoleService.duplicateRole(id, values.name);
      //getAllRole();
      navigate("/configurations/roles");
      notifySuccess(constantMessage.success.duplicate)
    } catch (er) {
      notifyResponseError(er)
    }
    form.setFieldsValue({ name: "" });
  }

  const saveRole = async (values) => {
    try {
      await RoleService.SaveRole(values);
      navigate("/configurations/roles");
      //getAllRole();
      notifySuccess(constantMessage.success.save)
    } catch (er) {
      notifyResponseError(er)
    }
    form.setFieldsValue({ name: "" });
  }

  const onFinish = async (values) => {

    if (!id) {
      await saveRole(values);
      return;
    }

    if (name) {
      await duplicateRole(values);
      return;
    }

    await updateRole(values);
  };

  const loadSingleData = async (id) => {
    try {
      const { data } = await RoleService.singleData(id);
      if (id && name) {
        form.setFieldsValue({ id, name: `${data.name}-copy` });
        return;
      }
      
      form.setFieldsValue({ id, name: data.name });
      setSingleData({ id, name: data.name });
    } catch (er) {
      console.log(er);
    }
  };

  const onReset = async () => {
    if (id || name) {
      const { data } = await RoleService.singleData(id);
      form.resetFields();
      form.setFieldsValue({ ...data });
      return;
    } 
    
    form.resetFields();
  };

  useEffect(() => {
    getAllRole();
  }, []);

  useEffect(() => {
    if (!id) return;
    loadSingleData(id);
  }, [id]);
  return (
    <div>
      <CommonLayout>
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <i className="fas fa-cog" />
              <Link to="/configurations">&nbsp; Configurations</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <Link to="/configurations/roles">Roles </Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item> {id ? "edit" : "add"}</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>
       <Permission permission={["CONFIGURATION_ADMINISTRATION_ROLES_SAVE","CONFIGURATION_ADMINISTRATION_ROLES_EDIT"]}>
        <ARMCard title={getLinkAndTitle(`Role`, `/configurations/roles`)}>
          <Row>
            <Col span={10}>
              <ARMForm
                {...layout}
                form={form}
                name="nest-messages"
                onFinish={onFinish}
                validateMessages={validateMessages}
              >
                <Form.Item
                  name={["name"]}
                  label="Name"
                  rules={[
                    {
                      required: true,
                    },
                    {
                      max:100, message: 'Name maximum 100 characters.'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                  <ARMButton type="primary" htmlType="submit">
                    {name && id ? "Duplicate" : id ? "Update" : "Submit"}
                  </ARMButton>{" "}
                  <ARMButton
                    onClick={onReset}
                    type="primary"
                    danger
                  >
                    Reset
                  </ARMButton>
                </Form.Item>
              </ARMForm>
            </Col>
          </Row>
        </ARMCard>
       </Permission>
      </CommonLayout>
    </div>
  );
};

export default AddRole;
