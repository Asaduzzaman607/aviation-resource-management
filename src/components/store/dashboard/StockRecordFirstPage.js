import { Col, Row } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import ARMTable from '../../common/ARMTable';
import logo from '../../images/us-bangla-logo.png';
import { formatDate } from '../../planning/report/Common';

const Container = styled.div`
  padding-top: 35px;
  padding-left: 50px;
  padding-right: 50px;

  .stock-table-1 tr td {
    text-align: left;
    padding: 0px 7px;
    border: 0.4px solid #000;
    margin: 0;
  }
  .stock-table-1 tr {
    height: 27px !important;
  }
  .stock-table-2 thead tr th {
    height: 10px !important;
    padding: 0 !important;
  }
  .stock-table-2 tbody tr {
    height: 32px !important;
  }
  .stock-table-2 thead tr th,
  .stock-table-2 tbody tr td {
    border: 0.4px solid #000 !important;
    padding: 0;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  text-align: center;
  letter-spacing: 2px;
  margin-bottom: 5px;
`;

const Title2 = styled.h3`
  font-weight: bold;
  text-align: center;
  letter-spacing: 2px;
  margin-top: 7px;
  margin-bottom: 5px;
`;

const StockRecordFirstPage = ({ data }) => {
  return (
    <>
      <Container>
        <Row justify="space-between">
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
          <Col style={{ fontSize: '17px' }}>Form No. {data.number}</Col>
        </Row>
        {/* table 1 */}
        <Title>STOCK RECORD CARD</Title>
        <ARMTable className="stock-table-1">
          <tr>
            <td>
              Date <br /> (Open)
            </td>
            <td style={{ width: '14%' }}>{moment().format('YYYY-DD-MM')}</td>
            <td>
              Stock Room No. <br />
              (If any) : {data.stockRoom}
            </td>
            <td colSpan={2}>
              Ref. No. <br />
              (If any) :
            </td>
            <td
              colSpan={3}
              style={{ textAlign: 'center' }}
            >
              Date
            </td>
          </tr>
          <tr>
            <td>
              Card Regn. No <br />
              (If any)
            </td>
            <td></td>
            <td rowSpan={2}>
              Material Class : <br />
              (Financial code No.)
            </td>
            <td>
              Part or <br /> Drg. No.
            </td>
            <td colSpan={3}>{data.partNo}</td>
          </tr>
          <tr>
            <td>Used on A/C type</td>
            <td>{data.aircraftModelName}</td>
            <td>
              Denom. <br /> (Unit)
            </td>
            <td colSpan={3}>{data.uomCode}</td>
          </tr>
          <tr>
            <td>
              Cat. of items <br /> (Consumable)
            </td>
            <td></td>
            <td rowSpan={2}>Nomenclature : {data.description}</td>
            <td rowSpan={2}>Location: {data.otherLocation}</td>
            <td>Rack: {data.rackCode}</td>
            <td>Row: {data.rackRowCode}</td>
            <td>Bin: {data.rackRowBinCode}</td>
          </tr>
          <tr>
            <td>
              {' '}
              Min. Stock <br />
              (Inv)
            </td>
            <td>{data.minStock}</td>
            <td>
              {data.rackCode
                ? data.rackCode
                : data.otherLocation
                ? data.otherLocation
                : 'Empty'}
            </td>
            <td>
              {!data.rackCode
                ? 'Empty'
                : data.rackRowCode
                ? data.rackRowCode
                : data.otherLocation}
            </td>
            <td>
              {!data.rackCode && !data.rackRowCode
                ? 'Empty'
                : data.rackRowBinCode
                ? data.rackRowBinCode
                : data.otherLocation}
            </td>
          </tr>
          <tr>
            <td>
              Max. Stock <br /> (Inv)
            </td>
            <td>{data.maxStock}</td>
            <td>Source of supply : </td>
            <td
              rowSpan={2}
              colSpan={4}
            >
              I/C's: <span>{data?.icName}</span>
              <br />
              Sign :..........................
            </td>
          </tr>
          <tr>
            <td>IPC Ref:</td>
            <td></td>
            <td>
              Interchangeable P/N (If applicable) :
              <span style={{ fontSize: '9px' }}>
                {data?.alternatePart?.map((part) => part?.partNo).join(',') ||
                  'N/A'}
              </span>
            </td>
          </tr>
        </ARMTable>

        {/* table 2 */}
        <Title2>SPECIAL INSTRUCTIONS</Title2>
        <ARMTable className="stock-table-2">
          <thead>
            <tr>
              <th>
                Line <br /> No.
              </th>
              <th>Date</th>
              <th>
                Consignor or <br /> Consignee
              </th>
              <th>
                Voucher <br /> No.
              </th>
              <th>
                Release Note <br /> & Date
              </th>
              <th>
                Lot / <br /> Batch No.
              </th>
              <th>
                Qty. <br /> Recvd.
              </th>
              <th>
                Qty. <br /> Issued.
              </th>
              <th>
                Balance <br /> in Stock
              </th>
              <th>
                Unit <br /> Rate
              </th>
              <th>
                Initial & <br /> Date
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.stockDataList.map((stock, index) => {
              return (
                <tr key={index}>
                  <td style={{ width: '4%' }}>{index + 1}</td>
                  <td style={{ width: '12%' }}>
                    {formatDate(stock.createdAt)}
                  </td>
                  <td style={{ width: '10%' }}>{stock.vendorName?.name}</td>
                  <td style={{ width: '14%', fontSize: '9px' }}>
                    {stock.voucherNo}
                  </td>
                  <td style={{ width: '10%' }}>{stock.releaseNote}</td>
                  <td style={{ width: '10%', fontSize: '9px' }}>
                    {stock.serialNumber}
                  </td>
                  <td style={{ width: '8%' }}>{stock.receivedQty}</td>
                  <td style={{ width: '8%' }}>{stock.issuedQty}</td>
                  <td style={{ width: '8%' }}>{stock.inStock}</td>
                  <td style={{ width: '8%' }}>{stock.unitPrice}</td>
                  <td style={{ width: '8%' }}>{stock.submittedUser}</td>
                </tr>
              );
            })}
          </tbody>
        </ARMTable>
        <span style={{ display: 'block', textAlign: 'center', marginTop: 15 }}>
          Carried Forward .................................
        </span>
      </Container>
    </>
  );
};

export default StockRecordFirstPage;
