import React from 'react';
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Form, Input, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import {UseCurrency} from "./UseCurrency";
import {useTranslation} from "react-i18next";
import Permission from "../../auth/Permission";

const AddCurrency = () => {
  const { TextArea } = Input;

  const layout = {
    labelCol: {
      span: 3,
    },
    wrapperCol: {
      span: 7,
    },
  };

  const {
    id,
    onFinish,
    onReset,
    form,
  } = UseCurrency();

  const { t } = useTranslation();

  return (
    <div>
      <CommonLayout>
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              {' '}
              <Link to="/configurations">
                {' '}
                <i className="fas fa-cog" /> &nbsp;{t("configuration.Configurations")}
              </Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <Link to="/configurations/currency">{t("configuration.Currency.Currency")}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? t("common.Edit") :t("common.Add")}</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>

        <Permission permission={["CONFIGURATION_CONFIGURATION_CURRENCY_SAVE","CONFIGURATION_CONFIGURATION_CURRENCY_EDIT"]}>
        <ARMCard title={getLinkAndTitle(t("configuration.Currency.Currency"), '/configurations/currency')}>
          <ARMForm
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
          >
            <Form.Item
              name="code"
              label={t("configuration.Currency.Code")}
              rules={[
                {
                  required: true,
                  message:t("configuration.Currency.Please input Code !"),
                },
                {
                  max:t("common.Max"),
                  message: t("common.Maximum 255 characters allowed"),
                },
                {
                  whitespace: true,
                  message:t("common.Only space is not allowed"),
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label={t("configuration.Currency.Description")}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 3 }}>
              <Space size="small">
                <ARMButton
                  type="primary"
                  htmlType="submit"
                >
                  {id ? t("common.Update") : t("common.Submit")}
                </ARMButton>
                <ARMButton
                  onClick={onReset}
                  type="primary"
                  danger
                >
                  {t("common.Reset")}
                </ARMButton>
              </Space>
            </Form.Item>
          </ARMForm>
        </ARMCard>
        </Permission>
      </CommonLayout>
    </div>
  );
};

export default AddCurrency;