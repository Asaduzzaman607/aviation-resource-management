import React from 'react';
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb} from "antd";
import {Link} from "react-router-dom";
import Permission from "../../auth/Permission";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import CommonLayout from "../../layout/CommonLayout";
import {useTranslation} from "react-i18next";
import {useAcCheckDone} from "../../../lib/hooks/planning/useAcCheckDone";
import AcCheckDoneForm from "./AcCheckDoneForm";

const AddAcCheckDone = () => {

    const { form, id, onReset, onFinish, checkType } = useAcCheckDone();
    const PAGE_TITLE = id ? "Aircraft CHECK DONE EDIT" : "Aircraft CHECK DONE ADD";
    const { t } = useTranslation();


    return (
        <CommonLayout>
            
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/planning">
                            <i className="fas fa-chart-line" />
                            &nbsp; {t("planning.Planning")}
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <Link to="/planning/a-check-done">Aircraft Check Done</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{!id ? t("common.Add") : t("common.Edit")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission={["PLANNING_AIRCRAFT_AC_CHECK_DONE_SAVE","PLANNING_AIRCRAFT_AC_CHECK_DONE_EDIT"]} showFallback>
                <ARMCard title={getLinkAndTitle(PAGE_TITLE, "/planning/ac-check-done/",false,"PLANNING_AIRCRAFT_AC_CHECK_DONE_SAVE")}>
                    <AcCheckDoneForm form={form} checkType={checkType} onFinish={onFinish} onReset={onReset} id={id} />
                </ARMCard>
            </Permission>
        </CommonLayout>
    );
};

export default AddAcCheckDone;