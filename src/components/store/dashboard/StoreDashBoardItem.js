import React from 'react';
import {Col, Row} from "antd";
import {Barchart} from "./Barchart";
import {PieChart} from "./PieChart";
import {useDashBoard} from "./useDashBoard";

const StoreDashBoardItem = () => {
  const {scrapPart, demand, issue, returnPart, requisition, scrapPartMonth, returnPartMonth} = useDashBoard();
  // console.log("return", scrapPart);
  return (
    <>
      <Row gutter={[16, 16]}>
        {/*PARTS DEMAND*/}
        <Col xs={24} md={12}>
          <Row style={{backgroundColor: 'white', borderRadius: '10px', boxShadow:
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'}}>
            <Col style={{backgroundColor: '#EDF5FF'}} className="storeDashBoardSection" md={24} xs={24}>
              <div style={{backgroundColor: '#4A97FF'}} className='decor'></div>
              <h1 className={'text'}>PARTS DEMAND</h1>
            </Col>
            <Col md={24} xs={24}>
              <Barchart data={demand} color={'#4A97FF'} shadowColor={'rgba(74, 151, 255, 0.2)'}/>
            </Col>
          </Row>
        </Col>
        {/*PARTS Issue*/}
        <Col xs={24} md={12}>
          <Row style={{backgroundColor: 'white', borderRadius: '10px', boxShadow:
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'}}>
            <Col className="storeDashBoardSection" style={{backgroundColor: '#dcfce7'}} md={24} xs={24}>
              <div style={{backgroundColor: '#04aa6d'}} className='decor'></div>
              <h1 className={'text'}>PARTS ISSUE</h1>
            </Col>
            <Col md={24} xs={24}>
              <Barchart data={issue} color={"#04aa6d"} shadowColor={'rgba(75, 209, 161, 0.2)'}/>
            </Col>
          </Row>

        </Col>
        {/*PARTS REQUISITION*/}
        <Col xs={24} md={12}>
          <Row style={{backgroundColor: 'white', borderRadius: '10px', boxShadow:
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'}}>
            <Col className="storeDashBoardSection" style={{backgroundColor: '#1F776724'}} md={24} xs={24}>
              <div style={{backgroundColor: '#1F7767'}} className='decor'></div>
              <h1 className={'text'}>PARTS REQUISITION</h1>
            </Col>
            <Col md={24} xs={24}>
              <Barchart data={requisition} color={"#1F7767"} shadowColor={'rgba(31, 119, 103, 0.1)'}/>
            </Col>
          </Row>
        </Col>
        {/*PARTS RETURN and Scrap PIe*/}
        <Col xs={24} md={12}>
          <Row style={{backgroundColor: 'white', borderRadius: "10px", padding: "11px 7px 11px 7px", boxShadow:
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'}} gutter={4}>
            <Col xs={24} md={12}>
              <Row>
                <Col md={24} xs={24}>
                  <PieChart module= "Parts Return" data={returnPart} color={["#1F7767", "#FFA800"]} bgC={"#E0ECEA"}/>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <Row>
                <Col md={24} xs={24}>
                  <PieChart module="Scrap Parts" data={scrapPart} color={["#04aa6d", "#353A40"]} bgC={"rgba(37, 103, 115, 0.15)"}/>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default StoreDashBoardItem;