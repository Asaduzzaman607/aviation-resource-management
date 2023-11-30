import { FileOutlined } from "@ant-design/icons";
import { Breadcrumb, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFileExtension, getFileName } from "../../../lib/common/helpers";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import API from "../../../service/Api";
import DutyFeesService from "../../../service/logistic/DutyFeesService";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import RibbonCard from "../../common/forms/RibbonCard";
import ResponsiveTable from "../../common/ResposnsiveTable";
import CommonLayout from "../../layout/CommonLayout";



const DutyFeesDetails = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState();
  const navigate = useNavigate();

  const loadSingleData = async () => {
    const { data } = await DutyFeesService.getSingleData(id);
    setSingleData(data);
  };

  useEffect(() => {
    if (!id) return;
    loadSingleData().catch(console.error);
  }, [id]);

  
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/logistic">
              <i className="fa fa-shopping-basket" /> &nbsp;Logistic
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/logistic/duty-fees/list">&nbsp;Duty Fees List</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;Duty Fees Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(
          `Duty Fees details`,
          `/logistic/duty-fees/add`,
          false,
          ""
        )}
      >
        <Row>
          <Col span={24} md={12}>
            <Row>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Invoice No:
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.invoiceNo ? singleData?.invoiceNo : "N/A"}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Attachments:
              </Col>
              <Col span={12}>
                {singleData?.attachment &&
                  singleData.attachment?.map((file, index) => (
                    <p key={index}>
                      {getFileExtension(file) ? (
                        <img width="30" height="30" src={file} alt="img" />
                      ) : (
                        <FileOutlined style={{ fontSize: "25px" }} />
                      )}
                      <a href={file}>{getFileName(file)}</a>
                    </p>
                  ))}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <RibbonCard ribbonText={"DUTY FEES DETAILS"}>
              <ResponsiveTable style={{ marginTop: "20px" }}>
                <ARMTable>
                  <thead>
                    <tr>
                      <th>SL.</th>
                      <th>Fees</th>
                      <th>Total Amount</th>
                      <th>Currency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleData?.dutyFeeItemList?.map((dutyFees, index) => (
                      <tr key={dutyFees.id}>
                        <td>{index + 1}</td>
                        <td>{dutyFees.fees}</td>
                        <td>{dutyFees.totalAmount}</td>
                        <td>{dutyFees.currencyCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </ARMTable>
              </ResponsiveTable>
            </RibbonCard>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default DutyFeesDetails;
