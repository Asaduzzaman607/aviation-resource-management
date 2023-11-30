import React, {useEffect} from "react";
import {Breadcrumb, Col, Form, Pagination, Row, Select, Space} from "antd";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Link} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {LinkAndTitle} from "../../../lib/common/TitleOrLink";
import ActiveInactive from "../../common/ActiveInactive";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import {EditOutlined, EyeOutlined, FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import {refreshPagination, usePaginate} from "../../../lib/hooks/paginations";
import PageSizesFormItem from "../../common/pagination/PageSizesFormItem";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import {useDispatch} from "react-redux";
import API from "../../../service/Api";
import {notifyResponseError, notifySuccess} from "../../../lib/common/notifications";
import useAircraftModelList from "../../../lib/hooks/planning/useAircraftsModelList";
import {DEFAULT_PAGE_SIZE} from "../../../lib/constants/paginations";
import { useTranslation } from "react-i18next";
import ViewButton from "../../common/buttons/ViewButton";
import Permission from "../../auth/Permission";


const REDUX_KEY = "acChecks";
const SEARCH_URL = "aircraft-check/search";

type ACCheck = {
  id: number,
  aircraftModelId: number;
  aircraftModelName: string;
  checkDescription: string;
  checkId: number;
  checkTitle: string;
  flyingDay?: number;
  flyingHour?: number;
  isActive: boolean;
}

export default function ACChecks() {
  const dispatch = useDispatch();
  const {aircraftModels, initAircraftModels} = useAircraftModelList();
  const {collection, page, size, totalElements, paginate, isActive, setIsActive, fetchData, form} = usePaginate(REDUX_KEY, SEARCH_URL)

  useEffect(() => {
    (async () => {
      await initAircraftModels();
    })();
  }, [])

  const { t } = useTranslation()

  const formatHour = (value:any) => {
    if (value) {
        return Number(value).toFixed(2).replace(".", ":") + ' FH';
    }
    return "";
};

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-chart-line" />
            <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t("planning.A/C Checks.A/C Checks")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_CHECK_AC_CHECKS_SEARCH" showFallback>
      <ARMCard title={<LinkAndTitle title={t("planning.A/C Checks.A/C Check List")} link="add" addBtn permission="PLANNING_CHECK_AC_CHECKS_SAVE" />}>

        <Form
          form={form}
          name="filter-form"
          initialValues={{aircraftModelId: null, size: DEFAULT_PAGE_SIZE}}
          onFinish={fetchData}
        >
          <Row gutter={20}>
            <Col xs={24} md={4}>
              <Form.Item
                name="aircraftModelId"
              >
                <Select
                  placeholder={t("planning.A/C Type.Aircraft Model")}
                >
                  {
                    aircraftModels.map(({id, name}) => <Select.Option value={id} key={id}>{name}</Select.Option>)
                  }
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={5} lg={4}>
              <PageSizesFormItem/>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item>
                <Space>
                  <ARMButton size="middle" type="primary" htmlType="submit">
                    <FilterOutlined name="filter"/> {t("common.Filter")}
                  </ARMButton>
                  <ARMButton
                    size="middle"
                    type="primary"
                    onClick={() => {
                      form.resetFields();
                      fetchData();
                    }}
                  >
                    <RollbackOutlined name="reset"/> {t("common.Reset")}
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

        <Row className="table-responsive">
          <ARMTable>
            <thead>
            <tr>
              <th>{t("planning.A/C Checks.Title")}</th>
              <th>{t("planning.A/C Checks.Description")}</th>
              <th>{t("planning.A/C Checks.Aircraft Model Name")}</th>
              <th>{t("planning.A/C Checks.Flying Hour")}</th>
              <th>{t("planning.A/C Checks.Flying Day")}</th>
              <th>{t("common.Actions")}</th>
            </tr>
            </thead>
            <tbody>
            {collection.map((check: ACCheck) => (
              <tr key={check.id}>
                <td>{check.checkTitle}</td>
                <td className='newLineInRow'>{check.checkDescription}</td>
                <td>{check.aircraftModelName}</td>
                <td>{formatHour(check.flyingHour)}</td>
                <td>{check.flyingDay}</td>

                <td>
                  <Space size="small">

                    <Link to={`view/${check.id}`}>
                      <ViewButton />
                    </Link>

                    <Link to={`edit/${check.id}`}>
                      <Permission permission="PLANNING_CHECK_AC_CHECKS_EDIT">
                        <ARMButton
                          type="primary"
                          size="small"
                          style={{
                            backgroundColor: "#6e757c",
                            borderColor: "#6e757c",
                          }}
                        >
                          <EditOutlined />
                        </ARMButton>
                      </Permission>
                    </Link>
                    <Permission permission="PLANNING_CHECK_AC_CHECKS_DELETE">
                      <ActiveInactiveButton
                        confirmText="Are you sure to change the status?"
                        isActive={isActive}
                        handleOk={async () => {
                          try {
                            await API.patch(`aircraft-check/${check.id}`, {}, {
                              params: {
                                active: !check.isActive
                              }
                            });
                            // @ts-ignore
                            dispatch(refreshPagination(REDUX_KEY, SEARCH_URL))
                            notifySuccess(t("common.Status Changed Successfully"))
                          } catch (e) {
                            notifyResponseError(e)
                          }
                        }}
                      />
                   </Permission>
                  </Space>
                </td>
              </tr>
            ))}
            </tbody>
          </ARMTable>
        </Row>

        {
          collection.length > 0 && (
            <Row justify="center">
              <Col style={{marginTop: 10}}>
                <Pagination showSizeChanger={false} onShowSizeChange={console.log} pageSize={size} current={page} onChange={paginate} total={totalElements}/>
              </Col>
            </Row>
          )
        }

      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}