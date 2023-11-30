import { Form, notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { removeUser } from '../../../reducers/user.reducers';
import { clearReduxData } from '../../../resetPersist';
import RoleService from '../../../service/RoleService';
import UsersService from '../../../service/UsersService';
import { getErrorMessage } from '../../common/helpers';
import { notifyResponseError, notifySuccess } from '../../common/notifications';
import { resetState } from '../../../reducers/paginate.reducers';

export default function useUsers() {
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { id } = useParams();
  const [roleData, setRoleData] = useState([]);
  const [roleId, setRoleId] = useState('');
  const navigate = useNavigate();
  let dispatch = useDispatch();

  const getSingleUser = useCallback(async () => {
    if (!id) return;

    try {
      const { data: user } = await UsersService.getSingleUser(id);
      const {
        name,
        email,
        login,
        mobile,
        phoneNumber,
        position,
        department,
        section,
        employeeId,
        roleId,
      } = user;
      form.setFieldsValue({
        name,
        email,
        login,
        mobile,
        phoneNumber,
        position,
        department,
        section,
        employeeId,
        roleId,
      });
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    (async () => {
      await getSingleUser();
    })();
  }, []);

  const handleResetPassword = useCallback(async () => {
    try {
      setIsResettingPassword(true);
      await UsersService.resetPassword(id);
      notifySuccess('Password reset successfully');
    } catch (e) {
      notifyResponseError(e);
    } finally {
      setIsResettingPassword(false);
    }
  }, [id]);

  const getAllRole = async () => {
    const { data } = await RoleService.getAllRole();
    setRoleData(data);
  };

  useEffect(() => {
    getAllRole();
  }, []);

  const handleChange = (e) => {
    setRoleId(e);
  };

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (!id) {
      try {
        const { data } = await UsersService.saveUser(values);
        navigate('/configurations/users');
        notification['success']({
          message: 'Successfully added an user',
        });
      } catch (error) {
        notification['error']({
          message: getErrorMessage(error),
        });
      }
    } else {
      try {
        const { data } = await UsersService.updateUser(id, values);
        navigate('/configurations/users');
        notification['success']({
          message: 'Successfully updated an user',
        });
      } catch (error) {
        notification['error']({
          message: getErrorMessage(error),
        });
      }
    }
  };

  const handleLogOut = async () => {
    try {
      await UsersService.logOut();
      clearReduxData();
      dispatch(resetState());
      dispatch(removeUser());
      navigate('/login');
    } catch (e) {
      notification['error']({
        message: getErrorMessage(e),
      });
    }
  };
  const onReset = () => {
    if (!id) {
      form.resetFields();
      return;
    }
    (async () => {
      const { data } = await UsersService.getSingleUser(id);
      form.resetFields();
      form.setFieldsValue({ ...data });
    })();
  };

  return {
    onFinish,
    form,
    id,
    handleChange,
    roleData,
    roleId,
    handleLogOut,
    onReset,
    handleResetPassword,
    isResettingPassword,
  };
}
