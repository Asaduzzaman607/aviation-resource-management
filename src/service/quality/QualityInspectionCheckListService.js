import API from "../Api";

class QualityInspectionCheckListService {

    getInspectionChecklistById(id) {
        return API.get(`/store-inspector/quality/inspection-checklists/${id}`);
    }

    updateInspectionChecklist(id, value) {
        return API.put(`/store-inspector/quality/inspection-checklists/${id}`,value);
    }
}

export default new QualityInspectionCheckListService();