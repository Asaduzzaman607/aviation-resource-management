import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { notifyResponseError } from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import DesignationService from '../../../service/employees/DesignationService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import RibbonCard from '../../common/forms/RibbonCard';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';

const DesignationDetails = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState({});

  const loadSingleData = async () => {
    try {
      const { data } = await DesignationService.getDesignationById(id);
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
            <Link to="/employees/designations">&nbsp;Designations</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;Designation Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(
          `Designation details`,
          `/employees/designations`
        )}
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
                Company:
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.department?.companyId || 'N/A'}
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
                {singleData.department?.code || 'N/A'}
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
                {singleData.department?.info || 'N/A'}
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
            </Row>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default DesignationDetails;
