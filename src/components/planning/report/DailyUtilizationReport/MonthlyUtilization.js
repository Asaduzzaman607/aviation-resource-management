import React, {createRef, useCallback, useEffect, useRef, useState} from "react";
import {useBoolean} from "react-use";
import {useAircraftsList} from "../../../../lib/hooks/planning/aircrafts";
import {Breadcrumb, Button, Col, DatePicker, Form, Row, Select, Space, Typography} from "antd";
import {notifyResponseError, notifyWarning} from "../../../../lib/common/notifications";
import DateTimeConverter from "../../../../converters/DateTimeConverter";
import API from "../../../../service/Api";
import {sleep} from "../../../../lib/common/helpers";
import {useDownloadExcel} from "react-export-table-to-excel";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Link} from "react-router-dom";
import Permission from "../../../auth/Permission";
import ARMCard from "../../../common/ARMCard";
import {DownloadOutlined, FilterOutlined, PrinterOutlined, RollbackOutlined} from "@ant-design/icons";
import ReactToPrint from "react-to-print";
import SuccessButton from "../../../common/buttons/SuccessButton";
import moment from "moment/moment";
import {REQUIRED} from "../../../../lib/constants/validation-rules";
import ARMButton from "../../../common/buttons/ARMButton";
import CompanyLogo from "../CompanyLogo";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import {ARMReportTable} from "../ARMReportTable";
import {CycleFormat, DateFormat, HourFormat} from "../Common";
import styled from "styled-components";
import TaskDoneServices from "../../../../service/TaskDoneServices";
import {formatSingleTimeValue} from "../../../../lib/common/presentation";
import {dateFormat} from "../AirframeAndApplianceADStatus";


