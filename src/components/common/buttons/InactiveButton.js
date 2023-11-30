import styled from "styled-components";
import {Button} from "antd";

const InactiveButton = styled(Button)`
	   border-top: 3px solid red;
	   border-right: 1px solid red;
       border-left: 1px solid red;
	   color: red;
	   
	    .ant-btn:active, .ant-btn:focus, .ant-btn:hover {
                text-decoration: none;
                background: #fff;
          }
    
         .ant-btn:focus, .ant-btn:hover {
           color: red;
           border-color: red;
           background: #fff;
      `

export default InactiveButton