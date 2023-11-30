import axiosInstance from "./Api";

class WorkflowActionService {
    SaveWorkflow(value) {
        return axiosInstance.post('/workflow-actions', value);
    }

    getAllWorkflows(isActive,subModuleItemId = null) {
        return axiosInstance.post(`/workflow-actions/search/?size=${100}&sort=orderNumber,asc`,{
            isActive: isActive,
            subModuleItemId: subModuleItemId
        });
    }

    singleWorkflow(id) {
        return axiosInstance.get('/workflow-actions/' + id);
    }

    updateWorkflow(id, value) {
        return axiosInstance.put('/workflow-actions/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/workflow-actions/${id}?active=${status}`);
    }
    workflowSearch(size, data) {
        return axiosInstance.post(`/workflow-actions/search/?size=${size}`, data);
    }

}

export default new WorkflowActionService();