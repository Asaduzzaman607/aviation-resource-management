import React, { createRef, useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Breadcrumb,
  Col,
  DatePicker,
  Form,
  Pagination,
  Row,
  Select,
  Space,
  Typography,
  Input,
  Divider,
} from 'antd';
import ARMTable from '../../common/ARMTable';
import CommonLayout from '../../layout/CommonLayout';
import {
  FilterOutlined,
  PrinterOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import ResponsiveTable from '../../common/ResposnsiveTable';
import SuccessButton from '../../common/buttons/SuccessButton';
import ReactToPrint from 'react-to-print';
import logo from '../../images/us-bangla-logo.png';
import divider from '../../images/single_line.png';
import { useLocation } from 'react-use';
import ARMButton from '../../common/buttons/ARMButton';
import { Link, useNavigate } from 'react-router-dom';

const printStyle = `
	.table {
		font-size: 10pt;
	}
	.dfhcd-heading{
		font-size: 13px !important;
		text-align: center !important;
	}
  .table{
    font-size: 10px !important;
  }
  .table thead tr th{
    padding: 0 !important;
    height: 25px !important;
    background-color: #C0C0C0 !important;
    color: #A53C01 !important;
  }
	.table td{
		width: 6.25% !important;
    height: 25px !important;
	}
  .dfhc-titles{
    font-size: 10px !important;
    text-align: center !important;
  }
  .table th,
  .table thead tr td,
  .table tbody tr td{
    border-width: .4px !important;
    border-style: solid !important;
    border-color: #000 !important;
  }
  .aircraft-titles{
    background-color: #FFFF00 !important;
    padding: 0 40px !important;
  }
  .pagination{
    display: none !important;
  }
`;

export default function PurchaseOrderReportPrint() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const reportRef = createRef();
  const location = useLocation();
  const { to, inSto, tC } = location.state.usr.value;

  return (
    <CommonLayout>
      <Row ref={reportRef}>
        <Col span={24}>
          <Row justify="space-between">
            <Col></Col>
            <Col>
              <Typography.Title
                level={4}
                className="aircraft-titles"
              >
                <b>Purchase Order</b>
              </Typography.Title>
            </Col>
            <Col>
              <img
                src={logo}
                alt=""
                width={110}
              />
            </Col>
          </Row>
          <br></br>
          <br></br>
          <Row>
            <Col span={12}>
              <Row>
                <Col style={{ marginRight: '10px' }}>
                  <Typography.Text>To</Typography.Text>
                </Col>

                <Col>
                  {' '}
                  <img
                    src={divider}
                    alt=""
                    width={1}
                    height={80}
                  />{' '}
                </Col>

                <Col style={{ marginLeft: '2px' }}>
                  {to?.split('\n').map((data, i) => (
                    <>
                      <Typography.Text key={i}>{data}</Typography.Text>
                      <br />
                    </>
                  ))}
                </Col>
              </Row>
            </Col>

            <Col span={12}>
              <Row>
                <Col style={{ paddingLeft: '5vh', marginRight: '7px' }}>
                  <Typography.Text>Invoice & ship to</Typography.Text>
                </Col>

                <Col>
                  {' '}
                  <img
                    src={divider}
                    alt=""
                    width={1}
                    height={80}
                  />{' '}
                </Col>

                <Col style={{ marginLeft: '2px' }}>
                  {inSto?.split('\n').map((data, i) => (
                    <>
                      <Typography.Text key={i}>{data}</Typography.Text>
                      <br />
                    </>
                  ))}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="table-responsive">
            <ResponsiveTable>
              <ARMTable className="table">
                <thead>
                  <tr
                    style={{
                      borderTop: '2px solid #808080',
                      borderBottom: '2px solid #808080',
                    }}
                  >
                    <th>P.O.Date</th>
                    <th>REQ No</th>
                    <th>AC</th>
                    <th>REQ Date</th>
                    <th>Quotation No</th>
                    <th>Quotation Date</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </ARMTable>
            </ResponsiveTable>
          </Row>
          <Row
            className="table-responsive"
            style={{ marginTop: '20px' }}
          >
            <ResponsiveTable>
              <ARMTable className="table">
                <thead>
                  <tr
                    style={{
                      borderTop: '2px solid #808080',
                      borderBottom: '2px solid #808080',
                    }}
                  >
                    <th>SL</th>
                    <th>Description</th>
                    <th>Part No</th>
                    <th>CD/ TL</th>
                    <th>Qty</th>
                    <th>UOM</th>
                    <th>Unit Price USD</th>
                    <th>Total Price USD</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </ARMTable>
            </ResponsiveTable>
          </Row>
          <br></br>
          <br></br>
          <Typography.Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Terms and Condtion
          </Typography.Text>
          <br />
          <Row className="table-responsive">
            <Col style={{ marginTop: '5px' }}>
              {tC?.split('\n').map((data, i) => (
                <>
                  <Typography.Text key={i}>{data}</Typography.Text>
                  <br />
                </>
              ))}
            </Col>
          </Row>
          <br /> <br /> <br /> <br />
          <Row
            justify="space-between"
            style={{ fontSize: '10px' }}
          >
            <Col>
              <Typography.Text>Prepared By: </Typography.Text>
            </Col>
            <Col>Approved by :____________________</Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Space size="small">
            <ReactToPrint
              content={() => reportRef.current}
              copyStyles={true}
              pageStyle={printStyle}
              trigger={() => (
                <SuccessButton
                  type="primary"
                  icon={<PrinterOutlined />}
                  htmlType="button"
                >
                  Print
                </SuccessButton>
              )}
            />
            <Link to={'/material-management/purchase-order-report'}>
              <ARMButton type="primary">Back</ARMButton>
            </Link>
          </Space>
        </Col>
      </Row>
    </CommonLayout>
  );
}
