import { Checkbox, Table } from 'antd';
import { useEffect, useState } from 'react';
import {
  getDiscountUnitPrice,
  getLow,
  getString,
  getVendorName,
} from '../../procurment/ComparativeStatement/csHelper';

const CsPoTable = ({
  form,
  setSubTotal,
  generateCS,
  vendorLength,
  validTill,
  subTotal,
  value,
  setValue,
}) => {
  let partOrderDtoList = [];
  const [data, setData] = useState([]);
  const [checkedValues, setCheckedValues] = useState({});
  const [prices, setPrices] = useState({});
  let lowPrice = [];
  let lowTotalPrice = [];
  let lowQuotedVendorName = [];
  useEffect(() => {
    setSubTotal(Object.values(prices).reduce((a, b) => a + b, 0));
  }, [checkedValues]);

  useEffect(() => {
    if (generateCS) {
      const originData = [];

      for (let i = 0; i < generateCS?.length; i++) {
        let csDetailKeys = {};
        for (let j = 0; j < generateCS[i].vendors.length; j++) {
          csDetailKeys['csDetailId' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].csDetailId;
          csDetailKeys['detailId' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].detailId;
          csDetailKeys['unitPrice' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].unitPrice;
          csDetailKeys[
            'vendorPartQuantity' + generateCS[i].vendors[j].vendorName
          ] = generateCS[i].vendors[j].vendorPartQuantity;
          csDetailKeys['vendorUomCode' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].vendorUomCode;
          csDetailKeys['discount' + generateCS[i].vendors[j].vendorName] =
            getDiscountUnitPrice(
              generateCS[i].vendors[j].discount,
              generateCS[i].vendors[j].unitPrice
            );
          csDetailKeys['leadTime' + generateCS[i].vendors[j].vendorName] = (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  generateCS[i].vendors[j].condition +
                  '<br> ' +
                  generateCS[i].vendors[j].leadTime +
                  '<br/>' +
                  getString('discount: ', generateCS[i].vendors[j].discount) +
                  '%',
              }}
            ></div>
          );
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
          csDetailKeys['total' + generateCS[i].vendors[j].vendorName] =
            generateCS[i].vendors[j].vendorPartQuantity *
            generateCS[i].vendors[j].unitPrice;
        }

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
          vendors: generateCS[i]?.vendors,
          ...csDetailKeys,
        });
      }
      setData(originData);
    }
  }, [generateCS]);

  const columns = [
    {
      title: 'Comparative Statement',
      children: [
        {
          title: 'Comparative Statement',
          children: [
            {
              title: 'S/N',
              width: 60,
              dataIndex: 'sn',
              fixed: 'left',
            },
            {
              title: 'DESCRIPTION',
              width: 150,
              dataIndex: 'description',
              fixed: 'left',
            },
            {
              title: 'PART NUMBER',
              dataIndex: 'partNo',
              width: 100,
              fixed: 'left',
            },
            {
              title: 'ALTERNATE',
              dataIndex: 'alternate',
              width: 110,
              fixed: 'left',
            },
            // {
            //   title: 'QTY',
            //   dataIndex: 'qty',
            //   width: 60,
            //   fixed: 'left',
            // },
            // {
            //   title: 'UOM',
            //   dataIndex: 'uomCode',
            //   width: 80,
            //   fixed: 'left',
            // },
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
  ];

  for (let j = 0; j < vendorLength.length; j++) {
    columns[0].children.push({
      title: vendorLength[j],
      children: [
        {
          title: '',
          dataIndex: 'csDetailId' + vendorLength[j],
          width: 100,
          render: (_, record) => {
            return (
              <>
                {'csDetailId' + vendorLength[j] &&
                record['csDetailId' + vendorLength[j]] ? (
                  <Checkbox.Group
                    name={record.id}
                    onChange={(ev) => {
                      setCheckedValues((prev) => ({
                        ...prev,
                        [record.id]: [
                          ...(checkedValues[record.id] || []),
                          ev[0],
                          record['detailId' + vendorLength[j]],
                        ],
                      }));
                    }}
                    // value={checkedValues[record.id] || []}
                  >
                    <Checkbox
                      value={'csDetailId' + vendorLength[j]}
                      onChange={(e) => {
                        let total = 'total' + vendorLength[j];
                        if (e.target.checked) {
                          setPrices((prev) => ({
                            ...prev,
                            [record.id]: record[total],
                          }));
                        } else {
                          checkedValues[record.id] = checkedValues[
                            record.id
                          ].filter((el) => el !== e.target.value);
                          setPrices((prev) => ({
                            ...prev,
                            [record.id]: 0,
                          }));
                        }
                      }}
                    ></Checkbox>
                  </Checkbox.Group>
                ) : null}
              </>
            );
          },
        },
        {
          title: 'Unit Price',
          dataIndex: 'unitPrice' + vendorLength[j],
          width: 100,
        },
        {
          title: 'Discounted Unit Price',
          dataIndex: 'discount' + vendorLength[j],
          width: 100,
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
          width: 150,
        },
        {
          title: 'TOTAL',
          dataIndex: 'total' + vendorLength[j],
          width: 100,
        },
      ],
    });
  }

  useEffect(() => {
    data.forEach((item) => {
      for (let checkedKey in checkedValues) {
        if (item.id == checkedKey && checkedValues[checkedKey] !== undefined) {
          let i = 1;
          for (let itemKey in item) {
            for (let ds of checkedValues[checkedKey]) {
              if (itemKey === ds) {
                partOrderDtoList.push({
                  csDetailId: item[itemKey],
                  itemIdList: checkedValues[checkedKey][i],
                });
                i += 2;
              }
            }
          }
        }
      }
    });
    let test = {};
    let list = [];
    partOrderDtoList.forEach((p) => {
      if (test[p.csDetailId]) {
        let index = list.findIndex((f) => f.csDetailId === p.csDetailId);
        list[index].itemIdList.push(p.itemIdList);
      } else {
        test[p.csDetailId] = true;
        list.push({
          csDetailId: p.csDetailId,
          itemIdList: [p.itemIdList],
        });
      }
    });

    setValue(list);
  }, [checkedValues]);

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

  return (
    <>
      {generateCS && (
        <Table
          bordered
          dataSource={data}
          columns={mergedColumns}
          pagination={false}
          scroll={{
            x: 1000,
            y: 500,
          }}
        />
      )}
    </>
  );
};

export default CsPoTable;
