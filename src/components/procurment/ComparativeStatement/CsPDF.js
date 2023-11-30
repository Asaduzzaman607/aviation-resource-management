import { Button } from 'antd';
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import ARMTable from '../../common/ARMTable';
import {
  getDiscountUnitPrice,
  getLow,
  getMov,
  getTotal,
  getVendorName,
} from './csHelper';

const CsPDF = ({ data, prices }) => {
  // console.log({ data });

  const componentRef = useRef(null);

  const totalPages = Math.ceil(data.headers.length / 10);
  const rowsPerPage = 10;

  const printStyle = `
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important; 
        }
        @page{
            size: A4 landscape !important;
            margin: 30px !important;
        }
        .vendor {
          display: block !important;
        }
        .vendor thead tr th {
          font-size: 4px !important;
        }
        .vendor tbody tr td {
            font-size: 4px !important;
            padding: 0px !important;
            word-wrap: break-word;
            margin-left: 100px !important;
        }
      }
  `;

  return (
    <div>
      <ReactToPrint
        content={() => componentRef.current}
        trigger={() => <Button type="primary">Download PDF</Button>}
        pageStyle={printStyle}
      />
      <div
        ref={componentRef}
        className="vendor"
        style={{ display: 'none' }}
      >
        {Array.from({ length: totalPages }, (_, pageIndex) => {
          const startIndex = pageIndex * rowsPerPage;
          const endIndex = startIndex + rowsPerPage;

          const headers = [
            { label: data.headers[0].title, colspan: 6 },
            ...data.headers
              .slice(startIndex + 1, endIndex + 1)
              .map((head) => ({ label: head.title, colspan: 4 })),
            ...data.headers2,
          ];

          let subHeaders = {};
          data.rows.forEach((row, index) => {
            const rowData = {
              sn: 'S/N',
              description: 'Description',
              partNo: 'Part No.',
              alternate: 'Alternate',
              reqQty: 'Req. \n Qty',
              reqUOM: 'Req. \nUOM',
              vendors: row.slice(startIndex + 1, endIndex + 1).flatMap(() => [
                {
                  unitPrice: 'Unit \nPrice',
                  cdLt: 'CD/LT',
                  vendorApproval: 'Vendor \nApproval',
                  total: 'Total',
                },
              ]),
            };
            if (index === 0) subHeaders = { ...rowData };
            else return;
          });

          // console.log('SubHeaders', { subHeaders });

          const rows = data.rows.map((row) => {
            const rowData = {
              sn: row[0].sn,
              description: row[0].description,
              partNo: row[0].partNo,
              remark: row[0].remark,
              comments: row[0].comments,
              alternate: row[0].alternate,
              reqQty: row[0].reqQty,
              reqUOM: row[0].reqUOM,
              vendors: row
                .slice(startIndex + 1, endIndex + 1)
                .flatMap((cs) => [{ ...cs }]),
            };
            return rowData;
          });

          // console.log('rows', { rows });

          return (
            <ARMTable key={pageIndex}>
              <thead>
                {/* header  */}
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      colSpan={header.colspan}
                      rowSpan={header.rowSpan}
                    >
                      <pre>{header.label}</pre>
                    </th>
                  ))}
                </tr>
                {/* sub header */}
                <tr>
                  <th>{subHeaders.sn}</th>
                  <th>{subHeaders.description}</th>
                  <th>{subHeaders.partNo}</th>
                  <th>{subHeaders.alternate}</th>
                  <th>
                    <pre>{subHeaders.reqQty}</pre>
                  </th>
                  <th>
                    <pre>{subHeaders.reqUOM}</pre>
                  </th>
                  {subHeaders.vendors.map((subHeader, index) => {
                    return (
                      <React.Fragment key={index}>
                        <th>
                          <pre>{subHeader.unitPrice}</pre>
                        </th>
                        <th>{subHeader.cdLt}</th>
                        <th>
                          <pre>{subHeader.vendorApproval}</pre>
                        </th>
                        <th>{subHeader.total}</th>
                      </React.Fragment>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* rows data */}
                {rows.map((row, index) => {
                  return (
                    <tr key={index}>
                      <td>{row.sn}</td>
                      <td>{row.description}</td>
                      <td>{row.partNo}</td>
                      <td>
                        {row?.alternate.map((alt, index) => (
                          <React.Fragment key={index}>
                            {alt} <br />
                          </React.Fragment>
                        ))}
                      </td>
                      <td>{row.reqQty}</td>
                      <td>{row.reqUOM}</td>
                      {row.vendors.map((vendor, index) => {
                        return (
                          <React.Fragment key={index}>
                            <td>{vendor.unitPrice}</td>
                            <td>
                              {vendor.condition && (
                                <>
                                  {vendor.condition} <br />
                                </>
                              )}
                              {vendor.leadTime && (
                                <>
                                  {vendor.leadTime}
                                  <br />
                                </>
                              )}
                              {vendor.moq != null && (
                                <>
                                  MOQ : {vendor.moq}
                                  <br />
                                </>
                              )}
                              {vendor.mlv != null && (
                                <>
                                  MLV : {vendor.mlv}
                                  <br />
                                </>
                              )}
                              {vendor.mov != null && (
                                <>
                                  MOV : {vendor.mov}
                                  <br />
                                </>
                              )}
                              Discount : {vendor.discount || 0} % <br />
                              Disc. Unit Price:
                              {getDiscountUnitPrice(
                                vendor.discount,
                                vendor.unitPrice
                              ) || 0}
                              <br />
                              {vendor.vendorPartQuantity != null && (
                                <>
                                  Qty : {vendor.vendorPartQuantity}
                                  <br />
                                </>
                              )}
                              {vendor.vendorUomCode && (
                                <>
                                  Vendor UOM : {vendor.vendorUomCode}
                                  <br />
                                </>
                              )}
                              {vendor.exchangeType && (
                                <>
                                  Exc. Type : {vendor.exchangeType}
                                  <br />
                                </>
                              )}
                              {vendor.exchangeFee != null && (
                                <>
                                  Exc. Fee : {vendor.exchangeFee}
                                  <br />
                                </>
                              )}
                              {vendor.repairCost != null && (
                                <>
                                  Repair Cost : {vendor.repairCost}
                                  <br />
                                </>
                              )}
                              {vendor.berLimit && (
                                <>
                                  Ber Limit : {vendor.berLimit}
                                  <br />
                                </>
                              )}
                              {vendor.currencyCode && (
                                <>
                                  Currency : {vendor.currencyCode}
                                  <br />
                                </>
                              )}
                              To meet MOV:
                              {getMov(
                                vendor.mov,
                                getTotal(
                                  vendor.vendorPartQuantity,
                                  vendor.moq,
                                  vendor.unitPrice,
                                  vendor.mlv
                                )
                              ) || 'N/A'}
                            </td>
                            <td
                              style={{
                                background: vendor.isApproved ? '#04aa6d' : 'red',
                              }}
                            ></td>
                            <td>
                              {getTotal(
                                vendor.vendorPartQuantity,
                                vendor.moq,
                                vendor.unitPrice,
                                vendor.mlv
                              )}
                            </td>
                          </React.Fragment>
                        );
                      })}
                      {/* header 2 data*/}
                      <td>{getLow(prices.lowPrice[index])}</td>
                      <td>{getLow(prices.lowTotalPrice[index])}</td>
                      <td>
                        {getVendorName(
                          prices.lowQuotedVendorName[index],
                          getLow(prices.lowTotalPrice[index])
                        )}
                      </td>
                      <td>{row.remark}</td>
                      <td>
                        {row?.comments.map((comment, index) => {
                          return (
                            <React.Fragment key={index}>
                              <span style={{ fontSize: '5px' }}>
                                {comment.auditDisposal || 'No Comments'}
                              </span>
                              <br />
                              {comment?.attachments.map((file, index) => {
                                if (file)
                                  return (
                                    <React.Fragment key={index}>
                                      <a
                                        href={file}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ fontSize: '5px' }}
                                      >
                                        see file
                                      </a>
                                      <br />
                                    </React.Fragment>
                                  );
                              })}
                            </React.Fragment>
                          );
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <div
                style={{
                  pageBreakAfter: 'always',
                }}
              ></div>
            </ARMTable>
          );
        })}
      </div>
    </div>
  );
};

export default CsPDF;
