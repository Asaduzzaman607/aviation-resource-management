import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, notification } from "antd";
import { useOfficelList } from "../room/Room";
import rackService from "../../../service/RackService";
import { getErrorMessage } from "../../../lib/common/helpers";
import rackRowService from "../../../service/RackRowService";
import roomService from "../../../service/RoomService";
import officeService from "../../../service/OfficeService";
import { useCountryList } from "../../configaration/base/useCity";
import cityService from "../../../service/CityService";
import CountryService from "../../../service/CountryService";
import locationService from "../../../service/LocationService";
import useCitiesByCountry from "../rackrowbin/useCitiesByCountry";
import useRoomsByOffice from "../rackrowbin/useRoomsByOffice";
import useRacksByRoom from "../rackrowbin/useRacksByRoom";

export function useRackRow(
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
  const cardTitle = id ? "RackRow Edit" : "RackRow Add";
  const { offices, setOffices, getAllOffices } = useOfficelList();
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [rackModal, setRackModal] = useState(false);
  const [roomModal, setRoomModal] = useState(false);

  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [countryVal, setCountryVal] = useState("");
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [locationModal, setLocationModal] = useState(false);

  const { country, setCountry, getAllCountry } = useCountryList();
  const officeId = Form.useWatch("officeId", form);
  const isRoomDisabled = !officeId;

  const roomId = Form.useWatch("roomId", form);
  const isRackDisabled = !roomId;

  const rackId = Form.useWatch("rackId", form);
  const isRackRowDisabled = !rackId;

  const countryId = Form.useWatch("countryId", locationForm);
  const { cities, setCities } = useCitiesByCountry(countryId);
  const { rooms, setRooms } = useRoomsByOffice(officeId);
  const { racks, setRacks } = useRacksByRoom(roomId);

  const handleCountrySubmit = async (values) => {
    try {
      const { data } = await CountryService.saveCountry(values);
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
      setCountryVal(id);
      locationForm.setFieldsValue({
        countryId: id,
        prefix: values.dialingCode,
      });
      cityForm.setFieldsValue({ countryId: id });
      countryForm.resetFields();
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const handleCitySubmit = async (values) => {
    try {
      const { data } = await cityService.saveCity(values);
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
      locationForm.setFieldsValue({ cityId: id, countryId: values.countryId });
      cityForm.resetFields();
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const handleLocationSubmit = async (values) => {
    try {
      const { data } = await locationService.saveLocation(values);
      notification["success"]({
        message: "Location successfully created",
      });
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
      console.log("Error Occurred");

      notification["error"]({ message: getErrorMessage(er) });
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

      notification["success"]({
        message: "rack successfully created",
      });

      const rackId = data.id;

      const newRack = {
        ...values,
        rackId,
      };
      console.log("new racks=====>", newRack);
      setRacks((prevState) => [newRack, ...prevState]);
      form.setFieldsValue({ rackId: rackId, rackCode: values.rackCode });
      setRackModal(false);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const handleModelRoomSubmit = async (values) => {
    try {
      const { data } = await roomService.saveRoom(values);
      // roomForm.resetFields()
      roomForm.setFieldsValue({ roomId: null, roomName: null, roomCode: null });
      notification["success"]({
        message: "room successfully created",
      });
      const roomId = data.id;
      const newRoom = {
        roomName: values.roomName,
        roomCode: values.roomCode,
        officeCode: values.officeCode,
        officeId: values.officeId,
        ...values,
        roomId,
      };
      console.log("new room=====>", newRoom);
      setRooms((prevState) => [newRoom, ...prevState]);
      form.setFieldsValue({
        roomId: roomId,
        roomName: values.roomName,
        rackId: null,
      });
      setRoomModal(false);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const handleOfficeSubmit = async (values) => {
    try {
      const { data } = await officeService.saveStore({
        ...values,
        locationId: values.locationId.value,
      });
      notification["success"]({
        message: "Store successfully created",
      });

      const id = data.id;
      const newModel = {
        code: values.code,
        id,
      };

      setOffices((prevState) => [newModel, ...prevState]);
      form.setFieldsValue({ officeId: id, roomId: null, rackId: null });
      setShowModal(false);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const getRackRowById = async (id) => {
    try {
      const { data } = await rackRowService.singleRackRow(id);
      form.setFieldsValue({
        ...data,
        officeId: data.officeId,
        rackId: data.rackId,
        roomId: data.roomId,
        roomName: data.roomName,
      });
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  const submitRackRow = async (values) => {
    await rackRowService
      .SaveRackRow(values)
      .then((response) => {
        if (response.status === 200) {
          notification["success"]({
            message: "Successfully Created",
          });
          form.resetFields();
          navigate(-1);
          // dispatch(getRackList(true))
        }
      })
      .catch((error) => {
        notification["error"]({
          message: error.response.data.apiErrors[0].message,
        });
        console.log("something went wrong", error);
      });
  };

  const updateRackRow = async (id, data) => {
    try {
      await rackRowService.updateRackRow(id, data);
      notification["success"]({
        message: "RackRow updated successfully",
      });
      form.resetFields();
      navigate(-1);
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  const onReset = () => {
    if (id) {
      getRackRowById(id);
    } else {
      form.resetFields();
    }
  };

  const onFinish = (fieldsValue) => {
    const values = {
      ...fieldsValue,
    };
    console.log("RackView values", values);
    id ? updateRackRow(id, values) : submitRackRow(values);
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
    setRacks,
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
    getAllOffices,
    getAllCountry,
    officeId,
    roomId,
    rackId,
    countryId,
    getRackRowById,
  };
}
