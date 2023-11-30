import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, notification } from 'antd';
import { getErrorMessage } from '../../../lib/common/helpers';
import roomService from '../../../service/RoomService';
import { useOfficelList } from '../room/Room';
import rackService from '../../../service/RackService';
import officeService from '../../../service/OfficeService';
import { useCountryList } from '../../configaration/base/useCity';
import cityService from '../../../service/CityService';
import CountryService from '../../../service/CountryService';
import locationService from '../../../service/LocationService';
import {
  notifyResponseError,
  notifySuccess,
} from '../../../lib/common/notifications';
import useCitiesByCountry from '../rackrowbin/useCitiesByCountry';
import useRoomsByOffice from '../rackrowbin/useRoomsByOffice';

export function useRacks(
  roomForm,
  storeForm,
  locationForm,
  countryForm,
  cityForm
) {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const cardTitle = id ? 'Racks Edit' : 'Racks Add';
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [roomModal, setRoomModal] = useState(false);
  const [isRackDisabled, setIsRackDisabled] = useState(true);
  const [store, setStore] = useState([]);
  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [locationModal, setLocationModal] = useState(false);
  const { offices, setOffices, getAllOffices } = useOfficelList();
  const { country, setCountry, getAllCountry } = useCountryList();
  const officeId = Form.useWatch('officeId', form);
  const isRoomDisabled = !officeId;
  const countryId = Form.useWatch('countryId', locationForm);
  const { cities, setCities } = useCitiesByCountry(countryId);
  const { rooms, setRooms } = useRoomsByOffice(officeId);

  const handleCountrySubmit = async (values) => {
    try {
      const { data } = await CountryService.saveCountry(values);
      notifySuccess('Country successfully created');
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

  const handleModelRoomSubmit = async (values) => {
    try {
      const { data } = await roomService.saveRoom({
        ...values,
        officeId: values.officeId,
      });
      roomForm.setFieldsValue({ roomCode: null, roomName: null });
      notifySuccess('Room successfully created');
      const roomId = data.id;
      const newRoom = {
        roomName: values.roomName,
        roomCode: values.roomCode,
        officeId: values.officeId,
        roomId,
      };
      console.log('new room=====>', newRoom);
      setRooms((prevState) => [newRoom, ...prevState]);
      form.setFieldsValue({
        ...values,
        roomId: roomId,
        roomName: values.roomName,
      });
      setRoomModal(false);
      setIsRackDisabled(false);
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const handleOfficeSubmit = async (values) => {
    try {
      const { data } = await officeService.saveStore({
        ...values,
        locationId: values.locationId.value,
      });
      notifySuccess('Store successfully created');
      const id = data.id;
      const newModel = {
        code: values.code,
        id,
      };
      setOffices((prevState) => [newModel, ...prevState]);
      form.setFieldsValue({ ...values, officeId: id, roomId: null });
      setShowModal(false);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const handleRoomReset = async (values) => {};
  const getRackById = async (id) => {
    try {
      const { data } = await rackService.singleRack(id);
      form.setFieldsValue({
        ...data,
        roomId: data.roomId,
        roomName: data.roomName,
      });
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const submitRack = async (values) => {
    await rackService
      .SaveRack(values)
      .then((response) => {
        if (response.status === 200) {
          notifySuccess('Rack successfully Created');
          form.resetFields();
          navigate(-1);
        }
      })
      .catch((error) => {
        notifyResponseError(error);
      });
  };

  const updateRack = async (id, data) => {
    try {
      await rackService.updateRack(id, data);
      notifySuccess('Rack updated successfully');
      form.resetFields();
      navigate(-1);
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const onReset = async () => {
    if (!id) {
      form.resetFields();
    }
    if (id) {
      await getRackById(id);
    }
  };

  const onFinish = (fieldsValue) => {
    const values = {
      ...fieldsValue,
    };
    id ? updateRack(id, values) : submitRack(values);
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  return {
    offices,
    rooms,
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
    handleModelRoomSubmit,
    handleOfficeSubmit,
    isRoomDisabled,
    roomModal,
    setRoomModal,
    handleRoomReset,
    setIsRackDisabled,
    isRackDisabled,
    store,
    setStore,
    setRooms,
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
    officeId,
    countryId,
    getRackById,
  };
}
