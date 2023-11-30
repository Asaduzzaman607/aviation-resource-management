import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { notifyResponseError } from '../../../lib/common/notifications';
import API from '../../../service/Api';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import CaabInfoDetails from './CaabInfoDetails';

function StoreInspectionDetails() {
  let { id } = useParams();
  const [singleData, setSingleData] = useState({});

  const getInspectionById = async () => {
    try {
      const { data } = await API.get(`/store-inspector/store-inspection/${id}`);
      setSingleData(data);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    (async () => {
      await getInspectionById();
    })();
  }, [id]);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-archive" />
            <Link to="/store">&nbsp; Store </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/storeInspector/store-inspection-list">
              Store Inspections
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Store Inspection Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(
          'Store Inspection Details',
          '/storeInspector/store-inspection-list'
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
                Inspection No :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.inspectionNo || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Part Name :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.partDescription || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Part Return No. :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.storeReturn?.storeReturnPartStoreReturnVoucherNo ||
                  'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                GRN No :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.grnNo || 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                HST/Cal :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.expireDate || 'N/A'}
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                Shelf Life :
              </Col>

              <Col
                span={12}
                className="mb-10"
              >
                {singleData.shelfLife || 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Auth Release Cert :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.authReleaseCertNo || 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Remarks :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.remarks || 'N/A'}
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
                TSN :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.tsn || 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                CSN :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.csn || 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                TSO :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.tso || 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                CSO :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.cso || 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                TSR :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.tsr || 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                CSR :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.csr || 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Part No :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.partNo || 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Serial No :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.serialIdNoDto?.serialNo || 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Status :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.status || 'N/A'}
              </Col>
            </Row>
          </Col>
          {/* if not inward && caabEnabled is true */}
          {!singleData.storeStockInward &&
          singleData.storeReturn?.caabEnabled ? (
            <CaabInfoDetails caabInfo={singleData?.storeReturn} />
          ) : null}

          <ResponsiveTable style={{ marginTop: '20px' }}>
            <ARMTable>
              <thead>
                <tr>
                  <th>Description of Inspection</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {singleData.inspectionCriterionList?.map((criterion) => (
                  <tr key={criterion.id}>
                    <td>{criterion.description}</td>
                    <td>{criterion.inspectionStatus}</td>
                  </tr>
                ))}
              </tbody>
            </ARMTable>
          </ResponsiveTable>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
}

export default StoreInspectionDetails;
