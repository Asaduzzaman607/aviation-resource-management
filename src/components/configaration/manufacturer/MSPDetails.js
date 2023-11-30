import { FileOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import ApprovedRemarks from '../../common/ApprovedRemarks';
import { CustomBadge } from '../../common/view/CustomBadge';
import {getFileExtension, getFileName} from "../../../lib/common/helpers";

function MSPDetails({
  isModalOpen,
  setIsModalOpen,
  data,
  shipmentProvider,
  details,
}) {
  const responseDtoList = data?.approvalRemarksResponseDtoList;
  const responseDtoListQuality = data?.approvalRemarksResponseDtoListQuality;

  return (
    <Modal
      title={details}
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
      centered
      visible={isModalOpen}
      width={1300}
      footer={null}
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
              {data?.name || 'N/A'}
            </Col>

            <Col
              span={12}
              className="mb-10"
            >
              Country :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.city?.countryName || 'N/A'}
            </Col>

            <Col
              span={12}
              className="mb-10"
            >
              City :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.city?.name || 'N/A'}
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
              {data?.officePhone || 'N/A'}
            </Col>

            <Col
              span={12}
              className="mb-10"
            >
              Emergency Contact :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.emergencyContact || 'N/A'}
            </Col>

            <Col
              span={12}
              className="mb-10"
            >
              Email :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.email || 'N/A'}
            </Col>

            <Col
              span={12}
              className="mb-10"
            >
              Skype :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.skype || 'N/A'}
            </Col>

            <Col
              span={12}
              className="mb-10"
            >
              Website :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.website || 'N/A'}
            </Col>

            <Col
              span={12}
              className="mb-10"
            >
              Contact Person :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              <pre>{data?.contactPerson || 'N/A'}</pre>
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              Contact Mobile :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.contactMobile || 'N/A'}
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              Contact Phone :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.contactPhone || 'N/A'}
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
              Vendor Client List :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.clientList?.map((data) => <h5>{data.clientName}</h5>) ||
                'N/A'}
            </Col>

            <Col
              span={12}
              className="mb-10"
            >
              Manufactured By :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.itemsBuild || 'N/A'}
            </Col>

            <Col
              span={12}
              className="mb-10"
            >
              Loading Port :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.loadingPort || 'N/A'}
            </Col>

            <Col
              span={12}
              className="mb-10"
            >
              Country Origin :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.countryOrigin?.name || 'N/A'}
            </Col>

            <Col
              span={12}
              className="mb-10"
            >
              Valid Till :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.validTill || 'N/A'}
            </Col>

            <Col
              span={12}
              className="mb-10"
            >
              Address :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.address || 'N/A'}
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              Contact Email :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.contactEmail || 'N/A'}
            </Col>

            <Col
              span={12}
              className="mb-10"
            >
              Contact Skype :
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              {data?.contactSkype || 'N/A'}
            </Col>
            {data?.isRejected && (
              <>
                <Col
                  span={12}
                  className="mb-10"
                >
                  Rejected Reason :
                </Col>
                <Col
                  span={12}
                  className="mb-10"
                >
                  {data?.rejectedDesc}
                </Col>
              </>
            )}
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
              {data?.attachments
                ? data?.attachments?.map((file, index) => (
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
                      <a href={file}>{getFileName(file)}</a>
                    </p>
                  ))
                : 'N/A'}
            </Col>
            <Col
              span={12}
              className="mb-10"
            >
              <ApprovedRemarks
                responseDtoList={responseDtoList}
                responseDtoListQuality={responseDtoListQuality}
              />
            </Col>
          </Row>
        </Col>
        {!shipmentProvider && (
          <Col
            span={24}
            md={12}
          >
            <span>Vendor Capabilities</span> :
            {data?.vendorCapabilityResponseDtoList
              ? data?.vendorCapabilityResponseDtoList?.map((m) => (
                  <CustomBadge>{m.name}</CustomBadge>
                ))
              : ' N/A'}
          </Col>
        )}
      </Row>
    </Modal>
  );
}

export default MSPDetails;
