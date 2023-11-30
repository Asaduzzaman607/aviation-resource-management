import { DatePicker, Form, Input, InputNumber } from "antd";
import React from "react";
import RibbonCard from "../../common/forms/RibbonCard";

export default function EngineTimesTMM() {
  return (
    <RibbonCard ribbonText="Engine Times TMM">
      <Form.Item name="tmmEngineTimesDate" label="Date">
        <DatePicker size="small" format="DD-MM-YYYY" placeholder="" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="engineTimesTmmHour" label="Hour">
        <InputNumber
          style={{width:"100%"}}
          maxLength={9}
          size="small"
          onKeyDown={(e) => {
            (e.key === "e" || e.key === "-") && e.preventDefault();
          }}
        />
      </Form.Item>
      <Form.Item
        name="engineTimesTmmCycle"
        label="Cycle"
        onKeyDown={(e) => {
          (e.key === "e" || e.key === "-" || e.key === ".") &&
            e.preventDefault();
        }}
      >
        <InputNumber maxLength={9} style={{width:"100%"}} size="small" />
      </Form.Item>
    </RibbonCard>
  );
}
