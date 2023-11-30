import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { NOOP } from '../../lib/common/helpers';
import { notifyError } from '../../lib/common/notifications';

export default function ApproveDenyButtons({
  data,
  confirmText,
  handleOk,
  ...rest
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [rejectedDesc, setRejectedDesc] = useState('');
  const [approvalDesc, setApprovalDesc] = useState('');

  const inputRef = useRef();

  const showModalApprove = () => {
    setIsModalVisible(true);
    setIsApproved(true);
    setApprovalDesc('');
  };
  const showModalDeny = () => {
    setIsModalVisible(true);
    setIsApproved(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOkReject = () => {
    if (rejectedDesc === '') {
      setIsModalVisible(true);
      notifyError('Rejection description must not be empty!');
      return;
    }
    setIsModalVisible(false);
    handleOk(data.id, {
      approve: false,
      rejectedDesc: rejectedDesc,
    });
  };
  const handleOkApprove = () => {
    if (approvalDesc === '') {
      setIsModalVisible(true);
      notifyError('Approval description must not be empty!');
      return;
    }
    setIsModalVisible(false);
    handleOk(data.id, {
      approve: true,
      approvalDesc: approvalDesc,
    });
  };

  const handleChange = (e) => {
    !isApproved
      ? setRejectedDesc(e.target.value)
      : setApprovalDesc(e.target.value);
  };

  return (
    <>
      <Space>
        <Button
          disabled={!data.actionEnabled}
          size="small"
          {...rest}
          onClick={showModalApprove}
          style={{ color: 'green', width: '30px' }}
          title="approve"
        >
          <CheckOutlined style={{ marginLeft: '-3px', marginTop: '4px' }} />
        </Button>
        <Button
          disabled={!data.actionEnabled}
          size="small"
          {...rest}
          onClick={showModalDeny}
          style={{ color: 'red', width: '30px' }}
          title="deny"
        >
          <CloseOutlined style={{ marginLeft: '-2px', marginTop: '4px' }} />
        </Button>
      </Space>
      {!isApproved ? (
        <Modal
          title="Reason of Rejection"
          visible={isModalVisible}
          onOk={handleOkReject}
          onCancel={handleCancel}
          destroyOnClose
        >
          <Form>
            <Form.Item
              label="Reason: "
              name="reason"
              rules={[
                {
                  required: true,
                  message: 'This field is required!',
                },
              ]}
            >
              <TextArea
                ref={inputRef}
                rows={5}
                onChange={(e) => handleChange(e)}
              />
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        <Modal
          title="Reason of Approve"
          visible={isModalVisible}
          onOk={handleOkApprove}
          onCancel={handleCancel}
          destroyOnClose
        >
          <Form>
            <Form.Item
              label="Reason: "
              name="reason"
              rules={[
                {
                  required: true,
                  message: 'This field is required!',
                },
              ]}
            >
              <TextArea
                ref={inputRef}
                rows={5}
                onChange={(e) => handleChange(e)}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
}

ApproveDenyButtons.defaultProps = {
  confirmText: <h3>Are You sure ?</h3>,
  handleOk: NOOP,
};

ApproveDenyButtons.propTypes = {
  handleOk: PropTypes.func,
};
