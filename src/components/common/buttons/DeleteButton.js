import ARMButton from "./ARMButton";
import {
    DeleteOutlined,
  QuestionCircleFilled,
  UnlockOutlined,
} from "@ant-design/icons";
import React from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";
import { NOOP } from "../../../lib/common/helpers";

const { confirm } = Modal;

export default function DeleteButton({handleOk,confirmText}) {
  const clickHandler = () => {
    confirm({
      content: confirmText,
      type: "warning",
      icon: <QuestionCircleFilled />,
      onOk: handleOk,
    });
  };

  return (
    <ARMButton
      onClick={clickHandler}
      style={{
        backgroundColor: "#FF0000",
        borderColor: "#FF0000",
      }}
      type="primary"
      size="small"
    >
      <DeleteOutlined />
    </ARMButton>
  );
}

DeleteButton.defaultProps = {
  confirmText: <h3>Are you sure want to delete this?</h3>,
  handleOk: NOOP,
};

DeleteButton.propTypes = {
  handleOk: PropTypes.func,
};
