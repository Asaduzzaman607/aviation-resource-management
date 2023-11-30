import { Form, notification } from 'antd';
import {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import API from '../../../service/Api';
import {useCountryList} from "../../configaration/base/useCity";
import cityService from "../../../service/CityService";
import CountryService from "../../../service/CountryService";
import locationService from "../../../service/LocationService";
import officeService from "../../../service/OfficeService";
import {useOfficelList} from "../room/Room";
import useCitiesByCountry from "../rackrowbin/useCitiesByCountry";



export function useStockRoom(storeForm,locationForm,countryForm,cityForm) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [singleStockRoom, setSingleStockRoom] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [locationModal, setLocationModal] = useState(false)

  const {offices, setOffices, getAllOffices} = useOfficelList();

  const {country, setCountry, getAllCountry} = useCountryList()
  const officeId = Form.useWatch('officeId', form);

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

      storeForm.setFieldsValue({locationId: {
          value: locationId, label: values.code
        }});
    } catch (er) {
      console.log("Error Occurred")

      notification["error"]({message: getErrorMessage(er)});
    }


  }





  const handleModelSubmit = async (values) => {
    try {
      const { data } = await officeService.saveStore(
        { ...values, locationId: values.locationId.value }
      );
      console.log('=======================>>>>>>>',data)
      notification["success"]({
        message: "Store successfully created",
      });
      setShowModal(false);

      const id = data.id;

      const newModel = {
        code: values.code,
        id,
      };
      setOffices((prevState) => [newModel, ...prevState]);


      form.setFieldsValue({...values,officeId: id, officeCode:values.code });

      console.log('Offices from Room',offices)
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const getStockRoomById = async (id) => {
    try {
      const { data } = await API.get(
        '/store-management/store-stock-rooms/' + id
      );
      form.setFieldsValue(data);
      setSingleStockRoom(data);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };



  const onFinish = async (values) => {
    try {
      if (id) {
        await API.put('/store-management/store-stock-rooms/' + id, values);
      } else {
        await API.post('/store-management/store-stock-rooms', values);
      }
      form.resetFields();
      navigate(-1);
      notification['success']({
        message: id ? 'Successfully updated!' : 'Successfully added!',
      });
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  const onReset = () => {
    id ? form.setFieldsValue(singleStockRoom) : form.resetFields();
  };


  useEffect(() => {
    if (id) {
      (async () => {
        await getStockRoomById(id);
      })();
    }
  }, [id])

  useEffect(() => {
      (async () => {
        await getAllCountry();
        await getAllOffices()
      })();
  }, [])


  return {
    id,
    form,
    onFinish,
    onReset,
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
    showModal, setShowModal,
    handleModelSubmit,
    offices,
    setOffices
  };
}
