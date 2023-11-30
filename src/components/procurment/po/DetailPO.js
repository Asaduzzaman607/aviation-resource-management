import { PrinterOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Checkbox,
  Col,
  Divider,
  Input,
  InputNumber,
  Row,
  Table,
  Typography,
} from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ApprovedRemarks from '../../common/ApprovedRemarks';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import usePoDetails from './usePoDetails';

const { Title } = Typography;
const { TextArea } = Input;

const DetailPO = () => {
  const {
    id,
    info,
    locationData,
    tableData1,
    tableData2,
    mov,
    totalExtraCost,
    grandTotal,
    subTotal,
    discount,
    isDisabled,
    currencyCode,
    countDiscount,
    finalCalculation,
    updateRecord,
    onFinish,
  } = usePoDetails();

  const responseDtoList = info?.approvalRemarksResponseDtoList;

  const table1 = [
    {
      title: 'Order No',
      dataIndex: 'orderNo',
    },
    {
      title: 'P.O.Date',
      dataIndex: 'poDate',
    },
    {
      title: 'Req No.',
      dataIndex: 'reqNo',
    },
    {
      title: 'Req Date',
      dataIndex: 'quoteRequestDate',
    },
    {
      title: 'Quotation No.',
      dataIndex: 'quotationNo',
    },
    {
      title: 'Quot. Date',
      dataIndex: 'quotationDate',
    },
  ];

  const table2 = [
    {
      title: 'Sl.',
      dataIndex: 'sl',
    },
    {
      title: 'Aircraft Name',
      dataIndex: 'aircraftName',
    },
    {
      title: 'With Discount',
      dataIndex: 'withDiscount',
      render: (_, record) => (
        <Checkbox
          checked={record.withDiscount}
          onChange={(e) =>
            updateRecord(
              record,
              'withDiscount',
              e.target.checked,
              finalCalculation
            )
          }
        />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'partDescription',
    },
    {
      title: 'Part No.',
      dataIndex: 'partNo',
    },
    {
      title: 'CD/LT.',
      dataIndex: 'cdlt',
    },
    {
      title: 'Qty',
      dataIndex: 'partQuantity',
      render: (_, record) => (
        <InputNumber
          min={1}
          minLength={1}
          style={{ color: record.moq > record.partQuantity ? 'red' : 'black' }}
          defaultValue={
            record.moq > record.partQuantity ? record.moq : record.partQuantity
          }
          onChange={(qty) => {
            updateRecord(record, 'partQuantity', qty, finalCalculation);
          }}
        />
      ),
    },
    {
      title: 'Vendor Serials',
      dataIndex: 'vendorSerials',
      render: (_, record) => (
        <TextArea
          defaultValue={record.vendorSerials}
          onBlur={(vendorSerial) => {
            updateRecord(
              record,
              'vendorSerials',
              vendorSerial.target.defaultValue,
              finalCalculation
            );
          }}
        />
      ),
    },
    {
      title: 'Vendor UOM',
      dataIndex: 'uomCode',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
    },
    {
      title: 'Discount %',
      dataIndex: 'discount',
    },
    {
      title: 'Discounted Unit Price',
      dataIndex: 'discountedUnitPrice',
    },
    {
      title: 'Extended Cost/Total Amount',
      dataIndex: 'totalAmount',
      render: (_, record) => (
        <>
          {record.mlv >= record.totalAmount ? (
            <div style={{ color: 'red' }}>{record.mlv}</div>
          ) : (
            <div>{record.totalAmount?.toFixed(2)}</div>
          )}
        </>
      ),
    },
  ];
  const location = useLocation();
  const locationNewData = location.state?.data;

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/material-management">
              {' '}
              <i className="fa fa-shopping-basket" />
              &nbsp; material-management
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/material-management/${locationData}-purchase-order`}>
              {locationData} Order List
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>PO Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(
          'Vendor Details',
          `/material-management/${
            locationData || locationNewData
          }-purchase-order`,
          false,
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_ORDER_MATERIAL_MANAGEMENT_PURCHASE_ORDER_SAVE'
        )}
      >
        <Row style={{ marginLeft: '4px' }}>
          <Col
            sm={24}
            md={2}
            className="mb-10"
          >
            Vendor Type :
          </Col>
          <Col
            sm={24}
            md={10}
            className="mb-10"
          >
            {info?.vendorQuotationViewModel?.vendorType || 'N/A'}
          </Col>
        </Row>
        <Row style={{ marginLeft: '4px' }}>
          <Col
            sm={24}
            md={2}
          >
            Vendor Name :
          </Col>
          <Col
            sm={24}
            md={10}
          >
            {info?.vendorQuotationViewModel?.vendorName || 'N/A'}
          </Col>
        </Row>
        <Row style={{ marginLeft: '4px' }}>
          <Col
            sm={24}
            md={10}
          >
            <ApprovedRemarks responseDtoList={responseDtoList} />
          </Col>
        </Row>
        <Row style={{ marginLeft: '4px' }}>
          {info?.isRejected && (
            <>
              <Col
                sm={24}
                md={2}
              >
                Rejected Reason :
              </Col>
              <Col
                sm={24}
                md={10}
              >
                {info?.rejectedDesc}
              </Col>
            </>
          )}
        </Row>
      </ARMCard>
      <br />
      <ARMCard title="PO Details">
        <ResponsiveTable>
          <Table
            columns={table1}
            dataSource={tableData1}
            pagination={false}
          />
        </ResponsiveTable>
        <div style={{ marginTop: '50px' }}></div>
        <ResponsiveTable>
          <Table
            columns={table2}
            dataSource={tableData2}
            pagination={false}
          />
        </ResponsiveTable>
        <Row style={{ marginTop: '15px' }}>
          <Col
            span={4}
            offset={20}
          >
            <Title
              level={5}
              style={{ marginBottom: '-10px' }}
            >
              Sub Total:
              <span style={{ color: subTotal >= mov ? 'black' : 'red' }}>
                {' ' + subTotal?.toFixed(2) + ' ' + currencyCode}
              </span>
            </Title>
            <Title
              level={5}
              style={{ marginBottom: '-10px' }}
            >
              {countDiscount(info, discount)}
            </Title>
            <Title
              level={5}
              style={{ marginBottom: '-10px' }}
            >
              Extra Cost: {totalExtraCost?.toFixed(2) + ' ' + currencyCode}
            </Title>
            <Divider dashed />
            <Title
              level={5}
              style={{ marginBottom: '-10px' }}
            >
              Grand Total: {grandTotal?.toFixed(2) + ' ' + currencyCode}
            </Title>
          </Col>
        </Row>
        <Row style={{ marginTop: '15px' }}>
          <Col style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ARMButton
              disabled={isDisabled}
              type="primary"
              onClick={onFinish}
              style={{ marginRight: '15px' }}
            >
              Submit
            </ARMButton>
            <Link
              to={`/material-management/purchase-order/print-detail/${id}`}
              state={{ data: locationData }}
            >
              <ARMButton type={'primary'}>
                {' '}
                {<PrinterOutlined />}Print Preview
              </ARMButton>
            </Link>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default DetailPO;
