import { PrinterOutlined } from '@ant-design/icons';
import { Breadcrumb, Col, Divider, Row } from 'antd';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';

const PurchaseInvoicePrint = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/material-management">
              <i className="fas fa-shopping-basket" /> &nbsp;material management
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/">&nbsp;Purchase Invoice</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={
          <Row justify="space-between">
            <Col> Issue Demand Print</Col>
            <Col>
              <ARMButton
                type="primary"
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                Print
              </ARMButton>
            </Col>
          </Row>
        }
      >
        <div
          id="container"
          ref={componentRef}
        >
          <div style={{ width: '100%' }}>
            {/* <h4></h4> */}

            <div style={{ float: 'left', width: '50%', textAlign: 'left' }}>
              <h2>TOULOUSEAIRSPARES</h2> <br />
              <h4>TOULOUSE AIR SPARES FRANCE(FB0Z3)</h4>
              <p>25 Bis Aveneue de Larriew - Hall 1</p>
              <p>31100 TOULOUSE France</p>
              <p></p>
            </div>
            <div style={{ float: 'right', width: '50%', textAlign: 'left' }}>
              <h3>PROFORMA INVOICE</h3>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr style={{ textAlign: 'center' }}>
                    <th style={{ background: '#1C1B1B', color: '#ffffff' }}>
                      Invoice #
                    </th>
                    <th style={{ background: '#1C1B1B', color: '#ffffff' }}>
                      {' '}
                      Date{' '}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PRO-TAS-2022/0111</td>
                    <td>25 Apr 22 </td>
                  </tr>
                  <tr>
                    <tr>
                      <p
                        style={{
                          textAlign: 'center',
                          width: '250%',
                          background: 'black',
                          color: '#ffffff',
                        }}
                      >
                        Ref
                      </p>
                      <p>Quetation #</p>
                      <p>Client's PO #</p>
                    </tr>
                    <th style={{ width: '66%' }}>
                      <p>US-Bangla Airlines Ltd(B5)</p>
                      <p>QTN-TA599999</p>
                      <p>USBA/C/2022/3756</p>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <table style={{ width: '100%' }}>
              <th style={{ width: '50%', textAlign: 'left' }}>
                <div>
                  <div style={{ display: 'flex' }}>
                    <p
                      style={{
                        width: '30%',
                        float: 'left',
                        background: 'black',
                        color: '#ffffff',
                      }}
                    >
                      Ship to{' '}
                    </p>
                    <p style={{ width: '60%', float: 'right' }}>
                      New Sign Logistics{' '}
                    </p>
                  </div>

                  <p>C/O US-BANGLA AIRLINES LTD </p>
                  <p> Lot C19, Block C, Free COmmercial Zone </p>
                  <p>Airport </p>
                  <p> Fax </p>
                  <p>Email : </p>
                </div>
                <Divider style={{ background: 'black' }} />
                <div style={{ display: 'flex' }}>
                  <p style={{ width: '30%', float: 'left' }}>
                    Followed Up by:{' '}
                  </p>
                  <div style={{ width: '60%', float: 'right' }}>
                    <p>Mathilde PEREZ</p>
                    <h5>m.perez@etoulouseairspares.com</h5>
                  </div>
                </div>
              </th>
              <th style={{ width: '50%', textAlign: 'left' }}>
                <div>
                  <div style={{ display: 'flex' }}>
                    <p
                      style={{
                        width: '30%',
                        float: 'left',
                        background: 'black',
                        color: '#ffffff',
                      }}
                    >
                      Bill to{' '}
                    </p>
                    <p style={{ width: '60%', float: 'right' }}>
                      New Sign Logistics{' '}
                    </p>
                  </div>

                  <p>C/O US-BANGLA AIRLINES LTD </p>
                  <p> Lot C19, Block C, Free COmmercial Zone </p>
                  <p>Airport </p>
                  <p> Fax </p>
                  <p>Email : </p>
                </div>
              </th>
              <tr>
                <th>
                  <div style={{ display: 'flex' }}>
                    <p style={{ width: '30%', float: 'left' }}>
                      Payment terms :{' '}
                    </p>
                    <p style={{ width: '60%', float: 'right' }}>CIA </p>
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex' }}>
                    <p style={{ width: '30%', float: 'left' }}>Due Date :</p>
                    <p style={{ width: '60%', float: 'right' }}>29 Apr 2022 </p>
                  </div>
                </th>
              </tr>
            </table>
          </div>
          <div style={{ paddingTop: '10px' }}>
            <p>Quotation #: QTN-TA5098995 - Customer's ref : RFQ-0046/2022</p>
            <table style={{ width: '100%', textAlign: 'center' }}>
              <thead>
                <tr>
                  <th style={{ background: 'black', color: '#ffffff' }}>
                    ITEM
                  </th>
                  <th style={{ background: 'black', color: '#ffffff' }}>
                    PART NUMBER
                  </th>
                  <th style={{ background: 'black', color: '#ffffff' }}>
                    DESCRIPTION
                  </th>
                  <th style={{ background: 'black', color: '#ffffff' }}>QTY</th>
                  <th style={{ background: 'black', color: '#ffffff' }}>UOM</th>
                  <th style={{ background: 'black', color: '#ffffff' }}>
                    COND
                  </th>
                  <th style={{ background: 'black', color: '#ffffff' }}>
                    UNIT PRICE
                  </th>
                  <th style={{ background: 'black', color: '#ffffff' }}>
                    TOTAL PRICE
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2</td>
                  <td>980-6022</td>
                  <td>CoCKPIT VOICE RECORDER</td>
                  <td>1.00</td>
                  <td>each</td>
                  <td>Ex/Sv+REP Costs</td>
                  <td>USD 650.00</td>
                  <td>USE 650.00</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #818080' }}></td>
                  <td style={{ border: '1px solid #9A9A9A' }}></td>
                  <td style={{ border: '1px solid #929191' }}></td>
                  <td style={{ border: '1px solid #939393' }}></td>
                  <td style={{ border: '1px solid #A39E9E' }}></td>
                  <td style={{ border: '1px solid #8E8C8C' }}></td>
                  <td
                    style={{ fontWeight: 'bold', border: '1px solid #0E0D0D' }}
                  >
                    <i>SUB-TOTAL</i>
                  </td>
                  <td style={{ fontWeight: 'bold' }}>USE 650.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ height: '50px' }}></div>
          <div>
            <table style={{ width: '80%', float: 'right' }}>
              <thead>
                <tr>
                  <th
                    style={{
                      width: '60%',
                      background: '#343434',
                      color: 'white',
                    }}
                  >
                    {' '}
                    Other Fees{' '}
                  </th>
                  <th style={{ width: '20%' }}>TOTAL PRICE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hazardous Material Charges</td>
                  <td>USD 90.00</td>
                </tr>
                <tr>
                  <td>DEPOSIT</td>
                  <td>USD 4250.00</td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: '30%',
                      border: 'white',
                      fontWeight: 'bold',
                      float: 'right',
                    }}
                  >
                    <i>SUB_TOTAL</i>
                  </td>
                  <td>USD 4340.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ height: '200px' }}></div>
          <div style={{ border: '1px solid black', width: '100%' }}>
            <div style={{ padding: '20px', fontWeight: 'bold' }}>
              <h3>CIVIL AIRCRAFT PARTA </h3>
              <p>
                <u>NOTES : </u>
              </p>
            </div>
          </div>
          <div style={{ height: '20px' }}></div>
          <div>
            <table style={{ width: '40%', float: 'right' }}>
              <thead>
                <tr>
                  <th>Total Amount</th>
                  <th>USD 4990.00</th>
                </tr>
                <tr>
                  <th>Required Pre-Payment Amount</th>
                  <th>% 100.00</th>
                </tr>
              </thead>
            </table>
          </div>

          <div>
            <table style={{ width: '100%' }}>
              <th style={{ width: '50%', textAlign: 'left', padding: '10px' }}>
                <div>
                  <p>
                    Bank : &nbsp; <span>CREDIT AGRICOLE (CODE : CA) </span>
                  </p>
                  <p>
                    Address : &nbsp; <span>9 Rue Dhaka Baridara </span>
                    <h6>Tel : 33 611 35030 &nbsp;&nbsp; Fax: 33808349</h6>
                  </p>
                </div>
                <div style={{ height: '120px' }}></div>
                <tr style={{ width: '50%' }}>
                  <th style={{ width: '25%', height: '20px' }}>
                    Acc Name: TOULOUSE AIR SPACES
                  </th>
                  <th style={{ width: '25%', height: '20px' }}>
                    SWIFT CODE : AGRIFKDK{' '}
                  </th>
                </tr>
                <br />
                <br />
                <p>IBAN INTL BANKING ACCOUNT N' FR769394349dfefoij</p>
              </th>
              <th style={{ width: '30%', textAlign: 'right' }}>
                <div>
                  <p style={{ paddingRight: '10px' }}>
                    Total AMount Excl Taxs.
                  </p>
                  <Divider style={{ background: 'black' }} />
                  <p style={{ paddingRight: '10px' }}>Vat/GST/ 0.00%</p>
                  <Divider style={{ background: 'black' }} />
                  <p style={{ paddingRight: '10px' }}>
                    Total Amount Incl. Taxes
                  </p>
                  <Divider style={{ background: 'black' }} />
                  <p style={{ paddingRight: '10px' }}>Total Paid</p>
                  <Divider style={{ background: 'black' }} />
                  <p style={{ paddingRight: '10px' }}>
                    TOTAL DUE &nbsp; <span>29 Apr 2022</span>
                  </p>
                </div>
              </th>
              <th style={{ width: '20%' }}>
                <div>
                  <p style={{ paddingRight: '10px' }}>USD 4990.00</p>
                  <Divider style={{ background: 'black' }} />
                  <p style={{ paddingRight: '10px' }}>USD 4990.00</p>
                  <Divider style={{ background: 'black' }} />
                  <p style={{ paddingRight: '10px' }}>USD 0.00</p>
                  <Divider style={{ background: 'black' }} />
                  <p style={{ paddingRight: '10px' }}>USD 4990.00</p>
                  <Divider style={{ background: 'black' }} />
                  <p style={{ paddingRight: '10px' }}>USD 0.00</p>
                </div>
              </th>
            </table>
          </div>
          <div>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>CONDITIONS OF SALE</th>
                  <th style={{ width: '15%' }}>SIGNATURE</th>
                  <th style={{ width: '35%' }}>ABREVIATION INDEX</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    ljlkjflskjflsjf jsdlfj lksjdflksj f sdkjflsdjfls lksjdlfksd
                    fljlsdjf sdf slkdjflsdjfsdfj lskdjflsd ljasdfh ls
                    lskdjflsdjfl sjdlf ljsdlf sjdfl lsk
                  </td>
                  <td>
                    <h1>SIGNATURE</h1>
                  </td>
                  <td>
                    <div></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ARMCard>
    </CommonLayout>
  );
};

export default PurchaseInvoicePrint;
