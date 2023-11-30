// noinspection JSVoidFunctionReturnValueUsed

import { FilterOutlined, PrinterOutlined, RollbackOutlined } from "@ant-design/icons";
import { Breadcrumb, Col, DatePicker, Form, Row, Select, Space, Spin, Typography } from "antd";
import {createRef, useEffect, useMemo, useState} from "react";
import { Link } from "react-router-dom";
import ReactToPrint from "react-to-print";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import SuccessButton from "../../../common/buttons/SuccessButton";
import CommonLayout from "../../../layout/CommonLayout";
import styled from "styled-components";
import logo from "../../../../components/images/us-bangla-logo.png";
import { ARMReportTable } from "../ARMReportTable";
import ARMButton from "../../../common/buttons/ARMButton";
import { useForm } from "antd/lib/form/Form";
import { useAircraftsList } from "../../../../lib/hooks/planning/aircrafts";
import API from "../../../../service/Api";
import moment from "moment";
import { formatSingleTimeValue, formatTimeValue } from "../../../../lib/common/presentation";
import { upperCase } from "lodash";
import { CycleFormat, DateFormat, HourFormat } from "../Common";
import Permission from "../../../auth/Permission";
import DateTimeConverter from "../../../../converters/DateTimeConverter";
import { notifyResponseError, notifyWarning } from "../../../../lib/common/notifications";

const TITLE = "Engine LLP's Status";

const data = [
  {
    nomenclature: "IMPELLER CENTRIFUGAL, LP",
    partNo: "3072764-01 ",
    serialNo: "EAAE000R509",
    iTsn: "0:00",
    iCsn: "0",
    cTsn: "2094:44",
    cCsn: "3237",
    lifeLimit: "15000",
    remainingFc: "11763",
    eDueDate: "8/Oct/25",
  },
  {
    nomenclature: "IMPELLER CENTRIFUGAL, LP",
    partNo: "3072764-01 ",
    serialNo: "EAAE000R509",
    iTsn: "0:00",
    iCsn: "0",
    cTsn: "2094:44",
    cCsn: "3237",
    lifeLimit: "15000",
    remainingFc: "11763",
    eDueDate: "8/Oct/25",
  },
  {
    nomenclature: "IMPELLER CENTRIFUGAL, LP",
    partNo: "3072764-01 ",
    serialNo: "EAAE000R509",
    iTsn: "0:00",
    iCsn: "0",
    cTsn: "2094:44",
    cCsn: "3237",
    lifeLimit: "15000",
    remainingFc: "11763",
    eDueDate: "8/Oct/25",
  },
];

const printStyle = `
    .engine-table thead tr th,
    .engine-data-table thead tr th{
    font-size: 8px !important;
  }
  .engine-table tbody tr td,
  .engine-data-table tbody tr td{
    font-size: 8px !important;
  }
  .engine-table th,
  .engine-table thead tr td,
  .engine-table tbody tr td,
  .engine-data-table th,
  .engine-data-table thead tr td,
  .engine-data-table tbody tr td
  {
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
  }
  @page{ size: landscape!important; }
`;

const EngineLLPs = styled.div`
 
  .border-none{
    border: none;
    visibility: hidden;
  }
  .engine-table th,
   .engine-data-table th{
    background-color: #fff !important;
   }
   .engine-data-table{
    width: 80%
   }
   .title{
    text-align: center;
    font-weight: bold;
    font-size: 10px;
   }

   @page{ size: landscape; }
  `



