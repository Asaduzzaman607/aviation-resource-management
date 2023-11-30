import axiosInstance from "../Api";

class VendorCapabilitiesLogService {
 getAllVendorCapabilitiesLog(size,data){
     return axiosInstance.post(`/configuration/vendor-capabilities-logs/search?page=0&size=${size}`, data)
 }
}
export default new VendorCapabilitiesLogService();