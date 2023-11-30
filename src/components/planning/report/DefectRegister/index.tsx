import {PrinterOutlined, FilterOutlined, RollbackOutlined, DownloadOutlined} from "@ant-design/icons";
import {
    Breadcrumb,
    Button,
    Col,
    DatePicker,
    Form,
    notification,
    Pagination,
    Row,
    Select,
    Space,
    Typography
} from "antd";
import React, {createRef, useCallback, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import ReactToPrint from "react-to-print";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import SuccessButton from "../../../common/buttons/SuccessButton";
import CommonLayout from "../../../layout/CommonLayout";
import logo from "../../../../components/images/us-bangla-logo.png";
import styled from "styled-components";
import {ARMReportTable} from "../ARMReportTable";
import API from '../../../../service/Api'
import moment from "moment";
import ARMButton from "../../../common/buttons/ARMButton";
import {useAircraftsList} from "../../../../lib/hooks/planning/aircrafts";
import {useBoolean} from "react-use";
import DateTimeConverter from "../../../../converters/DateTimeConverter";
import Input from "antd/es/input/Input";
import {getErrorMessage, sleep} from "../../../../lib/common/helpers";
import {useAirports} from "../../../../lib/hooks/planning/airports";
import {formatSingleTimeValue} from "../../../../lib/common/presentation";
import CompanyLogo from "../CompanyLogo";
import {pageSerialNo} from "../Common";
import {useDownloadExcel} from "react-export-table-to-excel";
import Permission from "../../../auth/Permission";
import {notifyResponseError} from "../../../../lib/common/notifications";

const TITLE = "Maintenance/Defect Register"


const printStyle = `
*{
    font-size: 10px !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
  }
  .border-bold td,
  .border-bold th{
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
  }
  .ant-pagination{
    display: none!important;
  }
  .first{
    display: none !important;
  }
  .second{
    display: block !important;
    
  }
  .table tr th,
  .table tr td{
    font-size: 8px !important;
  }
  table.report-container {
    page-break-after:always !important;
}
thead.report-header {
    display:table-header-group!important;
}
  `

const DefectRegister = styled.div`
  .title {
    text-align: center;
    text-decoration: underline;
    font-weight: bold;
  }

  .aircraft-info {
    font-weight: bold;
  }

  .maintenance-table tbody tr td {
    padding: 0px;
  }

  .second {
    display: none;
  }

  .border-none {
    border: none;
  }

  .none {
    border: none;
    visibility: hidden;
  }

  @page {
    size: landscape;
  }
`

const IS_DECIMAL = [
    {id : 1 , name : 'Hour', value : false},
    {id : 2 , name : 'Decimal', value : true},
]

export default function MaintenanceDefectRegister() {

    const [form] = Form.useForm();
    const reportRef = createRef<any>();
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState<any>(1)
    const [totalPages, setTotalPages] = useState<any>()
    const {allAircrafts, getAllAircrafts} = useAircraftsList()
    const [submitting, toggleSubmitting] = useBoolean(false);
    const [printState, setPrintState] = useBoolean(false);
    const [aircraftsInfo, setAircraftsInfo] = useState<any>({})
    const {airports} = useAirports();
    const [printData, setPrintData] = useState([])
    const aircraftId = Form.useWatch('aircraftId', form)
    const dateRange = Form.useWatch('dateRange', form)
    const airportId = Form.useWatch('airportId', form)
    const rectDescription = Form.useWatch('rectDescription', form)
    const defDescription = Form.useWatch('defDescription', form)
    const position = Form.useWatch('position', form)
    const rectPnOff = Form.useWatch('rectPnOff', form)
    const rectSnOff = Form.useWatch('rectSnOff', form)
    const rectPnOn = Form.useWatch('rectPnOn', form)
    const rectSnOn = Form.useWatch('rectSnOn', form)
    const rectAta = Form.useWatch('rectAta', form)
    const reasonForRemoval = Form.useWatch('reasonForRemoval', form)
    const remark = Form.useWatch('remark', form)
    const isDecimal = Form.useWatch('isDecimal', form)

    useEffect(() => {
        (async () => {
            await getAllAircrafts();
        })();
    }, [])

    const handleSubmit = useCallback(async (values: any) => {
        const [fromDate, toDate] = values.dateRange || '';
        const customValues = {
            aircraftId: values.aircraftId,
            airportId: values ? values.airportId : null,
            rectDescription: values ? values.rectDescription : null,
            defDescription: values ? values.defDescription : null,
            position: values ? values.position : null,
            rectPnOff: values ? values.rectPnOff : null,
            rectSnOff: values ? values.rectSnOff : null,
            rectPnOn: values ? values.rectPnOn : null,
            rectSnOn: values ? values.rectSnOn : null,
            rectAta: values ? values.rectAta : null,
            reasonForRemoval: values ? values.reasonForRemoval : null,
            remark: values ? values.remark : null,
            startDate: DateTimeConverter.momentDateToString(fromDate) || null,
            endDate: DateTimeConverter.momentDateToString(toDate) || null,
            isDecimal: values? values.isDecimal : false,
            isPageable: true
        }
        try {
            toggleSubmitting()
            const {data} = await API.post(`/aml-defect-rectification/report?page=${currentPage}&size=${values.size}`, customValues);
            setData(data.model)
            setCurrentPage(data.currentPage)
            setTotalPages(data.totalPages)
        } catch (error) {
            notification["error"]({message: getErrorMessage(error)});
        } finally {
            toggleSubmitting()
        }
    }, [currentPage, toggleSubmitting])

    const fetchPrintData = async () => {
        const [fromDate, toDate] = dateRange
        const customValues = {
            aircraftId,
            airportId,
            rectDescription,
            defDescription,
            position,
            rectPnOff,
            rectSnOff,
            rectPnOn,
            rectSnOn,
            rectAta,
            reasonForRemoval,
            remark,
            fromDate: DateTimeConverter.momentDateToString(fromDate),
            toDate: DateTimeConverter.momentDateToString(toDate),
            isDecimal: isDecimal || false,
            isPageable: false
        }
        try {
            const {data} = await API.post(`/aml-defect-rectification/report`, customValues);
            setPrintData(data.model)
            setPrintState(true)
            return sleep(1000);
        } catch (error) {
            notifyResponseError(error)
        }
    }


    useEffect(() => {
        if(!aircraftId){
            return;
        }
        (async () => {
            await handleSubmit(form.getFieldsValue(true));
        })();
    }, [handleSubmit, form]);

    const resetFilter = () => {
        form.resetFields();
        setData([]);
        setAircraftsInfo([])
    };

    const getAircraftInfo = async () => {
        if (!aircraftId) return
        const {data} = await API.get(`/aircrafts/info/${aircraftId}`)
        setAircraftsInfo(data)
    }

    useEffect(() => {
        if (!aircraftId)
            return;
        (async () => {
            await getAircraftInfo()
        })()
    }, [aircraftId])


    const maintenanceDefectRegisterRef = useRef(null);
    const {onDownload} = useDownloadExcel({
        currentTableRef: maintenanceDefectRegisterRef.current,
        filename: 'Maintenance/Defect Register Report',
        sheet: 'maintenanceDefectRegisterReport'
    })

    const downloadMaintenanceDefectRegisterExcel = async () => {

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
            <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_MAINTENANCE_DEFECT_REGISTER_SEARCH"  showFallback>
            <ARMCard
                title={
                    <Row justify="space-between">
                        <Col>{TITLE}</Col>
                        <Col>
                            <Space>
                                <Button icon={<DownloadOutlined/>}
                                        onClick={downloadMaintenanceDefectRegisterExcel}> Export
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
            ><Form form={form} name="filter-form" initialValues={{
                aircraftId: null,
                dateRange: '',
                airportId: null,
                rectDescription: null,
                defDescription: null,
                position: null,
                rectPnOff: null,
                rectSnOff: null,
                rectPnOn: null,
                rectSnOn: null,
                rectAta: null,
                reasonForRemoval: null,
                remark: null,
                isDecimal: false,
                size: 10
            }} onFinish={handleSubmit}>
                <Row gutter={20}>
                    <Col xs={24} md={6}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: "Aircraft is Required",
                                },
                            ]}
                            name="aircraftId"
                        >
                            <Select placeholder="Select Aircraft" onChange={getAircraftInfo} allowClear>
                                {allAircrafts?.map((aircraft: any) => (
                                    <Select.Option value={aircraft.aircraftId} key={aircraft.aircraftId}>
                                        {aircraft.aircraftName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

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
                        <Form.Item name="airportId">
                            <Select placeholder="Select Station" allowClear>
                                {airports.map((airport: any) => (
                                    <Select.Option value={airport.id} key={airport.id}>
                                        {airport.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            rules={[
                                {
                                    required: false,
                                    message: "Required",
                                },
                            ]}
                            name="defDescription"
                        >
                            <Input placeholder='Defect Description'/>
                        </Form.Item>
                        <Form.Item
                            rules={[
                                {
                                    required: false,
                                    message: "Required",
                                },
                            ]}
                            name="rectDescription"
                        >
                            <Input placeholder='Rectification Description'/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>


                        <Form.Item
                            name="rectAta"
                        >
                            <Input placeholder='ATA'/>
                        </Form.Item>
                        <Form.Item
                            name="position"
                        >
                            <Input placeholder='POSN'/>
                        </Form.Item>
                        <Form.Item
                            rules={[
                                {
                                    required: false,
                                    message: "Required",
                                },
                            ]}
                            name="rectSnOff"
                        >
                            <Input placeholder='Removal S/N'/>
                        </Form.Item>
                        <Form.Item
                            rules={[
                                {
                                    required: false,
                                    message: "Required",
                                },
                            ]}
                            name="rectPnOff"
                        >
                            <Input placeholder='Removal P/N'/>
                        </Form.Item>
                        <Form.Item
                            name="reasonForRemoval"
                        >
                            <Input placeholder='Reason for Removal'/>
                        </Form.Item>

                    </Col>

                    <Col xs={24} md={6}>


                        <Form.Item
                            rules={[
                                {
                                    required: false,
                                    message: "Required",
                                },
                            ]}
                            name="rectSnOn"
                        >
                            <Input placeholder='Installed S/N'/>
                        </Form.Item>
                        <Form.Item
                            rules={[
                                {
                                    required: false,
                                    message: "Required",
                                },
                            ]}
                            name="rectPnOn"
                        >
                            <Input placeholder='Installed P/N'/>
                        </Form.Item>


                        <Form.Item
                            rules={[
                                {
                                    required: false,
                                    message: "Required",
                                },
                            ]}
                            name="remark"
                        >
                            <Input placeholder='Remark'/>
                        </Form.Item>
                        <Form.Item name="isDecimal">
                            <Select placeholder="Select Format" allowClear>
                                {IS_DECIMAL.map((decimal: any) => (
                                    <Select.Option value={decimal.value} key={decimal.id}>
                                        {decimal.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="size" label="Page Size">
                            <Select id="antSelect" defaultValue={10}>
                                <Select.Option value="10">10</Select.Option>
                                <Select.Option value="20">20</Select.Option>
                                <Select.Option value="30">30</Select.Option>
                                <Select.Option value="40">40</Select.Option>
                                <Select.Option value="50">50</Select.Option>
                            </Select>
                        </Form.Item>


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


                <DefectRegister ref={reportRef}>
                    <img className="first" src={logo} alt="" width={110}/>
                    <Typography.Title level={5} className="title first">MAINTENANCE / DEFECT REGISTER</Typography.Title>
                    <Row justify="space-evenly" className="aircraft-info first">
                        <Col>MODEL: {aircraftsInfo?.aircraftModelName}</Col>
                        <Col>
                            <Row justify="space-between">
                                <Col style={{margin: "0 200px"}}>MSN: {aircraftsInfo?.airframeSerial}</Col>
                                <Col>REGN: {aircraftsInfo?.aircraftName}</Col>
                            </Row>
                        </Col>
                    </Row>
                    <ARMReportTable className="maintenance-table first">
                        <tbody>
                        <tr>
                            <th rowSpan={2}>S/N</th>
                            <th rowSpan={2}>DATE</th>
                            <th rowSpan={2}>STN</th>
                            <th colSpan={2}>AIRCRAFT</th>
                            <th rowSpan={2}>REF. (W.O. ATL &amp; <br/> NRC)</th>
                            <th colSpan={2}>DESCRIPTION</th>
                            <th rowSpan={2}>ATA</th>
                            <th rowSpan={2}>POSN</th>
                            <th colSpan={2}>REMOVAL</th>
                            <th rowSpan={2}>REASON <br/> FOR <br/> REMOVAL</th>
                            <th colSpan={2}>INSTALLED</th>
                            <th rowSpan={2}>GRN</th>
                            <th rowSpan={2}>REMARKS</th>
                        </tr>
                        <tr>
                            <th>HRS</th>
                            <th>CYCLES</th>
                            <th>DEFECT</th>
                            <th>RECTIFICATION</th>
                            <th>P/N</th>
                            <th>S/N</th>
                            <th>P/N</th>
                            <th>S/N</th>
                        </tr>
                        {
                            data.map((d: any, index) => (
                                <tr key={index}>
                                    <td>{pageSerialNo(currentPage, index + 1)}</td>
                                    <td>{d.amlDate ? moment(`${d.amlDate}`, "YYYY-MM-DD").format("DD-MMM-YY") : moment(`${d.nrcDate}`, "YYYY-MM-DD").format("DD-MMM-YY")}</td>
                                    <td>{d.defectAirportIataCode}</td>
                                    <td>{d.amlAirFrameTotalTime && formatSingleTimeValue(d.amlAirFrameTotalTime)}</td>
                                    <td>{d.amlAirframeTotalCycle}</td>
                                    <td>
                                        {d.pageNo ? `ATL: ${d.pageNo}${!d.alphabet ? '' : d.alphabet}` : `NRC: ${d.nrcNo}`}
                                        <br/>
                                        {d.woNo ? `WO: ${d.woNo}` : ""}
                                    </td>
                                    <td className='newLineInRow' style={{width: '20%'}}>{d.defectDescription}</td>
                                    <td className='newLineInRow' style={{width: '20%'}}>{d.rectDescription}</td>
                                    <td>{d.rectAta}</td>
                                    <td>{d.rectPos}</td>
                                    <td>{d.rectPnOff}</td>
                                    <td>{d.rectSnOff}</td>
                                    <td>{d.reasonForRemoval}</td>
                                    <td>{d.rectPnOn}</td>
                                    <td>{d.rectSnOn}</td>
                                    <td>{d.rectGrn}</td>
                                    <td>{d.remark}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </ARMReportTable>
                    <ARMReportTable className="second">
                        <table style={{width: "100%"}} ref={maintenanceDefectRegisterRef}>
                            <thead className="report-header">
                            <tr>
                                <td className="report-header-cell border-none" colSpan={17}>
                                    <div>
                                        <Col span={24}>
                                            <Row>
                                                {
                                                    printState ?
                                                        <Col>
                                                            <CompanyLogo/>
                                                        </Col>
                                                        :
                                                        <Col>
                                                           
                                                        </Col>
                                                }
                                            </Row>
                                        </Col>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={17} className="border-none">
                                    <Typography.Title level={5} className="title">MAINTENECE / DEFECT
                                        REGISTER</Typography.Title>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={17} className="none">empty</td>
                            </tr>
                            <tr>
                                <td colSpan={17} className="border-none">
                                    <Row justify="space-evenly" className="aircraft-info">
                                        <Col>MODEL: {aircraftsInfo?.aircraftModelName}</Col>
                                        <Col>
                                            <Row justify="space-between">
                                                <Col
                                                    style={{margin: "0 200px"}}>MSN: {aircraftsInfo?.airframeSerial}</Col>
                                                <Col>REGN. - {aircraftsInfo?.aircraftName}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </td>
                            </tr>
                            <tr className="border-bold">
                                <th rowSpan={2}>S/N</th>
                                <th rowSpan={2} style={{width:"7%"}}>DATE</th>
                                <th rowSpan={2}>STN</th>
                                <th colSpan={2}>AIRCRAFT</th>
                                <th rowSpan={2}>REF. (W.O. ATL &amp; <br/> NRC)</th>
                                <th colSpan={2}>DESCRIPTION</th>
                                <th rowSpan={2}>ATA</th>
                                <th rowSpan={2}>POSN</th>
                                <th colSpan={2}>REMOVAL</th>
                                <th rowSpan={2}>REASON <br/> FOR <br/> REMOVAL</th>
                                <th colSpan={2}>INSTALLED</th>
                                <th rowSpan={2}>GRN</th>
                                <th rowSpan={2}>REMARKS</th>
                            </tr>
                            <tr className="border-bold">
                                <th>HRS</th>
                                <th>CYCLES</th>
                                <th>DEFECT</th>
                                <th>RECTIFICATION</th>
                                <th>P/N</th>
                                <th>S/N</th>
                                <th>P/N</th>
                                <th>S/N</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                printData.map((d: any, index) => (
                                    <tr key={index} className="border-bold">
                                        <td>{index + 1}</td>
                                        <td>{d.amlDate ? moment(`${d.amlDate}`, "YYYY-MM-DD").format("DD-MMM-YY") : moment(`${d.nrcDate}`, "YYYY-MM-DD").format("DD-MMM-YY")}</td>
                                        <td>{d.defectAirportIataCode}</td>
                                        <td>{d.amlAirFrameTotalTime && formatSingleTimeValue(d.amlAirFrameTotalTime)}</td>
                                        <td>{d.amlAirframeTotalCycle}</td>
                                        <td>
                                            {d.pageNo ? `ATL: ${d.pageNo}${!d.alphabet ? '' : d.alphabet}` : `NRC: ${d.nrcNo}`}
                                            <br/>
                                            {d.woNo ? `WO: ${d.woNo}` : ""}
                                        </td>
                                        {/*<td>{d.pageNo ? `ATL: ${d.pageNo}${!d.alphabet ? '' : d.alphabet}` : `NRC: ${d.nrcNo}`}</td>*/}
                                        <td>{d.defectDescription}</td>
                                        <td>{d.rectDescription}</td>
                                        <td>{d.rectAta}</td>
                                        <td>{d.rectPos}</td>
                                        <td>{d.rectPnOff}</td>
                                        <td>{d.rectSnOff}</td>
                                        <td>{d.reasonForRemoval}</td>
                                        <td>{d.rectPnOn}</td>
                                        <td>{d.rectSnOn}</td>
                                        <td>{d.rectGrn}</td>
                                        <td>{d.remark}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </ARMReportTable>
                    {data.length > 0 && <Row justify="center" className="pagination">
                        <Col style={{marginTop: 10}}>
                            <Pagination current={currentPage} onChange={setCurrentPage} total={totalPages * 10}/>
                        </Col>
                    </Row>}
                </DefectRegister>
            </ARMCard>
            </Permission>
        </CommonLayout>
    )
};
