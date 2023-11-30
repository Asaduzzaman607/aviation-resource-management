import { Form, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import AirportService from "../../../service/AirportService";
import { getErrorMessage } from "../../common/helpers";

export default function useAddAirport() {
	const [form] = Form.useForm();
	const {id} = useParams()
	const navigate  =useNavigate()
	const [airportData, setAirportData] = useState({});
	
	const getAirportById = useCallback(async () => {
		try {
			const {data} = await AirportService.getAirportById(id)
			form.setFieldsValue({...data})
			setAirportData({...data})
			
		} catch (er) {
			notification["error"]({message: getErrorMessage(er)});
		}
	}, [])
	
	useEffect(() => {
		if (!id) {
			return
		}
		
		getAirportById().catch(console.error)
		
	}, [id])
	
	
	const onReset = () => {
		if(id){
			form.setFieldsValue({...airportData})
		}
		else{
			form.resetFields()
		}
	};
	
	const onFinish = async (values) => {
		try {
			if (id) {
				await AirportService.updateAirport(id, values)
				console.log(id, values)
			} else{
				let {data} = await AirportService.saveAirport(values)
			}
			
			form.resetFields()
			navigate('/planning/airports')
			notification["success"]({
				message: id ? "Successfully updated!" : "Successfully added!",
			});
			
		} catch (er) {
			notification["error"]({message: getErrorMessage(er)});
		}
		
	};
	
	
	return {
		form,
		id,
		onReset,
		onFinish
	}
	
}