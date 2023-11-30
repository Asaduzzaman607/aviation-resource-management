import { Breadcrumb, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import { Link } from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMForm from "../../../lib/common/ARMForm";
import { useMel } from "../../../lib/hooks/planning/useMel";
import { formLayout } from "../../../lib/constants/layout";
import moment from "moment";
import { useEffect } from "react";
import useAmlOptions from "../../../lib/hooks/planning/useAmlOptions";
import { DATE_FORMATTER } from "../../../lib/constants/date";
import { useTranslation } from "react-i18next";
const { Option } = Select;
const { TextArea } = Input;

const defermentCode = [
  { id: 1, name: "MAN" },
  { id: 2, name: "MACO" },
  { id: 3, name: "PART" },
  { id: 4, name: "TIME" },
  { id: 5, name: "TOOL" },
];

const melCategory = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 3, name: "C" },
  { id: 4, name: "D" },
];

const dates = {
  1:  0,
  2:  3,
  3:  10,
  4:  120,
}

export default function AddMel() {
  const { onFinish, form, id, handleReset, searchDefectByAtlId, searchRectByAtlId, def, rect, amls } = useMel();
  const { t } = useTranslation();
  const TITLE = id ? `${t("planning.MEL.MEL")} ${t("common.Update")}` : `${t("planning.MEL.MEL")} ${t("common.Add")}`;
  const category = Form.useWatch("melCategory", form);
  
  useEffect(() => {
    if (!category) {
      form.setFieldsValue({ dueDate: "" });
      return;
    }
    
    const dueDate = moment().add(dates[category], 'days')
    form.setFieldsValue({ dueDate });
  }, [category, form])

  


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" /> &nbsp;{t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/mel">{t("planning.MEL.MEL")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard title={getLinkAndTitle(TITLE, "/planning/mel", false)}>
        <ARMForm
          form={form}
          name="basic"
          {...formLayout}
          initialValues={{
            amlItId: "",
            intDefRectId: "",
            intermediateAction: "",
            dmiNo: "",
            defermentCode: null,
            melCategory: null,
            clearedDate: "",
            correctDefRectId: "",
          }}
          autoComplete="off"
          style={{
            backgroundColor: "#ffffff",
          }}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Row>
            <Col sm={24} md={12} xs={24}>
              
              <Form.Item label={t("planning.MEL.Intermediate ATL")} name="amlItId">
                <Select defaultValue="--select--" onChange={searchDefectByAtlId}
                allowClear
                showSearch
                filterOption={(inputValue, option) =>
                  option.children
                    .toString("")
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                }
                >
                  {amls?.map((aml) => (
                    <Option key={aml.id} value={aml.id}>
                      {aml.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                label={t("planning.MEL.Defect")}
                name="intDefRectId"
                rules={[
                  {
                    required: true,
                    message: t("planning.MEL.Please input defect"),
                  },
                ]}
              >
                <Select defaultValue="--select--" allowClear>
                  {def?.map((defect, index) => (
                    <Option key={index} value={defect.id}>
                      {defect.seqNo}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              
              <Form.Item label={t("planning.MEL.Intermediate Action")} name="intermediateAction">
                <TextArea rows={2} />
              </Form.Item>
              
              <Form.Item label={t("planning.MEL.DMI Page No")} name="dmiNo">
                <Input />
              </Form.Item>
              
              <Form.Item label="Deferment Code" name="defermentCode">
                <Select defaultValue="--select--" allowClear>
                  {defermentCode.map((data, index) => (
                    <Option key={index} value={data.id}>
                      {data.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              
              <Form.Item label={t("planning.MEL.Category")} name="melCategory">
                <Select defaultValue="--select--" allowClear>
                  {melCategory.map((data, index) => (
                    <Option key={index} value={data.id}>
                      {data.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item name="dueDate" label={t("planning.MEL.Due Date")}>
                <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} placeholder="" />
              </Form.Item>
              
              <Form.Item name="clearedDate" label={t("planning.MEL.Cleared Date")}>
                <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} placeholder="" />
              </Form.Item>
            </Col>
            
            <Col className="gutter-row" lg={12} xl={12} md={12} sm={24} xs={24}>
              <Form.Item label={t("planning.MEL.Corrective ATL")} name="amlCtId">
                <Select defaultValue="--select--" onChange={searchRectByAtlId} 
                allowClear
                showSearch
                filterOption={(inputValue, option) =>
                  option.children
                    .toString("")
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                }
                >
                  {amls?.map((aml) => (
                    <Option key={aml.id} value={aml.id}>
                      {aml.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                label={t("planning.MEL.Rectification")}
                name="correctDefRectId"
                rules={[
                  {
                    required: false,
                    message: t("planning.MEL.Please input rectification"),
                  },
                ]}
              >
                <Select defaultValue="--select--" allowClear>
                  {rect?.map((rect, index) => (
                    <Option key={index} value={rect.id}>
                      {rect.seqNo}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={12}>
              <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
                <Space size="small">
                  <ARMButton size="medium" type="primary" htmlType="submit">
                    {id ? t("common.Update") : t("common.Submit")}
                  </ARMButton>
                  <ARMButton onClick={handleReset} size="medium" type="primary" danger>
                    {t("common.Reset")}
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </ARMForm>
      </ARMCard>
    </CommonLayout>
  );
}
