import {
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
  notification,
} from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { getErrorMessage } from '../../../lib/common/helpers';
import { usePaginate } from '../../../lib/hooks/paginations';
import WorkflowActionService from '../../../service/WorkflowActionService';
import Permission from '../../auth/Permission';
import subModules from '../../auth/sub_module';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import Loading from '../common/Loading';
const { Option } = Select;

const ApprovedRequisitionList = () => {
  const { form, collection, page, totalElements, paginate, fetchData, size } =
    usePaginate('approveRequisition', '/procurement-requisitions/search', {
      type: 'APPROVED',
    });

  const [workFlowActions, setWorkFlowActions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);

  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true);
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        subModules.PROCUREMENT_REQUISITIONS
      );
      setWorkFlowActions(data.model);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    console.log({ values });
    fetchData({
      ...values,
      type: 'APPROVED',
    });
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-archive" />
            <Link to="/store">&nbsp; Store</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Approve Requisition</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="STORE_PARTS_REQUISITION_APPROVED_MANAGEMENT_REQUISITION_SEARCH"
        showFallback
      >
        <ARMCard title={getLinkAndTitle('Approved Requisition List', '/store')}>
          <Form
            form={form}
            onFinish={onFinish}
            labelWrap
          >
            <Row gutter={20}>
              <Col
                xs={24}
                md={12}
                lg={4}
              >
                <Form.Item
                  label="Search Type"
                  name="searchType"
                >
                  <Select defaultValue="query">
                    <Option value="query">Voucher No</Option>
                    <Option value="partNo">Part Number</Option>
                    <Option value="demandBy">Demand By</Option>
                    <Option value="priority">Priority</Option>
                    <Option value="aircraftName">Aircraft Name</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={12}
                lg={8}
              >
                <Form.Item
                  label=""
                  name={Form.useWatch('searchType', form)}
                >
                  <Input
                    onInput={(e) =>
                      (e.target.value = e.target.value.toUpperCase())
                    }
                  />
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
                lg={5}
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
                      htmlType="button"
                      onClick={() => {
                        form.resetFields();
                        fetchData({ type: 'APPROVED' });
                      }}
                    >
                      <RollbackOutlined /> Reset
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {!loading ? (
            <>
              <ResponsiveTable>
                <ARMTable>
                  <thead>
                    <tr>
                      <th rowSpan={2}>Voucher No.</th>
                      <th colSpan={workFlowActions.length}>APPROVALS</th>
                      <th rowSpan={2}>Status</th>
                      <th rowSpan={2}>View Details</th>
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
                        <td>
                          <Link
                            to={`/store/material-management/requisition/approved/details/${data.id}`}
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

export default ApprovedRequisitionList;
