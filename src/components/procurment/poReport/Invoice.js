import React, { createRef, useCallback, useEffect, useState } from "react";
import { Badge, Breadcrumb, Col, DatePicker, Form, Pagination, Row, Select, Space, Typography,Input, Divider } from "antd";
import ARMTable from "../../common/ARMTable";
import CommonLayout from "../../layout/CommonLayout";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import { Link } from "react-router-dom";
import { FilterOutlined, PrinterOutlined, RollbackOutlined } from "@ant-design/icons";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ResponsiveTable from "../../common/ResposnsiveTable";
import { useAircrafts } from "../../../lib/hooks/planning/aircrafts";
import API from "../../../service/Api";
import { useBoolean } from "react-use";
import { DATE_FORMATTER } from "../../../lib/constants/date";
import SuccessButton from "../../common/buttons/SuccessButton";
import ReactToPrint from "react-to-print";
import logo from "../../images/us-bangla-logo.png";
import divider from "../../images/single_line.png";
import moment from "moment";
import { formatTimeValue } from "../../../lib/common/presentation";
const { TextArea } = Input;
const termsandCondition="1. Original Airworthiness Certificate  FAAB130-3/EASA-1 must be accompanied with the item\n"+
"2. Send Signed Commercial Main Invoice Packing list & certificate of Origin along with the item.\n"+
"3. Our nominated forwarder will receive the goods from your delivery point\n"+
"4. Payment: As Agreed\n"+
"5. Warranty: As per quotation\n"+
"Thank you for your cooperation";

const val1= "Cohongqing Longshine Import and Export Co. Litd"
const val2= "Add: 15/Fl , No 65 JIANXIN BEI ROAD , JIANG BEI DISTRIT < CHONGQING< CHINA"
const val3= "Tel : 86-23-67919280"

const initialState = {
  dailyHrsReportAircraftModel: {
    airFrameTotalTime: "",
    airframeTotalCycle: "",
    bdTotalCycle: "",
    bdTotalTime: "",
    acheckTimeRemain: "",
  },


  dataModelList: [],

  total: {
    apuOil: 0,
    engineOil1: 0,
    engineOil2: 0,
    grandTotalAirTime: 0,
    grandTotalLanding: 0,
    noOfLanding: 0,
    totalAirTime: 0,
  },
};

const printStyle = `
	.table {
		font-size: 10pt;
	}
	.dfhcd-heading{
		font-size: 13px !important;
		text-align: center !important;
	}
  .table{
    font-size: 10px !important;
  }
  .table thead tr th{
    padding: 0 !important;
    height: 25px !important;
    background-color: #C0C0C0 !important;
    color: #A53C01 !important;
  }
	.table td{
		width: 6.25% !important;
    height: 25px !important;
	}
  .dfhc-titles{
    font-size: 10px !important;
    text-align: center !important;
  }
  .table th,
  .table thead tr td,
  .table tbody tr td{
    border-width: .4px !important;
    border-style: solid !important;
    border-color: #000 !important;
  }
  .aircraft-titles{
    background-color: #FFFF00 !important;
    padding: 0 40px !important;
  }
  .pagination{
    display: none !important;
  }
`;

