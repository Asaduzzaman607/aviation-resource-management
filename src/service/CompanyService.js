import axiosInstance from "./Api";

class CompanyService {
    SaveCompany(value) {
        return axiosInstance.post('/companies/', value);
    }

    getAllCompanies(isActive) {
        return axiosInstance.get(`/companies/?active=${isActive}`);
    }

    singleCompany(id) {
        return axiosInstance.get('/companies/' + id);
    }

    updateCompany(id, value) {
        return axiosInstance.put('/companies/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/companies/${id}?active=${status}`);
    }

}

export default new CompanyService();
