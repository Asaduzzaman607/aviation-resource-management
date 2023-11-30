import {InputNumber, Form, Input, Select} from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
const {Option} = Select

const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {

    const inputNode = inputType === 'number' ? <InputNumber />
            : inputType === 'text-area' ? <TextArea />
            : inputType === 'select' ? <Select>
                    <Option value="AOG">AOG</Option>
                    <Option value="NORMAL">NORMAL</Option>
                    <Option value="CRITICAL">CRITICAL</Option>
                </Select>
                : inputType === 'd-select' ? <Select
                        mode="multiple"
                    >


                    </Select>
            : <Input />

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    /*rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}*/
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
export default EditableCell
