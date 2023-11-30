import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import TrackerService from '../../../service/logistic/TrackerService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import RibbonCard from '../../common/forms/RibbonCard';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import {getFileExtension, getFileName} from "../../../lib/common/helpers";
import {FileOutlined} from "@ant-design/icons";

const TrackerDetails = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState();

  const loadSingleData = async () => {
    const { data } = await TrackerService.getTrackerById(id);
    setSingleData(data);
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
            <i className="fas fa-hand-holding-box" />
            <Link to="/logistic">&nbsp; Logistic</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/logistic/tracker-list">&nbsp;Tracker List</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;Tracker Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(`Tracker details`, `/logistic/tracker-list`)}
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
                Tracker No. :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.trackerNo ? singleData?.trackerNo : 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Tracker Status :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.trackerStatus ? singleData?.trackerStatus : 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Part Order No. :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.partOrderNo ? singleData?.partOrderNo : 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Documents:
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.attachment?.map((file, index) => (
                  <p key={index}>
                    {getFileExtension(file) ? (
                      <img
                        alt="img"
                        width="30"
                        height="30"
                        src={file}
                      />
                    ) : (
                      <FileOutlined style={{ fontSize: '25px' }} />
                    )}
                    <a href={file}>
                      {getFileName(file)}
                    </a>
                  </p>
                ))}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <RibbonCard ribbonText={'LOCATION DETAILS'}>
              <ResponsiveTable style={{ marginTop: '20px' }}>
                <ARMTable>
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleData?.poTrackerLocationList?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.location}</td>
                        <td>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </ARMTable>
              </ResponsiveTable>
            </RibbonCard>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default TrackerDetails;
