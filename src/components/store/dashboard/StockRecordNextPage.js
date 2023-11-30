import { Col, Row } from 'antd';
import styled from 'styled-components';
import ARMTable from '../../common/ARMTable';
import { formatDate } from '../../planning/report/Common';

const Container = styled.div`
  padding-top: 50px;
  padding-left: 50px;
  padding-right: 50px;

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

const StockRecordNextPage = ({ data, stockIndex }) => {
  const { partNo, description } = data;
  return (
    <Container className="bg-color">
      <Row justify="space-between">
        <Col md={11}>
          <p style={{ margin: 0, marginTop: 50, marginBottom: 10 }}>
            PART NO:{' '}
            {partNo
              ? partNo
              : '..................................................................................'}
          </p>
        </Col>
        <Col md={8}>
          <p style={{ margin: 0, marginTop: 50, marginBottom: 10 }}>
            NOMENCLATURE:{' '}
            {description
              ? description
              : '...................................................'}
          </p>
        </Col>
      </Row>
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
            const lineNumber = (stockIndex - 1) * 25 + index + 16;
            return (
              <tr key={index}>
                <td style={{ width: '4%' }}>{lineNumber}</td>
                <td style={{ width: '12%' }}>{formatDate(stock.createdAt)}</td>
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
    </Container>
  );
};

export default StockRecordNextPage;
