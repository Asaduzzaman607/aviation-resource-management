import AMLAddBreadCrumb from "./AMLAddBreadCrumb";
import React, {useEffect} from "react";
import CommonLayout from "../../../layout/CommonLayout";
import {useAMLAdd} from "../../../../lib/hooks/planning/aml";
import useSignatures from "../../../../lib/hooks/planning/signatures";
import {AMLProvider} from "../../../../contexts/aml";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMForm from "../../../../lib/common/ARMForm";
import {formLayout} from "../../../../lib/constants/form";
import {AML_TYPES, amlFormInitialValues} from "./aml.constants";
import {Checkbox, Col, Form, Row} from "antd";
import AMLFormBasicInfo from "../AMLFormBasicInfo";
import AmlFuelUpliftCrossCheck from "../AmlFuelUpliftCrossCheck";
import AmlPFICertification from "../AmlPFICertification";
import AmlAcceptanceForTheFLTCertification from "../AmlAcceptanceForTheFLTCertification";
import AMLFormButtons from "./AMLFormButtons";
import ARMCard from "../../../common/ARMCard";
import DefectRectificationsForm from "./DefectRectificationsForm";
import FlightDataForm from "./FlightDataForm";
import AmlOilRecord from "./AmlOilRecord";
import {useTranslation} from "react-i18next";
import {complement, either, equals} from "ramda";
import Permission from "../../../auth/Permission";


const {useWatch} = Form;

export default function AMLAddV2({toggleTab}) {
    const {
        id,
        form,
        aircrafts,
        setAircrafts,
        airports,
        employees,
        amls,
        onReset,
        onFinish,
        submitting,
        selectedBox,
        setSelectedBox,
        setSubmitType,
        defectsAdded,
        isOilRecordAdded,
        regularOrMaint,
        hasNotFlightDataDate,
        totalAirTimeAlphabet,
        setTotalAirTimeAlphabet,
        totalLandingAlphabet,
        setTotalLandingAlphabet,
        alTypeForEdit
    } = useAMLAdd();

    const {signatures} = useSignatures();
    const {t} = useTranslation()
    const TITLE = id ? `${t('planning.ATL.ATL')} ${t('common.Edit')}` : `${t('planning.ATL.ATL')} ${t('common.Add')}`;

    const showDefectAndRectificationForm = useWatch('needToSaveDefectRectification', form);
    const amlType = useWatch('amlType', form);
    const saveOilRecord = useWatch('saveOilRecord', form);


    useEffect(() => {
        if (amlType === 0 || amlType === 3) {
            form.setFieldsValue({saveOilRecord: true})
        }
    }, [amlType])

    const isNotVoidOrNil = complement(either(
        equals(AML_TYPES.VOID),
        equals(AML_TYPES.NIL)
    ))(amlType)

    return <CommonLayout>
        <AMLAddBreadCrumb id={id} toggleTab={toggleTab}/>

        <AMLProvider value={{
            aircrafts,
            airports,
            employees,
            selectedBox,
            setSelectedBox,
            setSubmitType,
            form
        }}>
            <Permission
                permission={["PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_SAVE", "PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_EDIT"]}
                showFallback>
                <ARMCard title={getLinkAndTitle(TITLE, "/planning/atl",false,"PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_SAVE")}>

                    <ARMForm
                        {...formLayout}
                        form={form}
                        name="aml"
                        onFinish={onFinish}
                        initialValues={amlFormInitialValues}
                        scrollToFirstError
                    >

                        <Row gutter={[12, 12]}>
                            <Col sm={24} md={24}>
                                <AMLFormBasicInfo
                                    amlForm={form}
                                    amls={amls}
                                    employees={employees}
                                    aircrafts={aircrafts}
                                    airports={airports}
                                    setAircrafts={setAircrafts}
                                    regularOrMaint={regularOrMaint}
                                    setTotalAirTimeAlphabet={setTotalAirTimeAlphabet}
                                    setTotalLandingAlphabet={setTotalLandingAlphabet}
                                    alTypeForEdit={alTypeForEdit}
                                />


                            </Col>


                        </Row>

                        {
                            !defectsAdded ? (
                                <>
                                    {
                                        isNotVoidOrNil && (
                                            <Form.Item
                                                label={t("planning.ATL.Show Defects And Rectification Form")}
                                                name="needToSaveDefectRectification"
                                                valuePropName="checked"
                                            >
                                                <Checkbox/>
                                            </Form.Item>
                                        )
                                    }

                                    {showDefectAndRectificationForm && <DefectRectificationsForm defectsAdded={defectsAdded}/>}
                                </>
                            ) : <DefectRectificationsForm/>
                        }


                        <FlightDataForm amlType={amlType} form={form} id={id} isNotVoidOrNil={isNotVoidOrNil}
                                        hasNotFlightDataDate={hasNotFlightDataDate}
                                        totalAirTimeAlphabet={totalAirTimeAlphabet}
                                        totalLandingAlphabet={totalLandingAlphabet}/>


                        {
                            isOilRecordAdded ? <AmlOilRecord/> : <>
                                {
                                    isNotVoidOrNil && (
                                        <Form.Item
                                            label="Show Oil Record Form"
                                            name="saveOilRecord"
                                            valuePropName="checked"
                                        >
                                            <Checkbox/>
                                        </Form.Item>
                                    )
                                }

                                {saveOilRecord && <AmlOilRecord/>}
                            </>
                        }

                        <Row gutter={[12, 12]}>
                            <Col sm={24} md={24}>
                                <AmlFuelUpliftCrossCheck/>
                            </Col>
                            <Col sm={24} md={12}>
                                {/* <AMLOilAndFuelCertification signatures={signatures} /> */}

                                {/* <AMLRVSMAndFLTCertification signatures={signatures} /> */}

                                {/* <AmlEtopsFltCertification signatures={signatures} /> */}

                                <AmlPFICertification signatures={signatures} airports={airports}/>
                            </Col>
                            <Col sm={24} md={12}>

                                <AmlAcceptanceForTheFLTCertification signatures={signatures}/>
                            </Col>
                        </Row>

                        <AMLFormButtons onReset={onReset} submitting={submitting}/>

                    </ARMForm>

                </ARMCard>
            </Permission>
        </AMLProvider>
    </CommonLayout>
}
