import { DatePicker, Form, Input, InputNumber } from "antd";
import React from "react";
import RibbonCard from "../../common/forms/RibbonCard";

export default function EngineTimesRGB() {
  return (
    <RibbonCard ribbonText="Engine Times RGB">
     
      <Form.Item name="engineTimesRgbDate" label="Date">
        <DatePicker size="small" format="DD-MM-YYYY" placeholder="" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="EngineTimesRgbHour" label="Hour">
        <InputNumber maxLength={9} style={{width:"100%"}} size="small"
        onKeyDown={(e) => {
          (e.key === "e" || e.key === "-") &&
            e.preventDefault();
        }}
        />
      </Form.Item>
      <Form.Item name="EngineTimesRgbCycle" label="Cycle">
        <InputNumber maxLength={9} style={{width:"100%"}} size="small"
        onKeyDown={(e) => {
          (e.key === "e" || e.key === "-" || e.key === ".") &&
            e.preventDefault();
        }}
        />
      </Form.Item>
    </RibbonCard>
  );
}
