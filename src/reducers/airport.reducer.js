import { createSlice } from '@reduxjs/toolkit';
import { fetchPagination } from "../lib/hooks/paginations";
import AirportService from "../service/AirportService";

export const fetchAirports = () => async (dispatch, getState) => {
	try {
		const res = await AirportService.getAllAirport();
		const ans=res?.data?.filter(({isActive})=> isActive)

		//const airports = res.data.map(({id, iataCode}) => ({id, name: iataCode}));
		const airports = ans.map(({id, iataCode, name}) => ({id, name: iataCode, airportName: name}));
		dispatch(setAirports(airports));
	} catch (e) {
		dispatch(setAirports([]))
	}
};

const initialState = [];

export const airportsSlice = createSlice({
	name: 'airportOptions',
	initialState,
	reducers: {
		setAirports: (state, action) => {
			return action.payload;
		},
		
		addNewAirport(state, action) {
			return [action.payload, ...state]
		}
	},
});

export const {setAirports, addNewAirport} = airportsSlice.actions;

export default airportsSlice.reducer;
