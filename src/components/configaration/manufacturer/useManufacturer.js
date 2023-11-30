import { Form, notification, Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useARMFileUpload } from '../../../lib/common/ARMFileUpload';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyResponseError } from '../../../lib/common/notifications';
import cityService from '../../../service/CityService';
import VendorCapabilitiesService from '../../../service/configuration/VendorCapabilitiesService';
import CountryService from '../../../service/CountryService';
import ManufacturerService from '../../../service/ManufacturerService';
import useCitiesByCountry from '../../store/rackrowbin/useCitiesByCountry';
import { useCountryList } from '../base/useCity';
import { capabilityStatus, prepareVendorCapabilities } from '../../../lib/common/manufacturerSupplierUtils';

const UseManufacturer = (countryFrom, cityForm) => {
  const { Option } = Select;
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const cardTitle = 'Manufacturer';
  const [isCityDisabled, setIsCityDisabled] = useState(true);
  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [countryOriginName, setCountryOriginName] = useState('');
  const [manufacturer, setManufacturer] = useState([]);
  const [capability, setCapability] = useState([]);
  const [checkedCapabilities, setCheckedCapabilities] = useState([]);
  const { country, setCountry, getAllCountry } = useCountryList();
  const countryId = Form.useWatch('countryId', form);
  const { cities, setCities } = useCitiesByCountry(countryId);
  const [loading, setLoading] = useState(false);
  const [attachmentList, setAttachmentList] = useState([]);
  const { handleFileInput, selectedFile, setSelectedFile, handleFilesUpload, fileProcessForEdit } =
    useARMFileUpload();

  const stringToMomentDate = (dateString) => {
    if (!dateString) return '';
    return moment(dateString, 'YYYY-MM-DD');
  };

  const handleCountrySubmit = async (values) => {
    try {
      const { data } = await CountryService.saveCountry(values);
      notification['success']({
        message: 'Store successfully created',
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
      form.setFieldsValue({ countryId: id, prefix: values.dialingCode });
      cityForm.setFieldsValue({ countryId: id });
      countryFrom.resetFields();
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const handleCitySubmit = async (values) => {
    try {
      const { data } = await cityService.saveCity(values);
      notification['success']({
        message: 'Store successfully created',
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
      form.setFieldsValue({ cityId: id, countryId: values.countryId });
      cityForm.resetFields();
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const dialingCodes = (
    <Form.Item
      name="prefix"
      noStyle
    >
      <Select
        style={{
          width: 80,
        }}
      >
        {country?.map((country) => {
          return (
            <Option
              key={country.dialingCode}
              value={country.dialingCode}
            >
              {country.dialingCode}
            </Option>
          );
        })}
      </Select>
    </Form.Item>
  );

  const savaManufacturer = async (data) => {
    console.log("cdd",data)
    //file uploading to s3
    const files = await handleFilesUpload('Manufacturer', selectedFile);

    try {
      await ManufacturerService.saveManufacturer({...data, attachments: files});
      navigate('/configurations/pending-manufacturers');
      notification['success']({ message: 'Manufacturer Create successfully' });
      form.resetFields();
    } catch (error) {
      console.log('configurations save error: ', error);
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  const updateManufacturer = async (id, data) => {

    //file uploading to s3
    const files = await handleFilesUpload('Manufacturer', selectedFile);

    try {
      await ManufacturerService.updateManufacturer(id, {...data, attachments: files});
      navigate('/configurations/pending-manufacturers');
      notification['success']({ message: 'Manufacturer updated successfully' });
      form.resetFields();
    } catch (error) {
      console.log('configurations update error: ', error);
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  const getManufacturerById = async (id) => {
    try {
      setLoading(true);
      const { data } = await ManufacturerService.getManufacturerById(id);
      // console.log('manubyid', data);
      const modifiedValue = {
        ...data,
        countryId: data.city.countryId,
        countryOriginId: data.countryOrigin?.id,
        prefix: data.officePhone ? data.officePhone.slice(0, 4) : '',
        officePhone: data.officePhone ? data.officePhone.slice(4) : '',
        cityId: data.city.id,
        vendorCapabilityLogRequestDtoList: data.vendorCapabilityResponseDtoList?.map((v) => v.vendorCapabilityId),
        clientList: data.clientList?.map(client => client.clientListId),
      };

      let fileList = []

      if (data.attachments != null) {
        fileList = fileProcessForEdit(data?.attachments);
      }
      setAttachmentList(fileList);
      setSelectedFile(fileList)

      setCheckedCapabilities(data?.vendorCapabilityResponseDtoList || []);
    //  console.log('setform data', modifiedValue);
      form.setFieldsValue({
        ...modifiedValue,
      });
      setManufacturer(modifiedValue);
    } catch (error) {
      console.log({error});
      notifyResponseError(error)
    } finally {
      setLoading(false)
    }
  };

  const onFinish = (values) => {
    const capabilities = prepareVendorCapabilities(id, values, checkedCapabilities);
    const modifiedData = {
      ...values,
      officePhone: values.prefix + values.officePhone,
      vendorCapabilityLogRequestDtoList: capabilities,
    };

    if (capabilityStatus(capabilities)) {
      id ? updateManufacturer(id, modifiedData) : savaManufacturer(modifiedData)
    } else {
      notification['error']({ message: 'Please select at least one capability' });
    }
  };

  const onReset = () => {
    id ? form.setFieldsValue({ ...manufacturer }) : form.resetFields();
  };

  const getCapabilities = async () => {
    const { data } =
      await VendorCapabilitiesService.getAllVendorCapabilitiesService(50, {
        query: '',
        isActive: true,
      });
    console.log('Capabilities', data.model);
    setCapability(data.model);
  };

  const handleCountryChange = async (value) => {
    try {
      const { data } = await CountryService.getCountryById(value);
      setCities(data.cities);
      let { dataa } = id
        ? ''
        : form.setFieldsValue({
            prefix: data.dialingCode,
          });
      console.log('all cities by corresponding basePlant = ', data);
    } catch (error) {}
    const disable = value === undefined;
    setIsCityDisabled(disable);
  };

  useEffect(() => {
    getCapabilities().catch(console.error);
  }, []);

  useEffect(() => {
    id && getManufacturerById(id);
  }, [id]);

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
    countryId,
    handleFileInput,
    attachmentList,
    loading,
  };
};

export default UseManufacturer;
