import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Form, notification} from "antd";
import UnitofMeasurementService from "../../../service/UnitofMeasurementService";
import {getErrorMessage} from "../../../lib/common/helpers";

const UseUOM = () => {
    const {id} = useParams()
    const navigate  =useNavigate()
    const [form] = Form.useForm();
    const [uom,setUom]= useState([]);

    useEffect(() => {
        if (!id) {
            return
        }
        getAllUnitofMeasurementById().catch(console.error)
    }, [id])

    const  getAllUnitofMeasurementById = async () => {
        try {
            const {data} = await UnitofMeasurementService.getUnitofMeasurementById(id)
            form.setFieldsValue({...data})
            setUom(data)

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }

    const onFinish = async (values) => {
        console.log("submit",values)
        try {
            if (id) {
                await UnitofMeasurementService.updateUnitofMeasurement(id, values)
            } else {
                let {data} = await UnitofMeasurementService.saveUnitofMeasurement(values)
            }
            form.resetFields()
            navigate('/configurations/unit-of-measurement')
            notification["success"]({
                message: id ? "Unit Of Measurement updated successfully!" : "Unit Of Measurement added successfully!",
            });

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }

        form.resetFields();
    }

    const onReset = () => {
        if (id) {
            form.setFieldsValue({...uom})
        } else {
            form.resetFields();
        }
    }

    return {
        id,
        form,
        onFinish,
        onReset
    }

};

export default UseUOM;