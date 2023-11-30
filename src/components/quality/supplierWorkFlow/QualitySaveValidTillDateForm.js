import React from 'react';
import {Col, DatePicker, Form, Modal, notification, Row, Space} from "antd";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import QualitySupplierService from "../../../service/quality/QualitySupplierService";
import {getErrorMessage} from "../../../lib/common/helpers";
import QualityManufacturerService from "../../../service/quality/QualityManufacturerService";
import {Status} from "../../../lib/constants/status-button";
import moment from "moment";

const QualitySaveValidTillDateForm = ({
                                        editModal, setEditModal,
                                        title, isManufacture,
                                        id, isActive, fetchData,
                                        page, refreshPagination,
                                        validTill
                                      }) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const onFinish = async (value) => {
    try {
      if (isManufacture) {
        await QualityManufacturerService.saveValidity(id, {validTill: value['validTill']?.format('YYYY-MM-DD')})

      } else {
        await QualitySupplierService.saveValidity(id, {validTill: value['validTill']?.format('YYYY-MM-DD')})
      }
      notification['success']({message: 'Valid Till date Added Successfully'});
      setEditModal(false)
      isActive === Status.REJECTED
        ? fetchData({
          isActive,
          type: 'REJECTED',
          page: page,
        })
        : refreshPagination();
    } catch (error) {
      notification['error']({message: getErrorMessage(error)});
    }
  }
  return (
    <>
      <Modal
        title={title}
        visible={editModal}
        width={600}
        footer={null}
        onCancel={() => setEditModal(false)}
      >
        <ARMForm
          {...layout}
          form={form}
          name="quality-validDate"
          onFinish={onFinish}
        >
          <Row>
            <Col span={24}>
              <Form.Item
                name="validTill"
                label="Approval Valid Till"
                rules={[
                  {
                    required: true,
                    message: 'Date is required!',
                  },
                ]}
                initialValue={validTill != null ? moment(validTill) : ""}
              >
                <DatePicker
                  size="medium"
                  style={{width: '80%'}}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col
            >
              <Form.Item wrapperCol={{...layout.wrapperCol, offset: 22}}>
                <Space size="medium">
                  <ARMButton
                    style={{marginRight: '5px'}}
                    type="primary"
                    htmlType="submit"
                  >
                    {validTill ? 'Edit' : 'Submit'}
                  </ARMButton>
                  <ARMButton
                    onClick={() => form.resetFields()}
                    type="primary"
                    danger
                  >
                    Reset
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </ARMForm>
      </Modal>
    </>
  );
};

export default QualitySaveValidTillDateForm;