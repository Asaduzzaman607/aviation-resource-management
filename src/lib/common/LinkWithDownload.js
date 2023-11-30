import {
  ArrowLeftOutlined,
  PlusOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { Button, Col, Row, Space } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { Link, useNavigate } from 'react-router-dom';
import Permission from '../../components/auth/Permission';

export default function LinkWithDownload(
  title,
  link,
  addBtn = false,
  permission,
  excelDataColumn,
  excelData,
  filename
) {
  const navigate = useNavigate();

  return (
    <Row justify="space-between">
      <Col>{title}</Col>
      <Permission permission={permission}>
        <Col>
          <Space>
            <Button
              type={'primary'}
              style={{
                background: '#2980b9',
                borderColor: 'transparent',
                borderRadius: '5px',
              }}
              onClick={() => {
                const excel = new Excel();
                excel
                  .setTHeadStyle({
                    background: 'FFFFFF',
                  })
                  .addSheet(`${filename}`)
                  .addColumns(excelDataColumn)
                  .addDataSource(excelData)
                  .saveAs(`${filename}.xlsx`);
              }}
            >
              <VerticalAlignBottomOutlined /> Download
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: '#04aa6d',
                borderColor: 'transparent',
                borderRadius: '5px',
              }}
            >
              {addBtn === 'blank' ? (
                ''
              ) : addBtn ? (
                <Link
                  title="add"
                  to={link}
                >
                  <PlusOutlined /> Add
                </Link>
              ) : (
                <div
                  title="back"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeftOutlined /> Back
                </div>
              )}
            </Button>
          </Space>
        </Col>
      </Permission>
    </Row>
  );
}
