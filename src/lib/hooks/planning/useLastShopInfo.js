import {useEffect, useState} from "react";
import {Form, notification} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {notifyResponseError, notifySuccess, notifyWarning} from "../../common/notifications";
import {getErrorMessage} from "../../common/helpers";
import LastShopInfoServices from "../../../service/LastShopInfoServices";
import moment from "moment/moment";


export function useLastShopInfo() {
    const [aircrafts, setAircrafts] = useState([]);
    const [form] = Form.useForm();
    let {id} = useParams();
    let navigate = useNavigate();

    const loadSingleData = async () => {
        try {
            const {data} = await LastShopInfoServices.getLastShopById(id);
            form.setFieldsValue({
                ...data,
                date: data.date
                    ? moment(data.date)
                    : null,
                tsn: data?.tsn
                    ?.toFixed(2)
                    .toString()
                    .replace(".", ":"),
                tsr: data?.tsr
                    ?.toFixed(2)
                    .toString()
                    .replace(".", ":"),
            });
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    };

    useEffect(() => {
        if (!id) {
            return;
        }
        loadSingleData();
    }, [id]);


    const getAllAircraft = async () => {
        try {
            const {data} = await LastShopInfoServices.getApuAvailableAircraft();
            setAircrafts(data);
        } catch (er) {
            notifyResponseError(er);
        }
    };


    const onFinish = async (values) => {

        const specialRegex = `^[0-9.:]+$|^$`;
        if (values?.tsn && !values?.tsn.match(specialRegex)) {
            notifyWarning("Invalid check hour! Only number is allowed");
            return;
        }
        if (values?.tsr && !values?.tsr.match(specialRegex)) {
            notifyWarning("Invalid check hour! Only number is allowed");
            return;
        }

        const isTsn = values?.tsn;
        const convertedTsn = isTsn?.toString().replace(":", ".");
        const isTsr = values?.tsr;
        const convertedTsr = isTsr?.toString().replace(":", ".");

        const convertedValues = {
            ...values,
            date: values?.date && values["date"].format("YYYY-MM-DD"),
            tsn: convertedTsn || null,
            tsr: convertedTsr || null
        }


        if (id) {
            try {
                const {data} = await LastShopInfoServices.updateLastShop(id, convertedValues);
                navigate("/planning/last-shop-info");
                notifySuccess('Last shop info successfully updated')
            } catch (er) {
                notifyResponseError(er)
            }
        } else {
            try {
                const {data} = await LastShopInfoServices.saveLastShop(convertedValues);

                notifySuccess('Last shop info successfully created')

                navigate("/planning/last-shop-info");
            } catch (er) {
                notifyResponseError(er)
            }
        }
    };


    useEffect(() => {
        (async () => {
            await getAllAircraft();
        })();
    }, []);

    const onReset = async () => {
        if (!id) {
            form.resetFields();
        }
        await loadSingleData();
    };

    return {
        setAircrafts,
        aircrafts,
        onFinish,
        onReset,
        form,
        id,
    };
}
