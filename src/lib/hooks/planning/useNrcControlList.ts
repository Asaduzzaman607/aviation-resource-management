import {Form, notification} from "antd";
import {SetStateAction, useCallback, useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import API from "../../../service/Api";
import {notifyResponseError, notifySuccess} from "../../common/notifications";
import {useAircraftsList} from "./aircrafts";
import {getErrorMessage} from "../../common/helpers";
import {useBoolean} from "react-use";

export default function useNrcControlList() {
    const {id} = useParams()
    const [form] = Form.useForm();
    const [isActive, setIsActive] = useState(false)
    const [nrcControlLists, setNrcControlList] = useState<any>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(0)
    const {allAircrafts, getAllAircrafts} = useAircraftsList();
    const aircraftId = Form.useWatch("aircraftId", form)
    const [workOrders, setWorkOrders] = useState<any>([])
    const [acCheckIndexs, setAcCheckIndexs] = useState<any>([])
    const navigate = useNavigate()
    const [singleNrc, setSingleNrc] = useState<any>({})
    const [submitting, toggleSubmitting] = useBoolean(false)

    const getWorkWorderByAircraftId = async () => {
        if (!aircraftId) {
            return
        }
        const work = await API.get(`work-order/work-order-by-aircraft/${aircraftId}`)
        const acCheckIndex = await API.get(`nrc-control-list/get-aircraft-Check-Index-By-Aircraft-Id/${aircraftId}`)
        setWorkOrders(work.data)
        setAcCheckIndexs(acCheckIndex.data)

    }

    const getSingleNrc = async () => {
        if (!id) {
            return
        }
        const {data} = await API.get(`/nrc-control-list/${id}`)
        const formattedData = {
            ...data,
            date: DateTimeConverter.stringToMomentDate(data.date)
        }
        setSingleNrc(data)
        form.setFieldsValue({...formattedData})
    }

    useEffect(() => {
        (async () => {
            await getWorkWorderByAircraftId()
        })()
    }, [aircraftId])

    const onFinish = async (values: any) => {
        const customValues = {
            ...values,
            date: DateTimeConverter.momentDateToString(values.date),
        }
        try {
            if (id) {
                await API.put(`nrc-control-list/${id}`, customValues)
                notifySuccess("NRC Updated Successfully")
            } else {
                await API.post('nrc-control-list', customValues)
                notifySuccess("NRC Created Successfully")
            }
            navigate("/planning/nrc-control-list")

        } catch (error) {
            notifyResponseError(error)
        }
    }


    const onSearch = useCallback(async (values: any) => {

        try {
            const {data} = await API.post(`nrc-control-list/search?page=${currentPage}&size=${10}`, values)
            setNrcControlList(data.model)
            setCurrentPage(data.currentPage)
            setTotalPages(data.totalPages)

        } catch (error) {
            notification["error"]({message: getErrorMessage(error)});
        } finally {
            toggleSubmitting(false);
        }
    }, [currentPage, toggleSubmitting])

    useEffect(() => {
        if (!aircraftId) {
            return;
        }
        (async () => {
            await onSearch(form.getFieldsValue(true));
        })();
    }, [onSearch, form]);



    const onReset = () => {
        if (id) {
            getSingleNrc()
            return
        }
        form.resetFields()
    }

    useEffect(() => {
        (async () => {
            await getAllAircrafts()
            await getSingleNrc()
        })()
    }, [])
    
    const reset = () =>{
        form.resetFields();
        setNrcControlList([]);
    };

    return {
        id,
        form,
        onFinish,
        isActive,
        setIsActive,
        nrcControlLists,
        setCurrentPage,
        currentPage,
        totalPages,
        allAircrafts,
        onReset,
        workOrders,
        onSearch,
        acCheckIndexs,
        singleNrc,
        submitting,
        reset
    }
};
