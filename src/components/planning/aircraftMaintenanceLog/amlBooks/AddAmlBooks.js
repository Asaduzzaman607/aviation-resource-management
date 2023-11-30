import React, {useCallback, useEffect, useState} from 'react';
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Checkbox, Col, Form, Input, InputNumber, notification, Row, Select, Space} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMButton from "../../../common/buttons/ARMButton";
import {getErrorMessage} from "../../../../lib/common/helpers";
import ARMForm from "../../../../lib/common/ARMForm";
import {refreshPagination} from "../../../../lib/hooks/paginations";
import {useDispatch, useSelector} from "react-redux";
import AmlBookServices from "../../../../service/AmlBookServices";
import { max_size, size } from '../../../../lib/common/validation';
import { useTranslation } from 'react-i18next';
import Permission from '../../../auth/Permission';
import { useAircrafts, useAircraftsList } from '../../../../lib/hooks/planning/aircrafts';
import AircraftService from "../../../../service/AircraftService";


const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const {Option} = Select;


const AddAmlBooks = () => {
    const [form] = Form.useForm();
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const [AddAmlBooksData, setAddAmlBooksData] = useState({});
    const [allAircrafts, setAircrafts] = useState([]);

    const getAllAircrafts = useCallback(async () => {
        const res = await AircraftService.getAllAircraftList();
        setAircrafts(
            res.data.map(({ aircraftId , aircraftName  }) => ({
                aircraftId,
                aircraftName,
            }))
        );
    }, []);

    useEffect(() => {
        (async () => {
            await getAllAircrafts();
        })();
    }, []);

    const onReset = () => {
        if (id) {
            form.setFieldsValue({...AddAmlBooksData})
        } else {
            form.resetFields()
        }
    };



    // get AddAmlBooks data by id
    useEffect(() => {
        if (!id) {
            return
        }
        getAmlBookById().catch(console.error)

    }, [id])

    const getAmlBookById = async () => {
        try {
            const {data} = await AmlBookServices.getAmlBookById(id)
            form.setFieldsValue({...data})
            setAddAmlBooksData({...data})

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }


    // post api call using async await
    const onFinish = async (values) => {

        try {
            if (id) {
                await AmlBookServices.updateAmlBook(id, values)
            } else {
                let {data} = await AmlBookServices.saveAmlBook(values)

            }

            form.resetFields()
            dispatch(refreshPagination("AmlBooks", "aml-book/search"));
            navigate('/planning/atl-books')
            notification["success"]({
                message: id ? "Successfully updated!" : "Successfully added!",
            });

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }

    };

    //Title separating
    const TITLE = id ? t('common.Edit') : t('common.Add');



    return (

        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item> <Link to='/planning'> <i className="fas fa-chart-line"/>&nbsp; {t("planning.Planning")}
                    </Link></Breadcrumb.Item>

                    <Breadcrumb.Item><Link to='/planning/atl-books'>
                        {t("planning.ATL Books.ATL Books")}
                    </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        {TITLE}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission={["PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_BOOKS_SAVE","PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_BOOKS_EDIT"]} showFallback>
            <ARMCard
                title={
                    getLinkAndTitle(id? `${t('planning.ATL Books.ATL Book')} ${t('common.Edit')}` : `${t('planning.ATL Books.ATL Book')} ${t('common.Add')}`, '/planning/atl-books',false,"PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_BOOKS_SAVE")
                }

            >

                <ARMForm
                    {...layout}
                    form={form}
                    name="AddAmlBooks"
                    onFinish={onFinish}
                    scrollToFirstError
                    initialValues={{
                        isActive: true
                    }
                    }
                >
                    <Row>
                        <Col sm={20} md={10}>


                            <Form.Item
                                name="aircraftId"
                                label={t("planning.Aircrafts.Aircraft")}
                                rules={[
                                    {
                                        required: true,
                                        message: t("planning.ATL Books.Please select an Aircraft"),
                                    },
                                ]}

                            >
                                <Select placeholder={t("planning.ATL Books.Select an Aircraft")}>
                                    {allAircrafts?.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.aircraftId}>
                                                {item.aircraftName}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="bookNo"
                                label={t("planning.ATL Books.ATL Book No")}
                                rules={[
                                    {
                                    max: 255,
                                    message: t("common.Maximum 255 characters allowed"),
                                    }
                                ]}

                            >
                                <Input
                                    max={size}
                                    placeholder={t('planning.ATL Books.Enter ATL Book No')}
                                    style={{width: '100%'}}/>
                            </Form.Item>

                            <Form.Item
                                name="startPageNo"
                                label={t("planning.ATL Books.Start Page No")}
                                rules={[
                                    {
                                        required: true,
                                        type: 'number',
                                        min: 0,
                                        message: t("planning.ATL Books.This field can not be less than 0")
                                    },
                                ]}

                            >
                                <InputNumber
                                    maxLength={max_size}
                                    placeholder={t('planning.ATL Books.Enter Start Page No')}
                                    style={{width: '100%'}}/>
                            </Form.Item>
                            <Form.Item
                                name="endPageNo"
                                label={t("planning.ATL Books.End Page No")}
                                rules={[
                                    {
                                        required: true,
                                        type: 'number',
                                        min: 0,
                                        message: t("planning.ATL Books.This field can not be less than 0")
                                    },
                                ]}

                            >
                                <InputNumber
                                    maxLength={max_size}
                                    placeholder={t('planning.ATL Books.Enter End Page No')}
                                    style={{width: '100%'}}/>
                            </Form.Item>


                        </Col>
                    </Row>
                    <Row>
                        <Col sm={20} md={10}>
                            <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                                <Space>
                                    <ARMButton size="medium" type="primary" htmlType="submit">
                                        {id ? t("common.Update") : t("common.Submit")}
                                    </ARMButton>
                                    <ARMButton onClick={onReset} size="medium" type="primary" danger>
                                        {t("common.Reset")}
                                    </ARMButton>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </ARMForm>
            </ARMCard>
            </Permission>
        </CommonLayout>
    );
};

export default AddAmlBooks;
