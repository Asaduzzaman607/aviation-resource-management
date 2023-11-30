import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';

export const Barchart = ({data,color,shadowColor}) => {

  const config = {
    data,
    xField: 'month',
    yField: 'count',
    maxColumnWidth: 41,
    minColumnWidth: 41,
    color:(color),
    style: {
      background:"#ffffff",
      padding:'10px',
      borderRadius:'0 0 10px 10px',
      // boxShadow: "5px 5px #e0e0e0",
    },
    columnStyle:{
      radius:[10,10,10,10],
      shadowColor: (shadowColor),
      shadowOffsetX: 10,

    },
    label: {
      position: 'middle',
      // 'top', 'bottom', 'middle',
      style: {
        fill: '#ffffff',
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };
  return <Column {...config} />;
};