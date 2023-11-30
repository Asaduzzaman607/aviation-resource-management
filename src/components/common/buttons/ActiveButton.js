import { Button } from 'antd';
import styled from 'styled-components';

const ActiveButton = styled(Button)`
  border-top: 3px solid #04aa6d;
  border-right: 1px solid #04aa6d;
  border-left: 1px solid #04aa6d;
  color: #04aa6d;

  .ant-btn:active,
  .ant-btn:focus,
  .ant-btn:hover {
    text-decoration: none;
    background: #fff;
  }

  .ant-btn:focus,
  .ant-btn:hover {
    color: #04aa6d;
    border-color: #04aa6d;
    background: #fff;
  }
`;
export default ActiveButton;
