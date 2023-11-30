import {
    DownloadOutlined,
    FilterOutlined,
    PrinterOutlined,
    RollbackOutlined,
} from "@ant-design/icons";
import {
    Breadcrumb, Button,
    Col,
    Form, Input,
    Pagination,
    Row,
    Select,
    Space,
    Typography,
} from "antd";
import React, {createRef, useCallback, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import ReactToPrint from "react-to-print";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import SuccessButton from "../../../common/buttons/SuccessButton";
import CommonLayout from "../../../layout/CommonLayout";
import styled from "styled-components";
import logo from "../../../../components/images/us-bangla-logo.png";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import {useAircraftsList} from "../../../../lib/hooks/planning/aircrafts";
import {useBoolean} from "react-use";
import ARMButton from "../../../common/buttons/ARMButton";
import {notifyResponseError} from "../../../../lib/common/notifications";
import API from "../../../../service/Api";
import TaskDoneServices from "../../../../service/TaskDoneServices";
import {formatSingleTimeValue} from "../../../../lib/common/presentation";
import {sleep} from "../../../../lib/common/helpers";
import {ARMReportTable} from "../ARMReportTable";
import CompanyLogo from "../CompanyLogo";
import {dateFormat} from "../AircraftComponentHistoryCard";
import Permission from "../../../auth/Permission";
import {useDownloadExcel} from "react-export-table-to-excel";
import {DateFormat, getFolderPathByMatchedString, HourFormat} from "../Common";
import {refreshTaskData} from "../../../../lib/common/refreshTaskData";


const TITLE = "SERVICE BULLETIN LIST";
const printStyle = `
*{
    font-size: 12px !important;
    overflow: visible !important;
    margin: 0!important;
    padding:0!important;
  }

  .bulletin-row td,
  .bulletin-row th {
    border-width: 0.4px !important;
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
   visibility: visible!important;
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

  .border-none{
    border: none!important;
}

  @page {
    size: landscape;
  }
`;

interface Record {
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
    doneDate: string;
    doneHour: number;
    doneCycle: number;
    remainingDay: number;
    remainingHour: number;
    remainingCycle: number;
    estimatedDueDate: string;
    location: string;
    taskType: string;
}

interface Report {
    model: Record[];
    totalPages: number;
    currentPage: number;
    totalElements: number;
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

const ServiceBulletin = styled.div`
  .service-bulletin-table {
    font-weight: normal;
  }

  .bulletin-row td {
    font-size: 9px;
    padding: 0 !important;
  }

  .service-table th {
    background-color: #d9d9d9 !important;
  }

  .border-none {
    border: none;
  }

  .service-table thead tr th {
    height: 10px !important;
    padding: 0 !important;
  }

  .service-table th,
  .service-table thead tr td,
  .service-table tbody tr td,
  .page-of-report {
    visibility: hidden;
  }

  .none {
    border: none;
    visibility: hidden;
  }

  .second {
    display: none;
  }
`;

export default function ServiceBulletinList() {
    const reportRef = createRef<any>();
    const [form] = Form.useForm<any>();
    const {allAircrafts, getAllAircrafts} = useAircraftsList();
    const [submitting, toggleSubmitting] = useBoolean(false);
    const [printState, setPrintState] = useState(false)
    const taskNo = Form.useWatch('taskNo', form);

    const [data, setData] = useState<Report>({
        model: [],
        totalPages: 0,
        currentPage: 0,
        totalElements: 0,
    });
    const [printData, setPrintData] = useState<any>([]);
    const [aircraftApuDetails, setAircraftApuDetails] =
        useState<AircraftDetails>();
    const aircraftId = Form.useWatch("aircraftId", form);

    useEffect(() => {
        (async () => {
            await getAllAircrafts();
        })();
    }, []);

    const currentPage = data?.currentPage;
    const totalPages = data?.totalPages || 0;

    const handleSbListSearch = useCallback(
        async (values: any) => {
            const searchValues = {
                aircraftId: values ? values.aircraftId : "",
                taskNo: values.taskNo || null,
                isPageable: true
            };

            try {
                const res = await API.post(
                    `task-report/sb-report?page=${data?.currentPage}&size=${values.size}`,
                    searchValues
                );
                setData(res.data);
            } catch (error) {
                notifyResponseError(error);
            } finally {
                toggleSubmitting(false);
            }
        },
        [currentPage, toggleSubmitting]
    );

    const fetchPrintData = async () => {
        const dataWithoutPagination = {
            aircraftId: aircraftId,
            taskNo: taskNo || null,
            isPageable: false,
        };
        try {
            toggleSubmitting();
            const {data} = await API.post(
                `task-report/sb-report`,
                dataWithoutPagination
            );
            setPrintData(data);
            setPrintState(true);
            return sleep(1000);
        } catch (er) {
        } finally {
            toggleSubmitting();
        }
    };

    useEffect(() => {
        if (!aircraftId) {
            return;
        }
        (async () => {
            await handleSbListSearch(form.getFieldsValue(true));
        })();
    }, [handleSbListSearch, form]);

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

    const handlePageChange = (page: number, pageSize: number) => {
        setData((prevState) => ({
            ...prevState,
            currentPage: page,
        }));
    };

    useEffect(() => {
        if (!aircraftId) return;

        (async () => {
            await getAircraftApuDetailsById(aircraftId);
        })();
    }, [aircraftId]);

    const resetFilter = () => {
        form.resetFields();
        setData({
            model: [],
            totalPages: 0,
            currentPage: 0,
            totalElements: 0,
        });
        // @ts-ignore
        setAircraftApuDetails({});
    };

    const tableRef = useRef(null);
    const {onDownload} = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'Service bulletin report',
        sheet: 'serviceBulletinReport'
    })

    const handleExcelDownload = async () => {
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
            <Permission permission="PLANNING_SCHEDULE_TASKS_SERVICE_BULLETIN_LIST_SEARCH" showFallback>
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
                    <Form form={form} name="filter-form" initialValues={{size: 10}} onFinish={handleSbListSearch}>
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
                                    name="taskNo"
                                >

                                    <Input placeholder="Enter SB No"/>
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
                                        <ARMButton
                                            loading={submitting}
                                            size="middle"
                                            type="primary"
                                            htmlType="submit"
                                        >
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

                    <ServiceBulletin ref={reportRef}>
                        <Row>
                            <Col span={24} className="first">
                                <Row justify="space-between">
                                    <Col>
                                        <img src={logo} alt="" width={110}/>
                                    </Col>
                                    <Col style={{fontSize: "8px", fontWeight: "bold"}}>
                                        <Typography.Text>Form: CAME-032</Typography.Text> <br/>
                                        <Typography.Text>ISSUE: INITIAL</Typography.Text> <br/>
                                        <Typography.Text>DATE: 19-01-2022</Typography.Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <ResponsiveTable className="first">
                            <ARMReportTable className="service-bulletin-table">
                                <tbody>
                                <tr className="bulletin-row">
                                    <td rowSpan={3} colSpan={2} className="none">
                                        empty
                                    </td>
                                    <td rowSpan={3} colSpan={2} style={{fontWeight: 'bold'}}>
                                        SERVICE BULLETIN LIST
                                    </td>
                                    <td colSpan={2} style={{fontWeight: 'bold'}}>AIRCRAFT MODEL NO</td>
                                    <td>{aircraftApuDetails?.aircraftModelName}</td>
                                    <td style={{fontWeight: 'bold'}}>AS OF DATE:</td>
                                    <td>
                                        {dateFormat(aircraftApuDetails?.updatedTime)}
                                    </td>
                                </tr>
                                <tr className="bulletin-row">
                                    <td colSpan={2} style={{fontWeight: 'bold'}}>AIRCRAFT REG. NO:</td>
                                    <td>{aircraftApuDetails?.aircraftName}</td>
                                    <td style={{fontWeight: 'bold'}}>AIRCRAFT TSN:</td>
                                    <td>{formatSingleTimeValue(aircraftApuDetails?.acHour)}</td>
                                </tr>
                                <tr className="bulletin-row">
                                    <td colSpan={2} style={{fontWeight: 'bold'}}>AIRCRAFT MSN:</td>
                                    <td>{aircraftApuDetails?.airframeSerial}</td>
                                    <td style={{fontWeight: 'bold'}}>AIRCRAFT CSN:</td>
                                    <td>{aircraftApuDetails?.acCycle}</td>
                                </tr>
                                <tr>
                                    <td colSpan={9} className="none">
                                        ok
                                    </td>
                                </tr>
                                </tbody>
                                <tbody>
                                <tr>
                                    <th rowSpan={2}>ATA</th>
                                    <th rowSpan={2}>SB NO.</th>
                                    <th rowSpan={2}>SB DESCRIPTION</th>
                                    <th rowSpan={2}>RELATED AD</th>
                                    <th colSpan={3}>LAST INCORPORATION</th>
                                    <th rowSpan={2}>STATUS</th>
                                    <th rowSpan={2}>REMARKS</th>
                                </tr>
                                <tr>
                                    <th>DATE</th>
                                    <th>FH</th>
                                    <th>FC</th>
                                </tr>
                                </tbody>
                                <tbody>
                                {data.model?.map((data: any, index: number) => (
                                    <tr key={index}>
                                        <td>{data?.ata}</td>
                                        <td onClick={() => {
                                            getFolderPathByMatchedString(data?.sbNo)
                                        }}   style={{cursor: 'pointer', textDecoration: "underline"}}>
                                            {data?.sbNo}
                                        </td>
                                        <td className='newLineInRow'>{data?.taskDescription}</td>
                                        <td className='newLineInRow'>{data?.relatedAd}</td>
                                        <td>{DateFormat(data?.doneDate)}</td>
                                        <td>{HourFormat(data?.doneHour)}</td>
                                        <td>{data?.doneCycle}</td>
                                        <td>
                                            {data?.status}
                                        </td>
                                        <td>{data?.remark}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </ARMReportTable>
                        </ResponsiveTable>

                        <ResponsiveTable className="second">
                            <ARMReportTable>
                                <table className="report-container" style={{width: "100%"}} ref={tableRef}>
                                    <thead className="report-header">
                                    <tr>
                                        <td className="report-header-cell border-none" colSpan={10}>
                                            <div className="header-info">
                                                <Col span={24}>
                                                    <Row justify="space-between">
                                                        {printState ?
                                                            <Col>
                                                                <CompanyLogo/>
                                                            </Col>
                                                            : <Col>

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
                                                            <Typography.Text>
                                                                DATE 19 JAN 2022
                                                            </Typography.Text>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        {printState ? <td colSpan={10} className="none">empty</td> :
                                            <td colSpan={10} className="none"></td>}
                                    </tr>
                                    <tr className="bulletin-row">
                                        {printState ?
                                            <td rowSpan={3} colSpan={2} className="none">
                                                empty
                                            </td> : <td rowSpan={3} colSpan={2} className="none">

                                            </td>}
                                        <td rowSpan={3} colSpan={2}>
                                            SERVICE BULLETIN LIST
                                        </td>
                                        <td colSpan={2}>AIRCRAFT MODEL NO</td>
                                        <td>{aircraftApuDetails?.aircraftModelName}</td>
                                        <td>AS OF DATE:</td>
                                        <td>
                                            {dateFormat(aircraftApuDetails?.updatedTime)}
                                        </td>
                                    </tr>
                                    <tr className="bulletin-row">
                                        <td colSpan={2}>AIRCRAFT REG. NO:</td>
                                        <td>{aircraftApuDetails?.aircraftName}</td>
                                        <td>AIRCRAFT TSN:</td>
                                        <td>{formatSingleTimeValue(aircraftApuDetails?.acHour)}</td>
                                    </tr>
                                    <tr className="bulletin-row">
                                        <td colSpan={2}>AIRCRAFT MSN:</td>
                                        <td>{aircraftApuDetails?.airframeSerial}</td>
                                        <td>AIRCRAFT CSN:</td>
                                        <td>{aircraftApuDetails?.acCycle}</td>
                                    </tr>
                                    <tr>
                                        <tr>
                                            {printState ? <td colSpan={9} className="none">
                                                ok
                                            </td> : <td colSpan={9} className="none">

                                            </td>}
                                        </tr>
                                    </tr>

                                    <tr className="bulletin-row">
                                        <th rowSpan={2}>ATA</th>
                                        <th rowSpan={2}>SB NO.</th>
                                        <th rowSpan={2}>SB DESCRIPTION</th>
                                        <th rowSpan={2}>RELATED AD</th>
                                        <th colSpan={3}>LAST INCORPORATION</th>
                                        <th rowSpan={2}>STATUS</th>
                                        <th rowSpan={2}>REMARKS</th>
                                    </tr>
                                    <tr className="bulletin-row">
                                        <th>DATE</th>
                                        <th>FH</th>
                                        <th>FC</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {printData?.model?.map((data: any, index: number) => (
                                        <tr key={index} className="bulletin-row">
                                            <td>{data?.ata}</td>
                                            <td>{data?.sbNo}</td>
                                            <td className='newLineInRow'>{data?.taskDescription}</td>
                                            <td className='newLineInRow'>{data?.relatedAd}</td>
                                            <td>{DateFormat(data?.doneDate)}</td>
                                            <td>{HourFormat(data?.doneHour)}</td>
                                            <td>{data?.doneCycle}</td>
                                            <td>
                                                {data?.status}
                                            </td>
                                            <td>{data?.remark}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </ARMReportTable>
                        </ResponsiveTable>

                        <Row justify="center" className="first">
                            <Typography.Text className="page-of-report">
                                Page {currentPage}{" "}
                            </Typography.Text>
                        </Row>

                        {data!.model!.length > 0 && (
                            <Row justify="center" className="pagination">
                                <Col style={{marginTop: 10}}>
                                    <Pagination
                                        current={currentPage}
                                        onChange={handlePageChange}
                                        pageSize={10}
                                        total={totalPages * 10}
                                    />
                                </Col>
                            </Row>
                        )}
                    </ServiceBulletin>
                </ARMCard>
            </Permission>
        </CommonLayout>
    );
}
