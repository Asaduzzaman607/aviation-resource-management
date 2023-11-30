import styled from 'styled-components';

const StoreDashBoardTab = styled.div`
  .button {
    padding: 10px 20px;
    gap: 10px;
    width: 144px;
    height: 44px;
    left: 1px;
    border: none;
    cursor: pointer;
    border-radius: 43px;
    background: #ffffff;
    transition: ease-in;
    transition-duration: 0.2s;
  }

  .button-background {
    width: 289px;
    margin-left: 20px;
    left: 237px;
    top: 110px;
    background: #ffffff;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    border-radius: 57px;
  }

  .button-active {
    color: #ffffff;
    background: #4a97ff;
  }

  .content-tabs {
    flex-grow: 1;
  }

  .content {
    background: transparent;
    padding: 20px;
    width: 100%;
    height: 100%;
    display: none;
  }

  .active-content {
    display: block;
  }
`;
export default StoreDashBoardTab;
