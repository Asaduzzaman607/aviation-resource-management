export function isFull(value) {
	// checked means full. which is represented by -1
	return value === -1;
}

export function convertOilRecordFieldValue(value) {
	if(value === -1) {
		return '';
	}
	
	return value
}

export function revertOilDataSelectedBoxes(oilRecords) {
	const [onArrival, uplift] = oilRecords;
	
	return {
		c1: isFull(onArrival.hydOil1),
		c2: isFull(onArrival.hydOil2),
		c3: isFull(onArrival.hydOil3),
		c4: isFull(onArrival.engineOil1),
		c5: isFull(onArrival.engineOil2),
		c6: isFull(onArrival.apuOil),
		c7: isFull(onArrival.csdOil1),
		c8: isFull(onArrival.csdOil2),
		c9: isFull(onArrival.oilRecord),
		c10: isFull(uplift.hydOil1),
		c11: isFull(uplift.hydOil2),
		c12: isFull(uplift.hydOil3),
		c13: isFull(uplift.engineOil1),
		c14: isFull(uplift.engineOil2),
		c15: isFull(uplift.apuOil),
		c16: isFull(uplift.csdOil1),
		c17: isFull(uplift.csdOil2),
		c18: isFull(uplift.oilRecord),
	}
}

export function formatOilRecordsFormValue(oilRecords) {
	const [onArrival, uplift] = oilRecords;
	
	return {
		onArrival: {
			id: onArrival.id,
			hydOil1: convertOilRecordFieldValue(onArrival.hydOil1),
			hydOil2: convertOilRecordFieldValue(onArrival.hydOil2),
			hydOil3: convertOilRecordFieldValue(onArrival.hydOil3),
			engineOil1: convertOilRecordFieldValue(onArrival.engineOil1),
			engineOil2: convertOilRecordFieldValue(onArrival.engineOil2),
			apuOil: convertOilRecordFieldValue(onArrival.apuOil),
			csdOil1: convertOilRecordFieldValue(onArrival.csdOil1),
			csdOil2: convertOilRecordFieldValue(onArrival.csdOil2),
			oilRecord: convertOilRecordFieldValue(onArrival.oilRecord)
		},
		upLift: {
			id: uplift.id,
			hydOil1: convertOilRecordFieldValue(uplift.hydOil1),
			hydOil2: convertOilRecordFieldValue(uplift.hydOil2),
			hydOil3: convertOilRecordFieldValue(uplift.hydOil3),
			engineOil1: convertOilRecordFieldValue(uplift.engineOil1),
			engineOil2: convertOilRecordFieldValue(uplift.engineOil2),
			apuOil: convertOilRecordFieldValue(uplift.apuOil),
			csdOil1: convertOilRecordFieldValue(uplift.csdOil1),
			csdOil2: convertOilRecordFieldValue(uplift.csdOil2),
			oilRecord: convertOilRecordFieldValue(uplift.oilRecord)
		}
	}
}