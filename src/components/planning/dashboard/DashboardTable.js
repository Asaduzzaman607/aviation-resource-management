import React from "react";
import styled from "styled-components";
import ResponsiveTable from "../../common/ResposnsiveTable";
import { ARMReportTable } from "../report/ARMReportTable";

const CustomDiv = styled.div`
  .table {
    display: grid;
    grid-template-columns: 1fr 1.5fr 2.5fr 1fr 1.5fr;
    margin-bottom: 10;
  }
  .column {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5;
    border-bottom: 1px solid #e0dcdc;
  }
  .headerColumn {
    display: flex;
    align-items: center;
    padding: 5;
    border-bottom: 1px solid #e0dcdc;
    min-height: 50;
    color: black;
    align-content: center;
    justify-content: center;
    //border-top: 1px solid #2d5685;
    border-bottom: 2px solid #2d5685;
    padding: 5px 0px;
  }
  .headeBreakrColumn {
    display: flex;
    align-items: center;
    padding: 5;
    border-bottom: 1px solid black;
    min-height: 50;
    color: black;
    align-content: center;
    // border-top: 1px solid #2d5685;
    border-bottom: 2px solid #2d5685;
    padding: 5px 0px;
  }
  .breakBox {
    display: grid;
    grid-template-columns: 0.5fr;
    width: 100%;
  }
  .breakPoint {
    border-bottom: 2px solid black;
    text-align: center;
    padding-bottom: 5;
  }
  .innerThreeBlock {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-content: center;
    padding-top: 5;
    justify-content: space-between;
    text-align: center;
  }
  .innerThreeBlock1 {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-content: center;
    padding-top: 5;
    justify-content: space-between;
    text-align: center;
  }
  .ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    font-size: 14;
  }
  .lgItem {
    font-size: 18;
    margin-bottom: 10;
  }
  .smItem {
    font-size: 14;
    margin-top: 10;
  }
`;

const DashboardTable = () => {
  return (
    // <CustomDiv>
    //   <div className="table">
    //     <div className="headerColumn">Aircraft Reg</div>
    //     <div className="headeBreakrColumn">
    //       <div className="breakBox">
    //         <div className="breakPoint">Aircraft</div>
    //         <div className="innerThreeBlock">
    //           <div>Total Hour</div>
    //           <div>Total Cycle</div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="headeBreakrColumn">
    //       <div className="breakBox">
    //         <div className="breakPoint">Aircraft</div>
    //         <div className="innerThreeBlock">
    //           <div>A Check Rem. Hour</div>
    //           <div>A Check Rem. Day</div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="headerColumn">Mel</div>
    //     <div className="headeBreakrColumn">
    //       <div className="breakBox">
    //         <div className="breakPoint">Nearest E. due date</div>
    //         <div className="innerThreeBlock1">
    //           <div>AMP</div>
    //           <div>AD</div>
    //           <div>SB</div>
    //           <div>OTHERS</div>

    //         </div>
    //       </div>
    //     </div>

    //     {[1, 2, 3, 4].map((item) => (
    //       <>
    //         <div className="column">
    //           {/* style={{ backgroundColor: "#64b754" }} */}
    //           <ul className="ul">
    //             <li className="lgItem">Hello data</li>
    //             {/* <li>Hello data</li>
    //             <li>Hello data</li> */}
    //             <li className="smItem">Hello data</li>
    //           </ul>
    //         </div>
    //         <div className="column">
    //           <div className="breakBox">
    //             <div className="innerThreeBlock">
    //               <div>data</div>
    //               <div>data</div>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="column">
    //           <div className="breakBox">
    //             <div className="innerThreeBlock">
    //               <div>data</div>
    //               <div>data</div>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="column">
    //         <ul className="ul">
    //             <li className="lgItem">Hello data</li>
    //              <li>Hello data</li>
    //             <li className="smItem">Hello data</li>
    //           </ul>
    //         </div>

    //         <div className="column">
    //           <div className="breakBox">
    //             <div className="innerThreeBlock1">
    //               <div>data</div>
    //               <div>data</div>
    //               <div>data</div>
    //               <div>data</div>
    //             </div>
    //           </div>
    //         </div>
    //       </>
    //     ))}
    //   </div>
    // </CustomDiv>
  <>
  pp
  </>
  );
};

export default DashboardTable;
