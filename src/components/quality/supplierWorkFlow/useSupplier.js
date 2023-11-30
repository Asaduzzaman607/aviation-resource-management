import React,{useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Form, notification, Select} from "antd";
import moment from "moment";
import SupplierService from "../../../service/SupplierService";
import {getErrorMessage} from "../../../lib/common/helpers";
import VendorCapabilitiesLogService from "../../../service/configuration/VendorCapabilitiesLogService";
import VendorCapabilitiesService from "../../../service/configuration/VendorCapabilitiesService";
import CountryService from "../../../service/CountryService";
import {useCountryList} from "../../configaration/base/useCity";
import {useCityList} from "../../configaration/location/useLocation";
import cityService from "../../../service/CityService";
import useCitiesByCountry from "../../store/rackrowbin/useCitiesByCountry";
import QualitySupplierService from "../../../service/quality/QualitySupplierService";

const UseSupplier = (countryFrom,cityForm) => {
  const {Option} = Select;
  let scList = []
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const cardTitle = 'Supplier';
  const [isCityDisabled, setIsCityDisabled] = useState(true);
  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [countryOriginName, setCountryOriginName] = useState('');
  const [supplier, setSupplier] = useState([])
  const [capability, setCapability] = useState([]);
  const [upCapability, setUpCapability] = useState([]);
  const [sCapability, setSCapability] = useState([]);

  const {country, setCountry, getAllCountry} = useCountryList()
  const countryId = Form.useWatch('countryId', form);
  const {cities, setCities} = useCitiesByCountry(countryId);


  const stringToMomentDate = dateString => {
    if (!dateString) return '';

    return moment(dateString, 'YYYY-MM-DD')
  }
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
      form.setFieldsValue({countryId: id,prefix:values.dialingCode});
      cityForm.setFieldsValue({countryId: id})
      countryFrom.resetFields();
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
      form.setFieldsValue({cityId:id,countryId:values.countryId});
      cityForm.resetFields()

    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const getSelectedVC = async () => {
    const {data} = await VendorCapabilitiesLogService.getAllVendorCapabilitiesLog(50, {
      isActive: true,
      query: "",
      type: "SUPPLIER"
    })

    console.log("SVC", data.model)
    let t = parseFloat(id)
    data.model?.map((data) => {
      if (data.parentId === t) {
        data.logStatus.map((list) => {
          if (list.status === true) {
            scList.push(
              list.vendorCapabilityId
            )
          }
        })
        setSCapability(data.logStatus)
      }
    })
  }

  const getSupplierById = async (id) => {
    try {
      const {data} = await QualitySupplierService.getSupplierById(id);
      const modifiedValue = {
        ...data,
        countryId: data.city.countryId,
        countryOriginId: data.countryOrigin?.id,
        prefix: data.officePhone?data.officePhone.slice(0, 4):"",
        officePhone: data.officePhone?data.officePhone.slice(4):"",
        cityId: data.city.id,
        validTill: stringToMomentDate(data.validTill),
        vendorCapabilityLogRequestDtoList: scList
      }
      console.log("setform data", modifiedValue)
      setUpCapability(scList)
      scList = []
      form.setFieldsValue({
        ...modifiedValue
      });
      setSupplier(modifiedValue)
      //setCountryOriginName(data.countryOrigin.name)
      if (form.getFieldValue('countryId') != '') {
        setIsCityDisabled(false);
      } else {
        setIsCityDisabled(true);
      }

    } catch (error) {
      console.log('edit error: ', error);
      notification['error']({message: getErrorMessage(error)});
    }
  };

  const updateSupplier = async (id, data) => {
    try {

      await QualitySupplierService.updateSupplier(id, data);
      navigate('/quality/pending-suppliers');
      notification['success']({message: 'Supplier updated successfully'});
      form.resetFields();
    } catch (error) {
      console.log('configurations update error: ', error);
      notification['error']({message: getErrorMessage(error)});
    }
  };

  const onFinish = (values) => {
    console.log('Dialing code is correct ? = ', values);
    let dto = []
    if (id) {
      values.vendorCapabilityLogRequestDtoList?.map((data) => {
        sCapability?.map((list) => {
          if (data === list.vendorCapabilityId) {
            dto.push({
              id: list.id,
              vendorCapabilityId: data,
              status: true
            })
          }
        })
        dto.map((p) => {
          if (data != p.vendorCapabilityId) {
            dto.push({
              vendorCapabilityId: data,
              status: true
            })
          }
        })

      })
      const missmatch = upCapability.filter(element => !values.vendorCapabilityLogRequestDtoList.includes(element))
      console.log("list", missmatch);
      missmatch?.map((data) => {
        sCapability?.map((list) => {
          if (data === list.vendorCapabilityId) {
            dto.push({
              id: list.id,
              vendorCapabilityId: data,
              status: false
            })
          }
        })
      })
    } else {
      dto = values.vendorCapabilityLogRequestDtoList?.map((data) => ({
        vendorCapabilityId: data,
        status: true
      }))
    }

    const modifiedData = {
      ...values,
      validTill: values['validTill'].format('YYYY-MM-DD'),
      officePhone:values.prefix+values.officePhone,
      vendorCapabilityLogRequestDtoList: dto
    }
    console.log("Manu", modifiedData);

    updateSupplier(id, modifiedData)


  };

  const onReset = () => {
    id ? form.setFieldsValue({...supplier}) : form.resetFields();
  };

  useEffect(() => {
    // form.setFieldsValue({countryId: ''});
    id && getSelectedVC().catch(console.error());
    id && getSupplierById(id);
  }, [id]);


  const getCapabilities = async () => {
    const {data} = await VendorCapabilitiesService.getAllVendorCapabilitiesService(50, {
      query: '',
      isActive: true,
    })
    console.log("Capabilities", data.model)
    setCapability(data.model)
  }

  useEffect(() => {
    getCapabilities().catch(console.error)

  }, [])
  const handleCountryChange = async (value) => {
    try {
      const {data} = await CountryService.getCountryById(value);
      setCities(data.cities);
      let {dataa} =id ? "" : form.setFieldsValue({

        prefix: data.dialingCode,

      });
      console.log('all cities by corresponding basePlant = ', data);
    } catch (error) {
    }
    console.log('selected basePlant = ', value);
    const disable = value === undefined ? true : false;
    setIsCityDisabled(disable);
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



  return {
    cardTitle,
    onReset,
    onFinish,
    isCityDisabled,
    setIsCityDisabled,
    cities,
    setCities,
    setCountry,
    countryOriginName,
    form,
    setCountryOriginName,
    capability,
    id,
    setCountryModal,
    countryModal,
    handleCountrySubmit,
    setCityModal,
    cityModal,
    handleCitySubmit,
    country,
    dialingCodes,
    handleCountryChange,
    getAllCountry,
    countryId
  }
};

export default UseSupplier;