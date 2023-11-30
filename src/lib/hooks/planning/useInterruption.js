import {useNavigate, useParams} from "react-router-dom";
import {Form, notification} from "antd";
import {useEffect, useState} from "react";
import {useBoolean} from "react-use";
import ModelTreeService from "../../../service/ModelTreeService";
import {getErrorMessage, separateCharactersAndNumbers} from "../../common/helpers";
import LocationsService from "../../../service/planning/configurations/LocationsService";
import {notifyResponseError, notifySuccess, notifyWarning} from "../../common/notifications";
import AircraftService from "../../../service/AircraftService";
import InterruptionServices from "../../../service/InterruptionServices";
import moment from "moment";
import API from "../../../service/Api";
import DateTimeConverter from "../../../converters/DateTimeConverter";


export function useInterruption(locationForm) {
    let {intId: id} = useParams();
    const [form] = Form.useForm();
    let navigate = useNavigate();
    const aircraftId = Form.useWatch('aircraftId', form)
    const selectedPageNo = Form.useWatch('amlPageNo', form)
    const seqNoValue = Form.useWatch('seqNo', form)
    const [location, setLocation] = useState([]);
    const [showLocationModal, setShowLocationModal] = useBoolean(false);
    const [aircrafts, setAircrafts] = useState([]);
    const [allPageNo, setAllPageNo] = useState([]);
    const [pageNoAlphabets, setPageAlphabets] = useState([]);


    const getAllAircraft = async () => {
        try {
            const {data} = await AircraftService.getAllAircraftList();
            setAircrafts(data);
        } catch (er) {
            notifyResponseError(er);
        }
    };

    const getAllPageNoByAircraft = async () => {
        if (!aircraftId) return
        try {
            const {data} = await InterruptionServices.getAllPageNoByAircraft(aircraftId);
            const concatenatedList = data.map(({pageNo, alphabet}) => ({
                pageNo,
                alphabet,
                amlPageNo: pageNo + alphabet,
            }));
            setAllPageNo(data);
            setPageAlphabets(concatenatedList);

        } catch (er) {
            notifyResponseError(er);
        }
    };

    useEffect(() => {
        getAllAircraft();
    }, []);

    useEffect(() => {
        getAllPageNoByAircraft();
    }, [aircraftId]);


    const getInterruptionByAmlId = async () => {

        const filteredData = allPageNo.filter(item => {
            const concatenatedValue = `${item.pageNo}${item.alphabet}`;
            return  concatenatedValue === selectedPageNo ||  (item.pageNo === selectedPageNo && item.alphabet === null);
        });

        const selectedAmlId = filteredData[0]?.amlId
        const selectedAmlDate = filteredData[0]?.date

        if (!id) {
            form.setFieldsValue({
                date: selectedAmlDate ? moment(selectedAmlDate) : null
            })
        }

        if (!selectedAmlId) return
        const {data} = await API.get(`/aircraft-maintenance-log/interruptionInfo/${selectedAmlId}`)

        const selectedSeq = data?.filter(({seqNo}) => seqNo === seqNoValue)[0]?.seqNo
        const selectedDefectRect = data?.filter(({seqNo}) => seqNo === seqNoValue)[0]
        if (selectedSeq === 'A') {
            form.setFieldsValue({
                defectDescription: selectedDefectRect.defectDescription ? selectedDefectRect.defectDescription : null,
                rectDescription: selectedDefectRect.rectDescription ? selectedDefectRect.rectDescription : null

            })
        } else if (selectedSeq === 'B') {
            form.setFieldsValue({
                defectDescription: selectedDefectRect.defectDescription ? selectedDefectRect.defectDescription : null,
                rectDescription: selectedDefectRect.rectDescription ? selectedDefectRect.rectDescription : null

            })
        } else {
            form.setFieldsValue({
                defectDescription: null,
                rectDescription: null

            })
        }
    }

    useEffect(() => {
        getInterruptionByAmlId();
    }, [selectedPageNo, seqNoValue]);


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
            const {data} = await InterruptionServices.getInterruptionById(id);

            form.setFieldsValue({
                ...data,
                aircraftId: data.aircraftId,
                amlPageNo: data.amlPageNo,
                seqNo: data.seqNo,
                date: data.date
                    ? moment(data.date)
                    : null,
                locationId: data.locationId,
                duration: data?.duration
                    ?.toFixed(2)
                    .toString()
                    .replace(".", ":"),
            });
        } catch (er) {
            notifyResponseError(er)
        }
    };

    const onFinish = async (values) => {

        const specialRegex = `^[0-9.:]+$|^$`;
        if (values.duration && !values.duration.match(specialRegex)) {
            notifyWarning("Invalid duration! Only number is allowed");
            return;
        }
        const du = values?.duration;
        const dur = du?.toString().replace(":", ".");
        const convertedValues = {
            ...values,
            date: DateTimeConverter.momentDateToString(values.date) || null,
            duration: dur ? dur : null,
        };

        if (id) {
            try {
                const {data} = await InterruptionServices.updateInterruption(id, convertedValues);
                navigate("/reliability/interruption");
                notifySuccess('Interruption successfully updated')
            } catch (er) {
                notifyResponseError(er)
            }
        } else {
            try {
                const {data} = await InterruptionServices.saveInterruption(convertedValues);

                notifySuccess('Interruption successfully created')

                navigate("/reliability/interruption");
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
        aircrafts,
        allPageNo,
        pageNoAlphabets
    };
}
