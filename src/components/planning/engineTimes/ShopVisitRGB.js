import { DatePicker, Form, Input, InputNumber } from "antd";
import React from "react";
import RibbonCard from "../../common/forms/RibbonCard";

export default function ShopVisitRGB() {
  return (
    <RibbonCard ribbonText="Shop Visit RGB">
      <Form.Item
        name="shopVisitRgbDate"
        label="Date"
        rules={[
          {
            required: false,
            message: "This field is required",
          },
        ]}
      >
        <DatePicker size="small" placeholder="" format="DD-MM-YYYY" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="shopVisitRgbTsn" label="TSN">
        <InputNumber
          style={{width:"100%"}}
          maxLength={9}
          size="small"
          onKeyDown={(e) => {
            (e.key === "e" || e.key === "-") && e.preventDefault();
          }}
        />
      </Form.Item>
      <Form.Item name="shopVisitRgbCsn" label="CSN">
        <InputNumber
          style={{width:"100%"}}
          maxLength={9}
          size="small"
          onKeyDown={(e) => {
            (e.key === "e" || e.key === "-" || e.key === ".") &&
              e.preventDefault();
          }}
        />
      </Form.Item>
      <Form.Item name="shopVisitRgbTso" label="TSO">
        <InputNumber
          style={{width:"100%"}}
          maxLength={9}
          size="small"
          onKeyDown={(e) => {
            (e.key === "e" || e.key === "-") && e.preventDefault();
          }}
        />
      </Form.Item>
      <Form.Item name="shopVisitRgbCso" label="CSO">
        <InputNumber
          style={{width:"100%"}}
          maxLength={9}
          size="small"
          onKeyDown={(e) => {
            (e.key === "e" || e.key === "-" || e.key === ".") &&
              e.preventDefault();
          }}
        />
      </Form.Item>
      <Form.Item
        name="shopVisitRgbStatus"
        label="Status"
        rules={[
          {
            max: 20,
            message: "Maximum 20 characters is allowed!",
          },
        ]}
      >
        <Input size="small" />
      </Form.Item>
    </RibbonCard>
  );
}
