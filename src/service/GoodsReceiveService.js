import axiosInstance from "./Api"

class GoodsReceiveService {

    saveGoodsReceive(values){
        return axiosInstance.post('/store/receive-goods', values)
    }
    updateGoodsReceive(id,value){
        return axiosInstance.put('/store/receive-goods/'+id,value)
    }
    getGoodsReceiveById(id){
        return axiosInstance.get('/store/receive-goods/'+id)
    }
    toggleStatus(id,status) {
        return axiosInstance.patch(`/store/receive-goods/${id}?active=${status}`)
    }

}
export default new GoodsReceiveService()