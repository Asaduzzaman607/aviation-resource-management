import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Button, Col, DatePicker, Form, Input, Pagination, Row, Select, Space, Typography} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import ReactToPrint from "react-to-print";
import React, {createRef, useCallback, useEffect, useRef, useState} from "react";
import SuccessButton from "../../../common/buttons/SuccessButton";
import {REQUIRED} from "../../../../lib/constants/validation-rules";
import {useAircraftsList} from "../../../../lib/hooks/planning/aircrafts";
import ARMButton from "../../../common/buttons/ARMButton";
import {DownloadOutlined, FilterOutlined, PrinterOutlined, RollbackOutlined} from "@ant-design/icons";
import styled from "styled-components";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import {ARMReportTable} from "../ARMReportTable";
import CompanyLogo from "../CompanyLogo";
import {useBoolean} from "react-use";
import API from "../../../../service/Api";
import {notifyError, notifyResponseError} from "../../../../lib/common/notifications";
import TaskDoneServices from "../../../../service/TaskDoneServices";
import {DateFormat, fhHour, formatHour, getFolderPathByMatchedString, pageSerialNo} from "../Common";
import moment from "moment";
import {formatSingleTimeValue} from "../../../../lib/common/presentation";
import {dateFormat, dateFormat2} from "../AirframeAndApplianceADStatus";
import DateTimeConverter from "../../../../converters/DateTimeConverter";
import {sleep} from "../../../../lib/common/helpers";
import Permission from "../../../auth/Permission";
import {useDownloadExcel} from "react-export-table-to-excel";
import {refreshTaskData} from "../../../../lib/common/refreshTaskData";

const TITLE = "STC & MOD Status";

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
  @media print {
    padding: 30px !important;
  }

  .text {
    margin-top: -20px !important;
  }

  .none {
    border: none;
    visibility: hidden;
  }

  .border-none {
    border: none;
  }

  width: 100% !important;

  .title {
    margin-left: 25%;
    margin-top: -1%;
  }

  .second {
    display: none;
  }

  @page {
    size: landscape;
  }

  .page-of-report {
    display: none;
  }
