import { Breadcrumb, Col, Form, Select, Space } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useSetState } from 'react-use';
import ARMForm from '../../../lib/common/ARMForm';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import DebounceSelect from '../../common/DebounceSelect';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import SelectTable from './SelectTable';
import useCS from './useCS';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const { Option } = Select;

const ComparativeStatement = () => {
  const {
    form,
    onFinish,
    onReset,
    allCS,
    getAllCS,
    existingCS,
    setExistingCS,
    getExistingCS,
    quotationList,
    quotationIdList,
    orderType,
    setOrderType,
    remarks,
  } = useCS();

  const rfqNo = Form.useWatch('rfqNo', form);
  const [showTable, setShowTable] = useSetState(false);

  useEffect(() => {
    existingCS && getExistingCS();
  }, [existingCS]);

  const route = useSelector((state) => state.routeLocation.previousRoute);

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
          <Breadcrumb.Item>Comparative Statement</Breadcrumb.Item>
          <Breadcrumb.Item>Add</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission={[
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_COMPARATIVE_STATEMENT_MATERIAL_MANAGEMENT_GENERATE_CS_SAVE',
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_COMPARATIVE_STATEMENT_MATERIAL_MANAGEMENT_GENERATE_CS_EDIT',
        ]}
        showFallback
      >
        <ARMCard
          title={
            route === 'list'
              ? getLinkAndTitle(
                  'Comparative Statement',
                  '/material-management/pending-comparative-statement'
                )
              : getLinkAndTitle('Comparative Statement', '/material-management')
          }
        >
          <ARMForm
            {...layout}
            form={form}
            name="cs"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Col
              sm={20}
              md={10}
            >
              <Form.Item
                label="Order Type"
                name="orderType"
                rules={[
                  {
                    required: true,
                    message: 'Order type is required!',
                  },
                ]}
              >
                <Select
                  placeholder="--- Select Order Type ---"
                  onChange={(e) => setOrderType(e)}
                  allowClear
                >
                  <Option value={'PURCHASE'}>Purchase</Option>
                  <Option value={'LOAN'}>Loan</Option>
                  <Option value={'REPAIR'}>Repair</Option>
                  <Option value={'EXCHANGE'}>Exchange</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="RFQ No."
                name="rfqNo"
                rules={[
                  {
                    required: true,
                    message: 'Please select RFQ No.',
                  },
                ]}
              >
                <DebounceSelect
                  mapper={(v) => ({
                    label: v.rfqNo,
                    value: v.id,
                  })}
                  showSearch
                  placeholder="--- Select RFQ No. ---"
                  url={`/procurement/quote-requests/search?page=1&size=20`}
                  params={{ type: 'APPROVED', rfqType: 'PROCUREMENT' }}
                  onChange={(newValue) => {
                    getAllCS(newValue.value);
                  }}
                  selectedValue={rfqNo}
                />
              </Form.Item>

              <Form.Item
                label="Existing CS"
                name="existingCS"
              >
                <Select
                  placeholder="--- Select Existing CS ---"
                  allowClear
                  onChange={(e) => setExistingCS(e)}
                >
                  {allCS.map((cs) => (
                    <Option
                      key={cs.id}
                      value={cs.id}
                    >
                      {cs.csNo}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Remarks"
                name="remarks"
              >
                <TextArea />
              </Form.Item>

              <Form.Item
                wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                style={{ marginTop: '20px' }}
              >
                <Space size="small">
                  <ARMButton
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      if (rfqNo) setShowTable(true);
                    }}
                  >
                    Show List
                  </ARMButton>
                  <ARMButton
                    onClick={() => {
                      onReset();
                      setShowTable(false);
                    }}
                    type="primary"
                    danger
                  >
                    Reset
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </ARMForm>
        </ARMCard>

        {showTable && (
          <SelectTable
            existingCS={existingCS}
            rfqNo={rfqNo?.value}
            orderType={orderType}
            remarks={remarks}
            quotationList={quotationList}
            quotationIdList={quotationIdList}
          />
        )}
      </Permission>
    </CommonLayout>
  );
};

export default ComparativeStatement;
