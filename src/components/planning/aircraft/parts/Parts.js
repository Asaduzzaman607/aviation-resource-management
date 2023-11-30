import React, {useState, useEffect, useRef} from "react";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import { write, utils } from "xlsx";
import { saveAs } from "file-saver";
import {
  Breadcrumb,
  Col,
  Empty,
  Form,
  Input,
  notification,
  Pagination,
  Row,
  Select,
  Space,
} from "antd";
import { Link } from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import ARMButton from "../../../common/buttons/ARMButton";
import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import ActiveInactive from "../../../common/ActiveInactive";
import ARMTable from "../../../common/ARMTable";

import PartsServices from "../../../../service/PartsServices";
import {
  arrayToCsv,
  downloadBlob,
  getErrorMessage,
} from "../../../../lib/common/helpers";
import ARMForm from "../../../../lib/common/ARMForm";
import { usePaginate } from "../../../../lib/hooks/paginations";
import ActiveInactiveButton from "../../../common/buttons/ActiveInactiveButton";
import { FileUploadListHeader } from "../../../../lib/common/FileUploadListHeader";
import AircraftModelFamilyService from "../../../../service/AircraftModelFamilyService";
import { isNull } from "lodash";
import { notifyWarning } from "../../../../lib/common/notifications";
import { useTranslation } from "react-i18next";
import Permission from "../../../auth/Permission";
import {useDownloadExcel} from "react-export-table-to-excel";
import API from "../../../../service/Api";
import {EXPENDABLE} from "../../../store/StoreParts/constants";

