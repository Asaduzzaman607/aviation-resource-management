import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Col,
  Empty,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Space,
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError, notifySuccess } from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { Status } from '../../../lib/constants/status-button';
import { usePaginate } from '../../../lib/hooks/paginations';
import ItemDemandService from '../../../service/ItemDemandService';
import WorkflowActionService from '../../../service/WorkflowActionService';
import Permission from '../../auth/Permission';
import subModules from '../../auth/sub_module';
import ActiveInactive from '../../common/ActiveInactive';
import ApproveDenyButtons from '../../common/ApproveDenyButtons';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import Loading from '../common/Loading';
import {useDispatch} from "react-redux";
import {setLocation} from "../../../reducers/routeLocation.reducers";
const { Option } = Select;

const PendingDemandList = () => {
  const [workFlowActions, setWorkFlowActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  dispatch(setLocation({ value:'list'}));
  const {
    form,
    collection,
    page,
    totalElements,
    paginate,
    isActive,
    setIsActive,
    fetchData,
    refreshPagination,
    size,
  } = usePaginate('pendingDemand', '/store-demands/search');

  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true);
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        subModules.STORE_DEMANDS
      );
      setWorkFlowActions(data.model);
    } catch (er) {
      notifyError(getErrorMessage(er));
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id) => {
    try {
      await ItemDemandService.toggleStatus(
        id,
        isActive !== Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE
      );
      notifySuccess('Status Changed Successfully!');
      const values = form.getFieldsValue();
      isActive === Status.REJECTED
        ? fetchData({ isActive, type: 'REJECTED', page: page, ...values })
        : refreshPagination();
    } catch (er) {
      notifyError(getErrorMessage(er));
    }
  };

  const handleApprove = async (id, params) => {
    try {
      await ItemDemandService.toggleApprove(id, params);
      refreshPagination();
      notifySuccess('Status changed successfully!');
    } catch (e) {
      notifyError(getErrorMessage(e));
    }
  };

  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-archive" />
            <Link to="/store">&nbsp; {t('store.Store')}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {t('store.Pending Demand.Pending Demands')}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="STORE_PARTS_DEMAND_PENDING_DEMAND_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            t('store.Pending Demand.Pending Demand List'),
            '/store/item-demand',
            true,
            'STORE_PARTS_DEMAND_STORE_DEMAND_SAVE'
          )}
        >
          <Form
            form={form}
            onFinish={(values) =>
              isActive === Status.REJECTED
                ? fetchData({ type: 'REJECTED', ...values })
                : fetchData({ ...values })
            }
          >
            <Row gutter={20}>
              <Col
                xs={24}
                md={12}
                lg={8}
              >
                <Form.Item
                  label={t('store.Pending Demand.Voucher No')}
                  name="query"
                >
                  <Input placeholder="Enter Voucher No." />
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={12}
                lg={6}
              >
                <Form.Item
                  name="size"
                  label={t('common.Page Size')}
                  initialValue="10"
                >
                  <Select id="antSelect">
                    <Option value="10">10</Option>
                    <Option value="20">20</Option>
                    <Option value="30">30</Option>
                    <Option value="40">40</Option>
                    <Option value="50">50</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={12}
                lg={4}
              >
                <Form.Item>
                  <Space>
                    <ARMButton
                      size="middle"
                      type="primary"
                      htmlType="submit"
                    >
                      <FilterOutlined /> {t('common.Filter')}
                    </ARMButton>
                    <ARMButton
                      size="middle"
                      type="primary"
                      onClick={() => {
                        form.resetFields();
                        isActive === Status.REJECTED
                          ? fetchData({ type: 'REJECTED' })
                          : fetchData();
                      }}
                    >
                      <RollbackOutlined /> {t('common.Reset')}
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <ActiveInactive
            isActive={isActive}
            setIsActive={setIsActive}
            workFlow={true}
          />
          {!loading ? (
            <>
              <ResponsiveTable>
                <ARMTable>
                  <thead>
                    <tr>
                      <th rowSpan={2}>
                        {t('store.Pending Demand.Voucher No')}
                      </th>
                      <th colSpan={workFlowActions.length}>
                        {t('store.Pending Demand.Approvals')}
                      </th>
                      <th rowSpan={2}>{t('store.Pending Demand.Status')}</th>
                      {isActive === Status.ACTIVE && (
                        <th rowSpan={2}>{t('store.Pending Demand.Approve')}</th>
                      )}
                      <th rowSpan={2}>{t('common.Actions')}</th>
                    </tr>
                    <tr>
                      {workFlowActions?.map((action) => (
                        <td key={action.id}>{action.label.toUpperCase()}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {collection?.map((data, index) => (
                      <tr key={data.id}>
                        <td>{data.voucherNo}</td>
                        {workFlowActions?.map((action) => (
                          <td key={action.id}>
                            {data.approvalStatuses[action.id]?.updatedByName ||
                              ''}
                          </td>
                        ))}
                        <td>{data.workflowName}</td>
                        {isActive === Status.ACTIVE && (
                          <td>
                            <ApproveDenyButtons
                              data={data}
                              handleOk={handleApprove}
                            />
                          </td>
                        )}

                        <td>
                          <Space size="small">
                            <Link
                              to={`/store/pending-demand/details/${data.id}`}
                            >
                              <ARMButton
                                type="primary"
                                size="small"
                                style={{
                                  backgroundColor: '#4aa0b5',
                                  borderColor: '#4aa0b5',
                                }}
                              >
                                <EyeOutlined />
                              </ARMButton>
                            </Link>
                            <Permission permission="STORE_PARTS_DEMAND_PENDING_DEMAND_EDIT">
                              <Link to={`/store/item-demand/${data.id}`}>
                                <ARMButton
                                  disabled={!data.editable}
                                  type="primary"
                                  size="small"
                                  style={{
                                    backgroundColor: '#6e757c',
                                    borderColor: '#6e757c',
                                  }}
                                >
                                  <EditOutlined />
                                </ARMButton>
                              </Link>
                            </Permission>
                            <Permission permission="STORE_PARTS_DEMAND_PENDING_DEMAND_DELETE">
                              <ActiveInactiveButton
                                isActive={isActive}
                                handleOk={() => handleStatus(data.id)}
                              />
                            </Permission>
                          </Space>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ARMTable>
              </ResponsiveTable>
              {/*** for pagination ***/}
              <Row>
                <Col style={{ margin: '0 auto' }}>
                  {collection.length === 0 ? (
                    <Row justify="end">
                      <Empty style={{ marginTop: '10px' }} />
                    </Row>
                  ) : (
                    <Row justify="center">
                      <Col style={{ marginTop: 10 }}>
                        <Pagination
                          showSizeChanger={false}
                          onShowSizeChange={console.log}
                          pageSize={size}
                          current={page}
                          onChange={paginate}
                          total={totalElements}
                        />
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            </>
          ) : (
            <Loading />
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};
export default PendingDemandList;
