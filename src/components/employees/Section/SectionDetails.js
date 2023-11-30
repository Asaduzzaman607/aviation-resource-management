import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { notifyResponseError } from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import SectionService from '../../../service/employees/SectionService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';

const SectionDetails = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState({});

  const loadSingleData = async () => {
    try {
      const { data } = await SectionService.getSectionById(id);
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
            <Link to="/employees/sections">&nbsp;Sections</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;Tracker Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(`Section details`, `/employees/sections`)}
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
            </Row>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default SectionDetails;
