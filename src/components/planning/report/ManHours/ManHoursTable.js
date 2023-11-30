import React from 'react';
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import { Breadcrumb, Col, Form, Pagination, Row, Select, Space, Table, Typography } from "antd";
import { Link } from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import ReactToPrint from "react-to-print";
import SuccessButton from "../../../common/buttons/SuccessButton";
import { FilterOutlined, PrinterOutlined, RollbackOutlined } from "@ant-design/icons";
import ARMButton from "../../../common/buttons/ARMButton";
import CompanyLogo from "../CompanyLogo";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import { ARMReportTable } from "../ARMReportTable";
import CommonLayout from "../../../layout/CommonLayout";
import { useManHours } from "./ManHour";
import styled from "styled-components";
import moment from 'moment';
import {pageSerialNo} from "../Common";
import Permission from '../../../auth/Permission';


const MANHOUR = styled.div`


  .page-of-report {
    visibility: hidden;
  }

  .signatureContent {
    display: none;
  }

  .second {
    display: none;
  }

  .totalPrint2 {
    margin-right: 310px;
  }

  .totalPrint {
    margin-right: 80px;
  }
  .border-none{
    border: none;
  }
`;

const ManHoursTable = () => {


  const {

    form,
    manHourForm,
    dataSource2,
    components,
    columns,
    handleSubmit,
    getAllAcCheck,
    acCheckIndexs,
    resetFilter,
    reportRef,
    allAircrafts,
    TITLE,
    printStyle,
    data,
    submitting,
    currentPage,
    totalPages,
    setCurrentPage,
    handlePrint,
    data3,
    fetchPrintData
  } = useManHours()




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
      <Permission permission="PLANNING_CHECK_MAN_HOURS_SEARCH" showFallback>
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
          initialValues={{ acCheckIndexId: null, aircraftId: null,size:10 }}
          onFinish={handleSubmit}
        >
          <Row gutter={20}>

            <Col xs={24} md={4}>
              <Form.Item
                name="aircraftId"
                rules={[
                  {
                    required: true,
                    message: "Aircraft is required ",
                  },
                ]}
              >

                <Select
                  placeholder="Select Aircraft"
                  onChange={getAllAcCheck}
                >
                  {
                    allAircrafts?.map((aircraft) => <Select.Option value={aircraft?.aircraftId}
                      key={aircraft?.aircraftId}>{aircraft?.aircraftName}</Select.Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col md={20}></Col>
            <Col xs={24} md={4}>
              <Form.Item
                name="acCheckIndexId"
                rules={[
                  {
                    required: true,
                    message: "AC Check Index is required ",
                  },
                ]}
              >

                <Select
                  placeholder="Select AC Check Index"
                >
                  {
                    acCheckIndexs.map((acCheckIndex) =>
                      <Select.Option value={acCheckIndex?.acCheckIndexId} key={acCheckIndex?.acCheckIndexId}>
                        {acCheckIndex?.aircraftChecksName}</Select.Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col md={20}></Col>
            <Col xs={24} md={4}>
              <Form.Item name="size">
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

        <MANHOUR ref={reportRef}>
          <header className='customManHourHeader first'>
            <Row className="header-space">

              <Col span={24}>
                <Row justify="space-between">
                  <Col>
                    <CompanyLogo />
                  </Col>
                  <Col style={{ fontSize: "10px" }}>
                    <Typography.Text>Form: CAME-019</Typography.Text>
                    <br />
                    <Typography.Text>ISSUE INITIAL</Typography.Text>
                    <br />
                    <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row justify="center">
                  <Col span={24} style={{
                    textAlign: 'center'
                  }}>

                    <Typography.Title style={{ marginTop: "-40px", marginBottom: '0px' }} level={4}>US BANGLA
                      AIRLINES</Typography.Title>
                    <Typography.Title style={{ margin: '0px' }} level={5}>{data?.aircraftChecksName}</Typography.Title>
                    <Typography.Title style={{ marginTop: '0', textTransform: "uppercase", fontWeight: "bold" }}
                      level={3}>{TITLE}</Typography.Title>
                    <Typography.Text>AIRCRAFT MAINTENANCE PROGRAM (AMP) APPROVED BY CAAB VIDE:
                      30.31.0000.113.39.063.19-204
                      DATED {moment('01-06-2022','DD-MM-YYYY').format('DD-MMM-YYYY')}</Typography.Text>
                  </Col>
                </Row>
              </Col>
            </Row>
            <ResponsiveTable>
              <Row justify="space-between" style={{ fontWeight: "bold" }}>
                <Col>A/C REGN: {data?.aircraftName}</Col>
                <Col>A/C MSN: {data?.airframeSerial}</Col>
                <Col>W.O.: {data?.woNo}</Col>
                <Col style={{ marginRight: "50px" }}>DATE: {data?.date && moment(`${data?.date}`, 'YYYY-MM-DD').format('DD-MMM-YYYY')}</Col>
              </Row>
            </ResponsiveTable>
          </header>
          <div>
            <Form form={manHourForm} component={false}>
              <Row className="table-responsive" style={{ marginTop: '20px' }}>
                <ResponsiveTable className='first'>
                  <ARMReportTable>
                    <Table
                      components={components}
                      bordered
                      dataSource={dataSource2}
                      columns={columns}
                      rowClassName='editable-row'
                      pagination={false}
                    />
                  </ARMReportTable>
                </ResponsiveTable>

                <ResponsiveTable className='second'>
                  <ARMReportTable className="hrTable">
                    <table className="report-container" style={{ width: "99%" }} >
                      <thead className="report-header">
                        <tr>
                          <td className="report-header-cell border-none" colSpan={11}>
                            <div className="header-info">
                              <Row className="header-space">

                                <Col span={24}>
                                  <Row justify="space-between">
                                    <Col>
                                      <CompanyLogo />
                                    </Col>
                                    <Col style={{ fontSize: "10px" }}>
                                      <Typography.Text>Form: CAME-019</Typography.Text>
                                      <br />
                                      <Typography.Text>ISSUE INITIAL</Typography.Text>
                                      <br />
                                      <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                                    </Col>
                                  </Row>
                                </Col>

                                <Col span={24}>
                                  <Row justify="center">
                                    <Col span={24} style={{
                                      textAlign: 'center'
                                    }}>

                                      <Typography.Title style={{ marginTop: "-40px", marginBottom: '0px' }} level={4}>US BANGLA
                                        AIRLINES</Typography.Title>
                                      <Typography.Title style={{ margin: '0px' }} level={5}>{data?.aircraftChecksName}</Typography.Title>
                                      <Typography.Title style={{ marginTop: '0', textTransform: "uppercase", fontWeight: "bold" }}
                                        level={3}>{TITLE}</Typography.Title>
                                      <Typography.Text>AIRCRAFT MAINTENANCE PROGRAM (AMP) APPROVED BY CAAB VIDE:
                                        30.31.0000.113.39.063.19-204
                                        DATED 01-06-2022</Typography.Text>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row justify="space-between" style={{ fontWeight: "bold" }}>
                                <Col>A/C REGN: {data3?.aircraftName}</Col>
                                <Col>A/C MSN: {data3?.airframeSerial}</Col>
                                <Col>W.O.: {data3?.woNo}</Col>
                                <Col style={{ marginRight: "50px" }}>DATE: {data3?.date && moment(`${data3?.date}`, 'YYYY-MM-DD').format('DD/MM/YYYY')}</Col>
                              </Row>
                            </div>
                          </td>
                        </tr>
                      </thead>
                      <thead className='manTable'>
                        <tr>
                          <th>S/N</th>
                          <th>AMM/TASK CARD REFERENCE:</th>
                          <th>AMP REFERENCE:</th>
                          <th>TASK DESCRIPTION</th>
                          <th>TASK TYPE</th>
                          <th>TRADE</th>
                          <th>MPD HOURS</th>
                          <th>PROPOSED MAN-HOUR</th>
                          <th>NO. OF MAN</th>
                          <th>ELAPSED TIME</th>
                          <th>ACTUAL MH BY 145</th>
                        </tr>

                      </thead>

                      <tbody style={{ whiteSpace: 'nowrap' }}>

                        {
                          data3?.manHourTaskViewModels?.map((d, index) => (

                            <tr key={index} className="amp-table amp-data-table"
                              style={{ width: '100%' }}>
                              <td>{pageSerialNo(currentPage, index + 1)}</td>
                              <td className='newLineInRow'>{d.jobProcedure}</td>
                              <td>{d.taskNo}</td>
                              <td className='newLineInRow'>{d.taskDescriptionViewModel?.taskDescription} {d.taskDescriptionViewModel?.taskDescription && <br />}
                                {d.taskDescriptionViewModel?.partNo && 'Part No: ' + d.taskDescriptionViewModel?.partNo} {d.taskDescriptionViewModel?.partNo && <br />}
                                {d.taskDescriptionViewModel?.serialNo && 'Serial No: ' + d.taskDescriptionViewModel?.serialNo}
                              </td>
                              <td>
                                {(d.taskType)}

                              </td>
                              <td>{d.trade}</td>
                              <td>{d.manHours}</td>
                              <td>{d.proposedManHours}</td>
                              <td>{d.noOfMan}</td>
                              <td>{d.elapsedTime}</td>
                              <td>{d.actualManHour}</td>
                            </tr>

                          ))
                        }
                        <tr>
                          <td colSpan={5} style={{ border: 'none' }}></td>
                          <td style={{ border: 'none', fontWeight: 'bold' }}>Total</td>
                          <td style={{ border: 'none', fontWeight: 'bold' }}>{data3?.totalManHour}</td>
                          <td style={{ border: 'none', fontWeight: 'bold' }}>{data3?.totalProposedManHour}</td>
                        </tr>

                      </tbody>
                    </table>
                  </ARMReportTable>

                  <br /> <br />
                  <div className='signatureContent'>
                    <div style={{ width: "60%", display: "flex", justifyContent: "space-between" }}>
                      <h2>PROPOSED MAN-HOUR (B1):</h2>
                      <h2>{data3?.totalB1ProposedManHour ? data3?.totalB1ProposedManHour + ' MH' : ''} ( {data3?.totalB1Task ? data3?.totalB1Task + ' TASKS' : ''} )</h2>
                      <h2>SIGNATURE</h2>
                    </div>
                    <div style={{ width: "85%", display: "flex", justifyContent: "space-between" }}>
                      <h2>PROPOSED MAN-HOUR (B2):</h2>
                      <h2
                        style={{ marginLeft: "60px" }}>{data3?.totalB2ProposedManHour ? data3?.totalB2ProposedManHour + ' MH' : ''} ( {data3?.totalB2Task ? data3?.totalB2Task + ' TASKS' : ''} )</h2>
                      <h2 style={{ visibility: "hidden" }}>SIGNATURE</h2>
                      <h2>_____________________________________</h2>
                    </div>

                    <div style={{ width: "60%", display: "flex", justifyContent: "space-between" }}>
                      <h2>ACTUAL MAN-HOUR (B1):</h2>
                      <h2>SIGNATURE</h2>
                    </div>
                    <div style={{ width: "85%", display: "flex", justifyContent: "space-between" }}>
                      <h2>ACTUAL MAN-HOUR (B2):</h2>
                      <h2 style={{ marginTop: "-20px" }}>____________________________________________</h2>

                      <h2 style={{ marginTop: "-20px" }}>_____________________________________</h2>
                    </div>
                    <div>
                      <h2 style={{
                        marginLeft: "26%",
                        marginTop: "-25px"
                      }}>____________________________________________</h2>
                    </div>
                  </div>
                </ResponsiveTable>
              </Row>
            </Form>
          </div>
          {data?.pageData?.model?.length > 0 && (
            <Row justify="center" className="pagination">
              <Col style={{ marginTop: 10 }}>
                <Pagination currentPage={currentPage} onChange={setCurrentPage} total={totalPages * 10} />
              </Col>
            </Row>
          )}

        </MANHOUR>

      </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default ManHoursTable;
