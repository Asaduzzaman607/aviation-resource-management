import { EyeOutlined, FileOutlined } from '@ant-design/icons';
import { Breadcrumb, Col, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import partsReturnService from '../../../service/store/PartsReturnService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import PartReturnModal from './PartReturnModal';
import ApprovedRemarks from '../../common/ApprovedRemarks';
import {getFileExtension, getFileName} from "../../../lib/common/helpers";

const PendingPartReturnDetails = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState({});
  const [partViewModel, setPartViewModel] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [isServiceAble, setIsServiceAble] = useState();
  const loadSingleData = async () => {
    const { data } = await partsReturnService.getPartReturnById(id);
    setSingleData(data);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      await loadSingleData();
    })();
  }, [id]);
  const responseDtoList = singleData?.approvalRemarksResponseDtoList;


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/store">
              <i className="fas fa-archive" /> &nbsp;Store
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/store/pending-parts-return">
              &nbsp;Pending Parts Return
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;Pending Parts Return Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(
          `Pending Parts Return details`,
          `/store/pending-parts-return`
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
                style={{ marginBottom: '10px' }}
              >
                Department :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.isInternalDept ? 'Internal' : 'External'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Department Name :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.departmentName}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Voucher No :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.voucherNo}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Location :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.locationCode}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Work Order Number :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.workOrderNumber}
              </Col>

              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Work Order Serial :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.workOrderSerial}
              </Col>

              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Remarks :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.remarks}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                <ApprovedRemarks responseDtoList={responseDtoList}/>
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
                Issue No :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.storeIssueVoucherNo}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Store:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.officeCode}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Stock Room :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.stockRoomName}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Aircraft Registration :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.aircraftRegistration}
              </Col>

              {singleData?.isRejected && (
                <>
                  <Col
                    span={12}
                    className="mb-10"
                  >
                    Rejection Reason:
                  </Col>
                  <Col
                    span={12}
                    className="mb-10"
                  >
                    {singleData?.rejectedDesc}
                  </Col>
                </>
              )}

              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Status:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.storeReturnStatusType}
              </Col>
              <Col
                  span={12}
                  style={{ marginBottom: '10px' }}
              >
                Store Location:
              </Col>
              <Col
                  span={12}
                  style={{ marginBottom: '10px' }}
              >
                {singleData?.storeLocation}
              </Col>

              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Documents:
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData.attachment
                  ? singleData.attachment?.map((file, index) => (
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
                    ))
                  : 'N/A'}
              </Col>
              {/* <Col span={12} style={{marginBottom: "10px"}}>
                  {singleData?.attachment?.map((file, index) => (<ol key={index} style={{listStyleType: "none"}}>
                      <li><a
                        href={file}>{index + 1}.{file.split('/').length >= 4 ? file.split('/')[4] : 'uploaded-file'}</a>
                      </li>
                    </ol>))}
                </Col> */}
            </Row>
          </Col>
          <ResponsiveTable style={{ marginTop: '20px' }}>
            <ARMTable>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Installed Part No</th>
                  <th>Removed Part No</th>
                  <th>Installed Part Description</th>
                  <th>Removed Part Description</th>
                  <th>Quantity Return</th>
                  <th>Card Line No</th>
                  <th>Installed UOM</th>
                  <th>Removed UOM</th>
                  <th>Release No</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {singleData?.storeReturnPartList?.map((returnPart, index) => (
                  <tr key={returnPart.id}>
                    <td>
                      {singleData.isServiceable
                        ? 'Serviceable'
                        : 'Unserviceable'}
                    </td>
                    <td>{returnPart.installedPartNo}</td>
                    <td>{returnPart.partNo}</td>
                    <td>{returnPart.installedPartDescription}</td>
                    <td>{returnPart.partDescription}</td>
                    <td>{returnPart.quantityReturn}</td>
                    <td>{returnPart.cardLineNo}</td>
                    <td>{returnPart.installedPartUomCode}</td>
                    <td>{returnPart.removedPartUomCode}</td>
                    <td>{returnPart.releaseNo}</td>
                    <td>
                      {returnPart.isInactive ? (
                        <span
                          style={{
                            backgroundColor: '#04AA6DFF',
                            padding: '5px 15px',
                            color: '#ffffff',
                            fontSize: '14px',
                            borderRadius: '100px',
                          }}
                        >
                          Inactive
                        </span>
                      ) : (
                        <span
                          style={{
                            backgroundColor: '#f5222d',
                            padding: '5px 15px',
                            color: '#ffffff',
                            fontSize: '14px',
                            borderRadius: '100px',
                          }}
                        >
                          Active
                        </span>
                      )}
                    </td>
                    <td>
                      <ARMButton
                        type="primary"
                        size="small"
                        style={{
                          backgroundColor: '#4aa0b5',
                          borderColor: '#4aa0b5',
                        }}
                        onClick={() => {
                          setPartViewModel(returnPart);
                          setIsServiceAble({
                            isServiceAble: singleData.isServiceable,
                            workOrderNumber: singleData.workOrderNumber,
                            sRcreateDate: singleData.createDate,
                          });
                          console.log({ returnPart });
                          setShowModal(true);
                          setTitle(
                            singleData.isServiceable
                              ? 'Serviceable Parts Details'
                              : 'Unserviceable Parts Details'
                          );
                        }}
                      >
                        <EyeOutlined />
                      </ARMButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ARMTable>
          </ResponsiveTable>
          <Modal
            title={title}
            style={{
              top: 20,
            }}
            onOk={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
            centered
            visible={showModal}
            width={1080}
            footer={null}
          >
            <PartReturnModal
              isServiceable={isServiceAble}
              partReturn={partViewModel}
            />
          </Modal>
        </Row>
        {/*<Row style={{marginTop:"10px"}}>*/}
        {/*  <Col>*/}

        {/*    <Space>*/}
        {/*      <Link to={`/store/approve-demand/details/print/${id}`}>*/}
        {/*        <ARMButton type={"primary"}> {<PrinterOutlined />}Print Preview</ARMButton>*/}
        {/*      </Link>*/}
        {/*      <ARMButton onClick={requisitionClick} style={{backgroundColor:"green",color:"white"}}>Requisition</ARMButton>*/}
        {/*      */}
        {/*      <ARMButton  onClick={issueClick} style={{backgroundColor:"#6ACCBC",color:"white"}}>Issue</ARMButton>*/}
        {/*      */}
        {/*    </Space>*/}

        {/*  </Col>*/}
        {/*</Row>*/}
      </ARMCard>
    </CommonLayout>
  );
};

export default PendingPartReturnDetails;
