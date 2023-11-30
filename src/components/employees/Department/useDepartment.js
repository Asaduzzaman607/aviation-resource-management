import { Form, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import DepartmentService from '../../../service/employees/DepartmentService';

export function useDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [singleData, setSingleData] = useState({});

  const onFinish = async (data) => {
    console.log('department values: ', data);
    try {
      if (id) {
        await DepartmentService.UpdateDepartment(id, data);
      } else {
        await DepartmentService.SaveDepartment(data);
      }
      form.resetFields();
      navigate('/employees/departments');
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

  const getDepartmentById = async () => {
    try {
      const { data } = await DepartmentService.getDepartmentById(id);
      console.log('get: ', data);
      form.setFieldsValue(data);
      setSingleData(data);
    } catch (err) {
      notification['error']({ message: getErrorMessage(err) });
    }
  };

  useEffect(() => {
    id && getDepartmentById();
  }, [id]);

  return {
    id,
    form,
    onFinish,
    onReset,
  };
}
