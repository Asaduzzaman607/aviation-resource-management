import React, {useEffect} from 'react';
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {
    Breadcrumb, Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Modal, Radio, Row, Select, Space, Transfer
} from "antd";
import {Link,} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMButton from "../../../common/buttons/ARMButton";
import ARMForm from "../../../../lib/common/ARMForm";
import {formLayout} from "../../../../lib/constants/layout";
import {useTaskRecords} from "../../../../lib/hooks/planning/useTaskRecords";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import AddModelForm from "../../models/AddModelForm";
import {useModels} from "../../../../lib/hooks/planning/useModels";
import AddPositionForm from "../../configurations/AddPositionForm";
import {usePositions} from "../../../../lib/hooks/planning/usePositions";
import {useTranslation} from 'react-i18next';
import AddPartsForm from "../../aircraft/parts/AddPartsForm";
import {useParts} from "../../../../lib/hooks/planning/useParts";
import AddTaskTypeForm from '../../aircraftMaintenanceProgram/taskType/AddTaskTypeForm';
import {useTaskTypes} from '../../../../lib/hooks/planning/useTaskTypes';
import Permission from '../../../auth/Permission';

const initialValues = {
    isActive: true,
    repeatType: 0,
    taskProcedureDtoList: [{jobProcedure: '', positionId: null}],
    taskIntervalDtoList: [{intervalValue: null, intervalUnit: null}],
    taskIntervalDtoList1: [{intervalValue: null, intervalUnit: null}],
    taskType: '',
    status: 0,
    isApuControl: false,
    taskConsumablePartDtoList: [],
    effectiveAircraftDtoList: [
        {aircraftId: null, aircraftName: '', remark: ''}
    ],
    date: null
}

const formLayoutForTask = {
    labelCol: {
        span: 12,
    },
    wrapperCol: {
        span: 12,
    },
}


