import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import {Button, Col, Form, notification, Row, Select, Upload} from 'antd';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import ARMForm from '../../../lib/common/ARMForm';
import { notifySuccess } from '../../../lib/common/notifications';
import StorePartFIleUploadService from '../../../service/store/StorePartFIleUploadService';
import ARMButton from '../../common/buttons/ARMButton';
import DebounceSelect from '../../common/DebounceSelect';
import RibbonCard from '../../common/forms/RibbonCard';
import {PART_TYPES, ROTABLE} from "./constants";
import {formLayout} from "../../../lib/constants/layout";

const StoreParts = ({ setErrors }) => {
  const { Option } = Select;
  const [fileName, setFilename] = useState(null);
  const [file, setFile] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [form] = Form.useForm();
  const [select, setSelect] = useState(true);
  const [isAcType, setIsAcType] = useState(false);
  const partType = Form.useWatch('partType', form);
  // Accept File Name
  const acceptableFileName = ['xlsx', 'xls'];
  const checkFileName = (name) => {
    return acceptableFileName.includes(name.split('.').pop().toLowerCase());
  };

  const handleFiles = async (e) => {
    const file = e.file;
    if (!file) return;
    if (!checkFileName(file.name)) {
      alert('Invalid File Type');
      return;
    }
    const data = await file?.arrayBuffer();
    const wb = XLSX.read(data);

    // Assign the Sheet
    setSheetNames(wb.SheetNames);
    setFilename(file.name);
    setFile(file);
  };
  const handleFilesChange = () => {
    setSheetNames('');
    setErrors([]);
  };
  const onFinish = async (values) => {
    await StorePartFIleUploadService.uploadFile(values)
      .then((response) => {
        let message = [];
        for (const prop in response.data) {
          if (response.data[prop].status === 'OK') {
            notifySuccess(`[${prop}] ${response.data[prop].successMessage}`);
          } else {
            message.push(`Sheet Name: ${prop}`);
            response.data[prop].errorMessages.map((data, index) => {
              message.push(`${index + 1}. ${data}`);
            });
          }
        }
        setErrors(message);
      })
      .catch((error) => {
        notification['error']({
          message: error.response.data.apiErrors[0].message,
        });
        console.log('something went wrong', error);
      });
  };

  function handlePartTypeChange(e) {
 if(e===""||e===undefined || e===null) setIsAcType(false)
    if(e===1) setIsAcType(true)
    if(e===2|| e===3) setIsAcType(false)
  }

  return (
    <RibbonCard ribbonText={'File Upload'}>
      <ARMForm
        onFinish={onFinish}
        autoComplete="off"
        form={form}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100%',
            minWidth: '100%',
            height: 'auto',
            width: '100%',
          }}
        >
          <div
            style={{
              minHeight: '40vh',
              height: 'auto',
              backGround: 'white',
              fontfamily: 'Poppins, sans-serif',
              minWidth: '200px',
              width: '500px',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '20px',
              padding: '20px',
            }}
          >
        <Row>
          <Col>
            <Form.Item
              label="Part Type"
              name="partType"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Select
                placeholder="--- Select Part Type ---"
                allowClear
                options={PART_TYPES}
                onChange={(e)=>handlePartTypeChange(e)}
              >
              </Select>
            </Form.Item>
            {
              isAcType?<>
                <Form.Item
                  name="aircraftModelId"
                  label="AC Type"
                  rules={[
                    {
                      required: Number(partType) === ROTABLE,
                      message: 'This field is required',
                    },
                  ]}
                >
                  <DebounceSelect
                    mapper={(v) => ({
                      label: v.aircraftModelName,
                      value: v.id,
                    })}
                    showSearch
                    placeholder="--- Select AC Type ---"
                    type="multi"
                    url={`/aircraft/models/search?page=1&size=20`}
                  />
                </Form.Item>
              </>:""
            }

            <Form.Item
              name="file"
              rules={[
                {
                  required: true,
                  message: ' File is required!',
                },
              ]}
            >
              <Upload.Dragger
                // onChange={handleFileInput}
                onChange={(e) => {
                  handleFiles(e);
                }}
                progress
                accept=".csv,.xlsx,.xls"
                showUploadList={true}
                type="file"
                listType="picture"
                onRemove={handleFilesChange}
                beforeUpload={() => false}
                style={{ maxWidth: '50vh', minWidth: '100px', padding: '10px' }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p
                  className="ant-upload-text"
                  style={{ fontSize: '14px' }}
                >
                  Click or drag file to this area to upload
                </p>
                <Button icon={<UploadOutlined />}>Click to upload</Button>{' '}
                &nbsp;
              </Upload.Dragger>
            </Form.Item>
            <div
              style={{
                padding: '15px',
              }}
            >
              <Form.Item name="sheetName">
                {sheetNames.length > 0 && (
                  <Select
                    style={{ width: '50vh' }}
                    mode="multiple"
                    maxTagCount={20}
                    placeholder="-- Select Sheet --"
                    dropdownRender={(menu) => (
                      <>
                        {select ? (
                          <span
                            style={{
                              marginLeft: '0px',
                              padding: '5px',
                              background: '#E7E7E7F0',
                              cursor: 'pointer',
                              display: 'block',
                              color: '#313131',
                            }}
                            type="button"
                            onClick={() => {
                              form.setFieldsValue({
                                sheetName: [...sheetNames],
                              });
                              setSelect(!select);
                            }}
                          >
                            select All
                          </span>
                        ) : (
                          <span
                            style={{
                              marginLeft: '0px',
                              padding: '5px',
                              cursor: 'pointer',
                              background: '#E7E7E7F0',
                              display: 'block',
                              color: '#313131',
                            }}
                            type="button"
                            onClick={() => {
                              setSelect(!select);
                              form.setFieldsValue({ sheetName: [] });
                              setErrors([]);
                            }}
                          >
                            unselect All
                          </span>
                        )}
                        {menu}
                      </>
                    )}
                  >
                    {sheetNames.map((data) => (
                      <Option
                        key={data}
                        value={data}
                      >
                        {data}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </div>
          </Col>
        </Row>
          </div>
        </div>
        <div
          style={{
            paddingTop: '15px',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <ARMButton
            type="primary"
            htmlType="submit"
          >
            Submit
          </ARMButton>
        </div>
      </ARMForm>
    </RibbonCard>
  );
};

export default StoreParts;
