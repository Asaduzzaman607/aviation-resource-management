import ShortUniqueId from "short-unique-id";
import {useNavigate, useParams} from "react-router-dom";
import {Form, notification} from "antd";
import {useEffect, useState} from "react";
import PartsServices from "../../../service/PartsServices";
import {getErrorMessage} from "../../../lib/common/helpers";
import AircraftService from "../../../service/AircraftService";
import AirportService from "../../../service/AirportService";
import UnserviceableItemService from "../../../service/store/UnserviceableItemService";
import ScrapPartsService from "../../../service/store/ScrapPartsService";
import UnitofMeasurementService from "../../../service/UnitofMeasurementService";
import PartsReturnService from "../../../service/store/PartsReturnService";

export function useUnserviceableItem() {
    const {id} = useParams()
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [issue, setIssue] = useState([])
    const [aircraft, setAircraft] = useState([])
    const [airport, setAirport] = useState([])
    const [partReturn, setPartReturn] = useState([])
    const [storeReturnPart, setStoreReturnPart] = useState([])
    const getAirCrafts = async () => {
        try {
            let {data} = await AircraftService.getAllAircraft(true)
            setAircraft(data.model)
            console.log("aircraft", data.model)
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }
    const getAirports = async () => {
        try {
            let {data} = await AirportService.searchAirports({
                "query": "",
                "isActive": true
            })
            setAirport(data.model)
            console.log("airport", data.model)
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }
    const getStoreReturn = async () => {
        try {
            let {data} = await PartsReturnService.getAllStockReturnService(true, "APPROVED")

            setPartReturn(data.model)
            console.log("PartReturn", data.model)
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }
    const getIssue = async () => {

        try {
            let {data} = await PartsReturnService.getAllIssueDemand(true,
                "APPROVED")
            console.log("Issue", data.model)
            setIssue(data.model)
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }

    useEffect(() => {
        getAirCrafts().catch(console.error)
        getAirports().catch(console.error)
        getStoreReturn().catch(console.error)
        getIssue().catch(console.error)
    }, [])
    const onFinish = async (values) => {
        const modifiedValue = {
            ...values,
            removalDate: values['removalDate']?.format('YYYY-MM-DD'),
        };

        console.log("submit", modifiedValue)


        try {
            if (id) {
                await UnserviceableItemService.updateUnserviceableItem(id,modifiedValue)
            } else {

                let {data} = await UnserviceableItemService.saveUnserviceableItem(modifiedValue)
            }
            form.resetFields()
            notification["success"]({
                message: id ? "Successfully updated!" : "Successfully added!",
            });

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }
    const onReset = () => {
        form.resetFields();
    }
    const handleChange = async (value) => {


        if (value === ""||value===undefined) {
            setStoreReturnPart([])
        }
       else {
            let {data} = await PartsReturnService.getStockReturnServiceById(value)

            console.log("list", data.storeReturnPartList)
            setStoreReturnPart(data.storeReturnPartList)
        }

    }


    return {
        aircraft,
        airport,
        issue,
        partReturn,
        storeReturnPart,
        form,
        id,
        onReset,
        onFinish,
        handleChange

    }

}