import axiosInstance from "./Api";

class NotificationSettingService {
    getAllNotification() {
        return axiosInstance.get('/notification-settings');
    }
    getAllDepartment() {
        return axiosInstance.get('/department');
    }
    getAllSection() {
        return axiosInstance.get("/section");
    }
    getAllDesignation() {
        return axiosInstance.get("/designation");
    }
    getAllEmployeeList() {
        return axiosInstance.get("/employee");
    }
    saveNotificationSetting(values) {
        return axiosInstance.post('/notification-settings', values);
    }
}

export default new NotificationSettingService();