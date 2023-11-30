import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {
    Breadcrumb,
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    notification,
    Pagination,
    Row,
    Select,
    Space,
    Typography
} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import React, {createRef, useCallback, useEffect, useRef, useState} from "react";
import {useAircraftsList} from "../../../../lib/hooks/planning/aircrafts";
import ARMButton from "../../../common/buttons/ARMButton";
import {DownloadOutlined, FilterOutlined, PrinterOutlined, RollbackOutlined} from "@ant-design/icons";
import styled from "styled-components";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import {ARMReportTable} from "../ARMReportTable";
import CompanyLogo from "../CompanyLogo";
import DateTimeConverter from "../../../../converters/DateTimeConverter";
import {getErrorMessage, sleep} from "../../../../lib/common/helpers";
import {useBoolean} from "react-use";
import API from "../../../../service/Api";
import TaskDoneServices from "../../../../service/TaskDoneServices";
import {CustomInput, formatCycle} from "../AMPStatus";
import ReactToPrint from "react-to-print";
import SuccessButton from "../../../common/buttons/SuccessButton";
import {dateFormat} from "../AirframeAndApplianceADStatus";
import {
    ApuCycleDetailsWithFlag,
    ApuHourDetailsWithFlag,
    formatHour,
    getFolderPathByMatchedString,
    HourFormatWithName
} from "../Common";
import {notifyError} from "../../../../lib/common/notifications";
import Permission from "../../../auth/Permission";
import {useDownloadExcel} from "react-export-table-to-excel";
import TextArea from "antd/es/input/TextArea";
import {refreshTaskData} from "../../../../lib/common/refreshTaskData";


const TITLE = "Aircraft Hard Time Component Status";

interface Record {
    taskId: number;
    aircraftId: number;
    ata: string;
    mpdTask: string;
    taskSource: string;
    manHours: number;
    taskDescription?: any;
    isApuControl: boolean;
    intervalDay: number;
    intervalHour: number;
    intervalCycle: number;
    thresholdDay: number;
    thresholdHour: number;
    thresholdCycle: number;
    status: number;
    modelType: number;
    remark: string;
    ldndId: number;
    partNo: string;
    serialNo: string;
    doneDate: string;
    doneHour: number;
    doneCycle: number;
    dueDate: string;
    dueHour: number;
    dueCycle: number;
    remainingDay: number;
    remainingHour: number;
    remainingCycle: number;
    estimatedDueDate: string;
    isActive: boolean;
    location: string;
    taskType: string;
}

interface Report {
    model: Record[];
    totalPages: number;
    currentPage: number;
    totalElements: number;
    length: number
}


interface AircraftDetails {
    id: number;
    aircraftName: string;
    airframeSerial: string;
    acHour: number;
    acCycle: number;
    manufactureDate: string;
    averageHours: number;
    averageCycle: number;
    apuHours: number;
    apuCycle: number;
    aircraftModelName: string;
    updatedTime: string
}

const printStyle = `
*{
    margin: 0!important;
    padding: 0!important;
    font-size: 10px !important;
    overflow: visible !important;
  }
  .amp-title{
    font-size: 12px !important;
  }
  .border-bold,
  .border-bold td
  {
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
  }
  .pagination{
   display: none!important;
  }
  .page-of-report{
   visibility: visible!important;
   }
   .first{
    display: none !important;
  }
  .second{
    display: block !important;
  }
  
  table.report-container {
      page-break-after:always!important;
  }
  thead.report-header {
      display:table-header-group!important;
  }
`;


const ReportContainer = styled.div`

  .hard-table-header td {
    font-weight: normal;
  }

  .tb-header {
    font-weight: bold !important;
  }

  @media print {
    padding: 30px !important;
  }

  .title {
    text-transform: uppercase;
    background-color: #EBF1DE;
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: 2px solid;
    padding: 0;
  }

  .text {
    margin-top: -20px !important;
  }

  .page-of-report {
    visibility: hidden;
  }

  .second {
    display: none;
  }

  .none {
    border: none;
    visibility: hidden;
  }

  .border-none {
    border: none;
  }

  width: 100% !important;
`;

