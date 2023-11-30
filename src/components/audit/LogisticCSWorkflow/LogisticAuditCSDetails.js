import { Breadcrumb, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import API from "../../../service/Api";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import DetailAuditCSTable from "./DetailAuditCSTable";
import CSDetailsTable from "../../logistic/cs/CSDetailsTable";
import {getLinkAndTitleWithFileDownload} from "../../../lib/common/LinkWithDownload";
import ApprovedRemarks from "../../common/ApprovedRemarks";
import LogisticCSService from "../../../service/logistic/LogisticCSService";

function modifiedCsDetailsData(vendor) {
  return vendor.csqDetailResponseDtoList.map((csDetail) => ({
    detailId: csDetail.detailId,
    partId: csDetail.partId,
    unitPrice: csDetail.unitPrice,
    leadTime: csDetail.leadTime,
    vendorName: vendor.vendorName,
    currencyCode: csDetail.currencyCode,
    condition: csDetail.condition,
    discount: csDetail.discount,
    vendorUomCode: csDetail.vendorUomCode,
    vendorPartQuantity: csDetail.vendorPartQuantity,
  }));
}

const LogisticAuditCSDetails = ({ title, cardTitle, backUrl, permission }) => {
  const { id } = useParams();
  const location = useLocation();
  const { approvedOrPending } = location.state;

  const [vendorLength, setVendorLength] = useState([]);
  const [validTill, setValidTill] = useState([]);
  const [rfq, setRfq] = useState({});
  const [generateCS, setGenerateCS] = useState({});
  const [isRejected, setIsRejected] = useState(false);
  const [rejectedDesc, setRejectedDesc] = useState("");
  const [rfqNo, setRfqNo] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [responseDtoList, setResponseDtoList] = useState(null);
  const [responseDtoListAudit, setResponseDtoListAudit] = useState(null);
  const [responseDtoListFinal, setResponseDtoListFinal] = useState(null);
  const [csNo, setCsNo] = useState();
  const [excelData, setExcelData] = useState();
  const [excelDataColumn, setExcelDataColumn] = useState();

  const getTableInfo = async () => {
    try {
      const {
        data: {
          remarks,
          rfqId,
          isRejected,
          rejectedDesc,
          approvalRemarksResponseDtoList,
          approvalRemarksResponseDtoListAudit,
          approvalRemarksResponseDtoListFinal,
          csNo,
          quotationIdList,
          csItemPartResponseDtoList: csItemPartResponse,
          csVendorResponseDtoList: vendors,
        },
      } = await LogisticCSService.getExistingCSAudit(id);

      setCsNo(csNo);
      setRemarks(remarks);
      setRfqNo(rfqId);
      setRejectedDesc(rejectedDesc);
      setResponseDtoList(approvalRemarksResponseDtoList)
      setResponseDtoListAudit(approvalRemarksResponseDtoListAudit)
      setResponseDtoListFinal(approvalRemarksResponseDtoListFinal)
      setIsRejected(isRejected);
      setRfq({ rfqId, quotationIdList });
      const csDetails = vendors.map(modifiedCsDetailsData).flat();

      const vendorNameListLength = vendors.map((v) => v.vendorName);
      const validTill = vendors.map((v) => v.validTill);

      const mappedItemParts = csItemPartResponse.map((itemPart) => {
        const { partId } = itemPart;
        const vendors = csDetails.filter((vendor) => partId === vendor.partId);

        return {
          ...itemPart,
          vendors,
        };
      });

      const MAX_COLUMNS = Math.max(
        ...mappedItemParts.map((item) => item.vendors.length)
      );

      setVendorLength(vendorNameListLength);
      setValidTill(validTill);

      const mappedItems = mappedItemParts.map((itemPart) => {
        if (itemPart.vendors.length === MAX_COLUMNS) return itemPart;

        const { vendors } = itemPart;
        const restObjects = MAX_COLUMNS - vendors.length;

        return {
          ...itemPart,
          vendors: [
            ...vendors,
            ...Array(restObjects)
              .fill()
              .map(() => ({
                detailId: null,
                partId: null,
                unitPrice: null,
                leadTime: null,
                currencyCode: null,
                condition: null,
                discount: null,
                vendorPartQuantity: null,
                vendorUomCode: null,
              })),
          ],
          restObjects,
        };
      });
      setGenerateCS(mappedItems);
    } catch (er) {
    }
  };

  useEffect(() => {
    getTableInfo();
  }, []);


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {" "}
            <Link to="/audit">
              {" "}
              <i className="fas fa-user-shield"></i>
              &nbsp; audit
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {
              <Link to={`/audit/logistic/${approvedOrPending}-audit-cs`}>
                {approvedOrPending} Audit CS Details
              </Link>
            }
          </Breadcrumb.Item>
          <Breadcrumb.Item>CS Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard title={getLinkAndTitleWithFileDownload(title, backUrl, false, permission,excelDataColumn, excelData, csNo)}>
        <Row style={{ marginLeft: "4px" }}>
          <Col sm={24} md={2}>
            <b>Remarks : </b>
          </Col>
          <Col sm={24} md={10}>
            {remarks || "N/A"}
          </Col>
        </Row>
        {isRejected && (
          <Row style={{ marginLeft: "4px" }}>
            <Col sm={24} md={2}>
              <b>Rejected Reason : </b>
            </Col>
            <Col sm={24} md={10}>
              {rejectedDesc || "N/A"}
            </Col>
          </Row>
        )}
         <Row style={{ marginLeft: "4px" }}>
            <Col sm={24} md={2}>
             <ApprovedRemarks responseDtoList={responseDtoList} responseDtoListAudit={responseDtoListAudit} responseDtoListFinal={responseDtoListFinal}/>
            </Col>
           
          </Row>
      </ARMCard>
      <br />

      <ARMCard title={cardTitle}>
        {rfqNo && (
          <>
            {generateCS && (
              <>
                <CSDetailsTable
                  generateCS={generateCS}
                  vendorLength={vendorLength}
                  setExcelData={setExcelData}
                  setExcelDataColumn={setExcelDataColumn}
                  csNo={csNo}
                />
              </>
            )}
          </>
        )}
      </ARMCard>
    </CommonLayout>
  );
};

export default LogisticAuditCSDetails;
