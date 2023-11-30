import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  RollbackOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  notification,
  Empty,
} from "antd";
import { Option } from "antd/lib/mentions";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../../lib/common/helpers";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import CabinService from "../../../service/CabinService";
import Permission from "../../auth/Permission";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";

const CabinList = () => {
  const handleDelete = (id) => {};
  const [isActive, setIsActive] = useState(true);
  const [cabin, setCabin] = useState([]);
  const [active, setActive] = useState(true);
  const { t } = useTranslation()

  const allInactiveCabin = async () => {
    if (isActive === false) {
      const { data } = await CabinService.getAllCabin();
      let temp = [];
      data.map((item, index) => {
        if (item.activeStatus ===false) {
          temp.push(item);
        }
      });
      setCabin(temp);
    } else {
      console.log("error");
    }
  };

  const getAllCabin = async () => {
    try {
      if (isActive === true) {
        const { data } = await CabinService.getAllCabin();
        let temp = [];
        data.map((item, index) => {
          if (item.activeStatus === true) {
            temp.push(item);
          }
        });
        setCabin(temp);
      } else {
        console.log("error");
      }
    } catch (er) {}
  };
  const handleStatus = async (id,status) => {
    const { data } = await CabinService.singleData(id);
    if (data.activeStatus =!status) {
      try {
        const single = {
          cabinId: id,
          activeStatus: false,
        };
        const { data } = await CabinService.changeStatus(single);
        getAllCabin();
        notification["success"]({
          message: t("common.Status Changed Successfully"),
        });
      } catch (er) {
        notification["error"]({ message: getErrorMessage(er) });
      }
    } else {
      try {
        const single = {
          cabinId: id,
          activeStatus: true,
        };
        const { data } = await CabinService.changeStatus(single);
        allInactiveCabin();
        notification["success"]({
          message: t("common.Status Changed Successfully"),
        });
      } catch (er) {
        notification["error"]({ message: getErrorMessage(er) });
      }
    }
  };
  useEffect(() => {
    if (isActive == false) {
      allInactiveCabin();
    }
  },[isActive == false]);

  useEffect(() => {
    getAllCabin();
  }, [isActive == true]);
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-chart-line" />
            <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t("planning.Cabins.Cabins")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_CONFIGURATIONS_CABIN_SEAT_TYPE_SEARCH" showFallback>
      <ARMCard title={getLinkAndTitle(t("planning.Cabins.Cabin List"), "/planning/cabin/add", true,"PLANNING_CONFIGURATIONS_CABIN_SEAT_TYPE_SAVE")}>
        <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

        <Row className="table-responsive">
          <ARMTable>
            <thead>
              <tr>
                <th>{t("planning.Cabins.Cabin")}</th>
                <th>{t("common.Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {cabin?.map((cabin, index) => (
                <tr key={index}>
                  <td>{cabin.codeTitle}</td>

                  <td>
                    <Space size="small">
                      {isActive ? <Link to={`/planning/cabin/edit/${cabin.cabinId}`}>
                        <Permission permission="PLANNING_CONFIGURATIONS_CABIN_SEAT_TYPE_EDIT">
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
                      <Permission permission="PLANNING_CONFIGURATIONS_CABIN_SEAT_TYPE_DELETE">
                        <ActiveInactiveButton
                          isActive={isActive}
                          handleOk={() => handleStatus(cabin.cabinId, !cabin.activeStatus)}
                        />
                      </Permission>
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </ARMTable>
        </Row>
        {cabin?.length === 0 ? (
          <Row>
            <Col style={{ margin: "30px auto" }}>
              <Empty />
            </Col>
          </Row>
        ) : null}
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default CabinList;
