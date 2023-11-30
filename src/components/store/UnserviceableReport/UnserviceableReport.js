import { Breadcrumb, Col, Empty, Pagination, Row } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { usePaginate } from '../../../lib/hooks/paginations';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import UnserviceableReportPrint from './UnserviceableReportPrint';

const UnserviceableReport = () => {
  const { collection, page, totalElements, paginate, size } = usePaginate(
    'UnserviceableReport',
    '/store_part_serial/unserviceableComponentList'
  );

  const [downloadReport, setDownloadReport] = useState(false);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/store">
              {' '}
              <i className="fa fa-shopping-basket" />
              &nbsp; store
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Unserviceable Report</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission="STORE_STORE_PARTS_AVAILABILITY_PARTS_AVAILABILITY_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            'Unserviceable Report',
            '/store',
            false,
            'STORE_STORE_PARTS_AVAILABILITY_PARTS_AVAILABILITY_SAVE'
          )}
        >
          <div>
            <ARMButton
              onClick={() => setDownloadReport(true)}
              type="primary"
              danger
              style={{
                backgroundColor: '#04aa6d',
                border: '1px solid #04aa6d',
                marginBottom: '15px',
              }}
              disabled={collection?.length === 0 ? true : false}
            >
              Download Report
            </ARMButton>
          </div>
          <ResponsiveTable>
            <ARMTable>
              <thead>
                <tr>
                  <td>PART NO</td>
                  <td>DESCRIPTION</td>
                  <td>SERIAL NO.</td>
                  <td>REMOVED FROM</td>
                  <td>REMOVED DATE</td>
                  <td>REASON REMOVED</td>
                  <td>RTND BY & ID</td>
                  <td>RCVD BY & ID</td>
                  <td>LOCATION</td>
                  <td>REMARKS</td>
                </tr>
              </thead>
              <tbody>
                {collection?.map((data, index) => (
                  <tr key={index}>
                    <td>{data.partNo}</td>
                    <td>{data.description}</td>
                    <td>{data.serialNo}</td>
                    <td>{data.removedFrom}</td>
                    <td>{data.removedDate}</td>
                    <td>{data.reasonRemoved}</td>
                    <td>{data.rtndById}</td>
                    <td>{data.rcvdById}</td>
                    <td>{data.location}</td>
                    <td>{data.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </ARMTable>
          </ResponsiveTable>

          <Row>
            <Col style={{ margin: '0 auto' }}>
              {collection.length === 0 ? (
                <Row justify="end">
                  <Empty style={{ marginTop: '10px' }} />
                </Row>
              ) : (
                <Row justify="center">
                  <Col style={{ marginTop: 10 }}>
                    <Pagination
                      showSizeChanger={false}
                      onShowSizeChange={console.log}
                      pageSize={size}
                      current={page}
                      onChange={paginate}
                      total={totalElements}
                    />
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
          <UnserviceableReportPrint downloadReport={downloadReport} />
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default UnserviceableReport;
