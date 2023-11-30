import { notification } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { notifyResponseError } from '../../../lib/common/notifications';
import API from '../../../service/Api';
import POService from '../../../service/procurment/POService';

const usePoDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const locationData =
    location?.state === null
      ? 'approved'
      : location?.state?.pendingOrApproved
      ? location.state.pendingOrApproved
      : location.state.data;

  const [info, setInfo] = useState({});
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [mov, setMov] = useState(0);
  const [totalExtraCost, setTotalExtraCost] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [currencyCode, setCurrencyCode] = useState('');

  // final calculation of PO
  const finalCalculation = (data, updatedData, movData, finalExtraCost) => {
    const total = updatedData.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const sTotal = movData > total ? movData : total;
    const discount =
      (data.discountType === 'AMOUNT'
        ? data.discount
        : (sTotal * data.discount) / 100) || 0;
    const totalAmount = sTotal + (finalExtraCost || totalExtraCost) - discount;

    setTableData2(updatedData);
    setSubTotal(sTotal || 0);
    setDiscount(discount || 0);
    setGrandTotal(totalAmount || 0);
  };

  // updating table data when checkbox & qty is changed
  const updateRecord = (record, field, value, finalCalculation) => {
    const updatedRecord = { ...record, [field]: value };

    const newQty =
      updatedRecord.partQuantity > updatedRecord.moq
        ? updatedRecord.partQuantity
        : updatedRecord.moq;

    // discounted unit price is causing issue; will solve the next day
    const newUnitPrice =
      value && updatedRecord.withDiscount
        ? updatedRecord.discountedUnitPrice
        : updatedRecord.unitPrice;

    //

    const newPrice =
      (newQty * newUnitPrice > record.mlv
        ? newQty * newUnitPrice
        : record.mlv) || 0;

    updatedRecord.totalAmount = newPrice;

    const updatedDataSource = tableData2.map((item) =>
      item.key === record.key ? updatedRecord : item
    );

    setIsDisabled(false);

    finalCalculation(info, updatedDataSource, mov);
  };

  const countDiscount = (record = {}, discountAmount) => {
    if (record.discountType === 'AMOUNT') {
      return `Discount: ${discountAmount?.toFixed(2)} ${currencyCode}`;
    }
    return `Discount(${record.discount || 0}%): ${discountAmount?.toFixed(
      2
    )} ${currencyCode}`;
  };

  const onFinish = async () => {
    try {
      const modifiedValue = tableData2.map((item) => {
        return {
          id: item.key,
          quantity: item.partQuantity,
          isDiscount: item.withDiscount,
          vendorSerials: item.vendorSerials,
        };
      });
      await API.put('/vendor-quotation-detail/quantity', {
        vqdQuantities: modifiedValue,
        vqId: info.vendorQuotationViewModel.id,
        poId: info.id,
      });
      notification['success']({ message: 'Updated Successfully' });
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const getTableData = async () => {
    const data2 = [];
    let sl = 0;
    let extraCost = 0;

    try {
      const { data } = await POService.getPOById(id);
      setInfo(data);
      setTableData1([
        {
          key: data.id,
          orderNo: data.orderNo,
          poDate: data.vendorQuotationViewModel.date,
          reqNo: data.vendorQuotationViewModel.quoteRequestNo.startsWith(
            'INVISIBLE'
          )
            ? ''
            : data.vendorQuotationViewModel.quoteRequestNo,
          quotationNo: data.vendorQuotationViewModel.quotationNo,
          quotationDate: data.vendorQuotationViewModel.date,
          quoteRequestDate:
            data.vendorQuotationViewModel.quoteRequestNo.startsWith('INVISIBLE')
              ? ''
              : data.vendorQuotationViewModel.quoteRequestDate,
        },
      ]);

      data.poItemResponseDtoList.forEach((item) => {
        if (item.vendorQuotationInvoiceDetails?.repairCost) {
          extraCost += item.vendorQuotationInvoiceDetails?.repairCost;
        }
        if (item.vendorQuotationInvoiceDetails?.raiScrapFee) {
          extraCost += item.vendorQuotationInvoiceDetails?.raiScrapFee;
        }
        if (item.vendorQuotationInvoiceDetails?.evaluationFee) {
          extraCost += item.vendorQuotationInvoiceDetails?.evaluationFee;
        }
        if (item.vendorQuotationInvoiceDetails?.exchangeFee) {
          extraCost += item.vendorQuotationInvoiceDetails?.exchangeFee;
        }

        // calculating unit price, qty & newTotal price

        const discountedUnitPrice =
          item.unitPrice -
            (item.unitPrice * item.vendorQuotationInvoiceDetails?.discount) /
              100 || 0;

        const newUnitPrice =
          item.vendorQuotationInvoiceDetails?.discount > 0 &&
          item.vendorQuotationInvoiceDetails?.isDiscount
            ? discountedUnitPrice
            : item.unitPrice;
        const newQty =
          item.vendorQuotationInvoiceDetails?.moq > item.quantity
            ? item.vendorQuotationInvoiceDetails?.moq
            : item.quantity;
        const newPrice =
          newQty * newUnitPrice > item.vendorQuotationInvoiceDetails?.mlv
            ? newQty * newUnitPrice
            : item.vendorQuotationInvoiceDetails?.mlv;

        return data2.push({
          key: item.itemId,
          sl: ++sl,
          aircraftName: data.poItemResponseDtoList[0].aircraftName,
          partNo: item.partNo,
          serialNo: item.vendorQuotationInvoiceDetails?.serialNo,
          partDescription: item.partDescription,
          partQuantity: item.quantity,
          vendorSerials: item.vendorSerials,
          uomCode: item.uomCode,
          unitPrice: item.unitPrice || 0,
          discount: item.vendorQuotationInvoiceDetails?.discount || 0,
          withDiscount: item.vendorQuotationInvoiceDetails?.isDiscount
            ? true
            : false,
          discountedUnitPrice: discountedUnitPrice.toFixed(2),
          moq: item.vendorQuotationInvoiceDetails?.moq,
          mlv: item.vendorQuotationInvoiceDetails?.mlv,
          cdlt: item.cd || item.lt ? item.cd + '/' + item.lt : '',
          totalAmount: newPrice || 0,
        });
      });

      const finalExtraCost =
        data.vendorQuotationViewModel.vendorQuotationFees.reduce(
          (acc, curr) => acc + curr.feeCost,
          extraCost || 0
        );
      const movData =
        data.vendorQuotationViewModel.vendorQuotationDetails[0]?.mov;
      const currency =
        data.vendorQuotationViewModel.vendorQuotationDetails[0]?.currencyCode;

      setCurrencyCode(currency || '');
      setMov(movData);
      setTotalExtraCost(finalExtraCost);

      finalCalculation(data, data2, movData, finalExtraCost);
    } catch (error) {
      notifyResponseError(error);
    }
  };

  useEffect(() => {
    getTableData();
  }, []);

  return {
    id,
    info,
    locationData,
    tableData1,
    tableData2,
    mov,
    totalExtraCost,
    grandTotal,
    subTotal,
    discount,
    isDisabled,
    currencyCode,
    countDiscount,
    finalCalculation,
    updateRecord,
    onFinish,
  };
};

export default usePoDetails;
