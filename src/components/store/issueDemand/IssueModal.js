import { Button, Modal } from 'antd';
import { useState } from 'react';

const IssueModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="primary"
        onClick={() => setOpen(true)}
      >
        Open Modal of 1000px width
      </Button>

      <Modal
        title="Modal 1000px width"
        centered
        visible={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    </>
  );
};
export default IssueModal;
