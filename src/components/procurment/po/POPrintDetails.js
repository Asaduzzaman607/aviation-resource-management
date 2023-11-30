import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Divider, Row, Typography } from 'antd';
import { createRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import styled, { createGlobalStyle } from 'styled-components';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import logo from '../../images/us-bangla-logo.png';
import CommonLayout from '../../layout/CommonLayout';
import usePoDetails from './usePoDetails';

const { Title } = Typography;
const PoPrintTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 8px;

  thead {
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    text-align: start;
    background: #fafafa;
    border: 1px solid #000;
    transition: background 0.2s ease;
  }

  th {
    text-transform: capitalize;
    text-align: center;
    border: 1px solid #000;
  }

  td {
    transition: background 0.2s, border-color 0.2s;
    border-bottom: 1px solid #f0f0f0;
    text-align: center;
    border: 1px solid #000;
  }

  thead tr th,
  tbody tr td {
    padding: 2px 0;
  }

  tbody tr:nth-child(odd) {
    background: #ffffff;
  }

  tbody tr:nth-child(even) {
    background: #ffffff;
  }
`;
const GlobalStyle = createGlobalStyle`
  @page {
    size: portrait;
  }
`;

const POPrintDetails = () => {
  const {
    id,
    info,
    tableData1,
    tableData2,
    totalExtraCost,
    grandTotal,
    subTotal,
    discount,
    currencyCode,
    countDiscount,
  } = usePoDetails();

  let preparedByName;
  for (const approveStatus in info?.approvalStatuses) {
    if (info?.approvalStatuses[approveStatus].workFlowAction === 'CREATE') {
      preparedByName = info?.approvalStatuses[approveStatus].updatedByName;
      break;
    }
  }

  const componentRef = createRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const invoiceTo = info.invoiceTo?.replace(/(?:\r\n|\r|\n)/g, '<br>');
  const shipTo = info.shipTo?.replace(/(?:\r\n|\r|\n)/g, '<br>');
  const tac = info.tac?.replace(/(?:\r\n|\r|\n)/g, '<br>');
  const vendorResponse = info.vendorResponse?.replace(
    /(?:\r\n|\r|\n)/g,
    '<br>'
  );
  const location = useLocation();
  const locationData = location.state?.data;

  const discountedUnitPrice = (record = {}) => {
    const discountedPrice =
      record.unitPrice - (record.unitPrice * record.discount) / 100;
    return discountedPrice?.toFixed(2) || 0;
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/material-management">
              {' '}
              <i className="fa fa-shopping-basket" />
              &nbsp; material-management
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/material-management/${locationData}-purchase-order`}>
              {locationData} Order List
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>PO Print Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission={
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_ORDER_MATERIAL_MANAGEMENT_PURCHASE_ORDER_SAVE'
        }
      >
        <ARMCard
          title={
            <Row justify="space-between">
              <Col>RO Print Preview</Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  onClick={handlePrint}
                  style={{
                    marginRight: '10px',
                    borderRadius: '5px',
                  }}
                >
                  Print
                </Button>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: '#04aa6d',
                    borderColor: 'transparent',
                    borderRadius: '5px',
                  }}
                >
                  <Link
                    title="back"
                    to={`/material-management/purchase-order/detail/${id}`}
                    state={{ data: locationData }}
                  >
                    <ArrowLeftOutlined /> Back
                  </Link>
                </Button>
              </Col>
            </Row>
          }
        >
          <div
            ref={componentRef}
            style={{
              marginLeft: '1in',
              marginRight: '0.5in',
            }}
          >
            <Row
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              <Col style={{ marginLeft: '17%' }}>{''}</Col>
              <Col>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  {info.orderType} ORDER
                </div>
                <hr />
              </Col>
              <Col>
                <img
                  src={logo}
                  alt="logo"
                  style={{
                    padding: '0 40px',
                    width: '300px',
                    height: '45px',
                    marginBottom: '10px',
                  }}
                />
              </Col>
            </Row>
            <div
              id="container"
              //ref={componentRef}
              style={{
                marginLeft: '15px',
                marginRight: '15px',
                fontSize: '8px',
              }}
            >
              <GlobalStyle />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  //marginTop: '10px',
                  marginBottom: '10px',
                }}
              >
                <table style={{ border: '1px solid black' }}>
                  <thead>
                    <tr style={{ border: '1px solid black' }}>
                      <th
                        style={{
                          border: '1px solid black',
                          padding: '5px 15px',
                          fontSize: '8px',
                        }}
                      >
                        {info.orderType} Order No.
                      </th>
                      <th
                        style={{
                          border: '1px solid black',
                          padding: '5px 15px',
                          fontSize: '8px',
                        }}
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          border: '1px solid black',
                          padding: '5px 15px',
                          fontSize: '8px',
                        }}
                      >
                        {info.orderNo}
                      </td>
                      <td
                        style={{
                          border: '1px solid black',
                          padding: '5px 15px',
                          fontSize: '8px',
                        }}
                      >
                        {info.vendorQuotationViewModel?.date}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={2}
                        style={{
                          border: '1px solid black',
                          padding: '5px 15px',
                          fontSize: '8px',
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: vendorResponse }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table style={{ border: '1px solid black' }}>
                  <thead>
                    <tr style={{ border: '1px solid black' }}>
                      <th
                        style={{
                          border: '1px solid black',
                          padding: '3px 15px',
                          fontSize: '8px',
                        }}
                      >
                        Ship To
                      </th>
                      <th
                        style={{
                          border: '1px solid black',
                          padding: '3px 15px',
                          fontSize: '8px',
                        }}
                      >
                        Invoice To
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          border: '1px solid black',
                          padding: '3px 15px',
                          fontSize: '8px',
                        }}
                      >
                        <div dangerouslySetInnerHTML={{ __html: shipTo }} />
                      </td>
                      <td
                        style={{
                          border: '1px solid black',
                          padding: '3px 15px',
                          fontSize: '8px',
                        }}
                      >
                        <div dangerouslySetInnerHTML={{ __html: invoiceTo }} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <PoPrintTable>
                <thead>
                  <tr>
                    <th>PO. Date</th>
                    <th>Req. No.</th>
                    <th>Req Date</th>
                    <th>Quotation No.</th>
                    <th>Quotation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData1?.map((data) => (
                    <tr key={data.key}>
                      <td>{data.poDate}</td>
                      <td>{data.reqNo}</td>
                      <td>{data.quoteRequestDate}</td>
                      <td>{data.quotationNo}</td>
                      <td>{data.quotationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </PoPrintTable>

              <div style={{ marginTop: '10px' }}></div>

              <PoPrintTable>
                <thead>
                  <tr>
                    <th>SL.</th>
                    <th>Aircraft Name</th>
                    <th>Description</th>
                    <th>Part No.</th>
                    {info.orderType === 'REPAIR' && (
                      <>
                        <th>Serial Number</th>
                        <th>Reason for Remove</th>
                        <th>Program</th>
                      </>
                    )}
                    {info.orderType === 'EXCHANGE' && <th>Serial Number</th>}
                    <th>CD/LT</th>
                    <th>Qty.</th>
                    <th>Vendor UOM</th>
                    {info.orderType === 'REPAIR' && <th>Utilization </th>}
                    <th>Unit Price</th>
                    <th>Discount %</th>
                    <th>
                      <p style={{ margin: '0px' }}>Discounted</p>
                      <p style={{ margin: '0px' }}>Unit Price</p>
                    </th>
                    <th>
                      <p style={{ margin: '0px' }}>Extended Cost /</p>
                      <p style={{ margin: '0px' }}>Total Price</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData2?.map((data, index) => (
                    <tr key={data.key}>
                      <td>{data.sl}</td>
                      <td>{data.aircraftName}</td>
                      <td>{data.partDescription}</td>
                      <td>{data.partNo}</td>
                      {info.orderType === 'REPAIR' && (
                        <>
                          <td>{data.serialNo}</td>
                          <td>{data.reasonRemoved}</td>
                          {/* repairType is the Program here*/}
                          <td>{data.repairType}</td>
                        </>
                      )}
                      {info.orderType === 'EXCHANGE' && (
                        <td>{data.serialNo}</td>
                      )}
                      <td>{data.cdlt}</td>
                      <td>{data.partQuantity}</td>
                      <td>{data.uomCode}</td>
                      {info.orderType === 'REPAIR' && (
                        <td>
                          {
                            <>
                              <span>tso : {data.tso}</span> <br />
                              <span>cso : {data.cso}</span> <br />
                              <span>tsn : {data.tsn}</span> <br />
                              <span>csn : {data.csn}</span> <br />
                              <span>tsr : {data.tsr}</span> <br />
                              <span>csr : {data.csr}</span> <br />
                            </>
                          }
                        </td>
                      )}
                      <td>{data.unitPrice}</td>
                      <td>{data.discount}</td>
                      <td>{discountedUnitPrice(data)}</td>
                      <td>{data.totalAmount?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </PoPrintTable>

              <Row style={{ marginTop: '10px' }}>
                <Col
                  span={5}
                  offset={20}
                  style={{ fontSize: '10px' }}
                >
                  <Title
                    level={5}
                    style={{ marginBottom: '-15px', fontSize: '10px' }}
                  >
                    Sub Total: {subTotal?.toFixed(2) + ' ' + currencyCode}
                  </Title>
                  <Title
                    level={5}
                    style={{ marginBottom: '-15px', fontSize: '10px' }}
                  >
                    {countDiscount(info, discount)}
                  </Title>
                  <Title
                    level={5}
                    style={{ marginBottom: '-15px', fontSize: '10px' }}
                  >
                    Extra Cost:{' '}
                    {totalExtraCost?.toFixed(2) + ' ' + currencyCode}
                  </Title>
                  <Divider dashed />
                  <Title
                    level={5}
                    style={{
                      marginBottom: '-40px',
                      marginTop: '-20px',
                      fontSize: '10px',
                    }}
                  >
                    Grand Total: {grandTotal?.toFixed(2) + ' ' + currencyCode}
                  </Title>
                </Col>
              </Row>

              <div
                className="tac-info"
                style={{
                  marginTop: '30px',
                  fontSize: '8px',
                }}
              >
                <h3
                  style={{
                    fontStyle: 'italic',
                  }}
                >
                  <u>Terms & Conditions</u>
                </h3>
                <div dangerouslySetInnerHTML={{ __html: tac }} />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '30px',
                  fontSize: '8px',
                }}
              >
                <div>
                  <h4
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '30px',
                    }}
                  >
                    Prepared By
                  </h4>
                  <p>....................................</p>
                  <h4
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    {info.employeeName}
                  </h4>
                  <p>{info.designationName}</p>
                  <p>{preparedByName}</p>
                  <p>Engineering Procurement</p>
                  <p>System Tracking No : {info?.voucherNo}</p>
                </div>
                <div>
                  <h4
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '30px',
                    }}
                  >
                    Approved By
                  </h4>
                  <span>....................................</span> <br />
                  <span>
                    <span
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      Tawfiqul Hoque{' '}
                    </span>{' '}
                    <br />
                    Head of Engineering Procurement
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default POPrintDetails;
