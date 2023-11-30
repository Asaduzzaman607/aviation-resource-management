import {DownloadOutlined, FilterOutlined, PrinterOutlined, RollbackOutlined} from "@ant-design/icons";
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
import {useBoolean} from "react-use";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import ARMButton from "../../../common/buttons/ARMButton";
import SuccessButton from "../../../common/buttons/SuccessButton";
import CommonLayout from "../../../layout/CommonLayout";
import logo from "../../../../components/images/us-bangla-logo.png";
import styled from "styled-components";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import ARMTable from "../../../common/ARMTable";
import DateTimeConverter from "../../../../converters/DateTimeConverter";
import MelService from "../../../../service/planning/MelService";
import {getErrorMessage, sleep} from "../../../../lib/common/helpers";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {useAircraftsList} from "../../../../lib/hooks/planning/aircrafts";
import API from "../../../../service/Api";
import CompanyLogo from "../CompanyLogo";
import {ARMReportTable} from "../ARMReportTable";
import {DateFormat, pageSerialNo} from "../Common";
import Permission from "../../../auth/Permission";
import {useDownloadExcel} from "react-export-table-to-excel";

const TITLE = "AIRCRAFT MEL AND CDL STATUS";

const printStyle = `
*{
    margin: 0!important;
    padding: 0!important;
    font-size: 10px!important;
    overflow: visible!important;
  }
  .mel-report td,
  .mel-report th,
  table tbody tr td{
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
    @page{ size: landscape!important; }
`;

const AircrfatMel = styled.div`
  .title {
    text-align: center;
    border: 1px solid #000;
    font-weight: bold;
    font-size: 12px;
  }

  .report tr td {
    height: 40px !important;
  }

  .aircrafts-info {
    font-size: 10px;
    font-weight: bold;
    margin: 16px 0;
  }

  .mel-table thead tr th {
    height: 10px !important;
    padding: 0 !important;
  }

  .mel-table tbody tr td {
    height: 40px !important;
  }

  .mel-table th,
  .mel-table thead tr td,
  .mel-table tbody tr td {
    border-width: .4px !important;
    border-style: solid !important;
    border-color: #000 !important;
    padding: 0;
  }

  .border-none {
    border: none;
  }

  .none {
    visibility: hidden;
    border: none;
  }

  .second {
    display: none;
  }

  .header-info {
    margin-bottom: 5px !important;
  }

  @page {
    size: landscape
  }
`;

const isClosedOptions = [
    {isClosedName: 'OPEN', isClosed: false},
    {isClosedName: 'CLOSED', isClosed: true},
]


