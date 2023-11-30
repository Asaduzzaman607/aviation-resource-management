import {useCallback, useEffect, useState} from "react";
import {useAirports} from "./airports";
import {useNavigate, useParams} from "react-router-dom";
import {Form} from "antd";
import AMLService from "../../../service/planning/AMLService";
import AMLConverter from "../../../converters/planning/AMLConverter";
import amlFlightDataService from "../../../components/planning/aml/amlFlightDataService";
import FlightDataConverter from "../../../converters/planning/FlightDataConverter";
import {notifyError, notifyResponseError, notifySuccess, notifyWarning} from "../../common/notifications";
import {useParamsId} from "../common";
import {
    AML_TYPES,
    amlFormInitialValues,
    DEFECTS_DEFAULT_FORMS,
    DEFECTS_FORM_DATA,
    FLIGHT_DATA_OBJ,
    OIL_RECORD_FORM,
    SELECTED_BOXES
} from "../../../components/planning/aml/MaintenaceLog/aml.constants";
import OilRecordConverter from "../../../converters/planning/OilRecordConverter";
import DefectsRectificationsConverter from "../../../converters/planning/DefectsRectificationsConverter";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import {
    formatOilRecordsFormValue,
    revertOilDataSelectedBoxes
} from "../../../components/planning/aml/MaintenaceLog/amlService";
import useEmployees from "../users/useEmployees";
import useAmlOptions from "./useAmlOptions";
import moment from "moment";
import {isArray} from "lodash";
import AircraftService from "../../../service/AircraftService";

export const SAVE_AND_GO_TO_LIST = 1
export const SAVE_AND_NEW_FORM = 2

export const isVoidOrNil = (amlType) => {
    return amlType === AML_TYPES.VOID || amlType === AML_TYPES.NIL
}

export const isRegular = (amlType) => {
    return amlType === AML_TYPES.REGULAR
}
export const isMaint = (amlType) => {
    return amlType === AML_TYPES.MAINT
}


