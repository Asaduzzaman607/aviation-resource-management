import AirportService from "../../../service/AirportService";
import { notification } from "antd";
import { getErrorMessage } from "../../common/helpers";
import { useEffect, useState } from "react";

export default function useAirportsList() {
	
	const [airports, setAirports] = useState([]);
	
	const getAllAirports = async () => {
		try {
			const { data } = await AirportService.getAllAirport();
			setAirports(data);
		} catch (e) {
			notification["error"]({
				message: getErrorMessage(e),
			});
		}
	};
	
	useEffect(() => {
		(async () => {
			await getAllAirports();
		})();
	}, [])
	
	return {
		airports
	}
}