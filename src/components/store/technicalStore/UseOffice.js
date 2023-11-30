import { Form, notification } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import cityService from '../../../service/CityService';
import CountryService from '../../../service/CountryService';
import locationService from '../../../service/LocationService';
import OfficeService from '../../../service/OfficeService';
import useCitiesByCountry from '../rackrowbin/useCitiesByCountry';
import { useCountryList } from '../../configaration/base/useCity';

const UseOffice = (locationForm,countryForm,cityForm) => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [officeFormData, setOfficeFormData] = useState({});
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [reSelectedLocation, setResetSelectedLocation] = useState([]);
  const [locationModal, setLocationModal] = useState(false)


  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);


  const {country, setCountry, getAllCountry} = useCountryList()
  const countryId = Form.useWatch('countryId', locationForm);
  const {cities, setCities} = useCitiesByCountry(countryId);
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
        name:values.name,
        dialingCode:values.dialingCode,
        id,
      };
      setCountry((prevState) => [newModel, ...prevState]);
      locationForm.setFieldsValue({countryId: id,prefix:values.dialingCode});
      cityForm.setFieldsValue({countryId: id})
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
        zipCode:values.zipCode,
        countryId:values.countryId,
        id,
      };
      setCities((prevCity) => [newCityModel, ...prevCity]);
      locationForm.setFieldsValue({cityId:id,countryId:values.countryId});
      cityForm.resetFields()

    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };




  const handleLocationSubmit = async (values) => {

    try {
      const {data} = await locationService.saveLocation(values);
      notification["success"]({
        message: "Location successfully created",
      });
      setLocationModal(false);
      const locationId = data.id;
      setSelectedLocation([{
        value: locationId, label: values.code, LocationId:id,
      },]);

      form.setFieldsValue({locationId: {
          value: locationId, label: values.code
        }});
    } catch (er) {
      console.log("Error Occurred")

      notification["error"]({message: getErrorMessage(er)});
    }


  }


  const saveStore = async (data) => {
    try {
      await OfficeService.saveStore(data);
      notification['success']({message: 'Saved successfully'});
      form.resetFields();
      navigate(-1);
    } catch (error) {
      notification['error']({message: getErrorMessage(error)});
    }
  };

  const getStoreById = async (id) => {
    try {
      const {data} = await OfficeService.getStoreById(id);
      console.log("Data",data)
      form.setFieldsValue({
        ...data, locationId: {
          value: data.locationId, label: data.locationCode,
        },
      });
      setSelectedLocation([{
        value: data.locationId, label: data.locationCode,
      },]);
      setOfficeFormData(data);
      setResetSelectedLocation([{
        value: data.locationId, label: data.locationCode,
      },]);
    } catch (error) {
      notification['error']({message: getErrorMessage(error)});
    }
  };

  const updateStore = async (id, data) => {
    try {
      await OfficeService.updateStore(id, {
        ...data, locationId: data.locationId.value,
      });
      notification['success']({message: 'Updated successfully'});
      form.resetFields();
      navigate(-1);
    } catch (error) {
      notification['error']({message: getErrorMessage(error)});
    }
  };

  const onFinish = (values) => {
    id ? updateStore(id, values) : saveStore({...values, locationId: values.locationId.value});
  };

  const onReset = () => {
    if (id) {
      // setSelectedLocation(reSelectedLocation);
      form.setFieldsValue({
    ...officeFormData,
        locationId:{
          label: officeFormData.locationCode,
          value:officeFormData.locationId
        },
        code:officeFormData.code
      });
       setSelectedLocation(reSelectedLocation);
    } else {
      form.resetFields();
      setSelectedLocation([]);
    }
  };



  return {
    onFinish,
    onReset,
    id,
    form,
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
    getAllCountry,
    countryId,
    getStoreById
  }
};

export default UseOffice;