import styled from 'styled-components';
import FirstPage from './FirstPage';
import NextPage from './NextPage';

const Container = styled.div`
  display: none;
`;

const BinCard = ({ binCards, componentRef }) => {
  return (
    <Container
      ref={componentRef}
      className="bin-card"
    >
      {binCards?.map((data, index) => {
        if (index === 0)
          return (
            <FirstPage
              key={index}
              data={data}
            />
          );
        else
          return (
            <NextPage
              key={index}
              data={data}
              cardIndex={index}
            />
          );
      })}
    </Container>
  );
};

export default BinCard;
