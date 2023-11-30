import { Breadcrumb, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import API from "../../../service/Api";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import DetailCSTable from "./DetailCSTable";
import {getLinkAndTitleWithFileDownload} from "../../../lib/common/LinkWithDownload";
import ApprovedRemarks from "../../common/ApprovedRemarks";
import CSService from "../../../service/procurment/CSService";

function modifiedCsDetailsData(vendor) {
  return vendor.csqDetailResponseDtoList.map((csDetail) => ({
    detailId: csDetail.detailId,
    partId: csDetail.partId,
    unitPrice: csDetail.unitPrice,
    condition: csDetail.condition,
    mov: csDetail.mov,
    moq: csDetail.moq,
    mlv: csDetail.mlv,
    exchangeType: csDetail.exchangeType,
    exchangeFee: csDetail.exchangeFee,
    repairCost: csDetail.repairCost,
    berLimit: csDetail.berLimit,
    currencyCode: csDetail.currencyCode,
    leadTime: csDetail.leadTime,
    discount: csDetail.discount,
    vendorUomCode: csDetail.vendorUomCode,
    vendorPartQuantity: csDetail.vendorPartQuantity,
    vendorName: vendor.vendorName,
    vendorWorkFlowName: vendor.vendorWorkFlowName,
  }));
}

const AuditCSDetails = ({ title, cardTitle, backUrl, permission }) => {
  const { id } = useParams();
  const [vendorLength, setVendorLength] = useState([]);
  const [validTill, setValidTill] = useState([]);
  const [rfq, setRfq] = useState({});
  const [generateCS, setGenerateCS] = useState({});
  const [rfqNo, setRfqNo] = useState(null);
  const [rejectedDesc, setRejectedDesc] = useState("");
  const [isRejected, setIsRejected] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [csNo, setCsNo] = useState();
  const [excelData, setExcelData] = useState();
  const [excelDataColumn, setExcelDataColumn] = useState();
  const [responseDtoList, setResponseDtoList] = useState(null);
  const [responseDtoListAudit, setResponseDtoListAudit] = useState(null);
  const [responseDtoListFinal, setResponseDtoListFinal] = useState(null);

  const getTableInfo = async () => {
    try {
      const {
        data: {
          remarks,
          rfqId,
          rejectedDesc,
          isRejected,
          csNo,
          quotationIdList,
          csItemPartResponseDtoList: csItemPartResponse,
          csVendorResponseDtoList: vendors,
          approvalRemarksResponseDtoList,
          approvalRemarksResponseDtoListAudit,
          approvalRemarksResponseDtoListFinal

        },
      } = await CSService.getExistingCSAudit(id);

      setCsNo(csNo);
      setRemarks(remarks);
      setRfqNo(rfqId);
      setIsRejected(isRejected);
      setRejectedDesc(rejectedDesc);
      setResponseDtoList(approvalRemarksResponseDtoList);
      setResponseDtoListAudit(approvalRemarksResponseDtoListAudit);
      setResponseDtoListFinal(approvalRemarksResponseDtoListFinal)

      setRfq({ rfqId, quotationIdList });
      const csDetails = vendors.map(modifiedCsDetailsData).flat();

      const vendorNameListLength = vendors.map((v) => {
        return {
          vendorName: v.vendorName,
          vendorWorkFlowName: v.vendorWorkFlowName
        }
      });
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
                mov: null,
                moq: null,
                mlv: null,
                exchangeType: null,
                exchangeFee: null,
                repairCost: null,
                berLimit: null,
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
          <Breadcrumb.Item>CS Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
          title={getLinkAndTitleWithFileDownload(
              title,
              backUrl,
              false,
              permission,
              excelDataColumn,
              excelData,
              csNo
          )}
      >
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
        <Row style={{ marginLeft: "4px"}}>
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
                <DetailCSTable
                  csID={id}
                  rfq={rfq}
                  generateCS={generateCS}
                  vendorLength={vendorLength}
                  validTill={validTill}
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

export default AuditCSDetails;
