import {DownloadOutlined, FilterOutlined, PrinterOutlined, RollbackOutlined} from "@ant-design/icons";
import {Breadcrumb, Button, Col, DatePicker, Form, notification, Row, Select, Space, Spin, Typography} from "antd";
import moment from "moment";
import React, {createRef, useCallback, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import DateTimeConverter from "../../../../converters/DateTimeConverter";
import {getErrorMessage, sleep} from "../../../../lib/common/helpers";
import {useAircrafts} from "../../../../lib/hooks/planning/aircrafts";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import ARMButton from "../../../common/buttons/ARMButton";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import CommonLayout from "../../../layout/CommonLayout";
import axiosInstance from "../../../../service/Api";
import ReactToPrint from "react-to-print";
import SuccessButton from "../../../common/buttons/SuccessButton";
import styled from "styled-components";
import {ARMReportTable} from "../ARMReportTable";
import {formatSingleTimeValue} from "../../../../lib/common/presentation";
import {notifyError} from "../../../../lib/common/notifications";
import Permission from "../../../auth/Permission";
import {useDownloadExcel} from "react-export-table-to-excel";
import { HourFormat } from "../Common";
import AircraftService from "../../../../service/AircraftService";

const sodata = [
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
    {
        "fromAirportIataCode": null,
        "toAirportIataCode": null,
        "sector": "KHU:SYL",
        "flightNo": "",
        "totalHours": 0.01,
        "totalCycle": 1
    },
]

const printStyle = `
*{
  display: block!important,
  pageBreakBefore: always!important,
}
    sector{
      margin: 0 10px!important;
    } 
    .table tbody tr td,
    .table tbody tr th{
      border-width: 1px !important;
     border-style: solid !important;
     border-color: #000 !important;
    }
    .first{
      display: none !important;
    }
    .second{
      display: block !important;
    }
  `

const Sector = styled.div`
  .title {
    text-decoration: underline;
    font-size: 1.3rem;
  }

  .last-title {
    margin-top: 40px;
    font-size: 1rem;
  }

  .last-month-table {
    width: 70% !important;
    float: right;
    position: relative;
  }

  .second {
    display: none;
  }

  @page {
    size: portrait;
  }
`


export default function SectorwiseUtilization() {
    const initialState = {
        aircraftId: "",
        fltNo: "",
        totalHrs: "",
        totalCycles: "",
    };

    const [form] = Form.useForm();
    const [reports, setReports] = useState({});
    const [aircraftInfo, setAircraftInfo] = useState({})
    const reportRef = createRef();
    const [firstDay, setFirstDay] = useState("");
    const [lastDay, setLastDay] = useState("");
    const [month, setMonth] = useState("")
    const aircraftId = Form.useWatch('aircraftId', form)
    const [printData, setPrintData] = useState({})
    const [printState, setPrintState] = useState(false)

    const [allAircrafts, setAircrafts] = useState([]);

    const getAllAircrafts = useCallback(async () => {
        const res = await AircraftService.getAllAircraftList();
        setAircrafts(
            res.data.map(({ aircraftId , aircraftName  }) => ({
                aircraftId,
                aircraftName,
            }))
        );
    }, []);

    useEffect(() => {
        (async () => {
            await getAllAircrafts();
        })();
    }, []);

    const TITLE = "Sectorwise Utilization";

    const onChange = (e) => {
        const data = DateTimeConverter.momentDateToString(e);
        setMonth(moment(data, 'YYYY-MM-DD').format('DD-MMM-YYYY')?.slice(3))
        let date = new Date(data);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        setFirstDay(moment(firstDay).format("YYYY-MM-DD"));
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        setLastDay(moment(lastDay).format("YYYY-MM-DD"));
    };
    const onFinish = async (values) => {
        const customValues = {
            aircraftId: values.aircraftId,
            fromDate: firstDay,
            toDate: lastDay,
        };
        try {
            const {data} = await axiosInstance.post(`/aircraft-maintenance-log/utilization-report`, customValues);
            const aircraftInfo = await axiosInstance.get(`/aircrafts/info/${values.aircraftId}`)
            setAircraftInfo(aircraftInfo.data)
            setReports(data);
        } catch (e) {
            notification["error"]({message: getErrorMessage(e)});
        }
    };

    const fetchPrintData = async () => {
        const customValues = {
            aircraftId: aircraftId,
            fromDate: firstDay,
            toDate: lastDay,
        }
        try {
            const {data} = await axiosInstance.post(`/aircraft-maintenance-log/utilization-report`, customValues);
            const aircraftInfo = await axiosInstance.get(`/aircrafts/info/${aircraftId}`)
            setAircraftInfo(aircraftInfo.data)
            setPrintData(data)
            setPrintState(true)
            return sleep(1000);
        } catch (error) {
            notifyError(error)
        }
    }

    const onReset = () => {
        form.resetFields();
        setReports({})
        setMonth("")
        setAircraftInfo({})
        setPrintData({})
    };

    const sectorWiseUtilizationRef = useRef(null);
    const {onDownload} = useDownloadExcel({
        currentTableRef: sectorWiseUtilizationRef.current,
        filename: 'Sector wise utilization report',
        sheet: 'sectorWiseUtilizationReport'
    })

    const downloadSectorWiseUtilizationExcel = async () => {

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
                        <Link to="/planning">
                            <i className="fas fa-chart-line"/> &nbsp;Planning
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{TITLE}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_SECTOR_WISE_UTILIZATION_SEARCH" showFallback>
                <ARMCard
                    title={
                        <Row justify="space-between">
                            <Col>{TITLE}</Col>
                            <Col>
                                <Space>
                                    <Button icon={<DownloadOutlined/>}
                                            onClick={downloadSectorWiseUtilizationExcel}> Export
                                        excel </Button>
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


                    <Form form={form} name="filter-form" onFinish={onFinish} initialValues={initialState}>
                        <Row gutter={20}>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item
                                    label="Aircraft"
                                    rules={[
                                        {
                                            required: true,
                                            message: "PLease select an aircrfat",
                                        },
                                    ]}
                                    name="aircraftId"
                                >
                                    <Select placeholder="Select Model Type" allowClear>
                                        <Select.Option value="">---Select---</Select.Option>
                                        {allAircrafts?.map((type) => (
                                            <Select.Option value={type.aircraftId} key={type.aircraftId}>
                                                {type.aircraftName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12} lg={6}>
                                <Form.Item
                                    label="Month"
                                    name="month"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select a month",
                                        },
                                    ]}
                                >
                                    <DatePicker placeholder="Select month" style={{width: "100%"}} onChange={onChange}
                                                picker="month"/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item>
                                    <Space>
                                        <ARMButton size="middle" type="primary" htmlType="submit">
                                            <FilterOutlined name="filter"/> Filter
                                        </ARMButton>
                                        <ARMButton size="middle" type="primary" onClick={onReset}>
                                            <RollbackOutlined name="reset"/> Reset
                                        </ARMButton>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    <Sector className="sector" ref={reportRef}>
                        <Typography.Title level={2} style={{textAlign: "center"}}>Sectorwise Utilization
                            Report</Typography.Title>
                        <Row>
                            <Col span={24}>
                                <Row justify="end">
                                    <ARMReportTable style={{width: "60%", fontWeight: "bold"}}>
                                        <tbody>
                                        <tr>
                                            <td>A/C NAME</td>
                                            <td>A/C SERIAL</td>
                                            <td>A/C HOUR</td>
                                            <td>A/C CYCLE</td>
                                            <td>MONTH</td>
                                        </tr>
                                        <tr>
                                            <td>{aircraftInfo.aircraftName && aircraftInfo.aircraftName}</td>
                                            <td>{aircraftInfo.airframeSerial && aircraftInfo.airframeSerial}</td>
                                            <td>{aircraftInfo.acHour ? formatSingleTimeValue(aircraftInfo.acHour) : "N/A"}</td>
                                            <td>{aircraftInfo.acCycle ? aircraftInfo.acCycle : "N/A"}</td>
                                            <td>{month}</td>
                                        </tr>
                                        </tbody>
                                    </ARMReportTable>
                                </Row>
                                <br/>
                                <ResponsiveTable className="first">
                                    <ARMReportTable className="table">
                                        <tbody>
                                        <tr>
                                            <th>SECTOR</th>
                                            <th>FLT NO.</th>
                                            <th>TOTAL HOURS</th>
                                            <th>TOTAL CYCLE</th>
                                        </tr>
                                        {reports?.utilizationReportDtoList?.map((data, index) => (
                                            <tr key={index}>
                                                <td>{data.sector}</td>
                                                <td>{data.flightNo}</td>
                                                <td>{HourFormat(data.totalHours)}</td>
                                                <td>{data.totalCycle}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <th style={{border: 'none', visibility: 'hidden'}}></th>
                                            <th>TOTAL</th>
                                            <th>{HourFormat(reports.totalHours)}</th>
                                            <th>{reports.totalCycle}</th>
                                        </tr>
                                        </tbody>
                                    </ARMReportTable>
                                    <Typography.Title className="last-title" level={4}>LAST 3 MONTHS
                                        UTILIZATION:</Typography.Title>
                                    {reports.previousOneMonth && (
                                        <ARMReportTable className="last-month-table table">
                                            <tbody>
                                            <tr>
                                                <th>{reports?.previousThirdMonth?.month}</th>
                                                <th>{reports?.previousSecondMonth?.month}</th>
                                                <th>{reports?.previousOneMonth?.month}</th>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {HourFormat(reports?.previousThirdMonth?.totalHours)} FH
                                                    / {reports?.previousThirdMonth?.totalCycle} FC
                                                </td>
                                                <td>
                                                    {HourFormat(reports?.previousSecondMonth?.totalHours)} FH
                                                    / {reports?.previousSecondMonth?.totalCycle} FC
                                                </td>
                                                <td>
                                                    {HourFormat(reports?.previousOneMonth?.totalHours)} FH
                                                    / {reports?.previousOneMonth?.totalCycle} FC
                                                </td>
                                            </tr>
                                            </tbody>
                                        </ARMReportTable>
                                    )}
                                </ResponsiveTable>
                                <ResponsiveTable className="second" ref={sectorWiseUtilizationRef}>
                                    {
                                        printState ?
                                            null :
                                            <>
                                                <Typography.Title level={2} style={{textAlign: "center"}}>Sectorwise
                                                    Utilization
                                                    Report</Typography.Title>
                                                <Row justify="end">
                                                    <ARMReportTable style={{width: "60%", fontWeight: "bold"}}>
                                                        <tbody>
                                                        <tr>
                                                            <td>A/C NAME</td>
                                                            <td>A/C SERIAL</td>
                                                            <td>A/C HOUR</td>
                                                            <td>A/C CYCLE</td>
                                                            <td>MONTH</td>
                                                        </tr>
                                                        <tr>
                                                            <td>{aircraftInfo.aircraftName && aircraftInfo.aircraftName}</td>
                                                            <td>{aircraftInfo.airframeSerial && aircraftInfo.airframeSerial}</td>
                                                            <td>{aircraftInfo.acHour ? formatSingleTimeValue(aircraftInfo.acHour) : "N/A"}</td>
                                                            <td>{aircraftInfo.acCycle ? aircraftInfo.acCycle : "N/A"}</td>
                                                            <td>{month}</td>
                                                        </tr>
                                                        </tbody>
                                                    </ARMReportTable>
                                                </Row>
                                            </>
                                    }
                                    <ARMReportTable className="table">
                                        <tbody>
                                        <tr>
                                            <th>SECTOR</th>
                                            <th>FLT NO.</th>
                                            <th>TOTAL HOURS</th>
                                            <th>TOTAL CYCLE</th>
                                        </tr>
                                        {printData?.utilizationReportDtoList?.map((data, index) => (
                                            <tr key={index} style={{
                                                // breakBefore: "page",
                                                breakInside: "avoid",
                                                // breakAfter: "page",
                                                // position: "relative"
                                            }}>
                                                <td>{data.sector}</td>
                                                <td>{data.flightNo}</td>
                                                <td>{HourFormat(data.totalHours)}</td>
                                                <td>{data.totalCycle}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <th style={{border: 'none', visibility: 'hidden'}}>empty</th>
                                            <th>TOTAL</th>
                                            <th>{HourFormat(printData.totalHours)}</th>
                                            <th>{printData.totalCycle}</th>
                                        </tr>
                                        </tbody>
                                    </ARMReportTable>
                                    <Typography.Title className="last-title" level={4}>LAST 3 MONTHS
                                        UTILIZATION:</Typography.Title>
                                    {printData.previousOneMonth && (
                                        <ARMReportTable className="last-month-table table">
                                            <tbody>
                                            <tr>
                                                <th>{printData?.previousThirdMonth?.month}</th>
                                                <th>{printData?.previousSecondMonth?.month}</th>
                                                <th>{printData?.previousOneMonth?.month}</th>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {HourFormat(printData?.previousThirdMonth?.totalHours)} FH
                                                    / {printData?.previousThirdMonth?.totalCycle} FC
                                                </td>
                                                <td>
                                                    {HourFormat(printData?.previousSecondMonth?.totalHours)} FH
                                                    / {printData?.previousSecondMonth?.totalCycle} FC
                                                </td>
                                                <td>
                                                    {HourFormat(printData?.previousOneMonth?.totalHours)} FH
                                                    / {printData?.previousOneMonth?.totalCycle} FC
                                                </td>
                                            </tr>
                                            </tbody>
                                        </ARMReportTable>
                                    )}
                                </ResponsiveTable>
                            </Col>
                        </Row>
                    </Sector>
                </ARMCard>
            </Permission>
        </CommonLayout>
    );
}
