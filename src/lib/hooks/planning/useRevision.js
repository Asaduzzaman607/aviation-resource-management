import {useNavigate, useParams} from "react-router-dom";
import {Form} from "antd";
import {useEffect} from "react";
import {notifyResponseError, notifySuccess} from "../../common/notifications";
import RevisionServices from "../../../service/RevisionServices";

export function useRevision() {
    let {id} = useParams();
    const [form] = Form.useForm();
    let navigate = useNavigate();


    const loadSingleData = async () => {
        try {
            const {data} = await RevisionServices.singleRevision(id);

            form.setFieldsValue({
                ...data
            });
        } catch (er) {
            notifyResponseError(er)
        }
    };

    const onFinish = async (values) => {


        if (id) {
            try {

                const modifiedData = {
                    headerKey : 'AMP_HEADER',
                    headerValue : values.headerValue
                }
                const {data} = await RevisionServices.updateRevision(id, modifiedData);
                navigate("/planning/amp-revisions");
                notifySuccess('Revision successfully updated')
            } catch (er) {
                notifyResponseError(er)
            }
        } else {
            try {
                const modifiedData = {
                    headerKey : 'AMP_HEADER',
                    headerValue : values.headerValue
                }
                const {data} = await RevisionServices.saveRevision(modifiedData);

                notifySuccess('Revision successfully created')

                navigate("/planning/amp-revisions");
            } catch (er) {
                notifyResponseError(er)
            }
        }
    };

    const onReset = async () => {
        if (!id) {
            form.resetFields();
        }
        await loadSingleData();
    };

    useEffect(() => {

        if (!id) return
        loadSingleData(id);
    }, [id]);




    return {
        onFinish,
        onReset,
        id,
        form,
    };
}