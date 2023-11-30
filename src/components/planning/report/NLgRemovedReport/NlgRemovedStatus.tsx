import React, {createRef, useEffect, useRef, useState} from "react";
import {Breadcrumb, Button, Col, Form, Row, Select, Space, Typography} from "antd";
import API from "../../../../service/Api";
import {notifyError, notifyWarning} from "../../../../lib/common/notifications";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Link} from "react-router-dom";
import Permission from "../../../auth/Permission";
import ARMCard from "../../../common/ARMCard";
import {DownloadOutlined, FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import PrintButton from "../../../common/PrintButton";
import {REQUIRED} from "../../../../lib/constants/validation-rules";
import ARMButton from "../../../common/buttons/ARMButton";
import CompanyLogo from "../CompanyLogo";
import {ARMReportTable} from "../ARMReportTable";
import {CycleFormat, DateFormat, formatLifeLimitWithUnit, HourFormat} from "../Common";
import styled from "styled-components";
import { useAircraftsList } from "../../../../lib/hooks/planning/aircrafts";
import {useBoolean} from "react-use";
import { useDownloadExcel } from "react-export-table-to-excel";
import {sleep} from "../../../../lib/common/helpers";

const TITLE = " Removed Nose Landing Gear Status";

const ReportContainer = styled.div`

  .title {
    text-align: center;
  }

  .border-none {
    visibility: hidden;
    border: none;
  }

  th, td {
    font-size: 10px !important;
    font-weight: bold;
  }

  @media print {
    padding: 30px !important;
  }

  .text {
    margin-top: -20px !important;
  }

  width: 100% !important;

  @page {
    size: landscape
  }
`;

export default function NlgRemovedStatus() {
    const reportRef = createRef<any>();
    const [form] = Form.useForm<any>();
    const {allAircrafts, getAllAircrafts} = useAircraftsList();
    const aircraftId = Form.useWatch('aircraftId', form)
    const [aircraftsInfo, setAircraftsInfo] = useState<any>({})
    const [data, setData] = useState<any>([])
    const [printState, setPrintState] = useBoolean(false)


    useEffect(() => {
        (async () => {
            await getAllAircrafts();

        })();
    }, [])


    const handleSubmit = async () => {
        try {

            const {data} = await API.get(`landing-gear-report/removed-nlg-report?aircraftId=${aircraftId}`)
            setData(data.removedLandingGearViewModelList);
            setAircraftsInfo(data);
            setPrintState(true);
        } catch (error) {
            notifyError(error)
        }
    }


    const resetFilter = () => {
        form.resetFields()
        setAircraftsInfo([])
        setData([])
    }

    const nlgLandingGearRef = useRef(null);
    const {onDownload} = useDownloadExcel({
        currentTableRef: nlgLandingGearRef.current,
        filename: 'Removed NLG Landing Gear Report',
        sheet: 'removedNlgLandingGearReport'
    })

    const downloadNlgLandingGearRefExcel = async () => {
        if (!aircraftId) return

        if (data?.length < 1) {
            notifyWarning('Report data is empty! Please generate the data first.')
            return
        }

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
        <Permission permission="PLANNING_ENGINE_PROPELLER_LANDING_GEAR_REMOVED_NOSE_LANDING_GEAR_STATUS_SEARCH" showFallback>
            <ARMCard
                title={
                    <Row justify="space-between">
                        <Col>{TITLE}</Col>
                        <Col>
                            <Space>
                                <Button icon={<DownloadOutlined/>}
                                        onClick={downloadNlgLandingGearRefExcel}> Export
                                    excel </Button>
                                <PrintButton printAreaRef={reportRef}/>
                            </Space>
                        </Col>
                    </Row>
                }
            >

                <Form
                    form={form}
                    name="filter-form"
                    initialValues={{aircraftId: null, date: ''}}
                    onFinish={handleSubmit}
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
                                        allAircrafts.map(({aircraftId, aircraftName}) => <Select.Option value={aircraftId}
                                                                                                        key={aircraftId}>{aircraftName}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>


                        <Col xs={24} md={6}>
                            <Form.Item>
                                <Space>
                                    <ARMButton size="middle" type="primary" htmlType="submit">
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
                <Row ref={reportRef}>

                    <ReportContainer ref={nlgLandingGearRef}>
                        <Col span={24}>
                            <Row>
                                <Col span={24}>
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
                                        <Col style={{fontSize: "8px", fontWeight: "bold"}}>
                                            <Typography.Text>Form: CAME-047</Typography.Text> <br/>
                                            <Typography.Text>ISSUE: INITIAL</Typography.Text> <br/>
                                            <Typography.Text>DATE: 19-01-2022</Typography.Text>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Typography.Title level={5} className="title">
                                REMOVED NOSE LANDING GEAR STATUS
                            </Typography.Title>
                            <ARMReportTable className="engine-table">
                                <tbody>
                                <tr>
                                    <td colSpan={11} className="border-none"></td>
                                </tr>
                                <tr style={{fontWeight: "bold"}}>
                                    <td>AS ON</td>
                                    <td>{aircraftsInfo?.asOnDate && DateFormat(aircraftsInfo?.asOnDate)}</td>
                                    <td>DOM</td>
                                    <td>{aircraftsInfo.domDate && DateFormat(aircraftsInfo.domDate)}</td>
                                    {
                                        printState ?
                                            <td colSpan={10} className="border-none">empty</td>
                                            :
                                            <td colSpan={10} className="border-none"></td>
                                    }
                                </tr>
                                <tr style={{fontWeight: "bold"}}>
                                    <td>TAT</td>
                                    <td>TAC</td>
                                    <td>TSN</td>
                                    <td>CSN</td>
                                    <td>TSO</td>
                                    <td>CSO</td>
                                    {
                                        printState ?
                                            <td colSpan={8} className="border-none">empty</td>
                                            :
                                            <td colSpan={8} className="border-none"></td>
                                    }
                                </tr>
                                <tr style={{fontWeight: "bold"}}>
                                    <td>{HourFormat(aircraftsInfo?.tat) || 'N/A'}</td>
                                    <td>{CycleFormat(aircraftsInfo?.tac) || 'N/A'}</td>
                                    <td>{HourFormat(aircraftsInfo?.tsn) || 'N/A'}</td>
                                    <td>{CycleFormat(aircraftsInfo?.csn) || 'N/A'}</td>
                                    <td>{HourFormat(aircraftsInfo?.tso) || 'N/A'}</td>
                                    <td>{CycleFormat(aircraftsInfo?.cso) || 'N/A'}</td>
                                    {
                                        printState ?
                                            <td colSpan={17} className="border-none">empty</td>
                                            :
                                            <td colSpan={17} className="border-none"></td>
                                    }
                                    <td>AVERAGE UTILIZATION HRS/DAY:</td>
                                    <td>{HourFormat(aircraftsInfo?.averageUtilizationHrsOrDay) || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td colSpan={23} className="border-none"></td>
                                    <td>AVERAGE CYCS/DAY:</td>
                                    <td>{CycleFormat(aircraftsInfo?.averageCycIrDay) || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td colSpan={16} className="border-none"></td>
                                </tr>
                                <tr style={{paddingTop: '1em'}}>
                                    <th rowSpan={2} colSpan={3}>NOMENCLATURE</th>
                                    <th rowSpan={2}>PART NO.</th>
                                    <th rowSpan={2}>SERIAL NO</th>
                                    <th colSpan={5}>INSTALLATION</th>
                                    <th colSpan={4}>CURRENT</th>
                                    <th colSpan={2}>OH DUE</th>
                                    <th colSpan={2}>OH INTERVAL</th>
                                    <th colSpan={2}>OH THRESHOLD</th>
                                    <th colSpan={2}>REMAINING (OH)</th>
                                    <th rowSpan={2}>LIFE LIMIT</th>
                                    <th rowSpan={2}>REMAINING DISCARD</th>
                                    <th rowSpan={2}>ESTIMATED DUE DATE</th>
                                </tr>
                                <tr>
                                    <th>DATE</th>
                                    <th>TSN</th>
                                    <th>CSN</th>
                                    <th>TSO</th>
                                    <th>CSO</th>
                                    <th>TSN</th>
                                    <th>CSN</th>
                                    <th>TSO</th>
                                    <th>CSO</th>
                                    <th>CYCLE</th>
                                    <th>DATE</th>
                                    <th>CYCLE</th>
                                    <th>DAY</th>
                                    <th>CYCLE</th>
                                    <th>DAY</th>
                                    <th>CYCLE</th>
                                    <th>DAY</th>
                                </tr>
                                {data?.length > 0 &&
                                    data?.map((p: any, index: any) => (<tr key={index}>
                                        <td colSpan={3}>{p.noMenClature}</td>
                                        <td>{p.partNo}</td>
                                        <td>{p.serialNo}</td>
                                        <td>{DateFormat(p.installationDate) || 'N/A'}</td>
                                        <td>{HourFormat(p.installationTsn) || 'N/A'}</td>
                                        <td>{CycleFormat(p.installationCsn) || 'N/A'}</td>
                                        <td>{HourFormat(p.installationTso) || 'N/A'}</td>
                                        <td>{CycleFormat(p.installationCso) || 'N/A'}</td>
                                        <td>{HourFormat(p.currentTsn) || 'N/A'}</td>
                                        <td>{CycleFormat(p.currentCsn) || 'N/A'}</td>
                                        <td>{HourFormat(p.currentTso) || 'N/A'}</td>
                                        <td>{CycleFormat(p.currentCso) || 'N/A'}</td>
                                        <td>{CycleFormat(p.ohDueCycle) || 'N/A'}</td>
                                        <td>{DateFormat(p.ohDueDate) || 'N/A'}</td>
                                        {
                                            p.intervalType===1?
                                            <>
                                                <td>{CycleFormat(p.intervalCycle)}</td>
                                                <td>{p.intervalDay || 'N/A'}</td>
                                            </>
                                            :
                                            <>
                                                <td>N/A</td>
                                                <td>N/A</td> 
                                            </>
                                        }
                                        {
                                            p.intervalType===0?
                                            <>
                                                <td>{CycleFormat(p.thresholdCycle)}</td>
                                                <td>{p.thresholdDay || 'N/A'}</td>
                                            </>
                                            :
                                            <>
                                                <td>N/A</td>
                                                <td>N/A</td> 
                                            </>
                                        }
                                        <td>{CycleFormat(p.remainingOhCycle)}</td>
                                        <td>{p.remainingOhDay || 'N/A'}</td>
                                        <td>{formatLifeLimitWithUnit(p.lifeLimit, p.lifeLimitUnit) || 'N/A'} </td>
                                        <td>{formatLifeLimitWithUnit(p.remainingDiscard, p.lifeLimitUnit) || 'N/A'} </td>
                                        <td>{DateFormat(p.estimatedDueDate) || 'N/A'}</td>
                                    </tr>))}
                                </tbody>
                            </ARMReportTable>
                        </Col>
                    </ReportContainer>
                </Row>
            </ARMCard>
        </Permission>
    </CommonLayout>;
}