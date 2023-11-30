import styled from 'styled-components';
import StockRecordFirstPage from './StockRecordFirstPage';
import StockRecordNextPage from './StockRecordNextPage';

const Container = styled.div`
  display: none;
`;

const StockRecord = ({ stockRecords, componentRef }) => {
  return (
    <Container
      ref={componentRef}
      className="stock-record"
    >
      {stockRecords?.map((data, index) => {
        if (index === 0)
          return (
            <StockRecordFirstPage
              key={index}
              data={data}
            />
          );
        else
          return (
            <StockRecordNextPage
              key={index}
              data={data}
              stockIndex={index}
            />
          );
      })}
    </Container>
  );
};

export default StockRecord;
