import {
  Breadcrumb,
  Col,
  Empty,
  Form,
  Input,
  notification,
  Pagination,
  Popconfirm,
  Select,
  Space,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import { Row } from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import {
  EditOutlined,
  FilterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import ActiveInactive from "../../common/ActiveInactive";
import ARMTable from "../../common/ARMTable";
import { useLocations } from "../../../lib/hooks/planning/useLocations";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import React, {useEffect, useRef, useState} from "react";
import { getLinkAndTitleWithFileUpload } from "../../../lib/common/LinkWithUploadFile";
import LocationsService from "../../../service/planning/configurations/LocationsService";
import {
  arrayToCsv,
  downloadBlob,
  getErrorMessage,
} from "../../../lib/common/helpers";
import { LocationListHeader } from "./LocationListHeader";
import { notifyError, notifySuccess } from "../../../lib/common/notifications";
import { useTranslation } from "react-i18next";
import { Option } from "antd/lib/mentions";
import { usePaginate } from "../../../lib/hooks/paginations";
import Permission from "../../auth/Permission";
import {useDownloadExcel} from "react-export-table-to-excel";
import {utils, write} from "xlsx";
import {saveAs} from "file-saver";

export default function Locations() {
  const { t } = useTranslation();
  const constantMessage = {
    message: {
      success: t("planning.Locations.Aircraft location successfully created"),
      error: t("planning.Locations.Aircraft location file uploaded failed"),
    },
  };
  const {
    form,
    collection,
    page,
    totalPages,
    totalElements,
    paginate,
    isActive,
    setIsActive,
    fetchData,
    refreshPagination,
    resetFilter,
    size,
  } = usePaginate("Locations", "aircraft-location/search");

  const navigate = useNavigate();
  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);


  const handleStatus = async (id, isActive) => {
    try {
      const { data } = await LocationsService.toggleStatus(id, isActive);
      refreshPagination();
      notification["success"]({
        message: "Status changed successfully!",
      });
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const handleFileUpload = async () => {
    try {
      setIsUploading(true);
      const { data } = await LocationsService.saveFile(file);
      notifySuccess(constantMessage.message.success);
      refreshPagination();
    } catch (er) {
      notifyError(constantMessage.message.error);
      let temp = [];
      let errorLog = er.response.data.errorMessages;

      if (Array.isArray(errorLog)) {
        temp = errorLog.map((log) => [log]);
      }

      if (temp.length) {
        const csv = arrayToCsv([
          ["Something went wrong please check the below list"],
          ...temp,
        ]);
        downloadBlob(csv, "location-error-log.csv", "text/csv;charset=utf-8;");
      }
    } finally {
      setIsUploading(false);
      setFile(false);
      //getAllLocation();
      refreshPagination();
    }
  };





  const downLoadLocationFormat = async () => {

    let table = [
      {
        A: "Location",
        B: "Description",
        C: "Remarks",

      }
    ];

    const wb = utils.book_new();
    const sheet = utils.json_to_sheet(table, {
      skipHeader: true,
    });

    utils.book_append_sheet(wb, sheet);

    const columnStyles = [
      { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 1
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 3

    ];

    const workbook = {
      SheetNames: ['Location'],
      Sheets: {
        Location: Object.assign({}, sheet, { '!cols': columnStyles }),
      },
    };

    const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
    saveAs(
        new Blob([fileBuffer], { type: 'application/octet-stream' }),
        'Location Excel Format.xlsx'
    );

  }

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" /> &nbsp;{t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("planning.Locations.Locations")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_AIRCRAFT_AIRCRAFT_LOCATION_SEARCH" showFallback>
      <ARMCard
        title={
          <LocationListHeader
            handleFileChange={(file) => {
              setFile(file.file.originFileObj);
            }}
            handleFileUpload={handleFileUpload}
            showUploadButton={!!file}
            isUploading={isUploading}
            url={`/planning/locations/add`}
            title={t("planning.Locations.Location List")}
            permission="PLANNING_AIRCRAFT_AIRCRAFT_LOCATION_SAVE"
            downLoadLocationFormat={downLoadLocationFormat}
          />
        }
      >
       
          <Form form={form} onFinish={fetchData}>
            <Row gutter={20}>
              <Col xs={24} md={6}>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      max: 255,
                      message: t("common.Maximum 255 characters allowed"),
                    },
                    {
                      whitespace: true,
                      message: t("common.Only space is not allowed"),
                    },
                  ]}
                >
                  <Input placeholder="Search Name" />
                </Form.Item>
              </Col>

              <Col xs={24} md={4}>
                <Form.Item
                  name="size"
                  label={t("common.Page Size")}
                  initialValue="10"
                >
                  <Select id="antSelect">
                    <Option value="10">10</Option>
                    <Option value="20">20</Option>
                    <Option value="30">30</Option>
                    <Option value="40">40</Option>
                    <Option value="50">50</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item>
                  <Space>
                    <ARMButton size="middle" type="primary" htmlType="submit">
                      <FilterOutlined /> {t("common.Filter")}
                    </ARMButton>
                    <ARMButton size="middle" type="primary" htmlType="reset" onClick={resetFilter}>
                      <RollbackOutlined  />{" "}
                      {t("common.Reset")}
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
                  <th>{t("planning.Locations.Name")}</th>
                  <th>{t("planning.Locations.Description")}</th>
                  <th>{t("planning.Locations.Remarks")}</th>
                  <th>{t("common.Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {collection?.map((data, index) => (
                  <tr key={data.id}>
                    <td>{data.name}</td>
                    <td> {data.description}</td>
                    <td> {data.remarks}</td>
                    <td>
                      <Space size="small">
                       {
                         isActive?
                         <Permission permission="PLANNING_AIRCRAFT_AIRCRAFT_LOCATION_EDIT">
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
                       </Permission>
                       :null
                       }
                        <Permission permission="PLANNING_AIRCRAFT_AIRCRAFT_LOCATION_DELETE">
                          <ActiveInactiveButton
                            isActive={isActive}
                            handleOk={() => handleStatus(data.id, !data.isActive)}
                          />
                        </Permission>
                      </Space>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ARMTable>
          </Row>


          {collection.length === 0 ? (
            <Row>
              <Col style={{ margin: "30px auto" }}>
                <Empty />
              </Col>
            </Row>
          ) : (
            <Row justify="center">
              <Col style={{ marginTop: 10 }}>
                <Pagination
                  showSizeChanger={false}
                  onShowSizeChange={console.log}
                  pageSize={size}
                  current={page}
                  onChange={paginate}
                  total={totalElements}
                />
              </Col>
            </Row>
          )}
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
