import React, { useState } from 'react'
import ARMCard from '../../common/ARMCard'


import CommonLayout from '../../layout/CommonLayout'
import ARMButton from '../../common/buttons/ARMButton';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import logo from '../../../components/images/logo.svg';

const StockReturnRecipts = () => {
    const singleData=useState({}); 
    const priority =useState({}); 
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
  return (
   <CommonLayout>
        <ARMButton
                onClick={handlePrint}
                type="primary"
                style={{ marginLeft: '1350px' }}
                >
                Print this out!
        </ARMButton>

        <ARMCard title="Stock Return Recipt  Item Print">
        
            <div id="container" ref={componentRef}>
                

                <div className="Header" style={{width: "100%", height: "80px"}}>
                    <div style={{display:'flex' }} >
                        
                        <img alt={""} style={{float: "left", height: "70px", paddingTop:"10px"}} src={logo}/>

                        <h4 style={{
                            paddingTop: "20px",
                            fontSize: "20px",
                            fontWeight:"600",
                            
                            height: "70px",
                            width:"68%",
                            textAlign:'center',
                        
                        }}>
                            INTERRNAL RECEIPT ( STOCK RETURN) VOUCHER
                            <h5 style={{textAlign:'center'}} >  (USEABLE MATERIAL) </h5> 
                        </h4>     
                        
                        <div style={{fontWeight:"600", fontSize:"12px", textAlign:"right",paddingTop:"20px"}}>
                            <h5>APPENDIX:"BB" </h5>
                            <p> FORM NO: USBA/ENGG/STORE/028</p> 
                        </div>
                
                    </div>
                </div>

                <div className="row-1 To Be Completed" style={{width: "100%", height: "35px" }}>
                    <div style={{float: "left", width: "64%", height: "25px"}}>
                        <div style={{float: "left", width: "61%", height: "25px"}}>
                            <p style={{paddingTop: "15px", fontSize: "15px"}}>
                                TO BE COMPLETED BY RETURNING DEPARTMENT</p>
                        </div>

                        <div style={{float: "left", width: "2%", height: "100%", marginTop: "10px"}}>
                            <p
                                style={{float: "left", fontSize: "50px", marginTop: "-30px"}}><i
                                className="fa fa-caret-left"></i>
                            </p>
                        </div>
                        
                        <div style={{float: "left", width: "37%", height: "100%"}}>
                            <div style={{
                                width: "100%",
                                height: "15px",
                                backgroundColor: "black",
                                marginTop: "10px"
                            }}>

                            </div>
                        </div>
                    </div>
                    <div style={{float: "left", width: "1%", height: "25px"}}>
                        <div
                            style={{
                                height: "100%",
                                width: "16px",
                                margineft: "-1px",
                                backgroundColor: "black",
                                marginTop: "10px"
                            }}
                        ></div>
                    </div>
                        {/* <div style={{float: "right", width: "35%", height: "35px", fontSize: "10px"}}>
                            <span style={{float: "right"}}>Apendix "AA"</span><br/>
                            <span style={{float: "right"}}>Form No: USBA/Enggs/Storage/027</span>
                        </div> */}
                </div>

                <div className="row-2 Table Room Sl" style={{width: "100%"}}>
                    <div style={{float: "left", width: "64%", height: "80px"}}>
                        <table style={{width: "100%", height: "100%", fontSize: "12px"}}>
                            <thead>
                                <tr>
                                    <th>Room Sl No.</th>
                                    <th>Shop Dept No.</th>
                                    <th>Location No.</th>

                                    <th colspan={2} >
                                    
                                            <th  colspan={2} style={{width:'100%'}}>
                                                Work Ordersdfsldfjsdlfkjsdlfj
                                            </th >
                                            <th style={{borderColor:"white"}}/>
                                            
                                    
                                        <tr >
                                            <th>Serial No.</th>
                                            <th>Number</th>
                                        
                                        </tr>
                                    </th>
                                

                                
                                    <th>A/C Regn.</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <td>12345</td>
                                    <td>1234324</td>
                                    <td>23434</td>
                                    <td>2343243</td>
                                    <td>3432434</td>
                                    <td>Usbangla</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Black Color */}

                    <div style={{float: "left", width: "1.33%"}}>
                        <div style={{height: "80px", width: "100%", backgroundColor: "black"}}>
                        </div>
                    </div>

                    <div style={{float: "left", width: "34.67%", marginLft: "0px"}}>
                        <table style={{height: "80px", width: "100%", fontSize: "12px"}}>
                            <thead>
                            <tr>
                                <th>Stock Room No.</th>
                                <th>Return Voucher No.</th>
                                <th>Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>10020</td>
                                <td>12334349</td>
                                <td>08/09/2022</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className="row-3 gap" style={{width: "100%", height: "20px"}}>
                    <div style={{float: "left", width: "71%", height: "30px", marginLeft: "1px"}}>
                        <div style={{float: "left", width: "68%", height: "100%"}}>

                        </div>

                        <div style={{
                            float: "left",
                            width: "34.5%",
                            height: "100%",
                            marginTop: "-3px",
                            marginRight: "-1px",
                            marginLeft: "-78px"
                        }}>
                            <div style={{width: "100%", height: "15px", backgroundColor: "black"}}></div>
                        </div>

                    </div>

                    <div style={{float: "left", width: "28%", height: "30px"}}>
                    </div>
                </div>

                <div className="row -4 Table" style={{width: "100%", height:"390px", padding: "0px"}}>
                    <div style={{
                        float: "left",
                        width: "100%",
                        height: "450px",
                        marginTop: "-18px",
                        padding: "0px"
                    }}>

                        <table style={{fontSize: "12px", width: "100%", tableLayout: "fixed"}}>
                            <thead>
                            <tr>
                                <th style={{width: "4%"}}>S/N</th>
                                <th style={{width: "10%"}}>Part NO.</th>
                                <th style={{width: "13%"}}>Description</th>
                                <th style={{width: "8%"}}>Unit</th>
                                <th style={{width: "5%"}}>Qty. Return</th>
                                <th style={{width: "1.33%", backgroundColor: "black"}}></th>
                                <th style={{width: "8%"}}>Unserviceable Qty</th>
                                <th style={{width: "8%"}}>Serviceable Qty.</th>
                                <th style={{width: "8%"}}>Card Line No.</th>
                                <th style={{width: "8%"}}>Relase No.</th>
                                <th style={{width: "8%"}}>Unit Price:</th>
                                <th style={{width: "16%"}}>Total Price</th>
                            </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td style={{textAlign:"center"}}>123</td>
                                    <td style={{textAlign:"center"}}>3434</td>
                                    <td style={{textAlign:"center"}}>123</td>
                                    <td style={{textAlign:"center"}}>3434</td>
                                    <td style={{textAlign:"center"}}>123</td>
                                    <td style={{backgroundColor: "black"}}></td>
                                    <td style={{textAlign:"center"}}>123</td>
                                    <td style={{textAlign:"center"}}>3434</td>
                                    <td style={{textAlign:"center"}}>123</td>
                                    <td style={{textAlign:"center"}}>3434</td>
                                    <td style={{textAlign:"center"}}>123</td>
                                    <tr style={{ width:"16%",rowspan:"2"}}>
                                        <td style={{textAlign:"center", width:"8%",rowspan:"2"}}>3434</td>
                                        <td style={{textAlign:"center", width:"8%",rowspan:"2"}}>123</td>
                                    </tr>
                                    
                                    {/* <td colspan>
                                        <tr>
                                            <td>123</td>
                                            <td>234</td>
                                        </tr>
                                    </td> */}
                                </tr>
                                <tr>
                                    <td style={{textAlign:"center"}}>123</td>
                                    <td style={{textAlign:"center"}}>3434</td>
                                    <td style={{textAlign:"center"}}>123</td>
                                    <td style={{textAlign:"center"}}>3434</td>
                                    <td style={{textAlign:"center"}}>123</td>
                                    <td style={{backgroundColor: "black"}}></td>
                                    <td style={{textAlign:"center"}}>123</td>
                                    <td style={{textAlign:"center"}}>3434</td>
                                    <td style={{textAlign:"center"}}>123</td>
                                    <td style={{textAlign:"center"}}>3434</td>
                                    <td style={{textAlign:"center"}}>123</td>
                                    <tr style={{ width:"16%",rowspan:"2"}}>
                                        <td style={{textAlign:"center", width:"8%",rowspan:"2"}}>3434</td>
                                        <td style={{textAlign:"center", width:"8%",rowspan:"2"}}>123</td>
                                    </tr>
                                    
                                    {/* <td colspan>
                                        <tr>
                                            <td>123</td>
                                            <td>234</td>
                                        </tr>
                                    </td> */}
                                </tr>
                                

                                {
                                    // singleData.storeDemandDetailsDtoList?.map((data, i) => (
                                    //     <tr key={i}>
                                    //         <td key="10">{i + 1}</td>
                                    //         <td key="AbCD">{data.partNo}</td>
                                    //         <td key={data.id}>{data.partDescription}</td>
                                    //         <td key={data.id}>{data.unitMeasurementCode}</td>
                                    //         <td key={data.id}>{data.quantityRequested}</td>

                                    //         <td style={{backgroundColor: "black"}} key={i}></td>
                                    //         <td key={i}>34</td>
                                    //         <td key={i}>34</td>
                                    //         <td key={i}>34</td>
                                    //         <td key={i}>34</td>
                                    //         <td key={i}>34</td>
                                    //         <td key={i}>34</td>
                                    //         <td key={i}>34</td>
                                    //     </tr>

                                    // ))
                                }

                            </tbody>
                        </table>
                

                        <div className="Last Row " style={{
                            height:"100px",width: "100%", borderStyle: "solid",
                            borderWidth: "1px",
                            marginTop:"148px",
                            
                        }}>

                            <div >
                                
                                <div className='Box-1'
                                    style={{
                                        border: "1px solid black",
                                        height: "150px",
                                        width: "185px",
                                        
                                        marginTop: "-150px"
                                    }}
                                >
                                    <div style={{fontSize:'10px' , fontWeight:"500", paddingLeft:"5px",height:"55px"}}>
                                        <p>Engg: Applicable for Engg. </p>
                                        <p>Department: When Returning.</p>
                                    
                                    </div>
                                    <div style={{borderBottom: "1px solid black"}}> </div>
                                    
                                    <div>
                                        <h5 style={{paddingLeft:"5px"}}>
                                            <input type="checkbox" /> Material <br/>
                                            <input type="checkbox" /> Shop Supplies <br/>
                                            <input type="checkbox" /> Grocery <br/>
                                            <input type="checkbox" /> Cloth <br/>

                                        </h5>
                                     
                                    </div>
                                   
                                </div>
                                
                                <div className='Box-2'
                                    style={{
                                        border: "1px solid black",
                                        height: "150px",
                                        width: "134px",
                                        marginLeft: "185px",
                                        marginTop: "-150px", 
                                      
                                    }}
                                >
                                   <div style={{fontSize:'10px' , fontWeight:"500", paddingLeft:"5px", height:"55px"}}>
                                        <p>Expenditure Account No. <br/>
                                         Applicable for Dept. Other than Engg. </p>                                    
                                    </div>
                                    <div style={{borderBottom: "1px solid black"}}> </div>

                                </div>
                                <div className='Box-3'
                                    style={{
                                        border: "1px solid black",
                                        height: "150px",
                                        width: "115px",
                                        marginLeft: "318px",
                                        marginTop: "-150px",
                                    }}
                                >
                                    <div style={{height:"50px",paddingLeft:"5px"}}>
                                        Returning Officer 
                                    </div>

                                    <div>
                                        <div style={{fontSize:"12px",paddingLeft:"5px"}}>
                                            <h5>
                                                    Staff No.  
                                                    <span> ....................</span>
                                                </h5>
                                                <h5>
                                                    ID No.   
                                                    <span> ........................</span>
                                                </h5>
                                                <h5>
                                                Date  
                                                <span> ...........................</span>
                                            </h5>
                                       </div>
                                    </div>

                                </div>
                                {/* middle black bar */}

                                <div   className='Black Line'
                                    style={{
                                        border: "1px solid black",
                                        height: "150px",
                                        width: "17px",
                                        marginLeft: "433px",
                                        marginTop: "-149px",

                                        backgroundColor: "black"
                                    }}
                                />
                                


                                <div className='Box-4'
                                    style={{
                                        border: "1px solid black",
                                        height: "150px",
                                        width: "150px",
                                        marginLeft: "448px",
                                        marginTop: "-150px",
                                    }}
                                >
                                    <div style={{height:"50px",paddingLeft:"5px"}}>
                                        Return Approved by
                                    </div>

                                    <div>
                                        <div style={{fontSize:"12px",paddingLeft:"5px"}}>
                                            <h5>
                                                    Designation  
                                                    <span> ...........................</span>
                                                </h5>
                                                <h5>
                                                    ID No.   
                                                    <span> .....................................</span>
                                                </h5>
                                                <h5>
                                                Date  
                                                <span> ........................................</span>
                                            </h5>
                                       </div>
                                    </div>


                                </div>

                                <div className='Box-5'
                                    style={{
                                        border: "1px solid black",
                                        height: "150px",
                                        width: "151px",
                                        marginLeft: "597px",
                                        marginTop: "-150px",
                                       
                                    }}
                                >
                                    <div style={{height:"50px",paddingLeft:"5px"}}>
                                        Return Personal/Staff
                                    </div>

                                    <div>
                                        <div style={{fontSize:"12px",paddingLeft:"5px"}}>
                                            <h5>
                                                Sign   
                                                <span> .........................................</span>
                                            </h5>
                                            <h5>
                                                Staff No.   
                                                <span> .................................</span>
                                            </h5>
                                            <h5>
                                                Date  
                                                <span> .........................................</span>
                                            </h5>
                                       </div>
                                    </div>

                                </div>
                                <div className='Box-6'
                                    style={{
                                        border: "1px solid black",
                                        height: "150px",
                                        width: "150px",
                                        marginLeft: "747px",
                                        marginTop: "-150px",
                                      
                                    }}
                                >
                                    <div style={{height:"50px"}}>
                                        Accepting Store Keeper Name: 
                                    </div>

                                    <div>
                                        <div style={{fontSize:"12px",paddingLeft:"5px"}}>
                                            <h5>
                                                Sign   
                                                <span> .........................................</span>
                                            </h5>
                                            <h5>
                                                Staff No.   
                                                <span> .................................</span>
                                            </h5>
                                            <h5>
                                                Date  
                                                <span> .........................................</span>
                                            </h5>
                                       </div>
                                    </div>

                                </div>
                                <div className='Box-7'
                                    style={{
                                        border: "1px solid black",
                                        height: "150px",
                                        width: "163px",
                                        marginLeft: "896px",
                                        marginTop: "-150px",
                                      
                                    }}
                                >
                                    <div style={{height:"50px"}}>
                                        Entered on Bin Card and Computer
                                    </div>

                                    <div>
                                        <div style={{fontSize:"12px",paddingLeft:"5px"}}>
                                            <h5>
                                                    Sign   
                                                    <span> .............................................</span>
                                                </h5>
                                                <h5>
                                                    Staff No.   
                                                    <span> ......................................</span>
                                                </h5>
                                                <h5>
                                                Date  
                                                <span> ..............................................</span>
                                            </h5>
                                       </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4>
                                    <b>DISTRIBUTION: </b>TO BE PREPARED IN TRIPLERUPLICATE AND DISTRIBUTED AS FOLLOWS : 1. ORIGINAL-store accounts
                                    2. DDUPLICATS-store-room  3. TRIPLICAT-returner's copy. ISSUE:02 REV.00 DATE 
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>

                    
            

            </div>
           

        </ARMCard>
   </CommonLayout>
  )
}

export default StockReturnRecipts