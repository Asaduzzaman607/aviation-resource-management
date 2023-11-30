import { Col, Row } from 'antd';
import Space from 'antd/lib/space';
import { useNavigate } from 'react-router-dom';
import ARMButton from '../../common/buttons/ARMButton';
import RequisitionDetailsCabb from '../requisition/RequisitionDetailsCabb';

const PartReturnModal = ({isServiceable, partReturn }) => {
  const navigate = useNavigate();
  const { partsDetailViewModels } = partReturn;
  const partViewModel = partsDetailViewModels[0];
  const printView = () => {
    const partReturnData={
      ...partReturn,
      workOrderNumber:isServiceable.workOrderNumber,
      sRcreateDate:isServiceable.sRcreateDate,
      storeReturnStatusType:isServiceable.storeReturnStatusType,
    }
    if (isServiceable.isServiceAble) {

      navigate(`/store/serviceable-item-print/${partViewModel.id}`, { state: { partReturnData } });
    } else {
      navigate('/store/unserviceable-item-print', { state: { partReturnData } });
    }
  };
  return (
    <div>
      <Row>
        <Col
          span={24}
          md={12}
        >
          <Row>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              Aircraft Name :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.aircraftName}
            </Col>

            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              Airport Name :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.airportName}
            </Col>

            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              Auth Code No :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.authCodeNo}
            </Col>

            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              Installed Part Serial No :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.installedPartSerialNo?.serialNo}
            </Col>

            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              Removed Part Serial No :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.removedPartSerialNo?.serialNo}
            </Col>

            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              Position :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.position}
            </Col>

            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              CSN :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.csn}
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
              style={{ marginBottom: '10px' }}
            >
              CSO :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.cso}
            </Col>

            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              CSR :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.csr}
            </Col>

            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              TSN :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.tsn}
            </Col>

            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              TSO :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.tso}
            </Col>

            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              TSR :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.tsr}
            </Col>

            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              Removal Date :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.removalDate}
            </Col>

            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              Reason Removed :
            </Col>
            <Col
              span={12}
              style={{ marginBottom: '10px' }}
            >
              {partViewModel?.reasonRemoved}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col
          span={24}
          md={24}
        >
          {partViewModel.caabEnabled ? (
            <>
              <RequisitionDetailsCabb partViewModel={partViewModel} />
            </>
          ) : (
            ''
          )}
        </Col>
      </Row>
      <Row>
        <Space>
          <ARMButton
            onClick={printView}
            type={'primary'}
          >
            Preview
          </ARMButton>
        </Space>
      </Row>
    </div>
  );
};

export default PartReturnModal;
