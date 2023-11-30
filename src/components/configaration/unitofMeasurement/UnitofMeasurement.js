import {Breadcrumb,Row, Col} from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';
import UseUOM from "./uom";
import AddUomForm from "./AddUomForm";
import Permission from "../../auth/Permission";

const UnitOfMeasurement = () => {

    const {
        id,
        form,
        onFinish,
        onReset
    } = UseUOM()

    return (
       <CommonLayout>
          <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        {" "}
                        <Link to="/configurations">
                          {" "}
                          <i className="fas fa-cog" /> &nbsp;Configurations
                        </Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>
                      <Link to="/configurations/unit-of-measurement">
                          {" "}
                        &nbsp;Unit of Measurements
                        </Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>
                      {id ? 'edit' : 'add'}
                      </Breadcrumb.Item>
                </Breadcrumb>
           </ARMBreadCrumbs>
           <Permission permission={["CONFIGURATION_CONFIGURATION_UNIT_OF_MEASUREMENT_SAVE","CONFIGURATION_CONFIGURATION_UNIT_OF_MEASUREMENT_EDIT"]}>
             <ARMCard title={
                    getLinkAndTitle('Unit of Measurement', '/configurations/unit-of-measurement')
                }
                >
                 <Row>
                     <Col sm={20} md={12}>
                       <AddUomForm id={id} form={form} onFinish={onFinish} onReset={onReset}/>
                   </Col>
               </Row>
           </ARMCard>
          </Permission>
       </CommonLayout>
    );
};

export default UnitOfMeasurement;