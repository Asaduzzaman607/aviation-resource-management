import {
  FilterOutlined,
  PrinterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  DatePicker,
  Form,
  Pagination,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import ReactToPrint from "react-to-print";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import SuccessButton from "../../../common/buttons/SuccessButton";
import CommonLayout from "../../../layout/CommonLayout";
import styled from "styled-components";
import { createRef, useEffect, useState } from "react";
import logo from "../../../../components/images/us-bangla-logo.png";
import { ARMReportTable } from "../ARMReportTable";
import AircraftBuildsService from "../../../../service/AircraftBuildsService";
import { notifyResponseError } from "../../../../lib/common/notifications";
import ARMButton from "../../../common/buttons/ARMButton";
import API from "../../../../service/Api";
import { CalculateTsnTsoTat, DateFormat, formatCycle, formatHour, pageSerialNo } from "../Common";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import CompanyLogo from "../CompanyLogo";
import { sleep } from "../../../../lib/common/helpers";
import { dateFormat } from "../AirframeAndApplianceADStatus";
import Permission from "../../../auth/Permission";
import AircraftService from "../../../../service/AircraftService";
import DateTimeConverter from "../../../../converters/DateTimeConverter";

const TITLE = "ENGINE AD STATUS";
const printStyle = `
*{
  margin: 0!important;
  padding: 0!important;
  font-size: 10px!important;
  overflow: visible!important;
  height : auto !important;
}
  .engine-data-table td{
     font-size: 8px !important;
     padding: 0 !important;
  }
  .engine-top-right-table{
     font-size: 9px !important;
     padding: 0 !important;
  }
  .engine-table-title{
     font-size: 10px !important;
     padding: 0 !important;
  }
  .engine-data-table td,
  .engine-table tr td{
    border-width: 1px !important;
   border-style: solid !important;
   border-color: #000 !important;
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
  .border-none{
    border: none!important;
  }
  thead.report-header {
      display:table-header-group!important;
  }
  @page{ size: landscape!important; }
`;
const ENGINE = styled.div`
  .text-right {
    text-align: right !important;
  }
  .engine-title {
    font-weight: bold;
    margin-left: 30%;
    margin-bottom: 0 !important;
    margin-top: -25px;
  }
  .border-none{
    border: none;
  }
  .none{
    visibility: hidden !important;
    border: none !important;
  }
  .second{
    display: none;
  }
  @page {
    size: landscape;
  }
`;


export default function EngineADStatus(effect, deps) {
  const reportRef = createRef();
  const [form] = Form.useForm();
  const [aircrafts, setAircrafts] = useState([]);
  const [aircraftId, setAircraftId] = useState();
  const [partId, setPartId] = useState();
  const [aircraftBuildId, setAircraftBuildId] = useState();
  const [serialNo, setSerialNo] = useState();
  const [serialId, setSerialId] = useState();
  const [position, setPosition] = useState();
  const [engines, setEngines] = useState([]);
  const [engineData, setEngineData] = useState({});
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [printData, setPrintData] = useState([])
  const [aircraftDeatils,setAircraftDetails]=useState();
  const [date, setDate] = useState("");

  const aircraftDetailsByAircraftId = async (aircraftId) => {
    try {
      const { data } = await API.get(
        `task-report/ad-report-title/${aircraftId}`
      );
      setAircraftDetails(data);
    } catch (er) {}
  };
  useEffect(() => {
    if (!aircraftId) {
      return;
    }
    (async () => {
      await aircraftDetailsByAircraftId(aircraftId);
    })();
  }, [aircraftId]);
  
  useEffect(() => {
    let modelName = '';
    if (!!aircraftId) {
      modelName = aircrafts.find(ac => ac.id === aircraftId)?.engineType;
    }
  
    setEngineData(prev => ({...prev, modelName: modelName}));
  }, [aircraftId, aircrafts]);
  

  const fetchData = async (values) => {
    let findData = engines.find(
      (l) => l.aircraftBuildId === values?.aircraftBuildId
    );
    const convertData = {
      aircraftId: values.aircraftId,
      serialId: findData.serialId,
      partId: findData.partId,
      date:date,
      isPageable: true
    };

    try {
      const { data } = await API.post(
        `task-report/engine-ad-report?page=${currentPage}&size=${values.size}`,
        convertData
      );
      setData(data.model);
      setCurrentPage(data?.currentPage);
      setTotalPages(data?.totalPages);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const fetchPrintData = async (values) => {
    let findData = engines.find(
      (l) => l.aircraftBuildId === aircraftBuildId
    );
    const convertData = {
      aircraftId: aircraftId,
      serialId: findData.serialId,
      partId: findData.partId,
      date:date,
      isPageable: false
    };
    try {
      const { data } = await API.post(
        `task-report/engine-ad-report?page=${currentPage}`,
        convertData
      );
      setPrintData(data.model)
      return sleep(1000);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const engineDetails = async () => {
    try {
      const { data } = await API.get(
        `aircraft-build/ad-engine-details?aircraftId=${aircraftId}&partId=${partId}&serialId=${serialId}${date ? `&date=${date}` : ''}`
      );
      setEngineData(data);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    if (!partId) {
      return;
    }
    (async () => {
      await engineDetails();
    })();
  }, [partId,date]);

  const getAllAircraft = async () => {
    try {
      const { data } = await AircraftService.getAllAircraft(true);
      setAircrafts(data.model);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    (async () => {
      await getAllAircraft();
    })();
  }, []);

  const getAllEngineByAircraftId = async (aircraftId) => {
    try {
      const { data } = await AircraftBuildsService.getAllEngineByAircraftId(
        aircraftId
      );
      setEngines(data);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    if (!aircraftId) {
      return;
    }
    (async () => {
      await getAllEngineByAircraftId(aircraftId);
    })();
  }, [aircraftId]);

  const getSerialNoAndPartId = (aircraftBuildId) => {
    let data = engines.find((l) => l.aircraftBuildId === aircraftBuildId);
    setSerialNo(data.serialNo);
    setSerialId(data.serialId);
    setPartId(data.partId);
    setPosition(data.position);
  };

  useEffect(() => {
    if (!aircraftBuildId) {
      return;
    }
    getSerialNoAndPartId(aircraftBuildId);
  }, [aircraftBuildId]);

  const onReset = () => {
    form.resetFields();
    setEngineData([])
    setData([])
  };

  useEffect(() => {
    if (currentPage > -1) {
      fetchData(form.getFieldsValue(true));
    }
  }, [currentPage]);

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
      <Permission permission="PLANNING_ENGINE_PROPELLER_LANDING_GEAR_ENGINE_AD_STATUS_SEARCH" showFallback>
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
                  <SuccessButton
                    type="primary"
                    icon={<PrinterOutlined />}
                    htmlType="button"
                  >
                    Print
                  </SuccessButton>
                )}
                onBeforeGetContent={fetchPrintData}
              />
            </Col>
          </Row>
        }
      >
        <Form form={form} name="filter-form" initialValues={{ size:10 }} onFinish={fetchData}>
          <Row gutter={20}>
            <Col xs={24} md={4}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "This field is Required",
                  },
                ]}
                name="aircraftId"
              >
                <Select placeholder="Select Aircraft" onChange={setAircraftId}>
                  {aircrafts.map((aircraft) => (
                    <Select.Option value={aircraft.id} key={aircraft.id}>
                      {aircraft.aircraftName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item
                name="aircraftBuildId"
                rules={[
                  {
                    required: true,
                    message: "This field is required",
                  },
                ]}
              >
                <Select
                  placeholder="Select Engine Position"
                  onChange={setAircraftBuildId}
                >
                  {engines?.map((item) => {
                    return (
                      <Select.Option
                        key={item.aircraftBuildId}
                        value={item.aircraftBuildId}
                      >
                        {item?.position}{" "}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <DatePicker format="YYYY-MM-DD" style={{width: "100%"}} onChange={(e)=> setDate(DateTimeConverter.momentDateToString(e))}/>
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
                  <ARMButton size="middle" type="primary" htmlType="submit">
                    <FilterOutlined name="filter" /> Filter
                  </ARMButton>
                  <ARMButton size="middle" type="primary" onClick={onReset}>
                    <RollbackOutlined name="reset" /> Reset
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <ENGINE ref={reportRef}>
          <Row className="first">
            <Col span={24}>
              <Row justify="space-between">
                <Col>
                  <img src={logo} alt="" width={110} />
                </Col>
                <Col
                  style={{
                    fontSize: "8px",
                    fontWeight: "bold",
                    marginRight: "80px",
                    marginBottom: "10px",
                  }}
                >
                  <Typography.Text>Form: CAME-044</Typography.Text> <br />
                  <Typography.Text>ISSUE: INITIAL</Typography.Text> <br />
                  <Typography.Text>DATE: 19-01-2022</Typography.Text>
                </Col>
              </Row>
            </Col>
          </Row>
          <Typography.Title className="engine-title first" level={5}>
            {TITLE}
          </Typography.Title>
          <ResponsiveTable className="first">
            <ARMReportTable className="engine-table">
              <tbody>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={4} className="none">
                    empty
                  </td>
                  <td colSpan={3} className="engine-table-title text-right">
                    ENGINE MODEL
                  </td>
                  <td className="engine-table-title" colSpan={2}>
                    {engineData?.modelName}
                  </td>
                  <td className="none">empty</td>
                  <td className="engine-top-right-table">DATE</td>
                  <td className="engine-top-right-table">
                    ENGINE <br /> TSN
                  </td>
                  <td className="engine-top-right-table">
                    ENGINE <br /> CSN
                  </td>
                  <td className="engine-top-right-table">
                    AIRCRAFT <br /> TAT
                  </td>
                  <td className="engine-top-right-table">
                    AIRCRAFT <br /> TAC
                  </td>
                  <td className="none">empty</td>
                  <td className="none">empty</td>
                  <td className="none">empty</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={4} className="none">
                    empty
                  </td>
                  <td className="engine-table-title text-right" colSpan={3}>
                    ENGINE MANUFACTURER
                  </td>
                  <td className="engine-table-title" colSpan={2}>
                    PRATT &amp; WHITNEY
                  </td>
                  <td className="none">empty</td>
                  <td className="engine-top-right-table">{dateFormat(engineData?.date)}</td>
                  <td className="engine-top-right-table">{CalculateTsnTsoTat(engineData?.tsn)}</td>
                  <td className="engine-top-right-table">{engineData?.csn}</td>
                  <td className="engine-top-right-table">{CalculateTsnTsoTat(engineData?.tat)}</td>
                  <td className="engine-top-right-table">{engineData?.tac}</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={4} className="none">
                    empty
                  </td>
                  <td className="engine-table-title text-right" colSpan={3}>
                    ENGINE SERIAL NO
                  </td>
                  <td className="engine-table-title" colSpan={2}>
                    {serialNo}
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={4} className="none">
                    empty
                  </td>
                  <td className="engine-table-title text-right" colSpan={3}>
                    AIRCRAFT REGN.
                  </td>
                  <td className="engine-table-title" colSpan={2}>
                    {engineData?.regNo}
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={4} className="none">
                    empty
                  </td>
                  <td className="engine-table-title text-right" colSpan={3}>
                    POSITION
                  </td>
                  <td className="engine-table-title" colSpan={2}>
                    {position}
                  </td>
                </tr>
                <tr className="engine-data-table" style={{ fontWeight: "bold" }}>
                  <td rowSpan={2}>
                    SL <br />
                    NO
                  </td>
                  <td rowSpan={2}>AD No.</td>
                  <td rowSpan={2}>SB No.</td>
                  <td rowSpan={2}>DESCRIPTION</td>
                  <td rowSpan={2}>
                    EFFECTIVE <br /> DATE
                  </td>
                  <td rowSpan={2}>THRESHOLD</td>
                  <td rowSpan={2}>APPLICABILITY</td>
                  <td rowSpan={2}>STATUS</td>
                  <td rowSpan={2}>INTERVAL</td>
                  <td colSpan={3}>LAST DONE</td>
                  <td colSpan={3}>NEXT DUE</td>
                  <td colSpan={3}>REMAINING</td>
                  <td rowSpan={2}>REMARKS</td>
                </tr>
                <tr className="engine-data-table" style={{ fontWeight: "bold" }}>
                  <td>FH</td>
                  <td>FC</td>
                  <td>DATE</td>
                  <td>FH</td>
                  <td>FC</td>
                  <td>DATE</td>
                  <td>FH</td>
                  <td>FC</td>
                  <td>DAY</td>
                </tr>
                {data?.map((item, index) => (
                  <tr className="engine-data-table">
                    <td>{pageSerialNo(currentPage, index + 1)}</td>
                    <td>{item?.adNo}</td>
                    <td  className='newLineInRow'>{item?.sbNo}</td>
                    <td  className='newLineInRow'>{item.description}</td>
                    <td>{DateFormat(item?.effectiveDate)}</td>
                    <td>
                      {formatHour(item?.thresholdHour, item?.isApuControl)}
                      <br />
                      {formatCycle(item?.thresholdCycle, item?.isApuControl)} <br />
                      {item?.thresholdDay ? item?.thresholdDay + "DY" : "N/A"}{" "}
                    </td>
                    <td>{item?.applicability == 0 ? "NO" : "YES"}</td>
                    <td>{item?.status}</td>
                    <td>
                      {formatHour(item?.intervalHour, item?.isApuControl)}
                      <br />
                      {formatCycle(item?.intervalCycle, item?.isApuControl)} <br />
                      {item?.intervalDay ? item?.intervalDay + "DY" : "N/A"}{" "}
                    </td>
                    <td>
                      {formatHour(item?.lastDoneFlyingHour, item?.isApuControl)}
                    </td>
                    <td>
                      {formatCycle(item?.lastDoneFlyingCycle, item?.isApuControl)}
                    </td>
                    <td>{DateFormat(item?.lastDoneDate)}</td>
                    <td>{formatHour(item?.nextDueFlyingHour, item?.isApuControl)}</td>
                    <td>{formatCycle(item?.nextDueFlyingCycle, item?.isApuControl)}</td>
                    <td>{DateFormat(item?.nextDueDate)}</td>
                    <td>
                      {formatHour(item?.remainingFlyingHour, item?.isApuControl)}
                    </td>
                    <td>
                      {formatCycle(item?.remainingFlyingCycle, item?.isApuControl)}
                    </td>
                    <td>{item?.remainingDay}</td>
                    <td>{item?.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </ARMReportTable>
          </ResponsiveTable>
          <ResponsiveTable className="second">
            <ARMReportTable>
              <thead className="report-header">
                <tr>
                  <td className="report-header-cell border-none" colSpan={19}>
                    <div className="header-info">
                      <Row justify="space-between">
                        <Col>
                          <CompanyLogo />
                        </Col>
                        <Col style={{ fontSize: "8px", textAlign: "left", lineHeight: "1" }}>
                          <Typography.Text>Form: CAME-027</Typography.Text>
                          <br />
                          <Typography.Text>ISSUE INITIAL</Typography.Text>
                          <br />
                          <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                        </Col>
                      </Row>
                      <Typography.Title className="engine-title" level={5}>
                        {TITLE}
                      </Typography.Title>
                    </div>
                  </td>
                </tr>
                <tr className="engine-data-table">
                  <td style={{ display: "none" }}>empty</td>
                </tr>

                <tr className="engine-data-table" style={{ fontWeight: "bold" }}>
                  <td colSpan={4} className="none">
                    empty
                  </td>
                  <td colSpan={3} className="engine-table-title text-right">
                    ENGINE MODEL
                  </td>
                  <td className="engine-table-title" colSpan={2}>
                    {engineData?.modelName}
                  </td>
                  <td className="none">empty</td>
                  <td className="engine-top-right-table">DATE</td>
                  <td className="engine-top-right-table">
                    ENGINE <br /> TSN
                  </td>
                  <td className="engine-top-right-table">
                    ENGINE <br /> CSN
                  </td>
                  <td className="engine-top-right-table">
                    AIRCRAFT <br /> TAT
                  </td>
                  <td className="engine-top-right-table">
                    AIRCRAFT <br /> TAC
                  </td>
                  <td className="none">empty</td>
                  <td className="none">empty</td>
                  <td className="none">empty</td>
                </tr>
                <tr className="engine-data-table" style={{ fontWeight: "bold" }}>
                  <td colSpan={4} className="none">
                    empty
                  </td>
                  <td className="engine-table-title text-right" colSpan={3}>
                    ENGINE MANUFACTURER
                  </td>
                  <td className="engine-table-title" colSpan={2}>
                    PRATT &amp; WHITNEY
                  </td>
                  <td className="none">empty</td>
                  <td className="engine-top-right-table">{dateFormat(engineData?.date)}</td>
                  <td className="engine-top-right-table">{CalculateTsnTsoTat(engineData?.tsn)}</td>
                  <td className="engine-top-right-table">{engineData?.csn}</td>
                  <td className="engine-top-right-table">{CalculateTsnTsoTat(engineData?.tat)}</td>
                  <td className="engine-top-right-table">{engineData?.tac}</td>
                </tr>
                <tr className="engine-data-table" style={{ fontWeight: "bold" }}>
                  <td colSpan={4} className="none">
                    empty
                  </td>
                  <td className="engine-table-title text-right" colSpan={3}>
                    ENGINE SERIAL NO
                  </td>
                  <td className="engine-table-title" colSpan={2}>
                    {serialNo}
                  </td>
                </tr>
                <tr className="engine-data-table" style={{ fontWeight: "bold" }}>
                  <td colSpan={4} className="none">
                    empty
                  </td>
                  <td className="engine-table-title text-right" colSpan={3}>
                    AIRCRAFT REGN.
                  </td>
                  <td className="engine-table-title" colSpan={2}>
                    {engineData?.regNo}
                  </td>
                </tr>
                <tr className="engine-data-table" style={{ fontWeight: "bold" }}>
                  <td colSpan={4} className="none">
                    empty
                  </td>
                  <td className="engine-table-title text-right" colSpan={3}>
                    POSITION
                  </td>
                  <td className="engine-table-title" colSpan={2}>
                    {position}
                  </td>
                </tr>
                <tr className="engine-data-table" style={{ fontWeight: "bold" }}>
                  <td rowSpan={2}>
                    SL <br />
                    NO
                  </td>
                  <td rowSpan={2}>AD No.</td>
                  <td rowSpan={2}>SB No.</td>
                  <td rowSpan={2}>DESCRIPTION</td>
                  <td rowSpan={2}>
                    EFFECTIVE <br /> DATE
                  </td>
                  <td rowSpan={2}>THRESHOLD</td>
                  <td rowSpan={2}>APPLICABILITY</td>
                  <td rowSpan={2}>STATUS</td>
                  <td rowSpan={2}>INTERVAL</td>
                  <td colSpan={3}>LAST DONE</td>
                  <td colSpan={3}>NEXT DUE</td>
                  <td colSpan={3}>REMAINING</td>
                  <td rowSpan={2}>REMARKS</td>
                </tr>
                <tr className="engine-data-table" style={{ fontWeight: "bold" }}>
                  <td>FH</td>
                  <td>FC</td>
                  <td>DATE</td>
                  <td>FH</td>
                  <td>FC</td>
                  <td>DATE</td>
                  <td>FH</td>
                  <td>FC</td>
                  <td>DAY</td>
                </tr>
              </thead>
              <tbody className="engine-table">
                {printData?.map((item, index) => (
                  <tr className="engine-data-table">
                    <td>{index + 1}</td>
                    <td>{item?.adNo}</td>
                    <td>{item?.sbNo}</td>
                    <td>{item.description}</td>
                    <td>{DateFormat(item?.effectiveDate)}</td>
                    <td>
                      {formatHour(item?.thresholdHour, item?.isApuControl)}
                      <br />
                      {formatCycle(item?.thresholdCycle, item?.isApuControl)} <br />
                      {item?.thresholdDay ? item?.thresholdDay + "DY" : "N/A"}{" "}
                    </td>
                    <td>{item?.applicability == 0 ? "NO" : "YES"}</td>
                    <td>{item?.status}</td>
                    <td>
                      {formatHour(item?.intervalHour, item?.isApuControl)}
                      <br />
                      {formatCycle(item?.intervalCycle, item?.isApuControl)} <br />
                      {item?.intervalDay ? item?.intervalDay + "DY" : "N/A"}{" "}
                    </td>
                    <td>
                      {formatHour(item?.lastDoneFlyingHour, item?.isApuControl)}
                    </td>
                    <td>
                      {formatCycle(item?.lastDoneFlyingCycle, item?.isApuControl)}
                    </td>
                    <td>{DateFormat(item?.lastDoneDate)}</td>
                    <td>{formatHour(item?.nextDueFlyingHour, item?.isApuControl)}</td>
                    <td>{formatCycle(item?.nextDueFlyingCycle, item?.isApuControl)}</td>
                    <td>{DateFormat(item?.nextDueDate)}</td>
                    <td>
                      {formatHour(item?.remainingFlyingHour, item?.isApuControl)}
                    </td>
                    <td>
                      {formatCycle(item?.remainingFlyingCycle, item?.isApuControl)}
                    </td>
                    <td>{item?.remainingDay}</td>
                    <td>{item?.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </ARMReportTable>
          </ResponsiveTable>
        </ENGINE>
        {data?.length > 0 && (
          <Row justify="center" className="pagination first">
            <Col style={{ marginTop: 10 }}>
              <Pagination
                currentPage={currentPage}
                onChange={setCurrentPage}
                total={totalPages * 10}
              />
            </Col>
          </Row>
        )}
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
