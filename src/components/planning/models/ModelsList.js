import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  Empty,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Space,
} from "antd";
import { Option } from "antd/lib/mentions";
import React, {useEffect,  useState} from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FileUploadListHeader } from "../../../lib/common/FileUploadListHeader";
import {
  arrayToCsv,
  downloadBlob,
} from "../../../lib/common/helpers";
import {
  notifyError,
  notifyResponseError,
  notifySuccess,
  notifyWarning,
} from "../../../lib/common/notifications";
import { usePaginate } from "../../../lib/hooks/paginations";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import ModelsService from "../../../service/ModelsService";
import Permission from "../../auth/Permission";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import {useDownloadExcel} from "react-export-table-to-excel";
import { write, utils } from "xlsx";
import { saveAs } from "file-saver";
import API from "../../../service/Api";

const ModelsList = () => {
  const [aircraft, setAircraft] = useState([]);
  const [modelType, setModelType] = useState([]);
  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [aircraftModelList, setAircraftModelList] = useState([]);
  const [aircraftModelId, setAircraftModelId] = useState();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isExport] = useState(1);
  const { t } = useTranslation();

  const constantMessage = {
    message: {
      success: t("planning.Models.Models successfully created"),
      error: t("planning.Models.Models file uploaded failed"),
    },
  };

  let modelTypeName;
  const modelTypeId = async () => {
    let data = [
      { id: 0, name: "AF TCI" },
      { id: 1, name: "COMPONENT" },
      { id: 2, name: "ENGINE" },
      { id: 3, name: "ENGINE LLP" },
      { id: 4, name: "ENGINE LRU" },
      { id: 5, name: "ENGINE TCI" },
      { id: 6, name: "MLG LLP" },
      { id: 7, name: "NLG" },
      { id: 8, name: "MLG" },
      { id: 9, name: "NLG LLP" },
      { id: 10, name: "PROPELLER" },
      { id: 11, name: "PROPELLER TCI" },
      { id: 12, name: "AF LLP" },
      { id: 13, name: "APU LLP" },
      { id: 14, name: "APU LRU" },
      { id: 15, name: "APU TCI" },
      { id:16, name : "ENGINE TMM"},
      { id:17, name : "ENGINE RGB"},
      { id:18, name : "APU"}
    ];
    setModelType(data);
  };

  useEffect(() => {
    modelTypeId();
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
  } = usePaginate("Models", "model/search");


  const getAllAircraft = async () => {
    try {
      const { data } = await ModelsService.getAllAircraftModel();
      setAircraft(data.model);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const handleStatus = async (id) => {
    const { data } = await ModelsService.singleData(id);
    if (data.isActive == true) {
      try {
        const { data } = await ModelsService.changeStatus(id, !isActive);
        refreshPagination();
        notifySuccess(t("common.Status Changed Successfully"));
      } catch (er) {
        notifyResponseError(er);
      }
    } else {
      try {
        const { data } = await ModelsService.changeStatus(id, !isActive);
        refreshPagination();
        notifySuccess(t("common.Status Changed Successfully"));
      } catch (er) {
        notifyResponseError(er);
      }
    }
  };

  const getAllAircraftModelFamily = async () => {
    try {
      const { data } =
        await AircraftModelFamilyService.getAllAircraftModelFamily();
      setAircraftModelList(data.model);
    } catch (er) {}
  };

  useEffect(() => {
    (async () => {
      await getAllAircraftModelFamily();
      //  form.resetFields();
    })();
  }, []);

  const onFinish = async (values) => {};

  const handleFileUpload = async () => {
    try {
      setIsUploading(true);
      const { data } = await ModelsService.saveFile(file, aircraftModelId);
      refreshPagination();
      notifySuccess(constantMessage.message.success);
    } catch (er) {
      notifyError(constantMessage.message.error);
      let temp = [];
      let errorLog = er.response.data.errorMessages;

      if (Array.isArray(errorLog)) {
        temp = errorLog.map((Log) => [Log]);
      }

      if (temp.length) {
        const csv = arrayToCsv([
          ["Something went wrong please check the below list"],
          ...temp,
        ]);
        downloadBlob(csv, "Models-ErrorLog.csv", "text/csv;charset=utf-8;");
      }
    } finally {
      setIsUploading(false);
      setFile(false);
      await getAllAircraft();
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    onFinish();
  }, []);

  useEffect(() => {
    onFinish();
  }, [isActive]);

  useEffect(() => {
    (async () => {
      await getAllAircraft();
      form.resetFields();
    })();
  }, []);


  const downLoadModelExcelFormat = async () => {

    let table = [
      {
        A: "Model Type",
        B: "Model",
        C: "Model Description",
        D: "Life Codes",
        E: "Model Version",
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
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
    ];

    const workbook = {
      SheetNames: ['Model'],
      Sheets: {
        Model: Object.assign({}, sheet, { '!cols': columnStyles }),
      },
    };

    const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
    saveAs(
        new Blob([fileBuffer], { type: 'application/octet-stream' }),
        'Model Excel Format.xlsx'
    );

  }

  const getModelType = (id) => {
    switch (id) {
      case 0:
        return "AF TCI";
      case 1:
        return "COMPONENT";
      case 2:
        return "ENGINE";
      case 3:
        return "ENGINE LLP";
      case 4:
        return "ENGINE LRU";
      case 5:
        return "ENGINE TCI";
      case 6:
        return "MLG LLP";
      case 7:
        return "NLG";
      case 8:
        return "MLG";
      case 9:
        return "NLG LLP";
      case 10:
        return "PROPELLER";
      case 11:
        return "PROPELLER TCI";
      case 12:
        return "AF LLP";
      case 13:
        return "APU LLP";
      case 14:
        return "APU LRU";
      case 15:
        return "APU TCI";
      case 16:
        return "ENGINE TMM";
      case 17:
        return "ENGINE RGB";
      case 18:
        return "APU";
        case 19:
        return "CONSUMABLE MODEL";
      default:
        return null;
    }
  };

  const exportToXLSX = async () => {
    const response = await API.get('model/getAll');
    const data = response.data;

    const modifiedData = data?.map((item) => {
      const modelType = getModelType( item.modelType);
      return {
        'Model Name':item.modelName? item.modelName : null,
        'Model Type':modelType? modelType : null,
        'Description':item.description? item.description : null,
        'A/C Type':item.aircraftModelName? item.aircraftModelName : null
      };
    });

    const worksheet = utils.json_to_sheet(modifiedData);
    const columnStyles = [
      { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 1
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
      { width: 50, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
    ];
 
    const workbook = {
      SheetNames: ['Model'],
      Sheets: {
        Model: Object.assign({}, worksheet, { '!cols': columnStyles }),
      },
    };
  
    const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
    saveAs(
      new Blob([fileBuffer], { type: 'application/octet-stream' }),
      'Model List.xlsx'
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
          <Breadcrumb.Item>{t("planning.Models.Models")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_AIRCRAFT_MODEL_SEARCH" showFallback>
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
            url={`/planning/models/add`}
            title={t("planning.Models.Model List")}
            isTrue={true}
            isDisabled={isDisabled}
            aircraftModelList={aircraftModelList}
            exportToXLSX={()=>exportToXLSX()}
            isExport={isExport}
            WarningNotification={() => {
              if (isDisabled === true) {
                notifyWarning(t("planning.A/C Type.Please Select A/C Type"));
              }
            }}
            exportExcelFormat={downLoadModelExcelFormat}
            modelExcel='modelExcel'
            permission="PLANNING_AIRCRAFT_MODEL_SAVE"
          />
        }
      >
       
        <Form form={form} onFinish={fetchData}>
          <Row gutter={20}>
            <Col xs={24} md={6}>
              <Form.Item
                name="aircraftModelId"
                rules={[
                  {
                    required: true,
                    message: t("planning.A/C Type.Please Select A/C Type"),
                  },
                ]}
              >
                <Select placeholder={t("planning.A/C Type.Select A/C Type")}>
                  {aircraft?.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item?.aircraftModelName}{" "}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="modelName">
                <Input placeholder={t("planning.Models.Enter model name")} />
              </Form.Item>
            </Col>

            <Col xs={24} md={5} lg={4}>
              <Form.Item name="size" label={t("common.Page Size")} initialValue="10">
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
                    <FilterOutlined name="filter" /> {t("common.Filter")}
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
                <th>{t("planning.Models.Model Name")}</th>
                <th>{t("planning.Models.Model Type")}</th>
                <th>{t("planning.Models.Description")}</th>
                <th>{t("planning.Aircrafts.A/C Type")}</th>
                <th>{t("common.Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {collection?.map((model, index) => (
                <tr key={index}>
                  <td>{model.modelName}</td>
                  <td>
                    {modelType?.map((item) => {
                      if (model?.modelType == item.id) {
                        modelTypeName = item.name;
                        return;
                      }
                    })}
                    {modelTypeName}
                  </td>
                  <td>{model.description}</td>
                  <td>{model.aircraftModelName}</td>
                  <td>
                    <Space size="small">
                      <Link to={`/planning/models/view/${model.modelId}`}>
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
                      {isActive? <Link to={`/planning/models/edit/${model.modelId}`}>
                        <Permission permission="PLANNING_AIRCRAFT_MODEL_EDIT">
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
                      <Permission permission="PLANNING_AIRCRAFT_MODEL_DELETE">
                        <ActiveInactiveButton
                          isActive={isActive}
                          handleOk={() => handleStatus(model.modelId)}
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
};

export default ModelsList;
