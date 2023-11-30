import axiosInstance from "./Api";

const DELETE_ROOM = "/store/management/room";

class RoomService {

    saveRoom(value) {
        return axiosInstance.post('/store-management/rooms', value);
    }
    getAllRoom(isActive) {
        return axiosInstance.get(`/store-management/rooms/?active=${isActive}&size=10`);
    }

    singleRoom(id) {
        return axiosInstance.get('/store-management/rooms/' + id);
    }

    updateRoom(id, value) {
        return axiosInstance.put('/store-management/rooms/' + id, value);
    }

    toggleStatus(id, isActive) {
        return axiosInstance.patch(`/store-management/rooms/${id}?active=${isActive}`);
    }

    searchRoom(size,data){
        return axiosInstance.post(`/store-management/rooms/search/?size=${size}`, data);
    }
    getRoomByStore(id){
        return axiosInstance.get('/store-management/rooms/room-list/' + id);
    }

}

export default new RoomService();