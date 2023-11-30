import React, { useState} from "react";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
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
import {Link} from "react-router-dom";
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

import {
    arrayToCsv,
    downloadBlob,
    getErrorMessage,
} from "../../../../lib/common/helpers";
import ARMForm from "../../../../lib/common/ARMForm";
import {usePaginate} from "../../../../lib/hooks/paginations";
import ActiveInactiveButton from "../../../common/buttons/ActiveInactiveButton";
import TaskRecordServices from "../../../../service/TaskRecordServices";
import {pluck, pipe, filter, propEq, join} from "ramda";
import {useEffect} from "react";
import useAircraftModelList from "../../../../lib/hooks/planning/useAircraftsModelList";
import {useTranslation} from "react-i18next";
import {TaskListHeader} from "./TaskListHeader";
import AircraftModelFamilyService from "../../../../service/AircraftModelFamilyService";
import {isNull} from "lodash";
import {
    notifyError,
    notifySuccess,
    notifyWarning,
} from "../../../../lib/common/notifications";
import Permission from "../../../auth/Permission";
import {utils, write} from "xlsx";
import {saveAs} from "file-saver";

export const APPLICABLE = 1;
export const NOT_APPLICABLE = 0;
export const THRESHOLD = 0;
export const INTERVAL = 1;

