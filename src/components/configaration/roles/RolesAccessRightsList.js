import { CopyOutlined, EditOutlined } from "@ant-design/icons";
import { Breadcrumb, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { notifyResponseError } from "../../../lib/common/notifications";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import RoleService from "../../../service/RoleService";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import Permission from "../../auth/Permission";

const RolesAccessRightsList = () => {
  const [roleData, setRoleData] = useState([]);
  const getAllRole = () => {
    RoleService.getAllRole(true)
      .then((response) => {
        setRoleData(response.data);
      })
      .catch((error) => {
        notifyResponseError(error);
      });
  };
  useEffect(()=>{
    getAllRole();
  },[])
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-chart-line" />
            <Link to="/planning">&nbsp; Planning</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Roles Access Rights</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="CONFIGURATION_ADMINISTRATION_ACCESS_RIGHTS_SEARCH">
      <ARMCard
        title="Roles Access Rights"
      >
        <Row className="table-responsive">
          <ARMTable>
            <thead>
              <tr>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {roleData?.map((role, index) => (
                <tr key={role.id}>
                  <td width="85%">{role.name}</td>
                  <td width="15%">
                    <Space size="small">
                      <Link to={`/configurations/roles/${role.id}/access-rights`}>
                        <ARMButton
                          size="small"
                          type="primary"
                          style={{
                            backgroundColor: "#6e757c",
                            borderColor: "#6e757c",
                          }}
                        >
                         Access Rights
                        </ARMButton>
                      </Link>
                      <Link
                        to={`/configurations/roles/duplicate/${role.id}/${role.name}`}
                      >
                      </Link>
                      
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </ARMTable>
        </Row>
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default RolesAccessRightsList;
