import {DownloadOutlined, FilterOutlined, PrinterOutlined, RollbackOutlined} from "@ant-design/icons";
import {Breadcrumb, Col, DatePicker, Form, Pagination, Row, Select, Space, Typography, Input, Button} from "antd";
import {createRef, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import ReactToPrint from "react-to-print";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import SuccessButton from "../../../common/buttons/SuccessButton";
import CommonLayout from "../../../layout/CommonLayout";
import styled from "styled-components";
import logo from "../../../../components/images/us-bangla-logo.png";
import {ARMReportTable} from "../ARMReportTable";
import {useAircraftsList} from "../../../../lib/hooks/planning/aircrafts";
import {useBoolean} from "react-use";
import API from "../../../../service/Api";
import ARMButton from "../../../common/buttons/ARMButton";
import React from "react";
import DateTimeConverter from "../../../../converters/DateTimeConverter";
import {useCallback} from "react";
import TaskDoneServices from "../../../../service/TaskDoneServices";
import {dateFormat} from "../AirframeAndApplianceADStatus";
import {
    ApuCycleDetailsWithFlag,
    ApuHourDetailsWithFlag,
    CycleFormatWithFlag, getFolderPathByMatchedString,
    HourFormatWithName, pageSerialNoWithSize,
    ViewDateFormat2
} from "../Common";
import {sleep} from "../../../../lib/common/helpers";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import CompanyLogo from "../CompanyLogo";
import Permission from "../../../auth/Permission";
import {useDownloadExcel} from "react-export-table-to-excel";
import {notifyResponseError} from "../../../../lib/common/notifications";
import RevisionServices from "../../../../service/RevisionServices";
import {refreshTaskData} from "../../../../lib/common/refreshTaskData";


const printStyle = `
*{
  margin: 0!important;
  padding: 0!important;
  font-size: 10px!important;
  overflow: visible!important;
}
  .amp-data-table,
  .amp-data,
  .amp-data-table td{
    font-size: 8px !important;
  }
  .amp-title{
    font-size: 12px !important;
  }
  .amp-table td
  {
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
  }
  .pagination{
   display: none!important;
  }
   .first{
     display: none !important;
   }
   .second{
     display: block !important;
     margin: 10px 0 !important;
   }
   
   table.report-container {
       page-break-after:always!important;
   }
   thead.report-header {
       display:table-header-group!important;
   }
   tbody tr td{
     padding: 0!important;
   }
   @page{ size: landscape!important; }
`;

const AMP = styled.div`

  .amp-table-header td {
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
    font-weight: bold;
  }

  .amp-data {
    font-weight: bold !important;
  }

  .none {
    border: none;
    visibility: hidden;
  }

  .border-none {
    border: none;
  }

  .second {
    display: none;
  }

  tbody tr td {
    padding: 0;
  }
`;

export const CustomInput = styled(Form.Item)`
  .ant-input-number-input-wrap {
    margin-right: 10px !important;
  }

`


const TITLE = 'AMP Status';


export const formatHour = (value, isApu) => {
    if (value && isApu) {
        return value.toFixed(2).replace(".", ":") + "AH"
    }
    if (value && !isApu) {
        return value.toFixed(2).replace(".", ":") + "FH"
    }
    return 'N/A'
}


export const formatCycle = (value, isApu) => {
    if (value && isApu) {
        return `${value} AC`
    }
    if (value && !isApu) {
        return `${value} FC`
    }
    return 'N/A'
}


export default function AMPStatus({toggleTab}) {


    const [form] = Form.useForm();
    const {allAircrafts, getAllAircrafts} = useAircraftsList()
    const [submitting, toggleSubmitting] = useBoolean(false);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const reportRef = createRef();
    const [printData, setPrintData] = useState([]);
    const [ampRevision, setAmpRevision] = useState([]);
    const [printState, setPrintState] = useState(false);
    const pageSize = Form.useWatch('size', form);
    const [aircraftApuDetails, setAircraftApuDetails] = useState({})
    const aircraftId = Form.useWatch('aircraftId', form);
    const status = Form.useWatch('status', form);
    const taskSource = Form.useWatch('taskSource', form);
    const intervalCycle = Form.useWatch('intervalCycle', form);
    const intervalHour = Form.useWatch('intervalHour', form);
    const intervalDay = Form.useWatch('intervalDay', form);
    const thCycle = Form.useWatch('thCycle', form);
    const thHour = Form.useWatch('thHour', form);
    const thDay = Form.useWatch('thDay', form);
    const ampTaskNo = Form.useWatch('ampTaskNo', form);
    const dateRange = Form.useWatch("dateRange", form);
    const [fromDate, toDate] = dateRange || "";


    let fixedTableRow = 20;
    let dataTableRow = data?.model?.length;
    let remainingTableRow = fixedTableRow - dataTableRow;
    if (data?.model?.length > 0) {
        for (let i = 0; i < remainingTableRow; i++) {
            data?.model?.push("");
        }
    }


    const handleSubmit = useCallback(
        async (values) => {

            const [fromDate, toDate] = values.dateRange || '';

            const searchKeys = {
                aircraftId: values ? values.aircraftId : '',
                fromDate: DateTimeConverter.momentDateToString(fromDate) || '',
                toDate: DateTimeConverter.momentDateToString(toDate) || '',
                status: values ? values.status : '',
                taskSource: values ? values.taskSource : '',
                intervalCycle: values ? values.intervalCycle : '',
                intervalHour: values ? values.intervalHour : '',
                intervalDay: values ? values.intervalDay : '',
                thCycle: values ? values.thCycle : '',
                thHour: values ? values.thHour : '',
                thDay: values ? values.thDay : '',
                ampTaskNo: values ? values.ampTaskNo : '',
                isPageable: true
            }

            if(!values.aircraftId) return


            try {
                toggleSubmitting();
                const {data} = await API.post(`task-report/ldnd?page=${currentPage}&size=${values.size}`, searchKeys)
                setData(data.model)
                setCurrentPage(data?.currentPage);
                setTotalPages(data?.totalPages);
                toggleSubmitting();
            } catch (e) {
                notifyResponseError(e)
            }
        },
        [currentPage]
    );

    const fetchPrintData = async () => {
        const dataWithoutPagination = {
            aircraftId: aircraftId,
            fromDate: DateTimeConverter.momentDateToString(fromDate) || '',
            toDate: DateTimeConverter.momentDateToString(toDate) || '',
            status: status ? status : '',
            taskSource: taskSource ? taskSource : '',
            intervalCycle: intervalCycle ? intervalCycle : '',
            intervalHour: intervalHour ? intervalHour : '',
            intervalDay: intervalDay ? intervalDay : '',
            thCycle: thCycle ? thCycle : '',
            thHour: thHour ? thHour : '',
            thDay: thDay ? thDay : '',
            ampTaskNo: ampTaskNo ? ampTaskNo : '',
            isPageable: false,
        };
        try {
            const {data} = await API.post(
                `task-report/ldnd`,
                dataWithoutPagination
            );
            setPrintData(data);
            setPrintState(true);
            return sleep(1000);
        } catch (er) {
        }
    };

    useEffect(() => {
        (async () => {
            await handleSubmit(form.getFieldsValue(true));
        })();
    }, [handleSubmit, form]);


    const getAircraftApuDetailsById = async (aircraftId) => {
        try {
            const {data} = await TaskDoneServices.getAircraftApuDetailsById(
                aircraftId
            );


            setAircraftApuDetails({
                ...data,
                aircraftModelName: `(${data.aircraftModelName}) `,
                aircraftName: data.aircraftName + ", ",
                airframeSerial: data.airframeSerial,
            });
        } catch (er) {
            notifyResponseError(er)
        }
    };

    const getAmpRevisions = async () => {
        try {
            const {data} = await RevisionServices.getAmpRevision();
            const amp = data?.model.filter(({headerKey}) => headerKey === 'AMP_HEADER')
            setAmpRevision(amp);
        } catch (er) {
            notifyResponseError(er)
        }
    };


    useEffect(() => {

        if (!aircraftId) return;

        (async () => {
            await getAircraftApuDetailsById(aircraftId)
            await getAmpRevisions(aircraftId)
        })();

    }, [aircraftId]);


    useEffect(() => {
        (async () => {
            await getAllAircrafts();
        })();
    }, [getAllAircrafts])


    const resetFilter = () => {
        form.resetFields();
        setData([]);
        setAircraftApuDetails({})
        setAmpRevision([])

    }


    const hardTime = [
        {'id': 0},
        {'id': 5},
        {'id': 7},
        {'id': 8},
        {'id': 11}
    ]

    const tableRef = useRef(null);
    const {onDownload} = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'AMP status report',
        sheet: 'ampStatusReport'
    })

    const handleExcelDownload = async () => {

        if (!aircraftId) return
        await fetchPrintData()
        setPrintState(false)
        await sleep(1000);
        onDownload()

    }


    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/planning" onClick={() => toggleTab(1)}>
                            <i className="fas fa-chart-line"/> &nbsp;Planning
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{TITLE}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="PLANNING_SCHEDULE_TASKS_AMP_STATUS_SEARCH" showFallback>
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

                    <Form form={form} name="filter-form" initialValues={{size: 10}} onFinish={handleSubmit}>
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
                                        {allAircrafts?.map((item, index) => {
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
                                <Form.Item
                                    rules={[
                                        {
                                            required: false,
                                            message: "Task No is required",
                                        },
                                    ]}
                                    name="ampTaskNo"
                                >
                                    <Input max={55} placeholder={'Enter Task No'}/>
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
                                size="medium"
                                type="primary"
                                htmlType="submit"
                            >
                                {"Refresh"}
                            </ARMButton>
                        </Col>
                    </Row>
                    <div ref={reportRef}>
                        <AMP>
                            <Row className="first">
                                <Col span={24}>
                                    <Row justify="space-between">
                                        <Col>
                                            <img src={logo} alt="" width={110}/>
                                        </Col>
                                        <Col style={{
                                            fontSize: "8px",
                                            fontWeight: "bold",
                                            marginRight: "80px",
                                            marginBottom: "10px"
                                        }}>
                                            <Typography.Text>Form : CAME-018</Typography.Text> <br/>
                                            <Typography.Text>ISSUE : INITIAL</Typography.Text> <br/>
                                            <Typography.Text>DATE : 19 Jan 2022</Typography.Text>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <ARMReportTable className="first">
                                <tbody>
                                <tr className="amp-table">
                                    <td colSpan={3} className="none">
                                        empty
                                    </td>
                                    <td colSpan={3} style={{fontWeight: "bold"}} className="amp-title">
                                        AMP STATUS
                                    </td>
                                    <td className="none">
                                        empty
                                    </td>
                                    <td className="amp-data">DATE</td>
                                    <td className="amp-data">A/C HOURS</td>
                                    <td className="amp-data">A/C CYCLES</td>
                                    <td className="amp-data">APU HOURS</td>
                                    <td className="amp-data">APU CYCLES</td>
                                    <td className="amp-data">AVG /FH:</td>
                                    <td
                                        className="amp-data">{HourFormatWithName(aircraftApuDetails?.averageHours)}</td>
                                </tr>
                                <tr className="amp-table">
                                    <td className="none">empty</td>
                                    <td rowSpan={4} style={{fontWeight: "bold"}} className="amp-data-table">
                                        BLOCK NO.: N/A <br/>
                                        EFF. CODE : N/A <br/>
                                        LINE NO.: N/A <br/>
                                        DOM: {ViewDateFormat2(aircraftApuDetails?.manufactureDate)}
                                    </td>
                                    <td className="none">empty</td>
                                    <td colSpan={3} style={{fontWeight: "bold"}} className="amp-title">

                                        {aircraftApuDetails.aircraftModelName} {aircraftApuDetails.aircraftName} {aircraftApuDetails.airframeSerial}


                                    </td>
                                    <td className="none">
                                        empty
                                    </td>
                                    <td className="amp-data">{dateFormat(aircraftApuDetails?.updatedTime)}</td>
                                    <td className="amp-data">{HourFormatWithName(aircraftApuDetails?.acHour)}</td>
                                    <td className="amp-data">{CycleFormatWithFlag(aircraftApuDetails?.acCycle)}</td>
                                    <td className="amp-data">{ApuHourDetailsWithFlag(aircraftApuDetails?.apuHours)}</td>
                                    <td className="amp-data">{ApuCycleDetailsWithFlag(aircraftApuDetails?.apuCycle)}</td>
                                    <td className="amp-data">AVG/ FC:</td>
                                    <td
                                        className="amp-data">{aircraftApuDetails?.averageCycle ? aircraftApuDetails.averageCycle + ' FC' : aircraftApuDetails.averageCycle === 0 ? 0 : 'N/A'} </td>
                                </tr>
                                <tr className="amp-table amp-data-table">
                                    <td className="none">empty</td>
                                    <td className="none">empty</td>
                                    <td colSpan={3} style={{fontWeight: "bold"}}>
                                        {ampRevision[0]?.headerValue || 'N/A'}
                                    </td>
                                    <td colSpan={6} className="none">
                                        empty
                                    </td>
                                </tr>
                                <tr>
                                    <td className="none">empty</td>
                                    <td colSpan={10} className="none">
                                        empty
                                    </td>
                                </tr>
                                <tr>
                                    <td className="none">empty</td>
                                    <td colSpan={10} className="none">
                                        empty
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={12} className="none">
                                        empty
                                    </td>
                                </tr>
                                <tr className="amp-table-header amp-data-table">
                                    <td>S/L</td>
                                    <td>AMP TASK NUMBER</td>
                                    <td>TASK TYPE</td>
                                    <td>THRESHOLD</td>
                                    <td>INTERVAL</td>
                                    <td>
                                        MAN-HOURS
                                        {/* <br /> */}

                                    </td>
                                    <td colSpan={2}>TASK DESCRIPTION</td>
                                    <td>LAST DONE</td>
                                    <td>NEXT DUE</td>
                                    <td>REMAINING</td>
                                    <td>
                                        ESTIMATED <br/> DUE DATE
                                    </td>
                                    <td colSpan={2}>
                                        REMARKS
                                    </td>
                                </tr>
                                {data?.map((d, index) => (
                                    <tr key={index} className="amp-table amp-data-table" style={{width: '100%'}}>
                                        <td>{pageSerialNoWithSize(currentPage, pageSize, index + 1)}</td>
                                        <td onClick={() => {
                                            getFolderPathByMatchedString(d.ampTaskNo)
                                        }}
                                            style={{cursor: 'pointer', textDecoration: "underline"}}>
                                            {d.ampTaskNo}
                                        </td>
                                        <td>{d.taskType}</td>
                                        <td>
                                            {formatHour(d.thresholdHour, d?.isApuControl)}<br/>
                                            {formatCycle(d.thresholdCycle, d?.isApuControl)} <br/>
                                            {d.thresholdDay ? d.thresholdDay + ' DY' : d.thresholdDay === 0 ? 0 : 'N/A'}
                                        </td>
                                        <td>
                                            {formatHour(d.intervalHour, d?.isApuControl)} <br/>
                                            {formatCycle(d.intervalCycle, d?.isApuControl)} <br/>
                                            {d.intervalDay ? d.intervalDay + ' DY' : d.intervalDay === 0 ? 0 : 'N/A'}
                                        </td>

                                        <td>{d?.manHours}</td>
                                        <td colSpan={2} className='newLineInRow'>{d?.taskDescription}</td>
                                        <td>
                                            {formatHour(d.doneHour, d?.isApuControl)} <br/>
                                            {formatCycle(d.doneCycle, d?.isApuControl)} <br/>
                                            {dateFormat(d.doneDate)}
                                        </td>
                                        <td>

                                            {formatHour(d.dueHour, d?.isApuControl)} <br/>
                                            {formatCycle(d.dueCycle, d?.isApuControl)} <br/>
                                            {dateFormat(d.dueDate)}
                                        </td>
                                        <td>
                                            {formatHour(d.remainingHour, d?.isApuControl)} <br/>
                                            {formatCycle(d.remainingCycle, d?.isApuControl)} <br/>
                                            {d.remainingDay ? d.remainingDay + " DY" : d.remainingDay === 0 ? 0 : "N/A"}
                                        </td>
                                        <td>{dateFormat(d.estimatedDueDate)}</td>

                                        {
                                            hardTime.find(v => v.id === d.modelType) ?
                                                <td colSpan={2}>
                                                    {d.partNo !== null && 'Part No : ' + d.partNo} {d.partNo !== null &&
                                                    <br/>}
                                                    {d.serialNo !== null && 'Serial No : ' + d.serialNo} {d.serialNo !== null &&
                                                    <br/>}
                                                    {d.position !== null && 'Position : ' + d.position} {d.position !== null &&
                                                    <br/>}
                                                    {d.remark !== null && 'Remark : ' + d.remark}
                                                </td>
                                                :
                                                <td colSpan={2}>
                                                    {d.remark !== null && d.remark}
                                                </td>
                                        }
                                    </tr>
                                ))}
                                </tbody>
                            </ARMReportTable>
                            <ResponsiveTable className="second">
                                <ARMReportTable>
                                    <table className="report-container" style={{width: "100%"}} ref={tableRef}>
                                        <thead className="report-header">
                                        <tr>
                                            <td className="report-header-cell border-none" colSpan={14}>
                                                <div className="header-info">
                                                    <Row justify="space-between">
                                                        {printState ? <Col>
                                                                <CompanyLogo/>
                                                            </Col>
                                                            :
                                                            <Col>

                                                            </Col>}
                                                        <Col style={{
                                                            fontSize: "8px",
                                                            textAlign: "left",
                                                            lineHeight: "1"
                                                        }}>
                                                            <Typography.Text>Form: CAME-027</Typography.Text>
                                                            <br/>
                                                            <Typography.Text>ISSUE INITIAL</Typography.Text>
                                                            <br/>
                                                            <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            {printState ? <td colSpan={14} style={{display: "none"}}>
                                                empty
                                            </td> : <td colSpan={14} style={{display: "none"}}>

                                            </td>}
                                        </tr>
                                        <tr className="amp-table">
                                            {printState ? <td colSpan={3} className="none">
                                                    empty
                                                </td>
                                                :
                                                <td colSpan={3} className="none">

                                                </td>}
                                            <td colSpan={3} style={{fontWeight: "bold"}} className="amp-title">
                                                AMP STATUS
                                            </td>
                                            {printState ? <td className="none">
                                                    empty
                                                </td>
                                                :
                                                <td className="none">

                                                </td>}
                                            <td className="amp-data">DATE</td>
                                            <td className="amp-data">A/C HOURS</td>
                                            <td className="amp-data">A/C CYCLES</td>
                                            <td className="amp-data">APU HOURS</td>
                                            <td className="amp-data">APU CYCLES</td>
                                            <td className="amp-data">AVG /FH:</td>
                                            <td
                                                className="amp-data">{HourFormatWithName(aircraftApuDetails?.averageHours)}</td>
                                        </tr>
                                        <tr className="amp-table">
                                            {printState ? <td className="none">empty</td> : <td className="none"></td>}
                                            <td rowSpan={4} style={{fontWeight: "bold"}} className="amp-data-table">
                                                BLOCK NO.: N/A <br/>
                                                EFF. CODE : N/A <br/>
                                                LINE NO.: N/A <br/>
                                                DOM: {ViewDateFormat2(aircraftApuDetails?.manufactureDate)}
                                            </td>
                                            {printState ? <td className="none">empty</td> : <td className="none"></td>}
                                            <td colSpan={3} style={{fontWeight: "bold"}} className="amp-title">

                                                {aircraftApuDetails.aircraftModelName} {aircraftApuDetails.aircraftName} {aircraftApuDetails.airframeSerial}


                                            </td>
                                            {printState ? <td className="none">
                                                empty
                                            </td> : <td className="none">

                                            </td>}
                                            <td className="amp-data">{dateFormat(aircraftApuDetails?.updatedTime)}</td>
                                            <td className="amp-data">{HourFormatWithName(aircraftApuDetails?.acHour)}</td>
                                            <td className="amp-data">{CycleFormatWithFlag(aircraftApuDetails?.acCycle)}</td>
                                            <td className="amp-data">{ApuHourDetailsWithFlag(aircraftApuDetails?.apuHours)}</td>
                                            <td className="amp-data">{ApuCycleDetailsWithFlag(aircraftApuDetails?.apuCycle)}</td>
                                            <td className="amp-data">AVG/ FC:</td>
                                            <td
                                                className="amp-data">{aircraftApuDetails?.averageCycle ? aircraftApuDetails.averageCycle + ' FC' : aircraftApuDetails.averageCycle === 0 ? 0 : 'N/A'} </td>
                                        </tr>
                                        {printState ? <tr className="amp-table amp-data-table">
                                                <td className="none">empty</td>
                                                <td className="none">empty</td>
                                                <td colSpan={3} style={{fontWeight: "bold"}}>
                                                    AMP ISSUE 02 REVISION - 00 (DT. 01-06-2022), MRB REV. 28 &amp; MPD REV
                                                    34
                                                </td>
                                                <td colSpan={6} className="none">
                                                    empty
                                                </td>
                                            </tr>
                                            :
                                            <tr className="amp-table amp-data-table">
                                                <td className="none"></td>
                                                <td className="none"></td>
                                                <td colSpan={3} style={{fontWeight: "bold"}}>
                                                    AMP ISSUE 02 REVISION - 00 (DT. 01-06-2022), MRB REV. 28 &amp; MPD
                                                    REV 34
                                                </td>
                                                <td colSpan={6} className="none">

                                                </td>
                                            </tr>}
                                        {printState ? <tr>
                                            <td className="none">empty</td>
                                            <td colSpan={10} className="none">
                                                empty
                                            </td>
                                        </tr> : <tr>
                                            <td className="none"></td>
                                            <td colSpan={10} className="none">

                                            </td>
                                        </tr>}
                                        {printState ? <tr>
                                            <td className="none">empty</td>
                                            <td colSpan={10} className="none">
                                                empty
                                            </td>
                                        </tr> : <tr>
                                            <td className="none"></td>
                                            <td colSpan={10} className="none">

                                            </td>
                                        </tr>}
                                        <tr>
                                            {printState ? <td colSpan={12} className="none">
                                                empty
                                            </td> : <td colSpan={12} className="none">

                                            </td>}
                                        </tr>
                                        <tr className="amp-table-header amp-data-table">
                                            <td>S/L</td>
                                            <td>AMP TASK NUMBER</td>
                                            <td>TASK TYPE</td>
                                            <td>THRESHOLD</td>
                                            <td>INTERVAL</td>
                                            <td>
                                                MAN-HOURS
                                                {/* <br /> */}

                                            </td>
                                            <td colSpan={2}>TASK DESCRIPTION</td>
                                            <td>LAST DONE</td>
                                            <td>NEXT DUE</td>
                                            <td>REMAINING</td>
                                            <td>
                                                ESTIMATED <br/> DUE DATE
                                            </td>
                                            <td colSpan={2}>
                                                REMARKS
                                            </td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {printData?.model?.map((d, index) => (
                                            <tr key={index} className="amp-table amp-data-table"
                                                style={{width: '100%'}}>
                                                <td>{index + 1}</td>
                                                <td>{d.ampTaskNo}</td>
                                                <td>{d.taskType}</td>
                                                <td>
                                                    {formatHour(d.thresholdHour, d?.isApuControl)}<br/>
                                                    {formatCycle(d.thresholdCycle, d?.isApuControl)} <br/>
                                                    {d.thresholdDay ? d.thresholdDay + ' DY' : d.thresholdDay === 0 ? 0 : 'N/A'}
                                                </td>
                                                <td>
                                                    {formatHour(d.intervalHour, d?.isApuControl)} <br/>
                                                    {formatCycle(d.intervalCycle, d?.isApuControl)} <br/>
                                                    {d.intervalDay ? d.intervalDay + ' DY' : d.intervalDay === 0 ? 0 : 'N/A'}
                                                </td>

                                                <td>{d?.manHours}</td>
                                                <td colSpan={2} className='newLineInRow'>{d?.taskDescription}</td>
                                                <td>
                                                    {formatHour(d.doneHour, d?.isApuControl)} <br/>
                                                    {formatCycle(d.doneCycle, d?.isApuControl)} <br/>
                                                    {dateFormat(d.doneDate)}
                                                </td>
                                                <td>

                                                    {formatHour(d.dueHour, d?.isApuControl)} <br/>
                                                    {formatCycle(d.dueCycle, d?.isApuControl)} <br/>
                                                    {dateFormat(d.dueDate)}
                                                </td>
                                                <td>
                                                    {formatHour(d.remainingHour, d?.isApuControl)} <br/>
                                                    {formatCycle(d.remainingCycle, d?.isApuControl)} <br/>
                                                    {d.remainingDay ? d.remainingDay + " DY" : d.remainingDay === 0 ? 0 : "N/A"}
                                                </td>
                                                <td>{dateFormat(d.estimatedDueDate)}</td>

                                                {
                                                    hardTime.find(v => v.id === d.modelType) ?
                                                        <td colSpan={2}>
                                                            {d.partNo !== null && 'Part No : ' + d.partNo} {d.partNo !== null &&
                                                            <br/>}
                                                            {d.serialNo !== null && 'Serial No : ' + d.serialNo} {d.serialNo !== null &&
                                                            <br/>}
                                                            {d.position !== null && 'Position : ' + d.position} {d.position !== null &&
                                                            <br/>}
                                                            {d.remark !== null && 'Remark : ' + d.remark}
                                                        </td>
                                                        :
                                                        <td colSpan={2}>
                                                            {d.remark !== null && d.remark}
                                                        </td>
                                                }
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </ARMReportTable>
                            </ResponsiveTable>
                            {data?.length > 0 && (
                                <Row justify="center" className="pagination first">
                                    <Col style={{marginTop: 10}}>
                                        <Pagination currentPage={currentPage} showSizeChanger={false}
                                                    onChange={setCurrentPage} total={totalPages * 10}/>
                                    </Col>
                                </Row>
                            )}
                        </AMP>
                    </div>
                </ARMCard>
            </Permission>
        </CommonLayout>
    );
}
