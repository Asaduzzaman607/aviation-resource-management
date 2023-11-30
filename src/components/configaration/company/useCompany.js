import React,{useState,useEffect} from 'react';
import CompanyService from "../../../service/CompanyService";
import {Form, notification} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useCountryList} from "../base/useCity";
import {useCityList} from "../location/useLocation";
import cityService from "../../../service/CityService";
import {getErrorMessage} from "../../../lib/common/helpers";
import CountryService from "../../../service/CountryService";
import useCitiesByCountry from "../../store/rackrowbin/useCitiesByCountry";

const UseCompany = (countryFrom,cityForm) => {
  let { id } = useParams();
  const nevigate=useNavigate();
  const [form] = Form.useForm();
  const [singleCompany, setSingleCompany] = useState();
  const {country, setCountry, getAllCountry} = useCountryList()
  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);

  const countryId = Form.useWatch('countryId', form);
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
      form.setFieldsValue({countryId: id});
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
      form.setFieldsValue({cityId:id,countryId:values.countryId, name:values.name});
      cityForm.resetFields()

    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };


  //Submit Form of company
  const onFinish = async (values) => {
    if (id) {
      try {
        await CompanyService.updateCompany(id, values);
        notification["success"]({
          message: "Company successfully updated",
        });
        nevigate(-1)
      } catch (er) {
        notification["error"]({
          message: er.response.data.apiErrors[0].message,
        });
      }
    } else {
      await CompanyService.SaveCompany(values)
        .then((response) => {
          console.log("response.status", response);
          if (response.status === 200) {
            notification["success"]({
              message: "Successfully Created",
            });
            form.resetFields();
          }
          nevigate(-1)
        })
        .catch((error) => {
          notification["error"]({
            message: error.response.data.apiErrors[0].message,
          });
          console.log("something went wrong", error);
        });
    }
  };

  //Single Company Details By ID
  const loadSingleCompany = async () => {
    try {
      const { data } = await CompanyService.singleCompany(id);
      console.log("data", data);
      form.setFieldsValue({
        ...data
      });
      setSingleCompany({ ...data });
    } catch (er) {
      console.log(er);
    }
  };

  //Reset Form
  const onReset = async () => {
    if (id) {
      form.setFieldsValue({ ...singleCompany });
      // await getAllCity(singleCompany.countryId)
    } else {
      form.resetFields()
    }
  };

  //Render Single company Details if ID


  useEffect(() => {
    (async () => {
      await getAllCountry();
      if (!id) return form.resetFields();
      await loadSingleCompany();

    })();
  }, []);


  //Return values
  return {
    onFinish,
    onReset,
    country,
    setCountry,
    cities,
    setCities,
    countryModal,
    setCountryModal,
    cityModal,
    setCityModal,
    id,
    form,
    handleCountrySubmit,
    handleCitySubmit,
    countryId
  }
};

export default UseCompany;