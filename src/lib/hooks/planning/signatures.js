import { useEffect, useState } from "react";
import API from "../../../service/Api";

export default function useSignatures() {
	const [signatures, setSignatures] = useState([]);
	
	useEffect(() => {
		(async () => {
			const res = API.get('signature/all/active');
			const data = [...(await res).data].map(({id, authNo, employeeName}) => ({id, name: employeeName + ' - ' + authNo}))
			setSignatures(data);
		})();
	}, [])
	
	return {
		signatures
	}
}