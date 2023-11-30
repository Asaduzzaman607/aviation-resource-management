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
  notification,
} from 'antd';
import { useState} from 'react';
import {Link} from 'react-router-dom';
import {getLinkAndTitle} from '../../../lib/common/TitleOrLink';
import {getErrorMessage} from '../../../lib/common/helpers';
import API from '../../../service/Api';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ActiveInactive from '../../common/ActiveInactive';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import CommonLayout from '../../layout/CommonLayout';
import PartDetails from '../dashboard/PartDetails';
import {usePartAvailabilityPagination} from "./partAvailityPagination";

const {Option} = Select;

const PartsAvailabilityList = () => {
  const [partId, setPartId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  } = usePartAvailabilityPagination('partAvailabilities', '/part-availabilities/search');


  function getBorder(index) {
    return index + 1 === collection.length ? '' : 'none';
  }

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-archive"/>
            <Link to="/store">&nbsp;Store</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Parts Availability</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="STORE_STORE_PARTS_AVAILABILITY_PARTS_AVAILABILITY_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            'Parts Availability List',
            '/store/store-parts',
            true,
            'STORE_STORE_PARTS_AVAILABILITY_PARTS_AVAILABILITY_SAVE'
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
                  label="Part No."
                >
                  <Input placeholder="Enter Part No. "/>
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
                      <FilterOutlined/> Filter
                    </ARMButton>
                    <ARMButton
                      size="middle"
                      type="primary"
                      onClick={() => {
                        form.resetFields();
                        fetchData()
                      }}
                    >
                      <RollbackOutlined/> Reset
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
                <th>Store</th>
                <th>Part No.</th>
                <th>Available Stock</th>
                <th>Demand Qty.</th>
                <th>Issued Qty.</th>
                <th>Requisition Qty.</th>
                <th>Min Stock</th>
                <th>Max Stock</th>
                <th>UOM</th>
                <th>UOM wise QTY</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {collection?.map((data, index) => (
                <tr key={index}>
                  {
                    data.id?
                      (
                        <>
                          <td style={{borderBottom: getBorder(index)}}>{data.officeCode}</td>
                          <td style={{borderBottom: getBorder(index)}}>{data.partNo}</td>
                          <td style={{borderBottom: getBorder(index)}}>{data.quantity}</td>
                          <td style={{borderBottom: getBorder(index)}}>{data.demandQuantity}</td>
                          <td style={{borderBottom: getBorder(index)}}>{data.issuedQuantity}</td>
                          <td style={{borderBottom: getBorder(index)}}>{data.requisitionQuantity}</td>
                          <td style={{borderBottom: getBorder(index)}}>{data.minStock}</td>
                          <td style={{borderBottom: getBorder(index)}}>{data.maxStock}</td>
                          <td>{data.uomCode}</td>
                          <td>{data.uomWiseQuantity}</td>
                          <td style={{borderBottom: getBorder(index)}}>
                            <Space size="small">
                              <ARMButton
                                type="primary"
                                size="small"
                                style={{
                                  backgroundColor: '#4aa0b5',
                                  borderColor: '#4aa0b5',
                                }}
                                onClick={() => {
                                  setIsModalOpen(true);
                                  setPartId(data.partId);
                                }}
                              >
                                <EyeOutlined/>
                              </ARMButton>
                              <Permission permission="STORE_STORE_PARTS_AVAILABILITY_PARTS_AVAILABILITY_EDIT">
                                <Link to={`/store/store-parts/edit/${data.id}`}>
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
                              <Permission permission="STORE_STORE_PARTS_AVAILABILITY_PARTS_AVAILABILITY_DELETE">
                                <ActiveInactiveButton
                                  isActive={isActive}
                                  handleOk={async () => {
                                    try {
                                      await API.patch(
                                        '/part-availabilities/' +
                                        data.id +
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
                        </>
                      )
                      : (<>
                        <td style={{borderTop: 'none', borderBottom: getBorder(index)}}>{data.officeCode}</td>
                        <td style={{borderTop: 'none', borderBottom: getBorder(index)}}>{data.partNo}</td>
                        <td style={{borderTop: 'none', borderBottom: getBorder(index)}}>{data.quantity}</td>
                        <td style={{borderTop: 'none', borderBottom: getBorder(index)}}>{data.demandQuantity}</td>
                        <td style={{borderTop: 'none', borderBottom: getBorder(index)}}>{data.issuedQuantity}</td>
                        <td style={{borderTop: 'none', borderBottom: getBorder(index)}}>{data.requisitionQuantity}</td>
                        <td style={{borderTop: 'none', borderBottom: getBorder(index)}}>{data.minStock}</td>
                        <td style={{borderTop: 'none', borderBottom: getBorder(index)}}>{data.maxStock}</td>
                        <td>{data.uomCode}</td>
                        <td>{data.uomWiseQuantity}</td>
                        <td style={{borderTop: 'none', borderBottom: getBorder(index)}}></td>
                      </>)
                  }

                </tr>
              ))}
              </tbody>
            </ARMTable>
          </ResponsiveTable>

          {collection.length === 0 ? (
            <Row>
              <Col style={{margin: '30px auto'}}>
                <Empty/>
              </Col>
            </Row>
          ) : (
            <Row justify="center">
              <Col style={{marginTop: 10}}>
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
        {partId && (
          <PartDetails
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            partId={partId}
          />
        )}
      </Permission>
    </CommonLayout>
  );
};

export default PartsAvailabilityList;
