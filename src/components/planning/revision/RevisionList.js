import {useEffect, useState} from "react";
import {notifyResponseError} from "../../../lib/common/notifications";
import {useTranslation} from "react-i18next";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Empty, Pagination, Row, Space, Spin} from "antd";
import {Link} from "react-router-dom";
import Permission from "../../auth/Permission";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import {EditOutlined} from "@ant-design/icons";
import RevisionServices from "../../../service/RevisionServices";



const RevisionList = () => {



    const [revisions,setRevisiions] = useState([])
    const [totalElements,setTotalElements] = useState(null)
    const [currentPage,setCurrentPage] = useState(null)
    const [page,setPage] = useState(1)
    const onChange = (pageNumber) => {
        setPage(pageNumber);

    };


    const searchRevisions = async () => {

        try {
            const {data} = await RevisionServices.getAllRevision(page,10);
            setRevisiions(data.model);
            setTotalElements(data.totalElements);
            setCurrentPage(data.currentPage);
        } catch (er) {
            notifyResponseError(er);
        }
    };



    useEffect(() => {
        (async () => {
            await searchRevisions();
        })();
    }, []);

    useEffect(() => {
        (async () => {
            await searchRevisions();
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

                    <Breadcrumb.Item>AMP Revisions</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="PLANNING_SETTINGS_AMP_REVISION_SEARCH" showFallback>
                <ARMCard
                    title={getLinkAndTitle(
                        "AMP Revisions",
                        "/planning/amp-revisions/add",
                        "add",
                        "PLANNING_SETTINGS_AMP_REVISION_SEARCH"
                    )}

                >
                    <Row className="table-responsive">
                        <ResponsiveTable>
                            <ARMTable>
                                <thead>
                                <tr>
                                    <th>Header Key</th>
                                    <th>Header Value</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {revisions?.map((rev, index) => (
                                    <tr key={index}>
                                        <td>{rev.headerKey}</td>
                                        <td>{rev.headerValue}</td>
                                        <td>
                                            <Space size="small">
                                                <Link
                                                    to={`/planning/amp-revisions/edit/${rev.id}`}
                                                >
                                                    <Permission permission="PLANNING_SETTINGS_AMP_REVISION_EDIT">
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

                    {revisions?.length === 0 ? (
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
export default RevisionList;