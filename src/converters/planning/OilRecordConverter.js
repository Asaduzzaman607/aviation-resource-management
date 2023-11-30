const convertValue = (isChecked, value) => {
	if(isChecked) {
		return -1;
	}
	
	if(isNaN(value) || value === null || value === '') {
		return 0;
	}
	
	return value;
}

export default class OilRecordConverter {
	static toRequestObj(values, selectedBox) {
		return {
			onArrival: {
				...values.onArrival,
				type: 1,
				hydOil1: convertValue(selectedBox.c1, values.onArrival?.hydOil1),
				hydOil2: convertValue(selectedBox.c2, values.onArrival?.hydOil2),
				hydOil3: convertValue(selectedBox.c3, values.onArrival?.hydOil3),
				engineOil1: convertValue(selectedBox.c4, values.onArrival?.engineOil1),
				engineOil2: convertValue(selectedBox.c5, values.onArrival?.engineOil2),
				apuOil: convertValue(selectedBox.c6, values.onArrival?.apuOil),
				csdOil1: convertValue(selectedBox.c7, values.onArrival?.csdOil1),
				csdOil2: convertValue(selectedBox.c8, values.onArrival?.csdOil2),
				oilRecord: convertValue(selectedBox.c9, values.onArrival?.oilRecord),
			},
			
			upLift: {
				...values.upLift,
				type: 2,
				hydOil1: convertValue(selectedBox.c10, values.upLift?.hydOil1),
				hydOil2: convertValue(selectedBox.c11, values.upLift?.hydOil2),
				hydOil3: convertValue(selectedBox.c12, values.upLift?.hydOil3),
				engineOil1: convertValue(selectedBox.c13, values.upLift?.engineOil1),
				engineOil2: convertValue(selectedBox.c14, values.upLift?.engineOil2),
				apuOil: convertValue(selectedBox.c15, values.upLift?.apuOil),
				csdOil1: convertValue(selectedBox.c16, values.upLift?.csdOil1),
				csdOil2: convertValue(selectedBox.c17, values.upLift?.csdOil2),
				oilRecord: convertValue(selectedBox.c18, values.upLift?.oilRecord)
			}
		}
	}
}