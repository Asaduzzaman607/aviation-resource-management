import React, {useRef} from "react";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Form, Input, notification, Pagination, Row, Select, Space, Typography} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import ARMButton from "../../../common/buttons/ARMButton";
import {EditOutlined, EyeOutlined, FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import ActiveInactive from "../../../common/ActiveInactive";
import ARMTable from "../../../common/ARMTable";
import ActiveInactiveButton from "../../../common/buttons/ActiveInactiveButton";
import {usePaginate} from "../../../../lib/hooks/paginations";
import ARMForm from "../../../../lib/common/ARMForm";
import {arrayToCsv, downloadBlob, getErrorMessage, sleep} from "../../../../lib/common/helpers";
import TaskDoneServices from "../../../../service/TaskDoneServices";
import {useAircraftsList} from "../../../../lib/hooks/planning/aircrafts";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import Permission from "../../../auth/Permission";
import {FileUploadListHeader} from "../../../../lib/common/FileUploadListHeader";
import {notifyError, notifySuccess, notifyWarning} from "../../../../lib/common/notifications";
import AircraftBuildsService from "../../../../service/AircraftBuildsService";
import {useState} from "react";
import {isNull} from "lodash";
import CompanyLogo from "../../report/CompanyLogo";
import {
    ApuCycleDetailsWithFlag,
    ApuHourDetailsWithFlag,
    CycleFormatWithFlag,
    DateFormat,
    HourFormatWithName,
    ViewDateFormat2
} from "../../report/Common";
import {dateFormat} from "../../report/AirframeAndApplianceADStatus";
import {formatCycle, formatHour} from "../../report/AMPStatus";
import {useDownloadExcel} from "react-export-table-to-excel";
import AircraftService from "../../../../service/AircraftService";
import {utils, write} from "xlsx";
import {saveAs} from "file-saver";

const TaskDoneList = () => {
    const {
        form,
        collection,
        page,
        totalElements,
        paginate,
        fetchData,
        isActive,
        setIsActive,
        refreshPagination,
        resetFilter,
        size
    } =
        usePaginate("tasksDone", "task-done/search");

    const [getAircraftIdList, seAircraftIdList] = useState([]);
    const [file, setFile] = useState();
    const [isUploading, setIsUploading] = useState(false);
    const [fileUploadAircraftId, setFileUploadAircraftId] = useState(isNull);
    const [isDisabled, setIsDisabled] = useState(true);
    const aircraftId = Form.useWatch("aircraftId", form)
    const [isExport] = useState(2);


    const getAllAircraftList = async () => {
        try {
            const {data} = await AircraftService.getAllAircraftList();
            seAircraftIdList(data);
        } catch (er) {
        }
    };

    useEffect(() => {
        (async () => {
            await getAllAircraftList();
        })();
    }, [])

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
            return 'AC'
        }
        if (value && !isApu) {
            return 'FC'
        }
        return ''
    }

    const {t} = useTranslation()


    const handleFileUpload = async () => {
        try {
            setIsUploading(true);

            const data = await TaskDoneServices.saveFile(
                file,
                fileUploadAircraftId
            );
            refreshPagination();
            notifySuccess('Task done file uploaded successfully');
        } catch (er) {
            notifyError('Task done file uploading failed');
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
                    "task-done-file-error.csv",
                    "text/csv;charset=utf-8;"
                );
            }
        } finally {
            setIsUploading(false);
            setFile(false);
        }
    };



    const handleTaskDoneFormat = async () => {

        let table = [
            {
                A: "Task Number",
                B: "Part Number",
                C: "Serial Number",
                D: "Position Number",
                E: "Interval Typer",
                F: "Done Date",
                G: "Done Hour",
                H: "Initial Hour",
                I: "Done Cycle",
                J: "Initial Cycle",
                K: "Remark",
                L: "Status",
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
            { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3
            { width: 20, style: { fill: { fgColor: { rgb: 'FFFF0000' } } } }, // Column 3

        ];

        const workbook = {
            SheetNames: ['Ldnd'],
            Sheets: {
                Ldnd: Object.assign({}, sheet, { '!cols': columnStyles }),
            },
        };

        const fileBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
        saveAs(
            new Blob([fileBuffer], { type: 'application/octet-stream' }),
            'Task Done Excel Format.xlsx'
        );

    }


    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/planning">
                            <i className="fas fa-chart-line"/> &nbsp; {t("planning.Planning")}
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{t("planning.Task Done.Task Done")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="PLANNING_SCHEDULE_TASKS_TASK_DONE_SEARCH" showFallback>
                <ARMCard

                    title={
                        <FileUploadListHeader
                            aircraftId={fileUploadAircraftId}
                            handleFileChange={(file) => {
                                setFile(file.file.originFileObj);
                            }}
                            handleAircraftModel={(id) => {
                                setFileUploadAircraftId(id);
                                setIsDisabled(!isDisabled);
                            }}
                            handleFileUpload={handleFileUpload}
                            showUploadButton={!!file}
                            isUploading={isUploading}
                            url={`/planning/task-done-list/add`}
                            title={t("planning.Task Done.Task Done List")}
                            isAircraft={true}
                            getAircraftIdList={getAircraftIdList}
                            isDisabled={isDisabled}
                            WarningNotification={() => {
                                if (isDisabled === true) {
                                    notifyWarning(t("planning.Aircrafts.Select Aircraft"));
                                }
                            }}
                            exportExcelFormat={handleTaskDoneFormat}
                            taskDoneExcel={'taskDoneExcel'}
                            isExport={isExport}
                            permission="PLANNING_SCHEDULE_TASKS_TASK_DONE_SAVE"
                        />
                    }
                >
                    <ARMForm onFinish={fetchData} form={form} initialValues={{
                        aircraftId: null,
                        taskNo: '',
                    }}>
                        <Row gutter={20}>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item
                                    name="aircraftId"
                                    label={t("planning.Aircrafts.Aircraft")}
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please select Aircraft ",
                                        },
                                    ]}
                                >
                                    <Select placeholder={t("planning.Aircrafts.Select Aircraft")} allowClear>
                                        {getAircraftIdList?.map((item, index) => {
                                            return (
                                                <Select.Option key={index} value={item.aircraftId}>
                                                    {item.aircraftName}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12} lg={6}>
                                <Form.Item label="" name="taskNo">
                                    <Input placeholder={t("planning.Task Records.Enter Task No")}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item label="" name="remark">
                                    <Input placeholder=' Enter Remark'/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12} lg={6}>
                                <Form.Item name="size" label={t("common.Page Size")} initialValue="10">
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
                                        <ARMButton size="middle" type="primary" htmlType="submit" onClick={resetFilter}>
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
                                <th rowSpan={2}>{t("planning.Task Done.Task No")}</th>
                                <th colSpan={3}>{t("planning.Task Done.Last Done")}</th>
                                <th rowSpan={2}>Remark</th>
                                <th rowSpan={2}>{t("common.Actions")}</th>
                            </tr>

                            <tr>
                                <th>{t("planning.Task Done.Hour")}</th>
                                <th>{t("planning.Task Done.Cycle")}</th>
                                <th>{t("planning.Task Done.Date")}</th>

                            </tr>
                            </thead>
                            <tbody>
                            {collection?.map((task, index) => (
                                <tr key={index}>
                                    <td>{task.ampTaskNo}</td>
                                    <td>{formatHour(task.doneHour, task.isApuControl)}</td>
                                    <td>{task.doneCycle} {formatCycle(task.doneCycle, task.isApuControl)}</td>
                                    <td>{DateFormat(task.doneDate)}</td>
                                    <td>{task.remark}</td>
                                    <td>
                                        <Space size="small">
                                            <Link to={`view/${task.ldndId}`}>
                                                <ARMButton type="primary" size="small" style={{
                                                    backgroundColor: '#4aa0b5',
                                                    borderColor: '#4aa0b5',

                                                }}>
                                                    <EyeOutlined/>
                                                </ARMButton>
                                            </Link>
                                            {isActive? <Link to={`edit/${task.ldndId}`}>
                                                <Permission
                                                    permission="PLANNING_AIRCRAFT_MAINTENANCE_PROGRAM_TASK_DONE_EDIT">
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
                                            <Permission
                                                permission="PLANNING_AIRCRAFT_MAINTENANCE_PROGRAM_TASK_DONE_DELETE">
                                                <ActiveInactiveButton
                                                    isActive={isActive}
                                                    handleOk={async () => {
                                                        try {
                                                            await TaskDoneServices.toggleStatus(task.ldndId, !task.isActive);
                                                            notification['success']({message: t("common.Status Changed Successfully")});
                                                            refreshPagination();
                                                        } catch (e) {
                                                            notification['error']({message: getErrorMessage(e)});
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
                </ARMCard>
            </Permission>
        </CommonLayout>
    );
};

export default TaskDoneList;
