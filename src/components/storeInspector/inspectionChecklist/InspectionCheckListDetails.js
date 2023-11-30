import { Col, Modal, Row } from 'antd';
import ApprovedRemarks from '../../common/ApprovedRemarks';

function InspectionCheckListDetails({ isModalOpen, setIsModalOpen, data }) {

  const responseDtoList = data?.approvalRemarksResponseDtoList;
  const responseDtoListQuality = data?.approvalRemarksResponseDtoListQuality;
  return (
    <Modal
      title="INSPECTION CHECKLIST DETAILS"
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
      centered
      visible={isModalOpen}
      width={700}
      footer={null}
    >
      <Row>
        <Col
          span={24}
          md={24}
        >
          <Row style={{
            marginBottom : "1rem"
          }}>
            <Col
              span={6}
              className="mb-10"
            >
             <strong> Description :</strong>
            </Col>
            <Col
              span={18}
              className="mb-10"
            >
              {data?.description}
            </Col>
          </Row>
          <Row>
            <Col
              span={6}
              className="mb-10"
            >
             <ApprovedRemarks responseDtoList={responseDtoList} responseDtoListQuality={responseDtoListQuality}/>
            </Col>
            
          </Row>
        </Col>
      </Row>
    </Modal>
  );
}

export default InspectionCheckListDetails;
