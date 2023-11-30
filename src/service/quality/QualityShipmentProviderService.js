import API from "../Api";

class QualityShipmentProviderService {
    updateShipmentProvider(id, data) {
        return API.put(`/material-management/config/quality/shipment_provider/${id}`, data);
    }

    singleShipmentProvider(id) {
        return API.get(`/material-management/config/quality/shipment_provider/${id}`);
    }
}

export default new QualityShipmentProviderService();