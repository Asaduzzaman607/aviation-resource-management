import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Permission from '../../components/auth/Permission';

export const getLinkAndTitle = (
  title,
  link,
  addBtn = false,
  permission = ''
) => {

  return (
    <Row justify="space-between">
      <Col>{title}</Col>
      <Permission permission={permission}>
        <Col>
          <Button
            type="primary"
            style={{
              backgroundColor: '#04aa6d',
              borderColor: 'transparent',
              borderRadius: '15px',
            }}
          >
            {addBtn === 'blank' ? (
              ''
            ) : addBtn ? (
              <Link
                title="add"
                to={link}
              >
                <PlusOutlined /> Add
              </Link>
            ) : (
              <Link
                title="back"
                to={-1}
              >
                <ArrowLeftOutlined /> Back
              </Link>
            )}
          </Button>
        </Col>
      </Permission>
    </Row>
  );
};

export const LinkAndTitle = ({
  title,
  link,
  addBtn,
  permission = '',
  addMultiple,
}) => {
  const { t } = useTranslation();
  return (
    <Row justify="space-between">
      <Col>{title}</Col>
      <Permission permission={permission}>
        <Col>
          <Button
            type="primary"
            style={{
              backgroundColor: '#04aa6d',
              borderColor: 'transparent',
              borderRadius: '15px',
            }}
          >
            {addBtn ? (
              <Link
                title="add"
                to={link}
              >
                <PlusOutlined /> {t('common.Add')}
              </Link>
            ) : addMultiple ? (
              <Link
                title="add"
                to={link}
              >
                <PlusOutlined /> Add Multiple Defect
              </Link>
            ) : (
              <Link
                title="back"
                to={-1}
              >
                <ArrowLeftOutlined /> {t('common.Back')}{' '}
              </Link>
            )}
          </Button>
        </Col>
      </Permission>
    </Row>
  );
};

LinkAndTitle.defaultProps = {
  addBtn: false,
  addMultiple: false,
};
