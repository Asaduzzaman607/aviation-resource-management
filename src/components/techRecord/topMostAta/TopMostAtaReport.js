import styled from "styled-components";
import {Breadcrumb, Col, DatePicker, Form, Row, Select, Space, Typography} from "antd";
import React, {createRef, useCallback, useEffect, useState} from "react";
import {useBoolean} from "react-use";
import moment from "moment/moment";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import API from "../../../service/Api";
import {notifyResponseError} from "../../../lib/common/notifications";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Link} from "react-router-dom";
import {FilterOutlined, PrinterOutlined, ProfileOutlined, RollbackOutlined} from "@ant-design/icons";
import ARMCard from "../../common/ARMCard";
import ReactToPrint from "react-to-print";
import SuccessButton from "../../common/buttons/SuccessButton";
import ARMButton from "../../common/buttons/ARMButton";
import logo from "../../images/us-bangla-logo.png";
import ResponsiveTable from "../../common/ResposnsiveTable";
import {ARMReportTable} from "../../planning/report/ARMReportTable";
import {useAircraftsList} from "../../../lib/hooks/planning/aircrafts";
import {useTranslation} from "react-i18next";
import {Column, Pie} from "@ant-design/plots";

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
    font-size: 8px !important;
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
.aircraftHeader{
    margin-left: 30px !important
}
  @page {
    size: landscape;
  }
`;

const TopMostAtaReportTable = styled.div`
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


const TopMostAtaReport = () => {
    const [form] = Form.useForm();
    const reportRef = createRef();
    const [submitting, toggleSubmitting] = useBoolean(false);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [topMostAta, setTopMostAta] = useState([]);
    const [data, setData] = useState([]);
    const {t} = useTranslation()
    const {allAircrafts, getAllAircrafts} = useAircraftsList()

    useEffect(() => {
        (async () => {
            await getAllAircrafts();
        })();
    }, [])

    const handleSubmit = useCallback(
        async (values) => {

            try {
                const [fromDate, toDate] = values.dateRange || "";
                setStartDate(moment(fromDate).format("MMM-YYYY"));
                setEndDate(moment(toDate).format("MMM-YYYY"));
                const lastDate = moment(toDate).endOf("month");
                const customValues = {
                    aircraftId: values.aircraftId,
                    fromDate: DateTimeConverter.momentDateToString(fromDate) || null,
                    toDate: DateTimeConverter.momentDateToString(lastDate) || null,
                    isPageble : false
                };
                const {data} = await API.post(`defect/top-ata-report`, customValues);
                setTopMostAta(data.model);
                let arr = [];

                data?.model?.forEach((a) => {
                    arr.push({
                        type: a?.system,
                        value:a.total || null,
                    });
                });
                setData(arr);
                toggleSubmitting();
            } catch (error) {
                notifyResponseError(error);
            } finally {
                toggleSubmitting(false);
            }
        },
        [toggleSubmitting]
    );

    const resetFilter = () => {
        form.resetFields();
        setTopMostAta([]);
    };

    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
    const firstDay = new Date(now.getFullYear() - 1, now.getMonth() + 9, 1);


    const config = {
        appendPadding: 10,
        data: data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.75,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: `{name} {value}`,
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
    };

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/reliability">
                            <ProfileOutlined/> &nbsp;Reliability
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Top ATA</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

            <ARMCard
                title={
                    <Row justify="space-between">
                        <Col>
                            Top ATA
                        </Col>
                        <Col>
                            <Space>
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
                                />
                            </Space>
                        </Col>
                    </Row>
                }
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    name="filter-form"
                    initialValues={{
                        aircraftId: null,
                        dateRange: [moment(firstDay, 'DD-MM-YYYY'), moment(lastDay, 'DD-MM-YYYY')],
                    }}
                >
                    <Row gutter={20}>
                        <Col xs={24} md={6}>
                            <Form.Item
                                name="aircraftId"
                                label={t("planning.Aircrafts.Aircraft")}
                                rules={[
                                    {
                                        required: false,
                                        message: "Please select Aircraft ",
                                    },
                                ]}
                            >
                                <Select placeholder={t("planning.Aircrafts.Select Aircraft")} allowClear>
                                    {allAircrafts?.map((item, index) => {
                                        return (
                                            <Select.Option key={index} value={item.aircraftId}>
                                                {item.aircraftName}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: "Date range is required",
                                    },
                                ]}
                                name="dateRange"
                            >
                                <DatePicker.RangePicker
                                    format="MM-YYYY"
                                    style={{width: "100%"}}
                                    picker="month"
                                    disabledDate={(current) => {
                                        return current && current.valueOf() > lastDay;
                                    }}
                                />
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

                <TopMostAtaReportTable ref={reportRef}>
                    <Row>
                        <Col span={24}>
                            <Row justify="space-between">
                                <Col>
                                    <img src={logo} alt="" width={110}/>
                                </Col>
                                <Col style={{fontSize: "12px", fontWeight: "bold"}}>
                                    TECHNICAL SERVICES SECTION
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <h2 style={{marginTop: '10px'}}>Top Most ATA </h2>
                        </Col>
                        <Col span={12}>
                            <Typography.Title level={5}>
                <span
                    className="aircraftHeader"
                    style={{
                        textDecoration: "underline",
                        textAlign: "center",
                        marginLeft: "30px",
                    }}
                >

                </span>{" "}
                                <br/>
                                <span style={{textAlign: "center"}}>
                  {" "}
                                    {startDate} {startDate ? "to" : null} {endDate}
                </span>
                            </Typography.Title>
                        </Col>
                    </Row>
                    <ResponsiveTable>
                        <ARMReportTable className="service-bulletin-table">
                            <thead>
                            <tr className="bulletin-row">
                                <th>ATA</th>
                                <th>SYSTEM</th>
                                <th>TOTAL MAREP</th>
                                <th>
                                    TOTAL PIREP
                                </th>
                                <th>
                                    TOTAL
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {topMostAta?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item?.ata}</td>
                                    <td>{item?.system}</td>
                                    <td>{item?.totalMarep}</td>
                                    <td>{item?.totalPirep}</td>
                                    <td>{item?.total}</td>
                                </tr>
                            ))}
                            </tbody>
                        </ARMReportTable>
                    </ResponsiveTable>
                    <br/>

                    {topMostAta?.length>0 &&
                        <Row style={{marginTop: "50px"}}>
                            <Col span={24}>
                                <h3 className="firstGraph" style={{textAlign: "center"}}>
                                    Top 10 ATA
                                </h3>
                                <h3 className="none">empty</h3>
                                <Pie style={{height: "270px"}} {...config} />
                            </Col>
                        </Row>}
                </TopMostAtaReportTable>
            </ARMCard>
        </CommonLayout>
    );
};

export default TopMostAtaReport;