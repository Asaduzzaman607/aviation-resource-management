import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    notification,
    Row,
    Select,
    Typography
} from "antd";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import RibbonCard from "../../common/forms/RibbonCard";
import API from "../../../service/Api";
import PropTypes from "prop-types";
import {useBoolean} from "react-use";
import AddAirportForm from "../flightData/AddAirportForm";
import useAddAirport from "../../../lib/hooks/planning/useAddAirport";
import {getErrorMessage} from "../../../lib/common/helpers";
import AirportService from "../../../service/AirportService";
import {useDispatch} from "react-redux";
import {addNewAirport} from "../../../reducers/airport.reducer";
import AircraftService from "../../../service/AircraftService";
import {aircraftValidation, useAircrafts} from "../../../lib/hooks/planning/aircrafts";
import ARMAircraftAdd from "../aircraft/aircraft/ARMAircraftAdd";
import {isInteger} from "../../../lib/common/validation";
import {notifyError, notifyResponseError, notifySuccess, notifyWarning} from "../../../lib/common/notifications";
import useConditionalEffect from "../../../lib/hooks/useConditionalEffect";
import AMLService from "../../../service/planning/AMLService";
import {CloseOutlined} from "@ant-design/icons";
import {useParamsId} from "../../../lib/hooks/common";
import {formatTimeValue} from "../../../lib/common/presentation";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import {useTranslation} from "react-i18next";
import {
    ALPHABETS, AML_TYPES_REGULAR_EDIT_OPTIONS,
    AML_TYPES_OPTIONS,
    AML_TYPES_REGULAR_MAINT_EDIT_OPTIONS,
    FLIGHT_DATA_OBJ
} from "./MaintenaceLog/aml.constants";
import Permission from "../../auth/Permission";


const FROM_AIRPORT = 'fromAirportId';
const TO_AIRPORT = 'toAirportId';
const {Text} = Typography;

export const formatPageNo = ({pageNo, alphabet}) => {
    if (!pageNo) {
        return 'N/A';
    }

    if (!alphabet) {
        return String(pageNo);
    }

    return pageNo + alphabet;
}

