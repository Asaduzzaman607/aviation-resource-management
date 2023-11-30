import { Col, Modal, Row } from "antd";

function GrnDetails({ isModalOpen, setIsModalOpen, data }) {
  return (
    <Modal
      title="GRN NO DETAILS"
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
      centered
      visible={isModalOpen}
      width={700}
      footer={null}
    >
      <Row>
        <Col span={24} md={24}>
          <Row
            style={{
              marginBottom: "1rem",
            }}
          >
            <Col span={6} className="mb-10">
              <strong> Grn No :</strong>
            </Col>
            <Col span={18} className="mb-10">
              {data?.grnNo}
            </Col>
          </Row>
          <Row
            style={{
              marginBottom: "1rem",
            }}
          >
            <Col span={6} className="mb-10">
              <strong> Created Date :</strong>
            </Col>
            <Col span={18} className="mb-10">
              {data?.createdDate}
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
}

export default GrnDetails;
