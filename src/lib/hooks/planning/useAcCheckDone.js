import {Form, notification} from "antd";
import {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getErrorMessage} from "../../common/helpers";
import AcCheckDoneServices from "../../../service/acCheckDoneServices";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import moment from "moment/moment";
import {notifyWarning} from "../../common/notifications";

export function useAcCheckDone() {
    const [form] = Form.useForm();
    const [checkDone, setCheckDone] = useState({});
    const {id} = useParams();
    const navigate = useNavigate();

    const checkType =[
        { id:'A',  name:"A" },
        { id:'C',  name:"C" },
        { id:'2Y', name:"2Y"},
        { id:'4Y', name:"4Y"},
        { id:'8Y', name:"8Y"}
    ]



    const singleCheckDone = useCallback(async () => {
        if (id === undefined) return;
        try {
            const {data} = await AcCheckDoneServices.getAcCheckDoneById(id);

            setCheckDone(data);
            form.setFieldsValue({
                ...data,
                aircraftCheckDoneDate: data.aircraftCheckDoneDate ? moment(data.aircraftCheckDoneDate) : null,
                aircraftCheckDoneHour: data?.aircraftCheckDoneHour
                    ?.toFixed(2)
                    .toString()
                    .replace(".", ":"),
            });
        } catch (e) {
            notification["error"]({
                message: getErrorMessage(e),
            });
        }
    }, [id]);


    useEffect(() => {
        (async () => {
            await singleCheckDone();
        })();
    }, [singleCheckDone])


    const onFinish = async (values) => {

        const specialRegex = `^[0-9.:]+$|^$`;
        if (values.aircraftCheckDoneHour && !values.aircraftCheckDoneHour.match(specialRegex)) {
            notifyWarning("Invalid A/C Check Done Hour! Only number is allowed");
            return;
        }
        const ac = values?.aircraftCheckDoneHour;
        const acHour = ac?.toString().replace(":", ".");


        const formattedValues = {
            ...values,
            aircraftCheckDoneDate: DateTimeConverter.momentDateToString(values.aircraftCheckDoneDate),
            aircraftCheckDoneHour: acHour

        }

        try {
            if (id) {
                await AcCheckDoneServices.updateAcCheckDone(id, formattedValues)
            } else {
                let {data} = await AcCheckDoneServices.saveAcCheckDone(formattedValues)

            }

            form.resetFields()
            navigate('/planning/ac-check-done')
            notification["success"]({
                message: id ? "Successfully updated!" : "Successfully added!",
            });

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }

    };


    const onReset = () => {
        if (id) {
            form.setFieldsValue({
                ...checkDone,
                aircraftCheckDoneDate: checkDone.aircraftCheckDoneDate
                    ? moment(checkDone.aircraftCheckDoneDate) : null
            });
        } else {
            form.resetFields();
        }
    }

    return {
        onFinish,
        onReset,
        id,
        checkDone,
        form,
        checkType
    };
}
