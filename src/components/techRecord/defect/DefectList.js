import {usePaginate} from "../../../lib/hooks/paginations";
import {useTranslation} from "react-i18next";
import AircraftService from "../../../service/AircraftService";
import {notifyResponseError} from "../../../lib/common/notifications";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {
    AutoComplete,
    Breadcrumb,
    Col,
    DatePicker,
    Empty,
    Form,
    notification,
    Pagination,
    Row,
    Select,
    Space
} from "antd";
import {Link} from "react-router-dom";
import {
    EditOutlined,
    EyeOutlined,
    FilterOutlined,
    PrinterOutlined,
    ProfileOutlined,
    RollbackOutlined
} from "@ant-design/icons";
import Permission from "../../auth/Permission";
import ARMCard from "../../common/ARMCard";
import {LinkAndTitle} from "../../../lib/common/TitleOrLink";
import {Option} from "antd/lib/mentions";
import ARMButton from "../../common/buttons/ARMButton";
import ActiveInactive from "../../common/ActiveInactive";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ARMTable from "../../common/ARMTable";
import {DateFormat} from "../../planning/report/Common";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import {getErrorMessage, sleep} from "../../../lib/common/helpers";
import React, {createRef, useEffect, useState} from "react";
import DefectServices from "../../../service/DefectServices";
import ModelTreeService from "../../../service/ModelTreeService";
import ReactToPrint from "react-to-print";
import SuccessButton from "../../common/buttons/SuccessButton";
import SerialNoServices from "../../../service/SerialNoServices";
import debounce from "lodash/debounce";
import API from "../../../service/Api";


const dateFormat = "YYYY-MM-DD";

const printStyle = `
*{
    font-size: 12px !important;
    overflow: visible !important;
    margin: 0!important;
    padding:0!important;
  }

  .page-of-report{
   visibility: visible!important;
   }
   .pagination{
   display: none!important;
  }
  
  table.report-container {
      page-break-after:always!important;
  }
  thead.report-header {
      display:table-header-group!important;
  }

  .border-none{
    border: none!important;
}
.aircraftHeader{
    margin-left: 30px !important
}
  @page {
    size: landscape;
  }
    .first {
   display : none!important
   }
   .second {
    display : block!important
   }
  .actionHeader{
  display : none!important
  }
  table-responsive tr th .actionHeader{
  display : none!important
  }
`;


