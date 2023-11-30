import {Link, useParams} from "react-router-dom";

import React, {useEffect, useState} from "react";
import ItemDemandService from "../../../service/ItemDemandService";
import logo from "../../images/us-bangla-logo.png";
import {createRef} from "react";
import ReactToPrint, {useReactToPrint} from "react-to-print";
import SuccessButton from "../../common/buttons/SuccessButton";
import {PrinterOutlined} from "@ant-design/icons";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Row,Button} from "antd";
import ARMCard from "../../common/ARMCard";
import {ArrowLeftOutlined} from "@ant-design/icons";
import StoreVoucherPrintFormat from "../../../lib/common/StoreVoucherPrintFormat";
const ApproveDemandDetailsPrint = () => {
    let {id} = useParams();
    const componentRef = createRef();
    const [singleData, setSingleData] = useState([]);
    const [approvalStatus, setApprovalStatus] = useState([]);
    const [priority, setPriority] = useState();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const loadSingleData = async () => {
        const {data} = await ItemDemandService.getItemDemandById(id)
        console.log("details data", data)
        setSingleData(data);
        let priorityList = []
        data.storeDemandDetailsDtoList?.map((d) => {
            priorityList.push(d.priorityType)
        })
        priorityList.sort();
        setPriority(priorityList[0]);
        let  approvalStatusList=[]
        for (const approveStatus in data.approvalStatuses) {
            approvalStatusList.push(data.approvalStatuses[approveStatus])
        }
        setApprovalStatus(approvalStatusList)
    };

    useEffect(() => {
      id &&  loadSingleData().catch(console.error);
    }, [id]);

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/store">
                            <i className="fas fa-archive"/> &nbsp;Store
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/store/approve-demand">
                            &nbsp;Approved Demands
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={`/store/approve-demand/details/${id}`}>
                            &nbsp;Approved Demands Details
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        &nbsp;Approved Demands Details Print
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

            <ARMCard
                title={
                    <Row justify="space-between">
                        <Col>Approved Demand Print</Col>
                        <Col>
                            <Button type="primary" style={{backgroundColor: '#04aa6d', borderColor: 'transparent', borderRadius: '5px'}}>
                                <Link title="back" to={`/store/approve-demand/details/${id}`}><ArrowLeftOutlined /> Back</Link>
                            </Button>  &nbsp;&nbsp; &nbsp;&nbsp;
                            <ARMButton type="primary" icon={<PrinterOutlined/>} onClick={handlePrint}>Print</ARMButton>
                        </Col>

                    </Row>
                }
            >
              <StoreVoucherPrintFormat>
                <div id="container" ref={componentRef} >
                    <div style={{padding:"15px"}}>
                        <div className="row" style={{width: "100%", height: "80px"}}>
                            <img alt={""} style={{float: "left", height: "70px"}} src={logo}/>

                            <p style={{
                                paddingTop: "40px",
                                fontSize: "20px",
                                paddingLeft: "400px",
                                height: "80px",
                                width: "100%"
                            }}>INTERNAL
                                DEMAND & ISSUE VOUCHER</p>
                        </div>
                        <div className="row" style={{width: "100%", height: "35px"}}>
                            <div style={{float: "left", width: "64%", height: "25px"}}>
                                <div style={{float: "left", width: "61%", height: "25px"}}>
                                    <p style={{paddingTop: "5px", fontSize: "15px"}}>To Be completed by Demanding
                                        Department</p>
                                </div>
                                <div style={{float: "left", width: "2%", height: "100%", marginTop: "10px"}}>
                                    <p
                                        style={{float: "left", fontSize: "50px", marginTop: "-30px"}}><i
                                        className="fa fa-caret-left"></i></p>
                                </div>
                                <div style={{float: "left", width: "37%", height: "100%"}}>
                                    <div style={{
                                        width: "100%",
                                        height: "15px",
                                        backgroundColor: "black",
                                        marginTop: "10px"
                                    }}></div>
                                </div>
                            </div>
                            <div style={{float: "left", width: "1%", height: "25px"}}>
                                <div
                                    style={{
                                        height: "100%",
                                        width: "16px",
                                        marginLeft: "-1px",
                                        backgroundColor: "black",
                                        marginTop: "10px"
                                    }}></div>
                            </div>
                            <div style={{paddingBottom:"5px",float: "right", width: "35%", height: "35px", fontSize: "10px"}}>
                                <span style={{float: "right"}}>Appendix : "AA"</span><br/>
                                <span style={{float: "right"}}>Form No: USBA/Enggs/Storage/027</span>
                            </div>
                        </div>

                        <div className="row" style={{width: "100%"}}>
                            <div style={{float: "left", width: "64.078%", height: "80px"}}>
                                <table style={{width: "100%", height: "100%", fontSize: "12px",textAlign: 'center'}}>

                                    <thead >
                                    <tr>
                                        <th style={{ border: "1px solid grey",}}>Demand No.</th>
                                        <th style={{ border: "1px solid grey",}}>Shop/Dept No.</th>
                                        <th style={{ border: "1px solid grey",}}>Priority</th>
                                        <th style={{ border: "1px solid grey",}}>Location No.</th>
                                        <th style={{ border: "1px solid grey",}}>Work Order No.</th>
                                        <th style={{ border: "1px solid grey",}}>A/C Regn.</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td style={{ border: "1px solid grey",}}>{singleData.voucherNo}</td>
                                        <td style={{ border: "1px solid grey",}}>{singleData.departmentCode}</td>
                                        <td style={{ border: "1px solid grey",}}>{priority}</td>
                                        <td style={{ border: "1px solid grey",}}>{singleData.airportName} </td>
                                        <td style={{ border: "1px solid grey",}}>{singleData.workOrderNo}</td>
                                        <td style={{ border: "1px solid grey",}}>{singleData.aircraftName}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style={{float: "left", width: "1.37%"}}>
                                <div style={{height: "80px", width: "100%", backgroundColor: "black"}}>
                                </div>
                            </div>
                            <div style={{float: "left", width: "34.5%", marginLft: "-1px"}}>
                                <table style={{height: "80px", width: "100%", fontSize: "12px",  border: "1px solid black",textAlign: 'center'}}>
                                    <thead style={{ border: "1px solid black"}}>
                                    <tr>
                                        <th style={{ border: "1px solid grey",}}>Stock Room No.</th>
                                        <th style={{ border: "1px solid grey",}}>Issue Voucher No.</th>
                                        <th style={{ border: "1px solid grey",}}>Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td style={{ border: "1px solid grey",}}></td>
                                        <td style={{ border: "1px solid grey",}}></td>
                                        <td style={{ border: "1px solid grey",}}></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Middle Black COlor  */}

                        <div className="row" style={{width: "100%", height: "20px", }}>
                            <div style={{float: "left", width: "71%", height: "30px", marginLeft: "1px"}}>
                                <div style={{float: "left", width: "68%", height: "100%"}}>

                                </div>

                                <div style={{
                                    float: "left",
                                    width: "34.4%",
                                    height: "60%",
                                    marginLeft: "-75px",
                                    backgroundColor: "black",
                                    border:" 1px solid black"
                                    
                                }}>
                                </div>

                            </div>

                            <div style={{float: "left", width: "28%", height: "30px"}}>
                            </div>
                        </div>


                        <div className="row" style={{width: "100%", height: "390px", padding: "0px"}}>
                            <div style={{
                                float: "left",
                                width: "100%",
                                height: "450px",
                                marginTop: "-12px",
                                padding: "0px"
                            }}>

                                <table style={{fontSize: "12px", width: "100%", tableLayout: "fixed",  border: "1px solid black",textAlign: 'center'}}>
                                    <thead style={{ border: "1px solid black"}}>
                                    <tr>
                                        <th style={{width: "4%",border: "1px solid grey"}}>S/N</th>
                                        <th style={{width: "10%" ,border: "1px solid grey"}}>Part Number</th>
                                        <th style={{width: "13%" ,border: "1px solid grey"}}>Nomenclature</th>
                                        <th style={{width: "8%" ,border: "1px solid grey"}}>Unit</th>
                                        <th style={{width: "5%" ,border: "1px solid grey"}}>Qty. Required</th>
                                        <th style={{width: "1.33%", backgroundColor: "black"}}></th>
                                        <th style={{width: "8%" ,border: "1px solid grey"}}>Qty. Issued</th>
                                        <th style={{width: "8%" ,border: "1px solid grey"}}>Bin Balance</th>
                                        <th style={{width: "8%" ,border: "1px solid grey"}}>Card Line No.</th>
                                        <th style={{width: "8%" ,border: "1px solid grey"}}>SN:</th>
                                        <th style={{width: "8%" ,border: "1px solid grey"}}>GRN:</th>
                                        <th style={{width: "8%" ,border: "1px solid grey"}}>Unit Rate</th>
                                        <th style={{width: "8%" ,border: "1px solid grey"}}>Total Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {
                                        singleData.storeDemandDetailsDtoList?.map((data, i) => (
                                            <tr key={i} >
                                                <td style={{ border: "1px solid grey",}}>{i + 1}</td>
                                                <td style={{ border: "1px solid grey",}}>{data.partNo}</td>
                                                <td style={{ border: "1px solid grey",}}>{data.partDescription}</td>
                                                <td style={{ border: "1px solid grey",}}>{data.unitMeasurementCode}</td>
                                                <td style={{ border: "1px solid grey",}}>{data.quantityDemanded}</td>

                                                <td style={{backgroundColor: "black"}}></td>
                                                <td style={{ border: "1px solid grey",}}></td>
                                                <td style={{ border: "1px solid grey",}} ></td>
                                                <td style={{ border: "1px solid grey",}} ></td>
                                                <td style={{ border: "1px solid grey",}}></td>
                                                <td style={{ border: "1px solid grey",}}></td>
                                                <td style={{ border: "1px solid grey",}}></td>
                                                <td style={{ border: "1px solid grey",}}></td>
                                            </tr>

                                        ))
                                    }

                                    </tbody>
                                </table>
                                <table>
                                    
                                </table>
                                {/* 3rd  Table */}
                  <table
                    style={{
                        marginTop:"-1px",
                      width: "100%",
                      tableLayout: "fixed",
                      border: "1px solid grey",
                    }}
                  >
                    <tbody>
                      <tr>
                        {/* Arrow Design Part  ........................*/}
                        <th
                          style={{
                            width: "19%",
                            border: "1px solid grey",
                            height: "auto",
                          }}
                        >
                          <div style={{ height: "120px" }}>
                            <div style={{ display: "flex", height: "50px" }}>
                              <p
                                style={{
                                  width: "90px",
                                  fontSize: "10px",
                                  borderBottom: "1px solid black",
                                  marginLeft: "5px",
                                  marginTop: "5px",
                                }}
                              >
                                In Case of Issues of Engg. Dept Check Applicable
                                box
                              </p>
                              <div
                                style={{
                                  background: "black",
                                  height: "18px",
                                  width: "50px",
                                  marginTop: "19px",
                                  marginLeft: "5px",
                                }}
                              ></div>

                              <p
                                style={{
                                  fontSize: "50px",
                                  marginLeft: "0px",
                                  marginTop: "-10px",
                                }}
                              >
                                <i className="fa fa-caret-right"></i>
                              </p>
                            </div>
                            <div
                              style={{
                                background: "black",
                                width: "18px",
                                height: "30px",
                                marginTop: "0px",
                                marginLeft: "40px",
                              }}
                            ></div>
                            <p
                              style={{
                                fontSize: "50px",
                                height: "20px",
                                width: "10px",
                                marginTop: "-32px",
                                paddingLeft: "33.5px",
                              }}
                            >
                              <i className="fa fa-caret-down"></i>
                            </p>
                          </div>
                          <div>
                            <div
                              style={{ background: "black", height: "1px" }}
                            ></div>
                            <div style={{ display: "flex" ,fontSize:"12px", fontWeight:"500"}}>
                              &nbsp;
                              <input type="checkbox" />
                              &nbsp;Direct Material
                            </div>
                            <div style={{ display: "flex",fontSize:"12px", fontWeight:"500" }}>
                              &nbsp;
                              <input type="checkbox" />
                              &nbsp;Shop Supplies
                            </div>
                            <div style={{ display: "flex",fontSize:"12px", fontWeight:"500" }}>
                              &nbsp;
                              <input type="checkbox" />
                              &nbsp;Stationary
                            </div>
                            <div style={{ display: "flex",fontSize:"12px", fontWeight:"500" }}>
                              &nbsp;
                              <input type="checkbox" />
                              &nbsp;Uniform
                            </div>
                          </div>
                        </th>
                        {/* Demand - Part , Right Side ................. */}
                        <th style={{ width: "81%", border: "1px solid grey" }}>
                          <div style={{ width: "100%", marginTop: "-2px" }}>
                            <div
                              className="left"
                              style={{
                                display: "flex",
                                border: "1px solid grey",
                                width: "100%",
                              }}
                            >
                              {/* Left Section  .............................*/}
                              <div style={{ width: "27.32%", display: "flex" }}>
                                <div style={{ width: "77.5%" }}>
                                  <p>Demeand For: <br/> {singleData.aircraftName} </p>
                                </div>

                                <div style={{ width: "22.5%" }}>
                                  <div style={{ marginBottom: "5px" }}>
                                    <h4
                                      style={{
                                        height: "14px",
                                        fontSize: "9px",
                                        fontWeight: "600",
                                        width: "50px",
                                        border: "1px solid grey",
                                        marginLeft: "1px",
                                          marginTop:"1px",
                                      }}
                                    >
                                      B738
                                    </h4>
                                  </div>
                                  <div style={{ marginBottom: "5px" }}>
                                    <h4
                                      style={{
                                        height: "14px",
                                        fontSize: "9px",
                                        fontWeight: "600",
                                        width: "50px",
                                        border: "1px solid grey",
                                        marginLeft: "1px",
                                      }}
                                    >
                                      Dash8
                                    </h4>
                                  </div>
                                  <div style={{ marginBottom: "5px" }}>
                                    <h4
                                      style={{
                                        height: "14px",
                                        fontSize: "9px",
                                        fontWeight: "600",
                                        width: "50px",
                                        border: "1px solid grey",
                                        marginLeft: "3px",
                                      }}
                                    >
                                      ATR72
                                    </h4>
                                  </div>

                                  {/* Middle Verticle Color left => Black Design ................*/}
                                  <div
                                    style={{
                                      backgroundColor: "black",
                                      width: "55px",
                                      height: "18px",
                                      border: "2px solid black",
                                      marginLeft: "2.5px",
                                    }}
                                  ></div>
                                </div>
                              </div>

                              {/* Middle Verticle Color  ......................*/}
                              <div
                                style={{
                                  backgroundColor: "black",
                                  width: "1.9%",
                                  height: "75px",
                                  marginLeft: "-2px",
                                  border: "2px solid black",
                                }}
                              ></div>

                              {/* Middle Verticle Line => Right Section  .....................*/}

                              <div style={{ width: "70.80%" }}>
                                <div
                                  style={{
                                    marginBottom: "8px",
                                    marginTop: "5px",
                                  }}
                                >
                                  <h4
                                    style={{
                                      height: "15px",
                                      fontSize: "10px",
                                      fontWeight: "600",
                                      width: "70px",
                                      border: "1px solid grey",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    ALL A/C
                                  </h4>
                                </div>
                                <div style={{ marginBottom: "8px" }}>
                                  <h4
                                    style={{
                                      height: "15px",
                                      fontSize: "10px",
                                      fontWeight: "600",
                                      width: "70px",
                                      border: "1px solid grey",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    HIRED
                                  </h4>
                                </div>
                                <div style={{ marginBottom: "8px" }}>
                                  <h4
                                    style={{
                                      height: "15px",
                                      fontSize: "10px",
                                      fontWeight: "600",
                                      width: "70px",
                                      border: "1px solid grey",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Table => Bottom Part ..............*/}
                          <>
                            <div
                              style={{
                                display: "flex",
                                width: "100%",
                                border: "1px solid grey",
                                height: "130px",
                              }}
                            >
                              <div
                                style={{
                                  width: "10.4%",
                                  border: "1px solid grey",
                                }}
                              >
                                <h5
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "600",
                                  }}
                                >
                                  In case of issues For other depts. Write
                                  Expenses Account No.
                                </h5>
                              </div>

                              {(approvalStatus?.length <= 5 ) && (
                                <>
                                  <div
                                    style={{
                                      width: "11.0%",
                                      border: "1px solid grey",
                                    }}
                                  >
                                    <p>{ approvalStatus.length >= 4 ?  approvalStatus[0].workFlowAction : "" }</p>
                                    <p>{ approvalStatus.length >= 4 ?  approvalStatus[0].updatedByName : ""}</p>
                                    <p>ID NO: { approvalStatus.length >= 4 ?  approvalStatus[0].updatedBy : ""}</p>
                                  </div>
                                  <div
                                    style={{
                                      width: "1.9%",
                                      border: "1px solid black",
                                      background: "black",
                                    }}
                                  ></div>
                                  <div
                                    style={{
                                      width: "19.2075%",
                                      border: "1px solid grey",
                                    }}
                                  >
                                    <p>{approvalStatus.length  >=4? approvalStatus[1].workFlowAction : ""}</p>
                                    <p>{approvalStatus.length >=4 ? approvalStatus[1].updatedByName : ""}</p>
                                    <p>ID NO:{approvalStatus.length >=4 ? approvalStatus[1].updatedBy : ""}</p>
                                  </div>
                                  <div
                                    style={{
                                      width: "19.2075%",
                                      border: "1px solid grey",
                                    }}
                                  >
                                    <p>{approvalStatus.length >= 4  ? approvalStatus[2].workFlowAction : ""}</p>
                                    <p>{approvalStatus.length >=4  ?  approvalStatus[2].updatedByName : ""}</p>
                                    <p>ID NO: {approvalStatus.length >=4  ?  approvalStatus[2].updatedBy : ""}</p>
                                  </div>
                                  <div
                                    style={{
                                      width: "19.1075%",
                                      border: "1px solid grey",
                                    }}
                                  >
                                    <p>{approvalStatus.length  >=4? approvalStatus[3].workFlowAction : ""}</p>
                                    <p>{approvalStatus.length >=4 ?  approvalStatus[3].updatedByName : ""}</p>
                                    <p>ID NO: {approvalStatus.length >=4 ?  approvalStatus[3].updatedBy : ""}</p>
                                  </div>
                                  <div
                                    style={{
                                      width: "19.1775%",
                                      border: "1px solid grey",
                                    }}
                                  >
                                    <p>{approvalStatus.length === 5 ? approvalStatus[4].workFlowAction : "N/A"}</p>
                                    <p>{approvalStatus.length === 5 ? approvalStatus[4].updatedByName : "N/A"}</p>
                                    <p>ID NO: {approvalStatus.length === 5 ?  approvalStatus[4].updatedBy: ""}</p>
                                
                                  </div>
                                </>
                              )}

                              
                            </div>
                          </>
                        </th>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{width:"100%",paddingTop:"10px", paddingLeft:"20px",fontSize:"10px",fontWeight:"500"}}>
                    <p>
                      Distribution: TO BE PREPARED IN TRIPLERUPLICATE AND DISTRIBUTED AS FOLLOWS: 
                      1. ORIGINAL-Store Accounts, 
                      2. DUPLICATES-Store Room 
                      3. TRIPLICATE-Demander's Copy
                    </p>
                    <p>Issue: 02. Rev.01. Date: </p>
                  </div>
                                {/* 3rd  Table */}
                                {/* <table style={{width:"100%" , tableLayout: "fixed",  border: "1px solid grey",}}>
                                    <tr>
                                        <th style={{width:"19%", border:"1px solid grey"}}>
                                           <div style={{ height:"150px"}}>
                                                <div style={{display:"flex", height:"80px"}}>
                                                    <p   
                                                        style={{
                                                            width: "90px",
                                                            fontSize: "10px",
                                                            borderBottom: "1px solid black" ,
                                                            marginLeft: "5px",
                                                            marginTop:"5px"
                                                        }}
                                                    >
                                                        In Case of Issues of Engg. Dept Check Applicable box

                                                    </p>
                                                    <div
                                                    style={{
                                                        background: "black",
                                                        height: "15px",
                                                        width: "50px",
                                                        marginTop:"20px",
                                                        marginLeft:"5px",
                                                        
                                                    }}
                                                    ></div>
                                                  
                                                    <p
                                                        style={{fontSize: "50px", marginLeft: "0px", marginTop: "-10px"}}>
                                                        <i className="fa fa-caret-right"></i>
                                                    </p>
                                                   
                                                </div>
                                                <div
                                                 style={{background:"black", width:"18px", height:"50px", marginTop:"0px",marginLeft:"40px"}}>
                                                </div>
                                                <p style={{fontSize: "50px", height:"20px", width:"10px",marginTop:"-32px", paddingLeft:"33.5px", paddingBottom:"20px"}}>
                                                    <i className="fa fa-caret-down"></i>
                                                </p>
                                            </div>
                                        </th> 
                                        <th style={{width:"22.3%", border:"1px solid grey"}}>
                                            <div style={{ height:"100px"}}>
                                                <div style={{display:"flex"}}>
                                                    <p>Demeand For: </p> 

                                                </div>
                                           </div>
                                        </th> 
                                        <th style={{width:"1.51%", background:"black", border:"1px solid black"}} ></th> 
                                        <th  style={{width:"57.79%", border:"1px solid grey"}}>
                                            <div style={{height:"150px"}}>
                                                <div style={{height:"20px",width:"100px",  border:"1px solid grey",marginLeft:"10px", marginTop:"10px"}}>
                                                    ALL A/C
                                                </div>
                                                <div style={{height:"20px",width:"100px",   border:"1px solid grey",marginLeft:"10px", marginTop:"10px"}}>
                                                    HIRED
                                                </div>
                                                <div style={{height:"20px",width:"100px", border:"1px solid grey",marginLeft:"10px", marginTop:"10px"}}>
                                                
                                                </div>
                                                 
                                            </div>
                                        </th> 
                                    </tr>
                                </table> */}
                                {/* 4th Table  */}
                                {/* <table style={{width: "100%", tableLayout: "fixed", border: "1px solid grey"}}>
                                    <thead>
                                    <tr>
                                        {
                                            approvalStatus?.map((data, i) => (

                                                <th style={{textAlign: "center"}} key={i}>
                                                    <p> {data.workFlowAction} BY</p>
                                                    <p>{data.updatedByName}</p>
                                                </th>
                                            ))
                                        }
                                    </tr>
                                    </thead>
                                </table> */}
                            </div>

                        </div>
                    </div>

                </div>
              </StoreVoucherPrintFormat>
            </ARMCard>
        </CommonLayout>

    );
};

export default ApproveDemandDetailsPrint;