const TaskRecords = () => {
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
    } = usePaginate("tasks", "task/search");

    const {t} = useTranslation();
    const [aircraftModelId, setAircraftModelId] = useState(isNull);
    const [isDisabled, setIsDisabled] = useState(true);
    const [aircraftModelList, setAircraftModelList] = useState([]);
    const [taskFile, setTaskFile] = useState();
    const [EffectivityTypeFile, setEffectivityTypeFile] = useState();
    const [jobProcedureFile, setJobProcedureFile] = useState();
    const [consumablePartFile, setConsumableFile] = useState();

    const [isUploading, setIsUploading] = useState(false);

    const handleConsumablePartFileUpload = async () => {
        try {
            setIsUploading(true);
            const {data} = await TaskRecordServices.saveConsumablePartFile(
                consumablePartFile,
                aircraftModelId
            );
            refreshPagination();
            notifySuccess("Consumable part successfully created!");
        } catch (er) {
            notifyError("Consumable part file uploaded failed!");
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
                    "consumable-part-file-error.csv",
                    "text/csv;charset=utf-8;"
                );
            }
        } finally {
            setIsUploading(false);
            setJobProcedureFile(false);
        }

    }

    const handleJobProcedureFileUpload = async () => {
        try {
            setIsUploading(true);
            const {data} = await TaskRecordServices.saveTaskProcedureFile(
                jobProcedureFile,
                aircraftModelId
            );
            refreshPagination();
            notifySuccess("Task Procedure successfully created!");
        } catch (er) {
            notifyError("Task Procedure file uploaded failed!");
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
                    "task-procedure-file-error.csv",
                    "text/csv;charset=utf-8;"
                );
            }
        } finally {
            setIsUploading(false);
            setJobProcedureFile(false);
        }

    }

    const handleEffectivityTypeFileUpload = async () => {
        try {
            setIsUploading(true);
            const {data} = await TaskRecordServices.saveEffectivityTypeFile(
                EffectivityTypeFile,
                aircraftModelId
            );
            refreshPagination();
            notifySuccess("Effectivity type successfully created!");
        } catch (er) {
            notifyError("Effectivity type file uploaded failed!");
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
                    "effectivity-type-file-error.csv",
                    "text/csv;charset=utf-8;"
                );
            }
        } finally {
            setIsUploading(false);
            setEffectivityTypeFile(false);
        }
    };

    const handleTaskRecordFileUpload = async () => {
        try {
            setIsUploading(true);
            const {data} = await TaskRecordServices.saveFile(
                taskFile,
                aircraftModelId
            );
            refreshPagination();
            notifySuccess("Task record successfully created!");
        } catch (er) {
            notifyError("Task record file uploaded failed!");
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
                    "task-record-file-error.csv",
                    "text/csv;charset=utf-8;"
                );
            }
        } finally {
            setIsUploading(false);
            setTaskFile(false);
        }
    };

    const getAllAircraftModelFamily = async () => {
        try {
            const {data} =
                await AircraftModelFamilyService.getAllAircraftModelFamily();
            setAircraftModelList(data.model);
        } catch (er) {
        }
    };

    useEffect(() => {
        (async () => {
            await getAllAircraftModelFamily();
        })();
    }, []);

    const convertStatus = (statusId) => {
        switch (statusId) {
            case 0:
                return "OPEN";

            case 1:
                return "CLOSED";

            case 2:
                return "REP";

            default:
                return 0;
        }
    };

    const {aircraftModels, initAircraftModels} = useAircraftModelList();

    useEffect(() => {
        (async () => {
            await initAircraftModels();
        })();
    }, []);

    const aplicableAircrafts = pipe(
        filter(propEq("effectivityType", APPLICABLE)),
        pluck("aircraftName"),
        join(", ")
    );

    const formatHour = (value, isApu) => {
        if (value && isApu) {
            return Number(value).toFixed(2).replace(".", ":") + ' AH';
        }if (value && !isApu) {
            return Number(value).toFixed(2).replace(".", ":") + ' FH';
        } 
        return "";
    };

    const formatCycle = (value, isApu) => {
        if (value && isApu) {
            return "AC";
        }
        if (value && !isApu) {
            return "FC";
        }
        return "";
    };

    const handleTaskFormat = async () => {

        let table = [
            {
                A: "Model",
                B: "TaskNo",
                C: "TaskSource",
                D: "RepeatType",
                E: "Description",
                F: "ManHours",
                G: "Sources",
                H: "Status",
                I: "IsApuControl",
                J: "IntervalDay",
                K: "IntervalHour",
                L: "IntervalCycle",
                M: "ThresholdDay",
                N: "ThresholdHour",
                O: "ThresholdCycle",
                P: "EffectiveDate",
                Q: "TaskType",
                R: "Trade",
                S: "Comment",
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
            { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
            { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
            { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
            { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
            { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
            { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
            { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
            { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
            { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
            { width: 20, style: { fill: { fgColor: { rgb: 'FF00FF00' } } } }, // Column 2
        ];

        const workbook = {
            SheetNames: ['Task'],
            Sheets: {
                Task: Object.assign({}, sheet, { '!cols': columnStyles }),
            },
        };

        const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
        saveAs(
            new Blob([fileBuffer], { type: 'application/octet-stream' }),
            'Task Excel Format.xlsx'
        );

    }

    const effectivityFormatDownload = async () => {

        let table = [
            {
                A: "TaskNo",
                B: "AircraftName",
                C: "Remark",
                D: "EffectivityType",
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
        ];

        const workbook = {
            SheetNames: ['AircraftEffectivity'],
            Sheets: {
                AircraftEffectivity: Object.assign({}, sheet, { '!cols': columnStyles }),
            },
        };

        const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
        saveAs(
            new Blob([fileBuffer], { type: 'application/octet-stream' }),
            'Aircraft Effectivity Excel Format.xlsx'
        );

    }

    const taskTProcedureRefFormatDownload = async () => {


        let table = [
            {
                A: "TaskNo",
                B: "PositionName",
                C: "JobProcedure",
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
        ];

        const workbook = {
            SheetNames: ['TaskProcedure'],
            Sheets: {
                TaskProcedure: Object.assign({}, sheet, { '!cols': columnStyles }),
            },
        };

        const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
        saveAs(
            new Blob([fileBuffer], { type: 'application/octet-stream' }),
            'Task Procedure Excel Format.xlsx'
        );

    }

    const taskTConsumablePartFormatDownload = async () => {

        let table = [
            {
                A: "TaskNo",
                B: "PartNo",
                C: "Quantity",
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
        ];

        const workbook = {
            SheetNames: ['TaskConsumablePart'],
            Sheets: {
                TaskConsumablePart: Object.assign({}, sheet, { '!cols': columnStyles }),
            },
        };

        const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
        saveAs(
            new Blob([fileBuffer], { type: 'application/octet-stream' }),
            'Task Consumable Part Excel Format.xlsx'
        );

    }


    return (
        <CommonLayout>

            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        {" "}
                        <Link to="/planning">
                            {" "}
                            <i className="fas fa-chart-line"/> &nbsp;{" "}
                            {t("planning.Planning")}
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        {t("planning.Task Records.Task Records")}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="PLANNING_SCHEDULE_TASKS_TASK_RECORDS_SEARCH" showFallback>
                <ARMCard
                    title={
                        <TaskListHeader
                            handleAircraftModel={(id) => {
                                setAircraftModelId(id);
                                setIsDisabled(false);
                            }}

                            handleConsumablePartFileChange={(file) => {
                                setConsumableFile(file.file.originFileObj);
                            }}
                            handleEffectivityTypeFileChange={(file) => {
                                setEffectivityTypeFile(file.file.originFileObj);
                            }}
                            handleJobProcedureFileChange={(file) => {
                                setJobProcedureFile(file.file.originFileObj);
                            }}
                            handleTaskRecordFileChange={(file) => {
                                setTaskFile(file.file.originFileObj);
                            }}
                            aircraftModelList={aircraftModelList}
                            handleTaskRecordFileUpload={handleTaskRecordFileUpload}
                            handleEffectivityTypeFileUpload={handleEffectivityTypeFileUpload}
                            handleJobProcedureFileUpload={handleJobProcedureFileUpload}
                            handleConsumablePartFileUpload={handleConsumablePartFileUpload}
                            showUploadTaskButton={!!taskFile}
                            showUploadEffectivityButton={!!EffectivityTypeFile}
                            showUploadJobProcedureButton={!!jobProcedureFile}
                            showUploadConsumablePartButton={!!consumablePartFile}
                            isDisabled={isDisabled}
                            isUploading={isUploading}
                            isTrue={true}
                            WarningNotification={() => {
                                if (isDisabled == true) {
                                    notifyWarning("Please select aircraft model");
                                }
                            }}
                            handleTaskFormat={handleTaskFormat}
                            effectivityFormatDownload={effectivityFormatDownload}
                            taskTProcedureRefFormatDownload={taskTProcedureRefFormatDownload}
                            taskTConsumablePartFormatDownload={taskTConsumablePartFormatDownload}

                            permission="PLANNING_SCHEDULE_TASKS_TASK_RECORDS_SAVE"
                        />

                    }
                    // title={
                    //   getLinkAndTitle(t("planning.Task Records.Task Records"), '/planning/task-records/add', true)
                    // }
                >
                    <ARMForm onFinish={fetchData} form={form}>
                        {" "}
                        <Row gutter={20}>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item
                                    name="aircraftModelId"
                                    label={t("planning.A/C Type.Aircraft Model")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t(
                                                "planning.A/C Type.Please select Aircraft Model"
                                            ),
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder={t("planning.A/C Type.Select Aircraft model")}
                                        allowClear
                                    >
                                        {aircraftModels?.map((item, index) => {
                                            return (
                                                <Select.Option key={index} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item label="" name="modelName">
                                    <Input placeholder='Enter Model name'/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item label="" name="taskNo">
                                    <Input placeholder={t("planning.Task Records.Enter Task No")}/>
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
                                            <FilterOutlined/> {t("common.Filter")}
                                        </ARMButton>
                                        <ARMButton
                                            size="middle"
                                            type="primary"
                                            htmlType="submit"
                                            onClick={resetFilter}
                                        >
                                            <RollbackOutlined/> {t("common.Reset")}
                                        </ARMButton>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </ARMForm>
                    <ActiveInactive isActive={isActive} setIsActive={setIsActive}/>

                    <Row className="table-responsive">
                        <ARMTable>
                            <thead>
                            <tr>
                                <th rowSpan={2}>{t("planning.Task Records.Task No")}</th>
                                <th rowSpan={2}>{t("planning.Task Records.Task Source")}</th>
                                <th colSpan={3}>{t("planning.Task Records.Threshold")}</th>
                                <th colSpan={3}>{t("planning.Task Records.Interval")}</th>
                                <th width="200px" rowSpan={2}>
                                    {t("planning.Task Records.Effectivity Type")}
                                </th>
                                <th rowSpan={2}>{t("planning.Task Records.Sources")}</th>
                                <th rowSpan={2}>{t("planning.Task Records.Task Status")}</th>
                                <th rowSpan={2}>{t("common.Actions")}</th>
                            </tr>
                            <tr>
                                <th>{t("planning.Task Records.Hour")}</th>
                                <th>{t("planning.Task Records.Cycle")}</th>
                                <th>{t("planning.Task Records.Day")}</th>
                                <th>{t("planning.Task Records.Hour")}</th>
                                <th>{t("planning.Task Records.Cycle")}</th>
                                <th>{t("planning.Task Records.Day")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {collection?.map((task, index) => (
                                <tr key={index}>
                                    <td>{task.taskNo}</td>
                                    <td>{task.taskSource}</td>
                                    <td>
                                        {formatHour(task.thresholdHour, task.isApuControl)}
                                    </td>
                                    <td>
                                        {task.thresholdCycle}{" "}
                                        {formatCycle(task.thresholdCycle, task.isApuControl)}
                                    </td>
                                    <td>
                                        {task.thresholdDay} {task.thresholdDay ? "DY" : ""}
                                    </td>
                                    <td>
                                        {formatHour(task.intervalHour, task.isApuControl)}
                                    </td>
                                    <td>
                                        {task.intervalCycle}{" "}
                                        {formatCycle(task.intervalCycle, task.isApuControl)}
                                    </td>
                                    <td>
                                        {task.intervalDay} {task.intervalDay ? "DY" : ""}
                                    </td>
                                    <td>
                                        {aplicableAircrafts(task.effectiveAircraftViewModels)}
                                    </td>
                                    <td className='newLineInRow'>{task.sources}</td>
                                    <td>{convertStatus(task.status)}</td>
                                    <td>
                                        <Space size="small">
                                            <Link to={`view/${task.taskId}`}>
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
                                            {isActive ?
                                                <Link to={`edit/${task.taskId}`}>
                                                    <Permission
                                                        permission="PLANNING_SCHEDULE_TASKS_TASK_RECORDS_EDIT">
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
                                                </Link> : null
                                            }

                                            <Permission
                                                permission="PLANNING_SCHEDULE_TASKS_TASK_RECORDS_DELETE">
                                                <ActiveInactiveButton
                                                    isActive={isActive}
                                                    handleOk={async () => {
                                                        try {
                                                            await TaskRecordServices.toggleStatus(
                                                                task.taskId,
                                                                !task.isActive
                                                            );
                                                            notification["success"]({
                                                                message: "Status Changed Successfully!",
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

                    <Row>
                        <Col style={{margin: "0 auto"}}>
                            {collection.length === 0 ? (
                                <Row justify="end">
                                    <tbody>
                                    <Empty style={{marginTop: "10px"}}/>
                                    </tbody>
                                </Row>
                            ) : null}
                        </Col>
                    </Row>
                </ARMCard>
            </Permission>
        </CommonLayout>
    );
};

export default TaskRecords;
