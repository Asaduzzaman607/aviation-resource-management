import { ArrowLeftOutlined, FileOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParamsId } from "../../../lib/hooks/common";
import ScrapPartsService from "../../../service/store/ScrapPartsService";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ResponsiveTable from "../../common/ResposnsiveTable";
import { CustomBadge } from "../../common/view/CustomBadge";
import CommonLayout from "../../layout/CommonLayout";
import ApprovedRemarks from "../../common/ApprovedRemarks";
import {getFileExtension, getFileName} from "../../../lib/common/helpers";

export default function ScrapPartsView({ isPending }) {
  const [data, setData] = useState({});
  const id = useParamsId();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await ScrapPartsService.getScrapPartsById(id);
      setData({ ...res.data });
    })();
  }, [id]);

  const responseDtoList = data?.approvalRemarksResponseDtoList;

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-archive" />
            <Link to="/store">&nbsp; Store</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            {isPending ? (
              <Link to="/store/pending-scrap-parts">Pending Scrap Parts</Link>
            ) : (
              <Link to="/store/approved-scrap-parts">Approved Scrap Parts</Link>
            )}
          </Breadcrumb.Item>

          <Breadcrumb.Item>Scrap Parts Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      {/*<ARMCard title={getLinkAndTitle("Scrap Parts Details", "/store/scrap-parts")}>*/}
      <ARMCard
        title={
          <Row justify="space-between">
            <Col>Scrap Parts Details</Col>
            <Col>
              <Button
                onClick={() => {
                  navigate(-1);
                }}
                type="primary"
                style={{
                  backgroundColor: "#04aa6d",
                  borderColor: "transparent",
                  borderRadius: "5px",
                }}
              >
                <ArrowLeftOutlined /> Back
              </Button>
            </Col>
          </Row>
        }
      >
        <Row>
          <Col span={24} md={12}>
            <Row>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Remarks:
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {data.remarks}
              </Col>

              <Col span={12} className="mb-10">
                Files:
              </Col>
              <Col span={12} className="mb-10">
                {data.attachmentList
                  ? data.attachmentList?.map((file, index) => (
                      <p key={index}>
                        {getFileExtension(file) ? (
                          <img width="30" height="30" src={file} alt="" />
                        ) : (
                          <FileOutlined style={{ fontSize: "25px" }} />
                        )}
                        <a href={file}>{getFileName(file)}</a>
                      </p>
                    ))
                  : "N/A"}
              </Col>

              <Col span={12} className="mb-10">
                <ApprovedRemarks responseDtoList={responseDtoList} />
              </Col>

              {data.isRejected && (
                <>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    Rejected Reason:
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {data.rejectedDesc}
                  </Col>
                </>
              )}
            </Row>
          </Col>

          <ResponsiveTable style={{ marginTop: "20px" }}>
            <ARMTable>
              <thead>
                <tr>
                  <th>Part No</th>
                  <th>Part Description</th>
                  <th>Serial</th>
                  <th>Serial Quantity</th>
                </tr>
              </thead>
              <tbody>
                {data.storeScrapPartViewModels
                  ? data.storeScrapPartViewModels[0]?.partSerialViewModelList.map(
                      (part) => (
                        <tr key={part.id}>
                          <td>{data.storeScrapPartViewModels[0].partNo}</td>
                          <td>
                            {data.storeScrapPartViewModels[0].partDescription}
                          </td>
                          <td>
                            <CustomBadge color="#04aa6d">
                              {part.serialNo}
                            </CustomBadge>
                          </td>
                          <td>{part.quantity}</td>
                        </tr>
                      )
                    )
                  : null}
              </tbody>
            </ARMTable>
          </ResponsiveTable>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
}
