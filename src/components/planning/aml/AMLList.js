import React, {useCallback, useEffect, useState} from "react";
import {Breadcrumb, Col, Pagination, Row, Space} from "antd";
import ARMTable from "../../common/ARMTable";
import CommonLayout from "../../layout/CommonLayout";
import ARMCard from "../../common/ARMCard";
import {Link} from "react-router-dom";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ResponsiveTable from "../../common/ResposnsiveTable";
import EditButton from "../../common/buttons/EditButton";
import ViewButton from "../../common/buttons/ViewButton";
import {usePaginate} from "../../../lib/hooks/paginations";
import {useAirports} from "../../../lib/hooks/planning/airports";
import AMLListFilterForm from "./AMLList/AMLListFilterForm";
import {useTranslation} from "react-i18next";
import Permission from "../../auth/Permission";
import AircraftService from "../../../service/AircraftService";
import {DateFormat} from "../report/Common";
import API from "../../../service/Api";
import {notifyResponseError, notifySuccess} from "../../../lib/common/notifications";
import DeleteButton from "../../common/buttons/DeleteButton";
export const AML_SEARCH_URL = 'aircraft-maintenance-log/search';
export const AML_REDUX_KEY = 'amls';

export default function AMLList() {

    const {
        form,
        collection,
        page,
        totalElements,
        paginate,
        fetchData,
        size,
        totalPages,
        currentPage,
        refreshPagination
    } = usePaginate(AML_REDUX_KEY, AML_SEARCH_URL)
    const {airports} = useAirports();


    const DeleteLastAtl = async (id) => {
        try {
            const {data} = await API.delete(`aircraft-maintenance-log/delete-atl/${id}`);
            notifySuccess("Atl deleted successfully !")
            refreshPagination();
        } catch (er) {
            notifyResponseError(er)
        }
    }


    const [allAircrafts, setAircrafts] = useState([]);

    const getAllAircrafts = useCallback(async () => {
        const res = await AircraftService.getAllAircraftList();
        setAircrafts(
            res.data.map(({aircraftId, aircraftName}) => ({
                aircraftId,
                aircraftName,
            }))
        );
    }, []);

    useEffect(() => {
        (async () => {
            await getAllAircrafts();
        })();
    }, []);
    const {t} = useTranslation()

    const TITLE = `${t("planning.ATL.ATL List")}`;

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        {' '}
                        <Link to="/planning">
                            {' '}
                            <i className="fas fa-chart-line"/> &nbsp;{t("planning.Planning")}
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        {t("planning.ATL.ATL")}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_SEARCH" showFallback>
                <ARMCard
                    title={getLinkAndTitle(TITLE, "add", true, "PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_SAVE")}
                >
                    <AMLListFilterForm fetchData={fetchData} form={form} aircrafts={allAircrafts} airports={airports}/>

                    <Row className="table-responsive">
                        <ResponsiveTable>
                            <ARMTable>
                                <thead>
                                <tr>
                                    <th>{t("planning.ATL.Page No")}.</th>
                                    <th>{t("planning.Aircrafts.Aircraft")}</th>
                                    <th>{t("planning.ATL.Flight No")}.</th>
                                    <th>{t("planning.ATL.Date")}</th>
                                    <th>{t("planning.ATL.From Airport")}</th>
                                    <th>{t("planning.ATL.To Airport")}</th>
                                    <th width="200">{t("common.Actions")}</th>
                                </tr>
                                </thead>
                                <tbody>

                                {
                                    collection.map((model, index) => <tr key={model.aircraftMaintenanceLogId}>
                                        <td>{model.pageNo}{model.alphabet}</td>
                                        <td>{model.aircraftName}</td>
                                        <td>{model.flightNo}</td>
                                        {/*<td>{model.date && moment(`${model.date}`, 'YYYY-MM-DD').format('DD-MM-YYYY')}</td>*/}
                                        <td>{DateFormat(model?.date)}</td>
                                        <td>{model.fromAirportIataCode}</td>
                                        <td>{model.toAirportIataCode}</td>
                                        <td>
                                            <Space size="small">
                                                <Link to={`view/${model.aircraftMaintenanceLogId}`}>
                                                    <ViewButton/>
                                                </Link>

                                                <Link to={`edit/${model.aircraftMaintenanceLogId}`}>
                                                    <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_EDIT">
                                                        <EditButton/>
                                                    </Permission>
                                                </Link>
                                                {((currentPage === 1) && (index === 0) && collection?.length > 0) && (
                                                    <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_DELETE">
                                                        <DeleteButton handleOk={() => DeleteLastAtl(model.aircraftId)}/>
                                                    </Permission>
                                                )}

                                            </Space>
                                        </td>
                                    </tr>)
                                }

                                </tbody>
                            </ARMTable>
                        </ResponsiveTable>
                    </Row>

                    <Row justify="center">
                        <Col style={{marginTop: 10}}>
                            <Pagination showSizeChanger={false} onShowSizeChange={console.log} pageSize={size}
                                        current={page}
                                        onChange={paginate} total={totalElements}/>
                        </Col>
                    </Row>
                </ARMCard>
            </Permission>
        </CommonLayout>
    );
};
