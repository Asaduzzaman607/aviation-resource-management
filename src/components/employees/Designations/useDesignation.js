import { Form, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import DesignationService from '../../../service/employees/DesignationService';

export function useDesignation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);

  const [dept, setDept] = useState(null);
  const [section, setSection] = useState(null);

  const onFinish = async (data) => {
    console.log('section values: ', data);

    try {
      if (id) {
        await DesignationService.UpdateDesignation(id, {
          ...data,
          departmentId: data.departmentId.value,
          sectionId: data.sectionId.value,
        });
      } else {
        await DesignationService.SaveDesignation({
          ...data,
          departmentId: data.departmentId.value,
          sectionId: data.sectionId.value,
        });
      }
      form.resetFields();
      navigate('/employees/designations');
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
      //setLoading(true);
      const { data } = await DesignationService.getDesignationById(id);
      console.log('get: ', data);
      const modValue = {
        ...data,
        departmentId: {
          label: data.department.name,
          value: data.department.id,
        },
        sectionId: {
          label: data.section.name,
          value: data.section.id,
        },
      };
      setDept({
        label: data.department.name,
        value: data.department.id,
      });
      setSection({
        label: data.section.name,
        value: data.section.id,
      });
      form.setFieldsValue(modValue);
      setSingleData(data);
    } catch (err) {
      notification['error']({ message: getErrorMessage(err) });
    } finally {
      //setLoading(false);
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
    dept,
    setDept,
    section,
    setSection,
  };
}
