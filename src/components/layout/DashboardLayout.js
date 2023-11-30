import { Layout } from 'antd';
import PropTypes from 'prop-types';

const { Content } = Layout;

export default function DashboardLayout({ children }) {
  return (
    <Layout
      style={{ minHeight: '100vh' }}
      className="site-layout"
    >
      <Content
        style={{
          margin: '1em',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}

DashboardLayout.defaultProps = {
  children: (
    <h1 style={{ fontSize: '35px', textAlign: 'center' }}>
      <b>Welcome to ARM System</b>
    </h1>
  ),
};

DashboardLayout.propTypes = {
  children: PropTypes.element.isRequired,
};
