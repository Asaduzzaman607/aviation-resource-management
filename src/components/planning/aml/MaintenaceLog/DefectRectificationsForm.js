import { Checkbox, Col, DatePicker, Divider, Form, Input, Radio, Row, Select, TimePicker } from "antd";
import RibbonCard from "../../../common/forms/RibbonCard";
import { DEFECTS_FORM_DATA } from "./aml.constants";
import React, { useState, useEffect } from "react";
import useAMLContext from "../../../../contexts/aml";
import useSignaturesList from "../../../../lib/hooks/planning/useSignaturesList";
import useAirportsList from "../../../../lib/hooks/planning/useAirportsList";
import { useTranslation } from "react-i18next";
import moment from "moment"
import { useAMLAdd } from "../../../../lib/hooks/planning/aml";
import AMLService from "../../../../service/planning/AMLService";
import { useParams } from "react-router-dom";
import { useBoolean } from "react-use";

const { Option } = Select;
const { TextArea } = Input;
const category = [
  { id: 0, name: "A" },
  { id: 1, name: "B" },
  { id: 2, name: "C" },
  { id: 3, name: "D" },
];
const dates = {
  0: 0,
  1: 3,
  2: 10,
  3: 120,
}

export default function DefectRectificationsForm({defectsAdded}) {
  const { form } = useAMLContext();
  const { signatures } = useSignaturesList();
  const { airports } = useAirportsList();
  const { t } = useTranslation()
  const rectFirstCategory = Form.useWatch([DEFECTS_FORM_DATA, 0, "melCategory"], form)
  const rectSecondCategory = Form.useWatch([DEFECTS_FORM_DATA, 1, "melCategory"], form)
  const defectRectifications = form.getFieldValue('defectRectifications')
  const defectWoNo1 = defectRectifications[0].woNo;
  const defectWoNo2 = defectRectifications[1].woNo;
  const [value1, setValue1] = useState(0)
  const [value2, setValue2] = useState(0)
  const [value3, setValue3] = useState()
  const [value4, setValue4] = useState()
  const { disabled0, disabled1 } = useAMLAdd()
  const addMel0 = Form.useWatch([DEFECTS_FORM_DATA, 0, "addToMEL"], form)
  const addMel1 = Form.useWatch([DEFECTS_FORM_DATA, 1, "addToMEL"], form)
  const melType0 = Form.useWatch([DEFECTS_FORM_DATA, 0, "melType"], form)
  const melType1 = Form.useWatch([DEFECTS_FORM_DATA, 1, "melType"], form)
  const aircraftId = Form.useWatch('aircraftId', form)
  const [mels, setMels] = useState([])




  const findAllMel = async () => {
    const { data } = await AMLService.getAllMel(aircraftId)
    setMels(data)
  }
  useEffect(() => {
    if (!aircraftId) return
    findAllMel()
  }, [aircraftId])


  const onChange1 = e => {
    setValue1(e.target.value)
  }
  const onChange2 = e => {
    setValue2(e.target.value)
  }

  const onChange3 = e =>{
    setValue3(e.target.value)
  }
  const onChange4 = e =>{
    setValue4(e.target.value)
  }
  

  useEffect(() => {
    if (value1 !== 2) {
      form.setFieldsValue({
        defectRectifications: defectRectifications.map((def, index) => {
          if (index !== 0) return def;
          return {
            ...def,
            melId: ""
          }
        })
      })
    }
    return
  }, [value1])

  useEffect(() => {
    if (addMel0 !== true) {
      form.setFieldsValue({
        defectRectifications: defectRectifications.map((def, index) => {
          if (index !== 0) return def;
          return {
            ...def,
            melId: "",
            melType: 0
          }
        })
      })
      setValue1(0)
      return
    }
    if (addMel0 === true) {
      form.setFieldsValue({
        defectRectifications: defectRectifications.map((def, index) => {
          if (index !== 0) return def;
          return {
            ...def,
            melType: 1,
          }
        })
      })
    }
  }, [addMel0])

  useEffect(() => {
    if (addMel1 !== true) {
      form.setFieldsValue({
        defectRectifications: defectRectifications.map((def, index) => {
          if (index !== 1) return def;
          return {
            ...def,
            melId: "",
            melType: 0
          }
        })
      })
      setValue2(0)
      return
    }
    if (addMel1 === true) {
      form.setFieldsValue({
        defectRectifications: defectRectifications.map((def, index) => {
          if (index !== 1) return def;
          return {
            ...def,
            melType: 1
          }
        })
      })
    }
  }, [addMel1])

  useEffect(() => {
    if (value2 !== 2) {
      form.setFieldsValue({
        defectRectifications: defectRectifications.map((def, index) => {
          if (index !== 1) return def;
          return {
            ...def,
            melId: ""
          }
        })
      })
      return
    }
  }, [value2])

  useEffect(() => {
    if (rectFirstCategory === undefined || rectFirstCategory === null) {
      form.setFieldsValue({
        defectRectifications: defectRectifications.map((def, index) => {
          if (index !== 0) return def;
          return {
            ...def,
            dueDate: ""
          }
        })
      })
      return;
    }

    const dueDate = moment().add(dates[rectFirstCategory], 'days')
    form.setFieldsValue({
      defectRectifications: defectRectifications.map((def, index) => {
        if (index !== 0) return def;
        return {
          ...def,
          dueDate
        }
      })
    })
  }, [rectFirstCategory])

  useEffect(() => {
    if (rectSecondCategory === undefined || rectSecondCategory === null) {
      form.setFieldsValue({
        defectRectifications: defectRectifications.map((def, index) => {
          if (index !== 1) return def;
          return {
            ...def,
            dueDate: ""
          }
        })
      })
      return;
    }

    const dueDate = moment().add(dates[rectSecondCategory], 'days')
    form.setFieldsValue({
      defectRectifications: defectRectifications.map((def, index) => {
        if (index !== 1) return def;
        return {
          ...def,
          dueDate
        }
      })
    })
  }, [rectSecondCategory])


  useEffect(()=>{
    if(defectWoNo1){
      setValue3(1)
    }
    
  },[defectWoNo1])
  useEffect(()=>{
    if(defectWoNo2){
      setValue4(1)
    }
    
  },[defectWoNo2])


  return (
    <Row gutter={12}>
      <Col lg={9} xl={9} md={9} sm={24} xs={24}>
        <RibbonCard ribbonText={t("planning.ATL.Defect")}>

          {/* {
            !form.getFieldValue([DEFECTS_FORM_DATA, 0, "isAddedToMel"]) ? ( */}
          <Form.Item
            label={!disabled0 ? t("planning.ATL.Add to MEL") : t("planning.ATL.Added to MEL")}
            name={[DEFECTS_FORM_DATA, 0, "addToMEL"]}
            valuePropName="checked"
          >
            <Checkbox disabled={disabled0} />
          </Form.Item>


          
          {/* //   ) : (
          //     <Form.Item
          //       label={t("planning.ATL.Added to MEL")}
          //       name={[DEFECTS_FORM_DATA, 0, "isAddedToMel"]}
          //       valuePropName="checked"
          //     >
          //       <Checkbox disabled />
          //     </Form.Item>
          //   )
          // } */}

          {addMel0 === true ? (<> <Form.Item
            label="Mel"
            name={[DEFECTS_FORM_DATA, 0, "melType"]}
          >
            <Radio.Group onChange={onChange1} value={value1}>
              {/* <Radio value={0}>None</Radio> */}
              <Radio value={1}>Add</Radio>
              <Radio value={2}>Clear</Radio>
            </Radio.Group>
          </Form.Item>
            {value1 === 2 && <Form.Item
              label="Reference ATL"
              name={[DEFECTS_FORM_DATA, 0, "melId"]}
              rules={[
                {
                  required: true,
                  message: "Please select MEL",
                },
              ]}
            >
              <Select size="small" allowClear>
                {mels.map((data, index) => (
                  <Option key={index} value={data.melId}>
                    {data.pageNo}{data.alphabet} - Seq: {data.seqNo}
                  </Option>
                ))}
              </Select>
            </Form.Item>}
          </>)
            : null}



          <Form.Item
            label="Check"
            name={[DEFECTS_FORM_DATA, 0, "workOrder1"]}
          >
           <Radio.Group onChange={onChange3} value={2}>
              <Radio value={1}>Schedule Task</Radio>
              <Radio value={2}  checked={true}>Un-Schedule Task</Radio>
            </Radio.Group>
          </Form.Item>

          {
            value3===1 ?
            <>
            <Form.Item
            label="Work Order"
            name={[DEFECTS_FORM_DATA, 0, "woNo"]}
            rules={[
              {
                required: value3==1 || defectWoNo1 ? true : false,
                message: "Please input work order",
              },
            ]}
          >
            <Input size="small" />
          </Form.Item>
            </>
            : null
          }



          <Form.Item
            label={t("planning.ATL.Seq")}
            name={[DEFECTS_FORM_DATA, 0, "seqNo"]}
            rules={[
              {
                required: false,
                message: t("planning.ATL.Please input squence no"),
              },
            ]}
          >
            <Input size="small" />
          </Form.Item>
          <Form.Item label={t("planning.ATL.From DMI no")} name={[DEFECTS_FORM_DATA, 0, "defectDmiNo"]}>
            <Input size="small" />
          </Form.Item>

          <Form.Item label={t("planning.ATL.Description")} name={[DEFECTS_FORM_DATA, 0, "defectDescription"]}>
            <TextArea size="small" rows={3} />
          </Form.Item>

          <Form.Item name={[DEFECTS_FORM_DATA, 0, "defectSignId"]} label={t("planning.ATL.Name")}>
            <Select size="small" placeholder={t("planning.Signatures.Select employee name")} allowClear>
              {signatures.map((signature) => (
                <Option key={signature.id} value={signature.id}>
                  {signature.employeeName} - {signature.authNo}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name={[DEFECTS_FORM_DATA, 0, "defectStaId"]} label={t("planning.ATL.Station")}>
            <Select size="small" allowClear>
              {airports.map((airport) => (
                <Option key={airport.id} value={airport.id}>
                  {airport.iataCode}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item name={[DEFECTS_FORM_DATA, 0, "defectSignTime"]} label={t("planning.ATL.Signature Time")}>
            <DatePicker size="small" style={{ width: "100%" }} placeholder="" showTime />
          </Form.Item> */}
          <Form.Item name={[DEFECTS_FORM_DATA, 0, "defectSignTime"]} label={t("planning.ATL.Signature Time")} style={{ marginBottom: 0 }}>
            <Form.Item
              name="defectDate1"
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="defectTime1"
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Form.Item>
          <Form.Item label={t("planning.ATL.Remark")} name={[DEFECTS_FORM_DATA, 0, "remark"]}>
            <Input size="small" />
          </Form.Item>
        </RibbonCard>
      </Col>
      <Col lg={15} xl={15} md={15} sm={24} xs={24}>
        <RibbonCard ribbonText={t("planning.ATL.Rectifications")}>
          <Row>
            <Col md={12} sm={12}>
              <Form.Item label={t("planning.ATL.To DMI no")} name={[DEFECTS_FORM_DATA, 0, "rectDmiNo"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.MEL Ref")} name={[DEFECTS_FORM_DATA, 0, "rectMelRef"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.Description")} name={[DEFECTS_FORM_DATA, 0, "rectDescription"]}
                rules={[
                  {
                    required: addMel0? true:false,
                    message: t("Rectification Description is required"),
                  },
                ]}
              >
                <TextArea size="small" rows={5} />
              </Form.Item>
              <Form.Item name={[DEFECTS_FORM_DATA, 0, "rectSignId"]} label={t("planning.ATL.Name")}>
                <Select size="small" allowClear>
                  {signatures.map((signature) => (
                    <Option key={signature.id} value={signature.id}>
                      {signature.employeeName} - {signature.authNo}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name={[DEFECTS_FORM_DATA, 0, "rectStaId"]} label={t("planning.ATL.Station")}>
                <Select size="small" allowClear>
                  {airports.map((airport) => (
                    <Option key={airport.id} value={airport.id}>
                      {airport.iataCode}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {/* <Form.Item name={[DEFECTS_FORM_DATA, 0, "rectSignTime"]} label={t("planning.ATL.Signature Time")}>
                <DatePicker size="small" style={{ width: "100%" }} placeholder="" showTime />
              </Form.Item> */}
              <Form.Item name={[DEFECTS_FORM_DATA, 0, "rectSignTime"]} label={t("planning.ATL.Signature Time")} style={{ marginBottom: 0 }}>
                <Form.Item
                  name="defectDate2"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  name="defectTime2"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                >
                  <TimePicker format="HH:mm" style={{ width: "100%" }} />
                </Form.Item>
              </Form.Item>
              <Form.Item label={t("planning.ATL.Reason for Removal")} name={[DEFECTS_FORM_DATA, 0, "reasonForRemoval"]}>
                <Input size="small" />
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label={t("planning.ATL.Category")} name={[DEFECTS_FORM_DATA, 0, "melCategory"]}>
                <Select allowClear size="small">
                  {category.map((data, index) => (
                    <Option key={index} value={data.id}>
                      {data.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                  name={[DEFECTS_FORM_DATA, 0, "dueDate"]}
                  label={t("planning.MEL.Due Date")}
                  rules={[
                    {
                      required: melType0 === 1? true:false,
                      message: t("planning.ATL.Please input squence no"),
                    },
                  ]}
              >
                <DatePicker size="small" format="DD-MM-YYYY" style={{ width: "100%" }} placeholder="" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.ATA")} name={[DEFECTS_FORM_DATA, 0, "rectAta"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.POS")} name={[DEFECTS_FORM_DATA, 0, "rectPos"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.P/N off")} name={[DEFECTS_FORM_DATA, 0, "rectPnOff"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.S/N off")} name={[DEFECTS_FORM_DATA, 0, "rectSnOff"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.P/N on")} name={[DEFECTS_FORM_DATA, 0, "rectPnOn"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.S/N on")} name={[DEFECTS_FORM_DATA, 0, "rectSnOn"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.GRN")} name={[DEFECTS_FORM_DATA, 0, "rectGrn"]}>
                <Input size="small" />
              </Form.Item>
            </Col>
          </Row>
        </RibbonCard>
      </Col>
      <Divider />
      <Col lg={9} xl={9} md={9} sm={24} xs={24}>
        <RibbonCard ribbonText={t("planning.ATL.Defect")}>
          {/* {
            !form.getFieldValue([DEFECTS_FORM_DATA, 1, "isAddedToMel"]) ? ( */}
          <Form.Item
            label={!disabled1 ? t("planning.ATL.Add to MEL") : t("planning.ATL.Added to MEL")}
            name={[DEFECTS_FORM_DATA, 1, "addToMEL"]}
            valuePropName="checked"
          >
            <Checkbox disabled={disabled1} />
          </Form.Item>
          {/* //   ) : (
          //     <Form.Item
          //       label={t("planning.ATL.Added to MEL")}
          //       name={[DEFECTS_FORM_DATA, 1, "isAddedToMel"]}
          //       valuePropName="checked"
          //     >
          //       <Checkbox disabled />
          //     </Form.Item>
          //   )
          // } */}


          {addMel1 === true ? (<><Form.Item
            label="Mel"
            name={[DEFECTS_FORM_DATA, 1, "melType"]}
          >
            <Radio.Group onChange={onChange2} value={value2}>
              {/* <Radio value={0}>None</Radio> */}
              <Radio value={1}>Add</Radio>
              <Radio value={2}>Clear</Radio>
            </Radio.Group>
          </Form.Item>
            {value2 === 2 && <Form.Item
              label="Reference ATL"
              name={[DEFECTS_FORM_DATA, 1, "melId"]}
              rules={[
                {
                  required: true,
                  message: "Please select MEL",
                },
              ]}
            >
              <Select size="small" allowClear>
                {mels.map((data, index) => (
                  <Option key={index} value={data.melId}>
                    {data.pageNo}{data.alphabet} - Seq: {data.seqNo}
                  </Option>
                ))}
              </Select>
            </Form.Item>}
          </>) : null}


          <Form.Item
            label="Check"
            name={[DEFECTS_FORM_DATA, 1, "workOrder1"]}
          >
           <Radio.Group onChange={onChange4} value={2}>
              <Radio value={1}>Schedule Task</Radio>
              <Radio value={2}  checked={true}>Un-Schedule Task</Radio>
            </Radio.Group>
          </Form.Item>

          {
            value4===1?
            <>
            <Form.Item
            label="Work Order"
            name={[DEFECTS_FORM_DATA, 1, "woNo"]}
            rules={[
              {
                required: value4==1 || defectWoNo2 ? true : false,
                message: "Please input work order",
              },
            ]}
          >
            <Input size="small" />
          </Form.Item>
            </>
            : null
          }


          <Form.Item
            label={t("planning.ATL.Seq")}
            name={[DEFECTS_FORM_DATA, 1, "seqNo"]}
            rules={[
              {
                required: false,
                message: t("planning.ATL.Please input squence no"),
              },
            ]}
          >
            <Input size="small" />
          </Form.Item>
          <Form.Item label={t("planning.ATL.From DMI no")} name={[DEFECTS_FORM_DATA, 1, "defectDmiNo"]}>
            <Input size="small" />
          </Form.Item>

          <Form.Item label={t("planning.ATL.Description")} name={[DEFECTS_FORM_DATA, 1, "defectDescription"]}>
            <TextArea size="small" rows={3} />
          </Form.Item>
          <Form.Item name={[DEFECTS_FORM_DATA, 1, "defectSignId"]} label={t("planning.ATL.Name")}>
            <Select size="small" allowClear>
              {signatures.map((signature) => (
                <Option key={signature.id} value={signature.id}>
                  {signature.employeeName} - {signature.authNo}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={[DEFECTS_FORM_DATA, 1, "defectStaId"]} label={t("planning.ATL.Station")}>
            <Select size="small" allowClear>
              {airports.map((airport) => (
                <Option key={airport.id} value={airport.id}>
                  {airport.iataCode}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* <Form.Item name={[DEFECTS_FORM_DATA, 1, "defectSignTime"]} label={t("planning.ATL.Signature Time")}>
            <DatePicker size="small" style={{ width: "100%" }} placeholder="" showTime />
          </Form.Item> */}
          <Form.Item name={[DEFECTS_FORM_DATA, 1, "defectSignTime"]} label={t("planning.ATL.Signature Time")} style={{ marginBottom: 0 }}>
            <Form.Item
              name="rectDate1"
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="rectTime1"
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Form.Item>
          <Form.Item label={t("planning.ATL.Remark")} name={[DEFECTS_FORM_DATA, 1, "remark"]}>
            <Input size="small" />
          </Form.Item>
        </RibbonCard>
      </Col>
      <Col lg={15} xl={15} md={15} sm={24} xs={24}>
        <RibbonCard ribbonText={t("planning.ATL.Rectifications")}>
          <Row>
            <Col md={12} sm={12}>
              <Form.Item label={t("planning.ATL.To DMI no")} name={[DEFECTS_FORM_DATA, 1, "rectDmiNo"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.MEL Ref")} name={[DEFECTS_FORM_DATA, 1, "rectMelRef"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.Description")} name={[DEFECTS_FORM_DATA, 1, "rectDescription"]}
               rules={[
                {
                  required: addMel1?true:false,
                  message: t("planning.ATL.Please input squence no"),
                },
              ]}
              >
                <TextArea size="small" rows={5} />
              </Form.Item>
              <Form.Item name={[DEFECTS_FORM_DATA, 1, "rectSignId"]} label={t("planning.ATL.Name")}>
                <Select size="small" allowClear>
                  {signatures.map((signature) => (
                    <Option key={signature.id} value={signature.id}>
                      {signature.employeeName} - {signature.authNo}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name={[DEFECTS_FORM_DATA, 1, "rectStaId"]} label={t("planning.ATL.Station")}>
                <Select size="small" allowClear>
                  {airports.map((airport) => (
                    <Option key={airport.id} value={airport.id}>
                      {airport.iataCode}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {/* <Form.Item name={[DEFECTS_FORM_DATA, 1, "rectSignTime"]} label={t("planning.ATL.Signature Time")}>
                <DatePicker size="small" style={{ width: "100%" }} placeholder="" showTime />
              </Form.Item> */}
              <Form.Item name={[DEFECTS_FORM_DATA, 1, "rectSignTime"]} label={t("planning.ATL.Signature Time")} style={{ marginBottom: 0 }}>
                <Form.Item
                  name="rectDate2"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  name="rectTime2"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                >
                  <TimePicker format="HH:mm" style={{ width: "100%" }} />
                </Form.Item>
              </Form.Item>
              <Form.Item label={t("planning.ATL.Reason for Removal")} name={[DEFECTS_FORM_DATA, 1, "reasonForRemoval"]}>
                <Input size="small" />
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label={t("planning.ATL.Category")} name={[DEFECTS_FORM_DATA, 1, "melCategory"]}>
                <Select allowClear size="small">
                  {category.map((data, index) => (
                    <Option key={index} value={data.id}>
                      {data.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name={[DEFECTS_FORM_DATA, 1, "dueDate"]}
                         label={t("planning.MEL.Due Date")}
                         rules={[
                           {
                             required: melType1 === 1? true:false,
                             message: t("planning.ATL.Please input squence no"),
                           },
                         ]}
              >
                <DatePicker size="small" format="DD-MM-YYYY" style={{ width: "100%" }} placeholder="" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.ATA")} name={[DEFECTS_FORM_DATA, 1, "rectAta"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.POS")} name={[DEFECTS_FORM_DATA, 1, "rectPos"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.P/N off")} name={[DEFECTS_FORM_DATA, 1, "rectPnOff"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.S/N off")} name={[DEFECTS_FORM_DATA, 1, "rectSnOff"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.P/N on")} name={[DEFECTS_FORM_DATA, 1, "rectPnOn"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.S/N on")} name={[DEFECTS_FORM_DATA, 1, "rectSnOn"]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item label={t("planning.ATL.GRN")} name={[DEFECTS_FORM_DATA, 1, "rectGrn"]}>
                <Input size="small" />
              </Form.Item>
            </Col>
          </Row>
        </RibbonCard>
      </Col>


    </Row>
  );
}
