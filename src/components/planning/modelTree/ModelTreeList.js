import React, {useEffect, useRef, useState} from "react";
import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  LockOutlined,
  RollbackOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  Empty,
  Form,
  Input,
  notification,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Space,
} from "antd";
import { Link } from "react-router-dom";
import { Option } from "antd/lib/mentions";
import {
  arrayToCsv,
  downloadBlob,
  getErrorMessage,
} from "../../../lib/common/helpers";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import ModelsService from "../../../service/ModelsService";
import ModelTreeService from "../../../service/ModelTreeService";
import { FileUploadListHeader } from "../../../lib/common/FileUploadListHeader";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import { usePaginate } from "../../../lib/hooks/paginations";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "../../../lib/common/notifications";
import { isNull } from "lodash";
import { useTranslation } from "react-i18next";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import Permission from "../../auth/Permission";
import {useDownloadExcel} from "react-export-table-to-excel";
import API from "../../../service/Api";
import { write, utils } from "xlsx";
import { saveAs } from "file-saver";

const ModelTreeList = () => {
  const [models, setModelTree] = useState([]);
  const [model, setModel] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [aircraftModelList, setAircraftModelList] = useState([]);
  const [aircraftModelId, setAircraftModelId] = useState(isNull);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isExport] = useState(1);
  const { t } = useTranslation();

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
  } = usePaginate("Model-tree", "model-tree/search");

  const handleFileUpload = async () => {
    try {
      setIsUploading(true);
      const { data } = await ModelTreeService.saveFile(file, aircraftModelId);
      refreshPagination();
      notifySuccess("Models tree successfully created!");
    } catch (er) {
      notifyError("Model tree file uploaded failed!");
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
        downloadBlob(
          csv,
          "model-tree-file-error.csv",
          "text/csv;charset=utf-8;"
        );
      }
    } finally {
      setIsUploading(false);
      setFile(false);
    }
  };

  const handleStatus = async (id) => {
    try {
      const { data } = await ModelTreeService.changeStatus(id, !isActive);
      refreshPagination();
      notifySuccess(t("common.Status Changed Successfully"));
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };
  const getAllModels = async () => {
    try {
      const { data } = await ModelTreeService.getAllModels();
      setModel(data.model);
    } catch (er) {}
  };
  const getAllAircraftModelFamily = async () => {
    try {
      const { data } =
        await AircraftModelFamilyService.getAllAircraftModelFamily();
      setAircraftModelList(data.model);
    } catch (er) {}
  };
  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    (async () => {
      await getAllAircraftModelFamily();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getAllModels();
    })();
  }, []);



  const downloadModelTreeExcelFormat = async () => {

    let table = [
      {
        A: "Model",
        B: "Higher Model",
        C: "Location",
        D: "Position",
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
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
    ];

    const workbook = {
      SheetNames: ['Model Tree'],
      Sheets: {
        'Model Tree': Object.assign({}, sheet, { '!cols': columnStyles }),
      },
    };

    const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
    saveAs(
        new Blob([fileBuffer], { type: 'application/octet-stream' }),
        'Model Tree Excel Format.xlsx'
    );

  }

  const exportToXLSX = async () => {
    const response = await API.get('model-tree/getAll');
    const data = response.data;

    const modifiedData = data?.map((item) => {
      return {
        Model:item.modelName,
        'Higher Model':item.higherModelName,
        Location:item.locationName,
        Position:item.positionName
      };
    });

    const worksheet = utils.json_to_sheet(modifiedData);
    const columnStyles = [
      { width: 50, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 1
      { width: 30, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
      { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
    ];
 
    const workbook = {
      SheetNames: ['Model Tree'],
      Sheets: {
        'Model Tree': Object.assign({}, worksheet, { '!cols': columnStyles }),
      },
    };
  
    const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
    saveAs(
      new Blob([fileBuffer], { type: 'application/octet-stream' }),
      'Model Tree List.xlsx'
    );
  };


  return (
    <CommonLayout> 
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-chart-line" />
            <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {t("planning.Model Trees.Model Trees")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_AIRCRAFT_MODEL_TREES_SEARCH" showFallback>
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
            url={`/planning/model-tree/add`}
            title={t("planning.Model Trees.Model Tree List")}
            isTrue={true}
            isDisabled={isDisabled}
            aircraftModelList={aircraftModelList}
            exportToXLSX={()=>exportToXLSX()}
            exportExcelFormat={()=>downloadModelTreeExcelFormat()}
            isExport={isExport}
            WarningNotification={() => {
              if (isDisabled == true) {
                notifyWarning("Please select aircraft model");
              }
            }}
            modelTreeExcel='modelTreeExcel'
            permission="PLANNING_AIRCRAFT_MODEL_TREES_SAVE"
          />
        }
      >
          <Form form={form} onFinish={fetchData} initialValues={{ size: 10 }}>
            <Row gutter={20}>
              <Col xs={24} md={6}>
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
                    {model?.map((item) => {
                      return (
                        <Option key={item.modelId} value={item.modelId}>
                          {item.modelName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item name="higherModelId">
                  <Select
                    allowClear
                    showSearch
                    filterOption={(inputValue, option) =>
                      option.children
                        .toString("")
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                    placeholder={t("planning.Model Trees.Select Higher Model")}
                  >
                    {model?.map((item) => {
                      return (
                        <Option key={item.modelId} value={item.modelId}>
                          {item.modelName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={5} lg={4}>
                <Form.Item name="size" label={t("common.Page Size")} initialValue="10">
                  <Select id="antSelect" defaultValue={10}>
                    <Select.Option value="10">10</Select.Option>
                    <Select.Option value="20">20</Select.Option>
                    <Select.Option value="30">30</Select.Option>
                    <Select.Option value="40">40</Select.Option>
                    <Select.Option value="50">50</Select.Option>
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
                      <RollbackOutlined  /> {t("common.Reset")}
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
                  <th>{t("planning.Models.Model")}</th>
                  <th>{t("planning.Model Trees.Higher Model")}</th>
                  <th>{t("planning.Locations.Location")}</th>
                  <th>{t("planning.Positions.Position")}</th>
                  <th>{t("common.Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {collection?.map((model, index) => (
                  <tr key={index}>
                    <td>{model.modelName}</td>
                    <td>{model.higherModelName}</td>
                    <td>{model.locationName}</td>
                    <td>{model.positionName}</td>

                    <td>
                      <Space size="small">
                        <Link to={`/planning/model-tree/view/${model.id}`}>
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
                       {
                         isActive?
                         <Link to={`/planning/model-tree/edit/${model.id}`}>
                         <Permission permission="PLANNING_AIRCRAFT_MODEL_TREES_EDIT">
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
                        <Permission permission="PLANNING_AIRCRAFT_MODEL_TREES_DELETE">
                          <ActiveInactiveButton
                            isActive={isActive}
                            handleOk={() => handleStatus(model.id, !model.isActive)}
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

export default ModelTreeList;
