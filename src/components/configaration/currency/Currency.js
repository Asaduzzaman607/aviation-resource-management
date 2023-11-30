import {
  EditOutlined,
  FilterOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Col,
  Empty,
  Form,
  Input,
  notification,
  Pagination,
  Row,
  Select,
  Space,
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { usePaginate } from '../../../lib/hooks/paginations';
import currencyService from '../../../service/CurrencyService';
import Permission from '../../auth/Permission';
import ActiveInactive from '../../common/ActiveInactive';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import ViewCurrency from './ViewCurrency';

const Currency = () => {
  const { Option } = Select;
  const {
    form,
    collection,
    page,
    totalElements,
    paginate,
    isActive,
    setIsActive,
    fetchData,
    refreshPagination,
    resetFilter,
    size,
  } = usePaginate('currency', '/store/currencies/search');

  useEffect(() => {
    fetchData();
  }, []);
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [base, setBase] = useState([]);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/configurations">
              {' '}
              <i className="fas fa-cog" /> &nbsp;
              {t('configuration.Configurations')}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            {t('configuration.Currency.Currency')}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission permission="CONFIGURATION_CONFIGURATION_CURRENCY_SEARCH">
        <ARMCard
          title={getLinkAndTitle(
            t('configuration.Currency.Currency List'),
            '/configurations/currency/add',
            true,
            'CONFIGURATION_CONFIGURATION_CURRENCY_SAVE'
          )}
        >
          <Form
            form={form}
            onFinish={fetchData}
          >
            <Row gutter={20}>
              <Col
                xs={24}
                md={6}
              >
                <Form.Item
                  name="query"
                  rules={[
                    {
                      max: t('common.Max'),
                      message: t('common.Maximum 255 characters allowed'),
                    },
                    {
                      whitespace: true,
                      message: t('common.Only space is not allowed'),
                    },
                  ]}
                >
                  <Input
                    placeholder={t(
                      'configuration.Currency.Search Currency Code'
                    )}
                  />
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={4}
              >
                <Form.Item
                  name="size"
                  label={t('common.Page Size')}
                  initialValue="10"
                >
                  <Select id="antSelect">
                    <Option value="10">10</Option>
                    <Option value="20">20</Option>
                    <Option value="30">30</Option>
                    <Option value="40">40</Option>
                    <Option value="50">50</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={8}
              >
                <Form.Item>
                  <Space>
                    <ARMButton
                      size="middle"
                      type="primary"
                      htmlType="submit"
                    >
                      <FilterOutlined />
                      {t('common.Filter')}
                    </ARMButton>
                    <ARMButton
                      size="middle"
                      type="primary"
                      htmlType="submit"
                      onClick={resetFilter}
                    >
                      <RollbackOutlined />
                      {t('common.Reset')}
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <ActiveInactive
            isActive={isActive}
            setIsActive={setIsActive}
          />

          <Row className="table-responsive">
            <ResponsiveTable>
              <ARMTable>
                <thead>
                  <tr>
                    <th>{t('configuration.Currency.Code')}</th>
                    <th>{t('configuration.Currency.Description')}</th>
                    <th>{t('common.Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {collection.map((currency) => (
                    <tr key={currency.id}>
                      <td>{currency.code}</td>
                      <td>{currency.description}</td>
                      <td>
                        <Space size="small">
                          <Link
                            to={`/configurations/currency/edit/${currency.id}`}
                          >
                            <ARMButton
                              type="primary"
                              size="small"
                              style={{
                                backgroundColor: '#6e757c',
                                borderColor: '#6e757c',
                              }}
                            >
                              <EditOutlined />
                            </ARMButton>
                          </Link>

                          <ActiveInactiveButton
                            isActive={isActive}
                            handleOk={async () => {
                              try {
                                await currencyService.toggleStatus(
                                  currency.id,
                                  !isActive
                                );
                                notification['success']({
                                  message: t(
                                    'common.Status Changed Successfully'
                                  ),
                                });
                                refreshPagination();
                              } catch (e) {
                                notification['error']({
                                  message: getErrorMessage(e),
                                });
                              }
                            }}
                          />
                        </Space>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ARMTable>
            </ResponsiveTable>
          </Row>

          {collection.length === 0 ? (
            <Row>
              <Col style={{ margin: '30px auto' }}>
                <Empty />
              </Col>
            </Row>
          ) : (
            <Row justify="center">
              <Col style={{ marginTop: 10 }}>
                <Pagination
                  showSizeChanger={false}
                  onShowSizeChange={console.log}
                  pageSize={size}
                  current={page}
                  onChange={paginate}
                  total={totalElements}
                />
              </Col>
              <ViewCurrency
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                base={base}
              />
            </Row>
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default Currency;
