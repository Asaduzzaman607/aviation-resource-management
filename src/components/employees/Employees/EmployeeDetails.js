import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { notifyResponseError } from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import EmployeeService from '../../../service/employees/EmployeeService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import RibbonCard from '../../common/forms/RibbonCard';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';

const EmployeeDetails = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState({});

  const loadSingleData = async () => {
    try {
      const { data } = await EmployeeService.getEmployeeServiceById(id);
      setSingleData(data);
    } catch (error) {
      notifyResponseError(error);
    }
  };

  useEffect(() => {
    if (!id) return;
    loadSingleData().catch(console.error);
  }, [id]);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-users" />
            <Link to="/employees">&nbsp; employees</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/employees/employee">&nbsp;Employee</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;Employee Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(`Employee details`, `/employees/employee`)}
      >
       <Row>
          <Col
            span={24}
            md={12}
          >
            <Row>
              <Col
                span={12}
                className="mb-10"
              >
                Name:
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.name ? singleData?.name : 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Department:
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.department?.name
                  ? singleData.department?.name
                  : 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Section :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.section?.name || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Designation :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.designation?.name || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Code :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.code || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Father Name :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.fatherName || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Mother Name :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.motherName || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                National ID :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.nationalId || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Passport :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.passport || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Present Address :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.presentAddress || 'N/A'}
              </Col>
            </Row>
          </Col>

          <Col
            span={24}
            md={12}
          >
            <Row>
              <Col
                span={12}
                className="mb-10"
              >
                Activation Code:
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.activationCode || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Email:
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                 {singleData.email || 'N/A'}
              </Col>
      
              <Col
                span={12}
                className="mb-10"
              >
                Office Phone :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.officePhone || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Office Mobile :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.officeMobile || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Resident Phone :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.residentPhone || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Resident Mobile :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.residentMobile || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Blood Group :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.bloodGroup || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
               Permanent Address :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.permanentAddress || 'N/A'}
              </Col>
            </Row>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default EmployeeDetails;
