import API from "../../../service/Api";
import { useCallback, useState } from "react";

export default function useEmployees() {
	const [employees, setEmployees] = useState([])
	
	const initEmployees = useCallback(async () => {
		const { data: { model } } = await API.get('employee')
		setEmployees(model.map(({ id, name }) => ({ id, name })))
	}, [])
	
	return {
		initEmployees,
		employees,
		setEmployees
	}
}