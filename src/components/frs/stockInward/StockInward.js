import React, {useEffect, useState} from 'react';
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {
    Breadcrumb,
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    notification,
    Row,
    Select,
    Space,
    Upload
} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMButton from "../../common/buttons/ARMButton";
import ARMForm from "../../../lib/common/ARMForm";
import ShortUniqueId from "short-unique-id";
import {getErrorMessage} from "../../../lib/common/helpers";
import StockInwardService from "../../../service/StockInwardService";
import moment from "moment";
import DebounceSelect from "../../common/DebounceSelect";
import {UploadOutlined} from "@ant-design/icons";
import Loading from "../../store/common/Loading";
import {useARMFileUpload} from "../../../lib/common/ARMFileUpload";
import {notifyError, notifySuccess} from "../../../lib/common/notifications";

const {Option} = Select;


const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};


const StockInward = () => {

    const [form] = Form.useForm();
    const {id} = useParams()
    const [stockInwardItem, setStockInwardItem] = useState({})
    const [downloadLink, setDownloadLink] = useState([]);
    const [loading, setLoading] = useState(false)
    const [filestatus, setFilestatus] = useState(false)
    const {handleFileInput, upload, selectedFile, setSelectedFile, fileProcessForEdit} = useARMFileUpload();
    const navigate = useNavigate()

    useEffect(() => {
        if (!id) {
            //form.resetFields()
            return
        }
        getStockInwardById().catch(console.error)

    }, [id])

    const getStockInwardById = async () => {
        setFilestatus(true)
        try {
            const {data} = await StockInwardService.getStockInwardById(id)

            let fileList = fileProcessForEdit(data?.attachments);
            setSelectedFile(fileList ? fileList : [])
            setDownloadLink(fileList ? fileList : [])
            delete data.attachments
            let modifiedValue = {
                ...data,
                receiveDate: data?.receiveDate ? moment(data.receiveDate) : null,
                arrivalDate: data.arrivalDate ? moment(data.arrivalDate) : null,
                importDate: data.importDate ? moment(data.importDate) : null
            }
            form.setFieldsValue(modifiedValue)

            setStockInwardItem(modifiedValue)
            setFilestatus(false)

        } catch (er) {
            notifyError(getErrorMessage(er));
        }
    }


    // post api call using async await
    const onFinish = async (values) => {
        setLoading(true)
        let fileList = []

        if (selectedFile.length > 0) {
            let length = selectedFile.length
            for (let i = 0; i < length; i++) {
                if (!selectedFile[i].thumbUrl) {
                    let uploadedLink = await upload("stock-inward", selectedFile[i])
                    fileList.push(uploadedLink)
                } else {
                    fileList.push(selectedFile[i].thumbUrl)
                }
            }
        }
        const modifiedValues = {
            ...values,
            receiveDate: values['receiveDate']?.format('YYYY-MM-DD HH:mm:ss'),
            arrivalDate: values['arrivalDate']?.format('YYYY-MM-DD HH:mm:ss'),
            importDate: values['importDate']?.format('YYYY-MM-DD HH:mm:ss'),
            attachments: fileList
        };
        try {
            if (id) {
                await StockInwardService.updateStockInward(id, modifiedValues)
            } else {
                await StockInwardService.saveStockInward(modifiedValues)
            }
            form.resetFields()
            navigate('/frs/stock-inwards')
          notifySuccess(id ? "Successfully updated!" : "Successfully added!");

        } catch (er) {
         notifyError(getErrorMessage(er));
        } finally {
            setLoading(false)
        }
    };

    // handle reset input fields
    const onReset = () => {
        if (id) {
            form.setFieldsValue(stockInwardItem)
        } else {
            form.resetFields();
        }
    }

    return (
        <CommonLayout>

            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to='/frs'>
                            <i className="fa fa-file-certificate"/>&nbsp; FRS
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item><Link to='/frs/stock-inwards'>
                        Stock Inward
                    </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        {id?"edit":"add"}
                    </Breadcrumb.Item>

                </Breadcrumb>
            </ARMBreadCrumbs>

            <ARMCard
                title={
                    getLinkAndTitle('stock inward', '/frs/stock-inwards')
                }
            >
                {
                    !loading ? <ARMForm
                        {...layout}
                        form={form}
                        name="stockInward"
                        onFinish={onFinish}
                        initialValues={{
                            orderNo: 12435
                        }}
                        scrollToFirstError
                    >
                        <Row>
                            <Col sm={20} md={12}>
                                {id ? <Form.Item
                                    name="serialNo"
                                    label="Sl No"
                                    rules={[
                                        {
                                            required: true,
                                            message: "This field is required!"
                                        },
                                    ]}
                                >
                                    <Input disabled style={{backgroundColor: 'white', color: 'black', opacity: '0.8'}}/>
                                </Form.Item> : ''

                                }

                                <Form.Item
                                    name="receiveDate"
                                    label="Received Date"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Received date is required!"
                                        },
                                    ]}
                                >
                                    <DatePicker style={{width: '100%'}} showTime/>
                                </Form.Item>

                                <Form.Item
                                    name="tptMode"
                                    label="TPT Mode"
                                >
                                    <InputNumber style={{width: "100%"}}/>
                                </Form.Item>

                                <Form.Item
                                    name="flightNo"
                                    label="Flight No"
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    name="arrivalDate"
                                    label="Arrival Date"
                                >
                                    <DatePicker style={{width: '100%'}} showTime/>
                                </Form.Item>

                                <Form.Item
                                    name="airwaysBill"
                                    label="Airway Bill"
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    name="invoiceNo"
                                    label="Invoice No"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Invoice No is required!"
                                        },
                                    ]}
                                >
                                    <DebounceSelect
                                        mapper={(v) => ({
                                            label: v.invoiceNo,
                                            value: v.invoiceNo,
                                        })}
                                        showSearch
                                        placeholder="---Select Invoice No.---"
                                        type="multi"
                                        url={`/procurement/own_department/parts-invoice/search?page=1&size=20`}
                                        params={{type: 'APPROVED'}}
                                        disabled={id ? true : false}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="packingMode"
                                    label="Packing Mode"
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    name="packingNo"
                                    label="Packing No"
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    name="weight"
                                    label="Weight"
                                >
                                    <InputNumber style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>

                            <Col sm={20} md={12}>
                                <Form.Item
                                    name="noOfItems"
                                    label="No Of Item"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input no of item",
                                            type: "number"
                                        },
                                    ]}
                                >
                                    <InputNumber type="number" style={{width: '100%'}}/>
                                </Form.Item>

                                <Form.Item
                                    name="description"
                                    label="General Description"
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    name="importNo"
                                    label="Import No"
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    name="importDate"
                                    label="Import Date"
                                >
                                    <DatePicker style={{width: '100%'}} showTime/>
                                </Form.Item>

                                <Form.Item
                                    name="discrepancyReportNo"
                                    label="Discrepancy Report No"
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    name="remarks"
                                    label="Remarks"
                                >
                                    <Input.TextArea/>
                                </Form.Item>
                                <Form.Item
                                    name="receivedBy"
                                    label="Received By"
                                >
                                    <DebounceSelect
                                        mapper={(v) => ({
                                            label: v.name,
                                            value: v.id,
                                        })}
                                        showSearch
                                        placeholder="---Select Received By.---"
                                        type="multi"
                                        url={`/user/search?page=1&size=20`}
                                        disabled={id ? true : false}
                                    />
                                </Form.Item>
                                {
                                    !filestatus &&
                                    <Form.Item
                                        label="Upload"
                                        render
                                    >
                                        <Upload.Dragger
                                            multiple
                                            onChange={handleFileInput}
                                            showUploadList={true}
                                            type="file"
                                            listType="picture"
                                            defaultFileList={[...downloadLink]}
                                            beforeUpload={() => false}
                                        >
                                            <Button icon={<UploadOutlined/>}>Click to upload</Button> &nbsp;
                                        </Upload.Dragger>
                                    </Form.Item>
                                }

                            </Col>
                        </Row>
                        <Row>
                            <Col sm={20} md={10}>
                                <Form.Item wrapperCol={{...layout.wrapperCol, offset: 10}}>
                                    <Space size="small">
                                        <ARMButton type="primary" htmlType="submit">
                                            {id ? 'Update' : 'Submit'}
                                        </ARMButton>
                                        <ARMButton onClick={onReset} type="primary" danger>
                                            Reset
                                        </ARMButton>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </ARMForm> : <Loading/>
                }
            </ARMCard>
        </CommonLayout>
    );
};

export default StockInward;
