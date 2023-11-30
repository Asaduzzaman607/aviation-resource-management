import styled from "styled-components";

const ARMCustomTab = styled.div`
  .container {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 500px;
    background: #f1f1f1;
    margin: 100px auto 0;
    word-break: break-all;
    border: 1px solid rgba(0, 0, 0, 0.274);
  }
  .bloc-tabs {
    display: flex;
    margin-left: 20px;
  }
  .tabs {
    padding: 8px;
    text-align: center;
    width: 16%;
    background: rgba(128, 128, 128, 0.075);
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.274);
    box-sizing: content-box;
    position: relative;
    outline: none;
  }
  .tabs:not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.274);
  }
  .active-tabs {
    background: white;
    border-bottom: 1px solid transparent;
    color: #1890ff !important;
    border-top: 2px solid #1890ff !important;
    border-right: 1px solid #1890ff !important;
    border-left: 1px solid #1890ff !important;
    border-bottom: 1px solid #d3d3d3 !important;
  }
  .active-tabs::before {
    content: "";
    display: block;
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% + 2px);
    height: 3px;
    background: rgb(88, 147, 241);
  }
  button {
    border: none;
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
  .content h2 {
    padding: 0px 0 5px 0px;
  }
  .content hr {
    width: 100px;
    height: 2px;
    background: #222;
    margin-bottom: 5px;
  }
  .content p {
    width: 100%;
    height: 100%;
  }
  .active-content {
    display: block;
  }
`
export default ARMCustomTab