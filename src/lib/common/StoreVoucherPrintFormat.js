import styled from "styled-components";

const StoreVoucherPrintFormat = styled.div`
  table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
  }
  
  #container {
    width: 1100px;
    height: 100%;
    position: relative;
    margin: 0 auto;
    padding: 0 20px;
  }

  p, i {
    margin: 0;
    padding: 0;
  }

  span {
    content: "\\27A7";
  }

  tr {
    height: 30px;
  }

  td{
  height: 25px;
}

  .column {
    float: left;
    width: 14%;
  }


  .row:after {
    content: "";
    display: table;
    clear: both;
  }

  .thrd {
    background-color: red;
    width: 40px !important;
    font-size: 10px;
  }
`
export default StoreVoucherPrintFormat