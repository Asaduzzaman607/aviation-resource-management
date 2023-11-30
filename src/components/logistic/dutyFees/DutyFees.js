import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import { Link } from "react-router-dom";
import ARMForm from "../../../lib/common/ARMForm";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import Permission from "../../auth/Permission";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import DebounceSelect from "../../common/DebounceSelect";
import RibbonCard from "../../common/forms/RibbonCard";
import CommonLayout from "../../layout/CommonLayout";
import FormControl from "../../store/common/FormControl";
import Loading from "../../store/common/Loading";
import { useDutyFees } from "./useDutyFees";

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
const { Option } = Select;

const DutyFees = () => {
  const {
    id,
    form,
    purchaseOrder,
    getPurchaseOrder,
    onFinish,
    onReset,
    handleFileInput,
    downloadLink,
    loading,
  } = useDutyFees();

  const partInvoiceId = Form.useWatch("partInvoiceId", form);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-hand-holding-box" />
            <Link to="/logistic">&nbsp; Logistic</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/logistic/duty-fees/list">Duty Fees</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? "edit" : "add"}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission={[
          "LOGISTIC_DUTY_FEES_DUTY_FEES_SAVE",
          "LOGISTIC_DUTY_FEES_DUTY_FEES_EDIT",
        ]}
      >
        {!loading ? (
          <>
            <ARMCard
              title={getLinkAndTitle(
                "Duty Fees",
                "/logistic/duty-fees/list/",
                false,
                "LOGISTIC_DUTY_FEES_DUTY_FEES_SEARCH"
              )}
            >
              <ARMForm
                {...layout}
                form={form}
                name="dutyFees"
                onFinish={onFinish}
                initialValues={{
                  dutyFeeItemRequestDtoList: [
                    {
                      isActive: true,
                      id: null,
                    },
                  ],
                }}
                scrollToFirstError
              >
                <Row>
                  <Col sm={20} md={10}>
                    <Form.Item
                      name="partInvoiceId"
                      label="PI No"
                      rules={[
                        {
                          required: true,
                          message: "Required",
                        },
                      ]}
                    >
                      <DebounceSelect
                        mapper={(v) => ({
                          label: v.invoiceNo,
                          value: v.id,
                        })}
                        showSearch
                        placeholder="--- Select PI No. ---"
                        url={`/logistic/own_department/parts-invoice/search?page=1&size=20`}
                        params={{ type: "APPROVED", rfqType: "LOGISTIC" }}
                        disabled={!!id}
                        onChange={(newValue) => {
                          getPurchaseOrder(newValue.value);
                        }}
                        selectedValue={partInvoiceId}
                      />
                    </Form.Item>

                    <Form.Item
                      name="partsInvoiceItemId"
                      label="Part No"
                      rules={[
                        {
                          required: true,
                          message: "Required",
                        },
                      ]}
                    >
                      <Select placeholder="---Select Part No---">
                        {purchaseOrder?.map((item) => (
                          <Option key={item?.id} value={item?.id}>
                            {item?.partNo}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="file"
                      label="Attachment"
                      rules={[
                        {
                          required: false,
                          message: "required!",
                        },
                      ]}
                    >
                      <Upload.Dragger
                        multiple
                        onChange={handleFileInput}
                        showUploadList={true}
                        type="file"
                        listType="picture"
                        defaultFileList={[...downloadLink]}
                        beforeUpload={() => false}
                      >
                        <Button icon={<UploadOutlined />}>
                          Click to upload
                        </Button>{" "}
                        &nbsp;
                      </Upload.Dragger>
                    </Form.Item>
                  </Col>
                </Row>
                <FormControl>
                  <RibbonCard ribbonText={"Duty Fees"}>
                    <Form.List name="dutyFeeItemRequestDtoList">
                      {(fields, { add, remove }) => (
                        <>
                          {fields?.map(({ key, name, ...restField }, index) => {
                            if (
                              form.getFieldValue("dutyFeeItemRequestDtoList")[
                                index
                              ]?.isActive
                            )
                              return (
                                <Row key={key} gutter={16}>
                                  <Col xs={24} sm={24} md={7}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "fees"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Required",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Enter Duty Fees" />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={24} md={7}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "totalAmount"]}
                                    >
                                      <Input placeholder="Enter Total Amount" />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={24} md={7}>
                                    <Form.Item
                                      name={[name, "currencyId"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Required",
                                        },
                                      ]}
                                    >
                                      <DebounceSelect
                                        mapper={(v) => ({
                                          label: v.code,
                                          value: v.id,
                                        })}
                                        showSearch
                                        placeholder="--- Select Currency. ---"
                                        type="multi"
                                        selectedValue={
                                          form.getFieldValue(
                                            "dutyFeeItemRequestDtoList"
                                          )[index]?.currencyId
                                        }
                                        url={`/store/currencies/search?page=1&size=20`}
                                      />
                                    </Form.Item>
                                  </Col>

                                  <Col xs={24} sm={24} md={3}>
                                    <Button
                                      danger
                                      onClick={() => {
                                        form.getFieldValue(
                                          "dutyFeeItemRequestDtoList"
                                        )[index]?.id
                                          ? form.setFieldsValue(
                                              (form.getFieldValue(
                                                "dutyFeeItemRequestDtoList"
                                              )[index].isActive = false)
                                            )
                                          : remove(index);
                                        form.setFieldsValue({ ...form });
                                      }}
                                    >
                                      <MinusCircleOutlined />
                                    </Button>
                                  </Col>
                                </Row>
                              );
                          })}

                          <Form.Item wrapperCol={{ ...layout.labelCol }}>
                            <ARMButton
                              type="primary"
                              onClick={() => {
                                const currentDutyFeeItemRequestDtoList =
                                  form.getFieldValue(
                                    "dutyFeeItemRequestDtoList"
                                  ) || [];
                                const newDutyFeeItemRequestDtoList = [
                                  ...currentDutyFeeItemRequestDtoList,
                                  {
                                    isActive: true,
                                    id: null,
                                  },
                                ];

                                form.setFieldsValue({
                                  dutyFeeItemRequestDtoList:
                                    newDutyFeeItemRequestDtoList,
                                });
                              }}
                              icon={<PlusOutlined />}
                            >
                              Add
                            </ARMButton>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </RibbonCard>
                </FormControl>
                <Row>
                  <Col sm={20} md={10}>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
                      <Space size="small">
                        <ARMButton type="primary" htmlType="submit">
                          {id ? "Update" : "Submit"}
                        </ARMButton>
                        <ARMButton onClick={onReset} type="primary" danger>
                          Reset
                        </ARMButton>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </ARMForm>
            </ARMCard>
          </>
        ) : (
          <Loading />
        )}
      </Permission>
    </CommonLayout>
  );
};

export default DutyFees;
