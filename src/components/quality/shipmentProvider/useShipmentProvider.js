import React, {useState,useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Form, notification, Select} from "antd";
import {getErrorMessage} from "../../../lib/common/helpers";
import shipmentService from "../../../service/procurment/ShipmentService";
import moment from "moment";
import CountryService from "../../../service/CountryService";
import {useCountryList} from "../../configaration/base/useCity";
import cityService from "../../../service/CityService";
import useCitiesByCountry from "../../store/rackrowbin/useCitiesByCountry";
import QualityShipmentProviderService from "../../../service/quality/QualityShipmentProviderService";


const {Option} = Select;

const UseShipmentProvider = (countryForm, cityForm) => {
  const {id} = useParams();
  const params = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const cardTitle = "Shipment Provider";
  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [provider, setProvider] = useState([])
  const {country, setCountry, getAllCountry} = useCountryList()
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
        code: values.code, name: values.name, dialingCode: values.dialingCode, id,
      };
      setCountry((prevState) => [newModel, ...prevState]);
      form.setFieldsValue({countryId: id, prefix: values.dialingCode});
      cityForm.setFieldsValue({countryId: id})
      countryForm.resetFields();
    } catch (er) {
      notification["error"]({message: getErrorMessage(er)});
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
        name: values.name, zipCode: values.zipCode, countryId: values.countryId, id,
      };
      setCities((prevCity) => [newCityModel, ...prevCity]);
      form.setFieldsValue({cityId: id, countryId: values.countryId});
      cityForm.resetFields()

    } catch (er) {
      notification["error"]({message: getErrorMessage(er)});
    }
  };


  const getShipmentProviderById = async (id) => {
    try {
      const {data} = await QualityShipmentProviderService.singleShipmentProvider(id);
      console.log("==================>>>>>", data)
      const modifiedValue = {
        ...data, validTill: moment(data.date),
        countryId: data.city.countryId,
        prefix: data.officePhone?.slice(0, 4),
        officePhone: data.officePhone?.slice(4),
        cityId: data.city.id,
      }
      form.setFieldsValue({
        ...modifiedValue
      });
      setProvider(modifiedValue)
    } catch (error) {
      console.log('edit error: ', error);
      notification['error']({message: getErrorMessage(error)});
    }
  };

  const updateShipmentProvider = async (id, data) => {
    console.log("What I send in Update", data)
    try {
      await QualityShipmentProviderService.updateShipmentProvider(id, data);
      navigate(-1);
      notification['success']({message: 'Shipment provider updated successfully'});
      form.resetFields();
    } catch (error) {
      console.log('configurations update error: ', error);
      notification['error']({message: getErrorMessage(error)});
    }
  };

  const dialingCodes = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 80,
        }}
      >
        {country.map((country) => {
          return (
            <Option key={country.dialingCode} value={country.dialingCode}>{country.dialingCode}</Option>
          );
        })}
      </Select>
    </Form.Item>
  );

  const onFinish = (values) => {
  const customvalue={
    ...values,
    officePhone:values.prefix+values.officePhone,
  }
 updateShipmentProvider(id, customvalue)
  };

  const onReset = () => {
    id ? form.setFieldsValue({...provider}) : form.resetFields();
  };


  const handleCountryChange = async (value) => {
    try {
      const {data} = await CountryService.getCountryById(value);
      console.log("Valuestrettreterter",value)
      setCities(data.cities);
      let {dataa} = id ? "" : form.setFieldsValue({
        prefix: data.dialingCode,
      });
    } catch (error) {
    }
  };






  useEffect(() => {
    id && getShipmentProviderById(id)

  }, [id]);

  return {
    onFinish,
    cardTitle,
    onReset,
    dialingCodes,
    handleCountryChange,
    getShipmentProviderById,
    handleCitySubmit,
    handleCountrySubmit,
    cities,
    setCities,
    setCountry,
    country,
    setCityModal,
    cityModal,
    id,
    setCountryModal,
    countryModal,
    form,
    getAllCountry,
    countryId
  }
};

export default UseShipmentProvider;