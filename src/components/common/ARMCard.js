import { Card } from 'antd';
import styled from 'styled-components';

const ARMCard = styled(Card)`
  &.ant-card {
    border-radius: 20px;
    overflow: hidden;
    margin: 5px;
    box-shadow: 5px 5px 5px 5px rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  .ant-list-item:hover {
    transition: 0.3s;
    background-color: #e5f6fe;
    border-radius: 10px;
  }

  .ant-card-head-title {
    text-transform: uppercase;
  }

  .ant-card-head {
    font-family: 'Poppins', sans-serif !important;
    font-size: 18px;
    color: #334155;
    padding-top: 10px;
    padding-left: 30px;
    border-bottom: 1px solid #dddddd;
    box-shadow: 2px 2px 5px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  .ant-list-item {
    cursor: pointer;
  }

  .ant-list-item a {
    text-decoration: none;
    color: #475569;
    padding-left: 10px;
    font-size: 16px;
  }
`;

export default ARMCard;