export default function AMLFormBasicInfo({
                                             amls,
                                             aircrafts,
                                             employees,
                                             airports,
                                             amlForm,
                                             setAircrafts,
                                             setTotalAirTimeAlphabet,
                                             setTotalLandingAlphabet,
                                             alTypeForEdit

                                         }) {
    const id = useParamsId('amlId');
    const dispatch = useDispatch();
    const [isOpenAirportModal, toggleAirportModal] = useBoolean(false);
    const [isOpenAircraftModal, toggleAircraftModal] = useBoolean(false);
    const [airportField, setAirportField] = useState(FROM_AIRPORT);
    const [pageInfo, setPageInfo] = useState(null)
    const [nextPageNo, setNextPageNo] = useState(null)

    const {form, onReset} = useAddAirport();
    const aircraftId = Form.useWatch('aircraftId', amlForm);
    const amlType = Form.useWatch('amlType', amlForm);

    const [isApplicableApu, setIsApplicableApu] = useState(false);

    const onApplicableApu = () => {
        setIsApplicableApu(!isApplicableApu);
    };

    // useEffect(() => {
    //
    //     if (amlType === 3) {
    //         amlForm.setFieldsValue({
    //             flightNo: 'MAINT',
    //         });
    //     } else {
    //         amlForm.setFieldsValue({
    //             flightNo: '',
    //         });
    //     }
    // }, [amlType])


    const {t} = useTranslation();

    const amlList = useMemo(() => {
        if (id === null) return amls;
        return amls.filter(aml => aml.id !== id);
    }, [amls, id])

    useEffect(() => {
        if (!aircraftId) {
            setPageInfo(null);
        }
    }, [aircraftId])

    useEffect(() => {
        if (id) {
            return
        }
        if (!aircraftId) {
            setNextPageNo(null);
            return
        } else {
            amlForm.setFieldsValue({pageNo: nextPageNo})
        }
    }, [aircraftId, amlForm, id, nextPageNo])

    const setAirTimeAndTotalLanding = useCallback((obj) => {
        const flightData = amlForm.getFieldValue(FLIGHT_DATA_OBJ);
        amlForm.setFieldsValue({[FLIGHT_DATA_OBJ]: {...flightData, ...obj}})
    }, [amlForm])

    useConditionalEffect(() => {
        (async () => {
            const {data} = await AMLService.getAMLPrevPage(aircraftId)
            const {totalAirTime, totalLanding} = data;
            setAirTimeAndTotalLanding({totalAirTime, totalLanding})
            setPageInfo(data)
            if (data.pageNo % 50 === 0) { //divided by 50
                setNextPageNo("")
                return
            }
            setNextPageNo(data.maxPageNo + 1)
        })();
    }, [aircraftId, setAirTimeAndTotalLanding], typeof aircraftId === 'number' && !id)

    const onFinish = async (values) => {
        try {
            const {data} = await AirportService.saveAirport(values)
            form.resetFields()
            notification["success"]({message: "Successfully added!"});

            toggleAirportModal();
            dispatch(addNewAirport({id: data.id, name: values.iataCode}))

            amlForm.setFieldsValue({[airportField]: data.id})
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }

    const openAirportModal = useCallback((type) => async () => {
        setAirportField(type);
        toggleAirportModal();
    }, [])


    const {onNameChange, addItem, aircraftModelFamilies, name, onReset: onAirReset, form: onAirForm} = useAircrafts();
    const addNewAircraftToList = (aircraft) => setAircrafts((prevState) => [aircraft, ...prevState]);

    const onAircraftFinish = async (values) => {
        const specialRegex = `^[0-9.:]+$|^$`;
        if (
            values.airFrameTotalTime &&
            !values.airFrameTotalTime?.toString().match(specialRegex)
        ) {
            notifyWarning("Invalid A/C total time! Only number is allowed");
            return;
        } else if (
            values.bdTotalTime &&
            !values.bdTotalTime?.toString().match(specialRegex)
        ) {
            notifyWarning("Invalid BD total time!Only number is allowed");
            return;
        } else if (
            values.dailyAverageHours &&
            !values.dailyAverageHours?.toString().match(specialRegex)
        ) {
            notifyWarning("Invalid daily average hours!Only number is allowed");
            return;
        } else if (
            values.aircraftCheckDoneHour &&
            !values.aircraftCheckDoneHour?.toString().match(specialRegex)
        ) {
            notifyWarning("Invalid check done hour!Only number is allowed");
            return;
        } else if (
            values.totalApuHours &&
            !values.totalApuHours?.toString().match(specialRegex)
        ) {
            notifyWarning("Invalid total apu hours!Only number is allowed");
            return;
        } else if (
            values.dailyAverageApuHours &&
            !values.dailyAverageApuHours?.toString().match(specialRegex)
        ) {
            notifyWarning("Invalid daily average apu hours!Only number is allowed");
            return;
        }

        const totalApuHours = values.totalApuHours;
        const tapuhs = totalApuHours?.toString().replace(":", ".");
        const tapuh = parseFloat(tapuhs).toFixed(2);

        const dailyAverageApuHours = values.dailyAverageApuHours;
        const deapuh = dailyAverageApuHours?.toString().replace(":", ".");
        const dapuh = parseFloat(deapuh).toFixed(2);

        const checkDone = values?.aircraftCheckDoneHour;
        const acdh = checkDone?.toString().replace(":", ".");
        //const acdh = parseFloat(arcdh)?.toFixed(2);

        const totalTime = values?.airFrameTotalTime;
        const aftt = totalTime?.toString().replace(":", ".");
        const aft = parseFloat(aftt).toFixed(2);

        const bdtotaltime = values?.bdTotalTime;
        const bdtt = bdtotaltime?.toString().replace(":", ".");
        const bd = parseFloat(bdtt).toFixed(2);

        const daverage = values?.dailyAverageHours;
        const deavh = daverage?.toString().replace(":", ".");
        const davh = parseFloat(deavh).toFixed(2);

        const value = {
            ...values,
            manufactureDate: DateTimeConverter.momentDateToString(values.manufactureDate),
            aircraftCheckDoneHour: acdh ? acdh : null,
            airFrameTotalTime: aft,
            bdTotalTime: bd,
            dailyAverageHours: davh,
            totalApuHours: tapuh,
            dailyAverageApuHours: dapuh,
            aircraftCheckDoneDate:
                values.aircraftCheckDoneDate &&
                values["aircraftCheckDoneDate"].format("YYYY-MM-DD"),
        };

        const dataa = {
            ...values,
            manufactureDate: DateTimeConverter.momentDateToString(values.manufactureDate),
            aircraftCheckDoneHour: acdh ? acdh : null,
            airFrameTotalTime: aft,
            bdTotalTime: bd,
            dailyAverageHours: davh,
            aircraftCheckDoneDate:
                values.aircraftCheckDoneDate &&
                values["aircraftCheckDoneDate"].format("YYYY-MM-DD"),
            totalApuHours: -1,
            totalApuCycle: -1,
            dailyAverageApuHours: -1,
            dailyAverageApuCycle: -1,
        };
        try {
            const {data} = await AircraftService.saveAircraft(isApplicableApu ? dataa : value);
            notifySuccess("Aircraft saved successfully")
            const aircraftId = data.id;
            addNewAircraftToList({aircraftId: aircraftId, aircraftName: values.aircraftName})
            amlForm.setFieldsValue({aircraftId: aircraftId});
            onAirForm.resetFields()
            toggleAircraftModal();
        } catch (error) {
            notifyResponseError(error);
        }
    };

    const closeInfoCard = () => {
        setPageInfo(null);
    }

    const [amlTypeOptions, setAmlTypeOptions] = useState(AML_TYPES_OPTIONS);

    useEffect(() => {
        if (!id) return

        if (id && alTypeForEdit === 0) {
            setAmlTypeOptions(AML_TYPES_REGULAR_MAINT_EDIT_OPTIONS)
        } else if (id && alTypeForEdit === 3) {
            setAmlTypeOptions(AML_TYPES_REGULAR_MAINT_EDIT_OPTIONS)
        } else {
            setAmlTypeOptions(AML_TYPES_OPTIONS)
        }
    }, [alTypeForEdit])


    return (
        <>
            <Modal title="Add Airport" footer={null} onCancel={toggleAirportModal} visible={isOpenAirportModal}>
                <AddAirportForm form={form} onFinish={onFinish} onReset={onReset}/>
            </Modal>

            <Modal title="Add Aircraft" footer={null} onCancel={toggleAircraftModal} visible={isOpenAircraftModal}
                   width={1200}>
                <ARMAircraftAdd
                    onReset={onAirReset}
                    form={onAirForm}
                    onNameChange={onNameChange}
                    addItem={addItem}
                    aircraftModelFamilies={aircraftModelFamilies}
                    name={name}
                    onFinish={onAircraftFinish}
                    onApplicableApu={onApplicableApu}
                    isApplicableApu={isApplicableApu}
                />
            </Modal>

            <RibbonCard ribbonText={t("planning.ATL.Aircraft Technical Log")}>
                <Row>
                    <Col sm={24} md={12}>
                        <Form.Item
                            name="aircraftId"
                            label={t("planning.Aircrafts.Aircraft")}
                            rules={[
                                {
                                    required: true,
                                    message: t("planning.ATL.Aircraft is required")
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                dropdownRender={(menu) => (
                                    <>
                                        <Permission permission="PLANNING_AIRCRAFT_AIRCRAFT_SAVE">
                                            <Button size="small" style={{width: '100%'}} type="primary"
                                                    onClick={toggleAircraftModal}>
                                                + Add Aircraft
                                            </Button>
                                        </Permission>
                                        {menu}
                                    </>
                                )}
                                size="small"
                                disabled={!!id}
                            >
                                <Select.Option value="">---Select---</Select.Option>
                                {
                                    aircrafts?.map(({aircraftId, aircraftName}) => <Select.Option value={aircraftId}
                                                                                                  key={aircraftId}>{aircraftName}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>

                        {
                            pageInfo !== null && (
                                <Card style={{
                                    marginBottom: '1em',
                                    boxShadow: "2px 2px 10px",
                                    // border: '1px dashed black',
                                }}>
                                    <Row justify="space-between">
                                        <Col>
                                            A/C Total Time: <Text code>{formatTimeValue(pageInfo.totalAirTime)}</Text>
                                        </Col>

                                        <Col>
                                            Total Landing: <Text code>{pageInfo.totalLanding}</Text>
                                        </Col>

                                        <Col>
                                            Previous Page No: <Text code>{formatPageNo(pageInfo)}</Text>
                                        </Col>

                                        <Col>
                                            <CloseOutlined title="Close" onClick={closeInfoCard}/>
                                        </Col>
                                    </Row>
                                </Card>
                            )
                        }

                        <PageNumberField id={id} form={amlForm} setTotalAirTimeAlphabet={setTotalAirTimeAlphabet}
                                         setTotalLandingAlphabet={setTotalLandingAlphabet}/>

                        <Form.Item
                            name="amlType"
                            label="ATL Type"
                        >
                            <Select size="small"
                                    disabled={!aircraftId}
                                    onChange={(value) => {

                                        if (value==3) {
                                            amlForm.setFieldsValue({
                                                flightNo: 'MAINT',
                                            });
                                        } else {
                                            amlForm.setFieldsValue({
                                                flightNo: '',
                                            });
                                        }
                                    }}
                            >
                                {
                                    amlTypeOptions?.map(({id, name}) => <Select.Option value={id}
                                                                                       key={id}>{name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="fromAirportId"
                            label={t("planning.ATL.From Airport")}
                        >
                            <Select
                                allowClear
                                dropdownRender={(menu) => (
                                    <>
                                        <Permission permission="PLANNING_CONFIGURATIONS_AIRPORT_SAVE">
                                            <Button size="small" style={{width: '100%'}} type="primary"
                                                    onClick={openAirportModal(FROM_AIRPORT)}>
                                                + Add Airport
                                            </Button>
                                        </Permission>
                                        {menu}
                                    </>
                                )}
                                size="small"
                            >
                                <Select.Option value="">---Select---</Select.Option>
                                {
                                    airports?.map(({id, name}) => <Select.Option value={id}
                                                                                 key={id}>{name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="toAirportId"
                            label={t("planning.ATL.To Airport")}
                        >
                            <Select
                                allowClear
                                dropdownRender={(menu) => (
                                    <>
                                        <Permission permission="PLANNING_CONFIGURATIONS_AIRPORT_SAVE">
                                            <Button size="small" style={{width: '100%'}} type="primary"
                                                    onClick={openAirportModal(TO_AIRPORT)}>
                                                + Add Airport
                                            </Button>
                                        </Permission>
                                        {menu}
                                    </>
                                )}
                                size="small"
                            >
                                <Select.Option value="">---Select---</Select.Option>
                                {
                                    airports?.map(({id, name}) => <Select.Option value={id}
                                                                                 key={id}>{name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="captainId"
                            label={t("planning.ATL.Captain")}
                        >
                            <Select size="small">
                                <Select.Option value="">---Select---</Select.Option>
                                {
                                    employees?.map(({id, name}) => <Select.Option value={id}
                                                                                  key={id}>{name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col sm={24} md={12}>
                        <Form.Item
                            name="firstOfficerId"
                            label={t("planning.ATL.First Officer")}
                        >
                            <Select size="small">
                                <Select.Option value="">---Select---</Select.Option>
                                {
                                    employees?.map(({id, name}) => <Select.Option value={id}
                                                                                  key={id}>{name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="flightNo"
                            label={t("planning.ATL.Flight No")}
                        >
                            <Input addonBefore={amlType == 3 ? '' : 'BS-'} maxLength={100} size="small"/>
                        </Form.Item>

                        <Form.Item
                            name="date"
                            label={t("planning.ATL.Date")}
                            rules={[{
                                required: true,
                                message: t("planning.ATL.Date is required")
                            }]}
                        >
                            <DatePicker
                                format="DD-MM-YYYY"
                                size="small"
                                placeholder=""
                                style={{width: '100%'}}
                                onChange={() => null}
                            />
                        </Form.Item>

                        <Form.Item label={t("planning.ATL.Remarks")} name="remarks">
                            <Input.TextArea size="small" rows={2}/>
                        </Form.Item>
                    </Col>
                </Row>


            </RibbonCard>
        </>
    )
}

AMLFormBasicInfo.propTypes = {
    amlForm: PropTypes.object.isRequired,
    aircrafts: PropTypes.array.isRequired,
    employees: PropTypes.array.isRequired,
    airports: PropTypes.array.isRequired,
    amls: PropTypes.array.isRequired,
    setAircrafts: PropTypes.func.isRequired
};

const PAGE_NO = 'pageNo';
const ALLOW_ALPHABET = 'allowAlphabet'
const AIRCRAFT_ID = 'aircraftId'

const PageNumberField = ({id, form, setTotalAirTimeAlphabet, setTotalLandingAlphabet}) => {
    const VALIDATION_URI = 'aircraft-maintenance-log/validate-page-no';

    const pageNo = Form.useWatch(PAGE_NO, form);
    const aircraftId = Form.useWatch(AIRCRAFT_ID, form);
    const allowAlphabet = Form.useWatch(ALLOW_ALPHABET, form);
    const alphabet = Form.useWatch('alphabet', form)

    const validatePost = (url, data) => {
        return API.post(url, data);
    }

    const {t} = useTranslation()

    const validatePageNO = async () => {

        const validateData = {
            aircraftId,
            pageNo,
            allowAlphabet
        }

        if (!pageNo) {
            notifyError("Please, Enter a page no!")
            return;
        }

        if (!aircraftId) {
            notifyError("Please, Select an aircraft!")
            return;
        }

        try {
            await API.post(VALIDATION_URI, validateData)
            notifySuccess("Page No is valid!")
        } catch (e) {
            notifyError(e.response.data)
        }
    }

    const aircraftInfoOnAlphabetChange = useCallback(async (e) => {
        if (!pageNo) return
        const {data} = await API.get(`/aircraft-maintenance-log/find-airframe-info/${pageNo}/${aircraftId}`)

        setTotalAirTimeAlphabet(data.totalAirTime?.toFixed(2)?.toString()?.replace('.', ':'))
        setTotalLandingAlphabet(data.totalLanding)

        form.setFieldsValue({
            amlFlightData: {
                noOfLanding: 1,
                totalAirTime: data.totalAirTime ? data.totalAirTime : null,
                totalLanding: data.totalLanding ? data.totalLanding : null
            }
        })
    }, [alphabet, pageNo, setTotalAirTimeAlphabet, setTotalLandingAlphabet])


    const totalAir = form.getFieldsValue()

    useEffect(() => {
        if (!alphabet) {
            setTotalAirTimeAlphabet(undefined)
            setTotalLandingAlphabet(undefined)
        }
    }, [alphabet, setTotalAirTimeAlphabet, setTotalLandingAlphabet])

    const suffixButton = (
        <Form.Item name="alphabet" style={{background: "transparent"}} noStyle>
            <Select disabled={!!id} allowClear size="small" onSelect={aircraftInfoOnAlphabetChange} placeholder="-">
                {
                    ALPHABETS?.map((letter) => <Select.Option value={letter} key={letter}>{letter}</Select.Option>)
                }
            </Select>
        </Form.Item>
    )

    return (
        <>
            <Form.Item
                name="pageNo"
                label={t("planning.ATL.Page No")}
                dependencies={['aircraftId']}
                rules={[
                    {
                        required: true,
                        message: t("planning.ATL.Page No is required")
                    },
                    ({getFieldValue}) => ({
                        async validator(_, pageNo) {
                            const aircraftId = getFieldValue('aircraftId');

                            if (!aircraftId) {
                                return Promise.reject('Please, Select An Aircraft Before!')
                            }

                            if (!isInteger(pageNo)) {
                                return Promise.reject(new Error('Only integers are allowed!'));
                            }

                            return Promise.resolve();
                        },
                    })
                ]}
            >
                <InputNumber style={{width: '100%'}} disabled={!!id} size="small" step={1} addonAfter={suffixButton}/>
            </Form.Item>
        </>
    )
}

PageNumberField.propTypes = {
    form: PropTypes.object.isRequired
};