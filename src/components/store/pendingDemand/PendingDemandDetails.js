import {EyeOutlined, FileOutlined} from '@ant-design/icons';
import {Breadcrumb, Col, Row} from 'antd';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useParams} from 'react-router-dom';
import {getLinkAndTitle} from '../../../lib/common/TitleOrLink';
import {notifyResponseError} from '../../../lib/common/notifications';
import ItemDemandService from '../../../service/ItemDemandService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import useViewDetails from '../hooks/ViewDetails';
import AllPendingStatusDetails from './AllPendingStatusDetails';
import ApprovedRemarks from '../../common/ApprovedRemarks';
import {getFileExtension, getFileName} from "../../../lib/common/helpers";

const PendingDemandDetails = () => {
  const { t } = useTranslation();
  let { id } = useParams();
  const [singleData, setSingleData] = useState({});
  const { isModalOpen, setIsModalOpen, data, handleViewDetails } =
    useViewDetails();

  const loadSingleData = async () => {
    try {
      const { data } = await ItemDemandService.getItemDemandById(id);
      setSingleData(data);
    } catch (error) {
      notifyResponseError(error);
    }
  };

  useEffect(() => {
    if (!id) return;
    loadSingleData().catch(console.error);
  }, [id]);

  const responseDtoList = singleData?.approvalRemarksResponseDtoList;


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-archive" />
            <Link to="/store">&nbsp; {t('store.Store')}</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/store/pending-demand">
              {' '}
              {t('store.Pending Demand.Pending Demands')}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Pending-demand Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(
          t('store.Pending Demand.Pending demand details'),
          `/store/pending-demand`
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
                Department :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.departmentType}
              </Col>
              {singleData.departmentType === 'REPLENISHMENT' ? (
                ''
              ) : (
                <>
                  <Col
                    span={12}
                    className="mb-10"
                  >
                    Department Code :
                  </Col>
                  <Col
                    span={12}
                    className="mb-10"
                  >
                    {singleData.departmentType === 'INTERNAL'
                      ? singleData?.departmentCode
                      : singleData?.vendorName}
                  </Col>
                </>
              )}
              <Col
                span={12}
                className="mb-10"
              >
                Voucher No :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.voucherNo ? singleData?.voucherNo : 'N/A'}
              </Col>

              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Remarks :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.remarks ? singleData?.remarks : 'N/A'}
              </Col>
              {!singleData?.isInternalDept && (
                <>
                  <Col
                    span={12}
                    className="mb-10"
                  >
                    Valid Till:
                  </Col>
                  <Col
                    span={12}
                    className="mb-10"
                  >
                    {singleData?.validTill ? singleData?.validTill : 'N/A'}
                  </Col>
                </>
              )}
              <Col
                    span={12}
                    className="mb-10"
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
                className="mb-10"
              >
                Aircraft :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.aircraftName ? singleData?.aircraftName : 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Airport :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.airportName ? singleData?.airportName : 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Work Order No:
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.workOrderNo ? singleData?.workOrderNo : 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Status:
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                <span
                  style={{
                    color: '#4aa0b5',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    handleViewDetails({
                      demandId: id,
                      partId: null,
                    });
                  }}
                >
                  Show All Status
                </span>
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
              {!singleData?.isInternalDept && (
                <>
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
                </>
              )}
            </Row>
          </Col>

          <ResponsiveTable style={{ marginTop: '20px' }}>
            <ARMTable>
              <thead>
                <tr>
                  <th>Part No.</th>
                  <th>Alter Nate Part No.</th>
                  <th>Part Description</th>
                  <th>Demanded Qty</th>
                  <th>Available Qty</th>
                  <th>Unit of Measurement</th>
                  <th>Remarks</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {singleData?.storeDemandDetailsDtoList?.map(
                  (demandList, index) => (
                    <tr key={demandList.id}>
                      <td>{demandList.parentPartId===null?demandList.partNo:''}</td>
                      <td>{demandList.parentPartId?demandList.partNo:''}</td>
                      <td>{demandList.partDescription}</td>
                      <td>{demandList.parentPartId === null ? demandList.quantityDemanded : ''}</td>
                      <td>{demandList.availablePart}</td>
                     <td>{demandList.unitMeasurementCode}</td>
                      <td>{demandList.remark}</td>
                      <td>{demandList.parentPartId === null ?demandList.priorityType:''}</td>
                      <td>
                        <ARMButton
                          type="primary"
                          size="small"
                          style={{
                            backgroundColor: '#4aa0b5',
                            borderColor: '#4aa0b5',
                          }}
                          onClick={async () =>
                            handleViewDetails({
                              demandId: singleData.id,
                              partId: demandList.partId,
                            })
                          }
                        >
                          <EyeOutlined />
                        </ARMButton>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </ARMTable>
          </ResponsiveTable>
          <AllPendingStatusDetails
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            data={data}
            details="Pending Demand Status"
          />
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default PendingDemandDetails;
