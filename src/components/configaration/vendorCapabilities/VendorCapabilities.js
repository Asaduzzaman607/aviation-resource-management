import React from 'react';
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, DatePicker, Form, Input, notification, Radio, Row, Select, Space} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import {getErrorMessage} from "../../../lib/common/helpers";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import {useVendorCapabilities} from "../hooks/vendorCapabilities";
import Permission from "../../auth/Permission";

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const VendorCapabilities = () => {
const {
    id,
    form,
    onFinish,
    onReset
}=useVendorCapabilities();

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <i className="fas fa-cog"/>
                        <Link to="/configurations">&nbsp; Configurations</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/configurations/vendor-capabilities-list">Vendor Capabilities</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission={["CONFIGURATION_CONFIGURATION_VENDOR_CAPABILITIES_SAVE","CONFIGURATION_CONFIGURATION_VENDOR_CAPABILITIES_EDIT"]}>
           <ARMCard
               title={getLinkAndTitle(
                   'Vendor Capabilities',
                   '/configurations/vendor-capabilities-list',

               )}
           >
               <ARMForm
                   {...layout}
                   form={form}
                   name="basic"
                   onFinish={onFinish}
                   autoComplete="off"
                   style={{
                       backgroundColor: "#ffffff",
                   }}
               >
                   <Row>
                       <Col  sm={20} md={10}>
                           <Form.Item
                               name="name"
                               label="Capabilities Name"
                               rules={[
                                   {
                                       required: true,
                                       message: 'Capabilities name is required!',
                                   },
                                   {
                                       whitespace: true,
                                       message: 'Only space is not allowed!',
                                   },
                                   {
                                       max: 255,
                                       message: 'Maximum 255 character allowed',
                                   },
                               ]}
                           >
                               <Input/>
                           </Form.Item>


                       </Col>
                   </Row>
                   <Form.Item wrapperCol={{...layout.wrapperCol,offset:3}}>
                       <Space size="small">
                           <ARMButton type="primary" htmlType="submit">
                               {id ? 'Update' : 'Submit'}
                           </ARMButton>
                           <ARMButton onClick={ onReset} type="primary" danger>
                               Reset
                           </ARMButton>
                       </Space>
                   </Form.Item>
               </ARMForm>
           </ARMCard>
          </Permission>
        </CommonLayout>
    )
        ;
};

export default VendorCapabilities;