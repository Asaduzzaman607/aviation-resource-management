import { DatePicker, Form, Input, InputNumber } from "antd";
import React from "react";
import RibbonCard from "../../common/forms/RibbonCard";

export default function ShopVisitTmm() {
  return (
    <>
      <RibbonCard ribbonText="Shop Visit TMM">
        <Form.Item
          name="shopVisitTmmDate"
          label="Date"
          rules={[
            {
              required: false,
              message: "This field is required",
            }
          ]}
        >
          <DatePicker size="small" format="DD-MM-YYYY" placeholder="" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="shopVisitTmmTsn" label="TSN">
          <InputNumber style={{width:"100%"}} maxLength={9} size="small"
          onKeyDown={(e) => {
            (e.key === "e" || e.key === "-") &&
              e.preventDefault();
          }}
          />
        </Form.Item>
        <Form.Item name="shopVisitTmmCsn" label="CSN">
          <InputNumber  style={{width:"100%"}} maxLength={9} size="small"
          onKeyDown={(e) => {
            (e.key === "e" || e.key === "-" || e.key === ".") &&
              e.preventDefault();
          }}
          />
        </Form.Item>
        <Form.Item name="shopVisitTmmTso" label="TSO">
          <InputNumber  maxLength={9} style={{width:"100%"}} size="small"
          onKeyDown={(e) => {
            (e.key === "e" || e.key === "-") &&
              e.preventDefault();
          }}
          />
        </Form.Item>
        <Form.Item name="shopVisitTmmCso" label="CSO">
          <InputNumber maxLength={9} style={{width:"100%"}} size="small"
          onKeyDown={(e) => {
            (e.key === "e" || e.key === "-" || e.key === ".") &&
              e.preventDefault();
          }}
          />
        </Form.Item>

        <Form.Item
          name="shopVisitTmmStatus"
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
    </>
  );
}
