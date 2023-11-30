import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from 'antd';
import { useOfficelList } from '../room/Room';
import rackService from '../../../service/RackService';
import rackRowService from '../../../service/RackRowService';
import roomService from '../../../service/RoomService';
import officeService from '../../../service/OfficeService';
import rackRowBinService from '../../../service/RackRowBinService';
import { useCountryList } from '../../configaration/base/useCity';
import cityService from '../../../service/CityService';
import CountryService from '../../../service/CountryService';
import locationService from '../../../service/LocationService';
import {
  notifyResponseError,
  notifySuccess,
} from '../../../lib/common/notifications';
import HttpStatus from '../../../lib/constants/http-status';
import useCitiesByCountry from './useCitiesByCountry';
import useRoomsByOffice from './useRoomsByOffice';
import useRacksByRoom from './useRacksByRoom';
import useRackRowByRack from './useRackRowByRack';

export function useRackRowBin(
  rackRowForm,
  rackForm,
  roomForm,
  storeForm,
  locationForm,
  countryForm,
  cityForm
) {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const cardTitle = id ? 'Rack Row Bin Edit' : 'Rack Row Bin Add';
  const { offices, setOffices, getAllOffices } = useOfficelList();
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [rackModal, setRackModal] = useState(false);
  const [rackRowModal, setRackRowModal] = useState(false);
  const [roomModal, setRoomModal] = useState(false);
  const [isRackRowBinDisabled, setIsRackRowBinDisabled] = useState(true);
  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [countryVal, setCountryVal] = useState('');
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [locationModal, setLocationModal] = useState(false);

  const { country, setCountry, getAllCountry } = useCountryList();
  const officeId = Form.useWatch('officeId', form);
  const isRoomDisabled = !officeId;

  const roomId = Form.useWatch('roomId', form);
  const isRackDisabled = !roomId;

  const rackId = Form.useWatch('rackId', form);
  const isRackRowDisabled = !rackId;

  const countryId = Form.useWatch('countryId', locationForm);
  const { cities, setCities } = useCitiesByCountry(countryId);
  const { rooms, setRooms } = useRoomsByOffice(officeId);
  const { racks, setRacks } = useRacksByRoom(roomId);
  const { rackRows, setRackRows } = useRackRowByRack(rackId);

  const handleCountrySubmit = async (values) => {
    try {
      const { data } = await CountryService.saveCountry(values);
      notifySuccess('Store successfully created');
      setCountryModal(false);
      const id = data.id;
      setCountry((prevState) => [
        {
          code: values.code,
          name: values.name,
          dialingCode: values.dialingCode,
          id,
        },
        ...prevState,
      ]);
      setCountryVal(id);
      locationForm.setFieldsValue({
        countryId: id,
        prefix: values.dialingCode,
      });
      cityForm.setFieldsValue({ countryId: id });
      countryForm.resetFields();
    } catch (er) {
      notifyResponseError(er);
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
    } catch (er) {
      notifyResponseError(er);
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
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const handleModelRackRowSubmit = async (values) => {
    try {
      const { data } = await rackRowService.SaveRackRow(values);
      rackForm.setFieldsValue({ rackRowId: null, rackRowCode: null });
      notifySuccess('Rack Row successfully created');

      const rackRowId = data.id;
      setRackRows((prevState) => [
        {
          ...values,
          rackRowId,
        },
        ...prevState,
      ]);
      form.setFieldsValue({
        rackRowId: rackRowId,
        rackRowCode: values.rackRowCode,
      });
      setRackRowModal(false);
      setIsRackRowBinDisabled(false);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const handleModelRackSubmit = async (values) => {
    try {
      const { data } = await rackService.SaveRack({
        ...values,
        officeId: values.officeId,
        roomId: values.roomId,
      });

      rackForm.setFieldsValue({
        rackCode: null,
        rackId: null,
        rackHeight: null,
        rackWidth: null,
      });
      notifySuccess('Rack successfully created');

      const rackId = data.id;
      setRacks((prevState) => [
        {
          ...values,
          rackId,
        },
        ...prevState,
      ]);
      form.setFieldsValue({
        rackId: rackId,
        rackCode: values.rackCode,
        rackRowId: null,
      });
      setRackModal(false);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const handleModelRoomSubmit = async (values) => {
    try {
      const { data } = await roomService.saveRoom(values);
      roomForm.setFieldsValue({ roomId: null, roomName: null, roomCode: null });
      notifySuccess('Room successfully created!');
      const roomId = data.id;
      setRooms((prevState) => [
        {
          roomName: values.roomName,
          roomCode: values.roomCode,
          officeCode: values.code,
          officeId: values.officeId,
          ...values,
          roomId,
        },
        ...prevState,
      ]);
      form.setFieldsValue({
        roomId: roomId,
        roomName: values.roomName,
        rackId: null,
        rackRowId: null,
      });
      setRoomModal(false);
    } catch (er) {
      notifyResponseError(er);
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
      setOffices((prevState) => [
        {
          code: values.code,
          id,
        },
        ...prevState,
      ]);
      form.setFieldsValue({
        officeId: id,
        roomId: null,
        rackId: null,
        rackRowId: null,
      });
      setShowModal(false);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const getRackRowBinById = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const { data } = await rackRowBinService.singleRackRowBin(id);
      form.setFieldsValue(data);
    } catch (error) {
      notifyResponseError(error);
    }
  }, [id]);

  const submitRackRowBin = async (values) => {
    await rackRowBinService
      .SaveRackRowBin(values)
      .then((response) => {
        if (response.status === HttpStatus.OK) {
          notifySuccess('Rack Row Bin Successfully Created');
          form.resetFields();
          navigate(-1);
        }
      })
      .catch((error) => {
        notifyResponseError(error);
      });
  };

  const updateRackRowBin = async (id, data) => {
    try {
      await rackRowBinService.updateRackRowBin(id, data);
      notifySuccess('RackRowBin updated successfully');
      form.resetFields();
      navigate(-1);
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const onReset = async () => {
    if (!id) {
      form.resetFields();
      return;
    }
    await getRackRowBinById(id);
  };

  const onFinish = (fieldsValue) => {
    const values = {
      ...fieldsValue,
    };
    id ? updateRackRowBin(id, values) : submitRackRowBin(values);
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  return {
    racks,
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
    handleModelRackSubmit,
    rackModal,
    setRackModal,
    isRackRowDisabled,
    rooms,
    offices,
    isRackDisabled,
    isRoomDisabled,
    roomModal,
    setRoomModal,
    handleOfficeSubmit,
    handleModelRoomSubmit,
    handleModelRackRowSubmit,
    isRackRowBinDisabled,
    setIsRackRowBinDisabled,
    rackRowModal,
    setRackRowModal,
    rackRows,
    setRackRows,
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
    countryVal,
    cities,
    setCountryVal,
    officeId,
    roomId,
    rackId,
    getAllCountry,
    countryId,
    getRackRowBinById,
    getAllOffices,
  };
}
