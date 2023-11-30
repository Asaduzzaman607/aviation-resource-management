import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import { Breadcrumb, Col, Form, Row, Select, Space, Typography, Pagination } from "antd";
import { Link } from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import ReactToPrint from "react-to-print";
import { createRef, useCallback, useEffect, useState } from "react";
import SuccessButton from "../../../common/buttons/SuccessButton";
import { REQUIRED } from "../../../../lib/constants/validation-rules";
import ARMButton from "../../../common/buttons/ARMButton";
import { FilterOutlined, PrinterOutlined, RollbackOutlined } from "@ant-design/icons";
import styled from "styled-components";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import { ARMReportTable } from "../ARMReportTable";
import CompanyLogo from "../CompanyLogo";
import API from "../../../../service/Api";
import moment from "moment";
import { formatTimeValue } from "../../../../lib/common/presentation";
import { useAircraftsList } from "../../../../lib/hooks/planning/aircrafts";
import { useBoolean } from "react-use";
import {notifyError, notifyResponseError} from "../../../../lib/common/notifications";
import { sleep } from "../../../../lib/common/helpers";
import { HourFormat, pageSerialNo } from "../Common";
import Permission from "../../../auth/Permission";

const printStyle = `
*{
  margin: 0!important;
  padding: 0!important;
  font-size: 10px !important;
  overflow: visible !important;
}
.title{
    font-size: 20px !important;
}
.print-preview{
  padding: 0 50px !important;
  white-space: nowrap !important;
}

.border-bold td,
.border-bold th,
.report-content tr td{
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
  `

const ReportContainer = styled.div`
  @media print {
    padding: 30px !important;
    display: block;
  }
  .table{
    margin-top: 20px;
  }
  .text{
    margin-top: -20px!important;
  }
  
  width: 100% !important;

  .none{
    visibility: hidden;
    border: none;
  }
  .border-none{
      border: none;
  }
  .bold{
    font-weight: bold;
  }
  .text-left{
    text-align: center;
  }
  
  .second{
    display: none;
  }
  @page{ size: portrait; }
`;


const TITLE = "Work Scope Approval";

