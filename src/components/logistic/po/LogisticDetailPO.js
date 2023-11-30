import { PrinterOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Col,
  Divider,
  notification,
  Row,
  Table,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyResponseError } from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import LogisticPOService from '../../../service/logistic/LogisticPOService';
import ManufacturerService from '../../../service/ManufacturerService';
import ShipmentService from '../../../service/procurment/ShipmentService';
import SupplierService from '../../../service/SupplierService';
import ApprovedRemarks from '../../common/ApprovedRemarks';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import MSPDetails from '../../configaration/manufacturer/MSPDetails';
import CommonLayout from '../../layout/CommonLayout';
import useViewDetails from '../../store/hooks/ViewDetails';

const { Title } = Typography;

const LogisticDetailPO = () => {
  const location = useLocation();
  const locationData = location?.state?.pendingOrApproved
    ? location.state.pendingOrApproved
    : '';
  const { id } = useParams();
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [totalExtraCost, setTotalExtraCost] = useState(0);
  const [rejectedReason, setRejectedReason] = useState('');
  const [responseDtoList, setResponseDtoList] = useState(null);
  const [isRejected, setIsRejected] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [vendorInfo, setVendorInfo] = useState({});
  const { isModalOpen, setIsModalOpen, data, handleViewDetails } =
    useViewDetails();
  

  const data2 = [];
  let sl = 0;
  let totalAmount = 0;
  let totalDiscount = 0;
  let extraCost = 0;

  const column1 = [
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

  const column2 = [
    {
      title: 'Sl.',
      dataIndex: 'serialNo',
    },
    {
      title: 'Aircraft Name',
      dataIndex: 'aircraftName',
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
      title: 'Total Amount',
      dataIndex: 'totalAmount',
    },
    {
      title: 'Extended Cost',
      dataIndex: 'extendedPrice',
    },
  ];

  const getVendorData = async () => {
    const { vendorType, vendorId } = vendorInfo;
    try {
      let response;
      if (vendorType === 'MANUFACTURER') {
        response = await ManufacturerService.getManufacturerById(vendorId);
      } else if (vendorType === 'SUPPLIER') {
        response = await SupplierService.getSupplierById(vendorId);
      } else {
        response = await ShipmentService.singleShipmentProvider(vendorId);
      }
      handleViewDetails(response.data);
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const getTableData1 = async () => {
    try {
      const { data } = await LogisticPOService.getPOById(id);
      setVendorInfo({
        vendorType: data.vendorQuotationViewModel.vendorType,
        vendorName: data.vendorQuotationViewModel.vendorName,
        vendorId: data.vendorQuotationViewModel.vendorId,
        companyName: data.companyName,
        pickUpAddress: data.pickUpAddress
      });
      setRejectedReason(data?.rejectedDesc);
      setIsRejected(data?.isRejected);
      setResponseDtoList(data?.approvalRemarksResponseDtoList);
      setTableData1([
        {
          key: data.id,
          poDate: data.vendorQuotationViewModel.date,
          reqNo: data.vendorQuotationViewModel.quoteRequestNo?.startsWith(
            'INVISIBLE'
          )
            ? ''
            : data.vendorQuotationViewModel.quoteRequestNo,
          quotationNo: data.vendorQuotationViewModel.quotationNo,
          quotationDate: data.vendorQuotationViewModel.date,
          quoteRequestDate:
            data.vendorQuotationViewModel.quoteRequestNo?.startsWith(
              'INVISIBLE'
            )
              ? ''
              : data.vendorQuotationViewModel.quoteRequestDate,
        },
      ]);
      data.vendorQuotationViewModel.vendorQuotationDetails.forEach((item) => {
        totalAmount += item.partQuantity * item.unitPrice;
        totalDiscount +=
          (item.partQuantity * item.unitPrice * item.discount) / 100;
        data2.push({
          key: item.id,
          serialNo: ++sl,
          aircraftName: data.poItemResponseDtoList[0].aircraftName,
          partNo: item.partNo,
          partDescription: item.partDescription,
          partQuantity: item.partQuantity,
          uomCode: item.unitMeasurementCode,
          unitPrice: item.unitPrice,
          discount: item.discount,
          cdlt: item.condition + '/' + item.leadTime,
          totalAmount: item.partQuantity * item.unitPrice,
          extendedPrice: item.extendedPrice,
          discountAmount:
            (item.partQuantity * item.unitPrice * item.discount) / 100,
        });
      });
      data.vendorQuotationViewModel.vendorQuotationFees.forEach(
        (item) => (extraCost += item.feeCost)
      );
      setTotalExtraCost(extraCost);

      setTableData2(data2);
      setDiscount(totalDiscount.toFixed(2));
      setSubTotal(totalAmount);
      setGrandTotal(totalAmount + extraCost - totalDiscount);
    } catch (e) {
      console.log({ e });
      notification['error']({ message: getErrorMessage(e) });
    }
  };

  useEffect(() => {
    getTableData1();
  }, []);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/logistic">
              {' '}
              <i className="fas fa-hand-holding-box" />
              &nbsp; Logistic
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/logistic/${locationData}-purchase-order`}>
              {locationData} Order List
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Logistic PO Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard title={getLinkAndTitle('Details', '', false, '')}>
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
            {vendorInfo?.vendorType || 'N/A'}
          </Col>
        </Row>
        <Row style={{ marginLeft: '4px' }}>
          <Col
            sm={24}
            md={2}
            className='mb-10'
          >
            Vendor Name :
          </Col>
          <Col
            sm={24}
            md={10}
          >
            <h4
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => getVendorData()}
            >
              <u>{vendorInfo?.vendorName || 'N/A'}</u>
            </h4>
          </Col>
        </Row>
        <Row style={{ marginLeft: '4px' }}>
          <Col
            sm={24}
            md={2}
            className='mb-10'
          >
            Company Name :
          </Col>
          <Col
            sm={24}
            md={10}
          >
            {vendorInfo?.companyName || 'N/A'}
          </Col>
        </Row>
        <Row style={{ marginLeft: '4px' }}>
          <Col
            sm={24}
            md={2}
          >
            Pick-up Address :
          </Col>
          <Col
            sm={24}
            md={10}
          >
            {vendorInfo?.pickUpAddress || 'N/A'}
          </Col>
        </Row>
        <Row style={{ marginLeft: '4px' }}>
          {isRejected && (
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
                {rejectedReason}
              </Col>
            </>
          )}
        </Row>
        <Row style={{ marginLeft: '4px' }}>
          <Col
            sm={24}
            md={10}
          >
            <ApprovedRemarks responseDtoList={responseDtoList} />
          </Col>
        </Row>
        
        {data && (
          <MSPDetails
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            data={data}
            details="Vendor Details"
          />
        )}
      </ARMCard>
      <br />

      <ARMCard title="Work Order Details">
        <Table
          columns={column1}
          dataSource={tableData1}
          pagination={false}
        />
        <div style={{ marginTop: '50px' }}></div>
        <Table
          columns={column2}
          dataSource={tableData2}
          pagination={false}
        />
        <Row style={{ marginTop: '15px' }}>
          <Col
            span={4}
            offset={20}
          >
            <Title
              level={5}
              style={{ marginBottom: '-10px' }}
            >
              Sub Total: ${subTotal?.toFixed(2)}
            </Title>
            <Title
              level={5}
              style={{ marginBottom: '-10px' }}
            >
              Discount: ${Number(discount)?.toFixed(2)}
            </Title>
            <Title
              level={5}
              style={{ marginBottom: '-10px' }}
            >
              Extra Cost: ${totalExtraCost?.toFixed(2)}
            </Title>
            <Divider dashed />
            <Title
              level={5}
              style={{ marginBottom: '-10px' }}
            >
              Grand Total: ${grandTotal?.toFixed(2)}
            </Title>
          </Col>
        </Row>

        <Row style={{ marginTop: '15px' }}>
          <Col>
            <Link
              to={`/logistic/purchase-order/print-detail/${id}`}
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

export default LogisticDetailPO;
