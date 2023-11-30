import {
    MinusCircleOutlined,
    PlusOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Upload,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import {useEffect, useState} from 'react';
import {getErrorMessage} from '../../../lib/common/helpers';
import {notifyError} from '../../../lib/common/notifications';
import {formLayout} from '../../../lib/constants/layout';
import API from '../../../service/Api';
import ManufacturerService from '../../../service/ManufacturerService';
import SupplierService from '../../../service/SupplierService';
import ARMButton from '../../common/buttons/ARMButton';
import RibbonCard from '../../common/forms/RibbonCard';
import FormControl from '../../store/common/FormControl';
import SubmitReset from '../../store/common/SubmitReset';
import InnerFieldsPo from './InnerFieldsPo';

const ManualPO = ({
                      poId,
                      form,
                      loading,
                      manualOrNot,
                      attachmentList,
                      handleFileInput,
                      handleChange,
                      vendorList,
                      serial,
                      setSerial,
                      exchangeType,
                      onReset,
                      requisitionId,
                      reqId,
                      cond,
                      setExchangeTypeInput
                  }) => {
    const {Option} = Select;
    const [currencies, setCurrencies] = useState([]);
    const vendorType = Form.useWatch('vendorType', form);

    let feesForm = [
        {
            feeName: '',
            feeCost: null,
            currencyId: null,
        },
    ];

    feesForm = Form.useWatch('vendorQuotationFees', form) || feesForm;

    const getVendorDetails = async (vId) => {
        //const { vendorType, vendorId } = vendorList.find((v) => v.id === vId);
        try {
            let vendorDetails = {};
            if (vendorType === 'MANUFACTURER') {
                const {
                    data: {officePhone, website, address},
                } = await ManufacturerService.getManufacturerById(vId);
                vendorDetails = {officePhone, website, address};
            } else {
                const {
                    data: {officePhone, website, address},
                } = await SupplierService.getSupplierById(vId);
                vendorDetails = {officePhone, website, address};
            }

            form.setFieldsValue({
                vendorAddress: vendorDetails?.address,
                vendorTel: vendorDetails?.officePhone,
                vendorWebsite: vendorDetails?.website,
            });
        } catch (error) {
            notifyError(getErrorMessage(error));
        }
    };

    const clearVendorDetails = () => {
        form.setFieldsValue({
            vendorAddress: null,
            vendorTel: null,
            vendorWebsite: null,
        });
    };

    // const onReset = () => {
    //   form.resetFields();
    // };

    //fetching currencies
    useEffect(() => {
        (async () => {
            try {
                const {
                    data: {model},
                } = await API.get('store/currencies');
                setCurrencies(model);
            } catch (e) {
                notifyError(getErrorMessage(e));
            }
        })();
    }, []);

    return (
        <>
            <RibbonCard ribbonText="VENDOR DETAILS">
                <Row>
                    <Col
                        sm={20}
                        md={10}
                    >
                        <Form.Item
                            name="vendorType"
                            label="Vendor Type"
                            rules={[
                                {
                                    required: true,
                                    message: 'This field is required!',
                                },
                            ]}
                        >
                            <Select
                                disabled={manualOrNot === 'CS'}
                                placeholder="Vendor Type"
                                onChange={handleChange}
                                allowClear
                            >
                                <Option
                                    key={1}
                                    value={'SUPPLIER'}
                                >
                                    SUPPLIER
                                </Option>
                                <Option
                                    key={2}
                                    value={'MANUFACTURER'}
                                >
                                    MANUFACTURER
                                </Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="vendorId"
                            label="Vendor Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'This field is required!',
                                },
                            ]}
                        >
                            <Select
                                disabled={manualOrNot === 'CS'}
                                placeholder="--Select Vendor--"
                                allowClear
                                onChange={(vId) => vId && getVendorDetails(vId)}
                                onClear={() => clearVendorDetails()}
                                showSearch
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {vendorList.map((data) => (
                                    <Option
                                        key={data.vendorId}
                                        value={data.vendorId}
                                    >
                                        {data.vendorName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="vendorAddress"
                            label="Address"
                        >
                            <TextArea rows={5}/>
                        </Form.Item>

                        <Form.Item
                            name="vendorFax"
                            label="Fax"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="vendorTel"
                            label="Tel"
                        >
                            <Input type="tel"/>
                        </Form.Item>

                        <Form.Item
                            name="vendorWebsite"
                            label="Website"
                        >
                            <Input/>
                        </Form.Item>
                    </Col>

                    <Col
                        sm={20}
                        md={10}
                    >
                        <Form.Item
                            name="vendorFrom"
                            label="From"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="vendorEmail"
                            label="Email"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="toAttention"
                            label="Attention"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="toFax"
                            label="To Fax"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="toTel"
                            label="To Tel"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="quotationNo"
                            label="Quotation Number"
                            hidden={!poId}
                        >
                            <Input
                                disabled
                                style={{
                                    backgroundColor: 'white',
                                    color: '#000',
                                    opacity: '0.8',
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="date"
                            label="Quotation Date"
                            rules={[
                                {
                                    required: true,
                                    message: 'This field is required!',
                                },
                            ]}
                        >
                            <DatePicker
                                style={{width: '100%'}}
                                size="medium"
                            />
                        </Form.Item>
                        <Form.Item
                            name="validUntil"
                            label="Quotation Valid Until"
                        >
                            <DatePicker
                                style={{width: '100%'}}
                                size="medium"
                            />
                        </Form.Item>

                        {!loading && (
                            <Form.Item label="Upload">
                                <Upload.Dragger
                                    multiple
                                    onChange={handleFileInput}
                                    showUploadList={true}
                                    type="file"
                                    listType="picture"
                                    defaultFileList={[...attachmentList]}
                                    beforeUpload={() => false}
                                >
                                    <Button icon={<UploadOutlined/>}>Click to upload</Button>{' '}
                                    &nbsp;
                                </Upload.Dragger>
                            </Form.Item>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col sm={20}>
                        <Form.Item
                            wrapperCol={{
                                offset: 0,
                                span: 20,
                            }}
                            labelCol={{
                                offset: 0,
                                span: 4,
                            }}
                            name="termsCondition"
                            label="Terms and Conditions"
                        >
                            <TextArea rows={8}/>
                        </Form.Item>
                        <Form.Item
                            name={'quoteRequestId'}
                            hidden={true}
                        >
                            <Input type={'number'}/>
                        </Form.Item>
                    </Col>
                </Row>
            </RibbonCard>

            <FormControl>
                <RibbonCard ribbonText="ORDER DETAILS">
                    <Form.List name="vendorQuotationDetails">
                        {(fields, {remove}) => (
                            <>
                                {fields?.map(({key, name, ...restField}, index) => {
                                    if (
                                        form.getFieldValue('vendorQuotationDetails')[index]
                                            ?.isActive
                                    )
                                        return (
                                            <Row
                                                key={key}
                                                gutter={[16, {xs: 8, sm: 12, md: 12, lg: 12}]}
                                            >
                                                <InnerFieldsPo
                                                    form={form}
                                                    name={name}
                                                    restField={restField}
                                                    serial={serial}
                                                    setSerial={setSerial}
                                                    index={index}
                                                    currencies={currencies}
                                                    exchangeType={exchangeType[index]}
                                                    id={poId}
                                                    manualOrNot={manualOrNot}
                                                    requisitionId={requisitionId}
                                                    reqId={reqId}
                                                    cond={cond[index]}
                                                    setExchangeTypeInput={setExchangeTypeInput}
                                                />
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={1}
                                                >
                                                    <Button
                                                        danger
                                                        hidden={!!poId}
                                                        onClick={() => {
                                                            form.getFieldValue('vendorQuotationDetails')[
                                                                index
                                                                ].id
                                                                ? form.setFieldsValue(
                                                                    (form.getFieldValue(
                                                                        'vendorQuotationDetails'
                                                                    )[index].isActive = false)
                                                                )
                                                                : remove(index);
                                                            form.setFieldsValue({...form});
                                                        }}
                                                    >
                                                        <MinusCircleOutlined/>
                                                    </Button>
                                                </Col>
                                                <Divider/>
                                            </Row>
                                        );
                                })}
                                <Form.Item wrapperCol={{...formLayout.labelCol}}>
                                    <ARMButton
                                        disabled={manualOrNot === 'CS'}
                                        type="primary"
                                        onClick={() => {
                                            form.setFieldsValue({
                                                vendorQuotationDetails: [
                                                    ...form.getFieldValue('vendorQuotationDetails'),
                                                    {
                                                        isActive: true,
                                                        id: null,
                                                    },
                                                ],
                                            });
                                        }}
                                        icon={<PlusOutlined/>}
                                    >
                                        Add
                                    </ARMButton>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </RibbonCard>
            </FormControl>

            <FormControl>
                <RibbonCard ribbonText="FEES DETAILS">
                    <Form.List name="vendorQuotationFees">
                        {(fields, {remove}) => (
                            <>
                                {fields?.map(({key, name, ...restField}, index) => {
                                    if (
                                        form.getFieldValue('vendorQuotationFees')[index]?.isActive
                                    )
                                        return (
                                            <Row
                                                key={key}
                                                gutter={16}
                                            >
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={6}
                                                >
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'vendorRequestType']}
                                                        hidden={false}
                                                        initialValue={'QUOTATION'}
                                                    >
                                                        <Input
                                                            disabled
                                                            style={{
                                                                backgroundColor: '#fff',
                                                                color: '#000',
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={6}
                                                    className="parent"
                                                >
                                                    <label>
                                                        {!!(
                                                            feesForm[index]?.feeCost ||
                                                            feesForm[index]?.currencyId
                                                        ) && <span style={{color: 'red'}}>*</span>}{' '}
                                                        CIA Fees
                                                    </label>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'feeName']}
                                                        style={{marginBottom: '20px'}}
                                                        rules={[
                                                            {
                                                                required: !!(
                                                                    feesForm[index]?.feeCost ||
                                                                    feesForm[index]?.currencyId
                                                                ),
                                                                message: 'required!',
                                                            },
                                                        ]}
                                                    >
                                                        <Input
                                                            //placeholder="CIA Fees"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={6}
                                                    className="parent"
                                                >
                                                    <label>
                                                        {!!(
                                                            feesForm[index]?.feeName ||
                                                            feesForm[index]?.currencyId
                                                        ) && <span style={{color: 'red'}}>*</span>}{' '}
                                                        Price
                                                    </label>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'feeCost']}
                                                        rules={[
                                                            {
                                                                required: !!(
                                                                    feesForm[index]?.feeName ||
                                                                    feesForm[index]?.currencyId
                                                                ),
                                                                message: 'required!',
                                                            },
                                                        ]}
                                                    >
                                                        <InputNumber
                                                            min={1}
                                                            //placeholder="Price"
                                                            style={{
                                                                backgroundColor: '#fff',
                                                                color: '#000',
                                                                width: '100%',
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={5}
                                                    className="parent"
                                                >
                                                    <label>
                                                        {!!(
                                                            feesForm[index]?.feeName ||
                                                            feesForm[index]?.feeCost
                                                        ) && <span style={{color: 'red'}}>*</span>}{' '}
                                                        Currency
                                                    </label>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'currencyId']}
                                                        rules={[
                                                            {
                                                                required: !!(
                                                                    feesForm[index]?.feeName ||
                                                                    feesForm[index]?.feeCost
                                                                ),
                                                                message: 'required!',
                                                            },
                                                        ]}
                                                    >
                                                        <Select
                                                            allowClear
                                                            showSearch
                                                            //placeholder="--Select Currency--"
                                                            filterOption={(input, option) =>
                                                                option.children
                                                                    .toLowerCase()
                                                                    .includes(input.toLowerCase())
                                                            }
                                                        >
                                                            {currencies?.map((currency) => {
                                                                return (
                                                                    <Select.Option
                                                                        key={currency.id}
                                                                        value={currency.id}
                                                                    >
                                                                        {currency.code}
                                                                    </Select.Option>
                                                                );
                                                            })}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>

                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={1}
                                                >
                                                    <Button
                                                        danger
                                                        onClick={() => {
                                                            form.getFieldValue('vendorQuotationFees')[index]
                                                                .id
                                                                ? form.setFieldsValue(
                                                                    (form.getFieldValue('vendorQuotationFees')[
                                                                        index
                                                                        ].isActive = false)
                                                                )
                                                                : remove(index);
                                                            form.setFieldsValue({...form});
                                                        }}
                                                    >
                                                        <MinusCircleOutlined/>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        );
                                })}
                                <Form.Item wrapperCol={{...formLayout.labelCol}}>
                                    <ARMButton
                                        disabled={manualOrNot === 'CS'}
                                        type="primary"
                                        onClick={() => {
                                            form.setFieldsValue({
                                                ...form,
                                                vendorQuotationFees: [
                                                    ...form.getFieldValue('vendorQuotationFees'),
                                                    {
                                                        isActive: true,
                                                        id: null,
                                                    },
                                                ],
                                            });
                                        }}
                                        icon={<PlusOutlined/>}
                                    >
                                        Add
                                    </ARMButton>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </RibbonCard>
            </FormControl>

            <SubmitReset
                id={poId}
                onReset={onReset}
            />
        </>
    );
};

export default ManualPO;