export default function WorkScopeApproval() {
  const reportRef = createRef<any>();
  const [form] = Form.useForm<any>();
  const acCheckIndexId = Form.useWatch('acCheckIndexId', form)
  const [acCheckIndexs, setAllAcCheckIndexs] = useState<any>([]);
  const { allAircrafts, getAllAircrafts } = useAircraftsList()
  const aircraftId = Form.useWatch('aircraftId', form)
  const [data, setData] = useState<any>({})
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [printData, setPrintData] = useState<any>({})
  const [submitting, toggleSubmitting] = useBoolean(false) 


  const getAllAcCheck = async () => {
    if (!aircraftId) return
    const { data } = await API.get(`aircraft-check-index/find-all-ac-check-index/${aircraftId}`)
    setAllAcCheckIndexs(data)
  }

  const getWorkScope = useCallback(async (values: any) => {
    const customValues = {
      acCheckIndexId: values.acCheckIndexId,
      isPageable: true
    }
    try {
      const { data } = await API.post(`aircraft-check-index/work-scope?page=${currentPage}&size=${values.size}`, customValues)
      setData(data)
      setPrintData(printData.data);
      setCurrentPage(data.pageData.currentPage)
      setTotalPages(data.pageData.totalPages)
    } catch (error) {
      notifyError(error)
    }
    finally {
      toggleSubmitting(false)
    }
  }, [currentPage, toggleSubmitting])

  const fetchPrintData = async () => {
    const customValues = {
      acCheckIndexId,
      isPageable: false
    }
    try {
      const { data } = await API.post(`aircraft-check-index/work-scope`, customValues)
      setPrintData(data)
      return sleep(1000);
    } catch (error) {
      notifyResponseError(error)
    }
  }

  useEffect(() => {
    if (!acCheckIndexId) {
      return;
    }
    (async () => {
      await getWorkScope(form.getFieldsValue(true));
    })();
  }, [getWorkScope, form]);

  useEffect(() => {
    (async () => {
      await getAllAircrafts()
    })()
  }, [])


  useEffect(() => {
    if (!aircraftId) {
      return
    }
    (async () => {
      await getAllAcCheck()
    })()
  }, [aircraftId])


  const resetFilter = () => {
    form.resetFields()
    setData([])
    setPrintData({})
  }

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
    <Permission permission="PLANNING_CHECK_WORK_SCOPE_APPROVAL_SEARCH" showFallback>
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
              onBeforeGetContent={fetchPrintData}
            />
          </Col>
        </Row>
      }
    >

      <Form
        form={form}
        name="filter-form"
        initialValues={{ size:10 }}
        onFinish={getWorkScope}
      >
        <Row gutter={20}>

          <Col xs={24} md={4}>
            <Form.Item
              rules={[REQUIRED]}
              name="aircraftId"
            >

              <Select
                placeholder="Select Aircrafts"
                onChange={getAllAcCheck}
              >
                {
                  allAircrafts?.map((aircraft: { aircraftId: any, aircraftName: any; }) => <Select.Option value={aircraft?.aircraftId} key={aircraft?.aircraftId}>{aircraft?.aircraftName}</Select.Option>)
                }
              </Select>
            </Form.Item>
          </Col>
          <Col md={20}></Col>
          <Col xs={24} md={4}>
            <Form.Item
              rules={[REQUIRED]}
              name="acCheckIndexId"
            >

              <Select
                placeholder="Select AC Check Index"
              >
                {
                  acCheckIndexs.map((acCheckIndex: { acCheckIndexId: any, aircraftChecksName: any; }) => <Select.Option value={acCheckIndex?.acCheckIndexId} key={acCheckIndex?.acCheckIndexId}>{acCheckIndex?.aircraftChecksName}</Select.Option>)
                }
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

          <Col xs={24} md={6}>
            <Form.Item>
              <Space>
                <ARMButton loading={submitting} size="middle" type="primary" htmlType="submit">
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
          <Col span={24} className="first">
            <Row justify="space-between">
              <Col>
                <CompanyLogo />
              </Col>
              <Col style={{ fontSize: "10px" }}>
                <Typography.Text>Form: CAME-027</Typography.Text>
                <br />
                <Typography.Text>ISSUE INITIAL</Typography.Text>
                <br />
                <Typography.Text>DATE 19 JAN 2022</Typography.Text>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row justify="center" className="first">
              <Col span={24} style={{ textAlign: 'center' }}>
                <Typography.Title level={3} style={{ padding: 0, margin: 0 }}>US-BANGLA AIRLINES LTD.</Typography.Title>
                <Typography.Title level={1} style={{ padding: 0, margin: 0, textDecoration: "underline" }}>WORK SCOPE</Typography.Title>
              </Col>
            </Row>

            <Row className="table-responsive">
              <ResponsiveTable className="first">
                <ARMReportTable className="table">
                  <tbody>
                    <tr>
                      <td colSpan={2} className="bold print-preview">AIRCRAFT TYPE</td>
                      <td className="text-left">{data?.aircraftModelName}</td>
                      <td className="bold">MSN</td>
                      <td>{data?.airframeSerial}</td>
                      <td className="bold">TAT</td>
                      <td>{data?.airFrameTotalTime && formatTimeValue(data?.airFrameTotalTime)}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="bold">AIRCRAFT REGN</td>
                      <td className="text-left">{data?.aircraftName}</td>
                      <td className="bold">DOM</td>
                      <td>{data?.manufactureDate && moment(`${data.manufactureDate}`, "YYYY-MM-DD").format("DD-MMM-YY")}</td>
                      <td className="bold">TAC</td>
                      <td>{data?.airframeTotalCycle}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="bold">CHECK TYPE</td>
                      <td className="text-left">{data?.aircraftChecksName}</td>
                      <td className="bold">W/O REF:</td>
                      <td>{data?.woNo}</td>
                      <td className="bold">AS OF</td>
                      <td>{data?.asOfDate && moment(`${data.asOfDate}`, "YYYY-MM-DD").format("DD-MMM-YY")}</td>
                      <td className="none">empty</td>
                      <td className="none">empty</td>
                      <td className="none">empty</td>
                    </tr>
                    <br />
                    <tr className="bold">
                      <td width={40}>S/L <br /> NO</td>
                      <td colSpan={2}>TASK NUMBER</td>
                      <td>TASK TYPE</td>
                      <td>INTERVAL</td>
                      <td>THRESHOLD</td>
                      <td colSpan={5}>TASK DESCRIPTION</td>
                    </tr>
                    {
                      data?.pageData?.model?.map((wo: any, index: number) => (<tr key={index}>
                        <td>{pageSerialNo(currentPage, index + 1)}</td>
                        <td colSpan={2}>{wo.taskNo}</td>
                        <td>{wo.taskType}</td>
                        <td>{HourFormat(wo.intervalHour && wo.intervalHour)} {wo.intervalHour !== null ? (wo.isApuControl ? 'AH' : "FH") : 'N/A'}  <br />
                          {wo.intervalCycle && wo.intervalCycle} {wo.intervalCycle !== null ? (wo.isApuControl ? 'AC' : 'FC') : 'N/A'} <br />
                          {wo.intervalDay && wo.intervalDay} {wo.intervalDay !== null ? 'DY' : null}</td>
                        <td>{HourFormat(wo.thresholdHour && wo.thresholdHour)} {wo.thresholdHour !== null ? (wo.isApuControl ? 'AH' : "FH") : 'N/A'}  <br />
                          {wo.thresholdCycle && wo.thresholdCycle} {wo.thresholdCycle !== null ? (wo.isApuControl ? 'AC' : 'FC') : 'N/A'} <br />
                          {wo.thresholdDay && wo.thresholdDay} {wo.thresholdDay !== null ? 'DY' : null}</td>
                        <td colSpan={5} className='newLineInRow'>{wo.taskDescriptionViewModel?.taskDescription} {wo.taskDescriptionViewModel?.taskDescription && <br />}
                          {wo.taskDescriptionViewModel?.partNo && 'Part No: ' + wo.taskDescriptionViewModel?.partNo} {wo.taskDescriptionViewModel?.partNo && <br />}
                          {wo.taskDescriptionViewModel?.serialNo && 'Serial No: ' + wo.taskDescriptionViewModel?.serialNo} </td>
                      </tr>))
                    }
                  </tbody>
                </ARMReportTable>
              </ResponsiveTable>
              <ResponsiveTable className="second">
                <ARMReportTable>
                  <table className="report-container" style={{ width: "100%" }}>
                    <thead className="report-header">
                      <tr>
                        <td className="report-header-cell border-none" colSpan={10}>
                          <div className="header-info">
                            <Col span={24}>
                              <Row justify="space-between">
                                <Col>
                                  <CompanyLogo />
                                </Col>
                                <Col style={{ fontSize: "10px" }}>
                                  <Typography.Text>Form: CAME-027</Typography.Text>
                                  <br />
                                  <Typography.Text>ISSUE INITIAL</Typography.Text>
                                  <br />
                                  <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                                </Col>
                              </Row>
                              <Row justify="center">
                                <Col span={24} style={{ textAlign: 'center' }}>
                                  <Typography.Title level={3} style={{ padding: 0, margin: 0 }}>US-BANGLA AIRLINES LTD.</Typography.Title>
                                  <Typography.Title level={1} style={{ padding: 0, margin: 0, textDecoration: "underline" }} className="title">WORK SCOPE</Typography.Title>
                                </Col>
                              </Row>
                            </Col>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="none">ok</td>
                      </tr>
                      <tr className="border-bold">
                        <td colSpan={2} className="bold print-preview">AIRCRAFT TYPE</td>
                        <td className="text-left">{printData?.aircraftModelName}</td>
                        <td className="bold">MSN</td>
                        <td>{printData?.airframeSerial}</td>
                        <td className="bold">TAT</td>
                        <td>{printData?.airFrameTotalTime && formatTimeValue(printData?.airFrameTotalTime)}</td>
                      </tr>
                      <tr className="border-bold">
                        <td colSpan={2} className="bold">AIRCRAFT REGN</td>
                        <td className="text-left">{printData?.aircraftName}</td>
                        <td className="bold">DOM</td>
                        <td>{printData?.manufactureDate && moment(`${printData.manufactureDate}`, "YYYY-MM-DD").format("DD-MMM-YY")}</td>
                        <td className="bold">TAC</td>
                        <td>{printData?.airframeTotalCycle}</td>
                      </tr>
                      <tr className="border-bold">
                        <td colSpan={2} className="bold">CHECK TYPE</td>
                        <td className="text-left">{printData?.aircraftChecksName}</td>
                        <td className="bold">W/O REF:</td>
                        <td>{printData?.woNo}</td>
                        <td className="bold">AS OF</td>
                        <td>{printData?.asOfDate && moment(`${printData.asOfDate}`, "YYYY-MM-DD").format("DD-MMM-YY")}</td>
                        <td className="none">empty</td>
                        <td className="none">empty</td>
                        <td className="none">empty</td>
                      </tr>
                      <tr>
                        <td className="none">empty</td>
                      </tr>
                      <tr className="bold border-bold">
                        <th style={{ width: "15px" }}>S/L  NO</th>
                        <th colSpan={2}>TASK NUMBER</th>
                        <th>TASK TYPE</th>
                        <th>INTERVAL</th>
                        <th>THRESHOLD</th>
                        <th colSpan={5}>TASK DESCRIPTION</th>
                      </tr>
                    </thead>
                    <tbody className="report-content">
                      {
                        printData?.workScopeTaskViewModels?.map((wo: any, index: number) => (<tr key={index}>
                          <td>{index + 1}</td>
                          <td colSpan={2} className="text-left">&nbsp;{wo.taskNo}</td>
                          <td>{wo.taskType}</td>
                          <td>{HourFormat(wo.intervalHour && wo.intervalHour)} {wo.intervalHour !== null ? (wo.isApuControl ? 'AH' : "FH") : null}  <br />
                            {wo.intervalCycle && wo.intervalCycle} {wo.intervalCycle !== null ? (wo.isApuControl ? 'AC' : 'FC') : null} <br />
                            {wo.intervalDay && wo.intervalDay} {wo.intervalDay !== null ? 'DY' : null}</td>
                          <td>{HourFormat(wo.thresholdHour && wo.thresholdHour)} {wo.thresholdHour !== null ? (wo.isApuControl ? 'AH' : "FH") : null}  <br />
                            {wo.thresholdCycle && wo.thresholdCycle} {wo.thresholdCycle !== null ? (wo.isApuControl ? 'AC' : 'FC') : null} <br />
                            {wo.thresholdDay && wo.thresholdDay} {wo.thresholdDay !== null ? 'DY' : null}</td>
                          <td colSpan={5} className="text-left">&nbsp;{wo.taskDescriptionViewModel?.taskDescription} {wo.taskDescriptionViewModel?.taskDescription && <br />}
                            &nbsp;{wo.taskDescriptionViewModel?.partNo && 'Part No: ' + wo.taskDescriptionViewModel?.partNo} {wo.taskDescriptionViewModel?.partNo && <br />}
                            &nbsp;{wo.taskDescriptionViewModel?.serialNo && 'Serial No: ' + wo.taskDescriptionViewModel?.serialNo} </td>
                        </tr>))
                      }
                    </tbody>
                  </table>
                </ARMReportTable>
              </ResponsiveTable>
            </Row>
            {data?.pageData?.model?.length > 0 && <Row justify="center" className="first">
              <Col style={{ marginTop: "10px" }}>
                <Pagination
                  showSizeChanger={false}
                  onChange={setCurrentPage}
                  defaultCurrent={currentPage}
                  total={totalPages * 10}
                />
              </Col>
            </Row>}
            <div className="second" style={{ marginTop: "130px" }}>
              <br /> <br /> <br />
              <div style={{ display: "flex", justifyContent: "space-between", width: "85%" }}>
                <h3>_______________________</h3>
                <h3>_________________________</h3>
                <h3>_____________________</h3>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", width: "84%", marginTop: "-10px", fontWeight: "bold" }}>
                <h3 style={{ marginLeft: "20px" }}>PREPARED BY</h3>
                <h3>CHECKED BY</h3>
                <h3>APPROVED BY</h3>
              </div>
            </div>
          </Col>
        </ReportContainer>
      </Row>

    </ARMCard>
    </Permission>
  </CommonLayout>;
}