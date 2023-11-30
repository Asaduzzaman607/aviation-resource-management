import {Form, notification} from 'antd';
import {useEffect, useState} from 'react';
import {getErrorMessage} from '../../../lib/common/helpers';
import API from '../../../service/Api';
import {useNavigate, useParams} from 'react-router-dom';
import {useOfficelList} from "../room/Room";
import {useCountryList} from "../../configaration/base/useCity";
import useCitiesByCountry from "../rackrowbin/useCitiesByCountry";
import useRoomsByOffice from "../rackrowbin/useRoomsByOffice";
import useRacksByRoom from "../rackrowbin/useRacksByRoom";
import useRackRowByRack from "../rackrowbin/useRackRowByRack";
import CountryService from "../../../service/CountryService";
import {notifyError, notifyResponseError, notifySuccess} from "../../../lib/common/notifications";
import cityService from "../../../service/CityService";
import locationService from "../../../service/LocationService";
import rackRowService from "../../../service/RackRowService";
import rackService from "../../../service/RackService";
import roomService from "../../../service/RoomService";
import officeService from "../../../service/OfficeService";
import rackRowBinService from "../../../service/RackRowBinService";
import PartsServices from "../../../service/PartsServices";
import {useListOfAircrafts} from "../../../lib/hooks/planning/aircrafts";

