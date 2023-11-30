import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Form, notification} from "antd";
import {getErrorMessage} from "../../../lib/common/helpers";
import roomService from "../../../service/RoomService";
import currencyService from "../../../service/CurrencyService";

export function UseCurrency() {
  const [currency, setCurrency] = useState([]);
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();


  useEffect(() => {
    (async () => {
      const res = await currencyService.getAllCurrency(true);
      setCurrency(
        res.data.model.map(({ id,description,code }) => ({
          id,
          description:description,
          code:code,

        }))
      );
    })();
  }, []);

  const getCurrencyId = async (id) => {
    try {
      const { data } = await currencyService.singleCurrency(id);
      form.setFieldsValue({
        ...data,
      });
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  const submitCurrency = async (values) => {
    await currencyService.saveCurrency(values)
      .then((response) => {
        if (response.status === 200) {

          notification["success"]({
            message: "Successfully Created",
          });

          form.resetFields();
          navigate(-1)
        }
      })
      .catch((error) => {
        notification["error"]({
          message: error.response.data.apiErrors[0].message,
        });
        console.log("something went wrong", error);
      });
  };

  const updateCurrency = async (id, data) => {
    try {
      await currencyService.updateCurrency(id, data);
      notification["success"]({
        message: "Room updated successfully",
      });
      form.resetFields();
      navigate(-1);
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  const onReset = () => {
    if (id) {
      getCurrencyId(id);
    } else {
      form.resetFields();
    }
  };

  const onFinish = (fieldsValue) => {

    const values = {
      ...fieldsValue,
    };
    id ? updateCurrency(id, values) : submitCurrency(values);
    form.resetFields();
  };

  useEffect(() => {
    id && getCurrencyId(id);
  }, [id]);




  return {
    id,
    form,
    navigate,
    onReset,
    onFinish,
    currency,
    setCurrency
  };
}