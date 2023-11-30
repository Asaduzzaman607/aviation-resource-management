import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import { Breadcrumb, Col, Pagination, Form, Row, Select, Space, Typography, DatePicker } from "antd";
import { Link } from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import {createRef, useEffect, useMemo, useState} from "react";
import { REQUIRED } from "../../../../lib/constants/validation-rules";
import { useAircraftsList } from "../../../../lib/hooks/planning/aircrafts";
import ARMButton from "../../../common/buttons/ARMButton";
import { FilterOutlined, RollbackOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { ARMReportTable } from "../ARMReportTable";
import CompanyLogo from "../CompanyLogo";
import PrintButton from "../../../common/PrintButton";
import API from "../../../../service/Api";
import { notifyError } from "../../../../lib/common/notifications";
import moment from "moment";
import { formatSingleTimeValue, formatTimeValue } from "../../../../lib/common/presentation";
import { dateFormat } from "../AirframeAndApplianceADStatus";
import Permission from "../../../auth/Permission";
import DateTimeConverter from "../../../../converters/DateTimeConverter";
import { HourFormat } from "../Common";

const TITLE = "Propeller Status";

const ReportContainer = styled.div`

  .title{
    text-align: center;
  }
  .border-none{
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
  
  .text{
    margin-top: -20px!important;
  }
  
  width: 100% !important;

  @page { size: landscape }
`;

export default function PropellerStatus() {
  const reportRef = createRef<any>();
  const [form] = Form.useForm<any>();
  const { aircrafts, initAircrafts } = useAircraftsList();
  const [propellers, setPropellers] = useState<any[]>([])
  const aircraftId = Form.useWatch('aircraftId', form)
  const aircraftBuildId = Form.useWatch('aircraftBuildId', form)
  const [aircraftsInfo, setAircraftsInfo] = useState<any>({})
  const [positions, setPositions] = useState<any>([])
  const [data, setData] = useState<any>({
    propellerReportHeaderData: {
      modelName: ''
    }
  })
  const [date, setDate] = useState("");

  useEffect(() => {
    (async () => {
      await initAircrafts();
    })();
  }, [])

  const aircraft = useMemo(() => {
    const ac = aircrafts.find((ac: any) => ac.id === aircraftId)
    if (ac) return ac;
    return {};
  }, [aircraftId, aircrafts]) as { propellerType?: string}

  const handleSubmit = async () => {
    try {
      const { data } = await API.post(`aircraft-build/propeller-report`, { aircraftBuildId: aircraftBuildId,date:date })
      setData(data);
      setPropellers(data?.propellerReportViewModelList)
    } catch (error) {
      notifyError(error)
    }
  }

  const resetFilter = () => {
    form.resetFields()
    setAircraftsInfo([])
    setPropellers([])
    setData([])
  }

  const getAircraftInfoAndPropellerPosition = async () => {
    const { data } = await API.get(`/aircrafts/info/${aircraftId}`)
    const positions = await API.get(`aircraft-build/propeller/position-name/${aircraftId}`)
    setAircraftsInfo(data)
    setPositions(positions.data)
  }

  useEffect(() => {
    if (!aircraftId) {
      return;
    }
    (async () => {
      await getAircraftInfoAndPropellerPosition()
    })()
  }, [aircraftId])



  return <CommonLayout>
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
          <Col><PrintButton printAreaRef={reportRef} /></Col>
        </Row>
      }
    >

      <Form
        form={form}
        name="filter-form"
        initialValues={{ aircraftId: null, date: '' }}
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
                onChange={() => {
                  form.setFieldsValue({aircraftBuildId: ""})
                }}
              >
                {
                  aircrafts.map(({ id, name }) => <Select.Option value={id} key={id}>{name}</Select.Option>)
                }
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={4}>
            <Form.Item
              rules={[REQUIRED]}
              name="aircraftBuildId"
            >

              <Select
                placeholder="Select Position"
              >
                {
                  positions.map((position: { aircraftBuildId: any; positionName: any; }) => <Select.Option value={position.aircraftBuildId} key={position.aircraftBuildId}>{position.positionName}</Select.Option>)
                }
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
              <DatePicker format="YYYY-MM-DD" style={{width: "100%"}} onChange={(e)=> setDate(DateTimeConverter.momentDateToString(e))}/>
          </Col>



          <Col xs={24} md={6}>
            <Form.Item>
              <Space>
                <ARMButton size="middle" type="primary" htmlType="submit">
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
      <Row ref={reportRef}>

        <ReportContainer>
          <Col span={24}>
            <Row>
              <Col span={24}>
                <Row justify="space-between">
                  <Col>
                    <CompanyLogo />
                  </Col>
                  <Col style={{ fontSize: "8px", fontWeight: "bold" }}>
                    <Typography.Text>Form: CAME-047</Typography.Text> <br />
                    <Typography.Text>ISSUE: INITIAL</Typography.Text> <br />
                    <Typography.Text>DATE: 19-01-2022</Typography.Text>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Typography.Title level={5} className="title">
              PROPELLER STATUS
            </Typography.Title>
            <ARMReportTable className="engine-table">
              <tbody>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={2} className="border-none">empty</td>
                  <td colSpan={2}>A/C TYPE</td>
                  <td colSpan={2}>{aircraftsInfo?.aircraftModelName}</td>
                  <td className="border-none">empty</td>
                  <td colSpan={2}>TYPE/MODEL</td>
                  <td colSpan={2}>{aircraft.propellerType}</td>
                  <td colSpan={5} className="border-none">empty</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={2} className="border-none">empty</td>
                  <td colSpan={2}>A/C REGN.</td>
                  <td colSpan={2}>{aircraftsInfo?.aircraftName}</td>
                  <td className="border-none">empty</td>
                  <td colSpan={2}>PROPELLER P/N</td>
                  <td colSpan={2}>{data?.propellerReportHeaderData?.propPartNo}</td>
                  <td colSpan={5} className="border-none">empty</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={2} className="border-none">empty</td>
                  <td colSpan={2}>A/C MSN</td>
                  <td colSpan={2}>{aircraftsInfo?.airframeSerial}</td>
                  <td className="border-none">empty</td>
                  <td colSpan={2}>PROPELLER S/N</td>
                  <td colSpan={2}>{data?.propellerReportHeaderData?.propSerialNo}</td>
                  <td colSpan={5} className="border-none">empty</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={7} className="border-none">empty</td>
                  <td colSpan={2}>POSITION</td>
                  <td colSpan={2}>{data?.propellerReportHeaderData?.positionName}</td>
                </tr>
                <tr>
                  <td colSpan={11} className="border-none"></td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td>DATE</td>
                  <td>{dateFormat(data?.propellerReportHeaderData?.updatedDate)}</td>
                  <td>TAT</td>
                  <td>{HourFormat(data?.propellerReportHeaderData?.tat)}</td>
                  <td>TAC</td>
                  <td>{data?.propellerReportHeaderData?.tac}</td>
                  <td colSpan={10} className="border-none">empty</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={2} className="border-none">empty</td>
                  <td>PROP. TSN</td>
                  <td>PROP. CSN</td>
                  <td>PROP. TSO</td>
                  <td>PROP. CSO</td>
                  <td colSpan={10} className="border-none">empty</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={2} className="border-none">empty</td>
                  <td>{data?.propellerReportHeaderData?.propTsn && formatSingleTimeValue(data?.propellerReportHeaderData?.propTsn)}</td>
                  <td>{data?.propellerReportHeaderData?.propCsn}</td>
                  <td>{data?.propellerReportHeaderData?.propTso && formatSingleTimeValue(data?.propellerReportHeaderData?.propTso)}</td>
                  <td>{data?.propellerReportHeaderData?.propCso}</td>
                  <td colSpan={7} className="border-none">empty</td>
                  <td>AVG FH:</td>
                  <td>{formatTimeValue(aircraftsInfo?.averageHours)}</td>
                  <td className="border-none">empty</td>
                </tr>
                <tr>
                  <td colSpan={13} className="border-none"></td>
                  <td>AVG FC:</td>
                  <td>{aircraftsInfo?.averageCycle}</td>
                  <td className="border-none">empty</td>
                </tr>
                <tr>
                  <td colSpan={16} className="border-none"></td>
                </tr>
                <tr style={{ paddingTop: '1em' }}>
                  <th rowSpan={2} colSpan={3}>NOMENCLATURE</th>
                  <th rowSpan={2}>PART NO.</th>
                  <th rowSpan={2}>SERIAL NO</th>
                  <th colSpan={3}>INSTALLATION</th>
                  <th colSpan={2}>CURRENT</th>
                  <th colSpan={2}>LIFE LIMIT &amp; DUE DATE</th>
                  <th colSpan={2}>REMAINING</th>
                  <th rowSpan={2}>DUE FOR</th>
                  <th rowSpan={2}>ESTIMATED <br /> DUE DATE</th>
                </tr>
                <tr>
                  <th>DATE</th>
                  <th>TSN</th>
                  <th>TSO</th>
                  <th>TSN</th>
                  <th>TSO</th>
                  <th>MONTH</th>
                  <th>FH</th>
                  <th>DAY</th>
                  <th>FH</th>
                </tr>
                {propellers.length > 0 &&
                  propellers.map((p: any, index: any) => (<tr key={index}>
                    <td colSpan={3}>{p.nomenClature}</td>
                    <td>{p.partNo}</td>
                    <td>{p.serialNo}</td>
                    <td>{p.installationDate && moment(`${p.installationDate}`, 'YYYY-MM-DD').format('DD-MMM-YYYY')}</td>
                    <td>{p.installationTsn && formatTimeValue(p.installationTsn)}</td>
                    <td>{p.installationTso && formatTimeValue(p.installationTso)}</td>
                    <td>{p.currentTsn && formatTimeValue(p.currentTsn)}</td>
                    <td>{p.currentTso && formatTimeValue(p.currentTso)}</td>
                    <td>{p.dueDate ? moment(`${p.dueDate}`, 'YYYY-MM-DD').format('DD-MMM-YYYY'): 'N/A'}</td>
                    <td>{p.limitFh && formatTimeValue(p.limitFh)}</td>
                    <td>{p.remainingDay ? p.remainingDay :'N/A'}</td>
                    <td>{p.remainingHour && formatTimeValue(p.remainingHour)}</td>
                    <td>OVHL</td>
                    <td>{p.estimatedDate && moment(`${p.estimatedDate}`, 'YYYY-MM-DD').format('DD-MMM-YYYY')}</td>
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