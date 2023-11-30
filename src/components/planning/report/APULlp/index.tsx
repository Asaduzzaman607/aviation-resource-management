import styled from "styled-components";
import React, {createRef, useEffect, useState} from "react";
import {Breadcrumb, Col, Form, Pagination, Row, Select, Space, Spin, Typography} from "antd";
import API from "../../../../service/Api";
import {notifyError, notifyResponseError} from "../../../../lib/common/notifications";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Link} from "react-router-dom";
import Permission from "../../../auth/Permission";
import ARMCard from "../../../common/ARMCard";
import PrintButton from "../../../common/PrintButton";
import {REQUIRED} from "../../../../lib/constants/validation-rules";
import ARMButton from "../../../common/buttons/ARMButton";
import {FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import CompanyLogo from "../CompanyLogo";
import {ARMReportTable} from "../ARMReportTable";
import {CycleFormat, DateFormat, formatLifeLimitWithUnit, HourFormat} from "../Common";
import LastShopInfoServices from "../../../../service/LastShopInfoServices";

const TITLE = "APU LLP STATUS";


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


export default function APULlp() {
    const reportRef = createRef<any>();
    const [form] = Form.useForm<any>();
    const aircraftId = Form.useWatch('aircraftId', form)
    const [aircraftsInfo, setAircraftsInfo] = useState<any>({})
    const [shopVisitInfo, setShopVisitInfo] = useState<any>([])
    const [aircrafts, setAircrafts] = useState<any>([])
    const [apuInfo, setApuInfo] = useState<any>([])
    const [data, setData] = useState<any>([])


    const getAllAircraft = async () => {
        try {
            const {data} = await LastShopInfoServices.getApuAvailableAircraft();
            setAircrafts(data);
        } catch (er) {
            notifyResponseError(er);
        }
    };


    useEffect(() => {
        (async () => {
            await getAllAircraft();
        })();
    }, []);

    const handleSubmit = async () => {
        if (!aircraftId) return

        try {
            const {data} = await API.get(`/aircraft-build/apu-status-report?aircraftId=${aircraftId}`)
            setData(data.apuStatusReportModel);
            setAircraftsInfo(data)
            setApuInfo(data.apuInfo)
            setShopVisitInfo(data.apuShopVisitInfo)
        } catch (error) {
            notifyError(error)
        }
    }


    const resetFilter = () => {
        form.resetFields()
        setAircraftsInfo({})
        setData([])
        setShopVisitInfo([])
        setApuInfo([])
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
        <Permission permission="PLANNING_OTHERS_APU_LLP_STATUS_SEARCH" showFallback>
            <ARMCard
                title={
                    <Row justify="space-between">
                        <Col>{TITLE}</Col>
                        <Col><PrintButton printAreaRef={reportRef}/></Col>
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
                                    {aircrafts?.map((item : any) => {
                                        return (
                                            <Select.Option key={item.id} value={item.aircraftId}>
                                                {item?.aircraftName}{" "}
                                            </Select.Option>
                                        );
                                    })}
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

                    <ReportContainer>
                        <Col span={24}>
                            <Row>
                                <Col span={24}>
                                    <Row justify="space-between">
                                        <Col>
                                            <CompanyLogo/>
                                        </Col>
                                        <Col style={{fontSize: "8px", fontWeight: "bold"}}>
                                            <Typography.Text>Form: CAME-047</Typography.Text> <br/>
                                            <Typography.Text>ISSUE: INITIAL</Typography.Text> <br/>
                                            <Typography.Text>DATE: 19-01-2022</Typography.Text>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Typography.Title level={5} className="title">
                                APU STATUS
                            </Typography.Title>
                            <ARMReportTable className="engine-table">
                                <tbody>
                                <tr style={{fontWeight: "bold"}}>
                                    <td colSpan={2}>A/C TYPE</td>
                                    <td colSpan={2}>{aircraftsInfo?.acType || 'N/A'}</td>
                                    <td className="border-none">empty</td>
                                    <td colSpan={2}>TYPE/MODEL</td>
                                    <td colSpan={2}>{shopVisitInfo.model || 'N/A'}</td>
                                    <td className="border-none">empty</td>
                                    <td colSpan={12}>LAST SHOP VISIT INFORMATION</td>
                                </tr>


                                <tr style={{fontWeight: "bold"}}>
                                    <td colSpan={2}>A/C REGN.</td>
                                    <td colSpan={2}>{aircraftsInfo?.acRegn || 'N/A'}</td>
                                    <td className="border-none">empty</td>
                                    <td colSpan={2}>APU P/N</td>
                                    <td colSpan={2}>{apuInfo?.apuPartNo || 'N/A'}</td>
                                    <td className="border-none">empty</td>
                                    <td colSpan={2}>DATE</td>
                                    <td colSpan={2}>TSN</td>
                                    <td colSpan={2}>CSN</td>
                                    <td colSpan={2}>TSR:</td>
                                    <td colSpan={2}>CSR:</td>
                                    <td colSpan={2}>STATUS</td>

                                </tr>

                                <tr style={{fontWeight: "bold"}}>
                                    <td colSpan={2}>A/C MSN</td>
                                    <td colSpan={2}>{aircraftsInfo?.acMsn || 'N/A'}</td>
                                    <td className="border-none">empty</td>
                                    <td colSpan={2}>APU S/N</td>
                                    <td colSpan={2}>{apuInfo?.apuSerialNo || 'N/A'}</td>
                                    <td className="border-none">empty</td>

                                    <td colSpan={2}>{DateFormat(shopVisitInfo.date) || 'N/A'}</td>

                                    <td colSpan={2}>{HourFormat(shopVisitInfo.tsn)}</td>

                                    <td colSpan={2}>{CycleFormat(shopVisitInfo.csn) || 'N/A'}</td>

                                    <td colSpan={2}>{HourFormat(shopVisitInfo.tsr) || 'N/A'}</td>

                                    <td colSpan={2}>{CycleFormat(shopVisitInfo.csr) || 'N/A'}</td>

                                    <td colSpan={2}>{shopVisitInfo.status || 'N/A'}</td>
                                </tr>
                                <tr style={{fontWeight: "bold"}}>
                                    <td colSpan={7} className="border-none">empty</td>
                                </tr>
                                <tr>
                                    <td colSpan={11} className="border-none"></td>
                                </tr>
                                <tr style={{fontWeight: "bold"}}>
                                    <td>DATE</td>
                                    <td>{DateFormat(aircraftsInfo?.date) || 'N/A'}</td>
                                    <td>TAT</td>
                                    <td>{HourFormat(aircraftsInfo?.tat) || 'N/A'}</td>
                                    <td>TAC</td>
                                    <td>{CycleFormat(aircraftsInfo?.tac) || 'N/A'}</td>
                                    <td colSpan={10} className="border-none">empty</td>
                                </tr>
                                <tr style={{fontWeight: "bold"}}>
                                    <td colSpan={2} className="border-none">empty</td>
                                    <td>APU TSN</td>
                                    <td>APU CSN</td>
                                    <td>APU TSR</td>
                                    <td>APU CSR</td>
                                    <td colSpan={10} className="border-none">empty</td>
                                </tr>
                                <tr style={{fontWeight: "bold"}}>
                                    <td colSpan={2} className="border-none">empty</td>
                                    <td>{parseInt(apuInfo?.apuTsn) || 'N/A'}</td>
                                    <td>{CycleFormat(apuInfo?.apuCsn) || 'N/A'}</td>
                                    <td>{HourFormat(apuInfo?.apuTSR) || 'N/A'}</td>
                                    <td>{CycleFormat(apuInfo?.apuCSR) || 'N/A'}</td>
                                    <td colSpan={11} className="border-none">empty</td>
                                    <td>AVG FH:</td>
                                    <td>{HourFormat(aircraftsInfo?.averageHours) || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td colSpan={17} className="border-none"></td>
                                    <td>AVG FC:</td>
                                    <td>{CycleFormat(aircraftsInfo?.averageCycle) || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td colSpan={16} className="border-none"></td>
                                </tr>
                                <tr style={{paddingTop: '1em'}}>
                                    <th rowSpan={2} colSpan={3}>NOMENCLATURE</th>
                                    <th rowSpan={2}>PART NO.</th>
                                    <th rowSpan={2}>SERIAL NO</th>
                                    <th colSpan={3}>AT INSTALLATION</th>
                                    <th colSpan={2}>CURRENT</th>
                                    <th rowSpan={2}>LIFE LIMIT</th>
                                    <th colSpan={3}> DUE AT</th>
                                    <th colSpan={3}>REMAINING</th>
                                    <th rowSpan={2}>DUE FOR</th>
                                    <th rowSpan={2}>ESTIMATED <br/> DUE DATE</th>
                                </tr>
                                <tr>
                                    <th>DATE</th>
                                    <th>TSN</th>
                                    <th>CSN</th>
                                    <th>TSN</th>
                                    <th>CSN</th>
                                    <th>AH</th>
                                    <th>AC</th>
                                    <th>DY</th>
                                    <th>AH</th>
                                    <th>AC</th>
                                    <th>DY</th>


                                </tr>
                                {data.length > 0 &&
                                    data.map((p: any, index: any) => (<tr key={index}>
                                        <td colSpan={3}>{p.noMenClature}</td>
                                        <td>{p.partNo}</td>
                                        <td>{p.serialNo}</td>
                                        <td>{DateFormat(p.installationDate) || 'N/A'}</td>
                                        <td>{HourFormat(p.installationTsn) || 'N/A'}</td>
                                        <td>{CycleFormat(p.installationCsn) || 'N/A'}</td>
                                        <td>{HourFormat(p.currentTsn) || 'N/A'}</td>
                                        <td>{CycleFormat(p.currentCsn) || 'N/A'}</td>
                                        <td>{formatLifeLimitWithUnit(p.lifeLimit, p.lifeLimitUnit) || 'N/A'} </td>
                                        <td>
                                            {HourFormat(p.dueHour) || 'N/A'}       </td>
                                        <td>
                                            {CycleFormat(p.dueCycle) || 'N/A'}        </td>
                                        <td>
                                            {DateFormat(p.dueDate) || 'N/A'}
                                        </td>
                                        <td>
                                            {HourFormat(p.remainingHour) || 'N/A'} </td>
                                        <td>
                                            {CycleFormat(p.remainingCycle) || 'N/A'} </td>
                                        <td>
                                            {p.remainingDay ? p.remainingDay + " DY" : p.remainingDay === 0 ? 0 : "N/A"}
                                        </td>
                                        <td>{p.dueFor}</td>
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
