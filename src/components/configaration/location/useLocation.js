import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Form, notification} from "antd";
import CityService from "../../../service/CityService";
import cityService from "../../../service/CityService";
import CountryService from "../../../service/CountryService";
import LocationService from "../../../service/LocationService";
import {useCountryList} from "../base/useCity";
import useCitiesByCountry from "../../store/rackrowbin/useCitiesByCountry";
import {notifyResponseError} from "../../../lib/common/notifications";


export function useCityList() {
  const [cities, setCities] = useState([]);
  return {
    cities,
    setCities,
  };
}


const UseLocation = (countryFrom, cityForm) => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [selectedCountry, setSelectedCountry] = useState('');
  const [location, setLocation] = useState({});
  const [resetField, setResetField] = useState({});
  const {country, setCountry, getAllCountry} = useCountryList()
  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [Val, setVal] = useState('');

  const countryId = Form.useWatch('countryId', form);
  const {cities, setCities} = useCitiesByCountry(countryId);


  const handleCountrySubmit = async (values) => {
    try {
      const {data} = await CountryService.saveCountry(values);
      notification["success"]({
        message: "Store successfully created",
      });
      setCountryModal(false);
      const id = data.id;
      const newModel = {
        code: values.code,
        name: values.name,
        dialingCode: values.dialingCode,
        id,
      };
      setCountry((prevState) => [newModel, ...prevState]);
      setVal(id)
      form.setFieldsValue({countryId: id});
      cityForm.setFieldsValue({countryId: id})
      countryFrom.resetFields();
    } catch (er) {
      notifyResponseError(er)
    }
  };

  const handleCitySubmit = async (values) => {
    try {
      const {data} = await cityService.saveCity(values);
      notification["success"]({
        message: "Store successfully created",
      });
      setCityModal(false);
      const id = data.id;
      const newCityModel = {
        name: values.name,
        zipCode: values.zipCode,
        countryId: values.countryId,
        id,
      };
      setCities((prevCity) => [newCityModel, ...prevCity]);
      form.setFieldsValue({cityId: id, countryId: values.countryId, name: values.name});
      cityForm.resetFields()

    } catch (er) {
      notifyResponseError(er)
    }
  };


  const selectCountry = (country) => {
    setSelectedCountry(country);
    form.setFieldsValue({...form, cityId: null});
  };

  const getLocationById = async (id) => {
    try {
      const {data} = await LocationService.getLocationById(id);
      setLocation(data);
    } catch (error) {
      notifyResponseError(error)
    }
  };

  const getCountryId = async (id) => {
    try {
      const {data} = await CityService.getCityById(id);
      form.setFieldsValue({...location, countryId: data.countryId});
      setResetField({...location, countryId: data.countryId});
      setSelectedCountry(data.countryId);
    } catch (error) {
      notifyResponseError(error)
    }
  };

  const onReset = () => {
    if (id) {
      form.setFieldsValue(resetField);
      setSelectedCountry(resetField.countryId);
    } else {
      form.resetFields();
    }
  };

  const onFinish = async (values) => {
    try {
      if (id) {
        await LocationService.updateLocation(id, values);
      } else {
        await LocationService.saveLocation(values);
      }
      form.resetFields();
      navigate(-1);
      notification['success']({
        message: id ? 'Successfully updated!' : 'Successfully added!',
      });
    } catch (error) {
      notifyResponseError(error)
    }
  };



  return {
    id,
    onFinish,
    onReset,
    selectCountry,
    selectedCountry,
    cities,
    handleCountrySubmit,
    country,
    setCountry,
    countryModal,
    setCountryModal,
    form,
    handleCitySubmit,
    cityModal,
    setCityModal,
    setVal,
    Val,
    getLocationById,
    location,
    getCountryId,
    getAllCountry,
    countryId,
  }
};

export default UseLocation;