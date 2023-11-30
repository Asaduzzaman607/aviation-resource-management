import axiosInstance from "./Api"

class StockInwardService {
    saveStockInward(values){
        return axiosInstance.post('/store/stock-inwards', values)
    }
    updateStockInward(id,value){
        return axiosInstance.put('/store/stock-inwards/'+id,value)
    }
    getStockInwardById(id){
        return axiosInstance.get('/store/stock-inwards/'+id)
    }
    toggleStatus(id,status) {
        return axiosInstance.patch(`/store/stock-inwards/${id}?active=${status}`)
    }
    getPoByStockInwardId(id){
        return axiosInstance.get(`/store/stock-inwards/${id}`)
    }
}

export default new StockInwardService()