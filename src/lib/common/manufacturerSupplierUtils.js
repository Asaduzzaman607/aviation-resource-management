import _ from 'lodash';

export const prepareVendorCapabilities = (id, values, checkedCapabilities) => {
  let capabilities = [];

  if (id) {
    const capabilityList = values.vendorCapabilityLogRequestDtoList
      ? _.cloneDeep(values.vendorCapabilityLogRequestDtoList)
      : [];
    capabilities = checkedCapabilities.map((checked) => {
      const index = capabilityList.findIndex(
        (cap) => cap === checked.vendorCapabilityId
      );
      if (index > -1) {
        capabilityList.splice(index, 1);
        return {
          id: checked.id,
          vendorCapabilityId: checked.vendorCapabilityId,
          status: true,
        };
      } else {
        return {
          id: checked.id,
          vendorCapabilityId: checked.vendorCapabilityId,
          status: false,
        };
      }
    });
    capabilities = [
      ...capabilities,
      ...capabilityList.map((newCap) => ({
        vendorCapabilityId: newCap,
        status: true,
      })),
    ];
  } else {
    capabilities = values.vendorCapabilityLogRequestDtoList?.map((data) => ({
      vendorCapabilityId: data,
      status: true,
    }));
  }

  return capabilities || [];
};

export const capabilityStatus = (capabilities) => {
  let capStatus = false;

  for (const cap of capabilities) {
    if (cap.status) {
      capStatus = true;
      break;
    }
  }

  return capStatus;
};

export function getVendorStatus(value){
  return value === "APPROVED" ? "Approved" : "Unapproved";
}
