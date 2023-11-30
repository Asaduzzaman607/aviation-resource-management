import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, notification } from 'antd';
import { getErrorMessage } from '../../../lib/common/helpers';
import roomService from '../../../service/RoomService';
import officeService from '../../../service/OfficeService';
import cityService from '../../../service/CityService';
import CountryService from '../../../service/CountryService';
import locationService from '../../../service/LocationService';
import { useCountryList } from '../../configaration/base/useCity';
import {
  notifyResponseError,
  notifySuccess,
} from '../../../lib/common/notifications';
import useCitiesByCountry from '../rackrowbin/useCitiesByCountry';

export function useOfficelList() {
  const [offices, setOffices] = useState([]);
  const getAllOffices = useCallback(async () => {
    try {
      const { data } = await officeService.getAllStores(1000, {
        query: '',
        isActive: true,
      });
      setOffices(data.model);
    } catch (error) {
      notifyResponseError(error);
    }
  }, []);
  return {
    offices,
    setOffices,
    getAllOffices,
  };
}

export function useRooms(storeForm, locationForm, countryForm, cityForm) {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const cardTitle = id ? 'Update Room' : 'Add Room';
  const { offices, setOffices, getAllOffices } = useOfficelList();
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [store, setStore] = useState([]);
  const [debounceVal, setDebounceVal] = useState('');
  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [locationModal, setLocationModal] = useState(false);

  const { country, setCountry, getAllCountry } = useCountryList();
  const countryId = Form.useWatch('countryId', locationForm);
  const { cities, setCities } = useCitiesByCountry(countryId);

  const handleCountrySubmit = async (values) => {
    try {
      const { data } = await CountryService.saveCountry(values);
      notifySuccess('Store successfully created');
      setCountryModal(false);
      const id = data.id;
      const newModel = {
        code: values.code,
        name: values.name,
        dialingCode: values.dialingCode,
        id,
      };
      setCountry((prevState) => [newModel, ...prevState]);
      locationForm.setFieldsValue({
        countryId: id,
        prefix: values.dialingCode,
      });
      cityForm.setFieldsValue({ countryId: id });
      countryForm.resetFields();
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const handleCitySubmit = async (values) => {
    try {
      const { data } = await cityService.saveCity(values);
      notifySuccess('City successfully created');
      setCityModal(false);
      const id = data.id;
      const newCityModel = {
        name: values.name,
        zipCode: values.zipCode,
        countryId: values.countryId,
        id,
      };
      setCities((prevCity) => [newCityModel, ...prevCity]);
      locationForm.setFieldsValue({ cityId: id, countryId: values.countryId });
      cityForm.resetFields();
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const handleLocationSubmit = async (values) => {
    try {
      const { data } = await locationService.saveLocation(values);
      notifySuccess('Location successfully created');
      setLocationModal(false);
      const locationId = data.id;
      setSelectedLocation([
        {
          value: locationId,
          label: values.code,
          LocationId: id,
        },
      ]);

      storeForm.setFieldsValue({
        locationId: {
          value: locationId,
          label: values.code,
        },
      });
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const handleModelSubmit = async (values) => {
    try {
      const { data } = await officeService.saveStore({
        ...values,
        locationId: values.locationId.value,
      });
      notifySuccess('Store successfully created');
      setShowModal(false);
      const id = data.id;
      const newModel = {
        code: values.code,
        id,
      };
      setOffices((prevState) => [newModel, ...prevState]);
      setDebounceVal(id);
      form.setFieldsValue({ ...values, officeId: id, officeCode: values.code });
      storeForm.resetFields();
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const getRoomById = async (id) => {
    try {
      const { data } = await roomService.singleRoom(id);
      form.setFieldsValue({
        ...data,
      });
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const submitRoom = async (values) => {
    await roomService
      .saveRoom(values)
      .then((response) => {
        if (response.status === 200) {
          notifySuccess('Successfully Created');
          form.resetFields();
          navigate(-1);
        }
      })
      .catch((error) => {
        notifyResponseError(error);
      });
  };

  const updateRoom = async (id, data) => {
    try {
      await roomService.updateRoom(id, data);
      notification['success']({
        message: 'Room updated successfully',
      });
      form.resetFields();
      navigate(-1);
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  const onReset = async () => {
    if (!id) {
      form.resetFields();
    }
    if (id) {
      await getRoomById(id);
    }
  };
  const onFinish = (fieldsValue) => {
    const values = {
      ...fieldsValue,
    };
    id ? updateRoom(id, values) : submitRoom(values);
    form.resetFields();
  };
  const onNameChange = (event) => {
    setName(event.target.value);
  };

  return {
    offices,
    id,
    form,
    navigate,
    showModal,
    setShowModal,
    cardTitle,
    onReset,
    onFinish,
    onNameChange,
    name,
    setOffices,
    handleModelSubmit,
    store,
    setStore,
    debounceVal,
    selectedLocation,
    setLocationModal,
    locationModal,
    handleLocationSubmit,
    setSelectedLocation,
    setCountryModal,
    countryModal,
    handleCountrySubmit,
    setCityModal,
    cityModal,
    handleCitySubmit,
    country,
    cities,
    getAllOffices,
    getAllCountry,
    countryId,
    getRoomById,
  };
}
