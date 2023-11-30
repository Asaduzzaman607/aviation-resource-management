import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {
    Breadcrumb, Button,
    Col,
    DatePicker,
    Form,
    Input,
    Pagination,
    Row,
    Select,
    Space,
    Typography,
} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import ReactToPrint from "react-to-print";
import React, {createRef, useEffect, useState, useCallback, useRef} from "react";
import SuccessButton from "../../../common/buttons/SuccessButton";
import {REQUIRED} from "../../../../lib/constants/validation-rules";
import {useAircraftsList} from "../../../../lib/hooks/planning/aircrafts";
import ARMButton from "../../../common/buttons/ARMButton";
import {
    DownloadOutlined,
    FilterOutlined,
    PrinterOutlined,
    RollbackOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import {ARMReportTable} from "../ARMReportTable";
import CompanyLogo from "../CompanyLogo";
import API from "../../../../service/Api";
import {formatSingleTimeValue, formatTimeValue} from "../../../../lib/common/presentation";
import moment from "moment";
import {ApuCycleDetailsWithFlag, ApuHourDetailsWithFlag, CalculateTsnTsoTat, DateFormat} from "../Common";
import {useBoolean} from "react-use";
import {sleep} from "../../../../lib/common/helpers";
import {notifyError} from "../../../../lib/common/notifications";
import Permission from "../../../auth/Permission";
import {useDownloadExcel} from "react-export-table-to-excel";


const printStyle = `
*{
  margin: 0!important;
  padding: 0!important;
  font-size: 10px!important;
  overflow: visible!important;
}
.border-bold,
.border-bold td{
  border-width: 1px !important;
  border-style: solid !important;
  border-color: #000 !important;
}
.title{
  font-size: 14px !important;
}
.pagination{
  visibility: hidden!important;
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
@page{ size: landscape!important; }
`

const ReportContainer = styled.div`
  @media print {
    padding: 30px !important;
  }

  .table {
    margin-top: 20px;
  }

  .text {
    margin-top: -20px !important;
  }

  .title {
    font-size: 1.5rem;
    background-color: #EBF1DE;
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

  .text-bold {
    font-weight: bold;
  }

  .border-2px {
    border: 2px solid #000 !important;
  }

  width: 100% !important;

  @page {
    size: landscape
  }
`;


const TITLE = "On Condition Components Lists";

export default function AircraftOnConditionComponentStatus() {

    const reportRef = createRef();
    const [form] = Form.useForm();
    const {allAircrafts, getAllAircrafts} = useAircraftsList();
    const aircraftId = Form.useWatch('aircraftId', form)
    const description = Form.useWatch('description', form)
    const partNumber = Form.useWatch('partNumber', form)
    const serialNumber = Form.useWatch('serialNumber', form)
    const installationDate = Form.useWatch('installationDate', form)
    const installationFH = Form.useWatch('installationFH', form)
    const installationFC = Form.useWatch('installationFC', form)
    const pageSize = Form.useWatch('size', form)
    const [aircraftInfo, setAircraftInfo] = useState({})
    const [data, setData] = useState([])
    const [printData, setPrintData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [submitting, toggleSubmitting] = useBoolean(false)
    const [printState, setPrintState] = useState(false)
    const [filterState, setFilterState] = useState(false)


    const customInstallationFH = installationFH?.replace(":", ".");


    useEffect(() => {
        (async () => {
            await getAllAircrafts();
        })();
    }, [getAllAircrafts]);


    useEffect(() => {
        if (!aircraftId) {
            return
        }
        (async () => {
            await getAircraftInfo();
        })();
    }, [aircraftId]);

    const getAircraftInfo = async () => {
        if (!aircraftId) return
        const {data} = await API.get(`aircrafts/info/${aircraftId}`)
        setAircraftInfo(data)
    }


    const fetchReportData = useCallback(async (values) => {

        const sizeParam = parseInt(pageSize)

        const fh = values.installationFH;
        const installationFH = fh?.replace(":", ".");

        try {
            toggleSubmitting()
            const customValues = {
                aircraftId: values.aircraftId,
                isPageable: true,
                description: values.description,
                partNumber: values.partNumber,
                serialNumber: values.serialNumber,
                installationDate: values.installationDate ? moment(values.installationDate) : null,
                installationFH: installationFH,
                installationFC: values.installationFC
            }

            const {data} = await API.post(`aircraft-build/search/OCCM-report?page=${filterState ? 1 : currentPage}&size=${sizeParam}`, customValues);
            setData(data?.model);
            setCurrentPage(data.currentPage)
            setTotalPages(data.totalPages)
        } catch (error) {
            notifyError(error)
        } finally {
            toggleSubmitting()
        }
    }, [pageSize, currentPage, toggleSubmitting])

    const fetchPrintData = async () => {
        setPrintState(true)
        const customValues = {
            aircraftId: aircraftId,
            isPageable: false,
            description: description,
            partNumber: partNumber,
            serialNumber: serialNumber,
            installationDate: installationDate ? moment(installationDate) : null,
            installationFH: customInstallationFH,
            installationFC: installationFC
        }
        try {
            const {data} = await API.post(`aircraft-build/search/OCCM-report`, customValues);
            setPrintData(data.model)
            return sleep(1000);
        } catch (error) {
            notifyError(error)
        }
    }

    useEffect(() => {
        (async () => {
            await fetchReportData(form.getFieldsValue(true));
        })();
    }, [fetchReportData, form]);


    const resetFilter = () => {
        form.resetFields()
        setAircraftInfo({});
        setData([])
        setPrintData([])
        setCurrentPage(1)
    };

    const tableRef = useRef(null);
    const {onDownload} = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'On condition component status report',
        sheet: 'onConditionComponentStatusReport'
    })

    const handleExcelDownload = async () => {
        if (!aircraftId) return;
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
            <Permission permission="PLANNING_OTHERS_ON_CONDITION_COMPONENT_LIST_SEARCH" showFallback>
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
                        form={form}
                        name="filter-form"
                        initialValues={{aircraftId: null, size: 10}}
                        onFinish={fetchReportData}
                    >
                        <Row gutter={20}>
                            <Col xs={24} md={4}>
                                <Form.Item rules={[REQUIRED]} name="aircraftId">
                                    <Select placeholder="Select Aircraft" onChange={getAircraftInfo}>
                                        {allAircrafts?.map(({aircraftId, aircraftName}) => (
                                            <Select.Option value={aircraftId} key={aircraftId}>
                                                {aircraftName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: false,
                                            message: "Description is required",
                                        },
                                    ]}
                                    name="description"
                                >
                                    <Input placeholder="Description"/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: false,
                                            message: "Description is required",
                                        },
                                    ]}
                                    name="partNumber"
                                >
                                    <Input placeholder="Part No"/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: false,
                                            message: "Description is required",
                                        },
                                    ]}
                                    name="serialNumber"
                                >
                                    <Input placeholder="Serial No"/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: false,
                                            message: "Description is required",
                                        },
                                    ]}
                                    name="installationDate"
                                >
                                    <DatePicker format="DD-MM-YYYY" style={{width: "100%"}}
                                                placeholder="Installation Date"/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: false,
                                            message: "Description is required",
                                        },
                                    ]}
                                    name="installationFH"
                                >
                                    <Input placeholder="Installation Flying Hour"/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: false,
                                            message: "Description is required",
                                        },
                                    ]}
                                    name="installationFC"
                                >
                                    <Input placeholder="Installation Flying Cycle"/>
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
                                        <ARMButton onClick={() => {
                                            setFilterState(true);
                                            setCurrentPage(1)
                                        }} loading={submitting} size="middle" type="primary" htmlType="submit">
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

                    <Row ref={reportRef}>
                        <ReportContainer>
                            <Col span={24} className="first">
                                <Row justify="space-between">
                                    <Col>
                                        <CompanyLogo/>
                                    </Col>
                                    <Col style={{fontSize: "10px"}}>
                                        <Typography.Text>Form: CAME-031</Typography.Text>
                                        <br/>
                                        <Typography.Text>ISSUE INITIAL</Typography.Text>
                                        <br/>
                                        <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={24}>
                                <Row justify="center">
                                    <ResponsiveTable className="first">
                                        <ARMReportTable className="table">
                                            <tbody className="text-bold">
                                            <tr>
                                                <td colSpan={3} rowSpan={4} className="none">empty</td>
                                                <td colSpan={5} rowSpan={4} className="border-2px title">ON CONDITION
                                                    COMPONENTS LIST
                                                </td>
                                                <td rowSpan={4} className="none">empty</td>
                                                <td>A/C TYPE</td>
                                                <td>{aircraftInfo?.aircraftModelName}</td>
                                                <td>TAT</td>
                                                <td>{aircraftInfo?.acHour && formatTimeValue(aircraftInfo?.acHour)}</td>
                                                <td>AS OF</td>
                                                <td>{DateFormat(aircraftInfo?.updatedTime)}</td>
                                            </tr>
                                            <tr>
                                                <td>REGN.</td>
                                                <td>{aircraftInfo?.aircraftName}</td>
                                                <td>TAC</td>
                                                <td>{aircraftInfo?.acCycle}</td>
                                            </tr>
                                            <tr>
                                                <td>MSN</td>
                                                <td>{aircraftInfo?.airframeSerial}</td>
                                                <td>APU HRS</td>
                                                <td>{ApuHourDetailsWithFlag(aircraftInfo?.apuHours)}</td>
                                            </tr>
                                            <tr>
                                                <td>MFG DT.</td>
                                                <td>{aircraftInfo?.manufactureDate && moment(`${aircraftInfo?.manufactureDate}`, 'YYYY-MM-DD').format('DD-MMM-YY')}</td>
                                                <td>APU CYCS</td>
                                                <td>{ApuCycleDetailsWithFlag(aircraftInfo?.apuCycle)}</td>
                                            </tr>
                                            </tbody>
                                            <br/>
                                            <tbody>
                                            <tr className="text-bold">
                                                <td rowSpan={2}>ATA</td>
                                                <td rowSpan={2}>DESCRIPTION</td>
                                                <td rowSpan={2}>PART <br/> NUMBER</td>
                                                <td rowSpan={2}>SERIAL NUMBER</td>
                                                <td rowSpan={2}>LOCATION</td>
                                                <td rowSpan={2}>TASK TYPE</td>
                                                <td colSpan={3}>INSTALLATION</td>
                                                <td colSpan={6}>CURRENT</td>
                                                <td rowSpan={2}>REMARKS</td>
                                            </tr>

                                            <tr className="text-bold">
                                                <td>DATE</td>
                                                <td>FH</td>
                                                <td>FC</td>
                                                <td>TSN</td>
                                                <td>CSN</td>
                                                <td>TSO</td>
                                                <td>CSO</td>
                                                <td>TSR</td>
                                                <td>CSR</td>
                                            </tr>
                                            {
                                                data?.map((d) => (
                                                    <tr>
                                                        <td>{d?.ata}</td>
                                                        <td style={{textAlign: 'left'}}
                                                            className='newLineInRow'>{d?.description}</td>
                                                        <td>{d?.partNumber}</td>
                                                        <td>{d?.serialNumber}</td>
                                                        <td>{d?.location}</td>
                                                        <td>{d?.taskType}</td>
                                                        <td>{d?.installationDate && moment(`${d?.installationDate}`, "YYYY-MM-DD").format('DD-MMM-YY')}</td>
                                                        <td>{CalculateTsnTsoTat(d?.installationFH)}</td>
                                                        <td>{d?.installationFC ? d?.installationFC : 'N/A'}</td>
                                                        <td>{CalculateTsnTsoTat(d?.currentTSN)}</td>
                                                        <td>{d?.currentCSN ? d?.currentCSN : 'N/A'}</td>
                                                        <td>{d?.currentTSO ? formatSingleTimeValue(d?.currentTSO) : 'N/A'}</td>
                                                        <td>{d?.currentCSO ? d?.currentCSO : 'N/A'}</td>
                                                        <td>{d?.currentTSR ? formatSingleTimeValue(d?.currentTSR) : 'N/A'}</td>
                                                        <td>{d?.currentCSR ? d?.currentCSR : 'N/A'}</td>
                                                        <td>{d?.remarks}</td>
                                                    </tr>
                                                ))
                                            }
                                            </tbody>
                                        </ARMReportTable>
                                    </ResponsiveTable>
                                    <ResponsiveTable className="second">
                                        <ARMReportTable ref={tableRef}>
                                            <thead className="report-header">
                                            <tr>
                                                <td className="report-header-cell border-none" colSpan={16}>
                                                    <div className="header-info">
                                                        <Row justify="space-between" style={{marginTop: "0px"}}>
                                                            {
                                                                printState ?
                                                                    <Col>
                                                                        <CompanyLogo/>
                                                                    </Col>
                                                                    : <Col>
                                                                    </Col>
                                                            }
                                                            <Col style={{
                                                                fontSize: "8px",
                                                                textAlign: "left",
                                                                lineHeight: "1"
                                                            }}>
                                                                <Typography.Text>Form: CAME-031</Typography.Text>
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
                                                {/*{printState ? <td colSpan={3} rowSpan={4} className="none">empty</td> :*/}
                                                {/*    <td colSpan={3} rowSpan={4} className=""></td>}*/}
                                                <td colSpan={14} rowSpan={4} className="border-2px title">ON CONDITION
                                                    COMPONENTS LIST
                                                </td>
                                                {/*{printState ? <td rowSpan={4} className="none">empty</td> :*/}
                                                {/*    <td rowSpan={4} className=""></td>}*/}


                                                <td className="border-bold">A/C TYPE</td>
                                                <td className="border-bold">{aircraftInfo?.aircraftModelName}</td>
                                                <td className="border-bold">TAT</td>
                                                <td className="border-bold">{aircraftInfo?.acHour && formatTimeValue(aircraftInfo?.acHour)}</td>
                                                <td className="border-bold">AS OF</td>
                                                <td className="border-bold">{DateFormat(aircraftInfo?.updatedTime)}</td>
                                            </tr>
                                            <tr className="border-bold">
                                                <td>REGN.</td>
                                                <td>{aircraftInfo?.aircraftName}</td>
                                                <td>TAC</td>
                                                <td>{aircraftInfo?.acCycle}</td>
                                            </tr>
                                            <tr className="border-bold">
                                                <td>MSN</td>
                                                <td>{aircraftInfo?.airframeSerial}</td>
                                                <td>APU HRS</td>
                                                <td>{ApuHourDetailsWithFlag(aircraftInfo?.apuHours)}</td>
                                            </tr>
                                            <tr className="border-bold">
                                                <td>MFG DT.</td>
                                                <td>{aircraftInfo?.manufactureDate && moment(`${aircraftInfo?.manufactureDate}`, 'YYYY-MM-DD').format('DD-MMM-YY')}</td>
                                                <td>APU CYCS</td>
                                                <td>{ApuCycleDetailsWithFlag(aircraftInfo?.apuCycle)}</td>
                                            </tr>
                                            <tr>
                                                {printState ? <td className="none">ok</td> : <td className="none"></td>}
                                            </tr>
                                            <tr className="text-bold border-bold">
                                                <td rowSpan={2}>ATA</td>
                                                <td rowSpan={2}>DESCRIPTION</td>
                                                <td rowSpan={2}>PART <br/> NUMBER</td>
                                                <td rowSpan={2}>SERIAL NUMBER</td>
                                                <td rowSpan={2}>LOCATION</td>
                                                <td rowSpan={2}>TASK TYPE</td>
                                                <td colSpan={3}>INSTALLATION</td>
                                                <td colSpan={6}>CURRENT</td>
                                                <td rowSpan={2}>REMARKS</td>
                                            </tr>
                                            <tr className="text-bold border-bold">
                                                <td>DATE</td>
                                                <td>FH</td>
                                                <td>FC</td>
                                                <td>TSN</td>
                                                <td>CSN</td>
                                                <td>TSO</td>
                                                <td>CSO</td>
                                                <td>TSR</td>
                                                <td>CSR</td>
                                            </tr>
                                            </thead>
                                            <tbody className="text-bold">
                                            {
                                                printData?.map((d, index) => (
                                                    <tr key={index} className="border-bold">
                                                        <td>{d?.ata}</td>
                                                        <td style={{textAlign: 'left'}}
                                                            className='newLineInRow'>{d?.description}</td>
                                                        <td>{d?.partNumber}</td>
                                                        <td>{d?.serialNumber}</td>
                                                        <td>{d?.location}</td>
                                                        <td>{d?.taskType}</td>
                                                        <td>{d?.installationDate && moment(`${d?.installationDate}`, "YYYY-MM-DD").format('DD-MMM-YY')}</td>
                                                        <td>{CalculateTsnTsoTat(d?.installationFH)}</td>
                                                        <td>{d?.installationFC ? d?.installationFC : 'N/A'}</td>
                                                        <td>{CalculateTsnTsoTat(d?.currentTSN)}</td>
                                                        <td>{d?.currentCSN ? d?.currentCSN : 'N/A'}</td>
                                                        <td>{d?.currentTSO ? formatSingleTimeValue(d?.currentTSO) : 'N/A'}</td>
                                                        <td>{d?.currentCSO ? d?.currentCSO : 'N/A'}</td>
                                                        <td>{d?.currentTSR ? formatSingleTimeValue(d?.currentTSR) : 'N/A'}</td>
                                                        <td>{d?.currentCSR ? d?.currentCSR : 'N/A'}</td>
                                                        <td>{d?.remarks}</td>
                                                    </tr>
                                                ))
                                            }
                                            </tbody>
                                        </ARMReportTable>
                                    </ResponsiveTable>
                                </Row>
                            </Col>
                            {data?.length > 0 && (
                                <Row justify="center" className="pagination first"
                                     onClick={() => setFilterState(false)}>
                                    <Col style={{marginTop: 10}}>
                                        <Pagination current={currentPage} onChange={setCurrentPage}
                                                    showSizeChanger={false} total={totalPages * 10}/>
                                    </Col>
                                </Row>
                            )}
                        </ReportContainer>
                    </Row>
                </ARMCard>
            </Permission>
        </CommonLayout>
    );
}
