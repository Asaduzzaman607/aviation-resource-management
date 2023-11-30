import { Col, Row } from 'antd';
import styled from 'styled-components';
import ARMTable from '../../common/ARMTable';
import { formatDate } from '../../planning/report/Common';
import { style } from './FirstPage';

const Container = styled.div`
  padding-top: 50px;
  padding-left: 50px;
  padding-right: 50px;

  .mel-table thead tr th {
    height: 10px !important;
    padding: 0 !important;
  }
  .mel-table tbody tr {
    height: 25px !important;
  }
  .mel-table thead tr th,
  .mel-table tbody tr td {
    border-width: 0.4px !important;
    border-style: solid !important;
    border-color: #000 !important;
    padding: 0;
  }
`;

const NextPage = ({ data, cardIndex }) => {
  return (
    <Container className="bg-color">
      <Row justify="space-between">
        <Col
          md={11}
          className="part1"
        >
          <p style={{ margin: 0, marginTop: 50 }}>
            PART NO:
            {data.partNo ||
              '..................................................................................'}
          </p>
        </Col>
        <Col
          md={8}
          className="part2"
        >
          <p style={{ margin: 0, marginTop: 50 }}>
            NOMENCLATURE:{' '}
            {data.description ||
              '...................................................'}
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
            const lineNumber = (cardIndex - 1) * 20 + index + 16;
            if (!bin.hasOwnProperty('dummyRow'))
              return (
                <tr key={index}>
                  <td style={{ width: '4%' }}>{lineNumber}</td>
                  <td style={{ width: '10%', fontSize: 11 }}>{formatDate(bin.createdAt)}</td>
                  <td style={{ width: '10%', fontSize: 11 }}>{bin.serialNumber}</td>
                  <td style={{ width: '10%', fontSize: 11 }}>{bin.grn}</td>
                  <td style={{ width: '10%', fontSize: 11 }}>
                    {bin.vendor?.name}
                  </td>
                  <td style={{ width: '5%', fontSize: 11 }}>
                    {bin.receivedQty}
                  </td>
                  <td style={{ width: '8%', fontSize: 11 }}>{bin.tso}</td>
                  <td style={{ width: '7%', fontSize: 11 }}>{bin.selfLife}</td>
                  <td style={{ width: '12%', fontSize: 8 }}>{bin.voucherNo}</td>
                  <td style={{ width: '10%', fontSize: 11 }}>{bin.issuedToAir}</td>
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

export default NextPage;
