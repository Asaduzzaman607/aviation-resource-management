import axiosInstance from "./Api";

class AlternatePartService{
    pertSearch(page,size,values){
        console.log("p",page)
        console.log("s",size)
        console.log("gg",values)
        return axiosInstance.post(`/part/search?page=${page}&size=${size}`,values);
    }

}
export default new AlternatePartService()