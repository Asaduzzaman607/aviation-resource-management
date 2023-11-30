import { Col, Empty, Form, Input, Pagination, Row } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { useEffect } from 'react';
import ARMForm from '../../../lib/common/ARMForm';
import { usePaginate } from '../../../lib/hooks/paginations';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';

function ApprovedDemandStatusDetails({
  isModalOpen,
  setIsModalOpen,
  data,
  details,
}) {
  const { form, collection, page, totalElements, paginate, size, fetchData } =
    usePaginate('approvedDemandStatus', '/store-demand/status/part', data);

  const demandNo = collection[0]?.voucherNo;

  form.setFieldValue('demandId', data?.demandId);
  form.setFieldValue('partId', data?.partId);

  let partId;
  const modifiedCollection = [];

  const sortedData = collection
    ?.map((data) => data)
    .sort((a, b) => b.partId - a.partId);

  sortedData?.map((data) => {
    if (partId === data.partId) {
      modifiedCollection.push({
        ...data,
        partId: null,
        partNo: null,
      });
    } else {
      modifiedCollection.push(data);
    }
    partId = data.partId;
  });

  useEffect(() => {
    fetchData(data);
  }, [data]);
  function getStatus(module, workflowType, voucherType, status, inputType) {
    let demandStatus = `${module} - ${voucherType}`;
    if (inputType !== null) demandStatus += ` - ${inputType}`;
    if (workflowType !== null) demandStatus += ` - ${workflowType}`;
    demandStatus += ` - ${status}`;
    return demandStatus;
  }

  return (
    <Modal
      title={details}
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
      centered
      visible={isModalOpen}
      width={1300}
      footer={null}
    >
      <ARMForm form={form}>
        <Row>
          <Form.Item name="demandId">
            <Input hidden />
          </Form.Item>
          <Form.Item name="partId">
            <Input hidden />
          </Form.Item>
          <Col
            span={24}
            md={5}
          >
            <Row>
              <Col
                span={12}
                className="mb-10"
              >
                Voucher No:
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {demandNo ? demandNo : 'N/A'}
              </Col>
            </Row>
          </Col>
          <ResponsiveTable style={{ marginTop: '20px' }}>
            <ARMTable>
              <thead>
                <tr>
                  <th>Part No</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Accepted</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody style={{ border: '1px solid #d3d3d3' }}>
                {modifiedCollection?.map((item, index) => (
                  <tr key={index}>
                    {item.partId ? (
                      <>
                        <td
                          style={{
                            borderBottom: 'none',
                          }}
                        >
                          {item.partNo}
                        </td>
                        <td>{item.quantity}</td>
                        <td>
                          {getStatus(item.module, item.workflowType, item.voucherType, item.status, item.inputType)}
                        </td>
                        <td>
                          {item.rejected ? (
                            <i
                              style={{ color: 'red', fontSize: '20px' }}
                              className="fa fa-times"
                              aria-hidden="true"
                            />
                          ) : (
                            <i
                              style={{ color: '#22c55e', fontSize: '20px' }}
                              className="fa fa-check"
                              aria-hidden="true"
                            />
                          )}
                        </td>
                        <td>
                          {item.active ? (
                            <i
                              style={{ color: '#22c55e', fontSize: '20px' }}
                              className="fa fa-check"
                              aria-hidden="true"
                            />
                          ) : (
                            <i
                              style={{ color: 'red', fontSize: '20px' }}
                              className="fa fa-times"
                              aria-hidden="true"
                            />
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td
                          style={{
                            borderTop: 'none',
                            borderBottom: 'none',
                          }}
                        >
                          {item.partNo}
                        </td>
                        <td>{item.quantity}</td>
                        <td>
                          {getStatus(item.module, item.workflowType, item.voucherType, item.status, item.inputType)}
                        </td>
                        <td>
                          {item.rejected ? (
                            <i
                              style={{ color: 'red', fontSize: '20px' }}
                              className="fa fa-times"
                              aria-hidden="true"
                            />
                          ) : (
                            <i
                              style={{ color: '#22c55e', fontSize: '20px' }}
                              className="fa fa-check"
                              aria-hidden="true"
                            />
                          )}
                        </td>
                        <td>
                          {item.active ? (
                            <i
                              style={{ color: '#22c55e', fontSize: '20px' }}
                              className="fa fa-check"
                              aria-hidden="true"
                            />
                          ) : (
                            <i
                              style={{ color: 'red', fontSize: '20px' }}
                              className="fa fa-times"
                              aria-hidden="true"
                            />
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </ARMTable>
          </ResponsiveTable>
        </Row>
        <Row>
          <Col style={{ margin: '0 auto' }}>
            {collection?.length === 0 ? (
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
      </ARMForm>
    </Modal>
  );
}

export default ApprovedDemandStatusDetails;
