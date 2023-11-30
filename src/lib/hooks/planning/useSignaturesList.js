import SignaturesService from "../../../service/planning/configurations/SignaturesService";
import { notification } from "antd";
import { getErrorMessage } from "../../common/helpers";
import { useEffect, useState } from "react";

export default function useSignaturesList() {
	
	const [signatures, setSignatures] = useState([]);
	
	const getAllSignatures = async () => {
		try {
			// const { data } = await SignaturesService.getAllSignatures(true);
			const { data } = await SignaturesService.getAllSavedSignatures();
			setSignatures(data);
		} catch (e) {
			notification["error"]({
				message: getErrorMessage(e),
			});
		}
	};
	
	useEffect(() => {
		(async () => {
			await getAllSignatures();
		})();
	}, [])
	
	return {
		signatures
	}
}