import { Col, Form, Input, Row, Space, Tooltip } from 'antd';
import { useState } from 'react';
import ARMForm from '../../../lib/common/ARMForm';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError, notifySuccess } from '../../../lib/common/notifications';
import { formLayout } from '../../../lib/constants/layout';
import SerialNoServices from '../../../service/SerialNoServices';
import ARMButton from '../../common/buttons/ARMButton';

function SaveSerial({ setShowModal, form, index, partId, partNo, setSerials }) {
  const [serialForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 12,
    },
  };

  console.log('part No', { partNo });

  const setSerialToForm = (values, id) => {
    setSerials((prev) => [
      {
        serialId: id,
        serialNo: values.serialNumber,
      },
      ...prev,
    ]);
    const dtoList = form.getFieldValue('serialDtoList').map((serial, idx) => {
      if (index === idx) {
        return {
          ...serial,
          serialId: id,
        };
      } else {
        return serial;
      }
    });
    form.setFieldValue('serialDtoList', dtoList);
  };

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      const {
        data: { id },
      } = await SerialNoServices.saveSerialNo({
        partId,
        ...values,
      });
      setSerialToForm(values, id);
      notifySuccess('Serial saved successfully!');
      setShowModal(false);
    } catch (e) {
      notifyError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ARMForm
      {...layout}
      form={serialForm}
      onFinish={onFinish}
    >
      <Form.Item label="Part No">
        <Input
          disabled
          value={partNo?.label}
        />
      </Form.Item>

      <Form.Item
        label="Serial No"
        name="serialNumber"
        rules={[
          {
            required: true,
            message: 'Serial no. is required',
          },
        ]}
      >
        <Input placeholder="Input Serial No" />
      </Form.Item>
      <Row>
        <Col
          sm={20}
          md={10}
          offset={6}
        >
          <Form.Item
            style={{ marginTop: '10px' }}
            wrapperCol={{ ...formLayout.wrapperCol }}
          >
            <Space size="small">
              <Tooltip
                title={
                  partId ? '' : 'Select Part No from Parts Availability First'
                }
                color="green"
                overlayStyle={{ maxWidth: '600px' }}
              >
                <ARMButton
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  disabled={partId ? false : true}
                >
                  Submit
                </ARMButton>
              </Tooltip>
              <ARMButton
                onClick={() => serialForm.resetFields()}
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
  );
}

export default SaveSerial;
