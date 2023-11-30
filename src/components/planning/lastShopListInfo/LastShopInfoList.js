import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Empty,Pagination, Row,  Space} from "antd";
import {Link} from "react-router-dom";
import Permission from "../../auth/Permission";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMButton from "../../common/buttons/ARMButton";
import {EditOutlined, EyeOutlined} from "@ant-design/icons";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ARMTable from "../../common/ARMTable";
import {notifyResponseError} from "../../../lib/common/notifications";
import LastShopInfoServices from "../../../service/LastShopInfoServices";
import {CycleFormat, DateFormat, HourFormat} from "../report/Common";

const LastShopInfoList = () => {



 const [shopListInfo,setShopListInfo] = useState([])
 const [totalElements,setTotalElements] = useState(null)
 const [currentPage,setCurrentPage] = useState(null)
 const [page,setPage] = useState(1)
    const onChange = (pageNumber) => {
        setPage(pageNumber);

    };


    const searchShopListInfo = async () => {

        try {
            const {data} = await LastShopInfoServices.getAllLastShop(page,10);
            setShopListInfo(data.model);
            setTotalElements(data.totalElements);
            setCurrentPage(data.currentPage);
        } catch (er) {
            notifyResponseError(er);
        }
    };



    useEffect(() => {
        (async () => {
            await searchShopListInfo();
        })();
    }, []);

    useEffect(() => {
        (async () => {
            await searchShopListInfo();
        })();
    }, [page]);

    const { t } = useTranslation();

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/planning">
                            <i className="fas fa-chart-line" />
                            &nbsp; {t("planning.Planning")}
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>Last Shop Information</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="PLANNING_OTHERS_APU_LLP_LAST_SHOP_VISIT_INFO_SEARCH" showFallback>
                <ARMCard
                    title={getLinkAndTitle(
                        "Last Shop Information List",
                        "/planning/last-shop-info/add",
                        "add",
                        "PLANNING_OTHERS_APU_LLP_LAST_SHOP_VISIT_INFO_SAVE"
                    )}

                >
                    <Row className="table-responsive">
                        <ResponsiveTable>
                            <ARMTable>
                                <thead>
                                <tr>
                                    <th>Aircraft Name</th>
                                    <th>Model</th>
                                    <th>Date</th>
                                    <th>TSN</th>
                                    <th>CSN</th>
                                    <th>TSR</th>
                                    <th>CSR</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {shopListInfo?.map((shop, index) => (
                                    <tr key={index}>
                                        <td>{shop.aircraftName}</td>
                                        <td>{shop.model}</td>
                                        <td>{DateFormat(shop.date)}</td>
                                        <td>{HourFormat(shop.tsn)}</td>
                                        <td>{CycleFormat(shop.csn)}</td>
                                        <td>{HourFormat(shop.tsr)}</td>
                                        <td>{CycleFormat(shop.csr)}</td>
                                        <td>{shop.status}</td>
                                        <td>
                                            <Space size="small">
                                                <Link to={`/planning/last-shop-info/view/${shop.id}`}>
                                                    <Permission permission="">
                                                        <ARMButton
                                                            type="primary"
                                                            size="small"
                                                            style={{
                                                                backgroundColor: "#4aa0b5",
                                                                borderColor: "#4aa0b5",
                                                            }}
                                                        >
                                                            <EyeOutlined />
                                                        </ARMButton>
                                                    </Permission>
                                                </Link>
                                                <Link
                                                    to={`/planning/last-shop-info/edit/${shop.id}`}
                                                >
                                                    <Permission permission="PLANNING_OTHERS_APU_LLP_LAST_SHOP_VISIT_INFO_EDIT">
                                                        <ARMButton
                                                            type="primary"
                                                            size="small"
                                                            style={{
                                                                backgroundColor: "#6e757c",
                                                                borderColor: "#6e757c",
                                                            }}
                                                        >
                                                            <EditOutlined />
                                                        </ARMButton>
                                                    </Permission>
                                                </Link>
                                            </Space>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </ARMTable>
                        </ResponsiveTable>
                    </Row>

                    {shopListInfo?.length === 0 ? (
                        <Row>
                            <Col style={{ margin: "30px auto" }}>
                                <Empty />
                            </Col>
                        </Row>
                    ) : (
                        <Row justify="center">
                            <Col style={{ marginTop: 10 }}>
                                <Pagination
                                    showSizeChanger={false}
                                    onShowSizeChange={console.log}
                                    pageSize={10}
                                    current={currentPage}
                                    onChange={onChange}
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
export default LastShopInfoList;
