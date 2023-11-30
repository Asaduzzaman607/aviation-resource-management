import {useNavigate, useParams} from "react-router-dom";
import {Form, notification} from "antd";
import {getErrorMessage} from "../../../lib/common/helpers";
import VendorCapabilitiesService from "../../../service/configuration/VendorCapabilitiesService";
import {useEffect,useState} from "react";



export function useVendorCapabilities(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const[vCapability,setVCapability]=useState([])
    const getVendorCapabilitiesById =async ()=>{
        try {
            const {data} = await VendorCapabilitiesService.getVendorCapabilitiesServicetById(id)
            console.log("vcapbyId",data)
            setVCapability(data)
            form.setFieldsValue(data);
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }
    useEffect(() => {
        if (!id) {
            return
        }
        getVendorCapabilitiesById().catch(console.error)

    }, [id])
    const onFinish = async (values) => {
        console.log("submit",values)
        try {
            if (id) {
                await VendorCapabilitiesService.updateVendorCapabilitiesService(id,values)
            } else {

                let {data} = await VendorCapabilitiesService.saveVendorCapabilitiesService(values)
            }
            form.resetFields()
            navigate('/configurations/vendor-capabilities-list');
            notification["success"]({
                message: id ? "Successfully updated!" : "Successfully added!",
            });

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    };

    const onReset = () => {

        id?form.setFieldsValue({ ...vCapability }):form.resetFields();
    };
    return{
        id,
        form,
        onFinish,
        onReset
    }
}