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
    Modal,
    notification,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Space,
} from "antd";
import {Option} from "antd/lib/mentions";
import React, {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import {usePaginate} from "../../../lib/hooks/paginations";
import AircraftBuildsService from "../../../service/AircraftBuildsService";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import {FileUploadListHeader} from "../../../lib/common/FileUploadListHeader";
import {arrayToCsv, downloadBlob} from "../../../lib/common/helpers";
import {isNull} from "lodash";
import {
    notifyError,
    notifyResponseError,
    notifySuccess,
    notifyWarning,
} from "../../../lib/common/notifications";
import {useTranslation} from "react-i18next";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import AddNewFieldAircraftBuild from "./AddNewFieldAircraftBuild";
import API from "../../../service/Api";
import Permission from "../../auth/Permission";
import {useDownloadExcel} from "react-export-table-to-excel";
import AircraftService from "../../../service/AircraftService";
import { write, utils } from "xlsx";
import { saveAs } from "file-saver";

const AircraftBuildsList = () => {
    let {id} = useParams();
    //const [form] = Form.useForm();
    const [model, setModel] = useState([]);
    //const [isActive, setIsActive] = useState(true);

    const [aircraft, setAircraft] = useState([]);
    const [higherModel, setHigherModel] = useState([]);
    const [higherPart, setHigherPart] = useState([]);
    const [part, setPart] = useState([]);
    const [aircraftId, setAircraftId] = useState();
    const [higherModelId, setHigherModelId] = useState();
    const [modelId, setModelId] = useState();
    const [file, setFile] = useState();
    const [isUploading, setIsUploading] = useState(false);
    const [getAircraftIdList, seAircraftIdList] = useState([]);
    const [fileUploadAircraftId, setFileUploadAircraftId] = useState(isNull);
    const [isDisabled, setIsDisabled] = useState(true);
    const [aircraftSearch, setAircraftSearch] = useState();
    const [inactiveId, setInactiveId] = useState(null);
    const [activeAircraftId, setActiveAircraftId] = useState(null);
    const [isExport] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const {t} = useTranslation();
    const constantMessage = {
        success: {
            save: t("planning.Aircraft Builds.Aircraft build successfully created"),
            error: t("planning.Aircraft Builds.Aircraft build file uploaded failed"),
            inactive: "Status changed successfully!",
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
    } = usePaginate("aircraftBuilds", "aircraft-build/search");

    const getAircraftId = (event) => {
        setAircraftId(event);
    };

    const getHigherModelId = (event) => {
        setHigherModelId(event);
    };

    const getModelId = (event) => {
        setModelId(event);
    };

    const getAllAircraft = async () => {
        try {
            const {data} = await AircraftService.getAllAircraftList();
            setAircraft(data);
            setAircraftSearch(data[0].aircraftId);
        } catch (er) {
        }
    };

    useEffect(() => {
        (async () => {
            await getAllAircraft();
        })();
    }, []);

    const getAllHigherModelByAircraftId = async (aircraftId) => {
        try {
            const {data} =
                await AircraftBuildsService.getAllHigherModelByAircraftId(aircraftId);
            setHigherModel(data);
        } catch (er) {
        }
    };

    useEffect(() => {
        if (!aircraftId) {
            return;
        }
        (async () => {
            await getAllHigherModelByAircraftId(aircraftId);
        })();
    }, [aircraftId]);

    const getAllModelByHigherModelId = async (higherModelId) => {
        try {
            const {data} = await AircraftBuildsService.getAllModelByHigherModelId(
                higherModelId
            );
            setModel(data);
        } catch (er) {
        }
    };

    const getAllHigherPartByHigherModelId = async () => {
        try {
            const {data} = await AircraftBuildsService.getAllHigherPartByModelId(
                higherModelId
            );
            setHigherPart(data);
        } catch (er) {
        }
    };

    useEffect(() => {
        if (!higherModelId) {
            return;
        }
        (async () => {
            await getAllModelByHigherModelId(higherModelId);
            await getAllHigherPartByHigherModelId(higherModelId);
        })();
    }, [higherModelId]);

    const getAllPartByModelId = async (modelId) => {
        try {
            const {data} = await AircraftBuildsService.getAllPartByModelId(modelId);
            setPart(data);
        } catch (er) {
        }
    };

    useEffect(() => {
        if (!modelId) {
            return;
        }
        (async () => {
            await getAllPartByModelId(modelId);
        })();
    }, [modelId]);

    const handleStatus = async (id) => {
        try {
            const {data} = await AircraftBuildsService.changeStatus(id, !isActive);
            refreshPagination();
            notification["success"]({
                message: "Status changed successfully",
            });
        } catch (er) {
            notifyResponseError(er);
        }
    };

    const getAllAircraftList = async () => {
        try {
            const {data} = await AircraftService.getAllAircraftList();
            seAircraftIdList(data);
        } catch (er) {
        }
    };

    const handleFileUpload = async () => {
        try {
            setIsUploading(true);

            const data = await AircraftBuildsService.saveFile(
                file,
                fileUploadAircraftId
            );
            refreshPagination();
            notifySuccess(constantMessage.success.save);
        } catch (er) {
            notifyError(constantMessage.success.error);
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
                    "aircraft-builds-file-error.csv",
                    "text/csv;charset=utf-8;"
                );
            }
        } finally {
            setIsUploading(false);
            setFile(false);
        }
    };

    useEffect(() => {
        (async () => {
            await getAllAircraftList();
            form.resetFields();
        })();
    }, []);

    const [formData] = Form.useForm();

    const getAircraftHourAndCycle = async () => {
        const {data} = await API.get(`aircrafts/info/${activeAircraftId}`)
        formData.setFieldsValue({
            aircraftOutHour: data.acHour,
            aircraftOutCycle: data.acCycle
        })
    }

    useEffect(() => {
        if (!activeAircraftId) {
            return;
        }
        (async () => {
            await getAircraftHourAndCycle();
        })();
    }, [inactiveId])

    const onFinish = async (values) => {

        const allData = {
            ...values,
            outDate: values["outDate"].format("YYYY-MM-DD"),
            id: inactiveId
        }
        try {
            const {data} = await API.post(`aircraft-build/make-in-active`, allData);
            notifySuccess(constantMessage.success.inactive)
            setShowModal(false);
            formData.resetFields();
            refreshPagination();

        } catch (er) {
            notifyResponseError(er);
        }
    };

    useEffect(() => {
        formData.resetFields();
    }, [])

    const onReset = () => {
        formData.resetFields();
        fetchData({aircraftId: aircraftSearch});
    }



    const downLoadAircraftBuildFormat = async () => {

        let table = [
            {
                A: "Higher Model",
                B: "Higher Part Number",
                C: "Higher Serial Number",
                D: "Model",
                E: "Part Number",
                F: "Serial Number",
                G: "Location",
                H: "Position",
                I: "Tsn Hour",
                J: "Tsn Cycle",
                K: "Tso Hour",
                L: "Tso Cycle",
                M: "Tslsv Hour",
                N: "Tslsv Cycle",
                O: "Aircraft In Hour",
                P: "Aircraft In Cycle",
                Q: "Attach Date",
                R: "Component Manufacture Date",
                S: "Component Certificate Date",
                T: "In Ref Message",
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
            { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 10, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 10, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 10, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 10, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 10, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 10, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 30, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 30, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
        ];

        const workbook = {
            SheetNames: ['AC BUILD'],
            Sheets: {
                'AC BUILD': Object.assign({}, sheet, { '!cols': columnStyles }),
            },
        };

        const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
        saveAs(
            new Blob([fileBuffer], { type: 'application/octet-stream' }),
            'AC BUILD Excel Format.xlsx'
        );

    }

    const exportToXLSX = async () => {
        const response = await API.get('aircraft-build/getAll');
        const data = response.data;

        const modifiedData = data?.map((item) => {
            return {
               Aircraft:item.aircraftName,
              'Higher Model':item.higherModelName,
              'Higher Part No.':item.higherPartNo,
               Model:item.modelName,
              'Part No.':item.partNo,
              'Serial No.':item.serialNo,
              'Position Name':item.positionName
            };
          });
    
        const worksheet = utils.json_to_sheet(modifiedData);
        const columnStyles = [
          { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 1
          { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
          { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
          { width: 50, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 1
          { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
          { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
          { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
        ];
     
        const workbook = {
          SheetNames: ['Aircraft Build'],
          Sheets: {
            'Aircraft Build': Object.assign({}, worksheet, { '!cols': columnStyles }),
          },
        };
      
        const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
        saveAs(
          new Blob([fileBuffer], { type: 'application/octet-stream' }),
          'Aircraft Build List.xlsx'
        );
      };


    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <i className="fas fa-chart-line"/>
                        <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {t("planning.Aircraft Builds.Aircraft Builds")}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="PLANNING_AIRCRAFT_BUILD_AIRCRAFT_SEARCH" showFallback>
                <ARMCard
                    title={
                        <FileUploadListHeader
                            aircraftId={fileUploadAircraftId}
                            handleFileChange={(file) => {
                                setFile(file.file.originFileObj);
                            }}
                            handleAircraftModel={(id) => {
                                setFileUploadAircraftId(id);
                                setIsDisabled(false);
                            }}
                            handleFileUpload={handleFileUpload}
                            showUploadButton={!!file}
                            isUploading={isUploading}
                            url={`/planning/aircraft-builds/add`}
                            title={t("planning.Aircraft Builds.Aircraft Build List")}
                            isAircraft={true}
                            getAircraftIdList={getAircraftIdList}
                            isDisabled={isDisabled}
                            exportToXLSX={()=>exportToXLSX()}
                            isExport={isExport}
                            WarningNotification={() => {
                                if (isDisabled === true) {
                                    notifyWarning(t("planning.Aircrafts.Select Aircraft"));
                                }
                            }}
                            aircraftBuildExcel='aircraftBuildExcel'
                            exportExcelFormat={downLoadAircraftBuildFormat}
                            permission="PLANNING_AIRCRAFT_BUILD_AIRCRAFT_SAVE"
                        />
                    }
                >
                    <Form
                        form={form}
                        onFinish={fetchData}
                        initialValues={{
                            // aircraftId: aircraftSearch,
                            partNo: "",
                            modelName: "",
                            higherModelName: "",
                            higherPartNo: "",
                            size: 10,
                        }}
                    >
                        <Row gutter={20}>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    name="aircraftId"
                                    rules={[
                                        {
                                            required: false,
                                            message: t("planning.Aircrafts.Select Aircraft"),
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder={t("planning.Aircrafts.Select Aircraft")}
                                        onChange={(e) => getAircraftId(e)}
                                        allowClear
                                    >
                                        {aircraft?.map((item, index) => {
                                            return (
                                                <Select.Option key={index} value={item.aircraftId}>
                                                    {item.aircraftName}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={6}>
                                <Form.Item name="higherModelName">
                                    <Input placeholder="Enter higher model name"/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={6}>
                                <Form.Item name="higherPartNo">
                                    <Input placeholder="Enter higher part no"/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={6}>
                                <Form.Item name="modelName">
                                    <Input placeholder={t("planning.Models.Enter model name")}/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={6}>
                                <Form.Item name="partNo">
                                    <Input placeholder={t("planning.Parts.Enter Part No")}/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={6}>
                                <Form.Item name="size" label={t("common.Page Size")}>
                                    <Select id="antSelect">
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
                                            <FilterOutlined name="filter"/> {t("common.Filter")}
                                        </ARMButton>
                                        <ARMButton size="middle" type="primary" htmlType="reset" onClick={onReset}>
                                            <RollbackOutlined/>{" "}
                                            {t("common.Reset")}
                                        </ARMButton>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <ActiveInactive isActive={isActive} setIsActive={setIsActive}/>

                    <Row className="table-responsive">
                        <ARMTable>
                            <thead>
                            <tr>
                                <th>{t("planning.Aircrafts.Aircraft")}</th>
                                <th>{t("planning.Model Trees.Higher Model")}</th>
                                <th>{t("planning.Aircraft Builds.Higher Part No")}</th>
                                <th>{t("planning.Models.Model")}</th>
                                <th>{t("planning.Parts.Part No")}</th>
                                <th>{t("planning.Aircraft Builds.Serial No")}</th>
                                <th>{t("planning.Aircraft Builds.Position Name")}</th>
                                <th>{t("common.Actions")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {collection?.map((model, index) => (
                                <tr key={index}>
                                    <td>{model.aircraftName}</td>
                                    <td>{model.higherModelName}</td>
                                    <td>{model.higherPartNo}</td>
                                    <td>{model.modelName}</td>
                                    <td>{model.partNo}</td>

                                    <td>{model.serialNo}</td>
                                    <td>{model.positionName}</td>

                                    <td>
                                        <Space size="small">
                                            <Link to={`/planning/aircraft-builds/view/${model.id}`}>
                                                <ARMButton
                                                    type="primary"
                                                    size="small"
                                                    style={{
                                                        backgroundColor: "#4aa0b5",
                                                        borderColor: "#4aa0b5",
                                                    }}
                                                >
                                                    <EyeOutlined/>
                                                </ARMButton>
                                            </Link>
                                            {isActive ? <Link
                                                to={`/planning/aircraft-builds/edit/${model.id}/${isActive}`}
                                            >
                                                <Permission permission="PLANNING_AIRCRAFT_BUILD_AIRCRAFT_EDIT">
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
                                            <Permission permission="PLANNING_AIRCRAFT_BUILD_AIRCRAFT_DELETE">
                                                {
                                                    isActive == false ?
                                                        (
                                                            null
                                                        )
                                                        :
                                                        (
                                                            <ARMButton
                                                                type="primary"
                                                                size="small"
                                                                danger
                                                            >
                                                                <LockOutlined
                                                                    onClick={(id) => {
                                                                        setShowModal(true);
                                                                        setInactiveId(model.id);
                                                                        setActiveAircraftId(model.aircraftId);
                                                                    }}

                                                                />
                                                                <Modal
                                                                    className="modal"
                                                                    title="Are you sure want to inactive?"
                                                                    style={{
                                                                        top: 20,
                                                                    }}
                                                                    bodyStyle={{height: 345}}
                                                                    mask={false}
                                                                    //maskStyle={{backgroundColor:"rgba(0,0,0,0.12)"}}
                                                                    maskStyle={{backgroundColor: "red"}}
                                                                    onOk={() => setShowModal(false)}
                                                                    onCancel={() => setShowModal(false)}
                                                                    centered
                                                                    visible={showModal}
                                                                    width={700}
                                                                    footer={null}
                                                                >
                                                                    <AddNewFieldAircraftBuild
                                                                        onFinish={onFinish}
                                                                        formData={formData}
                                                                        onReset={onReset}
                                                                    />
                                                                </Modal>
                                                            </ARMButton>
                                                        )
                                                }
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
                            <Col style={{margin: "30px auto"}}>
                                <Empty/>
                            </Col>
                        </Row>
                    ) : (
                        <Row justify="center">
                            <Col style={{marginTop: 10}}>
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

export default AircraftBuildsList;
