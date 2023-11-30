import { PrinterOutlined } from '@ant-design/icons';
import { Modal, Space } from 'antd';
import { useState } from 'react';
import ReactToPrint from 'react-to-print';
import ARMButton from '../../common/buttons/ARMButton';
import BinPartWiseSerial from './BinPartWiseSerial';
import PartWiseAvailabilityDetails from './PartWiseAvailabilityDetails';
import PartWiseDemandDetails from './PartWiseDemandDetails';
import PartWiseIssueDetails from './PartWiseIssueDetails';
import PartWiseRequisitionDetails from './PartWiseRequisitionDetails';
import PartWiseScrapDetails from './PartWiseScrapDetails';
import StockRecord from './StockRecord';
import useStockRecord from './useStockRecord';

const PartDetails = ({ partId, isModalOpen, setIsModalOpen }) => {
  const { stockRecords, stockRecordRef, printStyle, fetchStockRecordData } =
    useStockRecord();
  const [isBinModalOpen, setIsBinModalOpen] = useState(false);

  return (
    <>
      <Modal
        title="PART DETAILS"
        onOk={() => setIsModalOpen(false)}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        centered
        open={isModalOpen}
        width={1200}
        footer={null}
        maskClosable={false}
        destroyOnClose
        bodyStyle={{ height: '90vh', overflowY: 'auto' }}
      >
        {/* parts availabilities */}
        <PartWiseAvailabilityDetails partId={partId} />

        {/* store demand */}
        <PartWiseDemandDetails partId={partId} />

        {/* store issue */}
        <PartWiseIssueDetails partId={partId} />

        {/* store requisition */}
        <PartWiseRequisitionDetails partId={partId} />

        {/* store scrap */}
        <PartWiseScrapDetails partId={partId} />

        <Space wrap>
          <ARMButton
            type="primary"
            onClick={() => {
              setIsBinModalOpen(true);
            }}
          >
            Show Bin Card
          </ARMButton>

          <ReactToPrint
            trigger={() => (
              <ARMButton
                type="primary"
                style={{
                  backgroundColor: '#4aa0b5',
                  borderColor: '#4aa0b5',
                }}
              >
                <PrinterOutlined /> Stock Record Print
              </ARMButton>
            )}
            content={() => stockRecordRef.current}
            pageStyle={printStyle}
            onBeforeGetContent={() => fetchStockRecordData({ partId })}
          />
        </Space>

        {/* stock record print */}
        <StockRecord
          stockRecords={stockRecords}
          componentRef={stockRecordRef}
        />
      </Modal>

      {/* part wise serial modal */}
      {isBinModalOpen && (
        <BinPartWiseSerial
          setIsBinModalOpen={setIsBinModalOpen}
          isBinModalOpen={isBinModalOpen}
          partId={partId}
        />
      )}
    </>
  );
};
export default PartDetails;
