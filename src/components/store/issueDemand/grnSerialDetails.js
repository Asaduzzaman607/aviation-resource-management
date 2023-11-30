import { Modal } from 'antd';
import ARMTable from '../../common/ARMTable';
import RibbonCard from '../../common/forms/RibbonCard';
import ResponsiveTable from '../../common/ResposnsiveTable';

const GrnSerialDetails = ({ isModalOpen, setIsModalOpen, data }) => {
  return (
    <Modal
      //title="Serial Details"
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
      centered
      visible={isModalOpen}
      width={1300}
      footer={null}
    >
      <RibbonCard ribbonText="Serial Details">
        <ResponsiveTable>
          <ARMTable>
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Grn No</th>
                <th>Quantity</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, index) => (
                <tr key={index}>
                  <td>{d.serialNo}</td>
                  <td>{d.grnNo}</td>
                  <td>{d.quantity || 1}</td>
                  <td>{d.price}</td>
                </tr>
              ))}
            </tbody>
          </ARMTable>
        </ResponsiveTable>
      </RibbonCard>
    </Modal>
  );
};

export default GrnSerialDetails;
