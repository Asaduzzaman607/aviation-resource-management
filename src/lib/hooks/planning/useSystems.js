import {useNavigate, useParams} from "react-router-dom";
import {Form, notification} from "antd";
import {useEffect, useState} from "react";
import {useBoolean} from "react-use";
import ModelTreeService from "../../../service/ModelTreeService";
import {notifyResponseError, notifySuccess} from "../../common/notifications";
import SystemServices from "../../../service/SystemServices";
import LocationsService from "../../../service/planning/configurations/LocationsService";
import {getErrorMessage} from "../../common/helpers";

export function useSystems(locationForm) {
    let {sId: id} = useParams();
    const [form] = Form.useForm();
    let navigate = useNavigate();
    const [location, setLocation] = useState([]);
    const [showLocationModal, setShowLocationModal] = useBoolean(false);


    const getAllLocation = async () => {
        try {
            const {data} = await ModelTreeService.getAllLocation();
            setLocation(data.model);
        } catch (er) {
            notifyResponseError(er)
        }
    };

    const loadSingleData = async () => {
        try {
            const {data} = await SystemServices.singleSystem(id);

            form.setFieldsValue({
                ...data,
                locationId: data.locationId,
            });
        } catch (er) {
            notifyResponseError(er)
        }
    };

    const onFinish = async (values) => {

        if (id) {
            try {
                const {data} = await SystemServices.updateSystem(id, values);
                navigate("/reliability/systems");
                notifySuccess('System successfully updated')
            } catch (er) {
                notifyResponseError(er)
            }
        } else {
            try {
                const {data} = await SystemServices.saveSystem(values);

                notifySuccess('System successfully created')

                navigate("/reliability/systems");
            } catch (er) {
                notifyResponseError(er)
            }
        }
    };

    const onReset = async () => {
        if (!id) {
            form.resetFields();
        }
        await loadSingleData();
    };

    useEffect(() => {

        if (!id) return
        loadSingleData(id);
    }, [id]);

    useEffect(() => {

        getAllLocation();
    }, []);


    //add location

    const handleLocationSubmit = async (values) => {
        try {
            const {data} = await LocationsService.saveLocation(values);
            locationForm.resetFields();
            notification["success"]({
                message: "Location successfully created",
            });

            const id = data.id;

            const newLocation = {
                name: values.name,
                id,
            };

            setLocation((prevState) => [newLocation, ...prevState]);
            form.setFieldsValue({locationId: id});
            setShowLocationModal(false);
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    };


    return {
        onFinish,
        onReset,
        id,
        form,
        location,
        showLocationModal,
        setShowLocationModal,
        handleLocationSubmit,
    };
}