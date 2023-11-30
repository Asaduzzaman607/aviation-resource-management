import { Form, Input, InputNumber, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useContext, useEffect, useRef, useState } from 'react';

const { Option } = Select;

const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      component={false}
    >
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  inputType,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  const inputNode =
    inputType === 'number' ? (
      <InputNumber
        min={0}
        type="number"
        ref={inputRef}
        onPressEnter={save}
        onBlur={save}
        style={{ width: '100%' }}
      />
    ) : inputType === 'text-area' ? (
      <TextArea
        ref={inputRef}
        onPressEnter={save}
        onBlur={save}
      />
    ) : inputType === 'select' ? (
      <Select
        ref={inputRef}
        onBlur={save}
        placeholder="--Select--"
      >
        <Option
          key={1}
          value="AOG"
        >
          AOG
        </Option>
        <Option
          key={2}
          value="NORMAL"
        >
          NORMAL
        </Option>
        <Option
          key={3}
          value="CRITICAL"
        >
          CRITICAL
        </Option>
      </Select>
    ) : (
      <Input />
    );

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
          paddingBottom: '2px',
        }}
        name={dataIndex}
        // rules={
        //   dataIndex === 'requiredQty'
        //     ? [
        //         {
        //           type: 'number',
        //           min: 1,
        //           message: "Qty can't be less than 1",
        //         },
        //       ]
        //     : []
        // }
      >
        {inputNode}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          minHeight: '33px',
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
