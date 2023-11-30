import { Breadcrumb, Button, Col, Form, Input, Row, Table, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import ARMForm from "../../../lib/common/ARMForm";
import { formLayout } from "../../../lib/constants/layout";
import Permission from "../../auth/Permission";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import DebounceSelect from "../../common/DebounceSelect";
import ResponsiveTable from "../../common/ResposnsiveTable";
import CommonLayout from "../../layout/CommonLayout";
import FormControl from "../common/FormControl";
import SubmitReset from "../common/SubmitReset";
import { useRequisition } from "./Requisition";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const ProcurementRequisition = () => {
  const {
    id,
    form,
    dataSource,
    components,
    columns,
    getOldDemandById,
    onFinish,
    onReset,
    sdId,
    handleFileInput,
    attachmentList,
    loading,
  } = useRequisition();

  console.log("sdId: ", sdId);

  useEffect(() => {
    if (!sdId) {
      return;
    }
    (async () => {
      form.setFieldsValue({
        storeDemandId: sdId,
      });
      await getOldDemandById(sdId);
    })();
  }, [sdId]);

  const route = useSelector((state) => state.routeLocation.previousRoute);


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
            {route ==='list' ? (
              <Link to="/store/material-management/requisition/pending">
                Pending Requisition List
              </Link>
            ) : (
              "Requisition"
            )}
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? "Edit" : "Add"}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission={[
          "STORE_PARTS_REQUISITION_MATERIAL_MANAGEMENT_REQUISITION_SAVE",
          "STORE_PARTS_REQUISITION_MATERIAL_MANAGEMENT_REQUISITION_EDIT",
        ]}
        showFallback
      >
        <ARMCard
          title={
            route === 'list'
              ? getLinkAndTitle(
                  "Material Management Requisition",
                  "/store/material-management/requisition/pending"
                )
              : getLinkAndTitle(
                "Material Management Requisition",
                "/store"
              )
          }
        >
          <ARMForm
            {...formLayout}
            form={form}
            name="procurementRequisition"
            onFinish={onFinish}
            initialValues={{
              isActive: true,
              procurementRequisitionItemDtoList: [],
            }}
            scrollToFirstError
          >
            <Row>
              <Col sm={24} md={10}>
                <Form.Item
                  name="voucherNo"
                  label="Requisition Voucher No"
                  hidden={!id}
                >
                  <Input
                    disabled
                    style={{
                      backgroundColor: "white",
                      color: "#000",
                      opacity: "0.8",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="storeDemandId"
                  label="Demand No."
                  rules={[
                    {
                      required: true,
                      message: "Demand No. required!",
                    },
                  ]}
                >
                  <DebounceSelect
                    mapper={(v) => ({
                      label: v.voucherNo,
                      value: v.id,
                    })}
                    showSearch
                    placeholder="---Select demand No.--"
                    type="multi"
                    url={`/store-demands/search?page=1&size=20`}
                    //selectedValue={oldDemandNo}
                    params={{ type: "APPROVED" }}
                    onChange={(newValue) => {
                      console.log("selected old demand no...", newValue);
                      getOldDemandById(newValue);
                    }}
                    allowClear
                  />
                </Form.Item>

                <Form.Item name="remarks" label="Remarks">
                  <TextArea rows={3} />
                </Form.Item>

                {!loading && (
                  <Form.Item label="Attachments">
                    <Upload.Dragger
                      multiple
                      onChange={handleFileInput}
                      showUploadList={true}
                      type="file"
                      listType="picture"
                      defaultFileList={[...attachmentList]}
                      beforeUpload={() => false}
                    >
                      <Button icon={<UploadOutlined />}>Click to upload</Button>{" "}
                      &nbsp;
                    </Upload.Dragger>
                  </Form.Item>
                )}
              </Col>
            </Row>

            <ARMCard title="Material Management requisition list">
              <FormControl>
                <ResponsiveTable>
                  <Table
                    components={components}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    rowClassName={() => "editable-row"}
                    pagination={false}
                  />
                </ResponsiveTable>
              </FormControl>
            </ARMCard>
            <SubmitReset id={id} onReset={onReset} />
          </ARMForm>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default ProcurementRequisition;
