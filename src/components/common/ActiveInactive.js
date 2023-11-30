import { Button, Row } from 'antd';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Status } from '../../lib/constants/status-button';

function ActiveInactive({ isActive, setIsActive, workFlow = false }) {
  const { t } = useTranslation();

  return (
    <Row>
      <Button
        onClick={() => setIsActive(Status.ACTIVE)}
        size="middle"
        id="active-button"
        className={classNames('zero-border-radius', {
          'active-button': isActive === Status.ACTIVE,
        })}
      >
        {t('common.Active')}
      </Button>

      <Button
        onClick={() => setIsActive(Status.INACTIVE)}
        size="middle"
        id="inactive-button"
        className={classNames('zero-border-radius', {
          'inactive-button': isActive === Status.INACTIVE,
        })}
      >
        {t('common.Inactive')}
      </Button>
      {workFlow && (
        <>
          <Button
            onClick={() => {
              setIsActive(Status.REJECTED);
            }}
            size="middle"
            id="rejected-button"
            className={classNames('zero-border-radius', {
              'rejected-button': isActive === Status.REJECTED,
            })}
          >
            Rejected
          </Button>
        </>
      )}
    </Row>
  );
}

export default ActiveInactive;
