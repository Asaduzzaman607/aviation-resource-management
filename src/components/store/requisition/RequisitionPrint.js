
import {Breadcrumb,Button,Col,Row, Select} from "antd";
import React, {useEffect, useState} from "react";
import { Link,useParams } from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import {ArrowLeftOutlined, PrinterOutlined} from "@ant-design/icons";
import {useReactToPrint} from "react-to-print";
import {createRef} from "react";
import StoreVoucherPrintFormat from "../../../lib/common/StoreVoucherPrintFormat";
import logo from "../../images/us-bangla-logo.png";
import ProqurementRequisitionService from "../../../service/procurment/ProqurementRequisitionService";


const ApprovedRequisitionPrint = () => {
    let {id} = useParams();
    const [datareq,setReqData] = useState([]); 
    const componentRef = createRef();
    const [approvalStatus,setApprovalStatus] = useState([]); 
    
    console.log("DataRequest is : ", datareq); 
   const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    useEffect(()=>{
        getrequisition(id); 
    },[id]);

    const getrequisition = async(id)=>{ 
        const { data } = await ProqurementRequisitionService.getRequisitionById(id)
        console.log("All reqisition Data is ; ",data)
        setReqData(data);
        let approvalStatusList=[]; 
        for(const approveStatus in data.approvalStatuses){
            approvalStatusList.push(data.approvalStatuses[approveStatus])
        }
        setApprovalStatus(approvalStatusList);
    }
    console.log("Approval Status : ", approvalStatus); 

    return (
        <CommonLayout>

            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <i className="fas fa-archive" />
                        <Link to='/store'>
                            &nbsp; Store
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to ="/store/material-management/requisition/approved">
                            Approve Requisition
                        </Link>
                       
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={`/store/material-management/requisition/approved/details/${id}`}>
                            Approved Requisition Details
                        </Link> 
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={`/store/material-management/requisition/approved/details/print/${id}`}>
                            Approved Requisition Print
                        </Link> 
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

            <ARMCard
                title={
                    <Row justify="space-between">
                        <Col>Requisition  Print</Col>
                        <Col>
                            <Button type="primary" style={{backgroundColor: '#04aa6d', borderColor: 'transparent', borderRadius: '5px'}}>
                                <Link title="back" to={`/store/material-management/requisition/approved/details/${id}`}><ArrowLeftOutlined /> Back</Link>
                            </Button>  &nbsp;&nbsp; &nbsp;&nbsp;
                            <ARMButton type="primary" icon={<PrinterOutlined/>} onClick={handlePrint}>Print</ARMButton>
                        </Col>
                    </Row>
                }
            >
                <StoreVoucherPrintFormat>
                    <div id="container" ref={componentRef} >
                        <div style={{padding:"20px"}}>
                            <div className="row" style={{width: "100%", height: "100px", textAlign:"center"}}>
                                <img alt={""} style={{ height: "60px"}} src={logo}/>
                                <h4 style={{marginTop:"10px",paddingLeft:"25px", fontSize:"20px",fontWeight:"600"}}>Requisition for Items</h4>
                            </div>
                            <Row>
                                <Col span={8} order={3}>
                                    <h4 style={{textAlign:"left"}}>Requisition No: {datareq.voucherNo}</h4> 
                                </Col>
                                <Col span={8} order={3} >
                                    <h4 style={{textAlign:"center"}}> </h4>
                                </Col>
                                <Col span={8} order={3} >
                                    <h4 style={{textAlign:"right"}}>Date: {datareq.createdDate}</h4>
                                </Col>
                            </Row>
                            <table style={{width: "100%",fontSize:"10px",border:"1px solid grey"}}>
                                <thead>

                                    <tr>
                                        <th style={{width:"",border:"1px solid grey"}}>S/N</th> 
                                        <th style={{width:"",border:"1px solid grey"}}>Part Number</th> 
                                        <th style={{width:"",border:"1px solid grey"}}>Description</th>
                                        <th style={{width:"",border:"1px solid grey"}}>IPC/CMM Ref</th>
                                        <th style={{width:"",border:"1px solid grey"}}>Manufacturer/Supplier</th> 
                                        <th style={{width:"",border:"1px solid grey"}}>Demand By</th>
                                        <th style={{width:"",border:"1px solid grey"}}>For A/C</th> 
                                        <th style={{width:"",border:"1px solid grey"}}>Demand Qty.</th> 
                                        <th style={{width:"",border:"1px solid grey"}}>Order Qty.</th>
                                        <th style={{width:"",border:"1px solid grey"}}>Present Stock</th> 
                                        <th style={{width:"",border:"1px solid grey"}}>Remarks</th>
                                        <th style={{width:"",border:"1px solid grey"}}>Previous Price</th>
                                        <th style={{width:"",border:"1px solid grey"}}>Priority</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {

                                    datareq.requisitionItemViewModels?.map((item,index)=>(
                                        <tr key={index}>
                                             <td style={{textAlign:"center",width:"",border:"1px solid grey"}}>{item.id}</td>
                                            <td style={{textAlign:"center",width:"",border:"1px solid grey"}}>{item.partNo}</td> 
                                            <td style={{textAlign:"center",width:"",border:"1px solid grey"}}>{item.partDescription}</td> 
                                            <td style={{textAlign:"center",width:"",border:"1px solid grey"}}>{item.ipcCmm}</td>
                                            <td style={{textAlign:"center",width:"",border:"1px solid grey"}}></td>
                                            <td style={{textAlign:"center",width:"",border:"1px solid grey"}}>{item.department}</td>
                                            <td style={{textAlign:"center",width:"",border:"1px solid grey"}}>{item.aircraftName}</td>
                                            <td style={{textAlign:"center",width:"",border:"1px solid grey"}}>{item.quantityDemanded}</td>
                                            <td style={{textAlign:"center",width:"",border:"1px solid grey"}}>{item.requisitionQuantity}</td>
                                            <td style={{textAlign:"center",width:"",border:"1px solid grey"}}>{item.availablePart}</td>
                                            <td style={{textAlign:"center",width:"",border:"1px solid grey"}}>{item.remark}</td>
                                            <td style={{textAlign:"center",width:"",border:"1px solid grey"}}></td>
                                            <td style={{textAlign:"center",width:"",border:"1px solid grey"}}>{item.requisitionPriority}</td>
                                        </tr>
                                    ))
                                }

                              
                                    
                                </tbody>
                                
                            </table>
                            <div><p style={{fontSize:"8px",}}>512/209/2432/24323432</p></div>

                            <table style={{width:"100%",height:"100px",fontSize:"12px", fontWeight:"400", backgroundColor:"white"}}>
                                <thead> 
                                    <tr>
                                {
                                    approvalStatus?.map((data, i) => (
                                      <th style={{textAlign: "center", border: "1px solid gray"}}>
                                          <p> {data.workFlowAction} BY</p>
                                          <p>{data.updatedByName}</p>
                                          <p>{data.updateByDesignation}</p>
                                          <p>Engineering Procurement</p>
                                      </th>
                                        
                                   
                                    ))
                                }
                                </tr>
                               </thead>
                            </table>
                        </div>
                    </div>  
                </StoreVoucherPrintFormat>
            </ARMCard>
        </CommonLayout>
    )
}
export default ApprovedRequisitionPrint