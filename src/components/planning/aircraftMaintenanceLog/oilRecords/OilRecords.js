import React, {useEffect, useState} from 'react';
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {
    Breadcrumb,

    Col,

    Empty,
    Form,

    notification,

    Row,
    Select,

} from "antd";
import {Link, useParams} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMForm from "../../../../lib/common/ARMForm";
import ARMButton from "../../../common/buttons/ARMButton";
import {
    EditOutlined,
    FilterOutlined,


} from "@ant-design/icons";
import ActiveInactive from "../../../common/ActiveInactive";
import ARMTable from "../../../common/ARMTable";

import {getErrorMessage} from "../../../../lib/common/helpers";

import OilRecordsServices from "../../../../service/OilRecordsServices";
import ActiveInactiveButton from "../../../common/buttons/ActiveInactiveButton";

import {scrollToTop} from "../../../configaration/company/Company";

const Option = Select.Option;

const OilRecords = () => {
    const [form] = Form.useForm();

    const id = useParams()

    const [oilRecords, setOilRecords] = useState([])
    const [isActive, setIsActive] = useState(true)

    const [amls, setAmls] = useState([])


    useEffect(() => {
        getAllAml();
        scrollToTop();
    }, []);
    useEffect(() => {
        statusValue().catch(console.error)
    }, [isActive]);

    // render all the AMLs


    const getAllAml = () => {
        OilRecordsServices.getAllAml(true)
            .then((response) => {
                setAmls(response.data.model)
            })
            .catch((error) => {
                console.log("something went wrong", error);
            });
    };


    // handle status value

    const statusValue = async () => {


        const value = {
            amlId: form.getFieldsValue('amlId').amlId,
            type1: 1,
            type2: 2,
            isActive: isActive


        }
        try {
            const {data} = await OilRecordsServices.findOilRecord(value);
            setOilRecords(data ? data : []);
        } catch (error) {
            notification["error"]({message: getErrorMessage(error)});
            setOilRecords([])
        }
    }


    // filter based on ATL Page No
    const onFinish = async (values) => {

        const value = {
            amlId: values.amlId,
            isActive: isActive
        }
        try {
            const {data} = await OilRecordsServices.findOilRecord(value);
            setOilRecords(data ? data : []);
        } catch (error) {
            setOilRecords([])
        }
    };


    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item> <Link to='/planning'> <i className="fas fa-chart-line"/> &nbsp;Planning
                    </Link></Breadcrumb.Item>

                    <Breadcrumb.Item>
                        Oil Records
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <ARMCard
                title={
                    getLinkAndTitle(' Oil Records', '/planning/oil-records/add', true)
                }
            >
                <ARMForm
                    initialValues={{pageSize: 10}}
                    onFinish={onFinish} form={form}
                > <Row gutter={20}>
                    <Col xs={24} md={12} lg={5}>
                        <Form.Item name="amlId">
                            <Select placeholder="--Select ATL page no--">
                                {amls?.map((item, index) => {
                                    return (
                                        <Option key={index} value={item.aircraftMaintenanceLogId}>
                                            {item.pageNo}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>

                    </Col>

                    <Col xs={24} md={12} lg={4}>
                        <Form.Item>
                            <ARMButton size="middle" type="primary" htmlType="submit">
                                <FilterOutlined/> Filter
                            </ARMButton>
                        </Form.Item>

                    </Col>
                </Row>
                </ARMForm>
                <Row justify={"space-between"}>
                    <ActiveInactive isActive={isActive} setIsActive={setIsActive}/>

                </Row>

                <Row className='table-responsive'>
                    <ARMTable>
                        <thead>

                        </thead>
                        <tbody>
                        <tr>
                            <th rowSpan={2}> Type

                            </th>
                            <th colSpan={3}>Hyd.Oil</th>
                            <th colSpan={2}>Engine Oil</th>
                            <th rowSpan={2}>APU Oil</th>
                            <th colSpan={2}>CSD/IDG Oil</th>
                            <th rowSpan={2}>Fuel Record</th>
                            <th rowSpan={2}>Action</th>
                        </tr>
                        <tr>
                            <th>S1</th>
                            <th>S2</th>
                            <th>S3</th>
                            <th>W1</th>
                            <th>W2</th>
                            <th>1</th>
                            <th>2</th>

                        </tr>


                        {
                            oilRecords.map((oilRecord) => (

                                <tr key={oilRecord.amlOilRecordId}>
                                    {
                                        oilRecord.type === 1 ?
                                            <td className={'typeOfOilRecord'}> On Arrival</td> : oilRecord.type === 2 ?
                                                <td className={'typeOfOilRecord'}>Uplift</td> :
                                                <td className={'typeOfOilRecord'}> Total</td>
                                    }
                                    <td> {oilRecord.hydOil1 === -1 ? 'F' : oilRecord.hydOil1 == null ? 0 : oilRecord.hydOil1}</td>
                                    <td> {oilRecord.hydOil2 === -1 ? 'F' : oilRecord.hydOil2 == null ? 0 : oilRecord.hydOil2}</td>
                                    <td> {oilRecord.hydOil3 === -1 ? 'F' : oilRecord.hydOil3 == null ? 0 : oilRecord.hydOil3}</td>
                                    <td> {oilRecord.engineOil1 === -1 ? 'F' : oilRecord.engineOil1 == null ? 0 : oilRecord.engineOil1}</td>
                                    <td> {oilRecord.engineOil2 === -1 ? 'F' : oilRecord.engineOil2 == null ? 0 : oilRecord.engineOil2}</td>
                                    <td> {oilRecord.apuOil === -1 ? 'F' : oilRecord.apuOil == null ? 0 : oilRecord.apuOil}</td>
                                    <td> {oilRecord.csdOil1 === -1 ? 'F' : oilRecord.csdOil1 == null ? 0 : oilRecord.csdOil1}</td>
                                    <td> {oilRecord.csdOil2 === -1 ? 'F' : oilRecord.csdOil2 == null ? 0 : oilRecord.csdOil2}</td>
                                    <td> {oilRecord.oilRecord === -1 ? 'F' : oilRecord.oilRecord == null ? 0 : oilRecord.oilRecord}</td>
                                    <td>
                                        {
                                            oilRecord.amlOilRecordId === null ?
                                                <ActiveInactiveButton
                                                    isActive={isActive}
                                                    handleOk={async () => {
                                                        try {
                                                            await OilRecordsServices.toggleStatus(oilRecord.amlId, !isActive);
                                                            statusValue().catch(console.error)
                                                            notification['success']({message: "Status Changed Successfully!"});
                                                        } catch (e) {
                                                            notification['error']({message: getErrorMessage(e)});
                                                        }
                                                    }}
                                                /> :


                                                <Link to={`edit/${oilRecord.amlOilRecordId}`}>
                                                    <ARMButton type="primary" size="small" style={{
                                                        backgroundColor: '#6e757c',
                                                        borderColor: '#6e757c',

                                                    }}>
                                                        <EditOutlined/>

                                                    </ARMButton>
                                                </Link>


                                        }
                                    </td>

                                </tr>
                            ))


                        }
                        </tbody>
                    </ARMTable>
                </Row>

                <Row>
                    <Col style={{margin: '0 auto'}}>
                        {oilRecords?.length === 0 ? (
                            <Row justify="end">
                                <tbody>
                                <Empty style={{marginTop: "10px"}}/>
                                </tbody>
                            </Row>
                        ) : null}
                    </Col>
                </Row>

            </ARMCard>
        </CommonLayout>
    );
};

export default OilRecords;
