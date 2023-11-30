import {
  EditOutlined,
  EyeOutlined,
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
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import CompanyService from '../../../service/CompanyService';
import ActiveInactive from '../../common/ActiveInactive';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import { getErrorMessage } from '../../../lib/common/helpers';
import { usePaginate } from '../../../lib/hooks/paginations';
import ActiveInactiveButton from '../../common/buttons/ActiveInactiveButton';
import {useTranslation} from "react-i18next";
import Permission from "../../auth/Permission";
import CompanyViewModal from "./CompanyViewModal";
import API from "../../../service/Api";
import {notifyError} from "../../../lib/common/notifications";

const { Option } = Select;

const CompanyLists = () => {
  const { t } = useTranslation();
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
  } = usePaginate('companies', '/companies/search');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [company, setCompany] = useState({});
  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleOpenModal = (id) => async () => {
    if (!id) {
      return;
    }

    try {
      const res = await API.get(`companies/${id}`)
      setCompany({...res.data})
      setIsModalOpen(true);
    } catch (e) {
      notifyError("Something Went Wrong!");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  console.log('company', collection);
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/configurations">
              {' '}
              <i className="fas fa-cog ant-menu-item-icon" />{' '}
              &nbsp;{t("configuration.Configurations")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("configuration.Company.Companies")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission permission="CONFIGURATION_CONFIGURATION_COMPANY_SEARCH">

        <CompanyViewModal
            handleCloseModal={handleCloseModal}
            company={company}
            isModalOpen={isModalOpen}
        />

      <ARMCard
        title={getLinkAndTitle(
          t("configuration.Company.Company List"),
          '/configurations/companies/add',
          true,
          'CONFIGURATION_CONFIGURATION_COMPANY_SAVE'
        )}
      >
        <Form form={form} onFinish={fetchData}>
          <Row gutter={20}>
            <Col xs={24} md={6}>
              <Form.Item name="query">
                <Input placeholder={t("configuration.Company.Search Company Name")} />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item name="size" label={t("common.Page Size")} initialValue="10">
                <Select id="antSelect">
                  <Option value="10">10</Option>
                  <Option value="20">20</Option>
                  <Option value="30">30</Option>
                  <Option value="40">40</Option>
                  <Option value="50">50</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item>
                <Space>
                  <ARMButton size="middle" type="primary" htmlType="submit">
                    <FilterOutlined /> {t("common.Filter")}
                  </ARMButton>
                  <ARMButton
                    size="middle"
                    type="primary"
                    htmlType="submit"
                    onClick={resetFilter}
                  >
                    <RollbackOutlined /> {t("common.Reset")}
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

        <Row className="table-responsive">
          <ARMTable
            scroll={{
              x: 500,
              y: 300,
            }}
          >
            <thead>
              <tr>
                <th>{t("configuration.Company.Company Name")}</th>
                <th>{t("configuration.Company.Address Line 1")}</th>
                <th>{t("configuration.Company.Address Line 2")}</th>
                <th>{t("configuration.Company.Address Line 3")}</th>
                <th>{t("configuration.Company.Country")}</th>
                <th>{t("configuration.Company.City")}</th>
                <th>{t("configuration.Company.Phone Number")}</th>
                <th>{t("configuration.Company.Fax")}</th>
                <th>{t("configuration.Company.Email")}</th>
                <th>{t("configuration.Company.Contact Person")}</th>
                <th>{t("configuration.Company.Base Currency")}</th>
                <th>{t("configuration.Company.Local Currency")}</th>
                <th>{t("configuration.Company.Shipment Address 1")}</th>
                <th>{t("configuration.Company.Shipment Address 2")}</th>
                <th>{t("configuration.Company.Shipment Address 3")}</th>
                <th>{t("configuration.Company.Company URL")}</th>
                <th>{t("common.Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {collection.map((company, index) => (
                <tr key={index}>
                  <td>{company.companyName}</td>
                  <td>{company.addressLineOne}</td>
                  <td>{company.addressLineTwo}</td>
                  <td>{company.addressLineThree}</td>
                  <td>{company.countryName}</td>
                  <td>{company.cityName}</td>
                  <td>{company.phone}</td>
                  <td>{company.fax}</td>
                  <td>{company.email}</td>
                  <td>{company.contactPerson}</td>
                  <td>{company.baseCurrency}</td>
                  <td>{company.localCurrency}</td>
                  <td>{company.shipmentAddressOne}</td>
                  <td>{company.shipmentAddressTwo}</td>
                  <td>{company.shipmentAddressThree}</td>
                  <td>{company.companyUrl}</td>

                  <td>
                    <Space size="small">
                      <ARMButton
                        type="primary"
                        size="small"
                        style={{
                          backgroundColor: '#4aa0b5',
                          borderColor: '#4aa0b5',
                        }}
                        onClick={handleOpenModal(company.id)}
                      >
                        <EyeOutlined />
                      </ARMButton>
                      <ARMButton
                        type="primary"
                        size="small"
                        style={{
                          backgroundColor: '#6e757c',
                          borderColor: '#6e757c',
                        }}
                      >
                        <Link
                          to={`/configurations/companies/edit/${company.id}`}
                        >
                          <EditOutlined />
                        </Link>
                      </ARMButton>

                      <ActiveInactiveButton
                        isActive={isActive}
                        handleOk={async () => {
                          try {
                            await CompanyService.toggleStatus(
                              company.id,
                              !isActive
                            );
                            notification['success']({
                              message: 'Status Changed Successfully!',
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
          </Row>
        )}
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default CompanyLists;
