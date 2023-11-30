import ErpService from "../../service/ErpService";
import {notification} from "antd";
import {getErrorMessage} from "../../lib/common/helpers";

export function useErpData(){
    const syncErpData = async()=> {
        try{
            const data = await ErpService.getErpData("erp/sync/?all=true")
            if(data.status === 200) {
                notification["success"]({
                    message: "Synced Successfully"
                });
                setTimeout(() => {
                    window.location.reload()
                },1000)
            }
            console.log("Erp data = ", data)
        }
        catch(error){
            notification["error"]({ message: getErrorMessage(error) });
            console.log("ERP error...",error)
        }
    }
    return {
        syncErpData
    }
}