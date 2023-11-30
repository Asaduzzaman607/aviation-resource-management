import styled from "styled-components";
import { Button } from "antd";


  const StatusButton = styled(Button)`
    background-color: green;
    width: 70px;
    border: none;
    :hover, :focus {
      background-color: green;
      border: none;
    }
  `;

export default StatusButton