const printStyle = `
*{
    margin: 0!important;
    padding: 0!important;
    overflow: visible !important;
  }
  .border-bold,
  .border-bold th,
.border-bold td{
  border-width: 1px !important;
  border-style: solid !important;
  border-color: #000 !important;
}
    .service-table thead tr th{
    font-size: 9px !important;
  }
  .service-table tbody tr td{
    font-size: 8px !important;
  }
  .page-of-report{
   display: block!important;
   }
   .pagination{
   display: none!important;
  }
  .table thead tr th,
  .data tr td{
  border-width: 1px !important;
  border-style: solid !important;
  border-color: #000 !important;
}
.none{
    border: none;
    visibility: hidden;
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
  @page {
    size: landscape;
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
    //background-color: #EBF1DE;
    border-left: none;
    border-right: none;
    border-top: none;
    //border-bottom: 2px solid;
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

export default function MonthlyUtilizationRecord() {
    const reportRef = createRef();
    const [submitting, toggleSubmitting] = useBoolean(false);
    const [printState, setPrintState] = useBoolean(false);
    const {allAircrafts, getAllAircrafts} = useAircraftsList();
    const [data, setData] = useState([]);
    const [printData, setPrintData] = useState([]);
    const [form] = Form.useForm();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [printStartDate, setPrintStartDate] = useState();
    const [printEndDate, setPrintEndDate] = useState();
    const aircraftId = Form.useWatch("aircraftId", form);
    const dateRange = Form.useWatch("dateRange", form);
    const [fromDate, toDate] = dateRange || "";
    const [aircraftApuDetails, setAircraftApuDetails] = useState()

    const getAircraftApuDetailsById = async (aircraftId) => {
        try {
            const {data} = await TaskDoneServices.getAircraftApuDetailsById(
                aircraftId
            );


            setAircraftApuDetails({
                ...data,
                aircraftModelName: `${data.aircraftModelName} `,
                aircraftName: data.aircraftName,
                airframeSerial: data.airframeSerial,
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


    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);


    const handleMonthlyUtilizationSearch = useCallback(
        async (values) => {
            const [fromDate, toDate] = values.dateRange || "";
            let timeDiff = toDate - fromDate;
            let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            if (daysDiff > (60 * 30.4167)) {
                notifyWarning("Please select start date and end date within 60 months!");
                return;
            }
            setStartDate(moment(fromDate).format("MMM-YYYY"));
            const lastDate = moment(toDate).endOf("month");
            setEndDate(lastDate);
            const searchValues = {
                aircraftId: values.aircraftId,
                fromDate: DateTimeConverter.momentDateToString(fromDate),
                toDate: DateTimeConverter.momentDateToString(lastDate),
                isPageable: true,
            };
            try {
                const {data} = await API.post(
                    `utilization/monthly_report`,
                    searchValues
                );
                setData(data);
            } catch (error) {
                notifyResponseError(error);
            } finally {
                toggleSubmitting(false);
            }
        },
        [toggleSubmitting]
    );

    const fetchPrintData = async () => {
        setPrintState(true);
        const searchValues = {
            aircraftId: aircraftId,
            fromDate: DateTimeConverter.momentDateToString(fromDate),
            toDate: DateTimeConverter.momentDateToString(toDate),
            isPageable: true,
        };

        setPrintStartDate(DateTimeConverter.momentDateToString(fromDate));
        setPrintEndDate(DateTimeConverter.momentDateToString(toDate));
        try {
            const {data} = await API.post(
                `utilization/monthly_report`,
                searchValues
            );

            setPrintData(data);
            return sleep(1200);
        } catch (er) {
            notifyResponseError(er);
        }
    };

    useEffect(() => {
        (async () => {
            await getAllAircrafts();
        })();
    }, [getAllAircrafts]);

    const resetFilter = () => {
        form.resetFields();
        setData([])
        setAircraftApuDetails({})
    };

    const saveMonthlyUtilizationData = async () => {
        try {
            await API.get(`utilization/save_monthly_utilization`);
        } catch (er) {
            notifyResponseError(er);
        }
    };

    const monthlyUtilizationRef = useRef(null);
    const {onDownload} = useDownloadExcel({
        currentTableRef: monthlyUtilizationRef.current,
        filename: 'Monthly Utilization Report',
        sheet: 'monthlyUtilizationReport'
    })

    const downloadMonthlyUtilizationExcel = async () => {

        if (!aircraftId) return
        await fetchPrintData()
        setPrintState(false)
        await sleep(1000);
        if (printData?.length < 1) {
            notifyWarning('Report data is empty! Please generate the data first.')
            return
        }

        onDownload()

    }

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/planning">
                            <i className="fas fa-chart-line"/> &nbsp;Planning
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Monthly utilization record</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_MONTHLY_UTILIZATION_RECORD_SEARCH" showFallback>
                <ARMCard
                    title={
                        <Row justify="space-between">
                            <Col>MONTHLY UTILIZATION RECORD</Col>
                            <Col>
                                <Space>
                                    <Button icon={<DownloadOutlined/>}
                                            onClick={downloadMonthlyUtilizationExcel}> Export
                                        excel </Button>
                                    <ReactToPrint
                                        content={() => reportRef.current}
                                        copyStyles={true}
                                        pageStyle={printStyle}
                                        trigger={() => (
                                            <SuccessButton
                                                type="primary"
                                                icon={<PrinterOutlined/>}
                                                htmlType="button"
                                            >
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
                    <Form
                        loading={submitting}
                        form={form}
                        name="filter-form"
                        initialValues={{
                            aircraftId: null,
                            dateRange: [
                                moment(firstDay, "DD-MM-YYYY"),
                                moment(lastDay, "DD-MM-YYYY"),
                            ],
                            size: 10,
                        }}
                        onFinish={handleMonthlyUtilizationSearch}
                    >
                        <Row gutter={20}>
                            <Col xs={24} md={6}>
                                <Form.Item rules={[REQUIRED]} name="aircraftId">
                                    <Select placeholder="Select Aircraft">
                                        {allAircrafts?.map(({aircraftId, aircraftName}) => (
                                            <Select.Option value={aircraftId} key={aircraftId}>
                                                {aircraftName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={6}>
                                <Form.Item rules={[REQUIRED]} name="dateRange">
                                    <DatePicker.RangePicker
                                        format="MM-YYYY"
                                        style={{width: "100%"}}
                                        picker="month"
                                        disabledDate={(current) => {
                                            return current && current.valueOf() > lastDay;
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={6}>
                                <Form.Item>
                                    <Space>
                                        <ARMButton size="middle" type="primary" htmlType="submit">
                                            <FilterOutlined name="filter"/> Filter
                                        </ARMButton>
                                        <ARMButton size="middle" type="primary" onClick={resetFilter}>
                                            <RollbackOutlined name="reset"/> Reset
                                        </ARMButton>
                                    </Space>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                                <ARMButton
                                    onClick={saveMonthlyUtilizationData}
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
                    </Form>

                    <Row ref={reportRef}>
                        <ReportContainer>
                            <Col span={24} className="first">
                                <Row justify="space-between">
                                    <Col>
                                        <CompanyLogo/>
                                    </Col>
                                    <Col style={{fontSize: "10px"}}>
                                        <Typography.Text>Form: CAME-033</Typography.Text>
                                        <br/>
                                        <Typography.Text>ISSUE INITIAL</Typography.Text>
                                        <br/>
                                        <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={24}>
                                <Row justify="center" className="first">
                                    <Col span={24}>
                                        <Typography.Title className="title" level={4}>
                                            MONTHLY UTILIZATION RECORD
                                        </Typography.Title>
                                    </Col>
                                </Row>

                                <Row className="table-responsive">
                                    <ResponsiveTable className="first">
                                        <ARMReportTable className="table">
                                            <thead>
                                            <tr>
                                                <th className="none" colSpan={2}></th>
                                                <th>A/C Reg : {aircraftApuDetails?.aircraftName} </th>
                                                <th>DATE</th>
                                                <th>TAT</th>

                                            </tr>

                                            <tr>
                                                <th className="none" colSpan={2}></th>
                                                <th>MSN
                                                    : {aircraftApuDetails?.airframeSerial ? aircraftApuDetails?.airframeSerial : 'N/A'}</th>
                                                <th>{dateFormat(aircraftApuDetails?.updatedTime)}</th>
                                                <th>{aircraftApuDetails?.acHour ? formatSingleTimeValue(aircraftApuDetails.acHour) : 'N/A'}</th>

                                            </tr>
                                            <tr>
                                                <th className="none" colSpan={2}></th>
                                                <th>From</th>
                                                <th>TO</th>
                                                <th>TAC</th>
                                                {/*<th>TOTAL FH</th>*/}
                                                {/*<th>TOTAL FC</th>*/}
                                            </tr>

                                            <tr>
                                                <td className="none" colSpan={2}></td>
                                                <th>{DateFormat(startDate)}</th>
                                                <th>{DateFormat(endDate)}</th>
                                                <th>{aircraftApuDetails?.acCycle ? aircraftApuDetails.acCycle : 'N/A'}</th>
                                                {/*<th>{HourFormat(data?.totalFH)}</th>*/}
                                                {/*<th>{CycleFormat(data?.totalFC)}</th>*/}
                                            </tr>
                                            </thead>
                                            <br/>
                                            <thead>
                                            <tr>
                                                <th>MONTH</th>
                                                <th>A/C HOURS</th>
                                                <th>A/C CYCLES</th>
                                                <th>APU HOURS</th>
                                                <th>APU CYCLES</th>
                                                <th>RATIO (A/C TIMES)</th>
                                            </tr>
                                            </thead>

                                            <tbody style={{whiteSpace: "nowrap"}} className="data">
                                            {data?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{moment(`${item?.yearMonth}-01`).format("MMM-YY")}</td>
                                                    <td>{HourFormat(item?.acHours)}</td>
                                                    <td>{CycleFormat(item?.acCycle)}</td>
                                                    <td>{HourFormat(item?.apuHours)}</td>
                                                    <td>{CycleFormat(item?.apuCycle)}</td>
                                                    <td>{(item?.ratio).toFixed(2) || 'N/A'}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </ARMReportTable>
                                    </ResponsiveTable>

                                    <ResponsiveTable className="second">
                                        <ARMReportTable className="table" ref={monthlyUtilizationRef}>
                                            <table
                                                className="report-container"
                                                style={{width: "100%"}}
                                            >
                                                <thead className="report-header">
                                                <tr>
                                                    <td
                                                        className="report-header-cell border-none"
                                                        colSpan={13}
                                                    >
                                                        <div className="header-info">
                                                            <Col span={24}>
                                                                <Row justify="space-between">
                                                                    {
                                                                        printState ? <Col>
                                                                                <CompanyLogo/>
                                                                            </Col>
                                                                            :
                                                                            <Col>

                                                                            </Col>
                                                                    }
                                                                    <Col
                                                                        style={{
                                                                            fontSize: "10px",
                                                                            textAlign: "left",
                                                                        }}
                                                                    >
                                                                        <Typography.Text>
                                                                            Form: CAME-033
                                                                        </Typography.Text>
                                                                        <br/>
                                                                        <Typography.Text>
                                                                            ISSUE INITIAL
                                                                        </Typography.Text>
                                                                        <br/>
                                                                        <Typography.Text>
                                                                            DATE 19 JAN 2022
                                                                        </Typography.Text>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col span={12}>
                                                                        <Typography.Title
                                                                            level={3}
                                                                            style={{fontSize: "1rem"}}
                                                                        >
                                                                            MONTHLY UTILIZATION RECORD
                                                                        </Typography.Title>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    {printState ? <td colSpan={13} className="none">empty</td>
                                                        :
                                                        <td colSpan={13} className="none"></td>}
                                                </tr>
                                                <tr>
                                                    {
                                                        printState ?
                                                            <td className="none" colSpan={2}>
                                                                empty
                                                            </td> :
                                                            <td className="none" colSpan={2}>

                                                            </td>
                                                    }
                                                    <th>A/C Reg: {printData?.aircraftName} </th>
                                                    <th>DATE</th>
                                                    <th>TAT</th>
                                                </tr>
                                                <tr>
                                                    {printState ? <td colSpan={2} className="none">empty</td>
                                                        :
                                                        <td colSpan={2} className="none"></td>}

                                                    <th>MSN
                                                        : {aircraftApuDetails?.airframeSerial ? aircraftApuDetails?.airframeSerial : 'N/A'}</th>
                                                    <th>{dateFormat(aircraftApuDetails?.updatedTime)}</th>
                                                    <th>{aircraftApuDetails?.acHour ? formatSingleTimeValue(aircraftApuDetails.acHour) : 'N/A'}</th>
                                                </tr>

                                                <tr>
                                                    {printState ? <td colSpan={2} className="none">empty</td>
                                                        :
                                                        <td colSpan={2} className="none"></td>}
                                                    <th>From</th>
                                                    <th>TO</th>
                                                    <th>TAC</th>
                                                </tr>

                                                <tr>
                                                    <td className="none" colSpan={2}></td>
                                                    <th>{DateFormat(printStartDate)}</th>
                                                    <th>{DateFormat(printEndDate)}</th>
                                                    <th>{aircraftApuDetails?.acCycle ? aircraftApuDetails.acCycle : 'N/A'}</th>
                                                </tr>
                                                <tr>
                                                    { printState?
                                                        <td colSpan={6} className='none' >empty</td>
                                                        :
                                                        <td colSpan={6} className ='none'></td>
                                                    }
                                                </tr>

                                                <tr>
                                                    <th>MONTH</th>
                                                    <th>A/C HOURS</th>
                                                    <th>A/C CYCLES</th>
                                                    <th>APU HOURS</th>
                                                    <th>APU CYCLES</th>
                                                    <th>RATIO (A/C TIMES)</th>
                                                </tr>
                                                </thead>

                                                <tbody style={{whiteSpace: "nowrap"}} className="data">
                                                {printData?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{moment(`${item?.yearMonth}-01`).format("MMM-YY")}</td>
                                                        <td>{HourFormat(item?.acHours)}</td>
                                                        <td>{CycleFormat(item?.acCycle)}</td>
                                                        <td>{HourFormat(item?.apuHours)}</td>
                                                        <td>{CycleFormat(item?.apuCycle)}</td>
                                                        <td>{(item?.ratio).toFixed(2) || 'N/A'}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </ARMReportTable>
                                    </ResponsiveTable>
                                </Row>
                            </Col>
                        </ReportContainer>
                    </Row>
                </ARMCard>
            </Permission>
        </CommonLayout>
    );
}