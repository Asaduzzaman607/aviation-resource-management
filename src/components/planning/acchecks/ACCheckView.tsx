import {Breadcrumb, Col, Row} from "antd";
import {Link} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import {LinkAndTitle} from "../../../lib/common/TitleOrLink";
import {useTranslation} from "react-i18next";
import API from "../../../service/Api";
import {notifyResponseError} from "../../../lib/common/notifications";
import {ARMReportTable} from "../report/ARMReportTable";
import {useParamsId} from "../../../lib/hooks/common";

export default function ACCheckView() {
  const {t} = useTranslation();
  const id = useParamsId('acCheckId') as number;
  const [acCheck, setAcCheck] = useState<any>({});

  const fetchCheckById = useCallback(async () => {
    if (!id) return;
    try {
      const {data} = await API.get(`/aircraft-check/${id}`)
      setAcCheck({...data})
    } catch (er) {
      notifyResponseError(er);
    }
  }, [id]);

  useEffect(() => {
    (async () => {
      await fetchCheckById();
    })();
  }, [fetchCheckById])

  return (
    <div>
      <CommonLayout>
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <i className="fas fa-chart-line"/>
              <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <Link to="/planning/ac-checks">{t("planning.A/C Checks.A/C Checks")}</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item> {t("common.Details")}</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>

        <ARMCard title={<LinkAndTitle title={`${t("planning.A/C Checks.A/C Check")} ${t("common.Details")}`} link="/planning/ac-checks" addBtn={false} permission="PLANNING_CHECK_AC_CHECKS_SEARCH"/>}>

          <Row>
            <Col span={12}>
              <ARMReportTable>
                <tbody>
                <tr>
                  <th>Aircraft</th>
                  <td>
                    {acCheck.aircraftModelName}
                  </td>
                </tr>

                <tr>
                  <th>Check</th>
                  <td>{acCheck.checkTitle}</td>
                </tr>

                <tr>
                  <th>Flying Hour</th>
                  <td>{acCheck.flyingHour}</td>
                </tr>

                <tr>
                  <th>Flying Day</th>
                  <td>{acCheck.flyingDay}</td>
                </tr>

                {
                  acCheck.aircraftCheckTasks?.length > 0 && (
                    <>
                      <tr>
                        <th rowSpan={acCheck.aircraftCheckTasks.length}>Tasks</th>
                        <td>
                          {
                            acCheck.aircraftCheckTasks.map((task: { taskId: number, taskNo: string }) => <>
                              <span>{task.taskNo}</span>
                              <br/>
                            </>)
                          }
                        </td>
                      </tr>


                    </>
                  )
                }
                </tbody>
              </ARMReportTable>
            </Col>
          </Row>

        </ARMCard>
      </CommonLayout>
    </div>
  );
}