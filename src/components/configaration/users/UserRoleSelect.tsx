import {Form, Select} from "antd";

interface Role {
  id: number;
  name: string
}

interface Props {
  handleChange: () => void,
  roles: Role[]
}

const { Option } = Select;

export const SUPER_ADMIN_ROLE_ID = 1;

export default function UserRoleSelect(props: Props) {
  return (
    <Form.Item
      label="Role ID"
      name="roleId"
      rules={[
        {
          required: true,
          message: "Please select a Role",
        },
      ]}
    >
      <Select
        onChange={props.handleChange}
        placeholder="Select a Role Id"
        allowClear
      >
        {props.roles.filter(role => role.id !== SUPER_ADMIN_ROLE_ID).map((role) => (
          <Option key={role.id} value={role.id}>
            {role.name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  )
}