const DefectList = () => {
    const {
        collection,
        page,
        totalElements,
        paginate,
        isActive,
        setIsActive,
        fetchData,
        refreshPagination,
        resetFilter,
        size
    } = usePaginate(
        "defectData",
        "/defect/search"
    );


    const {t} = useTranslation();
    const reportRef = createRef();
    const {Option} = AutoComplete;
    const [form] = Form.useForm();
    const [aircrafts, setAircrafts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [printData, setPrintData] = useState([]);
    const [parts, setParts] = useState([]);
    const partId = Form.useWatch('partId', form);
    const locationId = Form.useWatch('locationId', form);
    const aircraftId = Form.useWatch('aircraftId', form);
    const dateRange = Form.useWatch('dateRange', form);

    const [searchPartId, setSearchPartId] = useState(null);


    const getAllAircraft = async () => {
        try {
            const {data} = await AircraftService.getAllAircraftList();
            setAircrafts(data);
        } catch (er) {
            notifyResponseError(er);
        }
    };

    const getAllLocation = async () => {
        try {
            const {data} = await ModelTreeService.getAllLocation();
            setLocations(data.model);
        } catch (er) {
            notifyResponseError(er)
        }
    };

    useEffect(() => {
        getAllAircraft();
        getAllLocation();
    }, []);

    const onSearchParts = async (value) => {
        try {
            const {data} = await SerialNoServices.searchParts(value);
            setParts(data)
        } catch (er) {
            notifyResponseError(er)
        }
    }


    useEffect(() => {

        if (!partId) {
            return;
        }
        (async () => {
            const getPartId = parts?.find(v => v.partNo === partId)
            setSearchPartId(getPartId)
        })();
    }, [partId]);


    const onFinish = (values) => {
        const [fromDate, toDate] = values.dateRange || "";
        const partIdKey = searchPartId?.partId;

        const data = {
            ...values,
            aircraftId: values.aircraftId || null,
            partId: partIdKey || null,
            locationId: values.locationId || null,
            fromDate: fromDate && fromDate.format(dateFormat) || '',
            toDate: toDate && toDate.format(dateFormat) || '',
        };
        fetchData(data);
    };


    const fetchPrintData = async () => {
        const [fromDate, toDate] = dateRange || "";
        const partIdKey = searchPartId?.partId;

        const dataWithoutPagination = {
            aircraftId: aircraftId || null,
            partId: partIdKey || null,
            locationId: locationId || null,
            fromDate: fromDate && fromDate.format(dateFormat) || '',
            toDate: toDate && toDate.format(dateFormat) || '',
            isActive,
            isPageable: false,
        };
        try {
            const {data} = await API.post(`defect/search`, dataWithoutPagination);
            setPrintData(data.model)
            return sleep(1000)
        } catch (error) {
            notification["error"]({message: getErrorMessage(error)});
            return;
        }
    };


    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/reliability">
                            <ProfileOutlined/>
                            &nbsp; Reliability
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>Defects</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission="" showFallback>
                <ARMCard
                    title={
                        <Row justify={'space-between'}>
                            <Col>Defects</Col>

                            <Col>
                                <Space>
                                    <LinkAndTitle link="/reliability/defect/add" addBtn
                                                  permission=""/>


                                    <LinkAndTitle link="/reliability/defect/add-multiple-defect" addMultiple
                                                  permission=""/>
                                </Space>

                            </Col>
                        </Row>


                    }>
                    <Form form={form} onFinish={onFinish}>
                        <Row gutter={20}>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    name="aircraftId"
                                    label={'Aircraft'}
                                    rules={[
                                        {
                                            required: false,
                                            message: "Aircraft is required",
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        placeholder="Please Select Aircraft"
                                    >
                                        {aircrafts?.map((item) => {
                                            return (
                                                <Select.Option key={item.id} value={item.aircraftId}>
                                                    {item?.aircraftName}{" "}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    name="locationId"
                                    label={'ATA'}
                                    style={{marginBottom: "12px"}}
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please Select ATA',
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        filterOption={(inputValue, option) =>
                                            option.children
                                                .toString("")
                                                .toLowerCase()
                                                .includes(inputValue.toLowerCase())
                                        }
                                        placeholder={"Please Select ATA"}
                                    >
                                        {locations?.map((loc) => {
                                            return (
                                                <Select.Option key={loc.id} value={loc.id}>
                                                    {loc.name}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                                <Form.Item
                                    label='Part'
                                    name="partId"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Part is required',
                                        }
                                    ]}
                                >
                                    <AutoComplete showSearch onSearch={debounce(onSearchParts, 1000)}
                                                  placeholder='Input Part No'>
                                        {parts.map((part) => (
                                            <Option key={part.partNo} value={part.partNo}>
                                                {part.partNo}
                                            </Option>
                                        ))}
                                    </AutoComplete>

                                </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: false,
                                            message: "Date range is required",
                                        },
                                    ]}
                                    name="dateRange"
                                >
                                    <DatePicker.RangePicker
                                        format="DD-MM-YYYY"
                                        style={{width: "100%"}}
                                    />
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
                                            <FilterOutlined/> {t("common.Filter")}
                                        </ARMButton>
                                        <ARMButton size="middle" type="primary" htmlType="reset" onClick={resetFilter}>
                                            <RollbackOutlined/> {t("common.Reset")}
                                        </ARMButton>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    <Row style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Col>
                            <ActiveInactive isActive={isActive} setIsActive={setIsActive}/>
                        </Col>
                        <Col>
                            <ReactToPrint
                                content={() => reportRef.current}
                                copyStyles={true}
                                pageStyle={printStyle}
                                trigger={() => (
                                    <SuccessButton
                                        style={{marginBottom: '5px'}}
                                        type="primary"
                                        icon={<PrinterOutlined/>}
                                        htmlType="button"
                                    >
                                        Print
                                    </SuccessButton>
                                )}
                                onBeforeGetContent={fetchPrintData}
                            />
                        </Col>
                    </Row>

                    <Row className="table-responsive">
                        <ResponsiveTable className={'first'}>
                            <ARMTable>
                                <thead>
                                <tr>
                                    <th rowSpan={2}>ATA</th>
                                    <th rowSpan={2}>SYSTEM</th>
                                    <th rowSpan={2}>DATE</th>
                                    <th rowSpan={2}>A/C REG</th>
                                    <th rowSpan={2}>AML Ref.</th>

                                    <th colSpan={2}>DESCRIPTION</th>
                                    <th rowSpan={2}>NOMENCLATURE</th>
                                    <th rowSpan={2}>P/N</th>
                                    <th rowSpan={2}>MAREP/
                                        PIREP
                                    </th>
                                    <th rowSpan={2} className={'actionHeader'}>ACTIONS</th>
                                </tr>
                                <tr>
                                    <th>DEFECT</th>
                                    <th>ACTION</th>
                                </tr>
                                </thead>
                                <tbody>
                                {collection.map((defect) => (
                                    <tr key={defect.id}>
                                        <td>{defect.location}</td>
                                        <td>{defect.system}</td>
                                        <td>{DateFormat(defect.date)}</td>
                                        <td>{defect.aircraftName}</td>
                                        <td>{defect.reference && `ATL : ${defect.reference}`}</td>
                                        <td className='newLineInRow'>{defect.defectDesc}</td>
                                        <td className='newLineInRow'>{defect.actionDesc}</td>
                                        <td>{defect.nomenclature}</td>
                                        <td>{defect.partNumber}</td>
                                        <td> {defect?.defectType === 0 ? 'PIREP' : defect?.defectType === 1 ? 'MAREP' : ''}</td>

                                        <td className={'actionHeader'}>
                                            <Space size="small">
                                                <Link to={`/reliability/defect/view/${defect.id}`}>
                                                    <ARMButton
                                                        type="primary"
                                                        size="small"
                                                        style={{
                                                            backgroundColor: "#4aa0b5",
                                                            borderColor: "#4aa0b5",
                                                        }}
                                                    >
                                                        <EyeOutlined/>
                                                    </ARMButton>
                                                </Link>


                                                {isActive ?
                                                    <Link to={`/reliability/defect/edit/${defect.id}`}>
                                                        <Permission permission="">
                                                            <ARMButton
                                                                type="primary"
                                                                size="small"
                                                                style={{
                                                                    backgroundColor: "#6e757c",
                                                                    borderColor: "#6e757c",
                                                                }}
                                                            >
                                                                <EditOutlined/>
                                                            </ARMButton>
                                                        </Permission>
                                                    </Link>
                                                    : null}

                                                <Permission permission="">
                                                    <ActiveInactiveButton
                                                        isActive={isActive}
                                                        handleOk={async () => {
                                                            try {
                                                                await DefectServices.toggleStatus(defect.id, !isActive);
                                                                notification["success"]({
                                                                    message: t("common.Status Changed Successfully"),
                                                                });
                                                                await refreshPagination();
                                                            } catch (e) {
                                                                notification["error"]({
                                                                    message: getErrorMessage(e),
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </Permission>
                                            </Space>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </ARMTable>
                        </ResponsiveTable>
                        <ResponsiveTable className={'second'} style={{display: 'none'}}>
                            <ARMTable ref={reportRef}>
                                <thead>
                                <tr>
                                    <th rowSpan={2}>ATA</th>
                                    <th rowSpan={2}>SYSTEM</th>
                                    <th rowSpan={2}>DATE</th>
                                    <th rowSpan={2}>A/C REG</th>
                                    <th rowSpan={2}>AML Ref.</th>

                                    <th colSpan={2}>DESCRIPTION</th>
                                    <th rowSpan={2}>NOMENCLATURE</th>
                                    <th rowSpan={2}>P/N</th>
                                    <th rowSpan={2}>MAREP/
                                        PIREP
                                    </th>
                                    <th rowSpan={2} className={'actionHeader'}>ACTIONS</th>
                                </tr>
                                <tr>
                                    <th>DEFECT</th>
                                    <th>ACTION</th>
                                </tr>
                                </thead>
                                <tbody>
                                {printData.map((defect) => (
                                    <tr key={defect.id}>
                                        <td>{defect.location}</td>
                                        <td>{defect.system}</td>
                                        <td>{DateFormat(defect.date)}</td>
                                        <td>{defect.aircraftName}</td>
                                        <td>{defect.reference && `ATL : ${defect.reference}`}</td>
                                        <td className='newLineInRow'>{defect.defectDesc}</td>
                                        <td className='newLineInRow'>{defect.actionDesc}</td>
                                        <td>{defect.nomenclature}</td>
                                        <td>{defect.partNumber}</td>
                                        <td> {defect?.defectType === 0 ? 'PIREP' : defect?.defectType === 1 ? 'MAREP' : ''}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </ARMTable>
                        </ResponsiveTable>
                    </Row>

                    {collection.length === 0 ? (
                        <Row>
                            <Col style={{margin: "30px auto"}}>
                                <Empty/>
                            </Col>
                        </Row>
                    ) : (
                        <Row justify="center">
                            <Col style={{marginTop: 10}}>
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

export default DefectList;

