import { useEffect, useState } from "react";
import AirportService from "../../../service/AirportService";
import { useDispatch, useSelector } from "react-redux";
import { fetchAirports } from "../../../reducers/airport.reducer";

export function useAirports() {
	const dispatch = useDispatch();
	const airports = useSelector(state => state.airports);
	
	useEffect(() => {
		dispatch(fetchAirports())
	}, [])
	
	return {
		airports
	}
}