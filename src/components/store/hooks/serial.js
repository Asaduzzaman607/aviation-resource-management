import {useNavigate, useParams} from "react-router-dom";
import {Form, notification} from "antd";
import {useEffect, useState} from "react";
import SerialService from "../../../service/store/SerialService";
import {getErrorMessage} from "../../../lib/common/helpers";
import moment from "moment";

export function useSerial() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [partAvailability, setPartAvailability] = useState([]);
    const [serial, setSerial] = useState([]);
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const getPartAvailability = async () => {
        try {
            let {data} = await SerialService.getPartAvailability(50, {
                query: "",
                isActive: true
            })
            console.log("pA", data.model)
            setPartAvailability(data.model);
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }

    const getSerialById = async () => {
        try {
            let {data} = await SerialService.getSerialById(id)
            console.log("serial by Id", data)

            const modData = {
                ...data,
                rackLife: moment(data.rackLife),
                selfLife: moment(data.selfLife)
            }
            form.setFieldsValue({...modData})
            setSerial(modData)
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }
    useEffect(() => {
        getPartAvailability().catch(console.error)
    }, [])
    useEffect(() => {
        if (id)
            getSerialById().catch(console.error)
    }, [id])
    const onFinish = async (values) => {
        const modifiedData = {
            ...values,
            rackLife: values['rackLife']?.format('YYYY-MM-DD'),
            selfLife: values['selfLife']?.format('YYYY-MM-DD'),
        }
        console.log("submitdata", modifiedData)
        try {
            if (id) {
                await SerialService.updateSerial(id, modifiedData)
            } else {
                await SerialService.saveSerial(modifiedData)

            }
            form.resetFields()
            notification["success"]({
                message: id ? "Successfully updated!" : "Successfully added!",
            });
            navigate('/store/store-serial-list')
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }

    const onReset = () => {
        id ? form.setFieldsValue({...serial}) : form.resetFields();
    }
    return {
        id,
        form,
        layout,
        partAvailability,
        onReset,
        onFinish,
    }
}