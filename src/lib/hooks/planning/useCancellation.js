import {useNavigate, useParams} from "react-router-dom";
import {Form} from "antd";
import {useEffect, useState} from "react";
import {notifyResponseError, notifySuccess} from "../../common/notifications";
import moment from "moment";
import {useAircraftModelList} from "./useModels";
import CancellationServices from "../../../service/CancellationServices";

export function useCancellation() {
    let {cId: id} = useParams();
    const [form] = Form.useForm();
    let navigate = useNavigate();
    const [aircraftModelFamilies, setAircraftModelFamilies] = useState([]);
    const {aircraft, setAircraft} = useAircraftModelList();


    const loadSingleData = async () => {
        try {
            const {data} = await CancellationServices.getCancellationById(id);

            form.setFieldsValue({
                ...data,
                aircraftModelId: data.aircraftModelId,
                date: data.date
                    ? moment(data.date)
                    : null,
            });
        } catch (er) {
            notifyResponseError(er)
        }
    };

    const onFinish = async (values) => {

        const convertedValues = {
            ...values,
            date: values.date && values["date"].format("YYYY-MM-DD"),
        }

        if (id) {
            try {
                const {data} = await CancellationServices.updateCancellation(id, convertedValues);
                navigate("/reliability/cancellation");
                notifySuccess('Cancellation successfully updated')
            } catch (er) {
                notifyResponseError(er)
            }
        } else {
            try {
                const {data} = await CancellationServices.saveCancellation(convertedValues);

                notifySuccess('Cancellation successfully created')

                navigate("/reliability/cancellation");
            } catch (er) {
                notifyResponseError(er)
            }
        }
    };


    useEffect(() => {

        if (!id) return
        loadSingleData(id);
    }, [id]);

    const onReset = async () => {
        if (!id) form.resetFields();
        await loadSingleData();
    };



    return {
        onFinish,
        onReset,
        id,
        form,
        aircraft,
        setAircraftModelFamilies,
        aircraftModelFamilies
    };
}
