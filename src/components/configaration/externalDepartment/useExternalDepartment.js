import { Form, notification } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useARMFileUpload } from '../../../lib/common/ARMFileUpload';
import { getErrorMessage } from '../../../lib/common/helpers';
import {
  notifyResponseError,
  notifySuccess,
} from '../../../lib/common/notifications';
import cityService from '../../../service/CityService';
import CountryService from '../../../service/CountryService';
import ExternalDepartmentService from '../../../service/ExternalDepartmentService';
import useCitiesByCountry from '../../store/rackrowbin/useCitiesByCountry';
import { useCountryList } from '../base/useCity';

const UseExternalDepartment = (countryFrom, cityForm) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [singleExternal, setSingleExternal] = useState();
  let { id } = useParams();
  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { country, setCountry, getAllCountry } = useCountryList();
  const countryId = Form.useWatch('countryId', form);
  const { cities, setCities } = useCitiesByCountry(countryId);
  const [attachmentList, setAttachmentList] = useState([]);
  const { handleFileInput, selectedFile, setSelectedFile, handleFilesUpload, fileProcessForEdit } =
    useARMFileUpload();

  const stringToMomentDate = (dateString) => {
    if (!dateString) return null;
    return moment(dateString);
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
      form.setFieldsValue({ countryId: id });
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
      form.setFieldsValue({
        cityId: id,
        countryId: values.countryId,
        name: values.name,
      });
      cityForm.resetFields();
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  //Save and Update External Company
  const onFinish = async (values) => {
    //file uploading to s3
    const files = await handleFilesUpload('external-department', selectedFile);

    const modifiedData = {
      ...values,
      validTill: values['validTill'].format('YYYY-MM-DD'),
      attachments: files,
    };

    try {
      if (id) {
        await ExternalDepartmentService.updateExternal(id, modifiedData);
      } else {
        await ExternalDepartmentService.SaveExternal(modifiedData);
      }
      form.resetFields();
      navigate(-1);
      notifySuccess(id ? 'Updated Successfully' : 'Saved Succesfully');
    } catch (error) {
      notifyResponseError(error);
    }
  };

  //Loading single company for showing data in edit filed
  const loadSingleExternalDept = async () => {
    try {
      setLoading(true);
      const { data } = await ExternalDepartmentService.singleExternal(id);

      const modifiedValue = {
        ...data,
        validTill: stringToMomentDate(data.validTill),
      };

      let fileList = [];

      if (data.attachments != null) {
        fileList = fileProcessForEdit(data?.attachments);
      }

      setAttachmentList(fileList);
      setSelectedFile(fileList);

      form.setFieldsValue({ ...modifiedValue });
      setSingleExternal({ ...modifiedValue });
    } catch (er) {
      notifyResponseError(er);
    } finally {
      setLoading(false);
    }
  };

  //Reset The form
  const onReset = () => {
    if (id) {
      form.setFieldsValue({ ...singleExternal });
    } else {
      form.resetFields();
    }
  };

  //Render Single company Details if ID
  useEffect(() => {
    if (!id) return form.resetFields();
    loadSingleExternalDept();
  }, [id]);

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
    getAllCountry,
    countryId,
    handleFileInput,
    attachmentList,
    loading,
  };
};
export default UseExternalDepartment;
