const oilRecordTypes = {
	1: "On Arrival",
	2: "Uplift",
	3: "Total"
}

const AmlViewService = {
	getOilRecordType: type => {
		try {
			return oilRecordTypes[type];
		} catch (e) {
			return "";
		}
	},
	
	formatOilDataValue: value => {
		return value === -1 ? 'Full' : value;
	},
	
	formatAuthNo: ({signatureName = '', authNo = ''}) => {
		if (signatureName && authNo) {
			return `${signatureName} - ${authNo}`
		}
		
		return 'N/A';
	},
	
	oilRecordDataColumns: [
		"Type",
		"Hyd Oil1",
		"Hyd Oil2",
		"Hyd Oil3",
		"Engine Oil1",
		"Engine Oil2",
		"APU Oil",
		"CSD Oil1",
		"CSD Oil2",
		"Oil Record",
	]
}

export default AmlViewService;