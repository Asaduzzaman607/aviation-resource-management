
import {notification} from "antd";
import RoomService from "../../service/RoomService";
import {getRooms} from "../../reducers/room.reducers";

export const getRoomList = (size, values) => async (dispatch) => {

    RoomService.searchRoom(size,values)
        .then((response) => {
            dispatch(getRooms(response.data));
        })
        .catch((error) => {
            notification["error"]({
                message: error.message,
            });
            console.log("something went wrong", error);
        });
};