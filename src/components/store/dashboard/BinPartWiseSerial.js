import {
  FilterOutlined,
  PrinterOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { Col, Form, Input, Modal, Pagination, Row, Select, Space } from 'antd';
import ReactToPrint from 'react-to-print';
import { usePaginate } from '../../../lib/hooks/paginations';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';
import RibbonCard from '../../common/forms/RibbonCard';
import BinCard from './BinCard';
import useBinCard from './useBinCard';

const { Option } = Select;

const BinPartWiseSerial = ({ setIsBinModalOpen, isBinModalOpen, partId }) => {
  const { form, collection, page, totalElements, paginate, fetchData, deleteReduxKey, size } =
    usePaginate('partSerials', '/store_part_serial/search', {
      partId: partId,
    });

  const { binCards, componentRef, fetchBinData, printStyle } =
    useBinCard();

    console.log('collection: ',collection);

  return (
    <Modal
      title="PART WISE SERIAL LIST"
      onOk={() => {
        setIsBinModalOpen(false);
        deleteReduxKey();
      }}
      onCancel={() => {
        setIsBinModalOpen(false);
        deleteReduxKey();
      }}
      centered
      open={isBinModalOpen}
      width={1200}
      maskClosable={false}
      destroyOnClose
    >
      <>
        {/* store serial */}
        <RibbonCard ribbonText="SERIAL">
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
                  label="Serial No"
                  name="serialNumber"
                >
                  <Input placeholder="Enter Serial No." />
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
                        fetchData({ partId: partId, serialNumber: '' });
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
            <ARMTable>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collection.length > 0 &&
                  collection?.map((data, index) => (
                    <tr key={index}>
                      <td>{data.serialNo}</td>
                      <td>
                        <ReactToPrint
                          trigger={() => (
                            <ARMButton
                              type="primary"
                              size="small"
                              style={{
                                backgroundColor: '#4aa0b5',
                                borderColor: '#4aa0b5',
                              }}
                            >
                              <PrinterOutlined />
                            </ARMButton>
                          )}
                          content={() => componentRef.current}
                          pageStyle={printStyle}
                          onBeforeGetContent={() =>
                            fetchBinData({ partId, partSerialId: data.id })
                          }
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </ARMTable>
          </ResponsiveTable>
          {/* bin card print  */}
          <BinCard
            binCards={binCards}
            componentRef={componentRef}
          />
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
    </Modal>
  );
};

export default BinPartWiseSerial;
