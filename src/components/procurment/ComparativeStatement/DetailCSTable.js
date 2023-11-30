import { Form, Table } from 'antd';
import { useEffect, useState } from 'react';
import CsPDF from './CsPDF';
import {
  getDiscountUnitPrice,
  getExcelBgColor,
  getExchangeType,
  getLow,
  getMov,
  getTotal,
  getVendorName,
} from './csHelper';

const DetailCSTable = ({
  generateCS,
  vendorLength,
  setExcelData,
  setExcelDataColumn,
  csNo,
  prepareCSPdfData = () => {},
  tableData = {},
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [prices, setPrices] = useState({});

  let lowPrice = [];
  let lowTotalPrice = [];
  let lowQuotedVendorName = [];

  const columns = [
    {
      title: 'Comparative Statement',
      dataIndex: 'comp',
      children: [
        {
          title: `${csNo}`,
          children: [
            {
              title: 'S/N',
              width: 60,
              dataIndex: 'id',
              fixed: 'left',
              className: 'pointer-events-none',
              excelRender: (value) => {
                return {
                  children: value,
                  __style__: {
                    height: 10,
                    h: 'center',
                    v: 'center',
                  },
                };
              },
            },
            {
              title: 'Description',
              width: 110,
              dataIndex: 'description',
              fixed: 'left',
              className: 'pointer-events-none',
              excelRender: (value) => {
                return {
                  children: value,
                  __style__: {
                    height: 10,
                    h: 'center',
                    v: 'center',
                  },
                };
              },
            },
            {
              title: 'Part Number',
              dataIndex: 'partNo',
              width: 100,
              fixed: 'left',
              className: 'pointer-events-none',
              excelRender: (value) => {
                return {
                  children: value,
                  __style__: {
                    height: 10,
                    h: 'center',
                    v: 'center',
                  },
                };
              },
            },
            {
              title: 'Alternate',
              dataIndex: 'alternate',
              width: 100,
              fixed: 'left',
              className: 'pointer-events-none',
              excelRender: (value) => {
                return {
                  children: value,
                  __style__: {
                    height: 10,
                    h: 'center',
                    v: 'center',
                  },
                };
              },
            },
            {
              title: 'Requested Qty',
              dataIndex: 'qty',
              width: 100,
              fixed: 'left',
              className: 'pointer-events-none',
              excelRender: (value) => {
                return {
                  children: value,
                  __style__: {
                    height: 10,
                    h: 'center',
                    v: 'center',
                  },
                };
              },
            },
            {
              title: 'Requested UOM',
              dataIndex: 'uomCode',
              width: 100,
              fixed: 'left',
              className: 'pointer-events-none',
              excelRender: (value) => {
                return {
                  children: value,
                  __style__: {
                    height: 10,
                    h: 'center',
                    v: 'center',
                  },
                };
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Lowest Price',
      dataIndex: 'lowestPrice',
      width: 100,
      className: 'pointer-events-none',
      excelRender: (value) => {
        return {
          children: value,
          __style__: {
            height: 10,
            h: 'center',
            v: 'center',
          },
        };
      },
    },
    {
      title: 'Total Price',
      dataIndex: 'lowestTotalPrice',
      width: 100,
      className: 'pointer-events-none',
      excelRender: (value) => {
        return {
          children: value,
          __style__: {
            height: 10,
            h: 'center',
            v: 'center',
          },
        };
      },
    },
    {
      title: 'Lowest Quoted Vendor',
      dataIndex: 'lowQuotedVendorName',
      width: 120,
      className: 'pointer-events-none',
      excelRender: (value) => {
        return {
          children: value,
          __style__: {
            height: 10,
            h: 'center',
            v: 'center',
          },
        };
      },
    },
    {
      title: 'Remark',
      dataIndex: 'moqRemark',
      width: 100,
      editable: true,
      className: 'pointer-events-none',
      excelRender: (value) => {
        return {
          children: value,
          __style__: {
            height: 10,
            h: 'center',
            v: 'center',
          },
        };
      },
    },
    {
      title: 'Audit Disposal',
      dataIndex: 'auditDisposal',
      width: 145,
      excelRender: (value) => {
        return {
          children: value,
          __style__: {
            height: 10,
            h: 'left',
            v: 'center',
          },
        };
      },
    },
  ];

  for (let j = 0; j < vendorLength.length; j++) {
    columns[0].children.push({
      title: vendorLength[j].vendorName,
      className: 'pointer-events-none',
      children: [
        {
          title: 'Unit Price',
          dataIndex: 'unitPrice' + vendorLength[j].vendorName,
          width: 100,
          className: 'pointer-events-none',
          excelRender: (value) => {
            return {
              children: value,
              __style__: {
                height: 10,
                h: 'center',
                v: 'center',
              },
            };
          },
        },
        {
          title: 'CD/LT',
          dataIndex: 'leadTime' + vendorLength[j].vendorName,
          width: 250,
          className: 'pointer-events-none',
          excelRender: (value) => {
            return {
              children: value,
              __style__: {
                height: 10,
                h: 'center',
                v: 'center',
              },
            };
          },
        },
        {
          title: 'VENDOR APPROVAL',
          dataIndex: 'vendorApproval' + vendorLength[j].vendorName,
          width: 150,
          className:
            vendorLength[j].vendorWorkFlowName === 'APPROVED'
              ? 'green-color pointer-events-none'
              : 'red-color pointer-events-none',
          excelRender: (value) => {
            return {
              children: value,
              __style__: {
                height: 10,
                h: 'center',
                v: 'center',
                background: getExcelBgColor(vendorLength[j].vendorWorkFlowName),
                color: 'white',
              },
            };
          },
        },
        {
          title: 'Total',
          dataIndex: 'total' + vendorLength[j].vendorName,
          width: 100,
          className: 'pointer-events-none',
          excelRender: (value) => {
            return {
              children: value,
              __style__: {
                height: 10,
                h: 'center',
                v: 'center',
              },
            };
          },
        },
      ],
    });
  }

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });

  useEffect(() => {
    if (generateCS) {
      const originData = [];
      let excel = [];

      const allPrice = {
        lowPrice: [],
        lowTotalPrice: [],
        lowQuotedVendorName: [],
      };

      for (let i = 0; i < generateCS?.length; i++) {
        let csDetailKeys = {};
        for (let j = 0; j < generateCS[i].vendors.length; j++) {
          csDetailKeys['unitPrice' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].unitPrice;
          csDetailKeys['total' + generateCS[i].vendors[j].vendorName] =
            getTotal(
              generateCS[i].vendors[j].vendorPartQuantity,
              generateCS[i].vendors[j].moq,
              generateCS[i].vendors[j].unitPrice,
              generateCS[i].vendors[j].mlv
            );
          csDetailKeys['leadTime' + generateCS[i].vendors[j].vendorName] = [
            generateCS[i].vendors[j].condition,
            generateCS[i].vendors[j].leadTime,
            `moq: ${generateCS[i].vendors[j].moq}`,
            `mlv: ${generateCS[i].vendors[j].mlv}`,
            `mov: ${generateCS[i].vendors[j].mov}`,
            `discount: ${generateCS[i].vendors[j].discount}%`,
            `Discounted Unit Price: ${getDiscountUnitPrice(
              generateCS[i].vendors[j].discount,
              generateCS[i].vendors[j].unitPrice
            )}`,
            `Vendor UOM: ${generateCS[i].vendors[j].vendorUomCode}`,
            `Quantity: ${generateCS[i].vendors[j].vendorPartQuantity}`,
            `Exchange Type: ${
              getExchangeType(generateCS[i].vendors[j].exchangeType) || 'N/A'
            }`,
            `Exchange Fee: ${generateCS[i].vendors[j].exchangeFee || 'N/A'}`,
            `Repair Cost: ${generateCS[i].vendors[j].repairCost || 'N/A'}`,
            `Ber Limit: ${generateCS[i].vendors[j].berLimit || 'N/A'}`,
            `Currency: ${generateCS[i].vendors[j].currencyCode || 'N/A'}`,
            `To Meet MOV: ${
              getMov(
                generateCS[i].vendors[j].mov,
                csDetailKeys['total' + generateCS[i].vendors[j].vendorName]
              ) || 'N/A'
            }`,
          ].join('\n');

          lowPrice[j] =
            generateCS[i].vendors[j].unitPrice &&
            generateCS[i].vendors[j].vendorPartQuantity >= generateCS[i].qty
              ? generateCS[i].vendors[j].unitPrice
              : 0;
          lowTotalPrice[j] =
            (generateCS[i].vendors[j].unitPrice &&
            generateCS[i].vendors[j].vendorPartQuantity >= generateCS[i].qty
              ? generateCS[i].vendors[j].unitPrice
              : 0) * generateCS[i].vendors[j].vendorPartQuantity;
          lowQuotedVendorName[j] = {
            lowTotalPrice:
              (generateCS[i].vendors[j].unitPrice &&
              generateCS[i].vendors[j].vendorPartQuantity >= generateCS[i].qty
                ? generateCS[i].vendors[j].unitPrice
                : 0) * generateCS[i].vendors[j].vendorPartQuantity,
            vendorName: generateCS[i].vendors[j].vendorName,
          };
        }

        // for comments in browser
        let disposal = '';
        generateCS[i].comments?.forEach((comment) => {
          disposal += `${comment.auditDisposal}\n`;
          comment.attachments.forEach((file) => {
            disposal += `<a href="${file}" target="_blank">${
              file?.split('/')?.pop() || ''
            }</a>\n`;
          });
        });

        // for comments in excel
        let excelDisposal = '';
        generateCS[i].comments?.forEach((comment) => {
          excelDisposal += `${comment.auditDisposal}\n`;
          comment.attachments.forEach((file) => {
            excelDisposal += `${file}\n`;
          });
        });

        // for cs pdf and sending props
        allPrice.lowPrice.push(lowPrice);
        allPrice.lowTotalPrice.push(lowTotalPrice);
        allPrice.lowQuotedVendorName.push(lowQuotedVendorName);

        originData.push({
          key: i.toString(),
          id: i + 1,
          qty: generateCS[i]?.qty,
          description: generateCS[i]?.partDescription,
          partNo: generateCS[i]?.partNo,
          itemId: generateCS[i]?.itemId,
          uomCode: generateCS[i]?.uomCode,
          lowestPrice: getLow(lowPrice),
          lowestTotalPrice: getLow(lowTotalPrice),
          lowQuotedVendorName: getVendorName(
            lowQuotedVendorName,
            getLow(lowTotalPrice)
          ),
          moqRemark: generateCS[i]?.moqRemark,
          auditDisposal: (
            <div
              dangerouslySetInnerHTML={{ __html: disposal || 'No Comment' }}
            />
          ),
          ...csDetailKeys,
        });

        lowPrice = [];
        lowTotalPrice = [];
        lowQuotedVendorName = [];

        // excel data
        excel = [
          ...excel,
          { ...originData[i], auditDisposal: excelDisposal || 'No Comment' },
        ];
      }

      // setting the prices for cs pdf
      setPrices(allPrice);
      setData(originData);
      setExcelData(excel);

      // calling function for preparing csPdf data
      prepareCSPdfData(mergedColumns, generateCS);
    }

    setExcelDataColumn(mergedColumns);
  }, [generateCS]);

  return (
    <>
      {/* start of multiple vendor */}
      {Object.keys(tableData).length > 0 && (
        <CsPDF
          data={tableData}
          prices={prices}
        />
      )}
      <br />
      {/* end of multiple vendor */}

      {generateCS && (
        <Form
          form={form}
          component={false}
        >
          <Table
            bordered
            style={{ whiteSpace: 'pre-line' }}
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={false}
            scroll={{
              x: 1000,
              y: 500,
            }}
          />
        </Form>
      )}
    </>
  );
};

export default DetailCSTable;
