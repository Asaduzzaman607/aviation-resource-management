import SuccessButton from "./buttons/SuccessButton";
import {PrinterOutlined} from "@ant-design/icons";
import ReactToPrint from "react-to-print";
import React from "react";

const printStyle = `
*{
  margin: 0!important;
  padding: 0!important;
  font-size: 10px!important;
  overflow: visible!important;
}
 
  .pagination{
   display: none!important;
  }

   tbody tr td{
     padding: 0!important;
   }
   @page{ size: landscape!important; }
`;


type Props = {
    printAreaRef: any,
    copyStyle?: boolean,
}

const PrintButton: React.FC<Props> = (props) => {
    return <ReactToPrint
        content={() => props.printAreaRef.current}
        pageStyle={printStyle}
        copyStyles={props.copyStyle}
        trigger={() => (
            <SuccessButton type="primary" icon={<PrinterOutlined/>} htmlType="button">
                Print
            </SuccessButton>
        )}
    />
}

PrintButton.defaultProps = {
    copyStyle: true,
}

export default PrintButton;