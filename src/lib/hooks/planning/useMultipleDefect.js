import {useNavigate, useParams} from "react-router-dom";
import {Form} from "antd";
import {useEffect, useState} from "react";
import moment from "moment/moment";
import {notifyResponseError, notifySuccess} from "../../common/notifications";
import ModelTreeService from "../../../service/ModelTreeService";
import DefectServices from "../../../service/DefectServices";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import MultipleDefectServices from "../../../service/MultipleDefectServices";
import {remove, update} from "ramda";

const defectTypes = [
    {id: 0, type: 'PIREP'},
    {id: 1, type: 'MAREP'},
]

export function useMultipleDefect() {
    let {dId: id} = useParams();
    const [form] = Form.useForm();
    let navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [allDefects, setAllDefects] = useState([]);
    const aircraftId = Form.useWatch("aircraftId", form);
    const defectDtoList = Form.useWatch("defectDtoList", form);
    const [parts, setParts] = useState([]);
    const dateRange = Form.useWatch("date", form);
    const [searchKey, setSearchKey] = useState(null)
    const [defectIds, setDefectIds] = useState([])


    const getDefectByAircraftId = (e) => {
        setSearchKey(e)
    }

    const onChangeDefectId = (checkedValues) => {
        setDefectIds(checkedValues);
    }

    const getAllLocation = async () => {
        try {
            const {data} = await ModelTreeService.getAllLocation();
            setLocations(data.model);
        } catch (er) {
            notifyResponseError(er)
        }
    };

    const getAllParts = async () => {
        try {
            const {data} = await DefectServices.getAllPartsByAircraftId(aircraftId);
            setParts(data);
        } catch (er) {
            notifyResponseError(er)
        }
    };

    useEffect(() => {
        (async () => {
            await getAllLocation();
        })();
    }, [])

    useEffect(() => {

        if (!aircraftId) return

        (async () => {
            await getAllParts();
        })();
    }, [aircraftId])


    const onFinish = async (values) => {


        const convertedValues = values?.defectDtoList[0]


        if (id) {
            try {
                const {data} = await MultipleDefectServices.updateMultipleDefect(id, convertedValues);
                navigate("/reliability/defect");
                notifySuccess('Defect successfully updated')
            } catch (er) {
                notifyResponseError(er)
            }
        } else {
            try {
                const {data} = await MultipleDefectServices.saveMultipleDefect(convertedValues);

                notifySuccess('Defect successfully created')

                navigate("/reliability/defect");
            } catch (er) {
                notifyResponseError(er)
            }
        }
    };


    useEffect(() => {

        getAllLocation();
    }, []);


    const handleSearchDefects = async () => {

        const [fromDate, toDate] = dateRange || '';


        const values = {
            aircraftId: searchKey,
            startDate: DateTimeConverter.momentDateToString(fromDate) || '',
            endDate: DateTimeConverter.momentDateToString(toDate) || ''
        }

        try {
            const {data} = await MultipleDefectServices.searchDefects(values);

            setAllDefects(data)
        } catch (er) {
            notifyResponseError(er)
            return Promise.reject("Message");
        }
    };

    const generateDefect = async () => {


        const defectRequestData = allDefects
            .filter(({defectId}) => defectIds.includes(defectId))
            .map(({
                      aircraftId,
                      defectId,
                      amlDate,
                      defectDesc,
                      actionDesc,
                      partId,
                      partNo,
                      locationId,
                      ata,
                      reference
                  }) =>
                ({aircraftId, defectId, amlDate, defectDesc, actionDesc, partId, partNo, locationId, ata, reference}))

        const defectRequestedAircraft = allDefects
            .filter(({defectId}) => defectIds.includes(defectId))
            .map(({aircraftId}) => ({aircraftId}))


        try {
            const {data} = await MultipleDefectServices.generateMultipleDefect(defectRequestedAircraft[0]?.aircraftId, defectRequestData);

            const generatedData = data
            const values = form.getFieldsValue(true)


            const defectDtoListData = generatedData?.map(({
                                                              ata,
                                                              aircraftId,
                                                              aircraftName,
                                                              locationId,
                                                              partId,
                                                              defectId,
                                                              defectDesc,
                                                              actionDesc,
                                                              partNo,
                                                              nomenclature,
                                                              defectType,
                                                              reference,
                                                              date
                                                          }) => ({
                ata,
                locationId,
                aircraftName,
                partId,
                defectId,
                defectDesc,
                actionDesc,
                partNo,
                nomenclature,
                defectType,
                reference,
                date: moment(date) || null,
                aircraftId: aircraftId ? aircraftId : null,
                id: values ? values.id : null
            }))


            const generatedDefectIndex = values?.defectDtoList?.map(v => v[0])
                .findIndex(v => {
                    return v.aircraftId === aircraftId;
                });

            if (generatedDefectIndex > -1) {
                const defectDtoList = update(generatedDefectIndex, defectDtoListData, values.defectDtoList)
                form.setFieldsValue({defectDtoList});
                return;
            }

            // const defectDtoList = [defectDtoListData, ...values.defectDtoList];
            const defectDtoList = [defectDtoListData];

            form.setFieldsValue({defectDtoList})
        } catch (er) {
            notifyResponseError(er)
            return Promise.reject("Message");
        }
    };


    const removeGeneratedDefect = (defectIndex, taskIndex) => {

        const defectFieldValue = form.getFieldValue("defectDtoList")
        const currentDefect = defectFieldValue[defectIndex];

        if (currentDefect.length === 1) {
            form.setFieldsValue({defectDtoList: remove(defectIndex, 1, defectFieldValue)})
            return;
        }

        const newDefect = remove(taskIndex, 1, currentDefect);
        form.setFieldsValue({defectDtoList: update(defectIndex, newDefect, defectFieldValue)})
    }

    useEffect(() => {
        const flatDefectFieldValue = form.getFieldValue("defectDtoList")?.flat()
        const filteredDefectRecord = flatDefectFieldValue?.filter(v => v?.aircraftId === aircraftId)?.map(({defectId}) => defectId)
        setDefectIds(filteredDefectRecord)

    }, [defectDtoList, aircraftId])


    const onReset = () => {
        form.resetFields()
        setAllDefects([])
    };


    return {
        onFinish,
        onReset,
        id,
        form,
        locations,
        parts,
        defectTypes,
        getDefectByAircraftId,
        handleSearchDefects,
        allDefects,
        defectIds,
        onChangeDefectId,
        removeGeneratedDefect,
        generateDefect,
    };
}
