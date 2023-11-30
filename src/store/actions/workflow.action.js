
import {notification} from "antd";
import workflowActionService from "../../service/WorkflowActionService";
import {getWorkflow} from "../../reducers/workflowReducers";

export const getWorkflowList = (isActive) => async (dispatch) => {

    workflowActionService.getAllWorkflows(isActive)
        .then((response) => {
            dispatch(getWorkflow(response.data));
        })
        .catch((error) => {
            notification["error"]({
                message: error.message,
            });
            console.log("something went wrong", error);
        });
};