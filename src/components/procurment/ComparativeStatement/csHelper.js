export function getString(name, value) {
  if (value === null) {
    return '';
  } else {
    return name + value;
  }
}

export function getTotal(qty, moq, unitPrice, mlv) {
  let total = 0;
  if (qty >= moq) {
    total = qty * unitPrice;
  } else {
    total = moq * unitPrice;
  }
  if (total >= mlv) {
    return total;
  } else {
    return mlv;
  }
}

export function getMov(mov, total) {
  if (total >= mov) {
    // return total;
    return '';
  } else {
    return mov - total;
  }
}

export function getExchangeType(exchangeType) {
  switch (exchangeType) {
    case 'FLAT_RATE_EXCHANGE_WITH_NO_BILL_BACK':
      return 'Flat Rate Exchange with no Bill Back';
    case 'EXCHANGE_WITH_COST':
      return 'Exchange+Cost';
    case 'FLAT_RATE_EXCHANGE_WITH_BER_LIMIT':
      return 'Flat Rate Exchange with ber limit';
    case 'PURCHASE':
      return 'Purchase';
    case 'REPAIR':
      return 'Repair';
    case 'LOAN':
      return 'Loan';
    default:
      break;
  }
}

export function getLow(lowPrice) {
  const lowValueWithOutZero = lowPrice.filter((element) => element !== 0);
  if (lowValueWithOutZero.length >= 1) {
    return Math.min(...lowValueWithOutZero);
  } else {
    return ' ';
  }
}

export function getVendorName(lowQuotedVendorName, lowTotalPrice) {
  if (lowTotalPrice === '') {
    return '';
  } else {
    let vendorsName = [];
    lowQuotedVendorName.map((data) => {
      if (data.lowTotalPrice === lowTotalPrice) {
        vendorsName.push(data.vendorName);
      }
    });
    if (vendorsName.length === 1) {
      return vendorsName[0];
    } else {
      return vendorsName.toString();
    }
  }
}

export function getDiscountUnitPrice(discount, unitPrice) {
  if (
    discount === undefined ||
    discount === '' ||
    discount === null ||
    discount === 0
  ) {
    return '';
  } else {
    let discountAmount = (discount * unitPrice) / 100;
    return (unitPrice - discountAmount).toFixed(2);
  }
}

export function getBgColor(value) {
  return value === 'APPROVED' ? '#008000' : '#cc0000';
}

export function getExcelBgColor(value) {
  return value === 'APPROVED' ? '008000' : 'cc0000';
}
