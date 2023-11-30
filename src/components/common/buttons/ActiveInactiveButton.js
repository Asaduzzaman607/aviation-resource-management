import ARMButton from "./ARMButton";
import { LockOutlined, QuestionCircleFilled, UnlockOutlined } from "@ant-design/icons";
import React from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";
import { NOOP } from "../../../lib/common/helpers";
import {Status} from "../../../lib/constants/status-button";

const { confirm } = Modal;

export default function ActiveInactiveButton({ isActive, confirmText, handleOk, isRejected = false, ...rest }) {

  const clickHandler = () => {
    confirm({
      content: confirmText,
      type: "warning",
      icon: <QuestionCircleFilled />,
      onOk: handleOk,
    });
  };

  return isActive === Status.REJECTED ? (
      <ARMButton
          onClick={clickHandler}
          style={{
            backgroundColor: "#53a351",
            borderColor: "#53a351",
          }}
          type="primary"
          size="small"
      >
        <UnlockOutlined />
      </ARMButton>
  ) : isActive === Status.ACTIVE ? (
      <ARMButton type="primary" size="small" onClick={clickHandler} {...rest} danger>
        <LockOutlined />
      </ARMButton>
  ) : (
      <ARMButton
          onClick={clickHandler}
          style={{
            backgroundColor: "#53a351",
            borderColor: "#53a351",
          }}
          type="primary"
          size="small"
      >
        <UnlockOutlined />
      </ARMButton>
  )
}

ActiveInactiveButton.defaultProps = {
  confirmText: <h3>Are you sure to change status?</h3>,
  handleOk: NOOP,
};

ActiveInactiveButton.propTypes = {
  handleOk: PropTypes.func,
};
