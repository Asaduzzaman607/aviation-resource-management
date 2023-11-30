
import {notification} from "antd";
import RackRowService from "../../service/RackRowService";
import {getRackRow} from "../../reducers/rackRow.reducers";

export const getRackRowList = (isActive) => async (dispatch) => {

    RackRowService.getAllRackRow(isActive)
        .then((response) => {
            dispatch(getRackRow(response.data));
        })
        .catch((error) => {
            notification["error"]({
                message: error.message,
            });
            console.log("something went wrong", error);
        });
};