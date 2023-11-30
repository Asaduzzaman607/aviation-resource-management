import {useNavigate, useParams} from "react-router-dom";
import {Form, notification} from "antd";
import {useEffect, useState} from "react";
import moment from "moment";
import {getErrorMessage} from "../../../lib/common/helpers";
import UnserviceableItemService from "../../../service/store/UnserviceableItemService";
import WorkOrderService from "../../../service/store/WorkOrderService";

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};


export function useWorkOrder() {
    const {id} = useParams()
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [unSPartId, setUnSPartId] = useState([])
    const [unSPartIdSingle, setUnSPartIdSingle] = useState([])

const[workOrder,setWorkOrder]=useState([])

    const getAllUnserviceAbleItem = async () => {
        try {
            let {data} = await UnserviceableItemService.getUnserviceableItem(true)
            console.log("USItem", data.model)
            setUnSPartId(data.model)
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }
const getWorkOrderById=async ()=>{
        let {data} =await WorkOrderService.getWorkOrderById(id);
    console.log("workOrderById",data)
    handleChange(data.unserviceablePartId)
    form.setFieldsValue({...data})
setWorkOrder(data)
}
    useEffect(() => {

        getAllUnserviceAbleItem().catch(console.error)
    }, [])
    useEffect(() => {
        if (!id) {
            return
        }

getWorkOrderById().catch(console.error)
    }, [id])
    const onFinish = async (values) => {


        console.log("submit", values)


        try {
            if (id) {
                await WorkOrderService.updateWorkOrder(id, values)
            } else {

                let {data} = await WorkOrderService.saveWorkOrder(values)
            }
            form.resetFields()
            notification["success"]({
                message: id ? "Successfully updated!" : "Successfully added!",
            });
            navigate('/store/pending-work-order');

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }
    const onReset = () => {
        if (id) {
            form.setFieldsValue({...workOrder})

        } else {
            form.resetFields();
        }
    }
    const handleChange = async (value) => {
        if (value === " " || value === undefined) {

        } else {
            try {
                let {data} = await UnserviceableItemService.getUnserviceableItemById(value)

                setUnSPartIdSingle(data)
            } catch (er) {
                notification["error"]({message: getErrorMessage(er)});
            }
        }
    }
    return {
        layout,
        unSPartId,
        form,
        id,
        onReset,
        onFinish,
        handleChange,
        unSPartIdSingle
    }
}