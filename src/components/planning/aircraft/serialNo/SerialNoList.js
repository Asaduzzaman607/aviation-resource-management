import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import ActiveInactive from "../../../common/ActiveInactive";
import ARMTable from "../../../common/ARMTable";
import ARMCard from "../../../common/ARMCard";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {useTranslation} from "react-i18next";
import {EditOutlined, FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import ARMButton from "../../../common/buttons/ARMButton";
import ActiveInactiveButton from "../../../common/buttons/ActiveInactiveButton";
import {usePaginate} from "../../../../lib/hooks/paginations";
import React from "react";
import {arrayToCsv, downloadBlob, getErrorMessage} from "../../../../lib/common/helpers";
import SerialNoServices from "../../../../service/SerialNoServices";
import ARMForm from "../../../../lib/common/ARMForm";
import {FileUploadListHeader} from "../../../../lib/common/FileUploadListHeader";
import {notifyResponseError, notifyWarning} from "../../../../lib/common/notifications";
import {useState} from "react";
import {isNull} from "lodash";
import PartsServices from "../../../../service/PartsServices";
import useAircraftModelList from "../../../../lib/hooks/planning/useAircraftsModelList";
import {useEffect} from "react";
import AircraftModelFamilyService from "../../../../service/AircraftModelFamilyService";
import Permission from "../../../auth/Permission";
import API from "../../../../service/Api";
import {utils, write} from "xlsx";
import {saveAs} from "file-saver";

export default function SerialNoList() {

  const { t } = useTranslation()
  const { form, collection, page, totalPages, totalElements, paginate, isActive, setIsActive, fetchData, refreshPagination, resetFilter, size } =
    usePaginate("serials", "serials/search");

  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [aircraftModelId, setAircraftModelId] = useState(isNull);
  const [isDisabled, setIsDisabled] = useState(true);
  const [models, setModels] = useState([]);
  const [aircraftModelList, setAircraftModelList] = useState([]);
  const [isExport] = useState(1);

  const getAllModel = () => {
    PartsServices.getAllModels(true)
      .then((response) => {
        setModels(response.data.model);
      })
      .catch((error) => {
        notifyResponseError(error)
      });
  };

  const getAllAircraftModelFamily = async () => {
    try {
      const { data } =
        await AircraftModelFamilyService.getAllAircraftModelFamily();
      setAircraftModelList(data.model);
    } catch (er) {
      notifyResponseError(er)
    }
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

  const handleFileUpload = async () => {
    try {
      setIsUploading(true);

      const data = await SerialNoServices.saveFile(file, aircraftModelId);
      refreshPagination();
      notification["success"]({
        message: "Serials successfully created",
      });
    } catch (er) {
      notification["error"]({
        message: "Serials file uploaded failed!",
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
        downloadBlob(csv, "serials-file-error.csv", "text/csv;charset=utf-8;");
      }
    } finally {
      setIsUploading(false);
      setFile(false);
    }
  };



  const serialsFormatDownload = async () => {

    let table = [
      {
        A: "Model Name",
        B: "Part Number",
        C: "Serial Number",
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
    ];

    const workbook = {
      SheetNames: ['Serial'],
      Sheets: {
        Serial: Object.assign({}, sheet, { '!cols': columnStyles }),
      },
    };

    const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
    saveAs(
        new Blob([fileBuffer], { type: 'application/octet-stream' }),
        'Serial Excel Format.xlsx'
    );

}


  const exportToXLSX = async () => {
    const response = await API.get('serials/list');
    const data = response.data;

    const modifiedData = data?.map((item) => {
      return {
        'Part':item.partNo,
        'Serial No':item.serialNumber,
      };
    });
    const worksheet = utils.json_to_sheet(modifiedData);


    const columnStyles = [
      { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 1
      { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
    ];

    const workbook = {
      SheetNames: ['Serial'],
      Sheets: {
        Serial: Object.assign({}, worksheet, { '!cols': columnStyles }),
      },
    };

    const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
    saveAs(
        new Blob([fileBuffer], { type: 'application/octet-stream' }),
        'Serial List.xlsx'
    );
  };




  return (
   
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" /> &nbsp;{t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Serials</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_AIRCRAFT_SERIAL_SEARCH" showFallback>
      <ARMCard
        title={  <FileUploadListHeader
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
          url={`/planning/serial/add`}
          title='Serials'
          isTrue={true}
          isDisabled={isDisabled}
          aircraftModelList={aircraftModelList}
          WarningNotification={() => {
            if (isDisabled === true) {
              notifyWarning(t("planning.A/C Type.Please Select A/C Type"));
            }
          }}
          exportExcelFormat={()=>serialsFormatDownload()}
          serialsExcel='serialsExcel'
          permission="PLANNING_AIRCRAFT_SERIAL_SAVE"
          exportToXLSX={()=>exportToXLSX()}
          isExport={isExport}
        />}
      >
        <ARMForm initialValues={{ pageSize: 10 }} onFinish={fetchData} form={form}>
          <Row gutter={20}>
            <Col xs={24} md={12} lg={6}>
              <Form.Item label="Part No" name="partNo">
                <Input placeholder="Input Part no" />
              </Form.Item>
            </Col>
              <Col xs={24} md={12} lg={6}>
              <Form.Item label="Serial No" name="serialNumber">
                <Input placeholder="Input serial no" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Form.Item name="size" label="Page Size" initialValue="10">
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
                  <ARMButton size="middle" type="primary" htmlType="submit" onClick={resetFilter}>
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
              <th>Part</th>
              <th>Serial No</th>
              <th>{t("common.Actions")}</th>
            </tr>
            </thead>
            <tbody>
            {collection?.map((data, index) => (
              <tr key={index}>
                <td>{data.partNo}</td>
                <td> {data.serialNumber}</td>
                <td>
                  <Space size="small">
                    {isActive? <Link to={`edit/${data.id}`}>
                      <Permission permission="PLANNING_AIRCRAFT_SERIAL_EDIT">
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

                    <Permission permission="PLANNING_AIRCRAFT_SERIAL_DELETE">
                      <ActiveInactiveButton
                        isActive={isActive}
                        handleOk={async () => {
                          try {
                            await SerialNoServices.toggleStatus(data.id, !data.isActive);
                            notification["success"]({ message: t("common.Status Changed Successfully") });
                            refreshPagination();
                          } catch (e) {
                            notification["error"]({ message: getErrorMessage(e) });
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
