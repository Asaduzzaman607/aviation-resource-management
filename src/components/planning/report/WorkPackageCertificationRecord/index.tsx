import { PrinterOutlined } from "@ant-design/icons";
import {Breadcrumb, Col, notification, Row, Spin, Typography} from "antd";
import {createRef, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import ReactToPrint from "react-to-print";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import SuccessButton from "../../../common/buttons/SuccessButton";
import logo from "../../../../components/images/us-bangla-logo.png";
import CommonLayout from "../../../layout/CommonLayout";
import styled from "styled-components";
import ARMTable from "../../../common/ARMTable";
import API from "../../../../service/Api";
import {getErrorMessage} from "../../../../lib/common/helpers";
import {formatTimeValue} from "../../../../lib/common/presentation";
import {ARMReportTable} from "../ARMReportTable";
import Permission from "../../../auth/Permission";
import { DateFormat } from "../Common";

const TITLE = "Work Package Certification Record";

const printStyle = `
@page {
size: portrait}
    
`;

const WorkReport = styled.div`
  .title {
    text-transform: uppercase;
    text-align: center;
  }
  .horizontal{
    border: 1px solid;
    margin: 3px 0!important;
  }
  .work-first-content-left,
  .work-first-content-right{
    float: left;
    border: 1px solid;
    height: 130px;
    padding: 5px;
  }
  .work-first-content-left h3,
  .work-first-content-right h3{
    font-weight: bold;
  }
  .work-first-content-left{
    width: 45%;
    border-right: none;
  }
  .work-first-content-right{
    width: 55%;
  }
  .work-second-content{
    width: 50%;
    margin: 0 auto;
  }
  .work-second-content h2{
    font-weight: bold;
    margin: 0;
    font-size: 18px;
  }
  .work-second-content-middle h2{
    margin-right: 15px;
  }
  .work-second-content-bottom h2{
    margin-right: 100px;
  }
  .work-second-content pre{
    margin: 0;
    padding: 0;
  }
  .work-second-content-middle{
    text-align: center;
    border-left: 1px solid;
    border-right: 1px solid;
  }
  .work-second-content-top,
  .work-second-content-bottom{
    border: 1px solid;
    text-align: center;
  }
  .work-table tr td{
    border-width: 1px solid!important;
    border-color: #000!important;
    border-style: solid!important;
    padding: 0;
    font-weight: bold;
  }
  .description{
    font-weight: bold;
  }
  .prepared h2, .checked h2, .prepared-by h2, .checked-by h2, .approved-by h2{
    margin: 0;
    font-weight: bold;
    font-size: 16px;
  }
  .prepared, .checked , .prepared-by, .checked-by{
    float: left;
    border: 1px solid #000;
    width: 50%;
    padding: 5px;
  }
   .prepared, .checked {
    border-bottom: none;
   }
  .prepared, .prepared-by{
    border-right: none;
  }
  .approved-by{
    border: 1px solid;
    text-align: center;
  }
  @page { size: portrait; }
`;
export interface Root {
  aircraftName: string
  aircraftModelName: string
  asOn: string
  asOfDate: string
  inputDate: string
  acHours: number
  acCycles: number
  dueAt: any
  woNo: any
  woDate: any
  checkNo: string
  jobCardsViewModels: JobCardsViewModel[]
}

export interface JobCardsViewModel {
  jobCardsId: number
  jobCategory: string
  total: number
  completed: number
  deferred: number
  withDrawn: number
  remark: string
}



export default function WorkPackageCertificationReport() {
  const reportRef = createRef<any>();
  const {id} = useParams()
  // @ts-ignore
  const [allWorkPackages, setAllWorkPackages] = useState<Root>([]);



  // @ts-ignore
  const workPackageId = parseInt(id)



  const getWorkPackageCerfificationData = async (workPackageId: number) => {

    if (!workPackageId) {
      return
    }
    try{
      const {data} = await API.post(`work-package/report-certificate`,workPackageId )
      setAllWorkPackages(data)
    }
    catch (error){
      notification["error"]({message: getErrorMessage(error)});
    }
  }


  useEffect(() => {
    if (!workPackageId) {
      return
    }
    (async () => {
      await getWorkPackageCerfificationData(workPackageId)
    })()
  }, [workPackageId])


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
      <Permission permission="PLANNING_CHECK_WORK_PACKAGE_CERTIFICATION_RECORD_SEARCH" showFallback>
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

        <WorkReport style={{padding: "0 40px"}} ref={reportRef}>
          <Row>
            <Col span={24}>
              <Row justify="space-between">
                <Col>
                  <img src={logo} alt="" width={110} />
                </Col>
                <Col style={{ fontSize: "14px", fontWeight: "bold" }}>
                  <Typography.Text>Form: CAME-024</Typography.Text> <br />
                  <Typography.Text>ISSUE: INITIAL</Typography.Text> <br />
                  <Typography.Text>DATE: 19-01-2022</Typography.Text>
                </Col>
              </Row>
            </Col>
          </Row>
          <Typography.Title className="title" level={3}>
            {TITLE}
          </Typography.Title>
          <hr className="horizontal" /><hr className="horizontal" />
          <br />
          <div>
            <div className="work-first-content-left">
              <pre>
                <h3>A/C Type     : &nbsp;{allWorkPackages.aircraftModelName}</h3>
                <h3>A/C Regn.    : &nbsp;{allWorkPackages.aircraftName}</h3>
                <h3>W/O             : &nbsp;{allWorkPackages.woNo}</h3>
              </pre>
            </div>
            <div className="work-first-content-right">
              <pre>
                <h3>Check No.    : &nbsp;{allWorkPackages.checkNo}</h3> <br />
                <h3>Input DT.      : &nbsp;{DateFormat(allWorkPackages.inputDate)}</h3>
                <h3>Release DT.  : &nbsp;{DateFormat(allWorkPackages.asOn)}</h3>
              </pre>
            </div>
          </div>
          <br /> <br /> <br /> <br /> <br /> <br /> <br />
          <div className="work-second-content">
            <div className="work-second-content-top">
              <pre>
                <h2>AS ON :  &nbsp;{DateFormat(allWorkPackages.asOfDate)}</h2>
              </pre>
            </div>
            <div className="work-second-content-middle">
              <pre>
                <h2>A/C HRS :  &nbsp;{formatTimeValue(allWorkPackages.acHours)}</h2>
              </pre>
            </div>
            <div className="work-second-content-bottom">
              <pre>
                <h2>A/C CYCLES  :  &nbsp;{allWorkPackages.acCycles} </h2>
              </pre>
            </div>
          </div>
          <br />
          <ARMTable className="work-table">
            <tbody>
              <tr>
                <td rowSpan={2}>Job Categories</td>
                <td colSpan={4}>Job Cards Status</td>
                <td rowSpan={2}>Remarks</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>Completed</td>
                <td>Deferred</td>
                <td>Withdraw</td>
              </tr>


              {
                allWorkPackages?.jobCardsViewModels?.map((jobCard, index)=> (
                    <tr key={index}>
                      <td>{jobCard.jobCategory}</td>
                      <td>{jobCard.total || 'NIL'}</td>
                      <td>{jobCard.completed || 'NIL'}</td>
                      <td>{jobCard.deferred || 'NIL'}</td>
                      <td>{jobCard.withDrawn || 'NIL'}</td>
                      <td>{jobCard.remark || 'NIL'}</td>
                    </tr>
                ))
              }

            </tbody>
          </ARMTable>
          <br />
          <Typography.Text className="description">The above job cards checked against the work package and certified that the inspection as per above mentioned
          status has been accomplished. </Typography.Text> <br />
          <div>
            <div className="prepared">
              <h2>Prepared by:</h2> <br /> <br />
            </div>
            <div className="checked">
              <h2>Checked by</h2> <br /> <br />
            </div>
            <div className="prepared-by">

              <br /><br /> <br />
              <h2></h2> <br />
            </div>
            <div className="checked-by">

              <br /><br /> <br />
              <h2></h2> <br />
            </div>
            <div className="approved-by">
              <h2>Approved by:</h2> <br />
              <br /> <br />
              <br />
              <h2></h2>
            </div>
          </div>
        </WorkReport>
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
