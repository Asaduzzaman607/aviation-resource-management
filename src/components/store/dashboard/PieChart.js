import { Pie } from '@ant-design/plots';

export const PieChart = ({ module, data, color, bgC }) => {

  const config = {
    appendPadding: 40,
    data,
    legend: {
      layout: 'horizontal',
      position: 'bottom',
      offsetY: -15
    },
    style: {
      background: bgC,
      height: '450px',
    },
    color: color,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.8,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      autoRotate: false,
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: 18,
          fontFamily: 'Inter',
          fontWeight: '500',
          fontStyle: 'normal',
          lineHeight: '19px'
        },
        content: module,
      },
    },
  };
  return <Pie {...config} />;
};
