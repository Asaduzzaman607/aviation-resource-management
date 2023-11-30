import moment from "moment";
const date = moment.utc(new Date(), 'MM-DD-YYYY').subtract(1, 'day').format('DD-MM-YYYY')

export const SIGN_TYPES = {
	CERTIFICATION_FOR_OIL_AND_FUEL: 1,
	CERTIFICATION_FOR_RVSM_FLT: 2,
	CERTIFICATION_FOR_ETOPS_FLT: 3,
	CERTIFICATION_FOR_PFI: 4,
	CERTIFICATION_FOR_FLT: 5
}

export const ATL = 'ATL';

export const FLIGHT_DATA_OBJ = 'amlFlightData';
export const DEFECTS_FORM_DATA = 'defectRectifications'
export const OIL_RECORD_FORM = 'amlOilRecord';
export const ON_ARRIVAL = 'onArrival';
export const DOWN = 'upLift'

const OIL_RECORD_DATA = {
	type: '',
	hydOil1: '',
	hydOil2: '',
	hydOil3: '',
	engineOil1: '',
	engineOil2: '',
	apuOil: '',
	csdOil1: '',
	csdOil2: '',
	oilRecord: '',
	amlId: ''
}

export const FLIGHT_DATA_DEFAULT_FORMS = {
	amlId: '',
	// noOfLanding: '',
	blockOnTime: '',
	blockOffTime: '',
	landingTime: '',
	takeOffTime: '',
	commencedTime: '',
	completedTime: '',
	apuHours: '',
	apuCycles: '',
	totalAirTime: '',
	totalLanding: ''
}

export const DEFECTS_DEFAULT_FORMS = [
	{
		id: null,
		melType: 0,
		melId: "",
		amlId: '',
		seqNo: "A",
		defectDmiNo: "",
		defectDescription: "",
		defectStaId: "",
		defectSignTime: "",
		rectDmiNo: "",
		rectMelRef: "",
		rectCategory: "",
		dueDate: "",
		rectAta: "",
		rectPos: "",
		rectPnOff: "",
		rectSnOff: "",
		rectPnOn: "",
		rectSnOn: "",
		rectGrn: "",
		rectDescription: "",
		rectSignId: "",
		rectStaId: "",
		rectSignTime: "",
		workOrder1:2,
	},
	{
		id: null,
		melType: 0,
		melId: "",
		amlId: '',
		seqNo: "B",
		defectDmiNo: "",
		defectDescription: "",
		defectSignId: "",
		defectStaId: "",
		defectSignTime: "",
		rectDmiNo: "",
		rectMelRef: "",
		rectCategory: "",
		dueDate: "",
		rectAta: "",
		rectPos: "",
		rectPnOff: "",
		rectSnOff: "",
		rectPnOn: "",
		rectSnOn: "",
		rectGrn: "",
		rectDescription: "",
		rectSignId: "",
		rectStaId: "",
		rectSignTime: "",
		workOrder1:2,
	},
];
export const amlFormInitialValues = {
	referenceAmlId: "",
	aircraftId: "",
	fromAirportId: null,
	toAirportId: null,
	preFlightInspectionAirportId: "",
	captainId: "",
	firstOfficerId: "",
	pfiDate: "",
	pfiTime: "",
	ocaDate: "",
	ocaTime: "",
	pageNo: "", // mandatory
	flightNo: "",
	date: moment(date, 'DD-MM-YYYY'), // mandatory
	remarks: "",
	refuelDelivery: "",
	specificGravity: "",
	convertedIn: "",
	isActive: true,
	allowAlphabet: false,
	showFlightDataForm: false,
	amlType: 0,
	saveOilRecord: false,
	maintenanceLogSignatureDtoList: [
		{
			amlSignatureId: "",
			signatureId: "",
			signatureType: SIGN_TYPES.CERTIFICATION_FOR_OIL_AND_FUEL,
		},
		{
			amlSignatureId: "",
			signatureId: "",
			signatureType: SIGN_TYPES.CERTIFICATION_FOR_RVSM_FLT,
		},
		{
			amlSignatureId: "",
			signatureId: "",
			signatureType: SIGN_TYPES.CERTIFICATION_FOR_ETOPS_FLT,
		},
		{
			amlSignatureId: "",
			signatureId: "",
			signatureType: SIGN_TYPES.CERTIFICATION_FOR_PFI,
		},
		{
			amlSignatureId: "",
			signatureId: "",
			signatureType: SIGN_TYPES.CERTIFICATION_FOR_FLT,
		},
	],
	needToSaveDefectRectification: false,
	blockOffTime: "",
	blockOnTime: "",
	takeOffTime: "",
	landingTime: "",

	[FLIGHT_DATA_OBJ]: FLIGHT_DATA_DEFAULT_FORMS,

	[DEFECTS_FORM_DATA]: DEFECTS_DEFAULT_FORMS,

	[OIL_RECORD_FORM]: {
		[ON_ARRIVAL]: { ...OIL_RECORD_DATA },
		[DOWN]: { ...OIL_RECORD_DATA },
		c1: false,
		c2: false,
		c3: false,
		c4: false,
		c5: false,
		c6: false,
		c7: false,
		c8: false,
		c9: false,
		c10: false,
		c11: false,
		c12: false,
		c13: false,
		c14: false,
		c15: false,
		c16: false,
		c17: false,
		c18: false,
	}
}

export const SELECTED_BOXES = {
	c1: false,
	c2: false,
	c3: false,
	c4: false,
	c5: false,
	c6: false,
	c7: false,
	c8: false,
	c9: false,
	c10: false,
	c11: false,
	c12: false,
	c13: false,
	c14: false,
	c15: false,
	c16: false,
	c17: false,
	c18: false,
}

export const AML_TYPES_OPTIONS = [
	{ id: 0, name: "REGULAR" },
	{ id: 1, name: "VOID" },
	{ id: 2, name: "NIL" },
	{ id: 3, name: "MAINT" },
]

export const AML_TYPES_REGULAR_MAINT_EDIT_OPTIONS = [
	{ id: 0, name: "REGULAR" },
	{ id: 3, name: "MAINT" },
]
export const AML_TYPES_REGULAR_EDIT_OPTIONS = [
	{ id: 0, name: "REGULAR" }
]
export const AML_TYPES_VOID_NIL_EDIT_OPTIONS = [
	{ id: 1, name: "VOID" },
	{ id: 2, name: "NIL" },
]

export const AML_TYPES = {
	REGULAR: 0,
	VOID: 1,
	NIL: 2,
	MAINT: 3
}

export const ALPHABETS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 'M', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']