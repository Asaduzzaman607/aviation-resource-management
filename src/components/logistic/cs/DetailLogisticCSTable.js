import { Form, Table } from 'antd';
import { useEffect, useState } from 'react';
import {
  getDiscountUnitPrice,
  getLow,
  getVendorName,
} from '../../procurment/ComparativeStatement/csHelper';

const DetailLogisticCSTable = ({
  generateCS,
  vendorLength,
  setExcelData,
  setExcelDataColumn,
  csNo,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  const columns = [
    {
      title: 'Comparative Statement',
      children: [
        {
          title: `${csNo}`,
          children: [
            {
              title: 'S/N',
              width: 60,
              dataIndex: 'sn',
              fixed: 'left',
            },
            {
              title: 'Description',
              width: 100,
              dataIndex: 'description',
              fixed: 'left',
            },
            {
              title: 'Part Number',
              dataIndex: 'partNo',
              width: 100,
              fixed: 'left',
            },
            {
              title: 'Alternate',
              dataIndex: 'alternate',
              width: 100,
              fixed: 'left',
            },
          ],
        },
      ],
    },
    {
      title: 'Lowest Price',
      dataIndex: 'lowestPrice',
      width: 100,
    },
    {
      title: 'Total Price',
      dataIndex: 'lowestTotalPrice',
      width: 100,
    },
    {
      title: 'Lowest Quoted Vendor',
      dataIndex: 'lowQuotedVendorName',
      width: 120,
    },
    {
      title: 'Remark',
      dataIndex: 'moqRemark',
      width: 100,
      editable: true,
    },
    {
      title: 'Audit Disposal',
      dataIndex: 'auditDisposal',
      width: 145,
    },
  ];

  for (let j = 0; j < vendorLength.length; j++) {
    columns[0].children.push({
      title: vendorLength[j],
      children: [
        {
          title: 'Unit Price',
          dataIndex: 'unitPrice' + vendorLength[j],
          width: 100,
        },
        {
          title: 'Discounted Unit Price',
          dataIndex: 'discount' + vendorLength[j],
          width: 150,
        },
        {
          title: 'Qty',
          dataIndex: 'vendorPartQuantity' + vendorLength[j],
          width: 80,
        },
        {
          title: 'Vendor UOM',
          dataIndex: 'vendorUomCode' + vendorLength[j],
          width: 80,
        },
        {
          title: 'CD/LT',
          dataIndex: 'leadTime' + vendorLength[j],
          width: 120,
        },
        {
          title: 'Currency',
          dataIndex: 'currencyCode' + vendorLength[j],
          width: 110,
        },
        {
          title: 'Total',
          dataIndex: 'total' + vendorLength[j],
          width: 100,
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
      let lowPrice = [];
      let lowTotalPrice = [];
      let lowQuotedVendorName = [];

      const originData = [];
      let excel = [];

      for (let i = 0; i < generateCS?.length; i++) {
        let csDetailKeys = {};
        for (let j = 0; j < generateCS[i].vendors.length; j++) {
          csDetailKeys['unitPrice' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].unitPrice;
          csDetailKeys['discount' + generateCS[i].vendors[j].vendorName] =
            getDiscountUnitPrice(
              generateCS[i].vendors[j].discount,
              generateCS[i].vendors[j].unitPrice
            );
          csDetailKeys['leadTime' + generateCS[i].vendors[j].vendorName] = [
            generateCS[i].vendors[j].condition,
            generateCS[i].vendors[j].leadTime,
            `discount: ${generateCS[i].vendors[j].discount}%`,
          ].join('\n');
          csDetailKeys['total' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].vendorPartQuantity *
            generateCS[i].vendors[j].unitPrice;

          csDetailKeys[
            'vendorPartQuantity' + generateCS[i].vendors[j].vendorName
          ] = generateCS[i].vendors[j].vendorPartQuantity;
          csDetailKeys['vendorUomCode' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].vendorUomCode;

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
          csDetailKeys['currencyCode' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].currencyCode;
        }

        // for comments in browser
        let disposal = '';
        generateCS[i].comments?.forEach((comment) => {
          disposal += `${comment.auditDisposal}\n`;
          comment.attachments.forEach((file) => {
            disposal += `<a href="${file}" target="_blank">${file
              .split('/')
              .pop()}</a>\n`;
          });
        });

        // for comments in exel
        let excelDisposal = '';
        generateCS[i].comments?.forEach((comment) => {
          excelDisposal += `${comment.auditDisposal}\n`;
          comment.attachments.forEach((file) => {
            excelDisposal += `${file}\n`;
          });
        });

        originData.push({
          key: i.toString(),
          id: generateCS[i]?.id,
          sn: i + 1,
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
        // excel data
        excel = [
          ...excel,
          { ...originData[i], auditDisposal: excelDisposal || 'No Comment' },
        ];
      }
      setData(originData);
      setExcelData(excel);
    }
    setExcelDataColumn(mergedColumns);
  }, [generateCS]);

  return (
    <>
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

export default DetailLogisticCSTable;
