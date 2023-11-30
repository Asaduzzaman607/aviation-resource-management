import {useNavigate, useParams} from "react-router-dom";
import {Form, notification} from "antd";
import {useCallback, useEffect, useState} from "react";
import moment from "moment/moment";
import {notifyResponseError, notifySuccess} from "../../common/notifications";
import ModelTreeService from "../../../service/ModelTreeService";
import AircraftService from "../../../service/AircraftService";
import DefectServices from "../../../service/DefectServices";
import SerialNoServices from "../../../service/SerialNoServices";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import TaskDoneServices from "../../../service/TaskDoneServices";
import LocationsService from "../../../service/planning/configurations/LocationsService";
import {getErrorMessage} from "../../common/helpers";
import {useBoolean} from "react-use";

const defectTypes = [
    {id: 0, type: 'PIREP'},
    {id: 1, type: 'MAREP'},
]

export function useDefectRecord(locationForm) {
    let {dId: id} = useParams();
    const [form] = Form.useForm();
    let navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [aircrafts, setAircrafts] = useState([]);
    const [allDefects, setAllDefects] = useState([]);
    const [defects, setDefects] = useState([]);
    const partId = Form.useWatch('partId', form);
    const [parts, setParts] = useState([]);
    const [searchPartId, setSearchPartId] = useState(null);
    const dateRange = Form.useWatch("date", form);
    const [searchKey, setSearchKey] = useState(null)
    const [taskIds, setTaskIds] = useState([])
    const [showLocationModal, setShowLocationModal] = useBoolean(false);

    const getTaskByAircraftId = (e) => {
        setSearchKey(e)
    }
    const onChangeTaskId = (checkedValues) => {
        setTaskIds(checkedValues);
    };


    const getAllAircraft = async () => {
        try {
            const {data} = await AircraftService.getAllAircraftList();
            setAircrafts(data);
        } catch (er) {
            notifyResponseError(er);
        }
    };

    useEffect(() => {
        getAllAircraft();
    }, []);


    const getAllLocation = async () => {
        try {
            const {data} = await ModelTreeService.getAllLocation();
            setLocations(data.model);
        } catch (er) {
            notifyResponseError(er)
        }
    };

    const onSearchParts = async (value) => {
        try {
            const {data} = await SerialNoServices.searchParts(value);
            setParts(data)
        } catch (er) {
            notifyResponseError(er)
        }
    }

    useEffect(() => {
        if (!partId) {
            return;
        }
        (async () => {
            const getPartId = parts?.find(v => v.partNo === partId)
            setSearchPartId(getPartId)
        })();
    }, [partId]);


    const loadSingleData = useCallback(async () => {
        if (id === undefined) return;
        try {
            const {data} = await DefectServices.getDefectById(id);

            setDefects({...data});

            form.setFieldsValue({
                ...data,
                aircraftId: data.aircraftId,
                date: data.date
                    ? moment(data.date)
                    : null,
                locationId: data.locationId,
                partId: data.partNumber,
            });
        } catch (er) {
            notifyResponseError(er)
        }
    }, [id]);

    const onFinish = async (values) => {

        const getPartId = parts?.find(v => v.partNo === values.partId)


        const convertedValues = {
            ...values,
            date: values.date && values["date"].format("YYYY-MM-DD"),
            partId: getPartId === undefined ? defects.partId : getPartId.partId,
        };

        if (id) {
            try {
                const {data} = await DefectServices.updateDefect(id, convertedValues);
                navigate("/reliability/defect");
                notifySuccess('Defect successfully updated')
            } catch (er) {
                notifyResponseError(er)
            }
        } else {
            try {
                const {data} = await DefectServices.saveDefect(convertedValues);

                notifySuccess('Defect successfully created')

                navigate("/reliability/defect");
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


    const handleSearchTasks = async () => {

        const [fromDate, toDate] = dateRange || '';

        const searchArray = []
        searchArray.push(searchKey)


        const values = {
            aircraftIds: searchArray,
            fromDate: DateTimeConverter.momentDateToString(fromDate) || '',
            toDate: DateTimeConverter.momentDateToString(toDate) || ''
        }

        try {
            const {data} = await TaskDoneServices.searchTaskDoneByAirCrafts(values);

            setAllDefects(data)
        } catch (er) {
            notifyResponseError(er)
            return Promise.reject("Message");
        }
    };


    //add location

    const handleLocationSubmit = async (values) => {
        try {
            const { data } = await LocationsService.saveLocation(values);
            locationForm.resetFields();
            notification["success"]({
                message: "Location successfully created",
            });

            const id = data.id;

            const newLocation = {
                name: values.name,
                id,
            };

            setLocations((prevState) => [newLocation, ...prevState]);
            form.setFieldsValue({ locationId: id });
            setShowLocationModal(false);
        } catch (er) {
            notification["error"]({ message: getErrorMessage(er) });
        }
    };


    return {
        onFinish,
        onReset,
        aircrafts,
        id,
        form,
        locations,
        parts,
        onSearchParts,
        defectTypes,
        getTaskByAircraftId,
        handleSearchTasks,
        allDefects,
        taskIds,
        onChangeTaskId,
        showLocationModal,
        setShowLocationModal,
        handleLocationSubmit
    };
}