export default function DailyFlyingHoursAndCycles() {
  const [form] = Form.useForm();
  const { aircrafts } = useAircrafts();
  const [submitting, toggleSubmitting] = useBoolean(false);
  const [data, setData] = useState(initialState);
  const reportRef = createRef();
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  let fixedTableRow = 20;
  let dataTableRow = data.pageData?.model?.length;
  let remainingTableRow = fixedTableRow - dataTableRow;
  if (data.pageData?.model?.length > 0) {
    for (let i = 0; i < remainingTableRow; i++) {
      data.pageData?.model?.push("");
    }
  }

  const resetFilter = () => {
    form.resetFields();
    setData({ ...initialState });
  };

  const TITLE = "Purchase Order";

  const handleSubmit = useCallback(
    async (values) => {
      try {
        toggleSubmitting();
        const { data } = await API.post(`aircraft-maintenance-log/daily-flying-hrs?page=${currentPage}`, {
          ...values,
          date: values.date.format(DATE_FORMATTER),
        });
        setData({ ...data });
        setCurrentPage(data?.pageData?.currentPage);
        setTotalPages(data?.pageData?.totalPages);
      } catch (e) {
      } finally {
        toggleSubmitting();
      }
    },
    [currentPage, toggleSubmitting]
  );

  useEffect(() => {
    (async () => {
      await handleSubmit(form.getFieldsValue(true));
    })();
  }, [handleSubmit, form]);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/material-management">
              <i className="fas fa-chart-line" /> &nbsp;Material Management
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{TITLE}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
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
        <Form form={form} name="filter-form" initialValues={{ aircraftId: "", date: "" }} onFinish={handleSubmit}>
          <Row gutter={20}>
            <Col xs={24} md={6}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Required",
                  },
                ]}
                name="aircraftId"
              >
                <Select placeholder="Select Model Type">
                  <Select.Option value="">---Select---</Select.Option>
                  {aircrafts.map((type) => (
                    <Select.Option value={type.id} key={type.id}>
                      {type.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Required",
                  },
                ]}
                name="date"
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item>
                <Space>
                  <ARMButton loading={submitting} size="middle" type="primary" htmlType="submit">
                    <FilterOutlined name="filter" /> Filter
                  </ARMButton>
                  <ARMButton size="middle" type="primary" onClick={resetFilter}>
                    <RollbackOutlined name="reset" /> Reset
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Row ref={reportRef}>
          <Col span={24}>

           


            <Row  className="table-responsive">
              <ResponsiveTable>
                <ARMTable  style={{padding: "10px"}} className="table">
                  <tbody>
                  <tr >
                   <td colSpan={2} >{val1}</td>
                   </tr>
                  <tr >
                   <td colSpan={2}>{val2}</td>
                 </tr>
                  <tr >
                   <td colSpan={2}>{val3}</td>
                  </tr>
                  <tr  >
                   <td colSpan={2}> <Select showArrow ={false} bordered={null} defaultValue={1}>
             
                    <Select.Option value={1} key={1}>
                      {"FROFORMA INVOICE"}
                    </Select.Option>
                    <Select.Option value={2} key={2}>
                      {"INVOICE"}
                    </Select.Option>
             
                </Select>
                </td>
                  </tr>


                 <tr>
                   <td rowSpan={2}>{val1}</td>
                   <td>{val1}</td>
                 </tr>
                 <tr>
                   <td>{val1}</td>
                 </tr>
                 <tr>
                  <td>{val1}</td>
                  <td>{val1}</td>
                 </tr>
                 <tr>
                  <td>{val1}</td>
                  <td>{val1}</td>
                 </tr>
                 <tr>
                  <td>{val1}</td>
                  <td>{val1}</td>
                 </tr>
                 <tr>
                  <td>{val1}</td>
                  <td>{val1}</td>
                 </tr>
                 <tr>
                  <td>{val1}</td>
                  <td>{val1}</td>
                 </tr>
                 <tr >
                   <td colSpan={2} >{val1}</td>
                   </tr>
                  </tbody>
                </ARMTable>
              </ResponsiveTable>
            </Row>
            <Row className="table-responsive" style={{ marginTop: "0px" }}>
              <ResponsiveTable>
                <ARMTable className="table">
                  <thead>
                    <tr style={{ borderTop: "2px solid #808080", borderBottom: "2px solid #808080" }}>
                      <th>Item</th>
                      <th>Description</th>
                      <th>Part No</th>
                      <th>Quantity(Piece)</th>
                      <th>Unit Price</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                  <td>1</td>
                  <td>ACTUATOR ETR FUEL CONTROL ORIGNAL BOSCH</td>
                  <td>US$42.00</td>
                  <td>3</td>
                  <td>US$42.00</td>
                  <td>US$ 126</td>
                 </tr>
                 <tr>
                  <td colSpan={5}>Total Cost in USD</td>
                  <td>US$126.00</td>
                  
                 </tr>
                 <tr>
                  <td colSpan={5}>Total Cost in RMB</td>
                  <td>Y843.00</td>
                  
                 </tr>
                 <tr>
                  <td style={{ textAlign:"initial", paddingLeft:"3px" }} colSpan={6}>Say  in RMB Eight hundrad forty three only</td>
                 </tr>
                  </tbody>
                </ARMTable>
              </ResponsiveTable>
            </Row>
            <Row className="table-responsive" style={{ marginTop: "0px" }}>
              <ResponsiveTable>
                <ARMTable className="table">
                  <thead>
                    <tr style={{ borderTop: "0px solid #808080", borderBottom: "0px solid #808080" }}>
                      <th style={{ textAlign:"left" , paddingLeft:"3px"}}>Terms And condition</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                  <td><Input bordered={null}></Input></td>
                 </tr>
                 <tr>
                 <td><Input bordered={null}></Input></td>
                 </tr>
                 <tr>
                 <td><Input bordered={null}></Input></td>
                 </tr>
                 <tr>
                 <td><Input bordered={null}></Input></td>
                 </tr>
                 <tr>
                 <td><Input bordered={null}></Input></td>
                 </tr>
                  </tbody>
                </ARMTable>
              </ResponsiveTable>
            </Row>
            <br></br>
            <br></br>
  
           
            <br /> <br /> <br /> <br />
            <Row justify="space-between" style={{ fontSize: "10px" }}>
              <Col>
                <Typography.Text>Prepared By: </Typography.Text>
              </Col>
              <Col>Approved by :____________________</Col>
            </Row>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
}
