import { Col, Form, Row, Space } from "antd";
import { formLayout } from "../../../../lib/constants/form";
import ARMButton from "../../../common/buttons/ARMButton";
import React from "react";
import PropTypes from "prop-types";
import { useParamsId } from "../../../../lib/hooks/common";
import useAMLContext from "../../../../contexts/aml";
import { SAVE_AND_GO_TO_LIST, SAVE_AND_NEW_FORM } from "../../../../lib/hooks/planning/aml";
import { useTranslation } from "react-i18next";

export default function AMLFormButtons({submitting, onReset}) {
	const id = useParamsId('amlId');
	
	const { setSubmitType, form } = useAMLContext();
	
	const { t } = useTranslation()

	return (
		<Row>
			<Col sm={24} md={12}>
				<Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
					<Space>
						<ARMButton loading={submitting} type="primary" htmlType="button" onClick={() => {
							setSubmitType(SAVE_AND_GO_TO_LIST)
							form.submit()
						}}>
							{id ? t("common.Update") : t("common.Submit")}
						</ARMButton>
						
						<ARMButton loading={submitting} type="primary" htmlType="button" onClick={() => {
							setSubmitType(SAVE_AND_NEW_FORM)
							form.submit()
						}}>
							{id ? "Update & New" : "Submit & New"}
						</ARMButton>
						
						<ARMButton onClick={onReset} type="primary" danger>
							Reset
						</ARMButton>
					</Space>
				</Form.Item>
			</Col>
		</Row>
	)
}

AMLFormButtons.propTypes = {
	submitting: PropTypes.bool.isRequired,
	onReset: PropTypes.func.isRequired
};