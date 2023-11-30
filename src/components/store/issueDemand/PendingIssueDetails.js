import { EyeOutlined } from '@ant-design/icons';
import { Breadcrumb, Col, notification, Row } from 'antd';
import { isArray } from 'lodash';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import API from '../../../service/Api';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import useViewDetails from '../hooks/ViewDetails';
import GrnSerialDetails from './grnSerialDetails';
import ApprovedRemarks from '../../common/ApprovedRemarks';


const PendingIssueDetails = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState({});

  const { isModalOpen, setIsModalOpen, data, handleViewDetails } =
    useViewDetails();

  const getIssueDemand = async () => {
    try {
      const { data } = await API.get(`/store/issues/${id}`);
      setSingleData(data);
      console.log('issue data: ', data);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  useEffect(() => {
    getIssueDemand();
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
            <Link to="/store/pending-issues">&nbsp;Pending Issue Demands</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;Pending Issue Demands Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(
          `Pending Issue demand details`,
          `/store/pending-issues`
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
                Voucher No. :
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
                Demand No. :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.storeDemandNo}
              </Col>

              {singleData?.isRejected && (
                <>
                  <Col
                    span={12}
                    style={{ marginBottom: '10px' }}
                  >
                    Rejected Reason :
                  </Col>
                  <Col
                    span={12}
                    style={{ marginBottom: '10px' }}
                  >
                    {singleData?.rejectedDesc}
                  </Col>
                </>
              )}
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                <ApprovedRemarks responseDtoList={responseDtoList}/>
              </Col>
            </Row>
          </Col>

          <ResponsiveTable style={{ marginTop: '20px' }}>
            <ARMTable>
              <thead style={{ textAlign: 'center' }}>
                <tr>
                  <th>Part No .</th>
                  <th>Alternate Part No.</th>
                  <th>Quantity Demanded</th>
                  <th>Already Issued Quantity</th>
                  <th>Quantity Issued</th>
                  <th>Card Line No.</th>
                  <th>Remark</th>
                  <th>Unit of Measurement</th>
                  <th>Priority</th>
                  <th>Serial</th>
                </tr>
              </thead>
              <tbody style={{ textAlign: 'center' }}>
                {singleData?.storeIssueItemResponseDtos?.map((demandList) => (
                  <tr key={demandList.id}>
                    <td>{demandList.parentPartId===null?demandList.partNo:''}</td>
                    <td>{demandList.parentPartId?demandList.partNo:''}</td>
                    <td>{demandList.parentPartId===null?demandList.quantityDemanded:''}</td>
                    <td>{demandList.totalIssuedQty}</td>
                    <td>{demandList.issuedQuantity}</td>
                    <td>{demandList.cardLineNo}</td>
                    <td>{demandList.remark}</td>
                    <td>{demandList.unitMeasurementCode}</td>
                    <td>{demandList.parentPartId === null ?demandList.priorityType:''}</td>
                    <td>
                      <ARMButton
                        type="primary"
                        size="small"
                        style={{
                          backgroundColor: '#4aa0b5',
                          borderColor: '#4aa0b5',
                        }}
                        onClick={() =>
                          handleViewDetails(demandList?.grnAndSerialDtoList)
                        }
                      >
                        <EyeOutlined />
                      </ARMButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ARMTable>
          </ResponsiveTable>
        </Row>
        <GrnSerialDetails
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          data={isArray(data) ? data : []}
        />
      </ARMCard>
    </CommonLayout>
  );
};

export default PendingIssueDetails;
