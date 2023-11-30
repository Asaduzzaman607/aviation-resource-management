import React, { useState } from 'react'
import ARMCard from '../../common/ARMCard'
import {Link, useParams} from "react-router-dom";
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import { Breadcrumb,Col,Row } from 'antd';
import CommonLayout from '../../layout/CommonLayout'
import ARMButton from '../../common/buttons/ARMButton';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import {PrinterOutlined} from "@ant-design/icons";
import logo from '../../../components/images/logo.svg';

const AuthorizationPrint = () => {
    const singleData=useState({}); 
    const priority =useState({}); 
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
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
                        <Link to="/store/approve-issues">
                            &nbsp;Approved Issue Demands
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        &nbsp;Authorized Release Certificate CAAB 
                    </Breadcrumb.Item>
                </Breadcrumb>
        </ARMBreadCrumbs>

        <ARMCard 
            title=
            {
                <Row justify="space-between">
                    <Col>Approved Issue Demand Print</Col>
                    <Col>
                        <ARMButton type="primary" icon={<PrinterOutlined/>} onClick={handlePrint}>Print</ARMButton>
                    </Col>
                </Row>
            }
        >
        
            <div id="container" ref={componentRef}>
               <div style={{paddingTop:"20px"}}>
               <table style={{width:"100%", textAlign:"left"}}>
                   <tr style={{verticalAlign: "top" }}>
                        <th style={{width:"30%", paddingLeft:"5px"}}>
                            1 . Civil Aviation Authority of Bangladesh
                        </th>
                    <th style={{width:"35%" , fontWeight:"600",fontSize:"20px", textAlign:"Center"}}>
                        2 . AUTHORIZED RELEASE CERTIFICATE CAAB FORM 1 
                    </th> 
                    <th style={{width:"35%", paddingLeft:"5px"}}>
                        3. Form Tracking Number :
                        <tr style={{width:"100%"}}>
                            <th style={{width:"11%"}}>w</th>
                            <th style={{width:"11%"}}>4</th>
                            <th style={{width:"11%"}}>2</th>
                            <th style={{width:"11.05%"}}>9</th>
                            <th style={{width:"11.1%"}}>/</th>
                            <th style={{width:"11.1%"}}>2</th>
                            <th style={{width:"11.05%"}}>0</th>
                            <th style={{width:"11.12%"}}>2</th>
                            <th style={{width:"11%"}}>2 </th>
                            <th style={{borderStyle:"none"}}/>
                        </tr>
                    </th>
                   </tr>
                </table>
                <table style={{width:"100%"}}>
                    <tr >
                        <th  style={{paddingLeft:"5px",width:"70%"}} > 
                            <span style={{float:"left"}}>4</span>
                            <div>
                              
                                <img alt={""} style={{float: "left", height: "70px", width:"120px"}} src={logo}/>
                            </div>
                            <div>
                                Origination Name and Address USBangla Airlines, 77, Sohrawardi Avenue. 
                                Baridhara Diplomatic Diplomatic Zone, Dhaka-1212, Bangladesh
                            </div>
                        </th>
                        <th style={{width:"30%"}}>
                            5. Work Order/Contract/Invoice Number: USBA/STR/W&B/22/591 DT: 18.08.2022
                        </th>
                    </tr>
                </table>
                <table style={{width:"100%" }}>
                    <thead style={{height:"60px"}}>
                        <tr >
                            <th>6. Item </th> 
                            <th>7. Description</th>
                            <th>8. Part Name</th> 
                            <th>9. Quantity</th>
                            <th>10. Serial/Batch Number </th>
                            <th>11. Status/Work</th> 
                        </tr>

                    </thead>
                    <tbody style={{textAlign : "center" , fontWeight:"650",height:"60px", fontSize:"14px"}}>
                        <td>01</td>
                        <td>MAIN WHEEL ASSY </td> 
                        <td>2612311-1</td> 
                        <td>01 EA </td> 
                        <td>B 11797</td>
                        <td>REPAIRED</td>
                    </tbody>
                </table>
                
                <table style={{width:"100%"}}>
                    <div style={{width:"100%" , paddingLeft:"5px"}}>
                        <h4><b>12 .</b>Remarks</h4>
                        <h5>
                            MAIN WHEEL ASSY DISASSEMBLED.INSPECTED, EDDY CURRENT CARRIED OUT AND ASSEMBLED WITH NEW TIRE P/NO: APS06015.
                            S/NO: 122Y(208 LAW HONEYWELL CMM. CH: 32-40-14 REV-11. DATED 07 AUG FEB 2022, AMM 12-15-51, REV.78. DT. 15.06.2022,
                            SPM 32-48-01 REV-04 AND INLATED TO REQUIRED PRESSURE, LEAK TEST C/OUT FOUNT SAT. )
                        </h5>
                    </div>
                </table>
                <table style={{width:"100%"}}>
                    <tr >
                        <td style={{width:"60%",paddingLeft:"5px"}}>
                            <b>13a.</b> Certifies the items identified above were manufactured in confornity to : 
                            <br/>
                            <input type="checkbox"/>  Approved design data and are in condition safe operation <br/>
                            <input type="checkbox"/>  Approved design data and are in condition safe operation
                        </td>
                        <td style={{width:"40%" , paddingLeft:"5px"}}>
                            <b>14a. </b>
                            <input type="checkbox" />&nbsp; Part 145 A 50 Release to Service  &nbsp;
                            <input type="checkbox" /> &nbsp; Other regulation specified in Block 12. 
                            Other regulation specified in Block 12. 
                            Other regulation specified in Block 12. 
                            Other regulation specified in Block 12. 
                            Other regulation specified in Block 12. 

                        </td>
                   
                    </tr>
                </table>
                <table style={{width:"100%",}}>

                    <tr style={{height:"50px",verticalAlign: "top"}}>
                        <td style={{width:"20%"}}>
                            <b>13b. Authorize Signature: </b>
                        </td>
                        <td style={{width:"20%"}}>
                            <b>13b. Authorize Signature: </b>
                        </td>
                        <td style={{width:"35%"}}>
                            <b>13b. Authorize Signature: </b>
                        </td>
                        <td style={{width:"25%"}}>
                            <b>13b. Authorize Signature: </b>
                        </td>

                    </tr>
                    <tr style={{height:"50px", verticalAlign: "top"}}>
                        <td style={{width:"20%"}}>
                            <b>13b. Authorize Signature: </b>
                        </td>
                        <td style={{width:"20%"}}>
                            <b>13b. Authorize Signature: </b>
                        </td>
                        <td style={{width:"35%"}}>
                            <b>13b. Authorize Signature: </b>
                        </td>
                        <td style={{width:"25%"}}>
                            <b>13b. Authorize Signature: </b>
                        </td>

                    </tr>
                </table>
                <table style={{width:"100%"}}>
                    <tr >
                        <h2 > User / Installer Responsibilities </h2> 
                        <p> 
                            MAIN WHEEL ASSY DISASSEMBLED.INSPECTED, EDDY CURRENT CARRIED OUT AND ASSEMBLED WITH NEW TIRE P/NO: APS06015.
                            S/NO: 122Y(208 LAW HONEYWELL CMM. CH: 32-40-14 REV-11. DATED 07 AUG FEB 2022, AMM 12-15-51, REV.78. DT. 15.06.2022,
                            SPM 32-48-01 REV-04 AND INLATED TO REQUIRED PRESSURE, LEAK TEST C/OUT FOUNT SAT. )
                        </p>
                    </tr>
                </table>
             
                <div style={{width:"100%",height:"50px",margin:"0 auto", paddingTop:"10px"}}>
                   <div style={{width:"33%",float:"left"}}>CAAB FORM 1</div>
                   <div style={{width:"33%",float:"right",paddingLeft:"90px"}}>USBA/ENGG/MAINT/10</div>
                   <div style={{width:"33%",float: "right", paddingLeft:"50px",borderStyle:"solid " ,borderWidth:"1px"  }}>GRN/USBA - 022 /22</div>
                    
                </div>
               </div>
                

            </div>
        

        </ARMCard>
      
   </CommonLayout>
  )
}

export default AuthorizationPrint