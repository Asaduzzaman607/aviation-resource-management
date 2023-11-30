import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  LockOutlined,
  RollbackOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import {
  Breadcrumb,
  Col,
  Form,
  Input,
  notification,
  Popconfirm,
  Row,
  Select,
  Space
} from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import ItemDemandService from '../../../service/ItemDemandService';
import Permission from '../../auth/Permission';
import ActiveInactive from '../../common/ActiveInactive';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
const { Option } = Select;

const PoList = () => {
  const [isActive, setIsActive] = useState(true);
  const [demandPending, setDemandPending] = useState([]);

  // const getItemDemand=async(isActive)=>{
  //     try {
  //
  //         let { data } = await ItemDemandService.getAllItemDemand(isActive)
  //         console.log("demanddd",data.model)
  //         setDemandPending(data.model)
  //         Form.resetFields()
  //         notification["success"]({
  //             message: "Successfully added!",
  //         });
  //
  //     } catch (er) {
  //         notification["error"]({ message: getErrorMessage(er) });
  //     }
  // }
  // useEffect(() => {
  //     getItemDemand(isActive).catch(console.error)
  // }, [isActive])
  const handleStatus = async (id, status) => {
    try {
      const { data } = await ItemDemandService.toggleStatus(id, status);

      notification['success']({
        message: 'Status changed successfully!',
      });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/material-management">
              <i className="fas fa-shopping-basket" /> &nbsp;Material Management
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;Purchase Orders</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="MATERIAL_MANAGEMENT_ORDER_PURCHASE_ORDER_SEARCH">
        <ARMCard
          title={getLinkAndTitle(
            'Purchase Order list',
            '/material-management/purchase-order/add',
            'addBtn'
          )}
        >
          <Form
            initialValues={{ pageSize: 10 }}
            /*onFinish={onFinish} form={form}*/
          >
            <Row gutter={20}>
              <Col
                xs={24}
                md={12}
                lg={6}
              >
                <Form.Item
                  label=""
                  name="name"
                >
                  <Input placeholder="Enter search text..." />
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={12}
                lg={6}
              >
                <Form.Item
                  name="pageSize"
                  label="Page Size"
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
                lg={6}
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
                      /*onClick={onReset}*/
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
                  <th rowSpan={2}>SL</th>
                  <th rowSpan={2}>Description</th>
                  <th rowSpan={2}>PartNo</th>
                  <th rowSpan={2}>CL/LT</th>
                  <th rowSpan={2}>Qty</th>
                  <th rowSpan={2}>Unit</th>
                  <th rowSpan={2}>Unit Price</th>
                  <th colSpan={6}>Status</th>
                  <th rowSpan={4}>Actions</th>
                </tr>
                <tr>
                  <th>preparedBy</th>
                  <th>submittedBy</th>
                  <th>status</th>
                  <th>reviewedBy</th>
                  <th>acceptedBy</th>
                  <th>approvedBy</th>
                </tr>
              </thead>
              <tbody>
                {demandPending?.map((data, index) => (
                  <tr key={data.id}>
                    <td>{data.demandNo}</td>
                    <td>{data.priority}</td>
                    <td>{data.priority}</td>
                    <td>{data.priority}</td>
                    <td>{data.priority}</td>
                    <td>{data.priority}</td>
                    <td>{data.priority}</td>
                    <td>{data.priority}</td>
                    <td>
                      <Space size="small">
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
                        <Link to={`/store/item-demand/${data.id}`}>
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
                        <Popconfirm
                          title="Are you Sure?"
                          okText="Yes"
                          cancelText="No"
                          onConfirm={() => handleStatus(data.id, !isActive)}
                        >
                          {isActive ? (
                            <ARMButton
                              type="primary"
                              size="small"
                              style={{
                                backgroundColor: '#53a351',
                                borderColor: '#53a351',
                              }}
                            >
                              <UnlockOutlined />
                            </ARMButton>
                          ) : (
                            <ARMButton
                              type="primary"
                              size="small"
                              danger
                            >
                              <LockOutlined />
                            </ARMButton>
                          )}
                        </Popconfirm>
                      </Space>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ARMTable>
          </ResponsiveTable>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default PoList;
