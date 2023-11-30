import PropTypes from "prop-types";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import React from "react";
import { useTranslation } from "react-i18next";

export default function AMLAddBreadCrumb({ id, toggleTab }) {
	const { t } = useTranslation()
	return (
		<ARMBreadCrumbs>
			<Breadcrumb separator="/">
				<Breadcrumb.Item>
					{" "}
					<Link to="/planning"  onClick={() => id ? toggleTab(1) : ''}>
						{" "}
						<i className="fas fa-chart-line" />
						&nbsp; {t("planning.Planning")}
					</Link>
				</Breadcrumb.Item>
				
				<Breadcrumb.Item>
					<Link to="/planning/atl" onClick={() => id ? toggleTab(1) : ''}>{t("planning.ATL.ATL")}</Link>
				</Breadcrumb.Item>
				
				<Breadcrumb.Item>{id ? t('common.Edit') : t('common.Add')}</Breadcrumb.Item>
			</Breadcrumb>
		</ARMBreadCrumbs>
	);
}


AMLAddBreadCrumb.propTypes = {
	title: PropTypes.string.isRequired
};