import {Col, List, Row} from 'antd';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import {setLocation} from '../../reducers/routeLocation.reducers';
import ARMCard from '../common/ARMCard';
import CommonLayout from '../layout/CommonLayout';
import useFeaturesPermission, {Types} from "../../lib/hooks/useFeaturesPermission";
import {useMemo, useState} from "react";
import permissions from "../auth/permissions";

const Logistic = () => {

  const dispatch = useDispatch();
  dispatch(setLocation({value: 'logistic'}));
  const {hasPermission} = useFeaturesPermission();
  const [logisticSubmodule] = useState([
    {
      name: 'Quote Request',
      items: [
        {name: 'Request for Quotation(RFQ)', url: 'shipment-provider-rfq'},
        {
          name: 'Pending RFQ',
          url: 'pending-shipment-provider-rfq',
        },
        {
          name: 'Approved RFQ',
          url: 'approved-shipment-provider-rfq',
        },
        {
          name: 'Quotation',
          url: 'shipment-provider-quotation',
        },
      ],
    },
    {
      name: 'Comparative Statement',
      items: [
        {name: 'Generate CS', url: 'comparative-statement'},
        {name: 'Pending CS', url: 'pending-comparative-statement'},
        {name: 'Approved CS', url: 'approved-comparative-statement'},
      ],
    },
    {
      name: 'Purchase Order',
      items: [
        {name: 'Order', url: 'purchase-order/add'},
        {name: 'Pending Order', url: 'pending-purchase-order'},
        {name: 'Approved Order', url: 'approved-purchase-order'},
        // { name: 'Purchase Order Report', url: 'purchase-order-report-list' },
        // { name: 'Invoice Report', url: 'invoice-report' },
      ],
    },
    {
      name: 'Purchase Invoice',
      items: [
        {name: 'Purchase Invoice', url: 'purchase-invoice'},
        {name: 'Pending Purchase Invoice', url: 'purchase-invoice/pending'},
        {name: 'Approved Purchase Invoice', url: 'purchase-invoice/approved'},
      ],
    },
    {
      name: 'Tracker',
      permission: permissions.subModules.LOGISTIC_TRACKER,
      items: [
        {
          name: 'Tracker List',
          url: 'tracker-list',
          permission: permissions.subModuleItems.TRACKER,
        },
      ],
    },
    {
      name: 'Duty Fees',
      permission: permissions.subModules.DUTY_FEES,
      items: [
        {name: 'Duty Fees List', url: 'duty-fees/list', permission: permissions.subModuleItems.DUTY_FEES},
      ],
    },
  ]);

  const filteredLogisticSubmodules = useMemo(
    () => logisticSubmodule
      .filter(item => hasPermission(item.permission, Types.SUB_MODULE))
      .map(({name, permission, items}) => {
        return {
          name,
          permission,
          items: items?.filter(feature => hasPermission(feature.permission, Types.SUB_MODULE_ITEM))
        }
      }),
    [logisticSubmodule]
  );

  return (
    <div>
      <CommonLayout>
        <Row gutter={[6, 6]}>
          {filteredLogisticSubmodules.map((subModule) => (
            <Col
              key={subModule.name}
              md={6}
              sm={12}
              xs={24}
            >
              <ARMCard title={subModule.name?.toUpperCase()}>
                <List
                  itemLayout="horizontal"
                  dataSource={subModule.items}
                  renderItem={(item) => (
                    <List.Item>
                      <Link
                        style={{width: '100%'}}
                        to={`/logistic/${item.url}`}
                      >
                        {item.name}
                      </Link>
                    </List.Item>
                  )}
                />
              </ARMCard>
            </Col>
          ))}
        </Row>
      </CommonLayout>
    </div>
  );
};

export default Logistic;