export default function AircraftMELAndCDLStatus() {
    const [form] = Form.useForm();
    const reportRef = createRef<any>();
    const [submitting, toggleSubmitting] = useBoolean(false);
    const [printState, setPrintState] = useBoolean(false);
    const [melReport, setMelReport] = useState<any>([]);
    const {allAircrafts, getAllAircrafts} = useAircraftsList();
    const aircraftId = Form.useWatch('aircraftId', form);
    const isClosed = Form.useWatch('isClosed', form);
    const size = Form.useWatch('size', form);
    const [aircraftInfo, setAircraftInfo] = useState<any>({})
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const dateData = Form.useWatch('dateRange', form)
    const [printData, setPrintdata] = useState<any[]>([])
    const {t} = useTranslation()


    useEffect(() => {
        (async () => {
            await getAllAircrafts();

        })();
    }, [getAllAircrafts])

    useEffect(() => {
        if (!aircraftId) {
            return
        }
        getAircraftDetails()
    }, [aircraftId])

    const getAircraftDetails = async () => {
        const aircrftInfo = await API.get(`aircrafts/info/${aircraftId}`)
        setAircraftInfo(aircrftInfo.data)
    }



    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);


    const onMelSearch = useCallback(async (values: any) => {

        const [fromDate, toDate] = values.dateRange || '';
        const searchValues = {
            aircraftId: values.aircraftId,
            fromDate: DateTimeConverter.momentDateToString(fromDate),
            toDate: DateTimeConverter.momentDateToString(toDate),
            isClosed: values?.isClosed,
            isPageable: true
        };
        try {
            const {data} = await MelService.searchMel(searchValues, currentPage, parseInt(size));
            setMelReport(data.model);
            setCurrentPage(data.currentPage)
            setTotalPages(data.totalPages)

        } catch (error) {
            // notification["error"]({ message: getErrorMessage(error) });
        } finally {
            toggleSubmitting(false);
        }
    }, [currentPage, toggleSubmitting, size]);


    useEffect(() => {
        (async () => {
            await onMelSearch(form.getFieldsValue(true));
        })();
    }, [onMelSearch, form])

    const fetchPrintData = async () => {
        const [fromDate, toDate] = dateData || '';
        const searchValues = {
            aircraftId: aircraftId,
            fromDate: DateTimeConverter.momentDateToString(fromDate) || null,
            toDate: DateTimeConverter.momentDateToString(toDate) || null,
            isClosed: isClosed,
            isPageable: false
        };
        try {
            const {data} = await API.post(`/mel/search`, searchValues);
            const aircrftInfo = await API.get(`aircrafts/info/${aircraftId}`)
            setAircraftInfo(aircrftInfo.data)
            setPrintdata(data.model)
            setPrintState(true)
            return sleep(1000)
        } catch (error) {
            notification["error"]({message: getErrorMessage(error)});
        }
    }

    const resetFilter = () => {
        form.resetFields();
        setMelReport([])
        setPrintdata([])
    };


    const melCdlRef = useRef(null);
    const {onDownload} = useDownloadExcel({
        currentTableRef: melCdlRef.current,
        filename: 'AIRCRAFT MEL AND CDL STATUS',
        sheet: 'aircraftMelCdlStatusReport'
    })

    const downloadMelCdlExcel = async () => {

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
                            <i className="fas fa-chart-line"/> &nbsp;{t("planning.Planning")}
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{TITLE}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_AIRCRAFT_MEL_CDL_STATUS_SEARCH" showFallback>
                <ARMCard
                    title={
                        <Row justify="space-between">
                            <Col>{TITLE}</Col>
                            <Col>
                                <Space>
                                    <Button icon={<DownloadOutlined/>} onClick={downloadMelCdlExcel}> Export
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
                    <Form form={form} name="filter-form" initialValues={{
                        aircraftId: null,
                        dateRange: [moment(firstDay, 'DD-MM-YYYY'), moment(lastDay, 'DD-MM-YYYY')],
                        isClosed : false,
                        size: 10
                    }} onFinish={onMelSearch}>
                        <Row gutter={20}>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    name="aircraftId"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Aircraft is required ",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Select Aircraft" allowClear>
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
                            <Col xs={24} md={8}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: "Date range is required",
                                        },
                                    ]}
                                    name="dateRange"
                                >
                                    <DatePicker.RangePicker format="DD-MM-YYYY" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: "Is closed is required",
                                        },
                                    ]}
                                    name="isClosed"
                                >
                                    <Select placeholder="Select Status" allowClear>
                                        {isClosedOptions?.map((item: any, index) => {
                                            return (
                                                <Select.Option key={index} value={item.isClosed}>
                                                    {item.isClosedName}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
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

                            <Col xs={24} md={8}>
                                <Form.Item>
                                    <Space>
                                        <ARMButton loading={submitting} size="middle" type="primary" htmlType="submit">
                                            <FilterOutlined name="filter"/> {t("common.Filter")}
                                        </ARMButton>
                                        <ARMButton size="middle" type="primary" onClick={resetFilter}>
                                            <RollbackOutlined name="reset"/> {t("common.Reset")}
                                        </ARMButton>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <AircrfatMel ref={reportRef} className="aircraft-mel">
                        <Row className="first">
                            <Col span={24}>
                                <Row justify="space-between">
                                    <Col>
                                        <img src={logo} alt="" width={110}/>
                                    </Col>
                                    <Col style={{fontSize: "8px", fontWeight: "bold", marginRight: "50px"}}>
                                        <Typography.Text>{t("planning.Reports.Form")}: CAME-020</Typography.Text> <br/>
                                        <Typography.Text>{t("planning.Reports.ISSUE")}: INITIAL</Typography.Text> <br/>
                                        <Typography.Text>{t("planning.Reports.DATE")}: 19-01-2022</Typography.Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Typography.Title level={5} className="title first">
                            {TITLE}
                        </Typography.Title>
                        <Row justify="space-around" className="aircrafts-info first">
                            <Col>
                                <Typography.Text>{t("planning.Aircraft MEL and CDL Status.REGN")}: {aircraftInfo?.aircraftName}</Typography.Text>
                                <br/>
                                <Typography.Text>{t("planning.Aircraft MEL and CDL Status.MSN")}: {aircraftInfo?.airframeSerial}</Typography.Text>
                                <br/>
                            </Col>
                            <Col>
                                <Typography.Text>{t("planning.Aircraft MEL and CDL Status.AC-TYPE")}: {aircraftInfo?.aircraftModelName}</Typography.Text>
                                <br/>
                                <Typography.Text>{t("planning.Aircraft MEL and CDL Status.DATE")}: {DateFormat(aircraftInfo?.updatedTime)}</Typography.Text>
                                <br/>
                            </Col>
                        </Row>
                        <ResponsiveTable className="first">
                            <ARMTable className="mel-table">
                                <thead>
                                <tr>
                                    <th rowSpan={2}>
                                        SL <br/> NO.
                                    </th>
                                    <th rowSpan={2}>DATE</th>
                                    <th rowSpan={2}>STN</th>
                                    <th rowSpan={2}>
                                        REF <br/> (ATL &amp; NRC)
                                    </th>
                                    <th rowSpan={2}>ATA</th>
                                    <th rowSpan={2}>DEFECT</th>
                                    <th rowSpan={2}> INTERMEDIATE ACTION</th>
                                    <th rowSpan={2}>
                                        MEL <br/> CAT
                                    </th>
                                    <th rowSpan={2}>
                                        MEL DUE <br/> DATE
                                    </th>
                                    <th rowSpan={2}>
                                        MEL <br/> CLEARED
                                    </th>
                                    <th rowSpan={2}>
                                        REF (W.O, ATL <br/> &amp; NRC)
                                    </th>
                                    <th rowSpan={2}>CORRECTIVE ACTION</th>
                                    <th rowSpan={2}>POSN</th>
                                    <th colSpan={2}>REMOVAL</th>
                                    <th colSpan={2}>INSTALLED</th>
                                    <th rowSpan={2}>GRN</th>
                                    <th rowSpan={2}>STATUS</th>
                                </tr>
                                <tr>
                                    <th>P/N</th>
                                    <th>S/N</th>
                                    <th>P/N</th>
                                    <th>S/N</th>
                                </tr>
                                </thead>
                                <tbody>
                                {melReport?.map((data: any, index: number) => (
                                    <tr key={index}>
                                        <td>{pageSerialNo(currentPage, index + 1)}</td>
                                        <td>{data?.date && moment(`${data?.date}`, "YYYY-MM-DD").format("DD-MMM-YY")}</td>
                                        <td>{data?.station}</td>
                                        <td>
                                            ATL: {data?.refAml}{data?.refAmlAlphabet}
                                        </td>
                                        <td>{data?.ata}</td>
                                        <td>{data?.defectDescription}</td>
                                        <td>{data.intermediateAction && data?.intermediateAction}</td>
                                        <td>{data?.melCategory === 0 ? "A" : data.melCategory === 1 ? "B" : data.melCategory === 2 ? "C" : data.melCategory === 3 ? "D" : ""}</td>
                                        <td>{data?.melDueDate && moment(`${data?.melDueDate}`, "YYYY-MM-DD").format("DD-MMM-YY")}</td>
                                        <td>{data?.melCleared && moment(`${data?.melCleared}`, "YYYY-MM-DD").format("DD-MMM-YY")}</td>
                                        <td>{data?.correctiveRefAml && `ATL: ${data?.correctiveRefAml}${data?.correctiveRefAmlAlphabet || ''}`}</td>
                                        <td>{data?.correctiveAction}</td>
                                        <td>{data?.position}</td>
                                        <td>{data?.removalPN}</td>
                                        <td>{data?.removalSN}</td>
                                        <td>{data?.installedPN}</td>
                                        <td>{data?.installedSN}</td>
                                        <td>{data?.grn}</td>
                                        {data?.melCleared === null ? <td style={{color: "red"}}>OPEN</td> :
                                            <td style={{color: "green"}}>CLOSED</td>}
                                    </tr>
                                ))}
                                </tbody>
                            </ARMTable>
                        </ResponsiveTable>
                        <ResponsiveTable className="second">
                            <ARMReportTable>
                                <table className="report-container" style={{width: "100%"}} ref={melCdlRef}>
                                    <thead className="report-header">
                                    <tr>
                                        <td className="report-header-cell border-none" colSpan={19}>
                                            <div className="header-info">
                                                <Row justify="space-between">
                                                    {
                                                        printState ?
                                                            <Col>
                                                                <CompanyLogo/>
                                                            </Col>
                                                            :
                                                            <Col>

                                                            </Col>
                                                    }
                                                    <Col style={{fontSize: "8px", textAlign: "left", lineHeight: "1"}}>
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
                                    <tr className="mel-report">
                                        <td colSpan={19}>AIRCRAFT MEL AND CDL STATUS</td>
                                    </tr>
                                    <tr className="mel-report">
                                        <td colSpan={19} className="none">empty</td>
                                    </tr>
                                    <tr className="mel-report">
                                        <th rowSpan={2}>
                                            SL <br/> NO.
                                        </th>
                                        <th rowSpan={2}>DATE</th>
                                        <th rowSpan={2}>STN</th>
                                        <th rowSpan={2}>
                                            REF <br/> (ATL &amp; NRC)
                                        </th>
                                        <th rowSpan={2}>ATA</th>
                                        <th rowSpan={2}>DEFECT</th>
                                        <th rowSpan={2}> INTERMEDIATE ACTION</th>
                                        <th rowSpan={2}>
                                            MEL <br/> CAT
                                        </th>
                                        <th rowSpan={2}>
                                            MEL DUE <br/> DATE
                                        </th>
                                        <th rowSpan={2}>
                                            MEL <br/> CLEARED
                                        </th>
                                        <th rowSpan={2}>
                                            REF (W.O, ATL <br/> &amp; NRC)
                                        </th>
                                        <th rowSpan={2}>CORRECTIVE ACTION</th>
                                        <th rowSpan={2}>POSN</th>
                                        <th colSpan={2}>REMOVAL</th>
                                        <th colSpan={2}>INSTALLED</th>
                                        <th rowSpan={2}>GRN</th>
                                        <th rowSpan={2}>STATUS</th>
                                    </tr>
                                    <tr className="mel-report">
                                        <th>P/N</th>
                                        <th>S/N</th>
                                        <th>P/N</th>
                                        <th>S/N</th>
                                    </tr>
                                    </thead>
                                    <tbody className="report">
                                    {printData?.map((data: any, index: number) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data?.date && moment(`${data?.date}`, "YYYY-MM-DD").format("DD-MMM-YY")}</td>
                                            <td>{data?.station}</td>
                                            <td>
                                                ATL: {data?.refAml}{data?.refAmlAlphabet}
                                            </td>
                                            <td>{data?.ata}</td>
                                            <td>{data?.defectDescription}</td>
                                            <td>{data.intermediateAction && data?.intermediateAction}</td>
                                            <td>{data?.melCategory === 0 ? "A" : data.melCategory === 1 ? "B" : data.melCategory === 2 ? "C" : data.melCategory === 3 ? "D" : ""}</td>
                                            <td>{data?.melDueDate && moment(`${data?.melDueDate}`, "YYYY-MM-DD").format("DD-MMM-YY")}</td>
                                            <td>{data?.melCleared && moment(`${data?.melCleared}`, "YYYY-MM-DD").format("DD-MMM-YY")}</td>
                                            <td>{data?.correctiveRefAml && `ATL: ${data?.correctiveRefAml}${data?.correctiveRefAmlAlphabet || ''}`}</td>
                                            <td>{data?.correctiveAction}</td>
                                            <td>{data?.position}</td>
                                            <td>{data?.removalPN}</td>
                                            <td>{data?.removalSN}</td>
                                            <td>{data?.installedPN}</td>
                                            <td>{data?.installedSN}</td>
                                            <td>{data?.grn}</td>
                                            {data?.melCleared === null ? <td style={{color: "red"}}>OPEN</td> :
                                                <td style={{color: "green"}}>CLOSED</td>}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </ARMReportTable>
                        </ResponsiveTable>
                        {melReport?.model?.length > 0 && <Row justify="center" className="first">
                            <Col style={{marginTop: "10px"}}>
                                <Pagination
                                    showSizeChanger={false}
                                    onChange={setCurrentPage}
                                    defaultCurrent={currentPage}
                                    total={totalPages * 10}
                                />
                            </Col>
                        </Row>}
                    </AircrfatMel>
                </ARMCard>
            </Permission>
        </CommonLayout>
    );
}
