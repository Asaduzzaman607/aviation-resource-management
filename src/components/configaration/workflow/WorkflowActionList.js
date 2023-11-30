import {
  EditOutlined,
  FilterOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Col,
  Empty,
  Form,
  Input,
  notification,
  Pagination,
  Row,
  Select,
  Space,
} from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { usePaginate } from '../../../lib/hooks/paginations';
import workflowActionService from '../../../service/WorkflowActionService';
import Permission from '../../auth/Permission';
import ActiveInactive from '../../common/ActiveInactive';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import ViewWorkflow from './ViewWorkflow';

const WorkflowActionList = () => {
  const { Option } = Select;
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
    resetFilter,
    size,
  } = usePaginate('workflowAction', 'workflow-actions/search');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [base, setBase] = useState([]);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/configurations">
              {' '}
              <i className="fas fa-cog ant-menu-item-icon" />{' '}
              &nbsp;Configarations
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Workflow Actions</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission permission="CONFIGURATION_ADMINISTRATION_WORKFLOW_ACTIONS_SEARCH">
        <ARMCard
          title={getLinkAndTitle(
            'Workflow Actions LIST',
            '/configurations/workflow-actions/add',
            true,
            'CONFIGURATION_ADMINISTRATION_WORKFLOW_ACTIONS_SAVE'
          )}
        >
          <Form
            form={form}
            onFinish={fetchData}
          >
            <Row gutter={20}>
              <Col
                xs={24}
                md={12}
                lg={8}
              >
                <Form.Item
                  label="Workflow action"
                  name="query"
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
                      onClick={resetFilter}
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
          />

          <ResponsiveTable>
            <ARMTable>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Ordering</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {collection?.map((workflow, index) => (
                  <tr key={index}>
                    <td>{workflow.name}</td>
                    <td>{workflow.orderNumber}</td>

                    <td>
                      <Space size="small">
                        <ARMButton
                          type="primary"
                          size="small"
                          style={{
                            backgroundColor: '#6e757c',
                            borderColor: '#6e757c',
                          }}
                          disabled={!workflow.editable}
                        >
                          <Link
                            to={`/configurations/workflow-actions/edit/${workflow.id}`}
                          >
                            <EditOutlined />
                          </Link>
                        </ARMButton>

                        <ActiveInactiveButton
                          isActive={isActive}
                          handleOk={async () => {
                            try {
                              await workflowActionService.toggleStatus(
                                workflow.id,
                                !isActive
                              );
                              notification['success']({
                                message: 'Status Changed Successfully!',
                              });
                              refreshPagination();
                            } catch (e) {
                              notification['error']({
                                message: getErrorMessage(e),
                              });
                            }
                          }}
                        />
                      </Space>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ARMTable>
          </ResponsiveTable>
          {collection?.length === 0 ? (
            <Row>
              <Col style={{ margin: '30px auto' }}>
                <Empty />
              </Col>
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
              <ViewWorkflow
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                base={base}
              />
            </Row>
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default WorkflowActionList;
