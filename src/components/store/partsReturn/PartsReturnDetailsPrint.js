import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import partsReturnService from "../../../service/store/PartsReturnService";
import logo from "../../images/us-bangla-logo.png";
import { createRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import { Breadcrumb, Col, Row, Button } from "antd";
import ARMCard from "../../common/ARMCard";
import { ArrowLeftOutlined } from "@ant-design/icons";
import StoreVoucherPrintFormat from "../../../lib/common/StoreVoucherPrintFormat";

const PartsReturnDetailsPrint = () => {
  let { id } = useParams();
  const componentRef = createRef();
  const [singleData, setSingleData] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState([]);
  const [storeReturnPart, setStoreReturnPart] = useState([]); 
  const [partsDetails,setPartsDetails] = useState([]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  
  const loadSingleData = async () => {
    const {data} = await partsReturnService.getPartReturnById(id)
    setSingleData(data);

    // Store Approve Status List 
    let approvalStatusList = [];
    for (const approveStatus in data.approvalStatuses) {
      approvalStatusList.push(data.approvalStatuses[approveStatus]);
    }
    setApprovalStatus(approvalStatusList);

    // Store StoreReturnPart List .......... 
    let storeReturnpartList = []; 
    for(const storereturnpart in data.storeReturnPartList){
      storeReturnpartList.push(data.storeReturnPartList[storereturnpart]); 
    }
    setStoreReturnPart(storeReturnpartList);
    
    // Store PartsListModel 
    let partsList = []; 
    data?.storeReturnPartList?.map((item)=>(
      item?.partsDetailViewModels.map((value)=>(
        partsList.push(value?.removedPartSerialNo)
        // setPartsDetails(value)
        // console.log('Parts Details is ==========', value)
      ))
     ))
     setPartsDetails(partsList)
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      await loadSingleData()
    })();
  }, [id]);
   
  
  // Store PartDetailModel List 
  //  let partsDetailsList = [] ; 
  
  //  for(const partsmodel in singleData?.storeReturnPartList?.partsDetailViewModels?.removedPartSerialNo){
  //    partsDetailsList.push(singleData?.storeReturnPartList?.partsDetailViewModels?.removedPartSerialNo[partsmodel]); 
  //  }
  // partsDetails?.removedPartSerialNo?.map((p)=>(
  //   setPrice(p)
  // ))
    // setPrice(partsDetails[0].removedPartSerialNo[0].price)
  
    //  console.log("Price is  ===== > ",price);


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/store">
              <i className="fas fa-archive" /> &nbsp;Store
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/store/approved-parts-return">&nbsp;Approved Parts Return</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/store/approved-parts-return/details/${id}`}>
              &nbsp;Approved Parts Return Details
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>&nbsp;print</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={
          <Row justify="space-between">
            <Col>Parts Return Details Print</Col>
            <Col>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#04aa6d",
                  borderColor: "transparent",
                  borderRadius: "5px",
                }}
              >
                <Link to={`/store/approved-parts-return/details/${id}`}>
                  <ArrowLeftOutlined /> Back
                </Link>

              </Button>{" "}
              &nbsp;&nbsp; &nbsp;&nbsp;
              <ARMButton
                type="primary"
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                Print
              </ARMButton>
            </Col>
          </Row>
        }
      >
        <StoreVoucherPrintFormat>
          <div id="container" ref={componentRef}>
            <div style={{ padding: "15px" }}>
              <div className="row" style={{ width: "100%", height: "80px" }}>
                <img
                  alt={""}
                  style={{ float: "left", height: "70px" }}
                  src={logo}
                />

                <p
                  style={{
                    paddingTop: "20px",
                    fontSize: "20px",
                    paddingLeft: "400px",
                    height: "80px",
                    width: "100%",
                    marginBottom:"10px",
                  }}
                >
                  INTERNAL RECEIPT (STOCK RETURN) VOUCHER <br/>
                  &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;(USEABLE MATERIAL)
                </p>
              </div>
              <div className="row" style={{ width: "100%", height: "35px" }}>
                <div style={{ float: "left", width: "64%", height: "25px" }}>
                  <div style={{ float: "left", width: "61%", height: "25px" }}>
                    <p style={{ paddingTop: "5px", fontSize: "12px" }}>
                      TO BE COMPLETED BY RETURNING DEPARTMENT                    </p>
                  </div>
                  <div
                    style={{
                      float: "left",
                      width: "2%",
                      height: "100%",
                      marginTop: "10px",
                    }}
                  >
                    <p
                      style={{
                        float: "left",
                        fontSize: "50px",
                        marginTop: "-30px",
                      }}
                    >
                      <i className="fa fa-caret-left"></i>
                    </p>
                  </div>
                  <div style={{ float: "left", width: "37%", height: "100%" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "15px",
                        backgroundColor: "black",
                        marginTop: "10px",
                      }}
                    ></div>
                  </div>
                </div>
                <div style={{ float: "left", width: "1%", height: "25px" }}>
                  {/*upper arrow bar design*/}
                  <div
                    style={{
                      height: "100%",
                      width: "16px",
                      marginLeft: "-9px",
                      backgroundColor: "black",
                      marginTop: "10px",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    paddingBottom: "5px",
                    float: "right",
                    width: "35%",
                    height: "35px",
                    fontSize: "10px",
                  }}
                >
                  <span style={{ float: "right" }}>Appendix : "AA"</span>
                  <br />
                  <span style={{ float: "right" }}>
                    Form No: USBA/Enggs/Storage/028
                  </span>
                </div>
              </div>

              <div className="row">
                <table
                  style={{
                    width: "100%",
                    height: "100%",
                    tableLayout: "fixed",
                    fontSize: "12px",
                    textAlign:"center",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "10.85%",
                        }}
                      >
                        Return Sl No.
                      </th>
                      <th
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "10.85%",
                        }}
                      >
                        Shop/Dept No.
                      </th>
                      <th
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "10.85%",
                        }}
                      >
                        Location No.
                      </th>
                      <th
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "9.80%",
                        }}
                      >
                       Work Order No
                      </th>
                      <th
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "9.80%",
                        }}
                      >
                       Work Order Serial
                      </th>

                      <th
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "9.80%",
                        }}
                      >
                        A/C Regn. No.
                      </th>
                      {/*table black bar*/}
                      <th
                        style={{
                          tableLayout: "fixed",
                          background: "black",
                          border: "1px solid black",
                          width: "1.50%",
                        }}
                      ></th>
                      <th
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "11.6%",
                        }}
                      >
                        Stock Room No.
                      </th>
                      <th
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "11.5%",
                        }}
                      >
                        Return Voucher No.
                      </th>
                      <th
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "11.6%",
                        }}
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "10.85%",
                        }}
                      >
                        {singleData.id} 
                      </td>
                      <td
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "10.85%",
                        }}
                      >
                        {singleData.departmentName}
                      </td>
                      <td
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "10.85%",
                        }}
                      >
                          {singleData.locationCode}
                      </td>


                          <td   style={{
                            tableLayout: "fixed",
                            border: "1px solid grey",
                            width: "9.80%",
                          }}>{singleData.workOrderNumber?singleData.workOrderNumber:" "}</td>
                          <td   style={{
                            tableLayout: "fixed",
                            border: "1px solid grey",
                            width: "9.80%",
                          }}>{singleData.workOrderSerial?singleData.workOrderSerial:" "}</td>
                          


                      <td
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "9.80%",
                        }}
                      >
                        {singleData.aircraftRegistration}
                      </td>
                      {/*table black bar*/}
                      <td
                        style={{
                          tableLayout: "fixed",
                          background: "black",
                          border: "1px solid black",
                          width: "1.52%",
                        }}
                      ></td>
                      <td
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "11.6%",
                        }}
                      >
                        {singleData.stockRoomName}
                      </td>
                      <td
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "11.5%",
                        }}
                      >
                        {singleData.voucherNo}
                      </td>
                      <td
                        style={{
                          tableLayout: "fixed",
                          border: "1px solid grey",
                          width: "11.6%",
                        }}
                      >
                        {singleData.createDate}
                        
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Middle Black COlor  */}
              <div className="row" style={{width: "100%", height: "20px", }}>
                <div style={{float: "left", width: "69%", height: "25px", marginLeft: "14px"}}>
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
              
                {/* 2nd Part  */}
              <div
                className="row"
                style={{ width: "100%", height: "390px", padding: "0px" }}
              >
                <div
                  style={{
                    float: "left",
                    width: "100%",
                    height: "450px",
                    marginTop: "-15px",
                    padding: "0px",
                  }}
                >
                  {/* Data Table Middle - 2nd Table  */}
                  <table
                    style={{
                      fontSize: "12px",
                      width: "100%",
                      tableLayout: "fixed",
                      border: "1px solid black",
                      textAlign:"center",
                    }}
                  >
                    <thead style={{ border: "1px solid black" }}>
                      <tr>
                        <th style={{ width: "4%", border: "1px solid grey" }}>
                          S/N
                        </th>
                        <th style={{ width: "10%", border: "1px solid grey" }}>
                          Part No.
                        </th>
                        <th style={{ width: "13%", border: "1px solid grey" }}>
                          Description
                        </th>
                        <th style={{ width: "8%", border: "1px solid grey" }}>
                          Unit
                        </th>
                        <th style={{ width: "5%", border: "1px solid grey" }}>
                          Qty. Return
                        </th>
                        <th
                          style={{ width: "1.37%", backgroundColor: "black" }}
                        ></th>
                        <th style={{ width: "8.2%", border: "1px solid grey" }}>
                          Unserviceable Qty.
                        </th>
                        <th style={{ width: "8%", border: "1px solid grey" }}>
                          Serviceable Qty.
                        </th>
                        <th style={{ width: "8%", border: "1px solid grey" }}>
                          Bin Balance
                        </th>
                        <th style={{ width: "8%", border: "1px solid grey" }}>
                          CardLine No.
                        </th>
                        <th style={{ width: "8%", border: "1px solid grey" }}>
                          Release No.
                        </th>
                        <th style={{ width: "8%", border: "1px solid grey" }}>
                          Unit Price
                        </th>
                        <th style={{ width: "8%", border: "1px solid grey" }}>
                          Total Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {storeReturnPart?.map((data, i) => (
                        <tr key={i}>
                          <td
                            style={{ border: "1px solid grey" }}
                            key={data.id}
                          >
                            {i + 1}
                          </td>
                          <td
                            style={{ border: "1px solid grey" }}
                            key={data.id}
                          >
                            {data?.partNo}
                          </td>
                          <td
                            style={{ border: "1px solid grey" }}
                            key={data.id}
                          >
                            {data?.partDescription}
                          </td>
                          <td
                            style={{ border: "1px solid grey" }}
                            key={data.id}
                          >
                            {data?.removedPartUomCode}
                          </td>
                          <td
                            style={{ border: "1px solid grey" }}
                            key={data.id}
                          >
                            {data?.quantityReturn}
                          </td>

                          <td style={{ backgroundColor: "black" }} key={i}>11</td>
                          
                          <td style={{ border: "1px solid grey" }} key={data.id}>
                            { singleData?.isServiceable === true ? 0 : 1}
                          </td>
                          <td style={{ border: "1px solid grey" }} key={i}>
                            { singleData?.isServiceable === true ? 1 : 0 }
                          </td>
                          <td style={{ border: "1px solid grey" }} key={i}>
                            {data?.availableQuantity}
                          </td>
                          <td style={{ border: "1px solid grey" }} key={i}>
                            {data?.cardLineNo} 
                          </td>

                          <td style={{ border: "1px solid grey" }} key={i}>
                            {data?.releaseNo} 
                          </td>
                           
                          <td style={{ border: "1px solid grey" }} key={i}>
                            {/* {data?.partsDetailViewModels[0].removedPartSerialNo[0].price} */}
                            {partsDetails[0].price} 
                          </td>
                           
                          <td style={{ border: "1px solid grey" }} key={i}>
                            {data?.quantityReturn * partsDetails[0].price}
                           
                            {/* {data?.binbalance * data?.unitPrice} */}
                            {/* <tr style={{width:"8%"}}>
                              <td style={{width:"5%", borderRight:"1px solid grey"}}>Hello</td> 
                              <td style={{width:"3%"}}>world</td> 

                              
                            </tr> */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* 3rd  Table */}
                  <table
                    style={{
                      width: "100%",
                      tableLayout: "fixed",
                      border: "1px solid grey",
                    }}
                  >
                    <tbody>
                      <tr>
                        {/* 1st Column  ........................*/}
                        <th
                          style={{
                            width: "19%",
                            border: "1px solid grey",
                          
                          }}
                        >
                          <div style={{ fontSize: "12px",textAlign:"left"}}>
                            <h4 style={{fontSize:"12px",}}> 
                              Engg: Applicable for Engg.
                              Department: When Returning. 
                            </h4>
                            
                          </div>
                          <div
                              style={{ background: "black", height: "2px", marginBottom:"5px",marginTop:"20px"}}
                          ></div>

                          <div>
                            
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

                        {/* 2nd Column  */}
                        <th style={{width:"16%"}}>
                          <div style={{height:"63px"}}>
                            <h4 style={{fontSize:"12px",}}>Expenditure Account No. Applicable for Dept. Other than Engg.</h4>
                          </div>
                          <div style={{background:"black",height:"1.5px"}}></div>
                          <div style={{height:"85px"}}></div>
                        </th>

                        {/* 3rd Column................. */}
                        <th style={{ width: "65%", border: "1px solid grey" }}>
                         <div>
                          <div style={{background:"black",width:"11.5%",height:"15px",marginTop:"-1px", borderTop:"1px solid black"}}></div>
                          <div style={{width:"88.4%"}}></div>
                         </div>
                         
                          
                 
                          {/* Table => Bottom Part ..............*/}
                          <>
                            <div
                              style={{
                                display: "flex",
                                width: "100%",
                               
                                height: "150px",
                              }}
                            >
                              <div
                                  style={{
                                    width: "1.9%",
                                    border: "1px solid black",
                                    background: "black"
                                  }}
                                ></div>
                              {/* <div
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
                              </div> */}

                              {(approvalStatus?.length <= 5 ) && (
                                <>
                                  <div
                                    style={{
                                      width: "19.7%",
                                      border: "1px solid grey",
                                    }}
                                  >
                                    <p>{ approvalStatus.length >= 4 ?  approvalStatus[0].workFlowAction : "" }</p>
                                    <p>{ approvalStatus.length >= 4 ?  approvalStatus[0].updatedByName : ""}</p>
                                    <p>ID NO: { approvalStatus.length >= 4 ?  approvalStatus[0].updatedBy : ""}</p>
                                  </div>
                                 
                                  <div
                                    style={{
                                      width: "19.7%",
                                      border: "1px solid grey",
                                    }}
                                  >
                                    <p>{approvalStatus.length  >=4? approvalStatus[1].workFlowAction : ""}</p>
                                    <p>{approvalStatus.length >=4 ? approvalStatus[1].updatedByName : ""}</p>
                                    <p>ID NO:{approvalStatus.length >=4 ? approvalStatus[1].updatedBy : ""}</p>
                                  </div>
                                  <div
                                    style={{
                                      width: "19.7%",
                                      border: "1px solid grey",
                                    }}
                                  >
                                    <p>{approvalStatus.length >= 4  ? approvalStatus[2].workFlowAction : ""}</p>
                                    <p>{approvalStatus.length >=4  ?  approvalStatus[2].updatedByName : ""}</p>
                                    <p>ID NO: {approvalStatus.length >=4  ?  approvalStatus[2].updatedBy : ""}</p>
                                  </div>
                                  <div
                                    style={{
                                      width: "19.7%",
                                      border: "1px solid grey",
                                    }}
                                  >
                                    <p>{approvalStatus.length  >=4? approvalStatus[3].workFlowAction : ""}</p>
                                    <p>{approvalStatus.length >=4 ?  approvalStatus[3].updatedByName : ""}</p>
                                    <p>ID NO: {approvalStatus.length >=4 ?  approvalStatus[3].updatedBy : ""}</p>
                                  </div>
                                  <div
                                    style={{
                                      width: "19.7%",
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
                </div>
              </div>
            </div>
          </div>
        </StoreVoucherPrintFormat>
      </ARMCard>
    </CommonLayout>
  );
};

export default PartsReturnDetailsPrint;
