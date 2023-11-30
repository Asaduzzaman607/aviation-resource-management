import { Button, Row, Space } from "antd";
import classNames from "classnames";
import {Status} from "../../lib/constants/status-button";

function ActiveInactiveRejected({ isActive, setIsActive  }) {
    return (
        <Row>
            <Button
                onClick={() => {
                    setIsActive(Status.ACTIVE)
                }}
                size="middle"
                id="active-button"
                className={classNames({ "active-button": isActive === Status.ACTIVE })}
            >
                Active
            </Button>

            <Button
                onClick={() => {
                    setIsActive(Status.INACTIVE)
                }}
                size="middle"
                id="inactive-button"
                className={classNames({ "inactive-button": isActive === Status.INACTIVE })}
            >
                Inactive
            </Button>

             <Button
                    onClick={() => {
                      setIsActive(Status.REJECTED)
                    }}
                    size="middle"
                    id="rejected-button"
                    className={classNames({ "rejected-button": isActive === Status.REJECTED })}
                >
                    Rejected
              </Button>
        </Row>
    );
}

export default ActiveInactiveRejected;
