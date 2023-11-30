import { Form } from "antd";
import { useParams } from "react-router-dom";
import AMLConverter from "../../converters/planning/AMLConverter";
import AMLService from "../../service/planning/AMLService";
import { identity } from "../common/helpers";
import API from "../../service/Api";

export default function useSaveAndUpdate(url) {
	const [form] = Form.useForm();
	const {id} = useParams();
	const isEditForm = () => id !== undefined;
	
	const saveOrUpdate = async (values, converter = identity) => {
		
		if (typeof converter !== 'function') throw 'converter should be a function';
		
		const data = converter(values);
		
		isEditForm() ?
			await API.put(`${url}/${id}`, data) :
			await API.post(url, data);
	}
	
	return {
		saveOrUpdate
	}
}