export default function AircraftHardTimeComponentStatus() {
    const reportRef = createRef<any>();
    const [form] = Form.useForm<any>();
    const {allAircrafts, getAllAircrafts} = useAircraftsList();
    const [submitting, toggleSubmitting] = useBoolean(false);
    const [data, setData] = useState<Report>({
        model: [],
        totalPages: 0,
        currentPage: 0,
        totalElements: 0,
        length: 0
    })
    const [aircraftApuDetails, setAircraftApuDetails] = useState<AircraftDetails>()
    const aircraftId = Form.useWatch('aircraftId', form);
    const [printData, setPrintData] = useState<any>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [printState, setPrintState] = useState(false)
    const dateRange = Form.useWatch('dateRange', form)
    const status = Form.useWatch('status', form)
    const taskSource = Form.useWatch('taskSource', form)
    const partNo = Form.useWatch('partNo', form)
    const serialNumber = Form.useWatch('serialNumber', form)
    const model = Form.useWatch('model', form)
    const intervalCycle = Form.useWatch('intervalCycle', form)
    const intervalHour = Form.useWatch('intervalHour', form)
    const intervalDay = Form.useWatch('intervalDay', form)
    const thCycle = Form.useWatch('thCycle', form)
    const thHour = Form.useWatch('thHour', form)
    const thDay = Form.useWatch('thDay', form)

    useEffect(() => {
        (async () => {
            await getAllAircrafts();

        })();
    }, [])

    const onHardTimeSearch = useCallback(async (values: any) => {

        const [fromDate, toDate] = values.dateRange || '';

        const searchValues = {
            aircraftId: values ? values.aircraftId : '',
            fromDate: DateTimeConverter.momentDateToString(fromDate) || '',
            toDate: DateTimeConverter.momentDateToString(toDate) || '',
            status: values ? values.status : '',
            taskSource: values ? values.taskSource : '',
            partNo: values ? values.partNo : '',
            serialNumber: values ? values.serialNumber : '',
            intervalCycle: values ? values.intervalCycle : '',
            intervalHour: values ? values.intervalHour : '',
            intervalDay: values ? values.intervalDay : '',
            thCycle: values ? values.thCycle : '',
            thHour: values ? values.thHour : '',
            thDay: values ? values.thDay : '',
            model: values ? values.model : '',
            isPageable: true
        };

        try {
            const {data} = await API.post(`task-report/hard-time-report?page=${currentPage}&size=${values.size}`, searchValues);
            setData(data);
            setCurrentPage(data.currentPage)
            setTotalPages(data.totalPages)

        } catch (error) {
            notification["error"]({message: getErrorMessage(error)});
        } finally {
            toggleSubmitting(false);
        }
    }, [currentPage, toggleSubmitting])

    const fetchPrintData = async () => {
        const [fromDate, toDate] = dateRange || ''
        const customValues = {
            aircraftId: aircraftId,
            fromDate: DateTimeConverter.momentDateToString(fromDate) || '',
            toDate: DateTimeConverter.momentDateToString(toDate) || '',
            status: status,
            partNo: partNo,
            serialNumber: serialNumber,
            taskSource: taskSource,
            intervalCycle: intervalCycle,
            intervalHour: intervalHour,
            intervalDay: intervalDay,
            thCycle: thCycle,
            thHour: thHour,
            thDay: thDay,
            model: model,
            isPageable: false
        }

        try {
            const {data} = await API.post(`task-report/hard-time-report`, customValues);
            setPrintData(data.model)
            setPrintState(true)
            return sleep(1000);
        } catch (error) {
            notifyError(error)
        }
    }

    useEffect(() => {
        if (!aircraftId) {
            return;
        }
        (async () => {
            await onHardTimeSearch(form.getFieldsValue(true));
        })();
    }, [onHardTimeSearch, printState, form]);


    const getAircraftApuDetailsById = async (aircraftId: number) => {
        try {
            const {data} = await TaskDoneServices.getAircraftApuDetailsById(
                aircraftId
            );


            setAircraftApuDetails({
                ...data,
                aircraftModelName: `${data.aircraftModelName} `,
                aircraftName: data.aircraftName,
                airframeSerial: data.airframeSerial,
                updatedTime: data.updatedTime
            });
        } catch (er) {
        }
    };

    useEffect(() => {

        if (!aircraftId) return;

        (async () => {
            await getAircraftApuDetailsById(aircraftId)
        })();

    }, [aircraftId]);


    const resetFilter = () => {
        form.resetFields();
        setData({
            model: [],
            totalPages: 0,
            currentPage: 0,
            totalElements: 0,
            length: 0
        });
        // @ts-ignore
        setAircraftApuDetails({})
    }

    const tableRef = useRef(null);
    const {onDownload} = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'Hard time component status report',
        sheet: 'hardTimeComponentStatusReport'
    })

    const handleExcelDownload = async () => {
        if (!aircraftId) return;
        await fetchPrintData()
        setPrintState(false)
        await sleep(1000);
        onDownload()

    }


    return <CommonLayout>
                <ARMBreadCrumbs>
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item>
                            <Link to="/planning">
                                <i className="fas fa-chart-line"/> &nbsp;Planning
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{TITLE}</Breadcrumb.Item>
                    </Breadcrumb>
                </ARMBreadCrumbs>
                <Permission permission="PLANNING_SCHEDULE_TASKS_AIRCRAFT_HARD_TIME_COMPONENT_STATUS_SEARCH" showFallback>
                <ARMCard
                    title={
                        <Row justify="space-between">
                            <Col>{TITLE}</Col>
                            <Col>

                                <Space>
                                    <Button icon={<DownloadOutlined/>} onClick={() => {
                                        handleExcelDownload();
                                    }}> Export excel </Button>

                                    <ReactToPrint
                                        content={() => reportRef.current}
                                        copyStyles={true}
                                        pageStyle={printStyle}
                                        trigger={() => (
                                            <SuccessButton type="primary" icon={<PrinterOutlined/>} htmlType="button">
                                                Print
                                            </SuccessButton>
                                        )}
                                        onBeforeGetContent={fetchPrintData}
                                    />
                                </Space>
                            </Col>
                        </Row>
                    }
                >

                    <Form form={form} name="filter-form" initialValues={{size: 10}} onFinish={onHardTimeSearch}>
                        <Row gutter={20}>
                            <Col xs={24} md={4}>
                                <Form.Item
                                    name="aircraftId"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Aircraft is required ",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Select Aircraft">
                                        {allAircrafts?.map((item: any, index) => {
                                            return (
                                                <Select.Option key={index} value={item.aircraftId}>
                                                    {item.aircraftName}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={4}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: false,
                                            message: "Date range is required",
                                        },
                                    ]}
                                    name="dateRange"
                                >
                                    <DatePicker.RangePicker format="DD-MM-YYYY" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={2}>
                                <CustomInput>
                                    <Form.Item
                                        label=""
                                        rules={[
                                            {
                                                required: false,
                                                message: "Model name is required",
                                            },
                                        ]}
                                        name="model"
                                    >
                                        <TextArea autoSize placeholder="Description"/>
                                    </Form.Item>
                                </CustomInput>
                            </Col>
                            <Col xs={24} md={3}>
                                <CustomInput>
                                    <Form.Item
                                        rules={[
                                            {
                                                required: false,
                                                message: "partNo  is required",
                                            },
                                        ]}
                                        name="partNo"
                                    >
                                        <Input  placeholder="Part No"/>
                                    </Form.Item>
                                </CustomInput>
                            </Col>
                            <Col xs={24} md={3}>
                                <CustomInput>
                                    <Form.Item
                                        rules={[
                                            {
                                                required: false,
                                                message: "serialNUmber is required",
                                            },
                                        ]}
                                        name="serialNumber"
                                    >
                                        <Input  placeholder="Serial No"/>
                                    </Form.Item>
                                </CustomInput>
                            </Col>

                            <Col xs={24} md={3}>
                                <CustomInput>
                                    <Form.Item
                                        label="Threshold"
                                        rules={[
                                            {
                                                required: false,
                                                message: "Threshold hour is required",
                                            },
                                        ]}
                                        name="thHour"
                                    >
                                        <Input type="number" placeholder="Hour"/>
                                    </Form.Item>
                                </CustomInput>
                            </Col>
                            <Col xs={24} md={2}>
                                <CustomInput>
                                    <Form.Item
                                        label=""
                                        rules={[
                                            {
                                                required: false,
                                                message: "Threshold hour is required",
                                            },
                                        ]}
                                        name="thCycle"
                                    >
                                        <Input type="number" placeholder="Cycle"/>
                                    </Form.Item>
                                </CustomInput>
                            </Col>

                            <Col xs={24} md={2}>
                                <CustomInput>
                                    <Form.Item
                                        rules={[
                                            {
                                                required: false,
                                                message: "Threshold hour is required",
                                            },
                                        ]}
                                        name="thDay"
                                    >
                                        <Input type="number" placeholder="Day"/>
                                    </Form.Item>
                                </CustomInput>
                            </Col>
                            <Col xs={24} md={3}>
                                <Form.Item
                                    label="Interval"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Interval hour is required",
                                        },
                                    ]}
                                    name="intervalHour"
                                >
                                    <Input type="number" placeholder="Hour"/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={2}>
                                <CustomInput>
                                    <Form.Item
                                        label=""
                                        rules={[
                                            {
                                                required: false,
                                                message: "Interval cycle is required",
                                            },
                                        ]}
                                        name="intervalCycle"
                                    >
                                        <Input type="number" placeholder="Cycle"/>
                                    </Form.Item>
                                </CustomInput>
                            </Col>

                            <Col xs={24} md={2}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: false,
                                            message: "Interval day is required",
                                        },
                                    ]}
                                    name="intervalDay"
                                >
                                    <Input type="number" placeholder="Day"/>
                                </Form.Item>

                            </Col>
                            <Col xs={24} md={4}>
                                <Form.Item name="size" label="Page Size">
                                    <Select id="antSelect" defaultValue={10}>
                                        <Select.Option value="10">10</Select.Option>
                                        <Select.Option value="20">20</Select.Option>
                                        <Select.Option value="30">30</Select.Option>
                                        <Select.Option value="40">40</Select.Option>
                                        <Select.Option value="50">50</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={6}>
                                <Form.Item>
                                    <Space>
                                        <ARMButton loading={submitting} size="middle" type="primary" htmlType="submit">
                                            <FilterOutlined name="filter"/> Filter
                                        </ARMButton>
                                        <ARMButton size="middle" type="primary" onClick={resetFilter}>
                                            <RollbackOutlined name="reset"/> Reset
                                        </ARMButton>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Row>
                        <Col xs={24} md={24}>
                            <ARMButton
                                onClick={refreshTaskData}
                                style={{
                                    marginTop: "6px",
                                    float: "right",
                                }}
                                type="primary"
                                htmlType="submit"
                            >
                                {"Refresh"}
                            </ARMButton>
                        </Col>
                    </Row>

                    <Row>

                        <ReportContainer ref={reportRef}>
                            <Col span={24} className="first">
                                <Row justify="space-between">
                                    <Col>
                                        <CompanyLogo/>
                                    </Col>
                                    <Col style={{fontSize: "10px"}}>
                                        <Typography.Text>Form : CAME-016</Typography.Text>
                                        <br/>
                                        <Typography.Text>ISSUE : INITIAL</Typography.Text>
                                        <br/>
                                        <Typography.Text>DATE : 19 Jan 2022</Typography.Text>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={24}>
                                <Row className="table-responsive">
                                    <ResponsiveTable className="first">
                                        <ARMReportTable className="hard-table-header">
                                            <table style={{width: "100%"}}>
                                                <tbody>
                                                <tr>
                                                    <td colSpan={2} rowSpan={4} className="none">empty</td>
                                                    <td rowSpan={3} colSpan={3} className="title">{TITLE}</td>
                                                    <td rowSpan={5} className="none">empty</td>
                                                    <td className="tb-header">A/C TYPE:</td>
                                                    <td>{aircraftApuDetails?.aircraftModelName}</td>

                                                    <td className="tb-header">TAT:</td>
                                                    <td>{aircraftApuDetails?.acHour ? aircraftApuDetails.acHour + ' FH' : 'N/A'}</td>

                                                    <td className="tb-header">AS OF</td>
                                                    <td>{dateFormat(aircraftApuDetails?.updatedTime)}</td>
                                                </tr>

                                                <tr>
                                                    <td className="tb-header">REGN:</td>
                                                    <td>{aircraftApuDetails?.aircraftName}</td>

                                                    <td className="tb-header">TAC:</td>
                                                    <td>{aircraftApuDetails?.acCycle ? aircraftApuDetails.acCycle + ' FC' : 'N/A'}</td>

                                                    <td className="tb-header">AVG FH:</td>
                                                    <td>{HourFormatWithName(aircraftApuDetails?.averageHours)}</td>
                                                </tr>

                                                <tr>
                                                    <td className="tb-header">MSN:</td>
                                                    <td>{aircraftApuDetails?.airframeSerial}</td>

                                                    <td className="tb-header">APU HOURS:</td>
                                                    <td>{ApuHourDetailsWithFlag(aircraftApuDetails?.apuHours)}</td>

                                                    <td className="tb-header">AVG FC:</td>
                                                    <td>{aircraftApuDetails?.averageCycle ? aircraftApuDetails.averageCycle + ' FC' : 'N/A'}</td>
                                                </tr>

                                                <tr>
                                                    <td colSpan={3} className="none">empty</td>
                                                    <td className="tb-header" style={{padding: "5px"}}>MFG DATE:</td>
                                                    <td>{dateFormat(aircraftApuDetails?.manufactureDate)}</td>

                                                    <td className="tb-header">APU CYCS:</td>
                                                    <td>{ApuCycleDetailsWithFlag(aircraftApuDetails?.apuCycle)}</td>

                                                    <td>-</td>
                                                    <td>-</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={14} className="none">empty</td>
                                                </tr>
                                                <tr className="hard-table-header">
                                                    <td className="tb-header">ATA</td>
                                                    <td className="tb-header">MPD TASK</td>
                                                    <td className="tb-header">DESCRIPTION</td>
                                                    <td className="tb-header">PART NUMBER</td>
                                                    <td className="tb-header">SERIAL NUMBER</td>
                                                    <td className="tb-header">LOCATION</td>
                                                    <td className="tb-header">THRESHOLD</td>
                                                    <td className="tb-header">INTERVAL</td>
                                                    <td className="tb-header">TASK TYPE</td>
                                                    <td className="tb-header">LAST DONE</td>
                                                    <td className="tb-header">NEXT DUE</td>
                                                    <td className="tb-header">REMAINING</td>
                                                    <td className="tb-header">ESTIMATED. <br/> DUE DATE</td>
                                                </tr>
                                                </tbody>
                                                <tbody style={{whiteSpace: 'nowrap'}}>
                                                {
                                                    data?.model?.map((d, index) => (
                                                        <tr key={index} className="amp-table amp-data-table"
                                                            style={{width: '100%'}}>
                                                            <td>{d.ata}</td>
                                                            <td onClick={() => {
                                                                getFolderPathByMatchedString(d.mpdTask)
                                                            }} style={{cursor: 'pointer', textDecoration: "underline"}}>
                                                                {d.mpdTask}
                                                            </td>
                                                            <td className='newLineInRow'>{d.taskDescription}</td>
                                                            <td>{d.partNo}</td>
                                                            <td>
                                                                {(d.serialNo)} <br/>
                                                            </td>
                                                            <td>{d.location}</td>
                                                            <td>{formatHour(d.thresholdHour, d?.isApuControl)} <br/>
                                                                {formatCycle(d.thresholdCycle, d?.isApuControl)} <br/>
                                                                {d.thresholdDay ? d.thresholdDay + ' DY' : d.thresholdDay === 0 ? 0 : 'N/A'}
                                                            </td>
                                                            <td>{formatHour(d.intervalHour, d?.isApuControl)} <br/>
                                                                {formatCycle(d.intervalCycle, d?.isApuControl)} <br/>
                                                                {d.intervalDay ? d.intervalDay + ' DY' : d.intervalDay === 0 ? 0 : 'N/A'}
                                                            </td>
                                                            <td>
                                                                {d.taskType}
                                                            </td>
                                                            <td> {formatHour(d.doneHour, d?.isApuControl)} <br/>
                                                                {formatCycle(d.doneCycle, d?.isApuControl)} <br/>
                                                                {dateFormat(d.doneDate)}</td>

                                                            <td>{formatHour(d.dueHour, d?.isApuControl)} <br/>
                                                                {formatCycle(d.dueCycle, d?.isApuControl)} <br/>
                                                                {dateFormat(d.dueDate)}</td>
                                                            <td>{formatHour(d.remainingHour, d?.isApuControl)} <br/>
                                                                {formatCycle(d.remainingCycle, d?.isApuControl)} <br/>
                                                                {d.remainingDay ? d.remainingDay + ' DY' : d.remainingDay === 0 ? 0 : 'N/A'}
                                                            </td>
                                                            <td>{dateFormat(d.estimatedDueDate)}</td>
                                                        </tr>
                                                    ))
                                                }
                                                </tbody>
                                            </table>
                                        </ARMReportTable>
                                    </ResponsiveTable>
                                    <ResponsiveTable className="second">
                                        <ARMReportTable className="hard-table-header">
                                            <table style={{width: "100%"}} ref={tableRef}>
                                                <thead className="report-header">
                                                {
                                                    printState ?
                                                        <>
                                                            <tr>
                                                                <td className="report-header-cell border-none"
                                                                    colSpan={14}>
                                                                    <div className="header-info">
                                                                        <Col span={24}>
                                                                            <Row justify="space-between">
                                                                                <Col>
                                                                                    <CompanyLogo/>
                                                                                </Col>
                                                                                <Col style={{
                                                                                    fontSize: "8px",
                                                                                    textAlign: "left",
                                                                                    lineHeight: "1"
                                                                                }}>
                                                                                    <Typography.Text>Form:
                                                                                        CAME-016</Typography.Text>
                                                                                    <br/>
                                                                                    <Typography.Text>ISSUE
                                                                                        INITIAL</Typography.Text>
                                                                                    <br/>
                                                                                    <Typography.Text>DATE 19 JAN
                                                                                        2022</Typography.Text>
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={14} className="none">empty</td>
                                                            </tr>
                                                        </>
                                                        :
                                                        <>
                                                            <tr>
                                                                <td className="report-header-cell border-none"
                                                                    colSpan={14}>
                                                                    <div className="header-info">
                                                                        <Col span={24}>
                                                                            <Row justify="space-between">
                                                                                <Col style={{
                                                                                    fontSize: "8px",
                                                                                    textAlign: "left",
                                                                                    lineHeight: "1"
                                                                                }}>
                                                                                    <Typography.Text>Form:
                                                                                        CAME-016</Typography.Text>
                                                                                    <br/>
                                                                                    <Typography.Text>ISSUE
                                                                                        INITIAL</Typography.Text>
                                                                                    <br/>
                                                                                    <Typography.Text>DATE 19 JAN
                                                                                        2022</Typography.Text>
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </>
                                                }
                                                <tr>
                                                    {printState ?
                                                        <td colSpan={2} rowSpan={4} className="none">empty</td> :
                                                        <td colSpan={2} rowSpan={4} className="none"></td>}
                                                    <td rowSpan={3} colSpan={3} className="title">{TITLE}</td>
                                                    {printState ? <td rowSpan={5} className="none">empty</td> :
                                                        <td rowSpan={5} className="none"></td>}
                                                    <td className="border-bold">A/C TYPE:</td>
                                                    <td className="border-bold">{aircraftApuDetails?.aircraftModelName}</td>
                                                    <td className="border-bold">TAT:</td>
                                                    <td className="border-bold">{aircraftApuDetails?.acHour ? aircraftApuDetails.acHour + ' FH' : 'N/A'}</td>
                                                    <td className="border-bold">AS OF</td>
                                                    <td className="border-bold">{dateFormat(aircraftApuDetails?.updatedTime)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border-bold">REGN:</td>
                                                    <td className="border-bold">{aircraftApuDetails?.aircraftName}</td>
                                                    <td className="border-bold">TAC:</td>
                                                    <td className="border-bold">{aircraftApuDetails?.acCycle ? aircraftApuDetails.acCycle + ' FC' : 'N/A'}</td>
                                                    <td className="border-bold">AVG FH:</td>
                                                    <td className="border-bold">{HourFormatWithName(aircraftApuDetails?.averageHours)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border-bold">MSN:</td>
                                                    <td className="border-bold">{aircraftApuDetails?.airframeSerial}</td>
                                                    <td className="border-bold">APU HOURS:</td>
                                                    <td className="border-bold">{ApuHourDetailsWithFlag(aircraftApuDetails?.apuHours)}</td>
                                                    <td className="border-bold">AVG FC:</td>
                                                    <td className="border-bold">{aircraftApuDetails?.averageCycle ? aircraftApuDetails.averageCycle + ' FC' : 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    {printState ? <td colSpan={3} className="none">empty</td> :
                                                        <td colSpan={3} className="none"></td>}
                                                    <td className="border-bold" style={{padding: "5px"}}>MFG DATE:</td>
                                                    <td className="border-bold">{dateFormat(aircraftApuDetails?.manufactureDate)}</td>
                                                    <td className="border-bold">APU CYCS:</td>
                                                    <td className="border-bold">{ApuCycleDetailsWithFlag(aircraftApuDetails?.apuCycle)}</td>
                                                    <td className="border-bold">-</td>
                                                    <td className="border-bold">-</td>
                                                </tr>
                                                <tr>
                                                    {printState ? <td colSpan={14} className="none">empty</td> :
                                                        <td colSpan={14} className="none"></td>}
                                                </tr>
                                                <tr className="hard-table-header border-bold">
                                                    <td>ATA</td>
                                                    <td>MPD TASK</td>
                                                    <td>DESCRIPTION</td>
                                                    <td>PART NUMBER</td>
                                                    <td>SERIAL NUMBER</td>
                                                    <td>LOCATION</td>
                                                    <td>THRESHOLD</td>
                                                    <td>INTERVAL</td>
                                                    <td>TASK TYPE</td>
                                                    <td>LAST DONE</td>
                                                    <td>NEXT DUE</td>
                                                    <td>REMAINING</td>
                                                    <td>ESTIMATED. <br/> DUE DATE</td>
                                                </tr>
                                                </thead>
                                                <tbody style={{whiteSpace: 'nowrap'}}>
                                                {
                                                    printData?.map((d: any, index: number) => (
                                                        <tr key={index} className="amp-table amp-data-table border-bold"
                                                            style={{width: '100%'}}>
                                                            <td>{d.ata}</td>
                                                            <td>{d.mpdTask}</td>
                                                            <td className='newLineInRow'>{d.taskDescription}</td>
                                                            <td>{d.partNo}</td>
                                                            <td>
                                                                {(d.serialNo)} <br/>
                                                            </td>
                                                            <td>{d.location}</td>
                                                            <td>{formatHour(d.thresholdHour, d?.isApuControl)} <br/>
                                                                {formatCycle(d.thresholdCycle, d?.isApuControl)} <br/>
                                                                {d.thresholdDay ? d.thresholdDay + ' DY' : d.thresholdDay === 0 ? 0 : 'N/A'}
                                                            </td>
                                                            <td>{formatHour(d.intervalHour, d?.isApuControl)} <br/>
                                                                {formatCycle(d.intervalCycle, d?.isApuControl)} <br/>
                                                                {d.intervalDay ? d.intervalDay + ' DY' : d.intervalDay === 0 ? 0 : 'N/A'}
                                                            </td>
                                                            <td>
                                                                {d.taskType}
                                                            </td>
                                                            <td> {formatHour(d.doneHour, d?.isApuControl)} <br/>
                                                                {formatCycle(d.doneCycle, d?.isApuControl)} <br/>
                                                                {dateFormat(d.doneDate)}</td>

                                                            <td>{formatHour(d.dueHour, d?.isApuControl)} <br/>
                                                                {formatCycle(d.dueCycle, d?.isApuControl)} <br/>
                                                                {dateFormat(d.dueDate)}</td>
                                                            <td>{formatHour(d.remainingHour, d?.isApuControl)} <br/>
                                                                {formatCycle(d.remainingCycle, d?.isApuControl)} <br/>
                                                                {d.remainingDay ? d.remainingDay + ' DY' : d.remainingDay === 0 ? 0 : 'N/A'}
                                                            </td>
                                                            <td>{dateFormat(d.estimatedDueDate)}</td>
                                                        </tr>
                                                    ))
                                                }
                                                </tbody>
                                            </table>
                                        </ARMReportTable>
                                    </ResponsiveTable>
                                </Row>
                            </Col>

                            {
                                data?.model?.length > 0 && (
                                    <Row justify="center" className="pagination">
                                        <Col style={{marginTop: 10}}>
                                            <Pagination current={currentPage} onChange={setCurrentPage} pageSize={10}
                                                        total={totalPages * 10}/>
                                        </Col>
                                    </Row>
                                )
                            }

                        </ReportContainer>
                    </Row>

                </ARMCard>
        </Permission>
    </CommonLayout>;
}