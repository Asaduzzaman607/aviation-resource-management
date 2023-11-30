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

const StoreInspectionPrint = () => {
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

  console.log("Approval Status : ", approvalStatus);

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
            <Col>Issue Details Print</Col>
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
          <div id="container" style={{padding:"20px"}} ref={componentRef}>
            <Col>
              <Row>
                <div style={{width:"100%",display:"block"}}>
                  
                  <div>
                    <img
                          alt={""}
                          style={{ float: "left", height: "70px" }}
                          src={logo}
                      />
                  </div>
                  <div
                      style={{
                        // paddingBottom: "5px",
                        float:"right", 
                    
                        // height: "35px",
                        // fontSize: "10px",
                      
                      }}
                    >
                    <h3 style={{fontWeight: 800,fontSize:"16px", marginBottom: "25px",paddingLeft:"105px"}}>Appendix : DE</h3>
                    <div style={{border:"1px solid grey",fontSize:"14px", padding: "10px"}}>
                        <h4>Form no: USBA/STI/300/063</h4> 
                        <h4>Issue : Initial Date : 11/02/2022</h4> 
                    </div>
                    
                  </div>
                </div>
              </Row>
              

              <Row>
                <Col>
                  <h4>US-Bangla Airlines Limited </h4> 
                  <p>Store Inspection Section </p> 
                  <p>HSIA, Kurmitola Dhaka - 1229</p>  
                  <div style={{height:"1px", background:"black"}}></div>
                </Col>
              </Row><br/>
              <Row style={{paddingBottom:"10px"}}>
                    <p>Aircraft Component/Spare-Parts/Tools/Test Equipment Received Inspection Record Form. </p>
              </Row>
              <div style={{border:"1px solid black", width:"100%"}}>
                <Row>
                  <Col style={{float:"left", width:"50%", padding:"15px"}}>
                     <div>
                        <p>Nomenclature : .....................................................</p>
                        <p>Part Number :  .....................................................</p>
                        <p>Serial Number :  .....................................................</p>
                     </div>
                  </Col>
                  <Col style={{float:"right", width:"50%", padding:"15px"}}>
                    <div>
                      <p>Date :  .....................................................</p>
                      <p>Work order/P.O Number :  .....................................................</p>
                      <p>Date : .....................................................</p>
                    </div>
                    
                  </Col>
                  
                </Row>
              </div>
              <table style={{width:"100%", textAlign:"center"}}>
                    <thead>
                      <th>Sl no.</th>
                      <th>Description of Inspection</th> 
                      <th>SAT</th>
                      <th>UNSAT</th>
                      <th>N/A</th>
                    </thead>
                    <tbody>
                      <tr>
                          <td>
                            01
                          </td>
                          <td>Check Packaging for Physical damage.</td>
                          <td></td>
                          <td></td>
                          <td></td>
                      </tr>
                      <tr>
                          <td>
                            02
                          </td>
                          <td>Check Packaging for Physical damage.</td>
                          <td></td>
                          <td></td>
                          <td></td>
                      </tr>
                      <tr>
                          <td>
                            03
                          </td>
                          <td>Check Packaging for Physical damage.</td>
                          <td></td>
                          <td></td>
                          <td></td>
                      </tr>
                      <tr>
                          <td>
                            04
                          </td>
                          <td>Check Packaging for Physical damage.</td>
                          <td></td>
                          <td></td>
                          <td></td>
                      </tr>
                      <tr>
                          <td>
                            05
                          </td>
                          <td>Check Packaging for Physical damage.</td>
                          <td></td>
                          <td></td>
                          <td></td>
                      </tr>
                      <tr>
                          <td>
                            06
                          </td>
                          <td>Check Packaging for Physical damage.</td>
                          <td></td>
                          <td></td>
                          <td></td>
                      </tr>
                      <tr>
                          <td>
                            07
                          </td>
                          <td>Check Packaging for Physical damage.</td>
                          <td></td>
                          <td></td>
                          <td></td>
                      </tr>
                      <tr>
                          <td>
                            08
                          </td>
                          <td>Check Packaging for Physical damage.</td>
                          <td></td>
                          <td></td>
                          <td></td>
                      </tr>
                    </tbody>
              </table>

              <Row style={{marginTop:"20px",marginBottom:"20px"}}>
                Store Inspector Comments : <b>Acceptable/Not acceptable </b>(if not acceptable mention the reason below)
              </Row>
              <Row style={{width:"100%"}}>
              .........................................................................................................................................................................................................................................................................................................................................................
              </Row>
              <br/><br/><br/>

              
              <div style={{background:"black",height:"1px",width:"200px"}}></div>
              <div>
                <p>Signature & Authority number</p>
                <p>Duty Store Inspector</p>
              </div>

              <Row>
                <h4 style={{float:"left"}}>Isssue: 01</h4> 
                <h4>Revision: 00</h4> 
                <h4 style={{float:"right"}}>Date: </h4> 
                
              </Row>

            </Col>
           
           
            
          </div>
        </StoreVoucherPrintFormat>
      </ARMCard>
    </CommonLayout>
  );
};

export default StoreInspectionPrint;
