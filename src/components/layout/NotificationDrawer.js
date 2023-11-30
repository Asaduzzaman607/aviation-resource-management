import { Alert, Drawer, Empty } from 'antd';

export default function NotificationDrawer({ count, open, onClose }) {
  const renderItems = () => {
    return Array.from({ length: count }, (_, index) => (
      <Alert
        key={index}
        message="Success Tips"
        description="Detailed description and advice about successful copywriting."
        type="success"
        showIcon
        closable
        style={{
          marginBottom: '15px',
          borderRadius: '15px',
          boxShadow:
            '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        }}
      />
    ));
  };

  return (
    <Drawer
      title="Notifications"
      placement="right"
      onClose={onClose}
      open={open}
    >
      {count !== 0 ? (
        renderItems()
      ) : (
        <Empty
          style={{
            marginTop: '250px',
          }}
          description="No Notifications"
        />
      )}
    </Drawer>
  );
}
