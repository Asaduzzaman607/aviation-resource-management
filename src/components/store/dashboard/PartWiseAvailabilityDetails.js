import { Col, Empty, Row } from 'antd';
import { usePaginate } from '../../../lib/hooks/paginations';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';
import RibbonCard from '../../common/forms/RibbonCard';

const PartWiseAvailabilityDetails = ({ partId }) => {
  const { collection } = usePaginate(
    'PartDetailAvailability',
    '/part/dashboard/availability',
    {
      partId: partId,
    }
  );

  return (
    <RibbonCard ribbonText="PARTS AVAILABILITY">
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
            </tr>
          </thead>
          <tbody>
            {collection?.map((data, index) => (
              <tr key={index}>
                <td>{data.store}</td>
                <td>{data.partNo}</td>
                <td>{data.quantity}</td>
                <td>{data.demandQuantity}</td>
                <td>{data.issuedQuantity}</td>
                <td>{data.requisitionQuantity}</td>
                <td>{data.minStock}</td>
                <td>{data.maxStock}</td>
                <td>{data.uom}</td>
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
      </ResponsiveTable>
    </RibbonCard>
  );
};

export default PartWiseAvailabilityDetails;