`;


interface Record {
    ata: any
    modNo: string
    description: string
    refDoc: any
    doneDate: string
    doneHour: number
    doneCycle: number
    dueDate: string
    dueHour: number
    dueCycle: number
    status: number
    remark: string
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

export default function STCAndMODStatus() {
    const reportRef = createRef<any>();
    const [form] = Form.useForm<any>();
    const {allAircrafts, getAllAircrafts} = useAircraftsList();
    const [submitting, toggleSubmitting] = useBoolean(false);
    const [data, setData] = useState([])
    const [aircraftApuDetails, setAircraftApuDetails] = useState<AircraftDetails>()
    const aircraftId = Form.useWatch('aircraftId', form);
    const taskNo = Form.useWatch('taskNo', form);
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const date = Form.useWatch('date', form)
    const [printData, setPrintData] = useState([])
    const [printState, setPrintState] = useState(false)

    useEffect(() => {
        (async () => {
            await getAllAircrafts();

        })();
    }, [getAllAircrafts])


    const handleStcModSearch = useCallback(async (values: any) => {

        const [fromDate, toDate] = values.dateRange || '';

        const searchValues = {
            aircraftId: values.aircraftId,
            fromDate: DateTimeConverter.momentDateToString(fromDate) || '',
            toDate: DateTimeConverter.momentDateToString(toDate) || '',
            taskNo: values.taskNo || null,
            isPageable: true
        };
        try {
            const {data} = await API.post(`task-report/stc-report?page=${currentPage}&size=${values.size}`, searchValues);
            setData(data.model);
            setCurrentPage(data.currentPage)
            setTotalPages(data.totalPages)
        } catch (error) {
            notifyResponseError(error)
        } finally {
            toggleSubmitting(false);
        }
    }, [currentPage, toggleSubmitting])

    useEffect(() => {
        if (!aircraftId) {
            return;
        }
        (async () => {
            await handleStcModSearch(form.getFieldsValue(true));
        })();
    }, [handleStcModSearch, form]);


    const fetchPrintData = async () => {
        const [fromDate, toDate] = date
        const customValues = {
            aircraftId: aircraftId,
            fromDate: DateTimeConverter.momentDateToString(fromDate),
            toDate: DateTimeConverter.momentDateToString(toDate),
            taskNo: taskNo || null,
            isPageable: false
        }
        try {
            const {data} = await API.post(`task-report/stc-report`, customValues);
            setPrintData(data.model)
            setPrintState(true)
            return sleep(1200);
        } catch (error) {
            notifyError(error)
        }
    }


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
        setData([]);
        // @ts-ignore
        setAircraftApuDetails({})
    }


    const tableRef = useRef(null);
    const {onDownload} = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'STC and MOD status report',
        sheet: 'stcModStatusReport'
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
        <Permission permission="PLANNING_SCHEDULE_TASKS_STC_AND_MOD_STATUS_SEARCH" showFallback>
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

                <Form
                    form={form}
                    name="filter-form"
                    initialValues={{aircraftId: null, date: '', size: 10}}
                    onFinish={handleStcModSearch}
                >
                    <Row gutter={20}>

                        <Col xs={24} md={4}>
                            <Form.Item
                                rules={[REQUIRED]}
                                name="aircraftId"
                            >

                                <Select
                                    placeholder="Select Aircraft"
                                >
                                    {
                                        allAircrafts?.map(({aircraftId, aircraftName}) => <Select.Option
                                            value={aircraftId}
                                            key={aircraftId}>{aircraftName}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={6}>
                            <Form.Item
                                name="date"
                            >
                                <DatePicker.RangePicker format="DD-MM-YYYY" style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item
                                name="taskNo"
                            >

                                <Input placeholder="Enter STC No"/>
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
                                    <ARMButton
                                        size="middle"
                                        type="primary"
                                        onClick={resetFilter}
                                    >
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
                                    <Typography.Title className="title" level={4}>STC &amp; MOD
                                        STATUS</Typography.Title>
                                </Col>
                            </Row>

                            <Row className="table-responsive">
                                <ResponsiveTable className="first">

                                    <ARMReportTable className="table">
                                        <thead>
                                        <tr>
                                            <th className="none" colSpan={5}></th>
                                            <th>A/C TYPE</th>
                                            <th>REG NO</th>
                                            <th>MSN</th>
                                            <th>MFD</th>
                                            <th>TAT</th>
                                            <th>TAC</th>
                                            <th>DATE</th>
                                        </tr>

                                        <tr>
                                            <td className="none" colSpan={5}></td>
                                            <th>{aircraftApuDetails?.aircraftModelName}</th>
                                            <th>{aircraftApuDetails?.aircraftName}</th>
                                            <th> {aircraftApuDetails?.airframeSerial ? aircraftApuDetails?.airframeSerial : 'N/A'}</th>
                                            <th>{aircraftApuDetails?.manufactureDate && DateFormat(aircraftApuDetails?.manufactureDate)}</th>
                                            <th>{aircraftApuDetails?.acHour ? formatSingleTimeValue(aircraftApuDetails.acHour) : 'N/A'}</th>
                                            <th>{aircraftApuDetails?.acCycle ? aircraftApuDetails.acCycle : 'N/A'}</th>
                                            <th>{dateFormat(aircraftApuDetails?.updatedTime)}</th>
                                        </tr>
                                        </thead>
                                        <br/>
                                        <thead>
                                        <tr>
                                            <th rowSpan={2}>S/N</th>
                                            <th rowSpan={2}>ATA</th>
                                            <th rowSpan={2}>MODIFICATION/STC NO</th>
                                            <th rowSpan={2}>DESCRIPTION</th>
                                            <th rowSpan={2}>REFERENCE DOCUMENT</th>
                                            <th colSpan={3}>LAST INCORPORATION</th>
                                            <th colSpan={3}>NEXT INCORPORATION</th>
                                            <th rowSpan={2}>STATUS</th>
                                            <th rowSpan={2}>REMARKS</th>
                                        </tr>

                                        <tr>
                                            <th>DATE</th>
                                            <th>FH</th>
                                            <th>FC</th>

                                            <th>DATE</th>
                                            <th>FH</th>
                                            <th>FC</th>
                                        </tr>
                                        </thead>

                                        <tbody style={{whiteSpace: 'nowrap'}} className="data">
                                        {data?.map((data: any, index: number) => (
                                            <tr key={index}>
                                                <td>{pageSerialNo(currentPage, index + 1)}</td>
                                                <td>{data?.ata}</td>
                                                <td onClick={() => {
                                                    getFolderPathByMatchedString(data?.modNo)
                                                }}   style={{cursor: 'pointer', textDecoration: "underline"}}>
                                                    {data?.modNo}
                                                </td>
                                                <td className='newLineInRow'>{data?.description}</td>
                                                <td>{data?.refDoc}</td>
                                                <td>{DateFormat(data?.doneDate)}</td>
                                                <td>{fhHour(data?.doneHour)}</td>
                                                <td>{data?.doneCycle}</td>
                                                <td>{dateFormat(data?.dueDate)}</td>
                                                <td>{fhHour(data?.dueHour)}</td>
                                                <td>{data?.dueCycle}</td>
                                                <td>{data?.status}</td>
                                                <td>{data?.remark}</td>
                                            </tr>
                                        ))}

                                        </tbody>
                                    </ARMReportTable>
                                </ResponsiveTable>
                                <ResponsiveTable className="second">
                                    <ARMReportTable className="table">
                                        <table className="report-container" style={{width: "100%"}} ref={tableRef}>
                                            <thead className="report-header">
                                            <tr>
                                                <td className="report-header-cell border-none" colSpan={13}>
                                                    <div className="header-info">
                                                        <Col span={24}>
                                                            <Row justify="space-between">
                                                                {printState ?
                                                                    <Col>
                                                                        <CompanyLogo/>
                                                                    </Col> :
                                                                    <Col>

                                                                    </Col>}
                                                                <Col style={{fontSize: "10px", textAlign: "left"}}>
                                                                    <Typography.Text>Form: CAME-033</Typography.Text>
                                                                    <br/>
                                                                    <Typography.Text>ISSUE INITIAL</Typography.Text>
                                                                    <br/>
                                                                    <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col span={12}>
                                                                    <Typography.Title level={3}
                                                                                      style={{fontSize: "1rem"}}>STC &
                                                                        MOD STATUS</Typography.Title>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                {printState ? <td colSpan={13} style={{display: "none"}}>empty</td> :
                                                    <td colSpan={13} style={{display: "none"}}></td>}
                                            </tr>
                                            <tr>
                                                <th className="none" colSpan={5}></th>
                                                <th className="border-bold">A/C TYPE</th>
                                                <th className="border-bold">REG NO</th>
                                                <th className="border-bold">MSN</th>
                                                <th className="border-bold">MFD</th>
                                                <th className="border-bold">TAT</th>
                                                <th className="border-bold">TAC</th>
                                                <th className="border-bold">DATE</th>
                                            </tr>

                                            <tr>
                                                <td className="none" colSpan={5}></td>
                                                <th className="border-bold">{aircraftApuDetails?.aircraftModelName}</th>
                                                <th className="border-bold">{aircraftApuDetails?.aircraftName}</th>
                                                <th className="border-bold"> {aircraftApuDetails?.airframeSerial ? aircraftApuDetails?.airframeSerial : 'N/A'}</th>
                                                <th className="border-bold">{aircraftApuDetails?.manufactureDate && dateFormat2(aircraftApuDetails?.manufactureDate)}</th>
                                                <th className="border-bold">{aircraftApuDetails?.acHour ? formatSingleTimeValue(aircraftApuDetails.acHour) : 'N/A'}</th>
                                                <th className="border-bold">{aircraftApuDetails?.acCycle ? aircraftApuDetails.acCycle : 'N/A'}</th>
                                                <th className="border-bold">{dateFormat(aircraftApuDetails?.updatedTime)}</th>
                                            </tr>
                                            <tr>
                                                {printState ? <td colSpan={13} className="none">empty</td> :
                                                    <td colSpan={13} className="none"></td>}
                                            </tr>
                                            <tr className="border-bold">
                                                <th rowSpan={2}>S/N</th>
                                                <th rowSpan={2}>ATA</th>
                                                <th rowSpan={2}>MODIFICATION/STC NO</th>
                                                <th rowSpan={2}>DESCRIPTION</th>
                                                <th rowSpan={2}>REFERENCE DOCUMENT</th>
                                                <th colSpan={3}>LAST INCORPORATION</th>
                                                <th colSpan={3}>NEXT INCORPORATION</th>
                                                <th rowSpan={2}>STATUS</th>
                                                <th rowSpan={2}>REMARKS</th>
                                            </tr>
                                            <tr className="border-bold">
                                                <th>DATE</th>
                                                <th>FH</th>
                                                <th>FC</th>
                                                <th>DATE</th>
                                                <th>FH</th>
                                                <th>FC</th>
                                            </tr>
                                            </thead>
                                            <tbody style={{whiteSpace: 'nowrap'}} className="data">
                                            {printData.map((data: any, index: number) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data?.ata}</td>
                                                    <td>{data?.modNo}</td>
                                                    <td className='newLineInRow'>{data?.description}</td>
                                                    <td className='newLineInRow'>{data?.refDoc}</td>
                                                    <td>{dateFormat(data?.doneDate)}</td>
                                                    <td>{fhHour(data?.doneHour)}</td>
                                                    <td>{data?.doneCycle}</td>
                                                    <td>{dateFormat(data?.dueDate)}</td>
                                                    <td>{fhHour(data?.dueHour)}</td>
                                                    <td>{data?.dueCycle}</td>
                                                    <td>{data?.status}</td>
                                                    <td>{data?.remark}</td>
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


                {
                    data?.length > 0 && (
                        <Row justify="center" className="pagination">
                            <Col style={{marginTop: 10}}>
                                <Pagination current={currentPage} onChange={setCurrentPage} pageSize={10}
                                            total={totalPages * 10}/>
                            </Col>
                        </Row>
                    )
                }

            </ARMCard>
        </Permission>
    </CommonLayout>;
}