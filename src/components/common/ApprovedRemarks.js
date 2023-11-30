import { Button, Modal, Tooltip } from 'antd';

import { useState } from 'react';
import ARMTable from './ARMTable';

const ApprovedRemarks = ({
  responseDtoList,
  responseDtoListAudit,
  responseDtoListFinal,
  responseDtoListFinance,
  responseDtoListQuality,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="See all Approval Remarks">
        <Button
          type="default"
          onClick={() => setOpen(true)}
          style={{
            backgroundColor: '#04aa6d',
            border: 'none',
            color: 'white',
            marginTop: '1rem',
          }}
        >
          Approval Remarks
        </Button>
      </Tooltip>
      <Modal
        bodyStyle={{ overflowY: 'scroll', height: 350 }}
        title="Remarks"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={800}
        footer={false}
      >
        <ARMTable>
          <thead>
            <caption
              style={{
                display: 'inline',
                fontWeight: 'bold',
              }}
            >
              Own Department
            </caption>
            <tr>
              <th>Workflow</th>
              <th>Approval Remark</th>
              <th>Approved By</th>
              <th>Approval Date</th>
            </tr>
          </thead>

          <tbody>
            {responseDtoList?.map((data) => (
              <tr key={data.workFlowActionName}>
                <td>{data.workFlowActionName}</td>
                <td>{data.approvalRemark}</td>
                <td>{data.approvedBy}</td>
                <td>{data.approvalDate}</td>
              </tr>
            ))}
          </tbody>
        </ARMTable>
        {responseDtoListAudit && (
          <ARMTable
            style={{
              marginTop: '2rem',
            }}
          >
            <thead>
              <caption
                style={{
                  display: 'inline',
                  fontWeight: 'bold',
                }}
              >
                Audit
              </caption>
              <tr>
                <th>Workflow</th>
                <th>Approval Remark</th>
                <th>Approved By</th>
                <th>Approval Date</th>
              </tr>
            </thead>

            <tbody>
              {responseDtoListAudit?.map((data) => (
                <tr key={data.workFlowActionName}>
                  <td>{data.workFlowActionName}</td>
                  <td>{data.approvalRemark}</td>
                  <td>{data.approvedBy}</td>
                  <td>{data.approvalDate}</td>
                </tr>
              ))}
            </tbody>
          </ARMTable>
        )}
        {responseDtoListFinal && (
          <ARMTable
            style={{
              marginTop: '2rem',
            }}
          >
            <thead>
              <caption
                style={{
                  display: 'inline',
                  fontWeight: 'bold',
                }}
              >
                Final
              </caption>
              <tr>
                <th>Workflow</th>
                <th>Approval Remark</th>
                <th>Approved By</th>
                <th>Approval Date</th>
              </tr>
            </thead>

            <tbody>
              {responseDtoListFinal?.map((data) => (
                <tr key={data.workFlowActionName}>
                  <td>{data.workFlowActionName}</td>
                  <td>{data.approvalRemark}</td>
                  <td>{data.approvedBy}</td>
                  <td>{data.approvalDate}</td>
                </tr>
              ))}
            </tbody>
          </ARMTable>
        )}
        {responseDtoListFinance && (
          <ARMTable
            style={{
              marginTop: '2rem',
            }}
          >
            <thead>
              <caption
                style={{
                  display: 'inline',
                  fontWeight: 'bold',
                }}
              >
                Finance
              </caption>
              <tr>
                <th>Workflow</th>
                <th>Approval Remark</th>
                <th>Approved By</th>
                <th>Approval Date</th>
              </tr>
            </thead>

            <tbody>
              {responseDtoListFinance?.map((data) => (
                <tr key={data.workFlowActionName}>
                  <td>{data.workFlowActionName}</td>
                  <td>{data.approvalRemark}</td>
                  <td>{data.approvedBy}</td>
                  <td>{data.approvalDate}</td>
                </tr>
              ))}
            </tbody>
          </ARMTable>
        )}
        {responseDtoListQuality && (
          <ARMTable
            style={{
              marginTop: '2rem',
            }}
          >
            <thead>
              <caption
                style={{
                  display: 'inline',
                  fontWeight: 'bold',
                }}
              >
                Quality
              </caption>
              <tr>
                <th>Workflow</th>
                <th>Approval Remark</th>
                <th>Approved By</th>
                <th>Approval Date</th>
              </tr>
            </thead>

            <tbody>
              {responseDtoListQuality?.map((data) => (
                <tr key={data.workFlowActionName}>
                  <td>{data.workFlowActionName}</td>
                  <td>{data.approvalRemark}</td>
                  <td>{data.approvedBy}</td>
                  <td>{data.approvalDate}</td>
                </tr>
              ))}
            </tbody>
          </ARMTable>
        )}
      </Modal>
    </>
  );
};

export default ApprovedRemarks;
