import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, notification } from 'antd';
import CountryService from '../../../service/CountryService';
import { getErrorMessage } from '../../../lib/common/helpers';

const UseCountry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [country, setCountry] = useState([]);

  const getCountryById = async () => {
    try {
      const { data } = await CountryService.getCountryById(id);
      form.setFieldsValue({ ...data });
      setCountry(data);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const onFinish = async (values) => {
    try {
      if (id) {
        await CountryService.updateCountry(id, values);
      } else {
        let { data } = await CountryService.saveCountry(values);
      }
      form.resetFields();
      navigate('/configurations/base-plant');
      notification['success']({
        message: id
          ? 'Country Update Successfully!'
          : 'Country Created Successfully!',
      });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const onReset = () => {
    id ? form.setFieldsValue({ ...country }) : form.resetFields();
  };

  return {
    onReset,
    onFinish,
    form,
    id,
    getCountryById,
  };
};

export default UseCountry;
