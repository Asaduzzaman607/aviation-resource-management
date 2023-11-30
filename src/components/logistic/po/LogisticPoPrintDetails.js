import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Col,
  Divider,
  notification,
  Row,
  Table,
  Typography,
} from 'antd';
import { createRef, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { getErrorMessage } from '../../../lib/common/helpers';
import LogisticPOService from '../../../service/logistic/LogisticPOService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import logo from '../../images/us-bangla-logo.png';
import CommonLayout from '../../layout/CommonLayout';

const { Title } = Typography;

const LogisticPoPrintDetails = () => {
  const { id } = useParams();
  const [info, setInfo] = useState({});
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [totalExtraCost, setTotalExtraCost] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const componentRef = createRef();
  const navigate = useNavigate();
  const location = useLocation();
  const locationData = location.state?.data;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

  const getTableData1 = async () => {
    try {
      const { data } = await LogisticPOService.getPOById(id);
      setInfo(data);
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
      data.vendorQuotationViewModel.vendorQuotationDetails.map((item) => {
        totalAmount += item.partQuantity * item.unitPrice;
        totalDiscount +=
          (item.partQuantity * item.unitPrice * item.discount) / 100;
        return data2.push({
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
      data.vendorQuotationViewModel.vendorQuotationFees.map(
        (item) => (extraCost += item.feeCost)
      );
      setTotalExtraCost(extraCost);
      setTableData2(data2);
      setDiscount(totalDiscount.toFixed(2));
      setSubTotal(totalAmount);
      setGrandTotal(totalAmount + extraCost - totalDiscount);
    } catch (e) {
      notification['error']({ message: getErrorMessage(e) });
    }
  };

  useEffect(() => {
    getTableData1();
  }, []);

  const invoiceTo = info.invoiceTo?.replace(/(?:\r\n|\r|\n)/g, '<br>');
  const shipTo = info.shipTo?.replace(/(?:\r\n|\r|\n)/g, '<br>');
  const tac = info.tac?.replace(/(?:\r\n|\r|\n)/g, '<br>');
  const vendorResponse = info.vendorResponse?.replace(
    /(?:\r\n|\r|\n)/g,
    '<br>'
  );

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
          <Breadcrumb.Item>Logistic PO Print Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={
          <Row justify="space-between">
            <Col>Logistic PO Print Details</Col>
            <Col>
              <ARMButton
                style={{
                  backgroundColor: '#04aa6d',
                  borderColor: 'transparent',
                  borderRadius: '5px',
                  marginRight: '10px',
                }}
                type="primary"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
              >
                Back
              </ARMButton>
              <ARMButton
                type="primary"
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                Print
              </ARMButton>
            </Col>
          </Row>
        }
      >
        <div
          id="container"
          ref={componentRef}
          style={{ marginLeft: '15px', marginRight: '15px' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '15px',
              marginBottom: '30px',
            }}
          >
            <table style={{ border: '1px solid black' }}>
              <thead>
                <tr style={{ border: '1px solid black' }}>
                  <th
                    style={{ border: '1px solid black', padding: '5px 15px' }}
                  >
                    Part Order No.
                  </th>
                  <th
                    style={{ border: '1px solid black', padding: '5px 15px' }}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{ border: '1px solid black', padding: '5px 15px' }}
                  >
                    {info.orderNo}
                  </td>
                  <td
                    style={{ border: '1px solid black', padding: '5px 15px' }}
                  >
                    {info.vendorQuotationViewModel?.date}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{ border: '1px solid black', padding: '5px 15px' }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: vendorResponse }} />
                  </td>
                </tr>
              </tbody>
            </table>

            <table style={{ textAlign: 'center' }}>
              <tbody>
                <tr>
                  <td>
                    <img
                      src={logo}
                      alt="logo"
                      style={{ padding: '0 50px', width: '300px' }}
                    />
                    <div style={{ fontSize: '24px', marginTop: '10px' }}>
                      {info.orderType} ORDER
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <table style={{ border: '1px solid black' }}>
              <thead>
                <tr style={{ border: '1px solid black' }}>
                  <th
                    style={{ border: '1px solid black', padding: '5px 15px' }}
                  >
                    Ship To
                  </th>
                  <th
                    style={{ border: '1px solid black', padding: '5px 15px' }}
                  >
                    Invoice To
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{ border: '1px solid black', padding: '5px 15px' }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: shipTo }} />
                  </td>
                  <td
                    style={{ border: '1px solid black', padding: '5px 15px' }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: invoiceTo }} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

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
                Sub Total: ${subTotal}
              </Title>
              <Title
                level={5}
                style={{ marginBottom: '-10px' }}
              >
                Discount: ${discount}
              </Title>
              <Title
                level={5}
                style={{ marginBottom: '-10px' }}
              >
                Extra Cost: ${totalExtraCost}
              </Title>
              <Divider dashed />
              <Title
                level={5}
                style={{ marginBottom: '-10px' }}
              >
                Grand Total: ${grandTotal.toFixed(2)}
              </Title>
            </Col>
          </Row>

          <div
            className="tac-info"
            style={{
              marginTop: '30px',
            }}
          >
            <h3
              style={{
                fontStyle: 'italic',
              }}
            >
              <u>Terms & Conditions</u>
            </h3>
            <div dangerouslySetInnerHTML={{ __html: tac }} />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '30px',
            }}
          >
            <div>
              <h4
                style={{
                  fontWeight: 'bold',
                }}
              >
                Prepared By
              </h4>
              <p>....................................</p>
              <h4
                style={{
                  fontWeight: 'bold',
                }}
              >
                {info.employeeName}
              </h4>
              <p>{info.designationName}</p>
              <p>Engineering Procurement</p>
            </div>
            <div>
              <h4
                style={{
                  fontWeight: 'bold',
                }}
              >
                Approved By
              </h4>
              <p>....................................</p>
              <h4
                style={{
                  fontWeight: 'bold',
                }}
              >
                Tawfiqul Hoque
              </h4>
              <p>Head of Engineering Procurement</p>
            </div>
          </div>
        </div>
      </ARMCard>
    </CommonLayout>
  );
};

export default LogisticPoPrintDetails;