export function useAMLAdd() {
    const id = useParamsId('amlId');
    const isEditForm = () => id;
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    // const {aircrafts, setAircrafts} = useAllAircraftList();
    const {airports} = useAirports();
    const {initEmployees, employees} = useEmployees();
    const {initAmls, amls} = useAmlOptions()
    const navigate = useNavigate();
    const [selectedBox, setSelectedBox] = useState(SELECTED_BOXES);
    const [submitType, setSubmitType] = useState(SAVE_AND_GO_TO_LIST);
    const [defectsAdded, setDefectsAdded] = useState(false);
    const [isOilRecordAdded, setIsOilRecordAdded] = useState(false);
    const [regularOrMaint, setRegularOrMaint] = useState(false)
    const [data, setData] = useState({})
    const [disabled0, setDisabled0] = useState(false)
    const [disabled1, setDisabled1] = useState(false)
    const [hasNotFlightDataDate, setHasNotFlightDataDate] = useState(false)
    const [totalAirTimeAlphabet, setTotalAirTimeAlphabet] = useState()
    const [totalLandingAlphabet, setTotalLandingAlphabet] = useState()
    const [alTypeForEdit, setAtlTypeForEdit] = useState()
    const [flightData, setFlightData] = useState([])
    const amlType = Form.useWatch('amlType', form);
    const [aircrafts, setAircrafts] = useState([]);

    const getAllAircrafts = useCallback(async () => {
        const res = await AircraftService.getAllAircraftList();
        setAircrafts(
            res.data.map(({aircraftId, aircraftName}) => ({
                aircraftId,
                aircraftName,
            }))
        );
    }, []);

    useEffect(() => {
        if (id) return
        (async () => {
            await getAllAircrafts();
        })();
    }, [id]);


    useEffect(() => {
        (async () => {
            await initEmployees();
        })();
    }, [])

    useEffect(() => {

        if (id) return
        (async () => {
            await initAmls();
        })();
    }, [])

    const saveOrUpdate = async (values) => {
        const data = AMLConverter.toRequestObj(values);
        return isEditForm() ?
            await AMLService.update(id, data) :
            await AMLService.save(data);
    }

    const showDefectRectification = Form.useWatch('showDefectAndRectificationForm', form);

    useEffect(() => {
        form.setFieldsValue({[DEFECTS_FORM_DATA]: DEFECTS_DEFAULT_FORMS})
    }, [showDefectRectification])

    const aircraftId = form.getFieldValue('aircraftId');

    const [totalAirTimeData, setTotalAirTime] = useState(null)
    const [totalLandingData, setTotalLanding] = useState(null)

    useEffect(() => {
        if (!aircraftId) {
            return
        }
        (async () => {
            const {data} = await AMLService.getAMLPrevPage(aircraftId)
            setTotalAirTime(data.totalAirTime.toFixed(2))
            setTotalLanding(data.totalLanding)
        })()
    }, [aircraftId])

    const onFinish = async () => {
        const values = form.getFieldsValue(true);


        const {amlType} = values;
        const flightData = FlightDataConverter.toRequestObj(values[FLIGHT_DATA_OBJ]);
        const oilRecordData = OilRecordConverter.toRequestObj(values[OIL_RECORD_FORM], selectedBox);
        const defectsData = values.hasOwnProperty(DEFECTS_FORM_DATA) ?
            DefectsRectificationsConverter.toRequestObj(values[DEFECTS_FORM_DATA]) : null;

        if (isArray(defectsData)) {
            defectsData[0].woNo = defectsData[0].workOrder1 === 2 ? null : defectsData[0].woNo;
            defectsData[1].woNo = defectsData[1].workOrder1 === 2 ? null : defectsData[1].woNo;
        }

        const defectSignDate1_1 = DateTimeConverter.momentDateToString(values.defectDate1)
        const defectSignTime1_1 = DateTimeConverter.momentDateTimeToString(values.defectTime1)?.slice(11)
        const defectSignDate1_2 = DateTimeConverter.momentDateToString(values.defectDate2)
        const defectSignTime1_2 = DateTimeConverter.momentDateTimeToString(values.defectTime2)?.slice(11)
        const defectSignDate2_1 = DateTimeConverter.momentDateToString(values.rectDate1)
        const defectSignTime2_1 = DateTimeConverter.momentDateTimeToString(values.rectTime1)?.slice(11)
        const defectSignDate2_2 = DateTimeConverter.momentDateToString(values.rectDate2)
        const defectSignTime2_2 = DateTimeConverter.momentDateTimeToString(values.rectTime2)?.slice(11)

        const blockOnDate = values?.blockOnDate ? DateTimeConverter.momentDateToString(values?.blockOnDate) : ''
        const blockOnTime = values?.blockOnTime ? DateTimeConverter.momentDateTimeToString(values?.blockOnTime)?.slice(11) : ''
        const blockOffDate = DateTimeConverter.momentDateToString(values?.blockOffDate)
        const blockOffTime = DateTimeConverter.momentDateTimeToString(values?.blockOffTime)?.slice(11)
        const landingDate = DateTimeConverter.momentDateToString(values.landingDate)
        const landingTime = DateTimeConverter.momentDateTimeToString(values.landingTime)?.slice(11)
        const takeOffDate = DateTimeConverter.momentDateToString(values.takeOffDate)
        const takeOffTime = DateTimeConverter.momentDateTimeToString(values.takeOffTime)?.slice(11)
        const commencedDate = DateTimeConverter.momentDateToString(values.commencedDate)
        const commencedTime = DateTimeConverter.momentDateTimeToString(values.commencedTime)?.slice(11)
        const completedDate = DateTimeConverter.momentDateToString(values.completedDate)
        const completedTime = DateTimeConverter.momentDateTimeToString(values.completedTime)?.slice(11)

        defectsData[0].defectSignTime = defectSignDate1_1 + ' ' + defectSignTime1_1
        defectsData[0].rectSignTime = defectSignDate1_2 + ' ' + defectSignTime1_2
        defectsData[1].defectSignTime = defectSignDate2_1 + ' ' + defectSignTime2_1
        defectsData[1].rectSignTime = defectSignDate2_2 + ' ' + defectSignTime2_2

        if (amlType === 0 || amlType === 3) {
            flightData.blockOnTime = blockOnDate + ' ' + blockOnTime
            flightData.blockOffTime = blockOffDate + ' ' + blockOffTime
            flightData.landingTime = landingDate + ' ' + landingTime
            flightData.takeOffTime = takeOffDate + ' ' + takeOffTime
            flightData.commencedTime = commencedDate + ' ' + commencedTime
            flightData.completedTime = completedDate + ' ' + completedTime
        }

        if (!id && amlType === 0 && (values.blockOffDate !== null && !values.blockOffTime)) {
            notifyError("Please input block off time")
            return
        }
        if (!id && amlType === 0 && (values.blockOnDate !== null && !values.blockOnTime)) {
            notifyError("Please input block on time")
            return
        }
        if (!id && amlType === 0  && (values.takeOffDate !== null && !values.takeOffTime)) {
            notifyError("Please input take off time")
            return
        }
        if (!id && amlType === 0 && (values.landingDate !== null && !values.landingTime)) {
            notifyError("Please input landing time")
            return
        }
        if (values.commencedDate !== undefined && values.commencedDate !== null && !values.commencedTime) {
            notifyError("Please input commenced time")
            return
        }
        if (values.completedDate !== undefined && values.completedDate !== null && !values.completedTime) {
            notifyError("Please input completed time")
            return
        }
        if (values.defectDate1 && !values.defectTime1) {
            notifyWarning("please input defect signature time")
            return;
        }
        if (!values.defectDate1 && values.defectTime1) {
            notifyWarning("please input defect signature date")
            return;
        }
        if (values.defectDate2 && !values.defectTime2) {
            notifyWarning("please input rectification signature time")
            return;
        }
        if (!values.defectDate2 && values.defectTime2) {
            notifyWarning("please input rectification signature date")
            return;
        }
        if (values.rectDate1 && !values.rectTime1) {
            notifyWarning("please input defect signature time")
            return;
        }
        if (!values.rectDate1 && values.rectTime1) {
            notifyWarning("please input defect signature date")
            return;
        }
        if (values.rectDate2 && !values.rectTime2) {
            notifyWarning("please input rectification signature time")
            return;
        }
        if (!values.rectDate2 && values.rectTime2) {
            notifyWarning("please input rectification signature date")
            return;
        }
        if (values.pfiDate && !values.pfiTime) {
            notifyWarning("Please input certification of pre-flight inspection time")
            return;
        }
        if (!values.pfiDate && values.pfiTime) {
            notifyWarning("Please input certification of pre-flight inspection date")
            return;
        }
        if (values.ocaDate && !values.ocaTime) {
            notifyWarning("Please input certification of acceptance for the FLT time")
            return;
        }
        if (!values.ocaDate && values.ocaTime) {
            notifyWarning("Please input certification of acceptance for the FLT date")
            return;
        }

        const tAir = values.amlFlightData?.totalAirTime;
        const convertHour = tAir?.toString().replace(":", ".");

        const data = {
            ...values,
            flightNo: amlType === 3 ? values.flightNo : 'BS-' + values.flightNo,
            fromAirportId: values.fromAirportId === undefined ? null : values.fromAirportId,
            toAirportId: values.toAirportId === undefined ? null : values.toAirportId,
            saveOilRecord: isVoidOrNil(amlType) ? false : values.saveOilRecord,
            needToSaveDefectRectification: isVoidOrNil(amlType) ? false : values.needToSaveDefectRectification,
            [FLIGHT_DATA_OBJ]: flightData === null || amlType === 1 || amlType === 2 ?
                {
                    amlId: values.aircraftMaintenanceLogId || null,
                    id: flightData ? flightData.id : null,
                    totalAirTime: isVoidOrNil(amlType) && !isEditForm() ? totalAirTimeData : convertHour,
                    totalLanding: isVoidOrNil(amlType) && !isEditForm() ? totalLandingData : values.amlFlightData.totalLanding,
                    blockOnTime: null,
                    blockOffTime: null,
                    takeOffTime: null,
                    landingTime: null,
                    airTime: null,
                    commencedTime: null,
                    completedTime: null,
                    totalApuHours: null,
                    totalApuCycle: null,
                } :
                {
                    ...flightData,
                    totalApuHours: isMaint(amlType) ? values.amlFlightData.totalApuHours : null,
                    totalApuCycles: isMaint(amlType) ? values.amlFlightData.totalApuCycles : null,
                }
            ,
            [DEFECTS_FORM_DATA]:
            defectsData,
            [OIL_RECORD_FORM]:
            oilRecordData
        }

        const specialRegex = `^[0-9.:]+$|^$`;
        if (data?.amlFlightData?.totalAirTime && !values.amlFlightData?.totalAirTime?.toString().match(specialRegex)) {
            notifyWarning("Invalid Total Air time! Only number is allowed");
            return;
        }


        try {
            setSubmitting(true);
            const {data: {message}} = await saveOrUpdate(data);
            notifySuccess(message)

            if (submitType === SAVE_AND_GO_TO_LIST) {
                navigate('/planning/atl')
            } else {
                // await form.setFieldsValue({...amlFormInitialValues})
                form.resetFields()
                setSelectedBox(SELECTED_BOXES);
                navigate('/planning/atl/add')
            }
        } catch (e) {
            notifyResponseError(e)
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        if (id && (data[0]?.melType === 1 || data[0]?.melType === 2)) {
            setDisabled0(true)
        }
    }, [id, data])

    useEffect(() => {
        if (id && (data[1]?.melType === 1 || data[1]?.melType === 2)) {
            setDisabled1(true)
        }
    }, [id, data])

    useEffect(()=>{
        if (amlType === 0 ) {
            form.setFieldsValue({
                amlFlightData: {
                    noOfLanding: flightData.noOfLanding?flightData.noOfLanding : 1,
                }})
        }
        if (amlType === 3 ) {
            form.setFieldsValue({
                amlFlightData: {
                    noOfLanding: flightData.noOfLanding?flightData.noOfLanding : null,
                }})
        }
    },[id,amlType])

    const fetchEditData = useCallback(async () => {
        const {data} = await AMLService.fetchById(id);
        setData(data.rectificationViewModels)
        setAtlTypeForEdit(data.amlType)
        const {amlOilRecordViewModels, amlFlightDataViewModel, rectificationViewModels, ...aml} = data;

        setFlightData(data.amlFlightDataViewModel)


        if (data?.amlFlightDataViewModel?.blockOffTime === null && data?.amlFlightDataViewModel?.blockOnTime === null
            && data?.amlFlightDataViewModel?.takeOffTime === null && data?.amlFlightDataViewModel?.landingTime === null) {
            setHasNotFlightDataDate(true)
        }
        if (data.amlType === 0 || data.amlType === 3) {
            setRegularOrMaint(true)
        }

        const amlConverted = AMLConverter.toFormObj(aml)
        setAircrafts([{aircraftId: amlConverted?.aircraftId, aircraftName: amlConverted.aircraftName}])

        const defectDate1 = data?.rectificationViewModels[0]?.defectSignTime?.slice(0, 10)
        const defectDate2 = data?.rectificationViewModels[0]?.rectSignTime?.slice(0, 10)
        const rectDate1 = data?.rectificationViewModels[1]?.defectSignTime?.slice(0, 10)
        const rectDate2 = data?.rectificationViewModels[1]?.rectSignTime?.slice(0, 10)

        const defectTime1 = data?.rectificationViewModels[0]?.defectSignTime?.slice(11)
        const defectTime2 = data?.rectificationViewModels[0]?.rectSignTime?.slice(11)
        const rectTime1 = data?.rectificationViewModels[1]?.defectSignTime?.slice(11)
        const rectTime2 = data?.rectificationViewModels[1]?.rectSignTime?.slice(11)


        const blockOnDate = data?.amlFlightDataViewModel?.blockOnTime?.slice(0, 10)
        const blockOffDate = data?.amlFlightDataViewModel?.blockOffTime?.slice(0, 10)
        const landingDate = data?.amlFlightDataViewModel?.landingTime?.slice(0, 10)
        const takeOffDate = data?.amlFlightDataViewModel?.takeOffTime?.slice(0, 10)
        const commencedDate = data?.amlFlightDataViewModel?.commencedTime?.slice(0, 10)
        const completedDate = data?.amlFlightDataViewModel?.completedTime?.slice(0, 10)

        const blockOnTime = data?.amlFlightDataViewModel?.blockOnTime?.slice(11)
        const blockOffTime = data?.amlFlightDataViewModel?.blockOffTime?.slice(11)
        const landingTime = data?.amlFlightDataViewModel?.landingTime?.slice(11)
        const takeOffTime = data?.amlFlightDataViewModel?.takeOffTime?.slice(11)
        const commencedTime = data?.amlFlightDataViewModel?.commencedTime?.slice(11)
        const completedTime = data?.amlFlightDataViewModel?.completedTime?.slice(11)


        form.setFieldsValue({
            ...amlConverted,
            flightNo: data.amlType === 3 ? data?.flightNo : data.flightNo.substring(3),
            defectDate1: defectDate1 && DateTimeConverter.stringToMomentDate(defectDate1),
            defectDate2: defectDate2 && DateTimeConverter.stringToMomentDate(defectDate2),
            rectDate1: rectDate1 && DateTimeConverter.stringToMomentDate(rectDate1),
            rectDate2: rectDate2 && DateTimeConverter.stringToMomentDate(rectDate2),
            defectTime1: defectTime1 && moment(defectTime1, 'HH:mm:ss'),
            defectTime2: defectTime2 && moment(defectTime2, 'HH:mm:ss'),
            rectTime1: rectTime1 && moment(rectTime1, 'HH:mm:ss'),
            rectTime2: rectTime2 && moment(rectTime2, 'HH:mm:ss'),
            blockOnDate: DateTimeConverter.stringToMomentDate(blockOnDate) || null,
            blockOffDate: DateTimeConverter.stringToMomentDate(blockOffDate) || null,
            landingDate: DateTimeConverter.stringToMomentDate(landingDate) || null,
            takeOffDate: DateTimeConverter.stringToMomentDate(takeOffDate) || null,
            commencedDate: commencedDate ? DateTimeConverter.stringToMomentDate(commencedDate) : null,
            completedDate: completedDate ? DateTimeConverter.stringToMomentDate(completedDate) : null,
            blockOnTime: blockOnTime? moment(blockOnTime, 'HH:mm:ss') : null,
            blockOffTime: blockOffTime ? moment(blockOffTime, 'HH:mm:ss') : null,
            landingTime: landingTime ? moment(landingTime, 'HH:mm:ss') : null,
            takeOffTime: takeOffTime ? moment(takeOffTime, 'HH:mm:ss') : null,
            commencedTime: commencedTime ? moment(commencedTime, 'HH:mm:ss') : null,
            completedTime: completedTime ? moment(completedTime, 'HH:mm:ss') : null,
        });

        if (amlOilRecordViewModels.length > 0) {
            setSelectedBox({...revertOilDataSelectedBoxes(amlOilRecordViewModels)})
            form.setFieldsValue({
                [OIL_RECORD_FORM]: formatOilRecordsFormValue(amlOilRecordViewModels),
                saveOilRecord: true
            })
            setIsOilRecordAdded(true);
        } else {
            form.setFieldsValue({[OIL_RECORD_FORM]: amlFormInitialValues[OIL_RECORD_FORM]})
        }

        if (amlFlightDataViewModel !== null) {
            const flightData = FlightDataConverter.toFormObj(amlFlightDataViewModel);
            form.setFieldsValue({[FLIGHT_DATA_OBJ]: {...flightData}})
        }

        if (rectificationViewModels.length > 0) {
            setDefectsAdded(true);
            form.setFieldsValue({needToSaveDefectRectification: true});
            const [firstValue, secondValue] = rectificationViewModels;
            const defectForms = [
                {
                    ...firstValue,
                    workOrder1: firstValue?.woNo ? 1 : 2,
                    dueDate: firstValue?.dueDate ? DateTimeConverter.stringToMomentDate(firstValue?.dueDate) : null
                },
                {
                    ...secondValue,
                    workOrder1: secondValue?.woNo ? 1 : 2,
                    dueDate: secondValue?.dueDate ? DateTimeConverter.stringToMomentDate(secondValue?.dueDate) : null
                },
            ];
            form.setFieldsValue({
                [DEFECTS_FORM_DATA]: defectForms
            })

        } else {
            form.setFieldsValue({
                [DEFECTS_FORM_DATA]: [...DEFECTS_DEFAULT_FORMS]
            })
        }
    }, [id])

    const onReset = async () => {
        if (isEditForm()) {
            await fetchEditData();
            return;
        }

        form.resetFields();
    }

    useEffect(() => {
        if (!isEditForm()) {
            return;
        }

        (async () => {
            await fetchEditData();
        })();
    }, [id])

    return {
        aircrafts,
        setAircrafts,
        airports,
        form,
        id,
        onReset,
        onFinish,
        employees,
        amls,
        submitting,
        selectedBox,
        setSelectedBox,
        setSubmitType,
        defectsAdded,
        isOilRecordAdded,
        regularOrMaint,
        disabled0,
        disabled1,
        hasNotFlightDataDate,
        totalAirTimeAlphabet,
        setTotalAirTimeAlphabet,
        totalLandingAlphabet,
        setTotalLandingAlphabet,
        alTypeForEdit
    }
}

export function useAmlFlightDataAdd() {
    const {id} = useParams();
    const {id: amlId} = useParams();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [flightData, setFlightData] = useState({})
    const {toRequestObj, toFormObj} = FlightDataConverter;
    const isEditForm = () => flightData.id;


    const saveOrUpdate = async (values) => {
        const data = {
            amlId,
            ...toRequestObj(values)
        };

        return flightData.id ?
            await amlFlightDataService.update(flightData.id, data) :
            await amlFlightDataService.save(data);
    }

    const onFinish = async (values) => {

        try {
            setSubmitting(true);
            const {data: {id, message}} = await saveOrUpdate(values);
            const res = await amlFlightDataService.fetchById(id);
            const newData = toFormObj(res.data);
            form.setFieldsValue({...newData});
            setFlightData({...newData});
            notifySuccess(message);
        } catch (e) {
            notifyResponseError(e);
        } finally {
            setSubmitting(false);
        }
    }

    const onReset = () => {
        if (isEditForm()) {
            form.setFieldsValue({...flightData});
            return;
        }

        form.resetFields();
    }

    return {
        id,
        form,
        onFinish,
        onReset,
        isEdit: !!flightData.id,
        submitting
    }
}