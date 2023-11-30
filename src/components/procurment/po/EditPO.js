import {
    Breadcrumb,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    notification,
    Row,
    Space,
    Table,
    Typography
} from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import { getErrorMessage } from '../../../lib/common/helpers';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import API from '../../../service/Api';
import POService from '../../../service/procurment/POService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';

const { TextArea } = Input;
const { Title } = Typography;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const EditPO = () => {
  const data2 = [];
  let totalAmount = 0;
  const { id } = useParams();
  const [form] = Form.useForm();
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [showDiscount, setShowDiscount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const discountedAmount = (showDiscount / 100) * subTotal;
  const grandTotal = subTotal - discountedAmount;

  console.log('poId: ', id);

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
      title: 'AC',
      dataIndex: 'ac',
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
      dataIndex: 'quantity',
    },
    {
      title: 'UOM',
      dataIndex: 'uomCode',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
    },
  ];

  const getTableData1 = async () => {
    try {
      const { data } = await POService.getPOById(id);
      form.setFieldsValue({
        tac: data.tac,
        remark: data.remark,
        discount: data.discount,
      });
      setShowDiscount(data.discount);
      setTableData1([
        {
          key: 1,
          poDate: data.vendorQuotationViewModel.date,
          reqNo: data.vendorQuotationViewModel.quoteRequestNo,
          ac: 'hello',
          quotationNo: data.vendorQuotationViewModel.quotationNo,
          quotationDate: data.vendorQuotationViewModel.date,
        },
      ]);
      data.poItemResponseDtoList.map((item) => {
        totalAmount += item.quantity * item.unitPrice;
        return data2.push({
          key: item.id,
          partNo: item.partNo,
          partDescription: item.partDescription,
          quantity: item.quantity,
          uomCode: item.uomCode,
          unitPrice: item.unitPrice,
          cdlt: item.cd + '/' + item.lt,
          totalAmount: item.quantity * item.unitPrice,
        });
      });
      setTableData2(data2);
      setSubTotal(totalAmount);
    } catch (e) {
      notification['error']({ message: getErrorMessage(e) });
    }
  };

  useEffect(() => {
    getTableData1();
  }, []);

  const onFinish = async (values) => {
    const modifiedValue = {
      discount: values.discount,
      remark: values.remark,
      tac: values.tac,
    };

    try {
      await API.put(`/procurement/part-orders/${id}`, modifiedValue);
      notification['success']({
        message: 'Update successfully',
      });
      form.resetFields();
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-shopping-basket" />
            <Link to="/material-management">&nbsp; Material Management</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/material-management/purchase-order">
              &nbsp; Purchase Order Edit
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(
          'purchase orders',
          '/material-management/purchase-order'
        )}
      >
        <ARMForm
          {...layout}
          form={form}
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          style={{
            backgroundColor: '#ffffff',
          }}
        >
          <Row>
            <Col
              sm={20}
              md={10}
            >
              <Form.Item
                name="tac"
                label="Terms & Conditions"
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item
                name="remark"
                label="Remark"
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item
                name="discount"
                label="Discount"
              >
                <InputNumber
                  min={0}
                  max={100}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace('%', '')}
                  onChange={(e) => setShowDiscount(e)}
                />
              </Form.Item>

              <Form.Item
                name="partOrderDtoList"
                hidden
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <ARMCard
            title="Purchase Order Detail"
            style={{ marginTop: '10px' }}
          >
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
                span={3}
                offset={21}
              >
                <Title
                  level={5}
                  style={{ marginBottom: '-15px' }}
                >
                  Sub Total: ${subTotal}
                </Title>
                <Divider />
                <Title
                  level={5}
                  style={{ marginBottom: '-15px' }}
                >
                  Discount {showDiscount}%: ${discountedAmount.toFixed(2)}
                </Title>
                <Divider dashed />
                <Title
                  level={5}
                  style={{ marginBottom: '-15px' }}
                >
                  Grand Total: ${grandTotal.toFixed(2)}
                </Title>
              </Col>
            </Row>
          </ARMCard>

          <Form.Item
            wrapperCol={{ ...layout.wrapperCol }}
            style={{ marginTop: '30px' }}
          >
            <Space size="small">
              <ARMButton
                type="primary"
                htmlType="submit"
              >
                Update
              </ARMButton>
              <ARMButton
                onClick={onReset}
                type="primary"
                danger
              >
                Reset
              </ARMButton>
            </Space>
          </Form.Item>
        </ARMForm>
      </ARMCard>
    </CommonLayout>
  );
};

export default EditPO;
