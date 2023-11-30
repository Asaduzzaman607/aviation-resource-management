import styled from "styled-components";
import { Card } from "antd";

const DashboardCard = styled(Card)`
  .ant-card-body {
    background-color: #1c2c55;
    padding: 50px 0;
  }
  .ant-card-body h3 {
    text-transform: uppercase;
  }
  .ant-card-body h3,
  i {
    color: #bcd8e5;
  }
  .ant-card-body i {
    font-size: 3rem;
    margin-bottom: 8px;
  }
`;

export default DashboardCard;
