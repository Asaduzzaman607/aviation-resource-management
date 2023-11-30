import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import aircraftReducers from '../reducers/aircraft.reducers';
import aircraftModelFamilyReducers from '../reducers/aircraftModelFamily.reducers';
import airportReducers from '../reducers/airport.reducer';
import cityReducers from '../reducers/city.reducers';
import companyReducers from '../reducers/company.reducers';
import countryReducers from '../reducers/country.reducers';
import externalserviceReducers from '../reducers/externalservice.reducers';
import locationReducers from '../reducers/location.reducers';
import menuReducer from '../reducers/menu.reducers';
import paginationReducer from '../reducers/paginate.reducers';
import rackReducers from '../reducers/rack.reducers';
import rackRowReducers from '../reducers/rackRow.reducers';
import rackRowBinReducers from '../reducers/RackRowBin.reducers';
import roomReducers from '../reducers/room.reducers';
import routeLocationReducers from '../reducers/routeLocation.reducers';
import storeReducers from '../reducers/store.reducers';
import userReducer from '../reducers/user.reducers';
import workflowReducers from '../reducers/workflowReducers';

const persistConfig = {
  key: 'root',
  storage,
};

const reducer = combineReducers({
  user: userReducer,
  companies: companyReducers,
  menu: menuReducer,
  pagination: paginationReducer,
  stores: storeReducers,
  rooms: roomReducers,
  racks: rackReducers,
  aircrafts: aircraftReducers,
  aircraftModelFamilies: aircraftModelFamilyReducers,
  rackrow: rackRowReducers,
  rackrowBin: rackRowBinReducers,
  externaldept: externalserviceReducers,
  locations: locationReducers,
  cities: cityReducers,
  countries: countryReducers,
  workflow: workflowReducers,
  airports: airportReducers,
  routeLocation: routeLocationReducers,
});

const persistedState = persistReducer(persistConfig, reducer)
  ? persistReducer(persistConfig, reducer)
  : {};

const store = configureStore({
  reducer: persistedState,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export default store;
