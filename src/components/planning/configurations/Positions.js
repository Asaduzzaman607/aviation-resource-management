import { Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space } from "antd";
import { Link } from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import ARMButton from "../../common/buttons/ARMButton";
import { EditOutlined, FilterOutlined, RollbackOutlined } from "@ant-design/icons";
import ActiveInactive from "../../common/ActiveInactive";
import ARMTable from "../../common/ARMTable";
import { usePositions } from "../../../lib/hooks/planning/usePositions";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import React, {useCallback, useEffect, useRef, useState} from "react";
import { PositionListHeader } from "./PositionListHeader";
import {
  arrayToCsv,
  downloadBlob,
  getErrorMessage,
} from "../../../lib/common/helpers";
import PositionsService from "../../../service/planning/configurations/PositionsService";
import {
  notifyError,
  notifySuccess,
} from "../../../lib/common/notifications";
import { useTranslation } from "react-i18next";
import { usePaginate } from "../../../lib/hooks/paginations";
import { Option } from "antd/lib/mentions";
import Permission from "../../auth/Permission";
import {useDownloadExcel} from "react-export-table-to-excel";
import {utils, write} from "xlsx";
import {saveAs} from "file-saver";


export default function Positions() {

  const { t } = useTranslation()
  const constantMessage = {
    success: t("planning.Positions.Position successfully created"),
    error: t("planning.Positions.Position file uploaded failed"),
  };

  const {
    initAllPositions,
  } = usePositions();

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
  } = usePaginate("Positions", "position/search");

  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [isExport] = useState(1);

  const handleStatus = async (id, isActive) => {
    try {
      const { data } = await PositionsService.toggleStatus(id, isActive);
      refreshPagination();
      notification["success"]({
        message: "Status changed successfully!",
      });
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };


  useEffect(() => {
    (async () => {
      await initAllPositions();
    })();
  }, [initAllPositions])

  const handleFileUpload = useCallback(async () => {
    try {
      setIsUploading(true);
      const { data } = await PositionsService.uploadFile(file);
      notifySuccess(constantMessage.success);
      refreshPagination();
    } catch (er) {
      notifyError(constantMessage.error);

      let temp = [];
      let errorLog = er.response.data.errorMessages;

      if (Array.isArray(errorLog)) {
        temp = errorLog.map((log) => [log]);
      }

      if (temp.length) {
        const csv = arrayToCsv([
          ["Something went wrong please check the below list :"],
          ...temp,
        ]);
        console.log({ temp });
        downloadBlob(csv, "position-error-log.csv", "text/csv;charset=utf-8;");
      }
      setFile(null);
    } finally {
      setIsUploading(false);
      setFile(false);
      refreshPagination();
    }
  }, [file]);



  const downLoadPositionFormat = async () => {

    let table = [
      {
        A: "Name",
        B: "Description",
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
    ];

    const workbook = {
      SheetNames: ['Position'],
      Sheets: {
        Position: Object.assign({}, sheet, { '!cols': columnStyles }),
      },
    };

    const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
    saveAs(
        new Blob([fileBuffer], { type: 'application/octet-stream' }),
        'Position Excel Format.xlsx'
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

          <Breadcrumb.Item>{t("planning.Positions.Positions")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission  permission="PLANNING_AIRCRAFT_POSITION_SEARCH" showFallback>
      <ARMCard
        title={
          <PositionListHeader
            handleFileChange={(file) => {
              setFile(file.file.originFileObj);
            }}
            handleFileUpload={handleFileUpload}
            showUploadButton={!!file}
            isUploading={isUploading}
            permission="PLANNING_AIRCRAFT_POSITION_SAVE"
            isExport={isExport}
            downLoadPositionFormat={downLoadPositionFormat}
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
                <th>{t("planning.Positions.Name")}</th>
                <th>{t("planning.Positions.Description")}</th>
                <th>{t("common.Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {collection?.map((data, index) => (
                <tr key={index}>
                  <td>{data.name}</td>
                  <td> {data.description}</td>
                  <td>
                    <Space size="small">
                     {
                       isActive?
                       <Link to={`edit/${data.positionId}`}>
                       <Permission permission="PLANNING_AIRCRAFT_POSITION_EDIT">
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
                       </Permission>
                     </Link>
                     :null
                     }

                      <Permission permission="PLANNING_AIRCRAFT_POSITION_DELETE">
                        <ActiveInactiveButton
                          isActive={isActive}
                          handleOk={() =>
                            handleStatus(data.positionId, !isActive)
                          }
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