const Parts = () => {
  const [models, setModels] = useState([]);
  const [aircraftModelList, setAircraftModelList] = useState([]);
  const [isExport] = useState(1);

  const { t } = useTranslation();
  const getAllModel = () => {
    PartsServices.getAllModels(true)
      .then((response) => {
        setModels(response.data.model);
      })
      .catch((error) => {
        console.log("something went wrong", error);
      });
  };

  const getAllAircraftModelFamily = async () => {
    try {
      const { data } =
        await AircraftModelFamilyService.getAllAircraftModelFamily();
      setAircraftModelList(data.model);
    } catch (er) {}
  };

  useEffect(() => {
    getAllModel();
    fetchData();
  }, []);

  useEffect(() => {
    (async () => {
      await getAllAircraftModelFamily();
    })();
  }, []);

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
  } = usePaginate("parts", "part/search");

  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [aircraftModelId, setAircraftModelId] = useState(isNull);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleFileUpload = async () => {
    try {
      setIsUploading(true);

      const data = await PartsServices.saveFile(file, aircraftModelId);
      refreshPagination();
      notification["success"]({
        message: "Parts successfully created",
      });
    } catch (er) {
      notification["error"]({
        message: "Parts file uploaded failed!",
      });
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
        downloadBlob(csv, "parts-file-error.csv", "text/csv;charset=utf-8;");
      }
    } finally {
      setIsUploading(false);
      setFile(false);
    }
  };



  const handlePartsExcelFormat = async () => {

    let table = [
      {
        A: "Model",
        B: "Part Number",
        C: "Description",
        D: "Count Factor",
        E: "Classification",
        F: "Unit of Measure",
        G: "Alternate Parts",
        H: "Life Limit Unit",
        I: "Life Limit",
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
      { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
      { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 1
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
    ];

    const workbook = {
      SheetNames: ['Part'],
      Sheets: {
        Part: Object.assign({}, sheet, { '!cols': columnStyles }),
      },
    };

    const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
    saveAs(
        new Blob([fileBuffer], { type: 'application/octet-stream' }),
        'Part Excel Format.xlsx'
    );

  }


  const exportToXLSX = async () => {
    const response = await API.get('part/list');
    const data = response.data;


    const modifiedData = data?.map((item) => {
      return {
        'Model':item.modelName,
        'Part No':item.partNo,
        'Description':item.description,
        'Classification':item.classification===1 ? 'ROTABLE' : item.classification===2? 'CONSUMABLE' : 'EXPENDABLE',
        'Unit Of Measure':item.unitOfMeasureCode,
      };
    });
    const worksheet = utils.json_to_sheet(modifiedData);

    const columnStyles = [
      { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 1
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
      { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
      { width: 50, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 1
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
    ];

    const workbook = {
      SheetNames: ['Part'],
      Sheets: {
        Part: Object.assign({}, worksheet, { '!cols': columnStyles }),
      },
    };

    const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
    saveAs(
        new Blob([fileBuffer], { type: 'application/octet-stream' }),
        'Part List.xlsx'
    );
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {" "}
            <Link to="/planning">
              {" "}
              <i className="fas fa-chart-line" /> &nbsp;{t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("planning.Parts.Parts")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_AIRCRAFT_PARTS_SEARCH" showFallback>
      <ARMCard
        title={
          <FileUploadListHeader
            handleFileChange={(file) => {
              setFile(file.file.originFileObj);
            }}
            handleAircraftModel={(id) => {
              setAircraftModelId(id);
              setIsDisabled(false);
            }}
            handleFileUpload={handleFileUpload}
            showUploadButton={!!file}
            isUploading={isUploading}
            url={`/planning/parts/add`}
            title={t("planning.Parts.Part List")}
            isTrue={true}
            isDisabled={isDisabled}
            aircraftModelList={aircraftModelList}
            WarningNotification={() => {
              if (isDisabled === true) {
                notifyWarning(t("planning.A/C Type.Please Select A/C Type"));
              }
            }}
            partExcel={'partExcel'}
            exportExcelFormat={handlePartsExcelFormat}
            permission="PLANNING_AIRCRAFT_PARTS_SAVE"
            exportToXLSX={()=>exportToXLSX()}
            isExport={isExport}
          />
        }
      >
        <ARMForm onFinish={fetchData} form={form}>
          {" "}
          <Row gutter={20}>
            <Col xs={24} md={12} lg={6}>
              <Form.Item name="modelId">
                <Select
                  allowClear
                  showSearch
                  filterOption={(inputValue, option) =>
                    option.children
                      .toString("")
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                  placeholder={t("planning.Models.Select a Model")}
                >
                  {models?.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.modelId}>
                        {item.modelName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Form.Item label="" name="partNo">
                <Input placeholder={t("planning.Parts.Enter Part No")} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <Form.Item
                name="size"
                label={t("common.Page Size")}
                initialValue="10"
              >
                <Select id="antSelect">
                  <Select.Option value="10">10</Select.Option>
                  <Select.Option value="20">20</Select.Option>
                  <Select.Option value="30">30</Select.Option>
                  <Select.Option value="40">40</Select.Option>
                  <Select.Option value="50">50</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <Form.Item>
                <Space>
                  <ARMButton size="middle" type="primary" htmlType="submit">
                    <FilterOutlined /> {t("common.Filter")}
                  </ARMButton>
                  <ARMButton
                    size="middle"
                    type="primary"
                    htmlType="submit"
                    onClick={resetFilter}
                  >
                    <RollbackOutlined /> {t("common.Reset")}
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </ARMForm>
        <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

        <Row className="table-responsive">
          <ARMTable>
            <thead>
              <tr>
                <th>{t("planning.Models.Model")}</th>
                <th>{t("planning.Parts.Part No")}</th>
                <th>{t("planning.Parts.Description")}</th>
                <th>{t("planning.Parts.Classification")}</th>
                <th>{t("planning.Parts.Unit of Measure")}</th>
                <th>{t("common.Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {collection?.map((part, index) => (
                <tr key={index}>
                  <td>{part.modelName}</td>
                  <td> {part.partNo}</td>
                  <td> {part.description}</td>
                  <td>
                    {" "}
                    {part.classification === 1
                      ? "ROTABLE"
                      : part.classification === 2
                      ? "CONSUMABLE"
                      : part.classification === 3
                      ? "EXPENDABLE"
                      : null}
                  </td>
                  <td> {part.unitOfMeasureCode}</td>
                  <td>
                    <Space size="small">
                      <Link to={`view/${part.id}`}>
                        <ARMButton
                          type="primary"
                          size="small"
                          style={{
                            backgroundColor: "#4aa0b5",
                            borderColor: "#4aa0b5",
                          }}
                        >
                          <EyeOutlined />
                        </ARMButton>
                      </Link>
                      {isActive? <Link to={`edit/${part.id}`}>
                        <Permission permission="PLANNING_AIRCRAFT_PARTS_EDIT">
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
                      </Link>
                          : null
                      }
                      <Permission permission="PLANNING_AIRCRAFT_PARTS_DELETE">
                        <ActiveInactiveButton
                          isActive={isActive}
                          handleOk={async () => {
                            try {
                              await PartsServices.toggleStatus(
                                part.id,
                                !part.isActive
                              );
                              notification["success"]({
                                message: t("common.Status Changed Successfully"),
                              });
                              refreshPagination();
                            } catch (e) {
                              notification["error"]({
                                message: getErrorMessage(e),
                              });
                            }
                          }}
                        />
                      </Permission>
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </ARMTable>
        </Row>
        {collection?.length === 0 ? (
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
};

export default Parts;
