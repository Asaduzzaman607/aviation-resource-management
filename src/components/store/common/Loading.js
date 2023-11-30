import React from 'react';
import {Spin} from "antd";

const Loading = () => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
        }}
        >
            <h2> <Spin /> &nbsp; Please wait...</h2>
        </div>
    );
};

export default Loading;