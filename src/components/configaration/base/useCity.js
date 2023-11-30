import {useState,useCallback, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Form, notification} from "antd";
import {getErrorMessage} from "../../../lib/common/helpers";
import countryService from "../../../service/CountryService";
import CountryService from "../../../service/CountryService";
import cityService from "../../../service/CityService";
import {notifyResponseError} from "../../../lib/common/notifications";


export function useCountryList() {
  const [country, setCountry] = useState([]);
  const getAllCountry = useCallback(async () => {
    try {
      const {data} = await countryService.getAllCountry(1000, {
        isActive: true,
      });
      setCountry(data.model);

    } catch (error) {
      notifyResponseError(error)
    }
  }, []);


  return {
    country,
    setCountry,
    getAllCountry
  };
}

export function useCity(countryFrom){
  const [city,setCity]=useState([]);
  const {id}=useParams();
  const [ form ] =Form.useForm();
  const navigate=useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { country, setCountry, getAllCountry } = useCountryList();



  const handleModelSubmit = async (values) => {
    console.log('Vaues >>>>>>>',values)
    try {
      const { data } = await CountryService.saveCountry(values);
      console.log('========DATA===============>>>>>>>',data)
      notification["success"]({
        message: "Store successfully created",
      });
      setShowModal(false);
      const id = data.id;
      const newModel = {
        code: values.code,
        name:values.name,
        dialingCode:values.dialingCode,
        id,
      };
      setCountry((prevState) => [newModel, ...prevState]);
      console.log("===========>", country)
      form.setFieldsValue({countryId: id});
      countryFrom.resetFields()

    } catch (er) {console.log("Error Occurred")

      notification["error"]({ message: getErrorMessage(er) });
    }
  };


  const getCityById = async (id) => {
     console.log("ID",id)

    try {
      const { data } = await cityService.getCityById(id);
      console.log("DATA: ",data)
      form.setFieldsValue({
        ...data,
      });
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  const submitCity = async (values) => {
    console.log("")
    await cityService.saveCity(values)
      .then((response) => {
        if (response.status === 200) {

          notification["success"]({
            message: "Successfully Created",
          });

          form.resetFields();
          navigate(-1)
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

  const updateCity = async (id, data) => {
    try {
      await cityService.updateCity(id, data);
      notification["success"]({
        message: "Room updated successfully",
      });
      form.resetFields();
      navigate(-1);
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  const onReset = () => {
    if (!id) {
      form.resetFields();
      return;
    }
    getCityById(id);
  };

  const onFinish = (fieldsValue) => {

    const values = {
      ...fieldsValue,
    };
    id ? updateCity(id, values) : submitCity(values);
    form.resetFields();
  };

  return{
    id,
    form,
    navigate,
    showModal,
    setShowModal,
    onReset,
    onFinish,
    handleModelSubmit,
    city,
    setCity,
    country,
    setCountry,
    getCityById,
    getAllCountry
  };

}