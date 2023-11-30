import { useEffect, useState } from "react";
import EngineModelTypeService from "../../../service/EngineModelTypeService";
import { Form, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../../common/helpers";
import EngineModelService from "../../../service/EngineModelService";

export function useEngineModelTypes() {
	const [types, setTypes] = useState([]);
	
	useEffect(() => {
		(async () => {
			const { data } = await EngineModelTypeService.fetchAll();
			setTypes(data.filter(({isActive}) => isActive).map(v => ({id: v.id, name: v.name})));
		})();
	}, [])
	
	return {
		types
	}
}

export function useEngineModelAdd() {
	const [airCrafts, setAirCrafts] = useState([]);
	const [form] = Form.useForm();
	const navigate = useNavigate()
	const {id} = useParams();
	
	const [engineModel, setEngineModel] = useState();
	
	useEffect(() => {
		(async () => {
			const {data: {model}} = await EngineModelService.fetchAllAirCrafts();
			setAirCrafts(model.map(({id, aircraftName}) => ({id, name: aircraftName})))
		})();
	}, [])
	
	/*
	* Edit form data fetcher effect
	*/
	
	useEffect(() => {
		if (!id) {
			return;
		}
		
		(async () => {
			const { data } = await EngineModelService.fetchById(id);
			setEngineModel({...data});
			form.setFieldsValue({...data})
		})();
		
	}, [id])
	

	const handleFormReset = () => {
		
		if (!id) {
			form.resetFields();
			return;
		}
		
		form.setFieldsValue({...engineModel});
	};
	
	console.log({ id })
	
	const handleFormSubmit = async (values) => {
		console.log("values", values)
		try {
			
			if(id) {
				await EngineModelService.update(id, values)
			} else {
				await EngineModelService.save(values)
			}
			
			navigate('/planning/engine-models')
			
			notification["success"]({
				message: id ? "Successfully updated!" : "Successfully added!",
			});
			
		} catch (er) {
			notification["error"]({message: getErrorMessage(er)});
		}
		
	};
	
	return {
		id,
		form,
		handleFormReset,
		handleFormSubmit,
		airCrafts
	}
}