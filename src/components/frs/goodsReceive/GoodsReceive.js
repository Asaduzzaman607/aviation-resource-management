import CommonLayout from "../../layout/CommonLayout";
import {
    Breadcrumb,
    Col,
    DatePicker, Empty,
    Form,
    notification,
    Row,
    Select,
    Space
} from "antd";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import {Link, useNavigate, useParams} from "react-router-dom";
import {getErrorMessage} from "../../../lib/common/helpers";
import React, {useEffect, useState} from "react";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMForm from "../../../lib/common/ARMForm";
import ARMTable from "../../common/ARMTable";
import ResponsiveTable from "../../common/ResposnsiveTable";
import GoodsReceiveService from "../../../service/GoodsReceiveService";
import moment from "moment";

const {Option} = Select;

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const GoodsReceive = () => {

    const {id} = useParams()
    const navigate  =useNavigate()
    const [form] = Form.useForm();

    const [goodsReceiveItem,setGoodsReceiveItem] = useState({})


    useEffect(() => {
        if (!id) {
            //form.resetFields()
            return
        }
        getGoodsReceiveById().catch(console.error)

    }, [id])

    const getGoodsReceiveById = async () => {
        try {
            const {data} = await GoodsReceiveService.getGoodsReceiveById(id)

            let modifiedValue = {
                ...data,
                grDate: data?.grDate ? moment(data.grDate) : null,
            }
            console.log("modified value",modifiedValue)
            form.setFieldsValue(modifiedValue)

            setGoodsReceiveItem(modifiedValue)

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }

    const onFinish = async (values) => {
        console.log("goods receive values", values)

        const modifiedValues = {
            ...values,
            grDate: values['grDate']?.format('YYYY-MM-DD')
        };

        try {
            if (id) {
                await GoodsReceiveService.updateGoodsReceive(id, modifiedValues)
            } else {
                await GoodsReceiveService.saveGoodsReceive(modifiedValues)
            }
            form.resetFields()
            navigate('/frs/goods-receive-list')
            notification["success"]({
                message: id ? "Successfully updated!" : "Successfully added!",
            })

        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    };

    const onReset = () => {
        if (id) {
            form.setFieldsValue(goodsReceiveItem)
        } else {
            form.resetFields();
        }
    }

    let numbers = [1,2,3]

    return (
        <CommonLayout>

            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to='/frs'>
                            <i className="fa fa-file-certificate" />&nbsp; FRS
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item><Link to='/frs/goods-receive-list'>
                        Goods Receive
                    </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        add
                    </Breadcrumb.Item>

                </Breadcrumb>
            </ARMBreadCrumbs>

            <ARMCard title={
                getLinkAndTitle('Goods Receive', '/frs/goods-receive-list')
            }
            >
                <Row>
                    <Col sm={24} md={12}>
                        <ARMForm
                            {...layout}
                            form={form}
                            name="admin_module"
                            onFinish={onFinish}
                            /*initialValues={{}}*/
                            scrollToFirstError
                            >
                            <Form.Item
                                name="grDate"
                                label="GR Date"
                            >
                             <DatePicker style={{width: '100%'}}/>
                            </Form.Item>

                            <Form.Item
                                name="storeStockInwardId"
                                label="Stock Inward Number"
                            >
                                <Select placeholder="--Please select --">
                                    {
                                        numbers?.map((number,index) => {
                                            return <Option key={index+1}>{`stock inward number ${index+1}`}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>

                            {/*<Form.Item
                                name="orderNo"
                                label="Order No"
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required!"
                                    }
                                ]}
                            >
                                <Select placeholder="--Please select --">
                                    {
                                        numbers?.map((number,index) => {
                                            return <Option key={index}>{`order number ${index+1}`}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>*/}

                            <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                                <Space size="small">
                                    <ARMButton type="primary" htmlType="submit">
                                        {id ? 'Update' : 'Submit'}
                                    </ARMButton>
                                    <ARMButton onClick={onReset} type="primary" danger>
                                        Reset
                                    </ARMButton>
                                </Space>
                           </Form.Item>
                       </ARMForm>
                    </Col>
                </Row>
            </ARMCard>
            &nbsp;
            <ARMCard title="Goods Receive Details">
                <ResponsiveTable>
                    <ARMTable>
                        <thead>
                        <tr>
                            <th>SIB No</th>
                            <th>Order No</th>
                            <th>Part No</th>
                            <th>Description</th>
                            <th>is Lot</th>
                            <th>Serial/Lot No</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Condition</th>
                            <th>Item Program Type</th>
                            <th>Consinee</th>
                            <th>InvoiceQuantity</th>
                            <th>DeficientDamaged</th>
                            <th>Rack Life Type</th>
                            <th>Expiry Date</th>
                            <th>Rack Row Bin</th>
                            <th>Remarks</th>
                        </tr>
                        </thead>
                        <tbody>
                            {/* <tr>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, iste.</td>
                            <td>yes</td>
                            <td>133</td>
                            <td>23</td>
                            <td>7890</td>
                            <td>good</td>
                            <td>bad</td>
                            <td>unknown</td>
                            <td>34</td>
                            <td>Not</td>
                            <td>type-1</td>
                            <td>2022-12-12</td>
                            <td>RackView row bin-1</td>
                            <td>very bad</td>
                        </tr>*/}
                        </tbody>
                    </ARMTable>
                </ResponsiveTable>
                <Row>
                    <Col style={{margin: '0 auto'}}>
                        {/*{parts.length === 0 ? (*/}
                        <Row justify="end">
                           <Empty style={{marginTop: "10px"}}/>
                        </Row>
                        {/*    ) : null}*/}
                    </Col>
                </Row>
            </ARMCard>
        </CommonLayout>
    )
}
export default GoodsReceive