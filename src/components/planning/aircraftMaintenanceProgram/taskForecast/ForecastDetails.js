import ARMTable from "../../../common/ARMTable";
import TaskForecastServices from "../../../../service/TaskForecastServices";
import {Link, useParams} from "react-router-dom";
import {createRef, useEffect, useState} from "react";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Row, Typography} from "antd";
import ARMCard from "../../../common/ARMCard";
import ReactToPrint from "react-to-print";
import SuccessButton from "../../../common/buttons/SuccessButton";
import {PrinterOutlined} from "@ant-design/icons";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import styled from "styled-components";
import logo from "../../../images/us-bangla-logo.png";
import React from "react";
import {dateFormat} from "../../report/AirframeAndApplianceADStatus";

const printStyle = `
*{
overflow: visible!important;
}
.forecastAircraft{
font-size: 10px!important;
width : 100%!important;

}
.printBorder{
  border : none!important;
}
  .forecast-table,
  .amp-data,
  .forecast-table td{
    font-size: 8px !important;
  }
  .amp-title{
    font-size: 12px !important;
  }
  .forecast-table td
  {
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
  }
  .pagination{
   display: none!important;
  }
  .page-of-report{
   visibility: visible!important;
   }
   @page { size: portrait!important }
`;

const CustomTable = styled(ARMTable)`
  thead tr th {
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
    background-color: white !important;
  }
  @page { size: portrait };

  thead tr th,
  tbody tr td {
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
    background-color: white !important;
  }
`;

const CustomH3 = styled.h3`
  text-align: center;
  text-transform: uppercase;
`;


const CustomLi = styled.li`
  margin: 2px 0px;
`;


const CustomHeadingSpan = styled.span`
  font-size: 25px;
  border-bottom: 2px solid #000000;
`;

const ForecastDetails = () => {
    const reportRef = createRef();
    let {id} = useParams();
    const [singleData, setSingleData] = useState();
    const loadSingleData = async () => {
        const {data} = await TaskForecastServices.getTaskForecastById(id);
        setSingleData(data);
    };
    useEffect(() => {
        loadSingleData();
    }, [id]);


    useEffect(() => {
        if (!id) {
            return;
        }
        (async () => {
            await loadSingleData(id);
        })();
    }, [id]);




    return (
        <div>
            <CommonLayout>
                <ARMBreadCrumbs>
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item>
                            <i className="fas fa-chart-line"/>
                            <Link to="/planning">&nbsp; Planning</Link>
                        </Breadcrumb.Item>

                        <Breadcrumb.Item>
                            <Link to="/planning/task-forecasts">Forecast </Link>
                        </Breadcrumb.Item>

                        <Breadcrumb.Item> View</Breadcrumb.Item>
                    </Breadcrumb>
                </ARMBreadCrumbs>
                <ARMCard
                    title={
                        <Row justify="space-between">
                            <CustomLi>Forecast Report</CustomLi>
                            <Col>
                                <ReactToPrint
                                    content={() => reportRef.current}
                                    pageStyle={printStyle}
                                    trigger={() => (
                                        <SuccessButton
                                            type="primary"
                                            icon={<PrinterOutlined/>}
                                            htmlType="button"
                                        >
                                            Print
                                        </SuccessButton>
                                    )}
                                />
                            </Col>
                        </Row>
                    }
                >
                    <div ref={reportRef} style={{padding: "30px"}}>
                        <Row justify="space-between">
                            <Col>
                                <img src={logo} width={130} alt=""/>
                            </Col>
                            <Col style={{fontSize: "10px"}}>
                                <Typography.Text>FORM CAME-002</Typography.Text>
                                <br/>
                                <Typography.Text>ISSUE INITIAL</Typography.Text>
                                <br/>
                                <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                            </Col>
                        </Row>

                        <div style={{margin: "0px"}}>
                            <CustomH3>
                                <CustomHeadingSpan>{singleData?.name}</CustomHeadingSpan>
                            </CustomH3>
                        </div>

                        <Row className="table-responsive" style={{marginTop: "10px", marginBottom: '20px'}}>
                            <ResponsiveTable>
                                <CustomTable className="forecast-table">
                                    {
                                        singleData?.forecastAircraftDtoList?.map(({
                                                                                      aircraftName,
                                                                                      aircraftSerial,
                                                                                      forecastTaskDtoList
                                                                                  }) => (
                                            <>


                                                <thead>
                                                <th colSpan={7} style={{ border: 'none'}} className='printBorder'>
                                                    <p  className='forecastAircraft'
                                                         style={{fontWeight: 'bold', marginBottom: '5px',  textAlign: 'initial'}}>
                                                        {`${aircraftName} ( MSN ${aircraftSerial})`}
                                                    </p>
                                                </th>

                                                <tr style={{fontSize: "10px"}}>

                                                    <th width="10%">
                                                        TASK NO
                                                    </th>
                                                    <th width="15%">
                                                        PART NO
                                                    </th>
                                                    <th width="15%">
                                                        DESCRIPTION
                                                    </th>
                                                    <th width="5%">
                                                        Quantity
                                                    </th>
                                                    <th width="10%">
                                                        IPC REF
                                                    </th>
                                                    <th width="10%">
                                                        DUE DATE
                                                    </th>
                                                    <th width="15%">
                                                        COMMENT
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>

                                                {
                                                    forecastTaskDtoList?.map(({
                                                                                  comment,
                                                                                  taskNo,
                                                                                  dueDate,
                                                                                  forecastTaskPartDtoList
                                                                              }) => {
                                                            return <tr>
                                                                <td>{taskNo}</td>
                                                                <td className='newLineInRow'>{forecastTaskPartDtoList?.map(({partNo}) => partNo).join('\n')}</td>
                                                                <td className='newLineInRow'>{forecastTaskPartDtoList?.map(({description}) => description).join('\n')}</td>
                                                                <td className='newLineInRow'>{forecastTaskPartDtoList?.map(({quantity}) => quantity).join('\n')}</td>
                                                                <td className='newLineInRow'>{forecastTaskPartDtoList?.map(({ipcRef}) => ipcRef).join('\n')}</td>
                                                                <td>{dateFormat(dueDate)}</td>
                                                                <td>{comment}</td>
                                                            </tr>

                                                        }
                                                    )
                                                }

                                                <br/>
                                                </tbody>
                                            </>
                                        ))}

                                </CustomTable>
                            </ResponsiveTable>
                        </Row>


                    </div>


                </ARMCard>
            </CommonLayout>
        </div>
    );
};

export default ForecastDetails;

