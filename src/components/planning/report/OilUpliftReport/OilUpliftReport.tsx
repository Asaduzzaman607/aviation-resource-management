import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, DatePicker, Form, Row, Select, Space, Typography, Pagination, Button} from "antd";
import { Link } from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import {FilterOutlined, RollbackOutlined, PrinterOutlined, DownloadOutlined} from "@ant-design/icons";
import { REQUIRED } from "../../../../lib/constants/validation-rules";
import ARMButton from "../../../common/buttons/ARMButton";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import CommonLayout from "../../../layout/CommonLayout";
import React, {createRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import { useAircraftsList } from "../../../../lib/hooks/planning/aircrafts";
import { ARMReportTable } from "../ARMReportTable";
import API from "../../../../service/Api";
import DateTimeConverter from "../../../../converters/DateTimeConverter";
import styled from "styled-components"
import { formatTimeValue } from "../../../../lib/common/presentation";
import logo from "../../../images/us-bangla-logo.png";
// @ts-ignore
import { find, propEq } from "ramda";
import ReactToPrint from "react-to-print";
import SuccessButton from "../../../common/buttons/SuccessButton";
import CompanyLogo from "../CompanyLogo";
import { useBoolean } from "react-use";
import { sleep } from "../../../../lib/common/helpers";
import { notifyError } from "../../../../lib/common/notifications";
import Permission from "../../../auth/Permission";
import { DateFormat, ViewDateFormat } from "../Common";
import moment from "moment";
import {useDownloadExcel} from "react-export-table-to-excel";

const TITLE = "Oil Uplift Report";

const printStyle = `
*{
  margin: 0!important;
  padding: 0!important;
  overflow: visible !important;
}
.border-bold th,
.border-bold td{
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



interface Filter {
  aircraftId: number,
  fromDate: string,
  toDate: string,
  isPageable: boolean,
  date: any,
  size: number
}

const ReportContainer = styled.div`
  @media print {
    padding: 0.5em !important;
  }
  .aircraft-titles{
    font-weight: bold;
    font-size: 20px;
  }
  .second{
    display: none;
  }
  .none{
    visibility: hidden;
    border: none;
  }
  .border-none{
    border: none;
  }
`

export default function OilUpliftReport() {
  const [form] = Form.useForm<Filter>();
  const reportRef = createRef<any>();
  const { aircrafts, initAircrafts } = useAircraftsList();
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [submitting, toggleSubmitting] = useBoolean(false)
  const [printData, setPrintData] = useState<any[]>([])
  const [printState, setPrintState] = useBoolean(false)
  const dateData = Form.useWatch("date", form)

  const aircraftId = Form.useWatch('aircraftId', form);
  const selectedAircraft = useMemo(() => find(propEq('id', aircraftId))(aircrafts), [aircraftId, aircrafts]);
  // @ts-ignore
  const aircraftName = selectedAircraft === undefined ? "" : (selectedAircraft.name + " : " + selectedAircraft.serial)

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);

  const fetchReportData = useCallback(async (values: Filter) => {
    try {
      const [fromDate, toDate] = values.date;
      const customValues = {
        aircraftId: values.aircraftId,
        fromDate: DateTimeConverter.momentDateToString(fromDate),
        toDate: DateTimeConverter.momentDateToString(toDate),
        isPageable: true
      }
      const { data } = await API.post(`aircraft-maintenance-log/oil-uplift-report?page=${currentPage}&size=${values.size}`, customValues);
      setData(data?.model);
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
    } catch (error) {
      notifyError(error)
    }
    finally {
      toggleSubmitting(false)
    }
  }, [currentPage, toggleSubmitting])

  const fetchPrintData = async () => {
    const [fromDate, toDate] = dateData
    const customValues = {
      aircraftId: aircraftId,
      fromDate: DateTimeConverter.momentDateToString(fromDate),
      toDate: DateTimeConverter.momentDateToString(toDate),
      isPageable: false
    }
    try {
      const { data } = await API.post(`aircraft-maintenance-log/oil-uplift-report`, customValues);
      setPrintData(data.model)
      setPrintState(true)
      return sleep(1000);
    } catch (error) {
      notifyError(error)
    }
  }

  useEffect(() => {
    (async () => {
      await initAircrafts();
    })();
  }, [initAircrafts])

  useEffect(() => {
    (async () => {
      await fetchReportData(form.getFieldsValue(true));
    })();
  }, [fetchReportData, form])

  const resetFilter = () => {
    form.resetFields();
    setData([])
    setPrintData([])
  }


  const oilUpliftRef = useRef(null);
  const {onDownload} = useDownloadExcel({
    currentTableRef: oilUpliftRef.current,
    filename: 'Oil Uplift report',
    sheet: 'oilUpliftReport'
  })

  const downloadOilUpliftExcel = async () => {

    if(!aircraftId) return
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
              <i className="fas fa-chart-line" /> &nbsp;Planning
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{TITLE}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_OIL_AND_FUEL_UPLIFT_RECORD_SEARCH" showFallback>
      <ARMCard
        title={
          <Row justify="space-between">
            <Col>{TITLE}</Col>
            <Col>
             <Space>
               <Button icon={<DownloadOutlined/>} onClick={downloadOilUpliftExcel}> Export excel </Button>
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
             </Space>
            </Col>
          </Row>
        }
      >

        <Form
          form={form}
          name="filter-form"
          initialValues={{ aircraftId: null, date: [moment(start, 'DD-MM-YYYY'), moment(end, 'DD-MM-YYYY')], size:10 }}
          onFinish={fetchReportData}
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
                    aircrafts.map(({ id, name }) => <Select.Option value={id} key={id}>{name}</Select.Option>)
                  }
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                rules={[REQUIRED]}
                name="date"
              >
                <DatePicker.RangePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
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
          <Col span={24}>
            <ReportContainer>
              <Row justify="space-between" className="first">
                <Col>
                  <img src={logo} alt="" width={110} />
                </Col>
                <Col>
                  <Typography.Title level={4}>
                    <b>
                      {aircraftName}
                    </b>
                  </Typography.Title>
                </Col>
                <Col style={{ fontSize: "10px", marginRight: "20px", width: 100 }}>
                </Col>
              </Row>

              <Row className="first">
                <Col span={24}>
                  <Typography.Title className="dfhcd-heading" style={{ textAlign: "center" }} level={4} type="secondary">
                    O I L &nbsp; & &nbsp; F U E L &nbsp; &nbsp; U P L I F T &nbsp; R E P O R T
                  </Typography.Title>
                </Col>
              </Row>

              <Row className="table-responsive">
                <ResponsiveTable className="first">
                  <ARMReportTable className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>ATL No</th>
                        <th>Air Time</th>
                        <th>Station</th>
                        <th>#1 Hyd System <br />(Gal/Qts)</th>
                        <th>#2 Hyd System <br />(Gal/Qts)</th>
                        <th>#3 Hyd System <br />(Gal/Qts)</th>
                        <th>#1 Engine Oil <br />(Gal/Qts)</th>
                        <th>#2 Engine Oil <br />(Gal/Qts)</th>
                        <th>APU Oil <br />(Gal/Qts)</th>
                        <th>Fuel Uplift <br />(Kg/lb)</th>
                        <th>Fuel Consumption</th>
                      </tr>

                    </thead>

                    <tbody style={{ whiteSpace: 'nowrap' }}>
                      {
                        data.length > 0
                        && data?.map((oilRecord: any) => (
                          <tr>
                            <td>{DateFormat(oilRecord.date)}</td>
                            <td>{oilRecord.pageNo}{oilRecord.alphabet}</td>
                            <td>{formatTimeValue(oilRecord.airTime)}</td>
                            <td>{oilRecord.fromAirport}</td>
                            <td>{oilRecord.hydOil1}</td>
                            <td>{oilRecord.hydOil2}</td>
                            <td>{oilRecord.hydOil3}</td>
                            <td>{oilRecord.engineOil1}</td>
                            <td>{oilRecord.engineOil2}</td>
                            <td>{oilRecord.apuOil}</td>
                            <td>{oilRecord?.upliftOilRecord}</td>
                            <td>{oilRecord?.fuelConsumption}</td>
                          </tr>))
                      }
                    </tbody>
                  </ARMReportTable>
                </ResponsiveTable>
                <ResponsiveTable className="second">
                  <ARMReportTable className="table" ref={oilUpliftRef}>
                    <thead className="report-header">
                      <tr>
                        <td className="report-header-cell border-none" colSpan={11}>
                          <div className="header-info">
                            <Col span={24}>
                              <Row>
                                {
                                  printState ?
                                      <Col>
                                        <CompanyLogo />
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
                        <td colSpan={11} className="border-none aircraft-titles">{aircraftName}</td>
                      </tr>
                      <tr>
                        <td colSpan={11} className="border-none">
                          <Row>
                            <Col span={24}>
                              <Typography.Title className="dfhcd-heading" style={{ textAlign: "center" }} level={4} type="secondary">
                                O I L &nbsp; & &nbsp; F U E L &nbsp; &nbsp; U P L I F T &nbsp; R E P O R T
                              </Typography.Title>
                            </Col>
                          </Row>
                        </td>
                      </tr>
                      <tr className="border-bold">
                        <th>Date</th>
                        <th>ATL No</th>
                        <th>Air Time</th>
                        <th>Station</th>
                        <th>#1 Hyd System <br />(Gal/Qts)</th>
                        <th>#2 Hyd System <br />(Gal/Qts)</th>
                        <th>#3 Hyd System <br />(Gal/Qts)</th>
                        <th>#1 Engine Oil <br />(Gal/Qts)</th>
                        <th>#2 Engine Oil <br />(Gal/Qts)</th>
                        <th>APU Oil <br />(Gal/Qts)</th>
                        <th>Fuel Uplift <br />(Kg/lb)</th>
                        <th>Fuel Consumption</th>
                      </tr>
                    </thead>
                    <tbody style={{ whiteSpace: 'nowrap' }}>
                      {
                        printData.length > 0
                        && printData.map((oilRecord: any, index: number) => (
                          <tr key={index} className="border-bold">
                            <td>{DateFormat(oilRecord.date)}</td>
                            <td>{oilRecord.pageNo}{oilRecord.alphabet}</td>
                            <td>{formatTimeValue(oilRecord.airTime)}</td>
                            <td>{oilRecord.fromAirport}</td>
                            <td>{oilRecord.hydOil1}</td>
                            <td>{oilRecord.hydOil2}</td>
                            <td>{oilRecord.hydOil3}</td>
                            <td>{oilRecord.engineOil1}</td>
                            <td>{oilRecord.engineOil2}</td>
                            <td>{oilRecord.apuOil}</td>
                            <td>{oilRecord?.upliftOilRecord}</td>
                            <td>{oilRecord?.fuelConsumption}</td>
                          </tr>))
                      }
                    </tbody>
                  </ARMReportTable>
                </ResponsiveTable>
              </Row>
            </ReportContainer>
          </Col>
        </Row>
        {data?.length > 0 && (
          <Row justify="center" className="pagination first">
            <Col style={{ marginTop: 10 }}>
              <Pagination
                  current={currentPage}
                  showSizeChanger={false}
                  onChange={setCurrentPage}
                  total={totalPages * 10} />
            </Col>
          </Row>
        )}
      </ARMCard>
      </Permission>
    </CommonLayout>
  )
}

export function OilUpliftReportRow(oilRecord: any) {
  return (
    <tr>
      <td>{oilRecord.date}</td>
      <td>{oilRecord.pageNo}{oilRecord.alphabet}</td>
      <td>{formatTimeValue(oilRecord.airTime)}</td>
      <td>{oilRecord.fromAirport}</td>
      <td>{oilRecord.hydOil1}</td>
      <td>{oilRecord.hydOil2}</td>
      <td>{oilRecord.hydOil3}</td>
      <td>{oilRecord.engineOil1}</td>
      <td>{oilRecord.engineOil2}</td>
      <td>{oilRecord.apuOil}</td>
      <td>{oilRecord?.upliftOilRecord}</td>
      <td>{oilRecord?.fuelConsumption}</td>
    </tr>
  )
}
