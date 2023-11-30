import React, {useEffect} from 'react';
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {
    AutoComplete,
    Breadcrumb,
    Button,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
    Space
} from "antd";
import {Link, useParams} from "react-router-dom";
import {DeleteOutlined, ProfileOutlined} from "@ant-design/icons";
import Permission from "../../auth/Permission";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import {formLayout} from "../../../lib/constants/layout";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import {useTranslation} from "react-i18next";
import ARMTable from "../../common/ARMTable";
import {DateFormat} from "../../planning/report/Common";
import {useMultipleDefect} from "../../../lib/hooks/planning/useMultipleDefect";
import {useAircraftsList} from "../../../lib/hooks/planning/aircrafts";
import TextArea from "antd/es/input/TextArea";
import styled from "styled-components";


const AntdFormItem = styled(Form.Item)`
  .ant-col-16 {
    max-width: 100%;
  }
`;

const AddMultipleDefect = () => {
    const {t} = useTranslation()
    let {dId: id} = useParams();
    const {
        onFinish,
        onReset,
        form,
        getDefectByAircraftId,
        handleSearchDefects,
        allDefects,
        defectIds,
        onChangeDefectId,
        removeGeneratedDefect,
        generateDefect,
        parts,
        locations,
        defectTypes
    } = useMultipleDefect();

    const {aircrafts, initAircrafts} = useAircraftsList()
    const defectsDtoListValue = form?.getFieldValue('defectDtoList')


    useEffect(() => {
        (async () => {
            await initAircrafts();
        })();
    }, [])


    const title = id ? `Defect ${t("common.Edit")}` : `Defect ${t("common.Add")}`;
    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/reliability">
                            <ProfileOutlined/>
                            &nbsp; Reliability
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <Link to="/reliability/defect">Defects</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission={[""]} showFallback>
                <ARMCard title={getLinkAndTitle(title, "/reliability/defect", false, "")}>

                    <div>
                        <Form
                            {...formLayout}
                            form={form}
                            name="multipleDefectForm"
                            onFinish={onFinish}
                            scrollToFirstError
                            initialValues={{
                                aircraftId: null
                            }}
                        >
                            <AntdFormItem>
                            <Row>
                                <Col sm={24} md={24}>
                                    <Form.Item label='Aircraft'
                                               rules={[
                                                   {
                                                       required: true,
                                                       message: 'Please select Aircraft ',
                                                   },
                                               ]}>
                                        <Row gutter={8}>
                                            <Col span={18}>
                                                <Row gutter={8}>
                                                    <Col span={12}>
                                                        <Form.Item
                                                            name="aircraftId"
                                                            rules={[
                                                                {
                                                                    required: false,
                                                                    message: 'Please select Aircraft ',
                                                                },
                                                            ]}>
                                                            <Select placeholder="--Select Aircraft --"

                                                                    onChange={(e) => getDefectByAircraftId(e)}
                                                            >
                                                                {aircrafts?.map((item, index) => {
                                                                    return (
                                                                        <Select.Option key={index} value={item.id}>
                                                                            {item.name}
                                                                        </Select.Option>
                                                                    );
                                                                })}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12}>

                                                        <Form.Item
                                                            name="date"
                                                            rules={[
                                                                {
                                                                    required: false,
                                                                    message: 'Please select date ',
                                                                },
                                                            ]}
                                                        >
                                                            <DatePicker.RangePicker format="DD-MM-YYYY"
                                                                                    style={{width: '100%'}}/>
                                                        </Form.Item>

                                                    </Col>
                                                </Row>

                                            </Col>
                                            <Col span={6}>
                                                <Button
                                                    onClick={
                                                        (searchKey) => handleSearchDefects(searchKey)}>Find
                                                    Defects</Button>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    {
                                        allDefects.length > 0 ?
                                            <Form.Item name='taskListView' label='Defects'>
                                                <Row className="table-responsive"
                                                     style={
                                                         allDefects?.length < 10 ? {height: "auto"} : {height: "450px"}}
                                                >
                                                    <Checkbox.Group style={{width: '100%'}} value={defectIds}
                                                                    onChange={onChangeDefectId}>
                                                        <ARMTable className='foreCastLdNdTaskTable'>
                                                            <thead style={{
                                                                position: 'sticky',
                                                                top: 0,
                                                                overflow: 'auto',
                                                                zIndex: 99
                                                            }}>
                                                            <tr>
                                                                <th>Select Defect</th>
                                                                <th>ATA</th>
                                                                <th>P/N</th>
                                                                <th>Reference</th>
                                                                <th>Defect Des</th>
                                                                <th>Action Des</th>
                                                                <th>Date</th>
                                                            </tr>

                                                            </thead>

                                                            <tbody>
                                                            {allDefects?.map((defect, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <Checkbox id={defect.defectId}
                                                                                  value={defect.defectId}
                                                                                  style={{marginTop: '5px'}}/>
                                                                    </td>
                                                                    <td>{defect.ata}</td>
                                                                    <td>{defect.partNo}</td>
                                                                    <td>{defect.reference}</td>
                                                                    <td>{defect.defectDesc}</td>
                                                                    <td>{defect.actionDesc}</td>
                                                                    <td>{DateFormat(defect.amlDate)}</td>

                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </ARMTable>
                                                    </Checkbox.Group>

                                                </Row>
                                                {
                                                    allDefects?.length > 0 ?
                                                        <Button
                                                            type={"primary"}
                                                            style={{float: 'left', marginTop: '30px'}}
                                                            disabled={defectIds?.length < 1}
                                                            onClick={generateDefect}>
                                                            Generate Defect
                                                        </Button>
                                                        : null

                                                }

                                            </Form.Item>
                                            : null
                                    }
                                    {
                                        defectsDtoListValue?.length < 0 ? null :


                                                <Form.Item label={'Generated Defects'} name="defectDtoList">

                                                    <Form.List name="defectDtoList" label='Defect Procedure'>
                                                        {(fields, {add, remove}) => (
                                                            <>
                                                                {fields.map((field, index) => (


                                                                    <Row key={`${index}-defectDtoList`} gutter={8}>

                                                                            <Form.Item>

                                                                                <Row className="table-responsive">

                                                                                    <Form.List name={[field.name]}>
                                                                                        {(tasks, {add, remove}) => (
                                                                                            <>
                                                                                                <Form.Item shouldUpdate
                                                                                                           style={{marginBottom: "-2px"}}>
                                                                                                    <Input
                                                                                                        value={`${form.getFieldValue(['defectDtoList', field.name, 0, "aircraftName"])} `}
                                                                                                        disabled/>
                                                                                                </Form.Item>
                                                                                                <ARMTable>
                                                                                                    <thead>
                                                                                                    <tr style={{fontSize: "10px"}}>
                                                                                                        <th>ATA</th>
                                                                                                        <th>Part No</th>
                                                                                                        <th>Defect
                                                                                                            Type
                                                                                                        </th>
                                                                                                        <th>Defect
                                                                                                            Description
                                                                                                        </th>
                                                                                                        <th>Action
                                                                                                            Decription
                                                                                                        </th>
                                                                                                        <th>Reference</th>
                                                                                                        <th>AML Date
                                                                                                        </th>
                                                                                                        <th>Action</th>
                                                                                                    </tr>
                                                                                                    </thead>
                                                                                                    <tbody>
                                                                                                    {tasks.map((field, key) => (
                                                                                                        <tr key={key}>


                                                                                                            <Form.Item
                                                                                                                hidden={true}
                                                                                                                {...tasks}
                                                                                                                name={[field.name, "defectId"]}
                                                                                                                rules={[
                                                                                                                    {
                                                                                                                        required: false,
                                                                                                                        message: "Missing defect Id",
                                                                                                                    },
                                                                                                                ]}
                                                                                                                style={{margin: "5px"}}
                                                                                                            >
                                                                                                                <Input/>
                                                                                                            </Form.Item>

                                                                                                            <td>

                                                                                                                <Form.Item
                                                                                                                    {...tasks}
                                                                                                                    name={[field.name, "locationId"]}
                                                                                                                    rules={[
                                                                                                                        {
                                                                                                                            required: false,
                                                                                                                            message: "Missing ata",
                                                                                                                        },
                                                                                                                    ]}
                                                                                                                    style={{margin: "5px"}}
                                                                                                                >
                                                                                                                    <Select
                                                                                                                        allowClear
                                                                                                                        showSearch
                                                                                                                        filterOption={(inputValue, option) =>
                                                                                                                            option.children
                                                                                                                                .toString("")
                                                                                                                                .toLowerCase()
                                                                                                                                .includes(inputValue.toLowerCase())
                                                                                                                        }
                                                                                                                        placeholder={"Please Select ATA"}
                                                                                                                    >
                                                                                                                        {locations?.map((loc) => {
                                                                                                                            return (
                                                                                                                                <Select.Option
                                                                                                                                    key={loc.id}
                                                                                                                                    value={loc.id}>
                                                                                                                                    {loc.name}
                                                                                                                                </Select.Option>
                                                                                                                            );
                                                                                                                        })}
                                                                                                                    </Select>
                                                                                                                </Form.Item>
                                                                                                            </td>
                                                                                                            <td>

                                                                                                                <Form.Item
                                                                                                                    {...tasks}
                                                                                                                    name={[field.name, "partId"]}
                                                                                                                    rules={[
                                                                                                                        {
                                                                                                                            required: false,
                                                                                                                            message: "Missing part no",
                                                                                                                        },
                                                                                                                    ]}
                                                                                                                    style={{margin: "5px"}}
                                                                                                                >
                                                                                                                    <Select
                                                                                                                        allowClear
                                                                                                                        showSearch
                                                                                                                        filterOption={(inputValue, option) =>
                                                                                                                            option.children
                                                                                                                                .toString("")
                                                                                                                                .toLowerCase()
                                                                                                                                .includes(inputValue.toLowerCase())
                                                                                                                        }
                                                                                                                        placeholder={"Please Select Part"}
                                                                                                                    >
                                                                                                                        {parts?.map((part) => {
                                                                                                                            return (
                                                                                                                                <Select.Option
                                                                                                                                    key={part.partId}
                                                                                                                                    value={part.partId}>
                                                                                                                                    {part.partNo}
                                                                                                                                </Select.Option>
                                                                                                                            );
                                                                                                                        })}
                                                                                                                    </Select>
                                                                                                                </Form.Item>
                                                                                                            </td>
                                                                                                            <td>

                                                                                                                <Form.Item
                                                                                                                    {...tasks}
                                                                                                                    name={[field.name, "defectType"]}
                                                                                                                    rules={[
                                                                                                                        {
                                                                                                                            required: false,
                                                                                                                            message: "Missing defect type",
                                                                                                                        },
                                                                                                                    ]}
                                                                                                                    style={{margin: "5px"}}
                                                                                                                >
                                                                                                                    <Select
                                                                                                                        placeholder="Please Select Defect Type"
                                                                                                                    >
                                                                                                                        {defectTypes?.map((item) => {
                                                                                                                            return (
                                                                                                                                <Select.Option
                                                                                                                                    key={item.id}
                                                                                                                                    value={item.id}>
                                                                                                                                    {item?.type}
                                                                                                                                </Select.Option>
                                                                                                                            );
                                                                                                                        })}
                                                                                                                    </Select>
                                                                                                                </Form.Item>
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                <Form.Item
                                                                                                                    {...tasks}
                                                                                                                    name={[field.name, "defectDesc"]}
                                                                                                                    rules={[
                                                                                                                        {
                                                                                                                            required: false,
                                                                                                                            message: "Missing defectDesc",
                                                                                                                        },
                                                                                                                    ]}
                                                                                                                    style={{margin: "5px"}}
                                                                                                                >
                                                                                                                    <TextArea
                                                                                                                        maxLength={255}
                                                                                                                        style={{
                                                                                                                            width: '100%',
                                                                                                                            height: 'auto'
                                                                                                                        }}
                                                                                                                        autoSize/>
                                                                                                                </Form.Item>
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                <Form.Item
                                                                                                                    {...tasks}
                                                                                                                    name={[field.name, "actionDesc"]}
                                                                                                                    rules={[
                                                                                                                        {
                                                                                                                            required: false,
                                                                                                                            message: "Missing actionDesc",
                                                                                                                        },
                                                                                                                    ]}
                                                                                                                    style={{margin: "5px"}}
                                                                                                                >
                                                                                                                    <TextArea
                                                                                                                        maxLength={255}
                                                                                                                        style={{
                                                                                                                            width: '100%',
                                                                                                                            height: 'auto'
                                                                                                                        }}
                                                                                                                        autoSize/>
                                                                                                                </Form.Item>
                                                                                                            </td>

                                                                                                            <td>
                                                                                                                <Form.Item
                                                                                                                    {...tasks}
                                                                                                                    name={[field.name, "reference"]}
                                                                                                                    rules={[
                                                                                                                        {
                                                                                                                            required: false,
                                                                                                                            message: "Missing reference",
                                                                                                                        },
                                                                                                                    ]}
                                                                                                                    style={{margin: "5px"}}
                                                                                                                >
                                                                                                                    <TextArea
                                                                                                                        maxLength={255}
                                                                                                                        style={{
                                                                                                                            width: '100%',
                                                                                                                            height: 'auto'
                                                                                                                        }}
                                                                                                                        autoSize/>
                                                                                                                </Form.Item>
                                                                                                            </td>

                                                                                                            <td>
                                                                                                                <Form.Item
                                                                                                                    {...tasks}
                                                                                                                    name={[field.name, "date"]}
                                                                                                                    rules={[
                                                                                                                        {
                                                                                                                            required: false,
                                                                                                                            message: "Missing description",
                                                                                                                        },
                                                                                                                    ]}
                                                                                                                    style={{margin: "5px"}}
                                                                                                                >
                                                                                                                    <DatePicker
                                                                                                                        style={{width: '100%'}}
                                                                                                                        format='DD-MMM-YYYY'/>

                                                                                                                </Form.Item>
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                <ARMButton
                                                                                                                    type="primary"
                                                                                                                    size="small"
                                                                                                                    style={{
                                                                                                                        backgroundColor: 'white',
                                                                                                                        borderColor: 'grey',
                                                                                                                        color: 'red',
                                                                                                                        margin: '4px'
                                                                                                                    }}
                                                                                                                    onClick={() => removeGeneratedDefect(index, field.name)}>
                                                                                                                    <DeleteOutlined
                                                                                                                        twoToneColor/>

                                                                                                                </ARMButton>

                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    ))}
                                                                                                    </tbody>
                                                                                                </ARMTable>

                                                                                            </>
                                                                                        )}
                                                                                    </Form.List>

                                                                                </Row>
                                                                            </Form.Item>

                                                                    </Row>

                                                                ))}


                                                            </>)
                                                        }
                                                    </Form.List>


                                                </Form.Item>


                                    }

                                </Col>
                            </Row>
                                </AntdFormItem>

                            <Row>
                                <Col sm={20} md={3}>
                                    <Form.Item wrapperCol={{...formLayout.wrapperCol, offset: 8}}>
                                        <Space size="small">
                                            <ARMButton size="medium" type="primary" htmlType="submit">
                                                {id ? t("common.Update") : t("common.Submit")}
                                            </ARMButton>
                                            <ARMButton
                                                onClick={onReset}
                                                size="medium"
                                                type="primary"
                                                danger
                                            >
                                                {t("common.Reset")}
                                            </ARMButton>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>

                </ARMCard>
            </Permission>
        </CommonLayout>
    );
};

export default AddMultipleDefect;
