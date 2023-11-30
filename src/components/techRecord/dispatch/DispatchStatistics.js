import {Breadcrumb, Col, DatePicker, Form, Row, Select, Space, Typography} from "antd";
import React, {createRef, useCallback, useEffect, useState} from "react";
import {useBoolean} from "react-use";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
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
import {Column, DualAxes} from "@ant-design/plots";
import styled from "styled-components";
import {PercentageFormat} from "../../planning/report/Common";


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

const DispatchStatisticsList = styled.div`
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


const DispatchStatistics = () => {
    const [form] = Form.useForm();
    const reportRef = createRef();
    const [reliabilityData, setReliabilityData] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const [submitting, toggleSubmitting] = useBoolean(false);
    const aircraftModelId = Form.useWatch("aircraftModelId", form);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [aircraftModelName, setAircraftModelName] = useState();
    const [aircraftModel, setAircraftModel] = useState([]);
    const [dispatchStatistics, setDispatchStatistics] = useState([]);

    const getAllAircraftModel = async () => {
        const {data} =
            await AircraftModelFamilyService.getAllAircraftModelFamily();
        setAircraftModel(data.model);
    };

    useEffect(() => {
        (async () => {
            await getAllAircraftModel();
        })();
    }, []);

    useEffect(() => {
        if (!aircraftModelId) {
            return;
        }
        for (let i = 0; i < aircraftModel?.length; i++) {
            if (aircraftModelId === aircraftModel[i].id) {
                setAircraftModelName(aircraftModel[i].aircraftModelName);
                break;
            }
        }
    }, [aircraftModelId]);

    const handleSubmit = useCallback(
        async (values) => {
            try {
                const [fromDate, toDate] = values.dateRange || "";

                setStartDate(moment(fromDate).format("MMM-YYYY"));
                setEndDate(moment(toDate).format("MMM-YYYY"));
                const lastDate = moment(toDate).endOf("month");
                const customValues = {
                    aircraftModelId: values.aircraftModelId,
                    fromDate: DateTimeConverter.momentDateToString(fromDate) || null,
                    toDate: DateTimeConverter.momentDateToString(lastDate) || null,
                };
                const {data} = await API.post(`dispatch-report/dispatch-stat-report`, customValues);
                setDispatchStatistics(data);

                let reliabilityArray = [];
                let scheduleArray = []

                data?.forEach((a) => {
                    reliabilityArray.push({
                        month: moment().month(a.month - 1).format("MMM") + "-" + a.year,
                        value: a.dispatchReliability ? a.dispatchReliability : null,
                    });
                });

                data?.forEach((a) => {
                    scheduleArray.push({
                        month: moment().month(a.month - 1).format("MMM") + "-" + a.year,
                        value: a.scheduleCompletionRate ? a.scheduleCompletionRate : null,
                    });
                });
                setReliabilityData(reliabilityArray);
                setScheduleData(scheduleArray);
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
        setDispatchStatistics([]);
        setReliabilityData([]);
        setScheduleData([]);
        setAircraftModelName([]);
    };

    const configReliabilityData = {
        data: reliabilityData,
        xField: "month",
        yField: "value",
        color: "#C3D79B",
        label: {
            position: "middle",
            content: function content(item) {
                return "".concat(item.value?.toFixed(2), "%");
            },
            style: {
                fill: "#FFFFF",
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
    };

    const configScheduleData = {
        data: scheduleData,
        xField: "month",
        yField: "value",
        color: "#8DB5E3",
        label: {
            position: "middle",
            content: function content(item) {
                return "".concat(item.value?.toFixed(2), "%");
            },
            style: {
                fill: "#FFFFF",
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
    };

    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
    const firstDay = new Date(now.getFullYear() - 1, now.getMonth() + 9, 1);

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/reliability">
                            <ProfileOutlined/> &nbsp;Reliability
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Dispatch Statistics</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

            <ARMCard
                title={
                    <Row justify="space-between">
                        <Col>
                            Dispatch Statistics
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
                        aircraftModelId: null,
                        dateRange: [moment(firstDay, 'DD-MM-YYYY'), moment(lastDay, 'DD-MM-YYYY')]
                    }}
                >
                    <Row gutter={20}>
                        <Col xs={24} md={6}>
                            <Form.Item
                                name="aircraftModelId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Aircraft model is required ",
                                    },
                                ]}
                            >
                                <Select placeholder="Select Aircraft Model">
                                    {aircraftModel?.map((aircraftModel) => (
                                        <Select.Option
                                            value={aircraftModel.id}
                                            key={aircraftModel.id}
                                        >
                                            {aircraftModel.aircraftModelName}
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

                <DispatchStatisticsList ref={reportRef}>
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
                            <h2 style={{marginTop: '10px'}}>DISPATCH STATISTICS</h2>
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
                  {aircraftModelName}
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
                            <table className="report-container" style={{width: "100%"}}>
                                <thead>
                                <tr className="bulletin-row">
                                    <th>MONTH</th>
                                    <th>DELAYS = {">"} 15 MIN</th>
                                    <th>INITIAL CANCELLATION</th>
                                    <th>TOTAL CANCELLATION</th>
                                    <th>
                                        SCHEDULED DEP
                                    </th>
                                    <th>
                                        DISPATCH RELIABILTY (%)
                                    </th>
                                    <th>
                                        SCHEDULE COMPLETION RATE (%)
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {dispatchStatistics?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{moment().month(item?.month - 1).format("MMM")}-{item?.year}</td>
                                        <td>{item?.delay}</td>
                                        <td>{item?.initialCancellation}</td>
                                        <td>{item?.totalCancellation}</td>
                                        <td>{item?.scheduledDep}</td>
                                        <td>{PercentageFormat(item?.dispatchReliability)}</td>
                                        <td>{PercentageFormat(item?.scheduleCompletionRate)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </ARMReportTable>
                    </ResponsiveTable>
                    <br/>
                    <table style={{width: "100%", pageBreakBefore: 'always'}}>
                        {dispatchStatistics.length > 0 &&
                            <>

                                <Row style={{marginTop: "50px"}}>
                                    <Col span={24}>
                                        <p className="firstGraph" style={{textAlign: "center"}}>
                                            DISPATCH RELIABILITY (%)
                                        </p>

                                        <h3 className="none">empty</h3>
                                        <Column style={{height: "270px"}} {...configReliabilityData} />
                                    </Col>
                                </Row>
                                <br/>

                                <Row style={{marginTop: "50px"}}>
                                    <Col span={18} offset={3}>
                                        <h3 className="none">empty</h3>
                                        <p style={{textAlign: "center"}} className="secondGraph">
                                            SCHEDULE COMPLETION RATE (%)
                                        </p>


                                        <h3 className="none">empty</h3>
                                        <Column style={{height: "320px"}} {...configScheduleData} />
                                    </Col>
                                </Row>
                            </>
                        }
                    </table>
                </DispatchStatisticsList>
            </ARMCard>
        </CommonLayout>
    );
};

export default DispatchStatistics;