export function useStoreParts(rackRowForm,rackForm,roomForm,storeForm,locationForm,countryForm,cityForm,rackRowBinForm) {
  const {id} = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {offices, setOffices, getAllOffices} = useOfficelList();
  const [rackRowBin, setRackRowBin] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [rackModal, setRackModal] = useState(false);
  const [rackRowModal, setRackRowModal] = useState(false);
  const [roomModal, setRoomModal] = useState(false);
  const [rackRowBinModal, setRackRowBinModal] = useState(false);

  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [countryVal, setCountryVal] = useState('');
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [locationModal, setLocationModal] = useState(false)
  const [availId,setAvailId] = useState(null)
  const [serialId, setSerialId] = useState(null);

  const {country, setCountry, getAllCountry} = useCountryList()
  const officeId = Form.useWatch('officeId', form);
  const isRoomDisabled = !officeId;

  const roomId = Form.useWatch('roomId', form);
  const isRackDisabled = !roomId;

  const rackId = Form.useWatch('rackId', form);
  const isRackRowDisabled = !rackId;

  const rackRowId = Form.useWatch('rackRowId', form)
  const isRackRowBinDisabled = !rackRowId;


  const rackRowBinId = Form.useWatch('rackRowBinId', form)

  const countryId = Form.useWatch('countryId', locationForm);
  const {cities, setCities} = useCitiesByCountry(countryId);
  const {rooms, setRooms} = useRoomsByOffice(officeId);
  const {racks, setRacks} = useRacksByRoom(roomId);
  const {rackRows, setRackRows} = useRackRowByRack(rackId);
  const [isTextAreaHidden, setIsTextAreaHidden] = useState(true);
  const [isRackHidden, setIsRackHidden] = useState(false);
  const [isRackRowHidden, setIsRackRowHidden] = useState(false);
  const [isRackRowBinHidden, setIsRackRowBinHidden] = useState(false);
  const [selectedPart, setSelectedPart] = useState({});
  const [locationTag, setLocationTag] = useState('');
  const [partClassification,setPartClassification] = useState(null)
  const { aircrafts } = useListOfAircrafts();

  const partIdVal = Form.useWatch('partId', form);
  const partId = partIdVal?.value;

  const getPart = async (partId) => {
    if (!partId) {
      return
    }
    try {
      const {data} = await PartsServices.getPartById(partId)
      //console.log({ yusuf: data})
      const { classification } = data;
      setPartClassification(data.classification)
      form.setFieldsValue({unitOfMeasureCode: data.unitOfMeasureCode, partType: classification})
    } catch (er) {
      notification["error"]({message: getErrorMessage(er)});
    }
  }

  const handleCountrySubmit = async (values) => {
    try {
      const {data} = await CountryService.saveCountry(values);
      notifySuccess("Country successfully created")
      setCountryModal(false);
      const id = data.id;
      setCountry((prevState) => [{
        code: values.code, name: values.name, dialingCode: values.dialingCode, id,
      }, ...prevState]);
      setCountryVal(id)
      locationForm.setFieldsValue({countryId: id, prefix: values.dialingCode});
      cityForm.setFieldsValue({countryId: id})
      countryForm.resetFields();
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const handleCitySubmit = async (values) => {
    try {
      const {data} = await cityService.saveCity(values);
      notifySuccess("City successfully created")
      setCityModal(false);
      const id = data.id;
      const newCityModel = {
        name: values.name, zipCode: values.zipCode, countryId: values.countryId, id,
      };
      setCities((prevCity) => [newCityModel, ...prevCity]);
      locationForm.setFieldsValue({cityId: id, countryId: values.countryId});
      cityForm.resetFields()

    } catch (er) {
      notifyResponseError(er);
    }
  };

  const handleLocationSubmit = async (values) => {

    try {
      const {data} = await locationService.saveLocation(values);
      notifySuccess("Location successfully created")
      setLocationModal(false);
      const locationId = data.id;
      setSelectedLocation([{
        value: locationId, label: values.code, LocationId: id,
      },]);

      storeForm.setFieldsValue({
        locationId: {
          value: locationId, label: values.code
        }
      });
    } catch (er) {
      notifyResponseError(er);
    }
  }

  const handleModelRackRowSubmit = async (values) => {
    try {
      const {data} = await rackRowService.SaveRackRow(values);
      rackForm.setFieldsValue({rackRowId: null, rackRowCode: null});
      notifySuccess("Rack Row successfully created")

      const rackRowId = data.id;
      setRackRows((prevState) => [{
        ...values, rackRowId,
      }, ...prevState]);
      form.setFieldsValue({rackRowId: rackRowId, rackRowCode: values.rackRowCode, rackRowBinId: null});
      setRackRowModal(false);
      setIsRackRowBinHidden(false);
      setIsTextAreaHidden(true);
      form.resetFields(['otherLocation']);
      if (locationTag !== 'RACK' || locationTag !== 'ROOM' || locationTag !== 'RACKROWBIN') {
        setLocationTag('RACKROW');
        form.setFieldValue('locationTag', 'RACKROW');
      }

    } catch (er) {
      notifyResponseError(er);
    }
  };

  const handleModelRackRowBinSubmit = async (values) => {
    try {
      const {data} = await rackRowBinService.SaveRackRowBin(values);
      rackRowBinForm.setFieldsValue({rackRowBinId: null, rackRowBinCode: null});
      notifySuccess("Rack Row successfully created")

      const rackRowBinId = data.id;
      setRackRowBin((prevState) => [{
        ...values, rackRowId,
      }, ...prevState]);
      form.setFieldsValue({rackRowBinId: rackRowBinId, rackRowBinCode: values.rackRowBinCode});
      setRackRowBinModal(false);
      setIsRackRowBinHidden(false);
      setIsTextAreaHidden(true);
      form.resetFields(['otherLocation']);
      if (locationTag !== 'RACK' || locationTag !== 'RACKROW' || locationTag !== 'ROOM') {
        setLocationTag('RACKROWBIN');
        form.setFieldValue('locationTag', 'RACKROWBIN');
      }

    } catch (er) {
      notifyResponseError(er);
    }
  };


  const handleModelRackSubmit = async (values) => {
    try {
      const {data} = await rackService.SaveRack({...values, officeId: values.officeId, roomId: values.roomId});

      rackForm.setFieldsValue({rackCode: null, rackId: null, rackHeight: null, rackWidth: null});
      notifySuccess("Rack successfully created")

      const rackId = data.id;
      setRacks((prevState) => [{
        ...values, rackId,
      }, ...prevState])
      form.setFieldsValue({rackId: rackId, rackCode: values.rackCode, rackRowId: null, rackRowBinId: null});
      setRackModal(false);
      setIsRackRowHidden(false);
      setIsRackRowBinHidden(false);
      setIsTextAreaHidden(true);
      form.resetFields(['otherLocation']);
      if (locationTag !== 'ROOM' || locationTag !== 'RACKROW' || locationTag !== 'RACKROWBIN') {
        setLocationTag('RACK');
        form.setFieldValue('locationTag', 'RACK');
      }
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const handleModelRoomSubmit = async (values) => {
    try {
      const {data} = await roomService.saveRoom(values);
      roomForm.setFieldsValue({roomId: null, roomName: null, roomCode: null});
      notifySuccess("Room successfully created!");
      const roomId = data.id;
      setRooms((prevState) => [{
        roomName: values.roomName,
        roomCode: values.roomCode,
        officeCode: values.code,
        officeId: values.officeId, ...values,
        roomId,
      }, ...prevState]);
      form.setFieldsValue({
        roomId: roomId, roomName: values.roomName, rackId: null, rackRowId: null, rackRowBinId: null
      });
      setRoomModal(false);
      setIsRackHidden(false);
      setIsRackRowHidden(false);
      setIsRackRowBinHidden(false);
      setIsTextAreaHidden(true);
      form.resetFields(['otherLocation']);
      if (locationTag !== 'RACK' || locationTag !== 'RACKROW' || locationTag !== 'RACKROWBIN') {
        setLocationTag('ROOM');
        form.setFieldValue('locationTag', 'ROOM');
      }
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const handleOfficeSubmit = async (values) => {
    try {
      const {data} = await officeService.saveStore({...values, locationId: values.locationId.value})
      notifySuccess("Store successfully created")
      const id = data.id;
      setOffices((prevState) => [{
        code: values.code, id,
      }, ...prevState]);
      form.setFieldsValue({officeId: id, roomId: null, rackId: null, rackRowId: null, rackRowBinId: null});
      setShowModal(false);
    } catch (er) {
      notifyResponseError(er)
    }
  };


  const getStorePart = async () => {
    try {
      const {data} = await API.get(`/part-availabilities/${id}`);
      form.setFieldsValue({
          ...data,
          partId: {
            value: data.partId, label: data.partNo,
          },
          storeStockRoomId: {
            label: data.stockRoomCode,
            value: data.storeStockRoomId,
          },
      });
      setSelectedPart({
        value: data.partId, label: data.partNo,
      });
      if (data.locationTag === 'ROOM' && data.otherLocation) {
        setIsRackHidden(true);
        setIsRackRowHidden(true);
        setIsRackRowBinHidden(true);
        setIsTextAreaHidden(false);
      }
      if (data.locationTag === 'RACK' && data.otherLocation) {
        setIsRackRowHidden(true);
        setIsRackRowBinHidden(true);
        setIsTextAreaHidden(false);
      }
      if (data.locationTag === 'RACKROW' && data.otherLocation) {
        setIsRackRowBinHidden(true);
        setIsTextAreaHidden(false);
      }
      if (data.locationTag === 'RACKROWBIN' && data.otherLocation) {
        setIsRackRowBinHidden(false);
        setIsTextAreaHidden(false);
      }
    } catch (er) {
      notification['error']({message: getErrorMessage(er)});
    }
  };


  const getRackRowBins = async () => {
    try {
      const {
        data: {model},
      } = await API.post('/store-management/rack-row-bins/search', {
         query: '',
         isActive: true,
         id: rackRowId
      });
      setRackRowBin(model);
    } catch (er) {
      notification['error']({message: getErrorMessage(er)});
    }
  };


  const onFinish = async (values) => {
    try {
      if (id) {
        await API.put('/part-availabilities/' + id, {
          ...values,
          partId: values.partId.value,
          storeStockRoomId: values?.storeStockRoomId?.value,
          officeId: values.officeId,
          roomId: values.roomId === 0 ? null : values.roomId,
          rackId: values.rackId === 0 ? null : values.rackId,
          rackRowId: values.rackRowId === 0 ? null : values.rackRowId,
          rackRowBinId: values.rackRowBinId === 0 ? null : values.rackRowBinId,
          locationTag: values.locationTag,
        });
      } else {
         const formValues = {
          ...values,
          roomId: values.roomId === 0 ? null : values.roomId,
          rackId: values.rackId === 0 ? null : values.rackId,
          rackRowId: values.rackRowId === 0 ? null : values.rackRowId,
          rackRowBinId: values.rackRowBinId === 0 ? null : values.rackRowBinId,
          partId: values.partId.value,
          storeStockRoomId: values?.storeStockRoomId?.value,
        }
        const {data: {id}} = await API.post('/part-availabilities/', {
          ...formValues,
        });
        console.log({id});
        setAvailId(id)
      }
      //form.resetFields();
      //navigate(-1);
      notification['success']({
        message: id ? 'Successfully updated!' : 'Successfully added!',
      });
    } catch (error) {
      notification['error']({message: getErrorMessage(error)});
    }
  };

  const onReset = () => {
    setIsTextAreaHidden(true);
    setIsRackHidden(false);
    setIsRackRowHidden(false);
    setIsRackRowBinHidden(false);
    setSelectedPart([]);
    form.resetFields();
    id && getStorePart();
  };


  useEffect(() => {
    (async () => {
      if (!rackRowId) {
        return
      }
      await getRackRowBins().catch(console.error)
    })();
  }, [rackRowId]);

  useEffect(() => {
    (async () => {
      if (!id) {
        return
      }
      await getStorePart();
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (!partId) {
        return
      }
      await getPart(partId)
    })();
  }, [partId]);

  useEffect(() => {
    (async () => {
      await getAllOffices()
    })();
  }, []);


  return {
    id,
    form,
    offices,
    rooms,
    racks,
    rackRows,
    onReset,
    onFinish,
    isRoomDisabled,
    isRackDisabled,
    isRackRowDisabled,
    isRackRowBinDisabled,
    isTextAreaHidden,
    setIsTextAreaHidden,
    isRackHidden,
    setIsRackHidden,
    isRackRowHidden,
    setIsRackRowHidden,
    isRackRowBinHidden,
    setIsRackRowBinHidden,
    selectedPart,
    setSelectedPart,
    locationTag,
    setLocationTag,
    showModal,
    setShowModal,
    handleModelRackSubmit,
    rackModal,
    setRackModal,
    roomModal,
    setRoomModal,
    handleOfficeSubmit,
    handleModelRoomSubmit,
    handleModelRackRowSubmit,
    rackRowModal,
    setRackRowModal,
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
    rackRowBin,
    setRackRowBin,
    rackRowBinModal,
    setRackRowBinModal,
    handleModelRackRowBinSubmit,
    rackRowId,
    partId,
    availId,
    partClassification,
    setPartClassification,
    serialId,
    setSerialId,
    aircrafts
  };
}


