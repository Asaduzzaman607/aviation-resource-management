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
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { usePaginate } from '../../../lib/hooks/paginations';
import UnitofMeasurementService from '../../../service/UnitofMeasurementService';
import Permission from '../../auth/Permission';
import ActiveInactive from '../../common/ActiveInactive';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import ViewUnit from './ViewUnit';

const UnitofMeasurementList = () => {
  const { Option } = Select;

  useEffect(() => {
    fetchData();
  }, []);

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
  } = usePaginate('uom', '/store/unit/measurements/search');

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
              <i className="fas fa-cog" /> &nbsp;Configurations
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Unit of Measurements</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="CONFIGURATION_CONFIGURATION_UNIT_OF_MEASUREMENT_SEARCH" showFallback>
        <ARMCard
          title={getLinkAndTitle(
            'Unit of Measurement LIST',
            '/configurations/add-unit-of-measurement',
            true,
            'CONFIGURATION_CONFIGURATION_UNIT_OF_MEASUREMENT_SAVE'
          )}
        >
          <Form
            form={form}
            onFinish={fetchData}
          >
            <Row gutter={20}>
              <Col
                xs={24}
                md={6}
              >
                <Form.Item name="query">
                  <Input placeholder="Enter Name " />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                md={4}
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
                md={8}
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collection?.map((data, index) => (
                  <tr key={data.id}>
                    <td>{data.code}</td>
                    <td>
                      <Space size="small">
                        <Permission permission={'CONFIGURATION_CONFIGURATION_UNIT_OF_MEASUREMENT_EDIT'} showFallback>
                         <Link
                           to={`/configurations/edit-unit-of-measurement/${data.id}`}
                         >
                           <ARMButton
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

                        <Permission permission={"CONFIGURATION_CONFIGURATION_UNIT_OF_MEASUREMENT_DELETE"} showFallback>
                          <ActiveInactiveButton
                            isActive={isActive}
                            handleOk={async () => {
                              try {
                                await UnitofMeasurementService.toggleStatus(
                                  data.id,
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
                        </Permission>
                      </Space>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ARMTable>
          </ResponsiveTable>
          <Row>
            {collection.length === 0 ? (
              <Col style={{ margin: '30px auto' }}>
                <Empty />
              </Col>
            ) : null}
          </Row>

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
            <ViewUnit
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              base={base}
            />
          </Row>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default UnitofMeasurementList;
