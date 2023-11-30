import styled from "styled-components";

const ARMTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #ffffff;
  }
  th {
    text-transform: capitalize;
    border: 1px solid lightgrey;
    text-align: center;
  }

  td {
    border: 1px solid lightgrey;
    text-align: center;
    //text-transform: capitalize;
  }

  thead tr th,
  tbody tr td {
    padding: 7px 0;
  }

  tbody tr:nth-child(odd) {
    background: #ffffff;
  }

  tbody tr:nth-child(even) {
    background: #ffffff;
  }
	
  tbody tr:hover {
    background: #fafafa;
    // cursor: pointer;
  }
`;

export default ARMTable;
