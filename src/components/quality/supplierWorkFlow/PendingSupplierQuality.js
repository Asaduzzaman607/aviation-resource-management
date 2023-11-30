import {EditOutlined, EyeOutlined, FilterOutlined, RollbackOutlined,} from '@ant-design/icons';
import {Breadcrumb, Button, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space,} from 'antd';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {getErrorMessage} from '../../../lib/common/helpers';
import {notifyError, notifySuccess} from '../../../lib/common/notifications';
import {getLinkAndTitle} from '../../../lib/common/TitleOrLink';
import {Status} from '../../../lib/constants/status-button';
import {usePaginate} from '../../../lib/hooks/paginations';
import QualitySupplierService from '../../../service/quality/QualitySupplierService';
import WorkflowActionService from '../../../service/WorkflowActionService';
import Permission from '../../auth/Permission';
import permissions from '../../auth/permissions';
import ActiveInactive from '../../common/ActiveInactive';
import ApproveDenyButtons from '../../common/ApproveDenyButtons';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import MSPDetails from '../../configaration/manufacturer/MSPDetails';
import CommonLayout from '../../layout/CommonLayout';
import Loading from '../../store/common/Loading';
import useViewDetails from '../../store/hooks/ViewDetails';
import QualitySaveValidTillDateForm from "./QualitySaveValidTillDateForm";

const { Option } = Select;

const PendingSupplierQuality = () => {
  const [workFlowActions, setWorkFlowActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [supplierId, setSupplierId] = useState();
  const [validTill, setValidTill] = useState();

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
  } = usePaginate(
    'qualityPendingSupplier',
    '/material-management/config/quality/supplier/search',
    {
      workflowType: 'QUALITY',
    }
  );

  const { isModalOpen, setIsModalOpen, data, handleViewDetails } =
    useViewDetails();

  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true);
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        permissions.subModuleItems.QUALITY_SUPPLIER_PENDING_LIST
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
      await QualitySupplierService.handleStatus(
        id,
        isActive !== Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE
      );
      notifySuccess('Status Changed Successfully!');
      const values = form.getFieldsValue();
      isActive === Status.REJECTED
        ? fetchData({
            isActive,
            type: 'REJECTED',
            page: page,
            ...values,
          })
        : refreshPagination();
    } catch (e) {
      notifyError(getErrorMessage(e));
    }
  };

  const handleApprove = async (id, status) => {
    try {
      await QualitySupplierService.handleApprove(id, status);
      refreshPagination();
      notification['success']({
        message: 'Status changed successfully!',
      });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);

  const resetData = () => {
    form.resetFields();
    isActive === Status.REJECTED
      ? fetchData({
          type: 'REJECTED',
          workflowType: 'QUALITY',
        })
      : fetchData({ workflowType: 'QUALITY' });
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-clipboard-check"></i>
            <Link to="/quality">&nbsp; Quality</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Pending Supplier</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission="QUALITY_QUALITY_SUPPLIER_QUALITY_SUPPLIER_PENDING_LIST_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            'Pending Supplier LIST',
            '/material-management/supplier/add',
            'blank',
            'QUALITY_QUALITY_SUPPLIER_QUALITY_SUPPLIER_PENDING_LIST_SAVE'
          )}
        >
          <Form
            form={form}
            onFinish={(values) =>
              isActive === Status.REJECTED
                ? fetchData({
                    type: 'REJECTED',
                    ...values,
                  })
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
                  label="Supplier Name"
                  name="query"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="workflowType"
                  initialValue="QUALITY"
                  hidden
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={12}
                lg={6}
              >
                <Form.Item
                  name="size"
                  label="Page Size"
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
                      <FilterOutlined /> Filter
                    </ARMButton>
                    <ARMButton
                      size="middle"
                      type="primary"
                      htmlType="submit"
                      onClick={resetData}
                    >
                      <RollbackOutlined /> Reset
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
                      <th rowSpan={2}>Supplier Name</th>
                      <th colSpan={workFlowActions.length}>APPROVALS</th>
                      <th rowSpan={2}>Status</th>
                      {isActive === Status.ACTIVE && (
                        <th rowSpan={2}>Approve</th>
                      )}
                      <th rowSpan={2}>Actions</th>
                    </tr>
                    <tr>
                      {
                        workFlowActions?.map((action) => (
                          <td key={action.id}>{action.label.toUpperCase()}</td>
                        ))
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {collection?.map((data, index) => (
                      <tr key={data.id}>
                        <td>{data.name}</td>
                        {workFlowActions?.map((action) => (
                          <td key={action.id}>
                            {data.qualityApprovalStatuses[action.id]
                              ?.updatedByName || ''}
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
                            <ARMButton
                              type="primary"
                              size="small"
                              style={{
                                backgroundColor: '#4aa0b5',
                                borderColor: '#4aa0b5',
                              }}
                              onClick={() => handleViewDetails(data)}
                            >
                              <EyeOutlined />
                            </ARMButton>
                             <Permission permission='QUALITY_QUALITY_SUPPLIER_QUALITY_SUPPLIER_PENDING_LIST_EDIT'>

                               <Button
                                 type="primary"
                                 size="small"
                                 style={{
                                   backgroundColor: '#6e757c',
                                   borderColor: '#6e757c',
                                 }}
                                 onClick={() => {
                                   setEditModal(true)
                                   setSupplierId(data.id)
                                   setValidTill(data.validTill)
                                 }}
                               >
                                 <EditOutlined/>
                               </Button>
                          </Permission>
                            <Permission permission="QUALITY_QUALITY_SUPPLIER_QUALITY_SUPPLIER_PENDING_LIST_DELETE">
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
                      <MSPDetails
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        data={data}
                        details='Supplier Details'
                      />
                    </Row>
                  )}
                </Col>
              </Row>
              {
                editModal &&
                <QualitySaveValidTillDateForm
                  editModal={editModal}
                  setEditModal={setEditModal}
                  title="Supplier"
                  isManufacture={false}
                  id={supplierId}
                  isActive={isActive}
                  fetchData={fetchData}
                  page={page}
                  refreshPagination={refreshPagination}
                  validTill={validTill}
                />
              }
            </>
          ) : (
            <Loading />
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default PendingSupplierQuality;
