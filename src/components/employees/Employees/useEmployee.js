import { Form, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import EmployeeService from '../../../service/employees/EmployeeService';

export function useEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);

  const onFinish = async (data) => {
    console.log('section values: ', data);

    try {
      if (id) {
        await EmployeeService.UpdateEmployeeService(id, data);
      } else {
        await EmployeeService.SaveEmployeeService(data);
      }
      form.resetFields();
      navigate('/employees/employee');
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

  const getDesignationById = async () => {
    try {
      setLoading(true);
      const { data } = await EmployeeService.getEmployeeServiceById(id);
      console.log('get: ', data);
      const modValue = {
        ...data,
        sectionId: data.section.id,
        departmentId: data.department.id,
        designationId: data.designation.id,
      };
      form.setFieldsValue(modValue);
      setSingleData(data);
    } catch (err) {
      notification['error']({ message: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    id && getDesignationById();
  }, [id]);

  return {
    id,
    form,
    onFinish,
    onReset,
    loading,
  };
}
