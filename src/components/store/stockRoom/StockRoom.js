import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { useEffect } from 'react';
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
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { usePaginate } from '../../../lib/hooks/paginations';
import API from '../../../service/Api';
import ActiveInactive from '../../common/ActiveInactive';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import Permission from "../../auth/Permission";

const StockRoom = () => {
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
  } = usePaginate('stockRooms', '/store-management/store-stock-rooms/search');

  useEffect(() => {
    fetchData();
  }, []);

  console.log('stockRooms: ', collection);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/store">
              {' '}
              <i className="fas fa-archive" /> &nbsp;Store
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Stock Rooms</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
     <Permission permission="STORE_STORE_CONFIGURATION_STOCK_ROOM_SEARCH" showFallback>
      <ARMCard
        title={getLinkAndTitle(
          'Stock ROOM LIST',
          '/store/stock-room/add',
          true,
          'STORE_STORE_CONFIGURATION_STOCK_ROOM_SAVE'
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
              <Form.Item
                name="query"
                label="Store Room"
                rules={[
                  {
                    max: 255,
                    message: 'Maximum 255 characters allowed',
                  },
                  {
                    whitespace: true,
                    message: 'Only space is not allowed',
                  },
                ]}
              >
                <Input placeholder="Search Stock Room" />
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

        <Row className="table-responsive">
          <ResponsiveTable>
            <ARMTable>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Stock Room No.</th>
                  <th>Office Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collection?.map((stockRoom) => (
                  <tr key={stockRoom.stockRoomId}>
                    <td>{stockRoom.stockRoomCode}</td>
                    <td>{stockRoom.stockRoomNo}</td>
                    <td>{stockRoom.officeCode}</td>
                    <td>
                      <Space size="small">
                        {/*<ARMButton*/}
                        {/*  type="primary"*/}
                        {/*  size="small"*/}
                        {/*  style={{*/}
                        {/*    backgroundColor: '#4aa0b5',*/}
                        {/*    borderColor: '#4aa0b5',*/}
                        {/*  }}*/}
                        {/*>*/}
                        {/*  <EyeOutlined />*/}
                        {/*</ARMButton>*/}
                          <Permission permission='STORE_STORE_CONFIGURATION_STOCK_ROOM_EDIT'>
                              <Link
                                  to={`/store/stock-room/edit/${stockRoom.stockRoomId}`}
                              >
                                  <ARMButton
                                      type="primary"
                                      size="small"
                                      style={{
                                          backgroundColor: '#6e757c',
                                          borderColor: '#6e757c',
                                      }}
                                  >
                                      <EditOutlined/>
                                  </ARMButton>
                              </Link>
                          </Permission>
                        <Permission permission='STORE_STORE_CONFIGURATION_STOCK_ROOM_DELETE'>
                        <ActiveInactiveButton
                          isActive={isActive}
                          handleOk={async () => {
                            try {
                              await API.patch(
                                '/store-management/store-stock-rooms/' +
                                  stockRoom.stockRoomId +
                                  '?active=' +
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
        </Row>

        {collection.length === 0 ? (
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
          </Row>
        )}
      </ARMCard>
     </Permission>
    </CommonLayout>
  );
};

export default StockRoom;
