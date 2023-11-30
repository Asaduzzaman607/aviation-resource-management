import styled from "styled-components";

export const ARMReportTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #ffffff;
  }

  th {
    text-transform: uppercase;
    border: 1px solid darkgray;
    text-align: center;
  }

  td {
    border: 1px solid darkgray;
    text-align: center;
  }

  thead tr th,
  tbody tr td {
    //padding: 7px 0;
    font-size: 12px;
  }

  tbody tr:nth-child(odd) {
    background: #ffffff;
  }

  tbody tr:nth-child(even) {
    background: #ffffff;
  }

  tbody tr:hover {
    background: #fafafa;
    cursor: default;
  }

  .red-cell {
    background-color: #b71c1c !important;
    color: white;
  }
`