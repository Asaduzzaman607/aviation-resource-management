import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Button, Col, Form, Row, Tree} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import { SelectInput } from "./RolesAccessRights";
import {useRoles} from "../../../lib/hooks/roles";
import useFeatureRole from "./useFeatureRole";
import {complement, propEq} from "ramda";
import {SUPER_ADMIN_ROLE_ID} from "../users/UserRoleSelect";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";

const layoutConfig = {
  labelSpan: {span: 4},
  wrapperSpan: {span: 16}
}

export const AccessRightTreeWrapper = styled.div`
  .ant-tree-node-selected {
    background-color: rgba(29, 194, 35, 0.73) !important;
  }

  .ant-tree-checkbox-checked {
    background-color: rgba(29, 194, 35, 0.73) !important;
  }

  .ant-tree-node-content-wrapper {
    width: 100% !important;
  }
`;

export default function FeatureRole() {
  const { roleId, setRoleId, treeConfig, roles, loading, handleSubmit } = useFeatureRole();


  return <CommonLayout>
    <ARMBreadCrumbs>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>
          <i className="fas fa-cog"/>
          <Link to="/configurations">&nbsp; Configurations</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Role Feature Rights</Breadcrumb.Item>
      </Breadcrumb>
    </ARMBreadCrumbs>

    <ARMCard title={
      getLinkAndTitle ("Role Feature Rights" , 
      "/configurations",
      )
    } >
      <Row>

        <Col span={14} offset={5}>
          <Form.Item label="Role" labelCol={layoutConfig.labelSpan} wrapperCol={layoutConfig.wrapperSpan}>
            <SelectInput
              placeholder="Select A Role"
              onChange={setRoleId}
              options={roles.filter(complement(propEq('id', SUPER_ADMIN_ROLE_ID)))}
            />
          </Form.Item>

        </Col>

        <Col span={10} offset={7}>
          <AccessRightTreeWrapper>
            <Tree
              {...treeConfig}
            />
          </AccessRightTreeWrapper>

          <Button
            onClick={handleSubmit}
            loading={loading}
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: "#04AA6D",
              borderColor: "#04AA6D",
              borderRadius: "5px",
              marginTop: "1em"
            }}
          >
            <span>Save Feature Rights</span>
          </Button>
        </Col>

      </Row>
    </ARMCard>
  </CommonLayout>
}