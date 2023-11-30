import { Form, Input } from "antd";
import React from "react";
import RibbonCard from "../../common/forms/RibbonCard";

const EngineTimesNameExtension = () => {
  return (
    <RibbonCard
      ribbonText="Engine Times Name Extension">
      <Form.Item name="nameExtension" label="Name Extension"
      rules={[
        {
          required: true,
          message: "This field is required",
        },
        {
          max:20,
          message:"maximum 20 character is allowed"
        }
      ]}
      >
        <Input size="small" />
      </Form.Item>
    </RibbonCard>
  );
};

export default EngineTimesNameExtension;
