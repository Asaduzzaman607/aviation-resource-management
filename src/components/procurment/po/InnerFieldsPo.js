import {
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    notification,
    Select,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import {useEffect, useState} from 'react';
import {getErrorMessage} from '../../../lib/common/helpers';
import API from '../../../service/Api';
import ProqurementRequisitionService from '../../../service/procurment/ProqurementRequisitionService';
import SerialService from '../../../service/store/SerialService';
import DebounceSelect from '../../common/DebounceSelect';
import {conditions} from '../quotation/InnerFieldsQuotation';
import {notifyResponseError} from "../../../lib/common/notifications";

const InnerFieldsPo = ({
                           form,
                           name,
                           restField,
                           serial,
                           setSerial,
                           index,
                           currencies,
                           exchangeType,
                           id,
                           manualOrNot,
                           requisitionId,
                           reqId,
                           cond,
                           setExchangeTypeInput
                       }) => {
    const {Option} = Select;
    const [orderType, setOrderType] = useState(() => (!id ? '' : exchangeType));
    const [part, setPart] = useState([]);
    const [partDataForSerial, setPartForSerial] = useState([]);
    const [condition, setCondition] = useState(id ? cond : '');
    const exchangeTypeValue = Form.useWatch(['vendorQuotationDetails', index, 'exchangeType']);
    const reqField = form.getFieldValue('requisitionId')?.value


    useEffect(() => {
        setOrderType(!id ? '' : exchangeType);
    }, [id, exchangeType]);


  console.log({part})
  console.log({partDataForSerial})
    const getPartById = async (id, index) => {

        try {
            const partData = partDataForSerial?.filter((p) => p.id === id)
            const partData2 = part?.filter((p) => p.partId === id)

            if (orderType === 'REPAIR'   ||
                orderType === 'EXCHANGE_WITH_COST' ||
                orderType === 'FLAT_RATE_EXCHANGE_WITH_NO_BILL_BACK' ||
                orderType === 'FLAT_RATE_EXCHANGE_WITH_BER_LIMIT') {
                let {data} = await SerialService.getAllSerial(500, {
                    partId: id,
                    status: 'UNSERVICEABLE',
                    onlyAvailable: true,
                });
                setSerial(data.model);
            }
            const quotationDetails = form.getFieldValue('vendorQuotationDetails');
            const quotationList = quotationDetails.map((quotation, idx) => {
                if (idx === index) {
                    return {
                        ...quotation,
                        // itemId: partData2?.length>0 ? partData2[0].id : partData[0].id,
                        partDescription: partData2?.length>0 ?  partData2[0].partDescription : partData[0].description,
                        uomId: {
                            label: partData2?.length>0 ? partData2[0].unitMeasurementCode :  partData[0].unitOfMeasureCode,
                            value: partData2?.length>0 ? partData2[0].unitMeasurementId : partData[0].unitOfMeasureId,
                        },
                    };
                } else {
                    return quotation;
                }
            });
            form.setFieldValue('vendorQuotationDetails', quotationList);
        } catch (er) {
            notification['error']({message: getErrorMessage(er)});
        }
    };

    const getAlternatePartById = async () => {
        const quotationDetails = form.getFieldValue('vendorQuotationDetails');
        form.setFieldValue('vendorQuotationDetails', quotationDetails);
    };

    const handleOrderTypeChange = async (value, index) => {
        const quotationDetails = form.getFieldValue('vendorQuotationDetails');
        const quotationList = quotationDetails.map((quotation, idx) => {
            if (idx === index) {
                if (value === '' || value === undefined || value === 'PURCHASE') {
                    setOrderType('');
                    return {
                        ...quotation,
                        repairCost: null,
                        berLimit: null,
                        exchangeFee: null,
                        repairType: null,
                        tso: null,
                        cso: null,
                        tsn: null,
                        csn: null,
                        tsr: null,
                        csr: null,
                        additionalFeeType: null,
                        raiScrapFee: null,
                        loanStartDate: null,
                        loanEndDate: null,
                        loanStatus: null,
                        partSerialId: null,
                    };
                } else if (value === 'EXCHANGE_WITH_COST') {
                    setOrderType(value);
                    return {
                        ...quotation,
                        berLimit: null,
                        repairType: null,
                        tso: null,
                        cso: null,
                        tsn: null,
                        csn: null,
                        tsr: null,
                        csr: null,
                        loanStartDate: null,
                        loanEndDate: null,
                        loanStatus: null,
                    };
                } else if (value === 'REPAIR') {
                    setOrderType(value);
                    return {
                        ...quotation,
                        berLimit: null,
                        loanStartDate: null,
                        loanEndDate: null,
                        loanStatus: null,
                        alternatePartId: {label: '', value: ''},
                    };
                } else if (value === 'LOAN') {
                    setOrderType(value);
                    return {
                        ...quotation,
                        repairCost: null,
                        berLimit: null,
                        exchangeFee: null,
                        repairType: null,
                        tso: null,
                        cso: null,
                        tsn: null,
                        csn: null,
                        tsr: null,
                        csr: null,
                        additionalFeeType: null,
                        raiScrapFee: null,
                        partSerialId: null,
                    };
                } else {
                    setOrderType(value);
                    return {
                        ...quotation,
                        repairType: null,
                        tso: null,
                        cso: null,
                        tsn: null,
                        csn: null,
                        tsr: null,
                        csr: null,
                        loanStartDate: null,
                        loanEndDate: null,
                        loanStatus: null,
                    };
                }
            } else {
                return quotation;
            }
        });
        form.setFieldValue('vendorQuotationDetails', quotationList);
    };

    const getRepairData = async (e, index) => {
        const {data} = await API.get(`/return-store-parts/inspection/${e}`);
        const quotationDetails = form.getFieldValue('vendorQuotationDetails');
        const quotationList = quotationDetails.map((quotation, idx) => {
            if (idx === index) {
                return {
                    ...quotation,
                    tso: data?.tso,
                    cso: data?.cso,
                    tsn: data?.tsn,
                    csn: data?.csn,
                    tsr: data?.tsr,
                    csr: data?.csr,
                    berLimit: null,
                    loanStartDate: null,
                    loanEndDate: null,
                    loanStatus: null,
                };
            } else {
                return quotation;
            }
        });
        form.setFieldValue('vendorQuotationDetails', quotationList);
    };

    useEffect(() => {
        if (manualOrNot === 'CS') return;
        if (!reqId) return;
        (async () => {
            try {
                let {data} = await ProqurementRequisitionService.getRequisitionById(
                    reqId
                );

                setPart(data.requisitionItemViewModels);

            } catch (error) {
                notifyResponseError(error)
            }
        })();
    }, [manualOrNot, reqId, id]);

    useEffect(() => {
        (async () => {
            try {
                let {data} =await API.post(`/part/search?page=1&size=20`, {isActive : true});
                setPartForSerial(data?.model);
            } catch (error) {
                notifyResponseError(error)
            }
        })();
    }, []);



    return (
        <>
            <Col
                xs={24}
                sm={24}
                md={4}
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
                md={4}
                className="parent"
            >
                <label>
                    <span style={{color: 'red'}}>*</span> Exchange Type
                </label>
                <Form.Item
                    {...restField}
                    name={[name, 'exchangeType']}
                    // initialValue={form.getFieldValue('orderType')}
                >
                    <Select
                        //placeholder="Select Exchange Type"
                        onChange={(e) => {
                            handleOrderTypeChange(e, index);
                            setExchangeTypeInput(e)
                        } }
                        allowClear
                    >
                        {reqId || reqField ?
                            <>
                                <Option value={'PURCHASE'}>Purchase</Option>
                                <Option value={'EXCHANGE_WITH_COST'}>Exchange + Cost</Option>
                                <Option value={'FLAT_RATE_EXCHANGE_WITH_NO_BILL_BACK'}>
                                    Flat Rate Exchange With no Bill Back Exchange
                                </Option>
                                <Option value={'FLAT_RATE_EXCHANGE_WITH_BER_LIMIT'}>
                                    Flat Rate Exchange With Ber Limit
                                </Option>
                                <Option value={'REPAIR'}>Repair</Option>
                                <Option value={'LOAN'}>Loan</Option></>

                            :

                            <>
                              <Option value={'EXCHANGE_WITH_COST'}>Exchange + Cost</Option>
                              <Option value={'FLAT_RATE_EXCHANGE_WITH_NO_BILL_BACK'}>
                                Flat Rate Exchange With no Bill Back Exchange
                              </Option>
                              <Option value={'FLAT_RATE_EXCHANGE_WITH_BER_LIMIT'}>
                                Flat Rate Exchange With Ber Limit
                              </Option>
                              <Option value={'REPAIR'}>Repair</Option>
                            </>
                        }
                    </Select>
                </Form.Item>
            </Col>

            <Col
                xs={24}
                sm={24}
                md={4}
                className="parent"
            >
                <label>
                    <span style={{color: 'red'}}>*</span> Select Part
                </label>
                {manualOrNot === 'MANUAL' && (reqId || reqField)? (
                    <Form.Item
                        {...restField}
                        name={[name, 'partId']}
                        rules={[
                            {
                                required: true,
                                message: 'required!',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            onChange={(newValue) => {
                                getPartById(newValue, index);
                            }}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {part?.map((data) => (
                                <Option
                                    key={data.partId}
                                    value={data.partId}
                                >
                                    {data.partNo}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                ) : manualOrNot=== 'MANUAL' && (!reqId || !reqField ) ?
                    <Form.Item
                        {...restField}
                        name={[name, 'partId']}
                        hidden={false}
                    >
                        <DebounceSelect
                            disabled={manualOrNot === 'CS'}
                            mapper={(v) => ({
                                label: v.partNo,
                                value: v.id,
                            })}
                            allowClear
                            searchParam="partNo"
                            showSearch
                            url={`/part/search?page=1&size=20`}
                            selectedValue={
                                form.getFieldValue('vendorQuotationDetails')[index]
                                    ?.partId
                            }
                            // onChange={(newValue) => {
                            //     // getPartById(newValue.value, index);
                            //     getAlternatePartById();
                            // }}

                            onChange={(newValue) => {
                                getPartById(newValue.value, index);
                            }}
                        />
                    </Form.Item>

                    : (
                    <Form.Item
                        {...restField}
                        name={[name, 'partId']}
                        rules={[
                            {
                                required: true,
                                message: 'required!',
                            },
                        ]}
                        hidden={false}
                    >
                        <DebounceSelect
                            disabled={manualOrNot === 'CS'}
                            mapper={(v) => ({
                                label: v.partNo,
                                value: v.id,
                            })}
                            searchParam="partNo"
                            showSearch
                            url={`/part/search?page=1&size=20`}
                            selectedValue={
                                form.getFieldValue('vendorQuotationDetails')[index]?.partId
                            }
                            onChange={(newValue) => {
                                getPartById(newValue.value, index);
                            }}
                        />
                    </Form.Item>
                )}
            </Col>

            {  (exchangeTypeValue === 'PURCHASE' || exchangeTypeValue === 'LOAN') && (
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>Alternate Part</label>

                        <Form.Item
                            {...restField}
                            name={[name, 'alternatePartId']}
                            hidden={false}
                        >
                            <DebounceSelect
                                disabled={manualOrNot === 'CS'}
                                mapper={(v) => ({
                                    label: v.partNo,
                                    value: v.id,
                                })}
                                allowClear
                                searchParam="alternatePartNo"
                                showSearch
                                url={`/part/search?page=1&size=20`}
                                selectedValue={
                                    form.getFieldValue('vendorQuotationDetails')[index]
                                        ?.alternatePartId
                                }
                                onChange={(newValue) => {
                                    // getPartById(newValue.value, index);
                                    getAlternatePartById();
                                }}
                            />
                        </Form.Item>
                    </Col>
                )}
            <Col
                xs={24}
                sm={24}
                md={4}
                className="parent"
            >
                <label>Description</label>
                <Form.Item
                    {...restField}
                    name={[name, 'partDescription']}
                    hidden={false}
                    style={{marginBottom: '20px'}}
                >
                    <TextArea
                        disabled
                        //placeholder="Description"
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
                md={4}
                className="parent"
            >
                <label>UOM</label>
                <Form.Item
                    {...restField}
                    name={[name, 'uomId']}
                    hidden={false}
                >
                    <DebounceSelect
                        mapper={(v) => ({
                            label: v.code,
                            value: v.id,
                        })}
                        showSearch
                        placeholder="---Select UOM---"
                        url={`/store/unit/measurements/search?page=1&size=20`}
                        //CHANGES WILL BE HERE
                        selectedValue={Form.useWatch([
                            'vendorQuotationDetails',
                            index,
                            'uomId',
                        ])}
                    />
                </Form.Item>
            </Col>
            <Col
                xs={24}
                sm={24}
                md={4}
                className="parent"
            >
                <label>
                    <span style={{color: 'red'}}>*</span> Quantity
                </label>
                <Form.Item
                    {...restField}
                    name={[name, 'partQuantity']}
                    rules={[
                        {
                            required: true,
                            message: 'required!',
                        },
                    ]}
                >
                    <InputNumber
                        //placeholder="Quantity"
                        style={{
                            backgroundColor: '#fff',
                            color: '#000',
                            width: '100%',
                        }}
                    />
                </Form.Item>
            </Col>
            {orderType === '' ||
            orderType === 'LOAN' ||
            orderType === 'PURCHASE' ||
            orderType === undefined ? (
                ''
            ) : (
                <>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>Serial No</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'partSerialId']}
                        >
                            <Select
                                //placeholder="Select Serial No"
                                allowClear
                                onChange={(e) => {
                                    if (orderType === 'REPAIR') {
                                        getRepairData(e, index);
                                    }
                                }}
                            >
                                {serial?.map((data) => (
                                    <Option
                                        key={data.id}
                                        value={data.id}
                                    >
                                        {data.serialNo}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </>
            )}
            <Col
                xs={24}
                sm={24}
                md={4}
                className="parent"
            >
                <label>
                    <span style={{color: 'red'}}>*</span> MOQ
                </label>
                <Form.Item
                    {...restField}
                    name={[name, 'moq']}
                    hidden={false}
                    rules={[
                        {
                            required: true,
                            message: 'required!',
                        },
                    ]}
                >
                    <InputNumber
                        min={0}
                        //placeholder="MOQ"
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
                md={4}
                className="parent"
            >
                <label>
                    <span style={{color: 'red'}}>*</span> MOV
                </label>
                <Form.Item
                    {...restField}
                    name={[name, 'mov']}
                    hidden={false}
                    rules={[
                        {
                            required: true,
                            message: 'required!',
                        },
                    ]}
                >
                    <InputNumber
                        min={0}
                        //placeholder="MOV"
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
                md={4}
                className="parent"
            >
                <label>
                    <span style={{color: 'red'}}>*</span> MLV
                </label>
                <Form.Item
                    {...restField}
                    name={[name, 'mlv']}
                    hidden={false}
                    rules={[
                        {
                            required: true,
                            message: 'required!',
                        },
                    ]}
                >
                    <InputNumber
                        min={0}
                        //placeholder="MLV"
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
                md={4}
                className="parent"
            >
                <label>
                    <span style={{color: 'red'}}>*</span> Condition
                </label>
                <Form.Item
                    {...restField}
                    name={[name, 'condition']}
                    style={{marginBottom: '35px'}}
                    rules={[
                        {
                            required: true,
                            message: 'required!',
                        },
                    ]}
                >
                    <Select
                        allowClear
                        onChange={(condition) => setCondition(condition)}
                    >
                        {conditions.map((cond) => (
                            <Option value={cond}>{cond}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            {condition === 'Other' && (
                <Col
                    xs={24}
                    sm={24}
                    md={4}
                    className="parent"
                >
                    <label>
                        <span style={{color: 'red'}}>*</span> Other Cond. Desc.
                    </label>
                    <Form.Item
                        {...restField}
                        name={[name, 'other']}
                        style={{marginBottom: '35px'}}
                    >
                        <TextArea/>
                    </Form.Item>
                </Col>
            )}
            <Col
                xs={24}
                sm={24}
                md={4}
                className="parent"
            >
                <label>
                    <span style={{color: 'red'}}>*</span> Lead Time
                </label>
                <Form.Item
                    {...restField}
                    name={[name, 'leadTime']}
                    rules={[
                        {
                            required: true,
                            message: 'required!',
                        },
                    ]}
                >
                    <TextArea
                        //placeholder="LEAD TIME"
                    />
                </Form.Item>
            </Col>
            <Col
                xs={24}
                sm={24}
                md={4}
                className="parent"
            >
                <label>
                    <span style={{color: 'red'}}>*</span> Incoterms
                </label>
                <Form.Item
                    {...restField}
                    name={[name, 'incoterms']}
                    style={{marginBottom: '35px'}}
                    rules={[
                        {
                            required: true,
                            message: 'required!',
                        },
                    ]}
                >
                    <Input
                        //placeholder="INCOTERMS"
                    />
                </Form.Item>
            </Col>
            <Col
                xs={24}
                sm={24}
                md={4}
                className="parent"
            >
                <label>
                    {Form.useWatch(['vendorQuotationDetails', index, 'exchangeType']) !==
                        'REPAIR' && <span style={{color: 'red'}}>*</span>}{' '}
                    Unit Price
                </label>
                <Form.Item
                    {...restField}
                    name={[name, 'unitPrice']}
                    style={{marginBottom: '20px'}}
                    rules={[
                        {
                            required:
                                Form.useWatch([
                                    'vendorQuotationDetails',
                                    index,
                                    'exchangeType',
                                ]) !== 'REPAIR',
                            message: 'required!',
                        },
                        {
                            type: 'number',
                            min: 1,
                            message: 'Price cannot be less than Zero',
                        },
                    ]}
                >
                    <InputNumber
                        min={1}
                        //placeholder="UNIT PRICE"
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
                md={4}
                className="parent"
            >
                <label>Extended Price</label>
                <Form.Item
                    {...restField}
                    name={[name, 'extendedPrice']}
                    rules={[
                        {
                            type: 'number',
                            min: 0,
                            message: 'Price cannot be less than Zero',
                        },
                    ]}
                >
                    <InputNumber
                        min={0}
                        //placeholder="EXTENDED PRICE"
                        style={{
                            backgroundColor: '#fff',
                            color: '#000',
                            width: '100%',
                        }}
                    />
                </Form.Item>
            </Col>
            <Form.Item
                {...restField}
                name={[name, 'itemId']}
                hidden={true}
            >
                <Input type={'number'}/>
            </Form.Item>

            {orderType === 'EXCHANGE_WITH_COST' ? (
                <>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>Exchange Fee</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'exchangeFee']}
                            rules={[
                                {
                                    type: 'number',
                                    min: 0,
                                    message: 'Cost cannot be less than Zero',
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                //placeholder="Exchange Fee"
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
                        md={4}
                        className="parent"
                    >
                        <label>Repair Cost</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'repairCost']}
                            rules={[
                                {
                                    type: 'number',
                                    min: 0,
                                    message: 'Cost cannot be less than Zero',
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                //placeholder="Repair Cost"
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
                        md={4}
                        className="parent"
                    >
                        <label>Additional Fee</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'additionalFeeType']}
                        >
                            <Select
                                allowClear
                                //placeholder="Additional Fee"
                            >
                                <Option value={'RAI'}>Rai</Option>
                                <Option value={'SCRAP_ON_SITE'}>Scrap on Site</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>Rai/Scrap Fee</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'raiScrapFee']}
                        >
                            <InputNumber
                                //placeholder="Rai/Scrap Fee"
                                style={{
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    width: '100%',
                                }}
                            />
                        </Form.Item>
                    </Col>
                </>
            ) : orderType === '' ||
            orderType === undefined ||
            orderType === 'PURCHASE' ? (
                ''
            ) : orderType === 'LOAN' ? (
                <>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>Start Date</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'loanStartDate']}
                        >
                            <DatePicker
                                placeholder=""
                                style={{width: '100%'}}
                                format={'YYYY-MM-DD'}
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>End Date</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'loanEndDate']}
                        >
                            <DatePicker
                                placeholder=""
                                style={{width: '100%'}}
                                format={'YYYY-MM-DD'}
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>Loan Status</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'loanStatus']}
                        >
                            <Select
                                //placeholder="Select Loan Status"
                                allowClear
                            >
                                <Option value={'REQUESTED'}>Requested</Option>
                                <Option value={'RECEIVED'}>Received</Option>
                                <Option value={'RETURNED'}>Returned</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </>
            ) : orderType === 'REPAIR' ? (
                <>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label> Repair Type</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'repairType']}
                        >
                            <Select
                                //placeholder="Select Repair Type"
                            >
                                <Option value={'BENCH_TEST'}>Bench Test</Option>
                                <Option value={'FUNCTIONAL_TEST'}>Functional Test </Option>
                                <Option value={'OVERHAUL'}>Overhaul</Option>
                                <Option value={'CALIBRATION'}>Calibration</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>TSO</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'tso']}
                        >
                            <Input
                                //placeholder="TSO"
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>CSO</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'cso']}
                        >
                            <Input
                                //placeholder="CSO"
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>TSN</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'tsn']}
                            style={{marginBottom: '20px'}}
                        >
                            <Input
                                //placeholder="TSN"
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>CSN</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'csn']}
                        >
                            <Input
                                //placeholder="CSN"
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>TSR</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'tsr']}
                        >
                            <Input
                                //placeholder="TSR"
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>CSR</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'csr']}
                        >
                            <Input
                                //placeholder="CSR"
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>Repair Cost</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'repairCost']}
                            rules={[
                                {
                                    type: 'number',
                                    min: 0,
                                    message: 'Cost cannot be less than Zero',
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                //placeholder="REPAIR COST"
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
                        md={4}
                        className="parent"
                    >
                        <label>Evaluation Fee</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'evaluationFee']}
                            rules={[
                                {
                                    type: 'number',
                                    min: 0,
                                    message: 'Fee cannot be less than Zero',
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                //placeholder="Evaluation Fee"
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
                        md={4}
                        className="parent"
                    >
                        <label>Additional Fee</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'additionalFeeType']}
                        >
                            <Select
                                //placeholder="Additional Fee"
                                allowClear
                            >
                                <Option value={'RAI'}>Rai</Option>
                                <Option value={'SCRAP_ON_SITE'}>Scrap on Site</Option>
                            </Select>
                        </Form.Item>
                    </Col>{' '}
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>Rai/Scrap Fee</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'raiScrapFee']}
                        >
                            <InputNumber
                                //placeholder="Rai/Scrap Fee"
                                style={{
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    width: '100%',
                                }}
                            />
                        </Form.Item>
                    </Col>
                </>
            ) : (
                <>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>Ber Limit</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'berLimit']}
                            rules={[
                                {
                                    type: 'number',
                                    min: 0,
                                    message: 'Cost cannot be less than Zero',
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                //placeholder="Ber Limit"
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
                        md={4}
                        className="parent"
                    >
                        <label>Exchange Fee</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'exchangeFee']}
                            rules={[
                                {
                                    type: 'number',
                                    min: 0,
                                    message: 'Cost cannot be less than Zero',
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                //placeholder="Exchange Fee"
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
                        md={4}
                        className="parent"
                    >
                        <label>Repair Cost</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'repairCost']}
                            rules={[
                                {
                                    type: 'number',
                                    min: 0,
                                    message: 'Cost cannot be less than Zero',
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                //placeholder="Repair Cost"
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
                        md={4}
                        className="parent"
                    >
                        <label>Additional Fee</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'additionalFeeType']}
                        >
                            <Select
                                allowClear
                                //placeholder="Additional Fee"
                            >
                                <Option value={'RAI'}>Rai</Option>
                                <Option value={'SCRAP_ON_SITE'}>Scrap on Site</Option>
                            </Select>
                        </Form.Item>
                    </Col>{' '}
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        className="parent"
                    >
                        <label>RaiScrap Fee</label>
                        <Form.Item
                            {...restField}
                            name={[name, 'raiScrapFee']}
                        >
                            <InputNumber
                                //placeholder="Rai/Scrap Fee"
                                style={{
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    width: '100%',
                                }}
                            />
                        </Form.Item>
                    </Col>
                </>
            )}
            <Col
                xs={24}
                sm={24}
                md={4}
                className="parent"
            >
                <label>Discount %</label>
                <Form.Item
                    {...restField}
                    name={[name, 'discount']}
                >
                    <InputNumber
                        min={0}
                        max={100}
                        //placeholder="Discount %"
                        formatter={(value) => `${value}`}
                        parser={(value) => value.replace('%', '')}
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
                md={4}
                className="parent"
            >
                <label>
                    {Form.useWatch(['vendorQuotationDetails', index, 'exchangeType']) !==
                        'REPAIR' && <span style={{color: 'red'}}>*</span>}{' '}
                    Currency
                </label>
                <Form.Item
                    {...restField}
                    name={[name, 'currencyId']}
                    rules={[
                        {
                            required:
                                Form.useWatch([
                                    'vendorQuotationDetails',
                                    index,
                                    'exchangeType',
                                ]) !== 'REPAIR',
                            message: 'required!',
                        },
                    ]}
                >
                    <Select
                        allowClear
                        showSearch
                        //placeholder="Select Currency"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
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
        </>
    );
};

export default InnerFieldsPo;
