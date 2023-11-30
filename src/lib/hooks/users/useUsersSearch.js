import { Form, notification } from "antd";
import { useEffect, useState } from "react";
import RoleService from "../../../service/RoleService";
import UsersService from "../../../service/UsersService";
import { getErrorMessage } from "../../common/helpers";
import { notifyResponseError } from "../../common/notifications";

export function useUsersSearch() {
  const [allUsers, setAllUsers] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [roles,setRoles]=useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    onFinish();
  }, []);


  const getAllRoles = async () =>{
    try{
      const {data} = await RoleService.getAllRole();
      setRoles(data);
    }catch(er){
      notifyResponseError(er);
    }

  }
  useEffect(()=>{
    (async()=>{
      await getAllRoles();
    })();
  },[])

  const getAllUsers = async () => {
    try {
      const { data } = await UsersService.getAllUsers();
      setAllUsers(data);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    onFinish();
  }, [isActive]);
  
  const onFinish = async (values) => {
    console.log({values});
    const searchValue = {
      isActive: isActive,
      login: null,
      name: values ? values.name : null,
      roleId: values ? values.roleId : null,
    };
    try {
      const { data } = await UsersService.searchUsers(searchValue);
      setAllUsers(data.model);
    } catch (error) {
      console.log(error);
    }
  };

  const onActiveStatus = async (values) => {
    try {
      console.log(values);
    } catch (e) {
      console.log(e);
    }
  };

  const handleStatus = async (id, isActive) => {
    try {
      const { data } = await UsersService.toggleStatus(id, isActive);
      await onFinish(isActive);
      notification["success"]({
        message: "Status changed successfully!",
      });
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };
  const onReset = () => {
    form.resetFields();
    getAllUsers();
  };
  return {
    allUsers,
    setAllUsers,
    //getAllUsers,
    onFinish,
    form,
    isActive,
    setIsActive,
    onActiveStatus,
    handleStatus,
    roles,
    onReset
  };
}
