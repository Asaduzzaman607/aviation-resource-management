import { Col, Row } from 'antd';
import styled from 'styled-components';
import ARMTable from '../../common/ARMTable';
import logo from '../../images/us-bangla-logo.png';
import { formatDate } from '../../planning/report/Common';

const Container = styled.div`
  padding-top: 50px;
  padding-left: 50px;
  padding-right: 50px;

  .mel-table thead tr th {
    height: 10px !important;
    padding: 0 !important;
  }
  .mel-table tbody tr {
    height: 27px !important;
  }
  .mel-table thead tr th,
  .mel-table tbody tr td {
    border: 0.4px solid #000 !important;
    padding: 0;
  }
`;

export const style = {
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  border: '0.4px solid #000',
  borderRight: 0,
  borderBottom: 0,
  paddingBottom: '30px',
  width: '33.3%',
  height: '55px',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

const FirstPage = ({ data }) => {
  return (
    <Container>
      <Row justify="space-around">
        <Col></Col>
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
      <Row justify="space-around">
        <Col></Col>
        <Col
          style={{ fontSize: '20px' }}
          className="accessor"
        >
          <strong>BIN CARD FOR ACCESSORIES</strong>
        </Col>
        <Col style={{ fontSize: '16px' }}>
          <p style={{ margin: '0px' }}>
            SPARE FLOAT :
            <span> {data?.minStock}</span>
          </p>
          <p style={{ margin: '0px' }}>
            IPC REF 1 ......................................
          </p>
          <p
            style={{
              marginLeft: 65,
              marginBottom: 0,
            }}
          >
            2 .......................................
          </p>
        </Col>
      </Row>
      <Row justify="space-between">
        <Col
          md={11}
          className="part1"
          style={{ marginTop: '15px' }}
        >
          <p style={{ margin: 0, fontSize: 12 }}>
            A/C TYPE: {data.aircraftModelName || 'N/A'}
          </p>
          <p style={{ margin: 0, fontSize: 12 }}>
            PART NO: {data.partNo || 'N/A'}
          </p>
          <p style={{ fontSize: 12 }}>
            AlTERNATE PART NO:{' '}
            <span
              style={{ fontSize: data?.alternatePart?.length > 2 ? 8 : 10 }}
            >
              {data?.alternatePart?.map((part) => part.partNo).join(',') ||
                'N/A'}
            </span>
          </p>
        </Col>
        <Col
          md={8}
          className="part2"
          style={{ marginTop: '15px' }}
        >
          <p></p>
          <p style={{ margin: 0, marginTop: 20, fontSize: 12 }}>
            NOMENCLATURE: {data.description || 'N/A'}
          </p>
          <p style={{ margin: 0, fontSize: 12 }}>
            UNIT: {data.uomCode || 'N/A'}
          </p>
        </Col>
        <Col
          md={5}
          className="part3"
        >
          <Row
            style={{
              display: 'flex',
              marginTop: 30,
            }}
          >
            <Col style={style}>
              RACK <br />
              {data.rackCode
                ? data.rackCode
                : data.otherLocation
                ? data.otherLocation
                : 'Empty'}
            </Col>
            <Col style={style}>
              ROW <br />
              {!data.rackCode
                ? 'Empty'
                : data.rackRowCode
                ? data.rackRowCode
                : data.otherLocation}
            </Col>
            <Col style={{ ...style, borderRight: '0.4ox solid #000' }}>
              BIN <br />
              {!data.rackCode && !data.rackRowCode
                ? 'Empty'
                : data.rackRowBinCode
                ? data.rackRowBinCode
                : data.otherLocation}
            </Col>
          </Row>
        </Col>
      </Row>
      <ARMTable className="mel-table">
        <thead>
          <tr>
            <th>
              LINE <br /> NO.
            </th>
            <th>DATE</th>
            <th>S/NO.</th>
            <th>R/N</th>
            <th>
              RECVD. <br /> FROM
            </th>
            <th>
              QTY. <br /> RECVD
            </th>
            <th>T.S.O</th>
            <th>R/L/E</th>
            <th>
              VOUCHER NO/ <br /> DATE
            </th>
            <th>
              ISSUED TO <br /> AIRCRAFT
            </th>
            <th>
              QTY. <br /> ISSUED
            </th>
            <th>BAL</th>
            <th>INITIAL</th>
          </tr>
        </thead>
        <tbody>
          {data?.binDataList.map((bin, index) => {
            if (!bin.hasOwnProperty('dummyRow'))
              return (
                <tr key={index}>
                  <td style={{ width: '3%' }}>{index + 1}</td>
                  <td style={{ width: '10%', fontSize: 11 }}>
                    {formatDate(bin.createdAt)}
                  </td>
                  <td style={{ width: '10%', fontSize: 11 }}>
                    {bin.serialNumber}
                  </td>
                  <td style={{ width: '10%', fontSize: 11 }}>{bin.grn}</td>
                  <td style={{ width: '10%', fontSize: 11 }}>
                    {bin.vendorName?.name}
                  </td>
                  <td style={{ width: '5%', fontSize: 11 }}>
                    {bin.receivedQty}
                  </td>
                  <td style={{ width: '8%', fontSize: 11 }}>{bin.tso}</td>
                  <td style={{ width: '7%', fontSize: 11 }}>{bin.selfLife}</td>
                  <td style={{ width: '12%', fontSize: 8 }}>{bin.voucherNo}</td>
                  <td style={{ width: '10%', fontSize: 11 }}>
                    {bin.issuedAircraft}
                  </td>
                  <td style={{ width: '5%', fontSize: 11 }}>{bin.issuedQty}</td>
                  <td style={{ width: '5%', fontSize: 11 }}>{bin.inStock}</td>
                  <td style={{ width: '5%', fontSize: 11 }}>
                    {bin.submittedUser}
                  </td>
                </tr>
              );
            else
              return (
                <tr key={index}>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                  <td>6</td>
                  <td>7</td>
                  <td>8</td>
                  <td>9</td>
                  <td>10</td>
                  <td>11</td>
                  <td>12</td>
                  <td>13</td>
                </tr>
              );
          })}
        </tbody>
      </ARMTable>
    </Container>
  );
};

export default FirstPage;