const AddTaskRecords = () => {

    const {handleReset: handlePositionReset, form: positionForm} = usePositions();

    const {onReset: handleModelReset, modelType, aircraft, lifeCode, form: modelForm} = useModels();

    const {onReset: onTaskTypeReset, form: taskTypeForm} = useTaskTypes()

    const {
        onReset: handleConsumablePartsReset,
        form: consumablePartsForm,
        classifications,
        units,
        selectedAlternatePart: alternatePart,
        setSelectedAlternatePart: setAlternatePart,
        model: modelAir,
        setShowModal: setShowPartModal,
        aircraftModelFamilies: aircraftModels,
        id: partId,
        getAircraftModelId: getAirId,
        disable,
        acTypeDisable,
        lifeLimitUnit
    } = useParts()

    const {t} = useTranslation();

    const {
        id,
        form,
        onFinish,
        onReset,
        TITLE,
        taskValue,
        onScroll,
        onSelectChange,
        INTERVAL_TYPE,
        onChangeIntervalType,
        REMARK_LENGTH,
        model,
        aircraftModelFamilies,
        aircraftByModelForEffectivity,
        getAircraftModelId,
        handleModelSubmitAtTask,
        showModal,
        setShowModal,
        onChangeCheckbox,
        showPositionModal,
        setShowPositionModal,
        handlePositionSubmitAtTask,
        positionByModel,
        getModelId,
        jobProcedures,
        consumableParts,
        setConsumableParts,
        onChangeStatus,
        selectedKeys,
        notApplicable,
        onChangeTaskType,
        handleConsumablePartsSubmitAttask,
        setConsumablePartsShowModal,
        showConsumablePartsModal,
        setConsumablePartsIndex,
        allConsumableParts,
        initTaskRecords,
        isAPU,
        trades,
        oneTime,
        allTaskTypes,
        onChange,
        taskSource,
        allTaskStatus,
        handleTaskTypeSubmit,
        showTaskModal,
        setShowTaskModal
    } = useTaskRecords(positionForm, consumablePartsForm)

    useEffect(() => {
        (async () => {
            await initTaskRecords();
        })();
    }, [])


    const handleCopyJobText = (e, key) => {

        const procedures = form.getFieldValue('taskProcedureDtoList');

        if (procedures.length === key + 1) return;

        procedures[key + 1] = {
            ...procedures[key + 1],
            jobProcedure: procedures[key].jobProcedure
        }

        form.setFieldsValue({taskProcedureDtoList: procedures})

    }


    // @ts-ignore
    return (<CommonLayout>

            <Modal
                title={t("planning.Models.Add Model")}
                style={{
                    top: 20,
                }}
                onOk={() => setShowModal(false)}
                onCancel={() => setShowModal(false)}
                centered
                visible={showModal}
                width={1080}
                footer={null}
            >
                <AddModelForm
                    onFinish={handleModelSubmitAtTask}
                    onReset={handleModelReset}
                    modelType={modelType}
                    aircraft={aircraft}
                    lifeCode={lifeCode}
                    form={modelForm}
                />
            </Modal>
            <Modal
                title={t("planning.Task Records.Add Task Type")}
                style={{
                    top: 20,
                }}
                onOk={() => setShowTaskModal(false)}
                onCancel={() => setShowTaskModal(false)}
                centered
                visible={showTaskModal}
                width={1080}
                footer={null}
            >
                <AddTaskTypeForm
                    form={taskTypeForm}
                    onReset={onTaskTypeReset}
                    onFinish={handleTaskTypeSubmit}
                />
            </Modal>
            <Modal
                title={t("planning.Positions.Add Position")}
                style={{
                    top: 20,
                }}
                onOk={() => setShowPositionModal(false)}
                onCancel={() => setShowPositionModal(false)}
                centered
                visible={showPositionModal}
                width={1080}
                footer={null}
            >
                <AddPositionForm
                    onFinish={handlePositionSubmitAtTask}
                    handleReset={handlePositionReset}
                    form={positionForm}
                />
            </Modal>

            <Modal
                title={t("planning.Consumable Parts.Add Consumable Parts")}
                style={{
                    top: 20,
                }}
                onOk={() => setConsumablePartsShowModal(false)}
                onCancel={() => setConsumablePartsShowModal(false)}
                centered
                visible={showConsumablePartsModal}
                width={1080}
                footer={null}
            >
                <AddPartsForm
                    onFinish={handleConsumablePartsSubmitAttask}
                    onReset={handleConsumablePartsReset}
                    form={consumablePartsForm}
                    classifications={classifications}
                    units={units}
                    id={partId}
                    selectedAlternatePart={alternatePart}
                    setSelectedAlternatePart={setAlternatePart}
                    model={modelAir}
                    setShowModal={setShowPartModal}
                    aircraftModelFamilies={aircraftModels}
                    getAircraftModelId={getAirId}
                    disable={disable}
                    acTypeDisable={acTypeDisable}
                    lifeLimitUnit={lifeLimitUnit}
                />
            </Modal>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item> <Link to='/planning'> <i
                        className="fas fa-chart-line"/>&nbsp; {t("planning.Planning")}
                    </Link></Breadcrumb.Item>

                    <Breadcrumb.Item><Link to='/planning/task-records'>
                        {t("planning.Task Records.Task Records")}
                    </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        {id ? t("common.Edit") : t("common.Add")}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission
                permission={["PLANNING_SCHEDULE_TASKS_TASK_RECORDS_SAVE", "PLANNING_SCHEDULE_TASKS_TASK_RECORDS_EDIT"]}
                showFallback>
                <ARMCard
                    title={getLinkAndTitle(TITLE, '/planning/task-records', false, "PLANNING_SCHEDULE_TASKS_TASK_RECORDS_SAVE")}

                >
                    <ARMForm
                        {...formLayoutForTask}
                        form={form}
                        name="taskRecords"
                        onFinish={onFinish}
                        scrollToFirstError
                        initialValues={initialValues}
                    >
                        <Row>
                            <Col sm={20} md={10}>
                                <Form.Item

                                    name="aircraftModelId"
                                    label={t("planning.A/C Type.Aircraft Model")}
                                    rules={[{
                                        required: false, message: 'Please select aircraft model',
                                    }]}
                                >
                                    <Select
                                        disabled={!!id}
                                        placeholder={t("planning.A/C Type.Select Aircraft model")}
                                        onChange={(e) => getAircraftModelId(e)}
                                    >
                                        {aircraftModelFamilies?.map((item) => {
                                            return (<Select.Option key={item.id} value={item.id}>
                                                {item.aircraftModelName}
                                            </Select.Option>);
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="modelId"
                                    label={t("planning.Models.Model")}
                                    rules={[{
                                        required: true, message: t("planning.Models.Please select a model"),
                                    }]}>
                                    <Select
                                        disabled={!!id}
                                        onChange={(e) => {
                                            getModelId(e)
                                        }}
                                        allowClear
                                        showSearch
                                        filterOption={(inputValue, option) =>
                                            option.children
                                                .toString("")
                                                .toLowerCase()
                                                .includes(inputValue.toLowerCase())
                                        }
                                        placeholder={t("planning.Models.Select a Model")}
                                        dropdownRender={(menu) => (<>
                                            <Permission permission="PLANNING_AIRCRAFT_MODEL_SAVE">
                                                <Button
                                                    style={{width: "100%"}}
                                                    type="primary"
                                                    onClick={() => {
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    + {t("planning.Models.Add Model")}
                                                </Button>
                                            </Permission>
                                            {menu}
                                        </>)}
                                    >
                                        {model?.map((model) => (
                                            <Select.Option
                                                key={model.modelId}
                                                value={model.modelId}>
                                                {model.modelName}
                                            </Select.Option>))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="taskNo"
                                    label={t("planning.Task Records.Task No")}
                                    rules={[{
                                        required: true,
                                        message: t("planning.Task Records.Please input task no."),
                                    }]}

                                >
                                    <Input/>
                                </Form.Item>


                                <Form.Item label={'Job Procedure/Related AD/SB/ Ref Doc'}
                                           name="taskProcedureDtoList">
                                    <Form.List name="taskProcedureDtoList"
                                               label={t('planning.Task Records.Job Procedure/Related AD/Related SB')}>
                                        {(fields, {add, remove}) => (<>
                                            {fields.map((field, index) => (
                                                <Row key={`${index}-taskProcedureDtoList`} gutter={8}>
                                                    <Col
                                                        span={positionByModel.length > 0 && positionByModel[0]?.positionId !== null ? 14 : 24}>
                                                        <Row gutter={8}>
                                                            <Col
                                                                span={positionByModel.length > 0 && positionByModel[0]?.positionId !== null ? 16 : 24}>
                                                                <Form.Item
                                                                    {...field}
                                                                    style={{width: '100%'}}
                                                                    label=""
                                                                    name={[field.name, 'jobProcedure']}
                                                                    rules={[{
                                                                        message: t('planning.Task Records.Missing Job Procedure'),
                                                                    }]}
                                                                >
                                                                    <Input.TextArea
                                                                        placeholder={t('planning.Task Records.Input Job Procedure')}
                                                                        style={{width: '100%'}} autoSize/>
                                                                </Form.Item>

                                                            </Col>
                                                            {
                                                                positionByModel.length > 1 ?
                                                                    <Col
                                                                        span={positionByModel.length > 0 && positionByModel[0]?.positionId !== null ? 2 : 0}
                                                                        style={{marginTop: '4px'}}>
                                                                        <Button size={"small"}
                                                                                onClick={event => handleCopyJobText(event, index)}
                                                                                key={index}>Copy</Button>
                                                                    </Col>
                                                                    : null

                                                            }
                                                        </Row>

                                                    </Col>


                                                    {
                                                        positionByModel.length > 0 ?
                                                            <Col
                                                                span={positionByModel.length > 0 && positionByModel[0]?.positionId !== null ? 10 : 0}>

                                                                <Form.Item
                                                                    {...field}
                                                                    style={{marginBottom: "12px"}}
                                                                    label=""
                                                                    name={[field.name, 'positionId']}
                                                                    rules={[{
                                                                        required: jobProcedures > 0,
                                                                        message: t('planning.Task Records.Position Required')
                                                                    },]}

                                                                >
                                                                    <Select
                                                                        disabled
                                                                        placeholder={t("planning.Positions.Select Position")}
                                                                    >
                                                                        {positionByModel?.map((item) => {
                                                                            return (
                                                                                <Select.Option key={item.positionId}
                                                                                               value={item.positionId}>
                                                                                    {item.name}
                                                                                </Select.Option>);
                                                                        })}
                                                                    </Select>
                                                                </Form.Item>

                                                            </Col>
                                                            : null
                                                    }
                                                </Row>))}

                                        </>)
                                        }
                                    </Form.List>

                                </Form.Item>

                                <Form.Item label={t("planning.Task Records.Consumable Part")}
                                           name="taskConsumablePartDtoList">
                                    <Form.List
                                        name="taskConsumablePartDtoList"
                                        label={t("planning.Task Records.Consumable Part")}>
                                        {(fields, {add, remove}) => (<>
                                            {fields.map((field, index) => (
                                                <Row key={`${index}-taskConsumablePartDtoList`} gutter={8}>
                                                    <Col span={12}>
                                                        <Col span={24}>
                                                            <Form.Item
                                                                style={{marginBottom: "12px"}}
                                                                {...field}
                                                                label=""
                                                                name={[field.name, 'consumablePartId']}
                                                                rules={[{
                                                                    required: consumableParts > 0,
                                                                    message: t("planning.Task Records.Consumable Part Required")
                                                                }]}
                                                            >
                                                                <Select
                                                                    placeholder={t("planning.Consumable Parts.Select Consumable Part")}
                                                                    allowClear
                                                                    dropdownRender={(menu) => (<>
                                                                        <Button
                                                                            style={{width: "100%"}}
                                                                            type="primary"
                                                                            onClick={() => {
                                                                                setConsumablePartsShowModal(true);
                                                                                setConsumablePartsIndex(index)
                                                                            }}
                                                                        >
                                                                            + Add Consumable Part
                                                                        </Button>
                                                                        {menu}
                                                                    </>)}
                                                                >
                                                                    {allConsumableParts?.map((item) => {
                                                                        return (<Select.Option key={item.id}
                                                                                               value={item.id}>
                                                                            {item.partNo}
                                                                        </Select.Option>);
                                                                    })}
                                                                </Select>
                                                            </Form.Item>


                                                        </Col>
                                                    </Col>

                                                    <Col span={12}>
                                                        <Row gutter={8}>
                                                            <Col span={20}>
                                                                <Form.Item
                                                                    style={{width: '100%'}}
                                                                    {...field}
                                                                    label=""
                                                                    name={[field.name, 'quantity']}
                                                                    rules={[{
                                                                        type: 'number',
                                                                        min: 0,
                                                                        message: t("planning.Task Records.Quantity can not be less than 0"),
                                                                    },]}
                                                                >
                                                                    <InputNumber type='number'
                                                                                 placeholder={t('planning.Task Records.Input quantity')}
                                                                                 style={{width: '100%'}}/>
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={4} style={{marginTop: '4px'}}>
                                                                <MinusCircleOutlined
                                                                    onClick={() => remove(field.name)}/>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>))}

                                            {fields.length !== REMARK_LENGTH ? (<Form.Item style={{width: '100%'}}>
                                                <Button
                                                    style={{width: '100%'}}
                                                    type="dashed"
                                                    onClick={() => {
                                                        if (fields.length > 100) {
                                                            return;
                                                        }
                                                        add();
                                                        setConsumableParts(fields.length)
                                                    }}
                                                    block
                                                    icon={<PlusOutlined/>}
                                                >
                                                    {t("planning.Task Records.Add Consumable Part")}
                                                </Button>
                                            </Form.Item>) : null}
                                        </>)}
                                    </Form.List>

                                </Form.Item>


                                <Form.Item
                                    name="taskSource"
                                    label={t("planning.Task Records.Task Source")}
                                    rules={[{
                                        required: true,
                                        message: t('planning.Task Records.Please select Task Source'),
                                    },]}

                                >
                                    <Radio.Group onChange={onChangeTaskType} value={taskValue}>
                                        <Space direction="vertical">
                                            <Radio value={'AD'}>AD</Radio>
                                            <Radio value={'SB'}>SB</Radio>
                                            <Radio value={'AMP'}>AMP</Radio>
                                            <Radio value={'others'}>
                                                Others...
                                                {form.getFieldValue('taskSource') === 'others' ? (
                                                    <Form.Item name={'other'}>
                                                        <Input

                                                            style={{
                                                                width: 100, marginLeft: 10,
                                                            }}
                                                        />
                                                    </Form.Item>) : null}
                                            </Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                                {
                                    taskSource === "AD" ?
                                        <>
                                            <Form.Item
                                                label="Effective Date"
                                                name="date"
                                                rules={[
                                                    {
                                                        required: false,
                                                        message: "Please input a Date",
                                                    }
                                                ]}

                                            >
                                                <DatePicker style={{width: '100%'}} format='DD-MM-YYYY'/>
                                            </Form.Item>
                                            <Form.Item
                                                label="Issue Date"
                                                name="issueDate"
                                                rules={[
                                                    {
                                                        required: false,
                                                        message: "Please input a Date",
                                                    }
                                                ]}

                                            >
                                                <DatePicker style={{width: '100%'}} format='DD-MM-YYYY'/>
                                            </Form.Item>
                                        </>
                                        : taskSource === "SB" ?
                                            <>
                                                <Form.Item
                                                    label="Effective Date"
                                                    name="date"
                                                    rules={[
                                                        {
                                                            required: false,
                                                            message: "Please input a Date",
                                                        }
                                                    ]}

                                                >
                                                    <DatePicker style={{width: '100%'}} format='DD-MM-YYYY'/>
                                                </Form.Item>
                                                <Form.Item
                                                    label="Issue Date"
                                                    name="issueDate"
                                                    rules={[
                                                        {
                                                            required: false,
                                                            message: "Please input a Date",
                                                        }
                                                    ]}

                                                >
                                                    <DatePicker style={{width: '100%'}} format='DD-MM-YYYY'/>
                                                </Form.Item>
                                                <Form.Item
                                                    label="Revision Number"
                                                    name="revisionNumber"
                                                    rules={[
                                                        {
                                                            required: false,
                                                            message: "Please input a revision number",
                                                        }
                                                    ]}

                                                >
                                                    <Input placeholder={'Revision Number'}/>
                                                </Form.Item>
                                            </>
                                            :
                                            null
                                }


                                <Form.Item name="repeatType"
                                           label={t("planning.Task Records.Repetitive Type")}
                                           rules={[{
                                               required: true,
                                               message: t("planning.Task Records.Repetitive Type required"),
                                           },]}>
                                    <Radio.Group
                                        style={{
                                            fontSize: "18px",
                                        }}
                                        onChange={() => {
                                            onChangeStatus();
                                            onChangeIntervalType()
                                        }}
                                    >
                                        <Space direction={"vertical"}>
                                            <Radio value={INTERVAL_TYPE.ONE_TIME} checked={true}>One Time</Radio>
                                            <Radio value={INTERVAL_TYPE.REPETITIVE}>Repetitive</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item label={t("planning.Task Records.APU Control Task")}
                                           name='isApuControl'
                                           valuePropName="checked">
                                    <Checkbox disabled={id} onChange={onChangeCheckbox}></Checkbox>
                                </Form.Item>

                                <Form.Item label={t("planning.Task Records.Threshold")}>
                                    <Form.Item label={<span></span>}
                                               name="thresholdHour"
                                               rules={[{

                                                   required: false,
                                                   message: 'Threshold value can not be less than 0',
                                               }]}>

                                        <Input style={{width: '87%'}}
                                               placeholder={t('planning.Task Records.Input threshold value')}
                                               min={0}
                                               addonAfter={!isAPU ? "FH" : "AH"}/>


                                    </Form.Item>
                                    <Form.Item label={<span></span>}
                                               name="thresholdCycle"
                                               rules={[{

                                                   required: false,
                                                   message: 'Threshold value can not be less than 0',
                                               }]}>

                                        <InputNumber style={{width: '87%'}} min={0}
                                                     placeholder={t('planning.Task Records.Input threshold value')}
                                                     addonAfter={!isAPU ? "FC" : "AC"}/>

                                    </Form.Item>
                                    <Form.Item label={<span></span>} name="thresholdDay"
                                               rules={[{

                                                   required: false,
                                                   message: 'Threshold value can not be less than 0',
                                               }]}>

                                        <InputNumber style={{width: '87%'}} min={0}
                                                     placeholder={t('planning.Task Records.Input threshold value')}
                                                     addonAfter={"DY"}/>

                                    </Form.Item>
                                </Form.Item>

                                {
                                    !oneTime ? null :
                                        (

                                            <Form.Item label={t('planning.Task Records.Interval')}>
                                                <Form.Item label={<span></span>} name="intervalHour"

                                                           rules={[{

                                                               required: false,

                                                               message: 'Interval value can not be less than 0',
                                                           }]}>

                                                    <Input style={{width: '87%'}}
                                                           placeholder={t('planning.Task Records.Input interval value')}
                                                           min={0}
                                                           addonAfter={isAPU ? "AH" : "FH"}/>
                                                </Form.Item>
                                                <Form.Item label={<span></span>}
                                                           name="intervalCycle"
                                                           rules={[{

                                                               required: false,
                                                               message: 'Interval value can not be less than 0',
                                                           }]}>

                                                    <InputNumber style={{width: '87%'}} min={0}
                                                                 placeholder={t('planning.Task Records.Input interval value')}
                                                                 addonAfter={isAPU ? "AC" : "FC"}/>

                                                </Form.Item>
                                                <Form.Item label={<span></span>}
                                                           name="intervalDay"
                                                           rules={[{

                                                               required: false,
                                                               message: 'Interval value can not be less than 0',
                                                           }]}>

                                                    <InputNumber style={{width: '87%'}} min={0}
                                                                 placeholder={t('planning.Task Records.Input interval value')}
                                                                 addonAfter={"DY"}/>

                                                </Form.Item>
                                            </Form.Item>
                                        )
                                }

                            </Col>

                            <Col sm={20} md={10}>


                                <Form.Item
                                    name="sources"
                                    label={t("planning.Task Records.Sources")}

                                >
                                    <Input.TextArea/>
                                </Form.Item>
                                <Form.Item
                                    name="manHours"
                                    label={t("planning.Task Records.Man Hours")}
                                    rules={[{
                                        min: 0,
                                        type: 'number',
                                        message: t("planning.Task Records.Man hours can not be less than 0"),
                                    },]}

                                >
                                    <InputNumber type='number'/>
                                </Form.Item>
                                <Form.Item disabled={!!id} shouldUpdate
                                           label={t("planning.Task Records.Effectivity Type")}
                                           name="effectiveAircraftDtoList">
                                    <Transfer
                                        style={{
                                            width: 500,
                                        }}
                                        listStyle={{
                                            width: 500,
                                        }}
                                        className={'transferAircraft'}
                                        dataSource={aircraftByModelForEffectivity}
                                        titles={[t('planning.Task Records.APPLICABLE'), t('planning.Task Records.NOT APPLICABLE')]}
                                        selectedKeys={selectedKeys}
                                        targetKeys={notApplicable}
                                        onChange={onChange}
                                        onSelectChange={onSelectChange}
                                        onScroll={onScroll}
                                        render={(item,) => (
                                            <Space align="center">
                                                <h4>{item.title}</h4>
                                                {item.input}
                                            </Space>
                                        )}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name='trade'
                                    label={t("planning.Task Records.Trade")}
                                    rules={[{

                                        required: true,
                                        message: "Please select trade",
                                    },]}
                                >
                                    <Select
                                        mode='multiple'
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder={t("planning.Task Records.Please select trade")}

                                    >
                                        {trades?.map((trade) => (<Select.Option key={trade.id} value={trade.name}>
                                            {trade.name}
                                        </Select.Option>))}
                                    </Select>

                                </Form.Item>
                                <Form.Item
                                    name='taskTypeId'
                                    label={t("planning.Task Records.Task Type")}
                                >
                                    <Select
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}

                                        placeholder={t("planning.Task Records.Please select task type")}
                                        dropdownRender={(menu) => (<>
                                            <Button
                                                style={{width: "100%"}}
                                                type="primary"
                                                onClick={() => {
                                                    setShowTaskModal(true);
                                                }}
                                            >
                                                + {t("planning.Task Records.Add Task Type")}
                                            </Button>
                                            {menu}
                                        </>)}

                                    >
                                        {allTaskTypes?.map((taskType) => (
                                            <Select.Option key={taskType.id} value={taskType.id}>
                                                {taskType.name}
                                            </Select.Option>))}
                                    </Select>

                                </Form.Item>

                                <Form.Item
                                    name='status'
                                    label={t("planning.Task Records.Task Status")}

                                >
                                    <Select
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder={t("planning.Task Records.Please select a status")}

                                    >
                                        {allTaskStatus?.map((task) => (<Select.Option key={task.id} value={task.id}>
                                            {task.status}
                                        </Select.Option>))}
                                    </Select>

                                </Form.Item>
                                <Form.Item
                                    name='description'
                                    label={t("planning.Task Records.Description")}
                                >

                                    <Input.TextArea maxLength={500}/>

                                </Form.Item>

                                <Form.Item
                                    name='comment'
                                    label={taskSource === 'SB' || taskSource === 'others' ? 'ATA' : t("planning.Task Records.Comment")}
                                >
                                    <Input.TextArea autoSize maxLength={500}/>
                                </Form.Item>

                            </Col>
                        </Row>
                        <Row>
                            <Col sm={20} md={10}>
                                <Form.Item wrapperCol={{...formLayout.wrapperCol, offset: 8}}>
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

export default AddTaskRecords;
