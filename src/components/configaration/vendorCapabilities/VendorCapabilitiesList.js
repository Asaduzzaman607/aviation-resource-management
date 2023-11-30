import {
  EditOutlined,
  FilterOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
} from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { usePaginate } from '../../../lib/hooks/paginations';
import VendorCapabilitiesService from '../../../service/configuration/VendorCapabilitiesService';
import Permission from '../../auth/Permission';
import ActiveInactive from '../../common/ActiveInactive';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import ViewVendorList from './ViewVendorList';
const { Option } = Select;
const VendorCapabilitiesList = () => {
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
  } = usePaginate(
    'vendorCapabilities',
    '/configuration/vendor-capabilities/search'
  );
  console.log('vCap', collection);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [base, setBase] = useState([]);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-cog" />
            <Link to="/configurations">&nbsp; Configurations</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Vendor Capabilities</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="CONFIGURATION_CONFIGURATION_VENDOR_CAPABILITIES_SEARCH">
        <ARMCard
          title={getLinkAndTitle(
            'Vendor Capabilities List',
            '/configurations/add-vendor-capabilities',
            true,
            'CONFIGURATION_CONFIGURATION_VENDOR_CAPABILITIES_SAVE'
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
                  <Input placeholder="Search vendor name " />
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
                  <th>Capability Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collection?.map((data) => (
                  <tr key={data.name}>
                    <td>{data.name}</td>
                    <td>
                      <Space size="small">
                        <Link
                          to={`/configurations/edit-vendor-capabilities/${data.id}`}
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

                        <ActiveInactiveButton
                          isActive={isActive}
                          handleOk={async () => {
                            try {
                              await VendorCapabilitiesService.toggleStatus(
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
                      </Space>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ARMTable>
          </ResponsiveTable>
          <ViewVendorList
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            base={base}
          />
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default VendorCapabilitiesList;
