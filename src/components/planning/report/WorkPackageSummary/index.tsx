import CommonLayout from "../../../layout/CommonLayout";
import styled from "styled-components";
import {createRef, useState, useEffect} from "react";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, notification, Row, Typography} from "antd";
import {Link, useParams} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import ReactToPrint from "react-to-print";
import SuccessButton from "../../../common/buttons/SuccessButton";
import {PrinterOutlined} from "@ant-design/icons";
import logo from "../../../../components/images/us-bangla-logo.png";
import ARMTable from "../../../common/ARMTable";
import API from "../../../../service/Api";
import { getErrorMessage } from "../../../../lib/common/helpers";
import {formatTimeValue} from "../../../../lib/common/presentation";
import Permission from "../../../auth/Permission";
import { DateFormat } from "../Common";

const TITLE = "Work Package Summary";
const printStyle = `
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
  @page {size : portrait}
`;
const WORKPackage = styled.div`
  .work-first-table tr td,
  .work-second-table tr td,
  .work-third-table tr td {
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
    padding: 0
  }
  .work-first-table,
  .work-second-table{
    font-weight: bold;
  }
  .work-first-table{
    width: 80%;
    margin: 0 auto;
  }
  .work-second-table{
    width: 40%;
    margin: 0 auto;
  }
  .work-third-table{
    width: 75%;
    margin: 0 auto;
  }
  .work-third-table td{
    height: 22px!important;
  }
  .work-last-table{
    width: 80%;
    margin: 0 auto
  }
  .prepared, .checked{
    float: left;
    width: 50%;
    border: 1px solid #000;
    padding: 4px;
  }
  .prepared h2, .checked h2, .approved h2{
    font-weight: bold;
    margin-bottom: 0px !important;
  }
  .approved{
    text-align: center;
    border: 1px solid #000;
  }
  .hidden{
    visibility: hidden!important;
  }
  .text-right{
    text-align: right!important;
  }
  .text-left{
    text-align: left!important;
  }
  .title{
    font-weight: bold;
    text-align:center;
    text-decoration: underline;
    text-transform: uppercase;
  }
  .aoc{
    text-align: center;
    font-weight: bold;
}
`;


export interface Root {
  aircraftName: string
  aircraftModelName: string
  asOn: string
  acHours: number
  acCycles: number
  dueAt: any
  woNo: string
  woDate: string
  checkNo: string
  noOfTaskCards: number
  categoryB1: number
  categoryB2: number
  id: string
  workPackageId : number
  inputDate : string
  asOfDate : string
}


export default function WorkPackageSummary() {
  const reportRef = createRef<any>();
  const {id} = useParams()
  // @ts-ignore
  const [allWorkPackages, setAllWorkPackages] = useState<Root>([]);



    // @ts-ignore
  const workPackageId = parseInt(id)



  const getWorkPackageData = async (workPackageId: number) => {

    if (!workPackageId) {
      return
    }
    try{
      const {data} = await API.post(`work-package/report`,workPackageId )
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
      await getWorkPackageData(workPackageId)
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
          <Breadcrumb.Item>
            <Link to="/planning/work-package-summary">{TITLE}</Link></Breadcrumb.Item>
          <Breadcrumb.Item>View</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_CHECK_WORK_PACKAGE_SUMMARY_SEARCH" showFallback>
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

        <WORKPackage ref={reportRef}>
          <Row>
            <Col span={24}>
              <Row justify="space-between">
                <Col>
                  <img src={logo} alt="" width={110} />
                </Col>
                <Col style={{ fontSize: "14px", fontWeight: "bold" }}>
                  <Typography.Text>Form: CAME-023</Typography.Text> <br />
                  <Typography.Text>ISSUE: INITIAL</Typography.Text> <br />
                  <Typography.Text>DATE: 19-01-2022</Typography.Text>
                </Col>
              </Row>
            </Col>
          </Row>
          <Typography.Title className="title">{TITLE}</Typography.Title>
          <Typography.Title className="aoc" level={5}>
            (AOC NO. 20)
          </Typography.Title>
          <ARMTable className="work-first-table">
            <tbody>
              <tr>
                <td className="text-right">A/C TYPE:&nbsp;</td>
                <td className="text-left">&nbsp;{allWorkPackages.aircraftModelName}</td>
                <td className="text-right">CHECK NO.:&nbsp;</td>
                <td className="text-left">&nbsp;{allWorkPackages.checkNo}</td>
              </tr>
              <tr>
                <td className="text-right">A/C REGN.:&nbsp;</td>
                <td className="text-left"> &nbsp;{allWorkPackages.aircraftName}</td>
                <td className="text-right">INPUT DATE:&nbsp;</td>
                <td className="text-left">&nbsp;{DateFormat(allWorkPackages.inputDate)}</td>
              </tr>
              <tr>
                <td className="text-right">W.O. NO.:&nbsp;</td>
                <td className="text-left">&nbsp;{allWorkPackages.woNo}</td>
                <td className="text-right">RELEASE DATE:&nbsp;</td>
                <td className="text-left">&nbsp;{DateFormat(allWorkPackages.asOn)}</td>
              </tr>
              <tr>
                <td className="text-right">W.O.DATE:&nbsp;</td>
                <td className="text-left"> &nbsp;{DateFormat(allWorkPackages.woDate)}</td>
              </tr>
            </tbody>
          </ARMTable>
          <br />
          <ARMTable className="work-second-table">
            <tbody>
              <tr>
                <td className="text-right">AS ON:&nbsp;</td>
                <td className="text-left"> &nbsp;{DateFormat(allWorkPackages.asOfDate)} </td>
              </tr>
              <tr>
                <td className="text-right">A/C HOURS:&nbsp;</td>
                <td className="text-left">&nbsp;{formatTimeValue(allWorkPackages.acHours)}</td>
              </tr>
              <tr>
                <td className="text-right">A/C CYCLES:&nbsp;</td>
                <td className="text-left">&nbsp;{allWorkPackages.acCycles}</td>
              </tr>
              <tr>
                <td className="text-right">DUE AT (HRS):&nbsp;</td>
                <td className="text-left">&nbsp;{allWorkPackages.dueAt}</td>
              </tr>
            </tbody>
          </ARMTable>
          <br />
          <ARMTable className="work-third-table">
            <tbody>
              <tr style={{ fontWeight: "bold" }}>
                <td>S/N.</td>
                <td>CHECK NO.</td>
                <td>
                  NO. OF TASK <br /> CARDS
                </td>
                <td>
                  CATEGORY <br /> B1
                </td>
                <td>
                  CATEGORY <br /> B2
                </td>
              </tr>
              <tr>
                <td>01.</td>
                <td>{allWorkPackages.checkNo}</td>
                <td>{allWorkPackages.noOfTaskCards}</td>
                <td>{allWorkPackages.categoryB1}</td>
                <td>{allWorkPackages.categoryB2}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </ARMTable>
          <br /> <br />
          <div className="work-last-table">
            <div className="prepared">
              <h2>Prepared by: </h2> <br />
              <br />
              <br /> <br />
              <br /> <br />
              <h2> </h2>
            </div>
            <div className="checked">
              <h2>Checked by: </h2> <br />
              <br />

              <br /> <br />
              <br /> <br />
              <h2></h2>
            </div>
            <div className="approved">
              <h2>Approved by:</h2> <br /> <br />
              <br /> <br />
              <br /> <br />
              <h2> </h2>
            </div>
          </div>
        </WORKPackage>
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