export default function EngineLLPsStatus() {
  const reportRef = createRef<any>();
  const [form] = Form.useForm()
  const { aircrafts, initAircrafts } = useAircraftsList()
  const aircraftId = Form.useWatch("aircraftId", form)
  const [acBuilds, setAcBuilds] = useState<any>([])
  const aircraftBuildId = Form.useWatch("aircraftBuildId", form)
  const [data, setData] = useState<any>({})
  const [currentTimes, setCurrentTimes] = useState<any>({})
  const [engnInstInfo, setEngnInstInfo] = useState<any>({})
  const [lastShopVisit, setLastShopVisit] = useState<any>({})
  const [date, setDate] = useState("");


  const serialNoByAircraftBuildId = acBuilds?.find((aircraftBuild: any)=> {
    return aircraftBuild.aircraftBuildId===aircraftBuildId
  });

  const aircraft = useMemo(() => {
    const ac = aircrafts.find((ac: any) => ac.id === aircraftId)
    if (ac) return ac;
    return {};
  }, [aircraftId, aircrafts]) as { engineType?: string}

  // const aircraftBuildId = Form.useWatch('aircraftBuildId', form);
  // aircraftBuildId, serialNo

  const acBuild = useMemo(() => {
    const ac = acBuilds.find((acb: any) => acb.aircraftBuildId == aircraftBuildId)
    return ac ? ac : {};

  }, [aircraftBuildId, acBuilds]) as { serialNo: string }

  console.log({ aircraftBuildId })

  useEffect(() => {
    initAircrafts()
  }, [])

  useEffect(() => {
    if (!aircraftId) {
      return
    }
    getACBuild()
  }, [aircraftId])

  const getACBuild = async () => {
    const { data } = await API.get(`aircraft-build/find-engine-by-aircraft/${aircraftId}`)
    setAcBuilds(data)
  }

  const getEngineLLP = async () => {
    if(!aircraftBuildId)
    {
      notifyWarning("Please select Engine Position");
      return;
    }
    try{
      const { data } = await API.post(`engine/engine-llp-status-report`, { aircraftBuildId,date })
      setData(data)
      setCurrentTimes(data?.currentTimesViewModel)
      setEngnInstInfo(data?.engineInstallationInfoViewModel)
      setLastShopVisit(data.lastShopVisitedInfoViewModel?.engineTmmViewModel);
    }catch(er){
      setData(null);
      setCurrentTimes(null);
      setEngnInstInfo(null);
      setLastShopVisit(null);
      notifyResponseError(er);
    }
  }

  const resetFilter = () => {
    form.resetFields()
    setData([])
    setCurrentTimes([])
    setEngnInstInfo([])
  }
  const S1 = data?.currentTimesViewModel?.currentEngineTimeViewModel?.nameExtension;
  const TS = "TS" + S1?.toUpperCase();
  const CS = "CS" + S1?.toUpperCase();


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" /> &nbsp;Planning
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{TITLE}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission permission="PLANNING_ENGINE_PROPELLER_LANDING_GEAR_ENGINE_LLP_STATUS_SEARCH" showFallback>
      <ARMCard
        title={
          <Row justify="space-between">
            <Col>{TITLE}</Col>
            <Col>
              <ReactToPrint
                content={() => reportRef.current}
                copyStyles={true}
                pageStyle={printStyle}
                trigger={() => (
                  <SuccessButton type="primary" icon={<PrinterOutlined />} htmlType="button">
                    Print
                  </SuccessButton>
                )}
              />
            </Col>
          </Row>
        }
      >

        <Form
          form={form}
          name="filter-form"
        >
          <Row gutter={20}>
            <Col xs={24} md={6}>
              <Form.Item
                name="aircraftId"
              >

                <Select
                  placeholder="Select Aircrafts"
                  onChange={()=>form.setFieldValue('aircraftBuildId', '')}
                >
                  {
                    aircrafts.map((aircraft: { id: any, name: any; }) => <Select.Option value={aircraft?.id} key={aircraft?.id}>{aircraft?.name}</Select.Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
               <DatePicker format="YYYY-MM-DD" style={{width: "100%"}} onChange={(e)=> setDate(DateTimeConverter.momentDateToString(e))}/>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                name="aircraftBuildId"
              >

                <Select
                  placeholder="Select Engine Position"
                >
                  {
                    acBuilds.map((acBuild: { aircraftBuildId: any, position: any; }) => <Select.Option value={acBuild?.aircraftBuildId} key={acBuild?.aircraftBuildId}>{acBuild?.position}</Select.Option>)
                  }
                </Select>
              </Form.Item>
            </Col>


            <Col xs={24} md={6}>
              <Form.Item>
                <Space>
                  <ARMButton size="middle" type="primary" htmlType="submit" onClick={getEngineLLP}>
                    <FilterOutlined name="filter" /> Filter
                  </ARMButton>
                  <ARMButton
                    size="middle"
                    type="primary"
                    onClick={resetFilter}
                  >
                    <RollbackOutlined name="reset" /> Reset
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <EngineLLPs ref={reportRef}>
          <Row>
            <Col span={24}>
              <Row justify="space-between">
                <Col>
                  <img src={logo} alt="" width={110} />
                </Col>
                <Col style={{ fontSize: "8px", fontWeight: "bold" }}>
                  <Typography.Text>Form: CAME-014</Typography.Text> <br />
                  <Typography.Text>ISSUE: INITIAL</Typography.Text> <br />
                  <Typography.Text>DATE: 19-01-2022</Typography.Text>
                </Col>
              </Row>
            </Col>
          </Row>
          <Typography.Title level={5} className="title" style={{ borderBottom: "1px solid", paddingBottom: "4px" }}>
            ENGINE LLP's STATUS
          </Typography.Title>
          <Typography.Title level={5} className="title" style={{ marginTop: "-9px", paddingTop: "4px" }}>
            {aircraft?.engineType} ENGINE S/N {acBuild?.serialNo}
          </Typography.Title>
          <br />
          <br />
          <ARMReportTable className="engine-table" style={{ cursor: "default" }}>
            <tbody>
              <tr style={{ fontWeight: "bold" }}>
                <td rowSpan={2} className="border-none">
                  empty
                </td>
                <td colSpan={6}>LAST SHOP VISIT INFORMATION</td>
                <td className="border-none">empty</td>
                <td colSpan={11}>CURENT TIMES</td>
              </tr>
              <tr style={{ fontWeight: "bold" }}>
                <td>DATE</td>
                <td>TSN</td>
                <td>CSN</td>
                <td>TSO</td>
                <td>CSO</td>
                <td>STATUS</td>
                <td className="border-none">Empty</td>
                <td className="border-none">empty</td>
                <td>DATE</td>
                <td>TAT</td>
                <td>TAC</td>
                <td>TSN</td>
                <td>CSN</td>
                <td colSpan={2}>TSO</td>
                <td>CSO</td>
                <td>{data?.currentTimesViewModel?.currentEngineTimeViewModel?.nameExtension ? TS : "TS"}</td>
                <td>{data?.currentTimesViewModel?.currentEngineTimeViewModel?.nameExtension ? CS : "CS"}</td>
              </tr>
              <tr>
                <td><b>TMM</b></td>
                <td>{DateFormat(lastShopVisit?.currentDate)}</td>
                <td>{HourFormat(lastShopVisit?.tsn)}</td>
                <td>{CycleFormat(lastShopVisit?.csn)}</td>
                <td>{HourFormat(lastShopVisit?.tso)}</td>
                <td>{CycleFormat(lastShopVisit?.cso)}</td>
                <td>{lastShopVisit?.status ? lastShopVisit?.status : "N/A"}</td>
                <td className="border-none">empty</td>
                <td><b>TMM</b></td>
                <td>{currentTimes?.engineTmmViewModel?.currentDate || currentTimes?.engineTmmViewModel?.currentDate === 0 ?
                  moment(`${currentTimes?.engineTmmViewModel?.currentDate}`, 'YYYY-MM-DD').format('DD-MMM-YYYY') : 'N/A'}</td>
                <td>{HourFormat(currentTimes?.engineTmmViewModel?.tat)}</td>
                <td>{CycleFormat(currentTimes?.engineTmmViewModel?.tac)}</td>
                <td>{HourFormat(currentTimes?.engineTmmViewModel?.tsn)}</td>
                <td>{CycleFormat(currentTimes?.engineTmmViewModel?.csn)}</td>
                <td colSpan={2}>{HourFormat(currentTimes?.engineTmmViewModel?.tso)}</td>
                <td>{CycleFormat(currentTimes?.engineTmmViewModel?.cso)}</td>
                <td>{HourFormat(data?.currentTimesViewModel?.currentEngineTimeViewModel?.currentEngineTimeTmmViewModel?.hour)}</td>
                <td>{CycleFormat(data?.currentTimesViewModel?.currentEngineTimeViewModel?.currentEngineTimeTmmViewModel?.cycle)}</td>
              </tr>
              <tr>
                <td><b>RGB</b></td>
                <td>{DateFormat(data?.lastShopVisitedInfoViewModel?.engineRgbViewModel?.currentDate)}</td>
                <td>{HourFormat(data?.lastShopVisitedInfoViewModel?.engineRgbViewModel?.tsn)}</td>
                <td>{CycleFormat(data?.lastShopVisitedInfoViewModel?.engineRgbViewModel?.csn)}</td>
                <td>{HourFormat(data?.lastShopVisitedInfoViewModel?.engineRgbViewModel?.tso)}</td>
                <td>{CycleFormat(data?.lastShopVisitedInfoViewModel?.engineRgbViewModel?.cso)}</td>
                <td>{data?.lastShopVisitedInfoViewModel?.engineRgbViewModel?.status ? data?.lastShopVisitedInfoViewModel?.engineRgbViewModel?.status : "N/A"}</td>
                <td className="border-none">empty</td>
                <td><b>RGB</b></td>
                <td>{currentTimes?.engineRgbViewModel?.currentDate || currentTimes?.engineRgbViewModel?.currentDate === 0 ?
                  moment(`${currentTimes?.engineRgbViewModel?.currentDate}`, 'YYYY-MM-DD').format('DD-MMM-YYYY') : 'N/A'}</td>
                <td>{HourFormat(currentTimes?.engineRgbViewModel?.tat)}</td>
                <td>{CycleFormat(currentTimes?.engineRgbViewModel?.tac)}</td>
                <td>{HourFormat(currentTimes?.engineRgbViewModel?.tsn)}</td>
                <td>{CycleFormat(currentTimes?.engineRgbViewModel?.csn)}</td>
                <td colSpan={2}>{HourFormat(currentTimes?.engineRgbViewModel?.tso)}</td>
                <td>{CycleFormat(currentTimes?.engineRgbViewModel?.cso)}</td>
                <td>{HourFormat(data?.currentTimesViewModel?.currentEngineTimeViewModel?.currentEngineTimeRgbViewModel?.hour)}</td>
                <td>{CycleFormat(data?.currentTimesViewModel?.currentEngineTimeViewModel?.currentEngineTimeRgbViewModel?.cycle)}</td>

              </tr>
              <tr>
                <td colSpan={19} className="border-none">
                  empty
                </td>
              </tr>
              <tr style={{ fontWeight: "bold" }}>
                <td className="border-none">empty</td>
                <td colSpan={2}>TSLSV</td>
                <td colSpan={2}>CSLSV</td>
                <td colSpan={3} className="border-none">Empty</td>
                <td colSpan={11}>ENGINE INSTALLATION INFORMATION</td>
              </tr>
              <tr style={{ fontWeight: "bold" }}>
                <td className="border-none">empty</td>
                <td colSpan={2}>{data?.shopVisitedInformation?.tslsv || data?.shopVisitedInformation?.tslsv === 0 ?
                  formatTimeValue(data?.shopVisitedInformation?.tslsv) : "N/A"}</td>
                <td colSpan={2}>{data?.shopVisitedInformation?.cslsv || data?.shopVisitedInformation?.cslsv === 0 ?
                  data?.shopVisitedInformation?.cslsv : "N/A"}</td>
                <td colSpan={3} className="border-none">Empty</td>
                <td>A/C REGN</td>
                <td>MSN</td>
                <td>POSN</td>
                <td>DATE</td>
                <td>TAT</td>
                <td>TAC</td>
                <td className="border-none">empty</td>
                <td>TSN</td>
                <td>CSN</td>
                <td>TSO</td>
                <td>CSO</td>
              </tr>
              <tr>
                <td colSpan={8} className="border-none">
                  empty
                </td>
                <td rowSpan={2}>{engnInstInfo?.aircraftRegistrationNo || engnInstInfo?.aircraftRegistrationNo === 0 ?
                  engnInstInfo?.aircraftRegistrationNo : 'N/A'}</td>
                <td rowSpan={2}>{engnInstInfo?.msn || engnInstInfo?.msn === 0 ?
                  engnInstInfo?.msn : 'N/A'}</td>
                <td rowSpan={2}>{engnInstInfo?.positionName || engnInstInfo?.positionName === 0 ?
                  engnInstInfo?.positionName : 'N/A'}</td>
                <td rowSpan={2}>{engnInstInfo?.attachDate || engnInstInfo?.attachDate === 0 ?
                  moment(`${engnInstInfo?.attachDate}`, 'YYYY-MM-DD').format('DD-MMM-YYYY') : 'N/A'}</td>
                <td rowSpan={2}>{HourFormat(engnInstInfo?.tat)}</td>
                <td rowSpan={2}>{CycleFormat(engnInstInfo?.tac)}</td>
                <td style={{ backgroundColor: "#DCE6F1" }}><b>TMM</b></td>
                <td>{HourFormat(engnInstInfo?.engineTmmViewModel?.tsn)}</td>
                <td>{CycleFormat(engnInstInfo?.engineTmmViewModel?.csn)}</td>
                <td>{HourFormat(engnInstInfo?.engineTmmViewModel?.tso)}</td>
                <td>{CycleFormat(engnInstInfo?.engineTmmViewModel?.cso)}</td>
              </tr>
              <tr>
                <td colSpan={8} className="border-none">
                  empty
                </td>
                <td style={{ backgroundColor: "#DCE6F1" }}><b>RGB</b></td>
                <td>{HourFormat(engnInstInfo?.engineRgbViewModel?.tsn)}</td>
                <td>{CycleFormat(engnInstInfo?.engineRgbViewModel?.csn)}</td>
                <td>{HourFormat(engnInstInfo?.engineRgbViewModel?.tso)}</td>
                <td>{CycleFormat(engnInstInfo?.engineRgbViewModel?.cso)}</td>
              </tr>
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan={15} className="border-none">
                  empty
                </td>
                <td colSpan={3}>AVERAGE CYCS/DAY:</td>
                <td>{engnInstInfo?.averageCycles}</td>
              </tr>
            </tbody>
          </ARMReportTable>
          <br />
          <br />
          <ARMReportTable className="engine-data-table">
            <tbody>
              <tr style={{ fontWeight: "bold" }}>
                <td rowSpan={2}>NOMENCLATURE</td>
                <td rowSpan={2}>PART NO.</td>
                <td rowSpan={2}>SERIAL NO.</td>
                <td colSpan={2}>INSTALLED @</td>
                <td colSpan={2}>CURENT</td>
                <td rowSpan={2}>LIFE LIMIT</td>
                <td rowSpan={2} style={{ backgroundColor: "#E4DFEC" }}>
                  REMAINING (FC)
                </td>
                <td rowSpan={2}>ESTIMATED DUE DATE</td>
              </tr>
              <tr style={{ fontWeight: "bold" }}>
                <td>TSN</td>
                <td>CSN</td>
                <td>TSN</td>
                <td>CSN</td>
              </tr>
              {data?.engineLlpPartViewModels?.map((d: any, index: number) => (
                <tr key={index}>
                  <td>{d.nomenclature ? d.nomenclature : 'N/A'}</td>
                  <td>{d.partNo ? d.partNo : 'N/A'}</td>
                  <td>{d.serialNo ? d.serialNo : 'N/A'}</td>
                  <td>{d.installedTsn || d.installedTsn === 0 ? formatTimeValue(d.installedTsn) : 'N/A'}</td>
                  <td>{d.installedCsn || d.installedCsn === 0 ? d.installedCsn : 'N/A'}</td>
                  <td>{d.currentTsn || d.currentTsn === 0 ? formatTimeValue(d.currentTsn) : 'N/A'}</td>
                  <td>{d.currentCsn || d.currentCsn === 0 ? d.currentCsn : 'N/A'}</td>
                  <td>{d.lifeLimit ? d.lifeLimit : 'N/A'}</td>
                  <td style={{ backgroundColor: "#E4DFEC" }}>{d.remainingFC ? d.remainingFC : 'N/A'}</td>
                  <td>{d.estimatedDueDate ? moment(`${d.estimatedDueDate}`, 'YYYY-MM-DD').format('DD-MMM-YYYY') : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </ARMReportTable>
        </EngineLLPs>
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
