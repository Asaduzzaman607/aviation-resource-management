import { Form, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import SectionService from '../../../service/employees/SectionService';

export function useSection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [singleData, setSingleData] = useState({});

  const onFinish = async (data) => {
    console.log('section values: ', data);

    try {
      if (id) {
        await SectionService.UpdateSection(id, data);
      } else {
        await SectionService.SaveSection(data);
      }
      form.resetFields();
      navigate('/employees/sections');
      notification['success']({
        message: id ? 'Successfully updated!' : 'Successfully added!',
      });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const onReset = () => {
    id ? form.setFieldsValue(singleData) : form.resetFields();
  };

  const getSectionById = async () => {
    try {
      const { data } = await SectionService.getSectionById(id);
      console.log('get: ', data);
      const modValue = {
        ...data,
        departmentId: data.department.id,
      };
      form.setFieldsValue(modValue);
      setSingleData(data);
    } catch (err) {
      notification['error']({ message: getErrorMessage(err) });
    }
  };

  useEffect(() => {
    id && getSectionById();
  }, [id]);

  return {
    id,
    form,
    onFinish,
    onReset,
  };
}
