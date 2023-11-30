import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { notifyResponseError } from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import DepartmentService from '../../../service/employees/DepartmentService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';

const DepartmentDetails = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState({});

  const loadSingleData = async () => {
    try {
      const { data } = await DepartmentService.getDepartmentById(id);
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
            <Link to="/employees/departments">&nbsp;Departments</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;Department Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(`Department details`, `/employees/departments`)}
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
                Name :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.name}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Company:
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.companyId}
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
                {singleData.code}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Info :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.info || 'N/A'}
              </Col>
            </Row>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default DepartmentDetails;
