import {
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { Col, Empty, Form, Input, Pagination, Row, Select, Space } from 'antd';
import { Link } from 'react-router-dom';
import { usePaginate } from '../../../lib/hooks/paginations';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';
import RibbonCard from '../../common/forms/RibbonCard';

const { Option } = Select;

const PartWiseDemandDetails = ({ partId }) => {
  const { form, collection, page, totalElements, paginate, fetchData, size } =
    usePaginate('PartDetailDemand', '/part/dashboard/demand', {
      partId: partId,
    });

  return (
    <>
      {/* store demand */}
      <RibbonCard ribbonText="DEMAND">
        <Form
          form={form}
          onFinish={(values) => fetchData({ partId: partId, ...values })}
        >
          <Row gutter={20}>
            <Col
              xs={24}
              md={12}
              lg={8}
            >
              <Form.Item
                label="Voucher No"
                name="voucherNo"
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
                label="Page No"
                initialValue="10"
              >
                <Select>
                  <Option value={10}>10</Option>
                  <Option value={20}>20</Option>
                  <Option value={30}>30</Option>
                  <Option value={40}>40</Option>
                  <Option value={50}>50</Option>
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
                    onClick={() => {
                      form.resetFields();
                      fetchData({ partId: partId });
                    }}
                  >
                    <RollbackOutlined /> Reset
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <ResponsiveTable>
          <div
            style={
              collection?.length > 5
                ? { height: '220px', overflowY: 'auto' }
                : null
            }
          >
            <ARMTable>
              <thead>
                <tr>
                  <th>Voucher No</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collection.length > 0 &&
                  collection?.map((data, index) => (
                    <tr key={index}>
                      <td>{data.voucherNo}</td>
                      <td>
                        <Link
                          to={
                            data.name === 'APPROVED'
                              ? `/store/approve-demand/details/${data.demandId}`
                              : `/store/pending-demand/details/${data.demandId}`
                          }
                          target="_blank"
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
            {collection.length === 0 && (
              <Row>
                <Col style={{ margin: '10px auto' }}>
                  <Empty />
                </Col>
              </Row>
            )}
          </div>
        </ResponsiveTable>
      </RibbonCard>
      {/*** for pagination ***/}
      {collection.length > 0 && (
        <Row justify="center">
          <Col style={{ marginTop: 5, marginBottom: 15 }}>
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
    </>
  );
};
export default PartWiseDemandDetails;
