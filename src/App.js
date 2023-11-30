import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/auth/Login";
import ApprovalSetting from "./components/configaration/approvalSetting/ApprovalSetting";
import City from "./components/configaration/base/City";
import CityAdd from "./components/configaration/base/CityAdd";
import Country from "./components/configaration/basePlant/Country";
import CountryTable from "./components/configaration/basePlant/CountryTable";
import Company from "./components/configaration/company/Company";
import CompanyLists from "./components/configaration/company/CompanyLists";
import Configurations from "./components/configaration/Configurations";
import ExternalDepartment from "./components/configaration/externalDepartment/ExternalDepartment";
import ExternalDepartmentList from "./components/configaration/externalDepartment/ExternalDepartmentList";
import Location from "./components/configaration/location/Location";
import LocationAdd from "./components/configaration/location/LocationAdd";
import ManufacturerAdd from "./components/configaration/manufacturer/ManufacturerAdd";
import Module from "./components/configaration/module/Module";
import ModuleList from "./components/configaration/module/ModuleList";
import NotificationSetting from "./components/configaration/NotificationSetting";
import AddRole from "./components/configaration/roles/AddRole";
import RolesAccessRights from "./components/configaration/roles/RolesAccessRights";
import RolesList from "./components/configaration/roles/RolesList";
import Submodule from "./components/configaration/submodule/Submodule";
import SubModuleList from "./components/configaration/submodule/SubModuleList";
import SubModuleItem from "./components/configaration/submoduleItem/SubModuleItem";
import SubModuleItemList from "./components/configaration/submoduleItem/SubModuleItemList";
import UnitofMeasurement from "./components/configaration/unitofMeasurement/UnitofMeasurement";
import UnitofMeasurementList from "./components/configaration/unitofMeasurement/UnitofMeasurementList";
import AddUsers from "./components/configaration/users/AddUsers";
import Users from "./components/configaration/users/Users";
import WorkflowActionList from "./components/configaration/workflow/WorkflowActionList";
import WorkflowActions from "./components/configaration/workflow/WorkflowActions";
import Dashboard from "./components/Dashboard";
import DepartmentList from "./components/employees/Department/DepartmentList";
import DesignationList from "./components/employees/Designations/DesignationList";
import EmployeeIndex from "./components/employees/EmployeeIndex";
import EmployeeList from "./components/employees/Employees/EmployeeList";
import SectionList from "./components/employees/Section/SectionList";
import FRS from "./components/frs/FRS";
import GoodsReceive from "./components/frs/goodsReceive/GoodsReceive";
import GoodsReceiveList from "./components/frs/goodsReceive/GoodsReceiveList";
import StockInward from "./components/frs/stockInward/StockInward";
import StockInwardList from "./components/frs/stockInward/StockInwardList";
import logo from "./components/images/logo.svg";
import Aircraft from "./components/planning/aircraft/aircraft/Aircraft";
import AircraftAdd from "./components/planning/aircraft/aircraft/AircraftAdd";
import AircraftView from "./components/planning/aircraft/aircraft/AircraftView";
import AddParts from "./components/planning/aircraft/parts/AddParts";
import Parts from "./components/planning/aircraft/parts/Parts";
import PartsDetails from "./components/planning/aircraft/parts/PartsDetails";
import AircraftBuilds from "./components/planning/aircraftBuilds/AircraftBuilds";
import AircraftBuildsList from "./components/planning/aircraftBuilds/AircraftBuildsList";
import AircraftBuildsView from "./components/planning/aircraftBuilds/AircraftBuildsView";
import AddAmlBooks from "./components/planning/aircraftMaintenanceLog/amlBooks/AddAmlBooks";
import AmlBooks from "./components/planning/aircraftMaintenanceLog/amlBooks/AmlBooks";
import AddOilRecord from "./components/planning/aircraftMaintenanceLog/oilRecords/AddOilRecords";
import OilRecords from "./components/planning/aircraftMaintenanceLog/oilRecords/OilRecords";
import OilRecordsDetails from "./components/planning/aircraftMaintenanceLog/oilRecords/OilRecordsDetails";
import AddTaskRecords from "./components/planning/aircraftMaintenanceLog/taskRecords/AddTaskRecords";
import TaskRecordDetails from "./components/planning/aircraftMaintenanceLog/taskRecords/TaskRecordDetails";
import TaskRecords from "./components/planning/aircraftMaintenanceLog/taskRecords/TaskRecords";
import AddTaskDoneList from "./components/planning/aircraftMaintenanceProgram/taskDoneList/AddTaskDoneList";
import TaskDoneList from "./components/planning/aircraftMaintenanceProgram/taskDoneList/TaskDoneList";
import AMLList from "./components/planning/aml/AMLList";
import AMLView from "./components/planning/aml/MaintenaceLog/AMLView";
import Cabin from "./components/planning/Cabin/Cabin";
import CabinList from "./components/planning/Cabin/CabinList";
import AddLocations from "./components/planning/configurations/AddLocations";
import AddPositions from "./components/planning/configurations/AddPositions";
import AddSignatures from "./components/planning/configurations/AddSignatures";
import AircraftModelFamily from "./components/planning/configurations/aircraftModelFamily/AircraftModelFamily";
import AircraftModelFamilyAdd from "./components/planning/configurations/aircraftModelFamily/AircraftModelFamilyAdd";
import Locations from "./components/planning/configurations/Locations";
import Positions from "./components/planning/configurations/Positions";
import Signatures from "./components/planning/configurations/Signatures";
import AddAirport from "./components/planning/flightData/AddAirport";
import AirportDetails from "./components/planning/flightData/AirportDetails";
import Airports from "./components/planning/flightData/Airports";
import Models from "./components/planning/models/Models";
import ModelsList from "./components/planning/models/ModelsList";
import ModelsView from "./components/planning/models/ModelsView";
import ModelTree from "./components/planning/modelTree/ModelTree";
import ModelTreeList from "./components/planning/modelTree/ModelTreeList";
import ModelTreeView from "./components/planning/modelTree/ModelTreeView";
import DailyFlyingHoursAndCycles from "./components/planning/report/DailyFlyingHoursAndCycles";
import SeatingConfiguration from "./components/planning/SeatingConfiguration/SeatingConfiguration";
import SeatingConfigurationList from "./components/planning/SeatingConfiguration/SeatingConfigurationList";
import SeatingConfigurationView from "./components/planning/SeatingConfiguration/SeatingConfigurationView";
import Procurment from "./components/procurment/Procurment";
import RequestforQuotation from "./components/procurment/rfq/RequestforQuotation";
import SupplierAdd from "./components/procurment/supplier/SupplierAdd";
import ProtectRoute from "./components/protected/ProtectRoute";
import IssueDemand from "./components/store/issueDemand/IssueDemand";
import StoreDemand from "./components/store/itemDemad/StoreDemand";
import PartsAvailabilityList from "./components/store/partsAvailability/PartsAvailabilityList";
import PartsReturn from "./components/store/partsReturn/PartsReturn";
import PartsReturnDetailsPrint from "./components/store/partsReturn/PartsReturnDetailsPrint";
import PendingDemandList from "./components/store/pendingDemand/PendingDemandList";
import RackList from "./components/store/rack/RackList";
import RackView from "./components/store/rack/RackView";
import RackRowList from "./components/store/rackrow/RackRowList";
import RackRowView from "./components/store/rackrow/RackRowView";
import RackRowBinList from "./components/store/rackrowbin/RackRowBinList";
import RackRowBinView from "./components/store/rackrowbin/RackRowBinView";
import ProcurementRequisition from "./components/store/requisition/ProcurementRequisition";
import RoomList from "./components/store/room/RoomList";
import ScrapParts from "./components/store/scrapParts/ScrapParts";
import StockRoom from './components/store/stockRoom/StockRoom';
import StockRoomAdd from './components/store/stockRoom/StockRoomAdd';
import StoreParts from "./components/store/StoreParts/StoreParts";
import Office from "./components/store/technicalStore/Office";
import OfficeAdd from "./components/store/technicalStore/OfficeAdd";
import Workshop from "./components/store/workshop/workshop";
import WorkshopList from "./components/store/workshop/workshopList";
import { AppProvider } from "./contexts/apps";

import ApprovalSettingList from "./components/configaration/approvalSetting/ApprovalSettingList";
import VendorCapabilities from "./components/configaration/vendorCapabilities/VendorCapabilities";
import VendorCapabilitiesList from "./components/configaration/vendorCapabilities/VendorCapabilitiesList";
import AircraftTasks from "./components/planning/aircraftMaintenanceProgram/aircraftTasks/AircraftTasks";
import AddTaskForecasts from "./components/planning/aircraftMaintenanceProgram/taskForecast/AddTaskForecasts";
import TaskForeCasts from "./components/planning/aircraftMaintenanceProgram/taskForecast/TaskForeCasts";
import SectorwiseUtilization from "./components/planning/report/SectorwiseUtilization/SectorwiseUtilization";
import Po from "./components/procurment/po/Po";
import PoList from "./components/procurment/po/PoList";
import Invoice from "./components/procurment/poReport/Invoice";
import PurchaseOrderReport from "./components/procurment/poReport/PurchaseOrderReport";
import ApproveDemandDetails from "./components/store/approveDemand/ApproveDemandDetails";
import ApproveDemandList from "./components/store/approveDemand/ApproveDemandList";

import AddCurrency from "./components/configaration/currency/AddCurrency";
import Currency from "./components/configaration/currency/Currency";
import ApprovedManufacturer from "./components/configaration/manufacturerWorkflow/ApprovedManufacturer";
import PendingManufacturer from "./components/configaration/manufacturerWorkflow/PendingManufacturer";
import Profile from "./components/configaration/users/Profile";
import ACCheckIndex from "./components/planning/acCheckIndex";
import ACCheckIndexAdd from "./components/planning/acCheckIndex/ACCheckIndexAdd";
import ACCheckIndexView from "./components/planning/acCheckIndex/ACCheckIndexView";
import ACChecks from "./components/planning/acchecks";
import ACCheckAdd from "./components/planning/acchecks/ACCheckAdd";
import ACCheckView from "./components/planning/acchecks/ACCheckView";
import TaskDoneDetails from "./components/planning/aircraftMaintenanceProgram/taskDoneList/TaskDoneDetails";
import AddTaskType from "./components/planning/aircraftMaintenanceProgram/taskType/AddTaskType";
import TaskTypes from "./components/planning/aircraftMaintenanceProgram/taskType/TaskTypes";
import AMLAddV2 from "./components/planning/aml/MaintenaceLog/AMLAddV2";
import CheckIndexAdd from "./components/planning/checkIndex/CheckIndexAdd";
import Checks from "./components/planning/checks";
import ChecksAdd from "./components/planning/checks/ChecksAdd";
import MWOAdd from "./components/planning/maintenanceWorkOrder/MWOAdd";
import MWOList from "./components/planning/maintenanceWorkOrder/MWOList";
import MWOReport from "./components/planning/maintenanceWorkOrder/MWOReport";
import AircraftComponentHistoryCard from "./components/planning/report/AircraftComponentHistoryCard";
import AircraftHardTimeComponentStatus from "./components/planning/report/AircraftHardTimeComponentStatus";
import AircraftMELAndCDLStatus from "./components/planning/report/AircraftMELAndCDLStatus";
import AircraftOnConditionComponentStatus from "./components/planning/report/AircraftOnConditionComponentStatus";
import AirframeAndApplianceADStatus from "./components/planning/report/AirframeAndApplianceADStatus";
import AMPStatus from "./components/planning/report/AMPStatus";
import EngineADStatus from "./components/planning/report/EngineADStatus";
import EngineLLPsStatus from "./components/planning/report/EngineLLPsStatus";
import NRCControlListView from "./components/planning/report/NRCControlList";
import OilUpliftReport from "./components/planning/report/OilUpliftReport/OilUpliftReport";
import PropellerStatus from "./components/planning/report/PropellerStatus";
import RemovalApuLLP from "./components/planning/report/RemovalApuLLpStatus";
import RemovalEngineLLP from "./components/planning/report/RemovalEngineLLP";
import ServiceBulletinList from "./components/planning/report/ServiceBulletinList";
import STCAndMODStatus from "./components/planning/report/STCAndMODStatus";
import WorkPackageCertificationReport from "./components/planning/report/WorkPackageCertificationRecord";
import WorkPackageSummary from "./components/planning/report/WorkPackageSummary";
import WorkScopeApproval from "./components/planning/report/WorkScopeApproval";
import ApprovedRfq from "./components/procurment/approvedRfq/ApprovedRfq";
import ComparativeStatement from "./components/procurment/ComparativeStatement/ComparativeStatement";
import PendingComparativeStatement from "./components/procurment/ComparativeStatement/PendingComparativeStatement";
import PendingRfq from "./components/procurment/pendingRfq/PendingRfq";
import Quotation from "./components/procurment/quotation/Quotation";
import QuotationList from "./components/procurment/quotation/QuotationList";
import ShipmentProvider from "./components/procurment/shipmentProvider/ShipmentProvider";
import Quality from "./components/quality/Quality";
import ApprovedPartReturn from "./components/store/approvePartReturn/ApprovedPartReturn";
import ApproveIssueDemandList from "./components/store/issueDemand/ApproveIssueDemandList";
import PendingIssues from "./components/store/issueDemand/PendingIssues";
import PendingPartReturnList from "./components/store/pendingPartReturn/PendingPartReturnList";
import AddRoom from "./components/store/room/AddRoom";

import ApprovedRequisitionList from "./components/store/requisition/ApprovedRequisitionList";
import PendingRequisitionList from "./components/store/requisition/PendingRequisitionList";
import StoreInspection from "./components/storeInspector/storeInspection/StoreInspection";
import StoreInspectionPrint from "./components/storeInspector/storeInspection/StoreInspectionPrint";
import StoreInspectorDash from "./components/storeInspector/StoreInspector";

import Audit from "./components/audit/Audit";
import MaintenanceDefectRegister from "./components/planning/report/DefectRegister";
import ApprovedRfqDetails from "./components/procurment/approvedRfq/ApprovedRfqDetails";
import ApprovedSupplierQuality from "./components/quality/supplierWorkFlow/ApprovedSupplierQuality";
import PendingSupplierQuality from "./components/quality/supplierWorkFlow/PendingSupplierQuality";
import PendingDemandDetails from "./components/store/pendingDemand/PendingDemandDetails";
import ApprovedInspectionChecklist from "./components/storeInspector/inspectionChecklist/ApprovedInspectionChecklist";
import InspectionChecklist from "./components/storeInspector/inspectionChecklist/InspectionChecklist";
import PendingInspectionChecklist from "./components/storeInspector/inspectionChecklist/PendingInspectionChecklist";
import StoreInspectionList from "./components/storeInspector/storeInspection/StoreInspectionList";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../src/reducers/user.reducers";
import ApprovedAuditCS from "./components/audit/CSWorkflow/ApprovedAuditCS";
import AuditDisposal from "./components/audit/CSWorkflow/AuditDisposal";
import PendingAuditCS from "./components/audit/CSWorkflow/PendingAuditCS";
import Logistic from "./components/logistic/Logistic";
import ShipmentProviderQuotation from "./components/logistic/shipmentProviderQuotation/ShipmentProviderQuotation";
import ShipmentProviderQuotationList from "./components/logistic/shipmentProviderQuotation/ShipmentProviderQuotationList";
import ApprovedShipmentProviderRfq from "./components/logistic/shipmentProviderRfq/ApprovedShipmentProviderRfq";
import PendingShipmentProviderRfq from "./components/logistic/shipmentProviderRfq/PendingShipmentProviderRfq";
import ShipmentProviderRfq from "./components/logistic/shipmentProviderRfq/ShipmentProviderRfq";
import AddSerialNo from "./components/planning/aircraft/serialNo/AddSerialNo";
import SerialNoList from "./components/planning/aircraft/serialNo/SerialNoList";
import ForecastDetails from "./components/planning/aircraftMaintenanceProgram/taskForecast/ForecastDetails";
import EngineTimes from "./components/planning/engineTimes/EngineTimes";
import EngineTimesList from "./components/planning/engineTimes/EngineTimesList";
import EngineTimesView from "./components/planning/engineTimes/EngineTimesView";
import AddNonRoutineCard from "./components/planning/nonRoutineCard/AddNonRoutineCard";
import NonRoutineCardDetails from "./components/planning/nonRoutineCard/NonRoutineCardDetails";
import NonRoutineCardList from "./components/planning/nonRoutineCard/NonRoutineCardList";
import ManHoursTable from "./components/planning/report/ManHours/ManHoursTable";
import NRCControlAdd from "./components/planning/report/NRCControlList/NRCControlAdd";
import NRCControlList from "./components/planning/report/NRCControlList/NRCControlList";
import AddWorkPackageCertificationRecord from "./components/planning/report/WorkPackageCertificationRecord/AddWorkPackageCertificationRecord";
import WorkPackageCertificationRecordList from "./components/planning/report/WorkPackageCertificationRecord/WorkPackageCertificationRecordList";
import AddWorkPackageSummary from "./components/planning/report/WorkPackageSummary/AddWorkPackageSummary";
import WorkPackageSummaryList from "./components/planning/report/WorkPackageSummary/WorkPackageSummaryList";
import CSDetails from "./components/procurment/ComparativeStatement/CSDetails";
import FinalApprovedCS from "./components/procurment/ComparativeStatement/FinalApprovedCS";
import ApprovedPO from "./components/procurment/po/ApprovedPO";
import DetailPO from "./components/procurment/po/DetailPO";
import PendingPO from "./components/procurment/po/PendingPO";
import PurchaseOrderReportList from "./components/procurment/poReport/PurchaseOrderReportList";
import PurchaseOrderReportPrint from "./components/procurment/poReport/PurchaseOrderReportPrint";
import ApproveDemandDetailsPrint from "./components/store/approveDemand/ApproveDemandDetailsPrint";
import ApproveIssueDemandDetails from "./components/store/issueDemand/ApproveIssueDemandDetails";
import ApproveIssueDemandDetailsPrint from "./components/store/issueDemand/ApproveIssueDemandDetailsPrint";
import PendingIssueDetails from './components/store/issueDemand/PendingIssueDetails';
import PendingRequisitionDetails from "./components/store/requisition/PendingRequisitionDetails";
import RequisitionDetails from "./components/store/requisition/RequisitionDetails";
import ApprovedRequisitionPrint from "./components/store/requisition/RequisitionPrint";
import StoreSerial from "./components/store/storeSerial/StoreSerial";
import StoreSerialList from "./components/store/storeSerial/StoreSerialList";
import AuthorizationPrint from "./components/store/unserviceableItem/AuthorizationPrint";
import ApprovedWorkOrder from "./components/store/workOrder/ApprovedWorkOrder";
import PendingworkOrder from "./components/store/workOrder/PendingworkOrder";
import WorkOrder from "./components/store/workOrder/WorkOrder";
import API from "./service/Api";

import PurchaseInvoice from "./components/procurment/purchaseInvoice/PurchaseInvoice";
import PurchaseInvoicePrint from "./components/procurment/purchaseInvoice/PurchasePrint";

import LogisticApprovedAuditCS from "./components/audit/LogisticCSWorkflow/LogisticApprovedAuditCS";
import LogisticAuditDisposal from "./components/audit/LogisticCSWorkflow/LogisticAuditDisposal";
import LogisticPendingAuditCS from "./components/audit/LogisticCSWorkflow/LogisticPendingAuditCS";
import permissions from "./components/auth/permissions";
import ManufacturerDetails from "./components/configaration/manufacturerWorkflow/ManufacturerDetails";
import FeatureRole from "./components/configaration/roles/FeatureRole";
import DepartmentAdd from "./components/employees/Department/DepartmentAdd";
import DepartmentDetails from "./components/employees/Department/DepartmentDetails";
import DesignationAdd from "./components/employees/Designations/DesignationAdd";
import DesignationDetails from "./components/employees/Designations/DesignationDetails";
import EmployeeAdd from "./components/employees/Employees/EmployeeAdd";
import EmployeeDetails from "./components/employees/Employees/EmployeeDetails";
import SectionAdd from "./components/employees/Section/SectionAdd";
import SectionDetails from "./components/employees/Section/SectionDetails";
import StockInwardDetails from "./components/frs/stockInward/StockInwardDetails";
import LogisticCS from "./components/logistic/cs/LogisticCS";
import LogisticCSDetails from "./components/logistic/cs/LogisticCSDetails";
import LogisticFinalApprovedCS from "./components/logistic/cs/LogisticFinalApprovedCS";
import LogisticPendingCS from "./components/logistic/cs/LogisticPendingCS";
import LogisticApprovedInvoice from "./components/logistic/pi/LogisticApprovedInvoice";
import LogisticPendingInvoice from "./components/logistic/pi/LogisticPendingInvoice";
import LogisticPurchaseInvoice from "./components/logistic/pi/LogisticPurchaseInvoice";
import LogisticPurchaseInvoicePrint from "./components/logistic/pi/LogisticPurchaseInvoicePrint";
import LogisticApprovedPO from "./components/logistic/po/LogisticApprovedPO";
import LogisticDetailPO from "./components/logistic/po/LogisticDetailPO";
import LogisticEditPO from "./components/logistic/po/LogisticEditPO";
import LogisticPendingPO from "./components/logistic/po/LogisticPendingPO";
import LogisticPO from "./components/logistic/po/LogisticPo";
import LogisticPoList from "./components/logistic/po/LogisticPoList";
import ShipmentProviderQuotationDetails from "./components/logistic/shipmentProviderQuotation/ShipmentProviderQuotationDetails";
import ApprovedLogisticRFQDetails from "./components/logistic/shipmentProviderRfq/ApprovedLogisticRFQDetails";
import PendingLogisticRFQDetails from "./components/logistic/shipmentProviderRfq/PendingLogisticRFQDetails";
import Tracker from "./components/logistic/Tracker/Tracker";
import TrackerDetails from "./components/logistic/Tracker/TrackerDetails";
import TrackerList from "./components/logistic/Tracker/TrackerList";
import AcCheckDoneList from "./components/planning/acCheckDone/AcCheckDoneList";
import AddAcCheckDone from "./components/planning/acCheckDone/AddAcCheckDone";
import PlanningDashboard from "./components/planning/dashboard/PlanningDashboard";
import FilesByFolderId from "./components/planning/fileUplaod/dynamicFolders/FilesByFolderId";
import FoldersByType from "./components/planning/fileUplaod/dynamicFolders/FoldersByType";
import AddLastShopListInfo from "./components/planning/lastShopListInfo/AddLastShopListInfo";
import LastShopInfoDetails from "./components/planning/lastShopListInfo/LastShopInfoDetails";
import LastShopInfoList from "./components/planning/lastShopListInfo/LastShopInfoList";
import APULlp from "./components/planning/report/APULlp";
import DailyUtilizationRecord from "./components/planning/report/DailyUtilizationReport";
import MainLandingGearStatus from "./components/planning/report/MainLandingGearStatus";
import NoseLandingGearStatus from "./components/planning/report/NoseLandingGearStatus";
import PendingRFQDetails from "./components/procurment/pendingRfq/PendingRFQDetails";
import POPrintDetails from "./components/procurment/po/POPrintDetails";
import ApprovedInvoice from "./components/procurment/purchaseInvoice/ApprovedInvoice";
import PendingInvoice from "./components/procurment/purchaseInvoice/PendingInvoice";
import QuotationDetails from "./components/procurment/quotation/QuotationDetails";
import ApprovedShipmentProvider from "./components/procurment/shipmentProvider/ApprovedShipmentProvider";
import PendingShipmentProvider from "./components/procurment/shipmentProvider/PendingShipmentProvider";
import ApprovedSupplier from "./components/procurment/supplier/ApprovedSupplier";
import PendingSupplier from "./components/procurment/supplier/PendingSupplier";
import ApprovedInspectionCheckListQuality from "./components/quality/inspectionCheckList/ApprovedInspectionCheckListQuality";
import PendingInspectionCheckListQuality from "./components/quality/inspectionCheckList/PendingInspectionCheckListQuality";
import QualityInspectionChecklist from "./components/quality/inspectionCheckList/QualityInspectionChecklist";
import ApprovedManufacturerQuality from "./components/quality/manufacturerWorkflow/ApprovedManufacturerQuality";
import PendingManufacturerQuality from "./components/quality/manufacturerWorkflow/PendingManufacturerQuality";
import QualityManufacturerEdit from "./components/quality/manufacturerWorkflow/QualityManufacturerEdit";
import QualityShipmentProvider from "./components/quality/shipmentProvider/QualityShipmentProvider";
import QualitySupplierEdit from "./components/quality/supplierWorkFlow/QualitySupplierEdit";
import Loading from "./components/store/common/Loading";
import ApprovedPartReturnsDetails from "./components/store/pendingPartReturn/ApprovedPartReturnsDetails";
import PendingPartReturnDetails from "./components/store/pendingPartReturn/PendingPartReturnDetails";
import UnserviceableItemPrint from "./components/store/pendingPartReturn/UnserviceableItemPrint";
import ApprovedScrapParts from "./components/store/scrapParts/ApprovedScrapParts";
import PendingScrapParts from "./components/store/scrapParts/PendingScrapParts";
import ScrapPartsView from "./components/store/scrapParts/ScrapPartsView";
import ApprovedWorkOrderDetails from "./components/store/workOrder/ApprovedWorkOrderDetails";
import PendingWorkOrderDetails from "./components/store/workOrder/PendingWorkOrderDetails";
import AddDefect from "./components/techRecord/defect/AddDefect";
import AddMultipleDefect from "./components/techRecord/defect/AddMultipleDefect";
import DefectDetails from "./components/techRecord/defect/DefectDetails";
import DefectList from "./components/techRecord/defect/DefectList";
import AddCancellation from "./components/techRecord/dispatch/cancellation/AddCancellation";
import Cancellation from "./components/techRecord/dispatch/cancellation/Cancellation";
import DispatchStatistics from "./components/techRecord/dispatch/DispatchStatistics";
import AddInterruption from "./components/techRecord/dispatch/interruption/AddInterruption";
import Interruption from "./components/techRecord/dispatch/interruption/Interruption";
import InterruptionDetails from "./components/techRecord/dispatch/interruption/InterruptionDetails";
import InterruptionReport from "./components/techRecord/dispatch/InterruptionReport";
import AddIncident from "./components/techRecord/incident/AddIncident";
import Incident from "./components/techRecord/incident/Incident";
import IncidentDetails from "./components/techRecord/incident/IncidentDetails";
import FleetUtilization from "./components/techRecord/reliablityReport/FleetUtilization";
import IncidentStatistics from "./components/techRecord/reliablityReport/IncidentStatistics";
import OperationalStatistics from "./components/techRecord/reliablityReport/OperationalStatistics";
import ServiceUtilization from "./components/techRecord/reliablityReport/ServiceUtilization";
import AddSystem from "./components/techRecord/system/AddSystem";
import Systems from "./components/techRecord/system/Systems";
import TechNonTechIncident from "./components/techRecord/technicalNonTechnicalIncident/TechNonTechIncident";
import TechRecord from "./components/techRecord/TechRecord";

import ApprovedAuditLogisticPi from "./components/audit/logisticPi/ApprovedAuditLogisticPi";
import PendingAuditLogisticPi from "./components/audit/logisticPi/PendingAuditLogisticPi";
import ApprovedAuditProcurementPi from "./components/audit/procurementPi/ApprovedAuditProcurementPi";
import PendingAuditProcurementPi from "./components/audit/procurementPi/PendingAuditProcurementPi";
import Finance from "./components/finance/Finance";
import ApprovedFinanceLogisticPiList from "./components/finance/logistictPi/ApprovedFinanceLogisticPiList";
import PendingFinanceLogisticPi from "./components/finance/logistictPi/PendingFinanceLogisticPi";
import ApprovedFinanceProcurementPiList from "./components/finance/procurementPi/ApprovedFinanceProcurementPiList";
import PendingFinanceProcurementPIList from "./components/finance/procurementPi/PendingFinanceProcurementPIList";
import LogisticCSEdit from "./components/logistic/cs/LogisticCSEdit";
import LogisticPoPrintDetails from "./components/logistic/po/LogisticPoPrintDetails";
import EditCS from "./components/procurment/ComparativeStatement/EditCS";
import PIDetails from "./components/store/common/PIDetails";
import StoreDashBoard from "./components/store/dashboard/StoreDashBoard";
import ServiceableItemPrint from "./components/store/unserviceableItem/ServiceableItemPrint";
import StoreInspectionDetails from "./components/storeInspector/storeInspection/storeInspectionDetails";
import AlertLevel from "./components/techRecord/alertLevel/AlertLevel";
import AlertLevelReport from "./components/techRecord/alertLevel/AlertLevelReport";
import CrrReport from "./components/techRecord/crrReport/CrrReport";
import AddEngine from "./components/techRecord/engine/AddEngine";
import EngineIncidentReport from "./components/techRecord/engine/EngineIncidentReport";
import Engines from "./components/techRecord/engine/Engines";
import SystemReliablityReport from "./components/techRecord/systemReliablity/SystemReliablityReport";
import TopMostAtaReport from "./components/techRecord/topMostAta/TopMostAtaReport";

import MonthlyUtilizationRecord from "./components/planning/report/DailyUtilizationReport/MonthlyUtilization";
import YearlyUtilizationRecord from "./components/planning/report/DailyUtilizationReport/YearlyUtilization";
import NlgRemovedStatus from "./components/planning/report/NLgRemovedReport/NlgRemovedStatus";
import RemovedMLGReport from "./components/planning/report/removedMlgReport/RemovedMLGReport";
import TaskStatusReport from "./components/planning/report/TaskStatus/TaskStatusReport";
import AddRevision from "./components/planning/revision/AddRevision";
import RevisionList from "./components/planning/revision/RevisionList";
import UnserviceableReport from "./components/store/UnserviceableReport/UnserviceableReport";
import TechnicalService from "./components/technicalService/TechnicalService";
import GrnList from "./components/storeInspector/grn/GrnList";
import Grn from "./components/storeInspector/grn/Grn";
import GrnDetails from "./components/storeInspector/grn/GrnDetails";
import DutyFeesList from "./components/logistic/dutyFees/DutyFeesList";
import DutyFees from "./components/logistic/dutyFees/DutyFees";
import DutyFeesDetails from "./components/logistic/dutyFees/DutyFeesDetails";

const HTTP_UNAUTHORIZED = 401
const NOT_FOUND = 404


function App() {

  const [collapsed, setCollapsed] = useState(true)
  const [verifying, setVerifying] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {isLoggedIn} = useSelector(state => state.user)
  const [toggleState, setToggleState] = useState(2);
  const [storeTab, setStoreTab] = useState(1);

   const toggleTab = (index) => {
    setToggleState(index);
  };

  const contextValue = { collapsed, setCollapsed, logo }

  useEffect(() => {
    const responseInterceptor = API.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        if (error.response.status === HTTP_UNAUTHORIZED) {
          localStorage.clear();
          dispatch(setUser(""));
          navigate("/login");
          return
        }
        return Promise.reject(error);
      }
    );
    return () => {
      API.interceptors.response.eject(responseInterceptor);
    };
  }, []);

   useEffect(() => {
       if(!isLoggedIn) return

       (async () => {
         try {
           setVerifying(true)
         } catch (error) {
             const {status} = error.response
             console.log({status});
             if (status === HTTP_UNAUTHORIZED || status === NOT_FOUND) {
                 localStorage.clear()
                 dispatch(setUser(""))
                 navigate("/login")
                 return
             }
         } finally {
           setVerifying(false)
         }
       })()

   },[])

   if(verifying){
     return <Loading />
   }

  return (
    <AppProvider value={contextValue}>
      <Routes>
        <Route path="" element={<ProtectRoute> <Dashboard /> </ProtectRoute>} exact />
        <Route path="login" element={<Login />} exact />

        {/* store */}
        <Route path="store" element={<ProtectRoute featureId={permissions.modules.STORE}><StoreDashBoard storeTab={storeTab} setStoreTab={setStoreTab}/></ProtectRoute>} exact />
        <Route path="store/technical-store" element={<ProtectRoute featureId={permissions.subModuleItems.TECHNICAL_STORE}><Office /></ProtectRoute>} exact />
        <Route path="store/technical-store/add" element={<ProtectRoute featureId={permissions.subModuleItems.TECHNICAL_STORE}><OfficeAdd /></ProtectRoute>} exact />
        <Route path="store/technical-store/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.TECHNICAL_STORE}><OfficeAdd /></ProtectRoute>} exact />
        <Route path="store/room/add" element={<ProtectRoute featureId={permissions.subModuleItems.ROOM}><AddRoom/></ProtectRoute>} exact />
        <Route path="store/room/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.ROOM}><AddRoom /></ProtectRoute>} exact />
        <Route path="store/room" element={<ProtectRoute featureId={permissions.subModuleItems.ROOM}><RoomList /></ProtectRoute>} exact />
        <Route path="store/rack" element={<ProtectRoute featureId={permissions.subModuleItems.RACK}><RackList /></ProtectRoute>} exact />
        <Route path="store/rack/add" element={<ProtectRoute featureId={permissions.subModuleItems.RACK}><RackView /></ProtectRoute>} exact />
        <Route path="store/rack/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.RACK}><RackView /></ProtectRoute>} exact />
        <Route path="material-management/supplier/add" element={<ProtectRoute featureId={permissions.subModuleItems.MATERIAL_MANAGEMENT_SUPPLIER}><SupplierAdd /></ProtectRoute>} exact />
        <Route path="material-management/supplier/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.MATERIAL_MANAGEMENT_SUPPLIER}><SupplierAdd /></ProtectRoute>} exact />
        <Route path="material-management/pending-supplier" element={ <ProtectRoute featureId={permissions.subModuleItems.MATERIAL_MANAGEMENT_SUPPLIER_PENDING_LIST}> <PendingSupplier /> </ProtectRoute> } exact />
        <Route path="material-management/approved-supplier" element={ <ProtectRoute featureId={permissions.subModuleItems.MATERIAL_MANAGEMENT_SUPPLIER_APPROVED_LIST}><ApprovedSupplier/> </ProtectRoute> } exact />

        <Route path="configurations/unit-of-measurement" element={<ProtectRoute featureId={permissions.subModuleItems.UNIT_OF_MEASUREMENT}><UnitofMeasurementList /></ProtectRoute>} exact />
        <Route path="configurations/add-unit-of-measurement" element={<ProtectRoute featureId={permissions.subModuleItems.UNIT_OF_MEASUREMENT}><UnitofMeasurement /></ProtectRoute>} exact />
        <Route path="configurations/edit-unit-of-measurement/:id" element={<ProtectRoute featureId={permissions.subModuleItems.UNIT_OF_MEASUREMENT}><UnitofMeasurement /></ProtectRoute>} exact />
        <Route path="store/item-demand" element={<ProtectRoute featureId={permissions.subModuleItems.STORE_DEMAND}><StoreDemand /></ProtectRoute>} exact />
        <Route path="store/item-demand/:storeDemandId" element={<ProtectRoute featureId={permissions.subModuleItems.STORE_DEMAND}><StoreDemand /></ProtectRoute>} exact />
        <Route path="store/rack-row" element={<ProtectRoute featureId={permissions.subModuleItems.RACK_ROW}><RackRowList/></ProtectRoute>} exact />
        <Route path="store/rack-row/add" element={<ProtectRoute featureId={permissions.subModuleItems.RACK_ROW}><RackRowView/></ProtectRoute>} exact />
        <Route path="store/rack-row/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.RACK_ROW}><RackRowView/></ProtectRoute>} exact />
        <Route path="store/rack-row-bin" element={<ProtectRoute featureId={permissions.subModuleItems.RACK_ROW_BIN}><RackRowBinList/></ProtectRoute>} exact />
        <Route path="store/rack-row-bin/add" element={<ProtectRoute featureId={permissions.subModuleItems.RACK_ROW_BIN}><RackRowBinView/></ProtectRoute>} exact />
        <Route path="store/rack-row-bin/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.RACK_ROW_BIN}><RackRowBinView/></ProtectRoute>} exact />
        <Route path="store/workshop" element={<ProtectRoute featureId={permissions.DEFAULT}><WorkshopList/></ProtectRoute>} exact />
        <Route path="store/workshop/add" element={<ProtectRoute featureId={permissions.DEFAULT}><Workshop/></ProtectRoute>} exact />
        <Route path="store/workshop/edit/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><Workshop/></ProtectRoute>} exact />
        <Route path="store/pending-demand" element={<ProtectRoute featureId={permissions.subModuleItems.PENDING_DEMAND}><PendingDemandList/></ProtectRoute>} exact />
        <Route path="store/pending-demand/details/:id" element={<ProtectRoute featureId={permissions.subModuleItems.PENDING_DEMAND}><PendingDemandDetails/></ProtectRoute>} exact />
        <Route path="store/issue-demand" element={<ProtectRoute featureId={permissions.subModuleItems.ISSUE_DEMAND}><IssueDemand/></ProtectRoute>} exact />
        <Route path="store/issue-demand/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.ISSUE_DEMAND}><IssueDemand/></ProtectRoute>} exact />
        <Route path="store/pending-issues" element={<ProtectRoute featureId={permissions.subModuleItems.PENDING_ISSUES}><PendingIssues/></ProtectRoute>} exact />
        <Route path="store/approve-issues" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_ISSUES}><ApproveIssueDemandList/></ProtectRoute>} exact />
        <Route path="store/pending-issues/details/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><PendingIssueDetails/></ProtectRoute>} exact />
        <Route path="store/approve-issues/details/:id" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_ISSUES}><ApproveIssueDemandDetails/></ProtectRoute>} exact />
        <Route path="store/approve-issues/details/print/:id" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_ISSUES}><ApproveIssueDemandDetailsPrint/></ProtectRoute>} exact />

        {/* parts Return  */}
        <Route path="store/parts-return" element={<ProtectRoute featureId={permissions.subModuleItems.PARTS_RETURN}><PartsReturn/></ProtectRoute>} exact />
        <Route path="store/edit-parts-return/:id" element={<ProtectRoute featureId={permissions.subModuleItems.PARTS_RETURN}><PartsReturn/></ProtectRoute>} exact />
        <Route path="store/approved-parts-return" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_PARTS_RETURN}><ApprovedPartReturn/></ProtectRoute>} exact />

        <Route path="store/pending-parts-return" element={<ProtectRoute featureId={permissions.subModuleItems.PENDING_PARTS_RETURN}><PendingPartReturnList/></ProtectRoute>} exact />
        <Route path="store/pending-parts-return/details/:id" element={<ProtectRoute featureId={permissions.subModuleItems.PENDING_PARTS_RETURN}><PendingPartReturnDetails/></ProtectRoute>} exact />
        <Route path="store/approved-parts-return/details/:id" element={<ProtectRoute featureId={permissions.subModuleItems.PENDING_PARTS_RETURN}><ApprovedPartReturnsDetails/></ProtectRoute>} exact />
        <Route path="store/approved-parts-return/details/approve-parts-return-print/:id" element={<ProtectRoute featureId={permissions.subModuleItems.PENDING_PARTS_RETURN}><PartsReturnDetailsPrint/></ProtectRoute>} exact />
        <Route path="store/unserviceable-item-print" element={<ProtectRoute featureId={permissions.subModuleItems.UNSERVICEABLE_ITEM}><UnserviceableItemPrint/></ProtectRoute>} exact />
        <Route path="store/serviceable-item-print/:id" element={<ProtectRoute featureId={permissions.subModuleItems.UNSERVICEABLE_ITEM}><ServiceableItemPrint/></ProtectRoute>} exact />
        <Route path="store/store-serial-list" element={<ProtectRoute featureId={permissions.DEFAULT}><StoreSerialList/></ProtectRoute>} exact />
        <Route path="store/store-serial" element={<ProtectRoute featureId={permissions.DEFAULT}><StoreSerial/></ProtectRoute>} exact />
        <Route path="store/edit-store-serial/:id" element={<ProtectRoute featureId={permissions.subModuleItems.DEFAULT}><StoreSerial/></ProtectRoute>} exact />
        <Route path="store/material-management/requisition" element={<ProtectRoute featureId={permissions.subModuleItems.MATERIAL_MANAGEMENT_REQUISITION}><ProcurementRequisition/></ProtectRoute>} exact />
        <Route path="store/material-management/requisition/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.MATERIAL_MANAGEMENT_REQUISITION}><ProcurementRequisition/></ProtectRoute>} exact />
        <Route path="store/material-management/requisition/pending" element={<ProtectRoute featureId={permissions.subModuleItems.PENDING_MATERIAL_MANAGEMENT_REQUISITION}><PendingRequisitionList/></ProtectRoute>} exact />
        <Route path="store/material-management/requisition/approved" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_MATERIAL_MANAGEMENT_REQUISITION}><ApprovedRequisitionList/></ProtectRoute>} exact />
        <Route path="store/material-management/requisition/approved/details/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><RequisitionDetails/></ProtectRoute>} exact />
        <Route path="store/material-management/requisition/approved/details/print/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><ApprovedRequisitionPrint/></ProtectRoute>} exact />
        <Route path="store/material-management/requisition/pending/details/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><PendingRequisitionDetails/></ProtectRoute>} exact />
        <Route path="/store/material-management/requisition/approved/details/print/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><ApprovedRequisitionPrint/></ProtectRoute>} exact />


        {/* Israfil */}
        <Route path="store/authorized-print" element={<ProtectRoute><AuthorizationPrint/></ProtectRoute>} exact />
        {/* Israfil  */}

        <Route path="store/parts-availability" element={<ProtectRoute featureId={permissions.subModuleItems.PARTS_AVAILABILITY}><PartsAvailabilityList/></ProtectRoute>} exact />
        <Route path="store/unserviceable-report-print" element={<ProtectRoute featureId={permissions.subModuleItems.PARTS_AVAILABILITY}><UnserviceableReport/></ProtectRoute>} exact />
        <Route path="store/pending-scrap-parts" element={<ProtectRoute featureId={permissions.subModuleItems.PENDING_SCRAP_PARTS}><PendingScrapParts/></ProtectRoute>}/>
        <Route path="store/approved-scrap-parts" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_SCRAP_PARTS}><ApprovedScrapParts/></ProtectRoute>}/>
        <Route path="store/add-scrap-parts" element={<ProtectRoute featureId={permissions.subModuleItems.SCRAP_PARTS}><ScrapParts/></ProtectRoute>}/>
        <Route path="store/edit-scrap-parts/:id" element={<ProtectRoute featureId={permissions.subModuleItems.SCRAP_PARTS}><ScrapParts/></ProtectRoute>}/>
       {/* route */}
       <Route
          path="store/pending-scrap-parts/view/:id"
          element={
            <ProtectRoute featureId={permissions.subModuleItems.SCRAP_PARTS}>
              <ScrapPartsView isPending={true} />
            </ProtectRoute>
          }
        />
        <Route
          path="store/approved-scrap-parts/view/:id"
          element={
            <ProtectRoute featureId={permissions.subModuleItems.SCRAP_PARTS}>
              <ScrapPartsView isPending={false} />
            </ProtectRoute>
          }
        />
        <Route path="store/add-scrap-parts/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.SCRAP_PARTS}><ScrapPartsView/></ProtectRoute>}/>
        <Route path="store/store-parts" element={<ProtectRoute featureId={permissions.subModuleItems.STORE_PARTS}><StoreParts/></ProtectRoute>}/>
        <Route path="store/store-parts/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.STORE_PARTS}><StoreParts/></ProtectRoute>}/>
        <Route path="store/pending-demand" element={<ProtectRoute featureId={permissions.subModuleItems.PENDING_DEMAND}><PendingDemandList/></ProtectRoute>} exact />
        <Route path="store/approve-demand" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_DEMAND}><ApproveDemandList/></ProtectRoute>} exact />
        <Route path="store/approve-demand/details/:id" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_DEMAND}><ApproveDemandDetails/></ProtectRoute>} exact />
        <Route path="store/approve-demand/details/print/:id" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_DEMAND}><ApproveDemandDetailsPrint/></ProtectRoute>} exact />

        <Route path="store/work-order" element={<ProtectRoute featureId={permissions.DEFAULT}><WorkOrder/></ProtectRoute>} exact />
        <Route path="store/pending-work-order" element={<ProtectRoute featureId={permissions.DEFAULT}><PendingworkOrder/></ProtectRoute>} exact />
        <Route path="store/pending-work-order/details/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><PendingWorkOrderDetails/></ProtectRoute>} exact />
        <Route path="store/approved-work-order" element={<ProtectRoute featureId={permissions.DEFAULT}><ApprovedWorkOrder/></ProtectRoute>} exact />
        <Route path="store/approved-work-order/details/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><ApprovedWorkOrderDetails/></ProtectRoute>} exact />
        <Route path="store/edit-work-order/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><WorkOrder/></ProtectRoute>} exact />

          {/* procurment */}
          <Route path="material-management" element={ <ProtectRoute featureId={permissions.modules.MATERIAL_MANAGEMENT}> <Procurment/> </ProtectRoute> } exact />
          <Route path="material-management/add-request-for-quotation" element={<ProtectRoute featureId={permissions.subModuleItems.REQUEST_FOR_QUOTATION_RFQ}><RequestforQuotation/></ProtectRoute>} exact />
          <Route path="material-management/edit-request-for-quotation/:id" element={<ProtectRoute featureId={permissions.subModuleItems.REQUEST_FOR_QUOTATION_RFQ}><RequestforQuotation/></ProtectRoute>} exact />
          <Route path="material-management/pending-rfq" element={<ProtectRoute featureId={permissions.subModuleItems.PENDING_RFQ}><PendingRfq/></ProtectRoute>} exact />
          <Route path="material-management/approved-rfq" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_RFQ}><ApprovedRfq/></ProtectRoute>} exact />
          <Route path="material-management/request-for-quotation-details/:id" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_RFQ}><ApprovedRfqDetails/></ProtectRoute>} exact />
          <Route path="material-management/request-for-quotation-pending-details/:id" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_RFQ}><PendingRFQDetails/></ProtectRoute>} exact />
          <Route path="material-management/purchase-order" element={<ProtectRoute featureId={permissions.subModuleItems.PURCHASE_ORDER}><PoList /></ProtectRoute>} exact/>
          <Route path="material-management/purchase-order-report-list" element={<ProtectRoute featureId={permissions.subModuleItems.PURCHASE_ORDER}><PurchaseOrderReportList/></ProtectRoute>} exact/>
          <Route path="material-management/purchase-order-report" element={<ProtectRoute featureId={permissions.subModuleItems.PURCHASE_ORDER}><PurchaseOrderReport/></ProtectRoute>} exact/>
          <Route path="material-management/purchase-order-report-print" element={<ProtectRoute featureId={permissions.subModuleItems.PURCHASE_ORDER}><PurchaseOrderReportPrint/></ProtectRoute>} exact/>
          <Route path="material-management/invoice-report" element={<ProtectRoute featureId={permissions.DEFAULT}><Invoice/></ProtectRoute>} exact/>
          <Route path="material-management/pending-purchase-order" element={<ProtectRoute><PendingPO/></ProtectRoute>} exact/>
          <Route path="material-management/approved-purchase-order" element={<ProtectRoute><ApprovedPO/></ProtectRoute>} exact/>
          <Route path="material-management/purchase-order/add" element={<ProtectRoute featureId={permissions.subModuleItems.PURCHASE_ORDER}><Po /></ProtectRoute>} exact/>
          <Route path="material-management/purchase-order/edit/:id" element={<ProtectRoute><Po /></ProtectRoute>} exact/>
          <Route path="material-management/purchase-order/detail/:id" element={<ProtectRoute><DetailPO /></ProtectRoute>} exact/>
          <Route path="material-management/purchase-order/print-detail/:id" element={<ProtectRoute><POPrintDetails /></ProtectRoute>} exact/>

         <Route path="material-management/quotation" element={<ProtectRoute><QuotationList/></ProtectRoute>} exact/>
         <Route exact path="material-management/comparative-statement" element={<ProtectRoute featureId={permissions.subModuleItems.GENERATE_CS}><ComparativeStatement/></ProtectRoute>} />
         <Route exact path="material-management/comparative-statement/:edit" element={<ProtectRoute featureId={permissions.subModuleItems.GENERATE_CS}><ComparativeStatement/></ProtectRoute>} />
         <Route exact path="material-management/pending-comparative-statement/detail/:id"
            element={<CSDetails
              baseUrl="/material-management"
              icon="fa fa-shopping-basket"
              breadcrumbTitle="Material Management"
              title="Pending CS Details"
              breadcrumbListTitle="Pending CS List"
              breadcrumbListUrl="/material-management/pending-comparative-statement"
              cardTitle="Comparative Statement"
              permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_COMPARATIVE_STATEMENT_MATERIAL_MANAGEMENT_FINAL_PENDING_CS_SAVE"
            />}
         />
         <Route exact path="material-management/pending-comparative-statement/edit/:id"
           element={
           <EditCS
              title="Pending CS List"
              cardTitle="PENDING CS DETAILS"
              breadcrumbListUrl="/material-management/pending-comparative-statement"
           />}
          />
         <Route exact path="material-management/approved-comparative-statement/disposal/edit/:id"
          element={
           <EditCS
              isEditDisposal={true}
              title="Approved CS List"
              cardTitle="APPROVED CS DETAILS"
              breadcrumbListUrl="/material-management/approved-comparative-statement"
           />} />
         <Route exact path="material-management/final-approved-comparative-statement/detail/:id"
            element={<CSDetails
              baseUrl="/material-management"
              icon="fa fa-shopping-basket"
              breadcrumbTitle="Material Management"
              title="Approved CS Details"
              breadcrumbListTitle="Approved CS List"
              breadcrumbListUrl="/material-management/final-approved-comparative-statement"
              cardTitle="Comparative Statement"
              permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_COMPARATIVE_STATEMENT_MATERIAL_MANAGEMENT_FINAL_PENDING_CS_SAVE"
            />}
         />
         <Route exact path="material-management/pending-comparative-statement" element={<ProtectRoute featureId={permissions.subModuleItems.PENDING_CS}><PendingComparativeStatement/></ProtectRoute>} />
         <Route exact path="material-management/approved-comparative-statement" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_CS}><FinalApprovedCS/></ProtectRoute>} />
         <Route exact path="material-management/final-approved-comparative-statement" element={<FinalApprovedCS/>} />

        {/* Purchase-Invoice  */}
        <Route path="material-management/purchase-invoice" element={<ProtectRoute><PurchaseInvoice/></ProtectRoute>} exact/>
        <Route path="material-management/purchase-invoice/:id" element={<ProtectRoute><PurchaseInvoice/></ProtectRoute>} exact/>
        <Route path="material-management/purchase-invoice/print" element={<ProtectRoute><PurchaseInvoicePrint/></ProtectRoute>} exact/>

        <Route path="material-management/purchase-invoice/approved" element={<ProtectRoute><ApprovedInvoice/></ProtectRoute>} exact/>
        <Route path="material-management/purchase-invoice/pending" element={<ProtectRoute><PendingInvoice/></ProtectRoute>} exact/>
        <Route path="material-management/purchase-invoice/pending-details/:id"
          element={<ProtectRoute>
            <PIDetails
                csType="material-management"
                baseUrl="/material-management"
                url="/procurement/own_department/parts-invoice"
                icon="fa fa-shopping-basket"
                breadcrumbTitle="Material Management"
                breadcrumbListTitle="Pending Material Management PI List"
                breadcrumbListUrl="/material-management/purchase-invoice/pending"
                cardTitle="Pending Material Management PI Details"
                permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_PARTS_INVOICE_MATERIAL_MANAGEMENT_PARTS_INVOICE_SEARCH"
              />
            </ProtectRoute>}
            exact
          />
          <Route path="material-management/purchase-invoice/approve-details/:id"
             element={<ProtectRoute>
                <PIDetails
                  csType="material-management"
                  baseUrl="/material-management"
                  url="/procurement/own_department/parts-invoice"
                  icon="fa fa-shopping-basket"
                  breadcrumbTitle="Material Management"
                  breadcrumbListTitle="Approved Material Management PI List"
                  breadcrumbListUrl="/material-management/purchase-invoice/approved"
                  cardTitle="Approved Material Management PI Details"
                  permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_PARTS_INVOICE_MATERIAL_MANAGEMENT_PARTS_INVOICE_SEARCH"
                />
            </ProtectRoute>}
            exact
          />
        {/* frs As */}
        <Route path="frs" element={<ProtectRoute featureId={permissions.modules.FRS}><FRS/></ProtectRoute>} exact />
        <Route path="frs/stock-inward" element={<ProtectRoute featureId={permissions.DEFAULT}><StockInward/></ProtectRoute>} exact />
        <Route path="frs/stock-inwards" element={<ProtectRoute featureId={permissions.DEFAULT}><StockInwardList/></ProtectRoute>} exact />
        <Route path="frs/stock-inwards/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><StockInward/></ProtectRoute>} exact />
        <Route path="frs/stock-inwards/details/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><StockInwardDetails/></ProtectRoute>} exact />
        <Route path="frs/goods-receive" element={<ProtectRoute featureId={permissions.DEFAULT}><GoodsReceive/></ProtectRoute>} exact />
        <Route path="frs/goods-receive-list" element={<ProtectRoute featureId={permissions.DEFAULT}><GoodsReceiveList/></ProtectRoute>} exact />

        {/* planning*/}
        <Route path="planning/airports" element={<ProtectRoute featureId={permissions.subModuleItems.AIRPORT}><Airports /></ProtectRoute>} exact />
        <Route path="planning" element={<ProtectRoute ><PlanningDashboard toggleState={toggleState} setToggleState = {setToggleState} toggleTab={toggleTab}/></ProtectRoute>} exact />
        <Route path="planning/:id" element={<ProtectRoute ><PlanningDashboard toggleState={toggleState} setToggleState = {setToggleState} toggleTab={toggleTab} /></ProtectRoute>} exact />
        <Route path="planning/airports/add" element={<ProtectRoute  featureId={permissions.subModuleItems.AIRPORT}><AddAirport /></ProtectRoute>} exact />
        <Route path="planning/airports/view/:id" element={<ProtectRoute  featureId={permissions.subModuleItems.AIRPORT}><AirportDetails /></ProtectRoute>} exact />
        <Route path="planning/airports/edit/:id" element={<ProtectRoute  featureId={permissions.subModuleItems.AIRPORT}><AddAirport /></ProtectRoute>} exact />
        <Route path="planning/aircraft" element={<ProtectRoute featureId={permissions.subModuleItems.AIRCRAFT} ><Aircraft /></ProtectRoute>} exact />
        <Route path="planning/aircraft/add" element={<ProtectRoute featureId={permissions.subModuleItems.AIRCRAFT}><AircraftAdd /></ProtectRoute>} exact />
        <Route path="planning/aircraft/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.AIRCRAFT}><AircraftAdd toggleTab={toggleTab} /></ProtectRoute>} exact />
        <Route path="planning/aircraft/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.AIRCRAFT}><AircraftView /></ProtectRoute>} exact />
        <Route path="planning/signatures" element={<ProtectRoute featureId={permissions.subModuleItems.SIGNATURES}><Signatures /> </ProtectRoute>} exact />
        <Route path="planning/signatures/add" element={<ProtectRoute featureId={permissions.subModuleItems.SIGNATURES}><AddSignatures /></ProtectRoute>} exact />
        <Route path="planning/signatures/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.SIGNATURES}><AddSignatures /></ProtectRoute>} exact />
        <Route path="planning/locations" element={<ProtectRoute featureId={permissions.subModuleItems.LOCATION}><Locations /></ProtectRoute>} exact />
        <Route path="planning/locations/add" element={<ProtectRoute featureId={permissions.subModuleItems.LOCATION}><AddLocations /></ProtectRoute>} exact />
        <Route path="planning/locations/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.LOCATION}><AddLocations /></ProtectRoute>} exact />
        <Route path="planning/positions" element={<ProtectRoute featureId={permissions.subModuleItems.POSITION}><Positions /></ProtectRoute>} exact />
        <Route path="planning/positions/add" element={<ProtectRoute featureId={permissions.subModuleItems.POSITION}><AddPositions /></ProtectRoute>} exact />
        <Route path="planning/positions/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.POSITION}><AddPositions /></ProtectRoute>} exact />
        <Route path="planning/airframe-appliance-ad-status" element={<ProtectRoute featureId={permissions.subModuleItems.AIRFRAME_AND_APPLIANCE_AD_STATUS}><AirframeAndApplianceADStatus /></ProtectRoute>} exact />
        <Route path="planning/aircraft-mel-cdl-status" element={<ProtectRoute featureId={permissions.subModuleItems.AIRCRAFT_MEL_CDL_STATUS}><AircraftMELAndCDLStatus /></ProtectRoute>} exact />
        <Route path="planning/aircraft-component-history-card" element={<ProtectRoute featureId={permissions.subModuleItems.AIRCRAFT_COMPONENT_HISTORY_CARD}><AircraftComponentHistoryCard /></ProtectRoute>} exact />
        <Route path="planning/atl" element={<ProtectRoute featureId={permissions.subModuleItems.ATL}><AMLList /></ProtectRoute>} exact />
        <Route path="planning/atl/add" element={<ProtectRoute featureId={permissions.subModuleItems.ATL}><AMLAddV2 /></ProtectRoute>} exact />
        <Route path="planning/amlv2/add" element={<ProtectRoute featureId={permissions.DEFAULT}><AMLAddV2 /></ProtectRoute>} />
        <Route path="planning/atl/edit/:amlId" element={<ProtectRoute featureId={permissions.subModuleItems.ATL}><AMLAddV2 toggleTab={toggleTab} /></ProtectRoute>} exact />
        <Route path="planning/atl/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.ATL}><AMLView /></ProtectRoute>} exact />
        <Route path="planning/parts" element={<ProtectRoute featureId={permissions.subModuleItems.PARTS}><Parts /></ProtectRoute>} exact />
        <Route path="planning/parts/add" element={<ProtectRoute featureId={permissions.subModuleItems.PARTS}><AddParts /></ProtectRoute>} exact />
        <Route path="planning/parts/edit/:partId" element={<ProtectRoute featureId={permissions.subModuleItems.PARTS}><AddParts /></ProtectRoute>} exact />
        <Route path="planning/parts/view/:partId" element={<ProtectRoute featureId={permissions.subModuleItems.PARTS}><PartsDetails /></ProtectRoute>} exact />
        <Route path="planning/oil-records" element={<ProtectRoute featureId={permissions.DEFAULT}><OilRecords /></ProtectRoute>} exact />
        <Route path="planning/oil-records/add/" element={<ProtectRoute featureId={permissions.DEFAULT}><AddOilRecord /></ProtectRoute>} exact />
        <Route path="planning/oil-records/edit/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><AddOilRecord /></ProtectRoute>} exact />
        <Route path="planning/oil-records/view/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><OilRecordsDetails /></ProtectRoute>} exact />
        <Route path="planning/task-records" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_RECORDS}><TaskRecords /></ProtectRoute>} exact />
        <Route path="planning/task-records/add" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_RECORDS}><AddTaskRecords /></ProtectRoute>} exact />
        <Route path="planning/task-records/edit/:taskId" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_RECORDS}><AddTaskRecords /></ProtectRoute>} exact />
        <Route path="planning/task-records/view/:taskId" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_RECORDS}><TaskRecordDetails /></ProtectRoute>} exact />
        <Route path="planning/task-done-list" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_DONE}><TaskDoneList /></ProtectRoute>} exact />
        <Route path="planning/task-done-list/add" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_DONE}><AddTaskDoneList /></ProtectRoute>} exact />
        <Route path="planning/task-done-list/edit/:taskDoneId" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_DONE}><AddTaskDoneList /></ProtectRoute>} exact />
        <Route path="planning/task-done-list/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_DONE}><TaskDoneDetails /></ProtectRoute>} exact />
        <Route path="planning/task-forecasts" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_FORECASTS}><TaskForeCasts /></ProtectRoute>} exact />
        <Route path="planning/task-forecasts/add" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_FORECASTS}><AddTaskForecasts /></ProtectRoute>} exact />
        <Route path="planning/task-forecasts/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_FORECASTS}><AddTaskForecasts /></ProtectRoute>} exact />
        <Route path="planning/task-forecasts/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_FORECASTS}><ForecastDetails /></ProtectRoute>} exact />
        <Route path="planning/aircraft-tasks/" element={<ProtectRoute featureId={permissions.subModuleItems.AIRCRAFT_TASK}><AircraftTasks /></ProtectRoute>} exact />
        <Route path="planning/atl-books" element={<ProtectRoute featureId={permissions.subModuleItems.ATL_BOOKS}><AmlBooks /></ProtectRoute>} exact />
        <Route path="planning/atl-books/add" element={<ProtectRoute featureId={permissions.subModuleItems.ATL_BOOKS}><AddAmlBooks /></ProtectRoute>} exact />
        <Route path="planning/atl-books/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.ATL_BOOKS}><AddAmlBooks /></ProtectRoute>} exact />
        <Route path="planning/daily-flying-hours-and-cycles" element={<ProtectRoute featureId={permissions.subModuleItems.DAILY_FLYING_HOURS_CYCLES}><DailyFlyingHoursAndCycles /></ProtectRoute>} exact />
        <Route path="planning/oil-uplift-report" element={<ProtectRoute featureId={permissions.subModuleItems.OIL_AND_FUEL_UPLIFT_RECORD}><OilUpliftReport /></ProtectRoute>} exact />
        <Route path="planning/man-hours" element={<ProtectRoute featureId={permissions.subModuleItems.MAN_HOURS}><ManHoursTable /></ProtectRoute>} exact />
        <Route path="planning/stc-and-mod-status" element={<ProtectRoute featureId={permissions.subModuleItems.STC_AND_MOD_STATUS}><STCAndMODStatus /></ProtectRoute>} exact />
        <Route path="planning/work-scope-approval" element={<ProtectRoute featureId={permissions.subModuleItems.WORK_SCOPE_APPROVAL}><WorkScopeApproval /></ProtectRoute>} exact />
        <Route path="planning/aircraft-component-history-card" element={<ProtectRoute featureId={permissions.subModuleItems.AIRCRAFT_COMPONENT_HISTORY_CARD}><AircraftComponentHistoryCard /></ProtectRoute>} exact />
        <Route path="planning/on-condition-component-status" element={<ProtectRoute featureId={permissions.subModuleItems.ON_CONDITION_COMPONENT_LIST}><AircraftOnConditionComponentStatus /></ProtectRoute>} exact />
        <Route path="planning/sectorwise-utilization" element={<ProtectRoute featureId={permissions.subModuleItems.SECTOR_WISE_UTILIZATION}><SectorwiseUtilization /></ProtectRoute>} exact />
        <Route path="planning/service-bulletin-list" element={<ProtectRoute featureId={permissions.subModuleItems.SERVICE_BULLETIN_LIST}><ServiceBulletinList /></ProtectRoute>} exact />
        <Route path="planning/engine-llps-status" element={<ProtectRoute featureId={permissions.subModuleItems.ENGINE_LLP_STATUS}><EngineLLPsStatus /></ProtectRoute>} exact />
        <Route path="planning/daily-utilization-record" element={<ProtectRoute featureId={permissions.subModuleItems.DAILY_UTILIZATION_RECORD} ><DailyUtilizationRecord/></ProtectRoute>} exact />
        <Route path="planning/monthly-utilization-record" element={<ProtectRoute featureId={permissions.subModuleItems.MONTHLY_UTILIZATION_RECORD} ><MonthlyUtilizationRecord/></ProtectRoute>} exact />
        <Route path="planning/yearly-utilization-record" element={<ProtectRoute featureId={permissions.subModuleItems.YEARLY_UTILIZATION_RECORD} ><YearlyUtilizationRecord/></ProtectRoute>} exact />
        <Route path="planning/amp-status" element={<ProtectRoute featureId={permissions.subModuleItems.AMP_STATUS}><AMPStatus toggleTab={toggleTab} /></ProtectRoute>} exact />
        <Route path="planning/engine-ad-status" element={<ProtectRoute featureId={permissions.subModuleItems.ENGINE_AD_STATUS}><EngineADStatus /></ProtectRoute>} exact />
        <Route path="planning/aircraft-hard-time-component-status" element={<ProtectRoute featureId={permissions.subModuleItems.AIRCRAFT_HARD_TIME_COMPONENT_STATUS}><AircraftHardTimeComponentStatus /></ProtectRoute>} exact />
        <Route path="planning/propeller-status" element={<ProtectRoute featureId={permissions.subModuleItems.PROPELLER_STATUS}><PropellerStatus /></ProtectRoute>} exact />
        <Route path="planning/cabins" element={<ProtectRoute featureId={permissions.subModuleItems.CABIN_SEAT_TYPE}> <CabinList /> </ProtectRoute>} exact />
        <Route path="planning/cabin/add" element={<ProtectRoute featureId={permissions.subModuleItems.CABIN_SEAT_TYPE}><Cabin /></ProtectRoute>} exact />
        <Route path="planning/cabin/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.CABIN_SEAT_TYPE}><Cabin /></ProtectRoute>} exact />
        <Route path="planning/seating-configurations/add" element={<ProtectRoute featureId={permissions.subModuleItems.SEATING_CONFIGURATION}><SeatingConfiguration /></ProtectRoute>} exact />
        <Route path="planning/seating-configurations/edit/:sId" element={<ProtectRoute featureId={permissions.subModuleItems.SEATING_CONFIGURATION}><SeatingConfiguration /></ProtectRoute>} exact />
        <Route path="planning/seating-configurations" element={<ProtectRoute featureId={permissions.subModuleItems.SEATING_CONFIGURATION}><SeatingConfigurationList /></ProtectRoute>} exact />
        <Route path="planning/seating-configurations/view/:sId" element={<ProtectRoute featureId={permissions.subModuleItems.SEATING_CONFIGURATION}><SeatingConfigurationView /></ProtectRoute>} exact />
        <Route path="planning/aircraft-model-family" element={<ProtectRoute featureId={permissions.subModuleItems.AC_TYPE}><AircraftModelFamily /></ProtectRoute>} exact />
        <Route path="planning/aircraft-model-family/add" element={<ProtectRoute featureId={permissions.subModuleItems.AC_TYPE}><AircraftModelFamilyAdd /></ProtectRoute>} exact />
        <Route path="planning/aircraft-model-family/edit/:amId" element={<ProtectRoute featureId={permissions.subModuleItems.AC_TYPE}><AircraftModelFamilyAdd /></ProtectRoute>} exact />
        <Route path="planning/models/add" element={<ProtectRoute featureId={permissions.subModuleItems.MODEL}><Models /></ProtectRoute>} exact />
        <Route path="planning/models/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.MODEL}><Models /> </ProtectRoute>} exact />
        <Route path="planning/models" element={<ProtectRoute featureId={permissions.subModuleItems.MODEL}><ModelsList /> </ProtectRoute>} exact />
        <Route path="planning/models/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.MODEL}><ModelsView /> </ProtectRoute>} exact />
        <Route path="planning/model-trees" element={<ProtectRoute featureId={permissions.subModuleItems.MODEL_TREES}><ModelTreeList /> </ProtectRoute>} exact />
        <Route path="planning/model-tree/add" element={<ProtectRoute featureId={permissions.subModuleItems.MODEL_TREES}><ModelTree /> </ProtectRoute>} exact />
        <Route path="planning/model-tree/edit/:MtId" element={<ProtectRoute featureId={permissions.subModuleItems.MODEL_TREES}><ModelTree /> </ProtectRoute>} exact />
        <Route path="planning/model-tree/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.MODEL_TREES}><ModelTreeView /> </ProtectRoute>} exact />
        <Route path="planning/aircraft-builds/add" element={<ProtectRoute featureId={permissions.subModuleItems.BUILD_AIRCRAFT}><AircraftBuilds /></ProtectRoute>} exact />
        <Route path="planning/aircraft-builds/edit/:id/:status" element={<ProtectRoute featureId={permissions.subModuleItems.BUILD_AIRCRAFT}><AircraftBuilds /></ProtectRoute>} exact />
        <Route path="planning/aircraft-builds/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.BUILD_AIRCRAFT}><AircraftBuildsView /></ProtectRoute>} exact />
        <Route path="planning/aircraft-builds" element={<ProtectRoute featureId={permissions.subModuleItems.BUILD_AIRCRAFT}><AircraftBuildsList /></ProtectRoute>} exact />
        <Route path="planning/mwo/add" element={<ProtectRoute featureId={permissions.subModuleItems.MAINTENANCE_WORK_ORDERS}><MWOAdd /></ProtectRoute>} exact />
        <Route path="planning/mwo/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.MAINTENANCE_WORK_ORDERS}><MWOAdd /></ProtectRoute>} exact />
        <Route path="planning/mwos" element={<ProtectRoute featureId={permissions.subModuleItems.MAINTENANCE_WORK_ORDERS}><MWOList /></ProtectRoute>} exact />
        <Route path="planning/mwo/report/:id" element={<ProtectRoute featureId={permissions.subModuleItems.MAINTENANCE_WORK_ORDERS}><MWOReport /></ProtectRoute>} exact />
        <Route path="planning/nrc-control-list" element={<ProtectRoute featureId={permissions.subModuleItems.NRC_CONTROL_LIST}><NRCControlList /></ProtectRoute>} exact />
        <Route path="planning/nrc-control-list/add" element={<ProtectRoute featureId={permissions.subModuleItems.NRC_CONTROL_LIST}><NRCControlAdd /></ProtectRoute>} exact />
        <Route path="planning/nrc-control-list/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.NRC_CONTROL_LIST}><NRCControlAdd /></ProtectRoute>} exact />
        <Route path="planning/nrc-control-list/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.NRC_CONTROL_LIST}><NRCControlListView /></ProtectRoute>} exact />
        <Route path="planning/checks" element={<ProtectRoute featureId={permissions.subModuleItems.CHECK}><Checks /></ProtectRoute>} exact />
        <Route path="planning/checks/add" element={<ProtectRoute featureId={permissions.subModuleItems.CHECK}><ChecksAdd /></ProtectRoute>} exact />
        <Route path="planning/checks/edit/:checkId" element={<ProtectRoute featureId={permissions.subModuleItems.CHECK}><ChecksAdd /></ProtectRoute>} exact />
        <Route path="planning/ac-checks" element={<ProtectRoute featureId={permissions.subModuleItems.AC_CHECKS}><ACChecks /></ProtectRoute>} exact />
        <Route path="planning/ac-checks/add" element={<ProtectRoute featureId={permissions.subModuleItems.AC_CHECKS}><ACCheckAdd /></ProtectRoute>} exact />
        <Route path="planning/ac-checks/edit/:acCheckId" element={<ProtectRoute featureId={permissions.subModuleItems.AC_CHECKS}><ACCheckAdd /></ProtectRoute>} exact />
        <Route path="planning/ac-checks/view/:acCheckId" element={<ProtectRoute featureId={permissions.subModuleItems.AC_CHECKS}><ACCheckView /></ProtectRoute>} exact />
        <Route path="planning/ac-check-done" element={<ProtectRoute featureId={permissions.subModuleItems.AC_CHECK_DONE}><AcCheckDoneList /></ProtectRoute>} exact />
        <Route path="planning/ac-check-done/add" element={<ProtectRoute featureId={permissions.subModuleItems.AC_CHECK_DONE}><AddAcCheckDone /></ProtectRoute>} exact />
        <Route path="planning/ac-check-done/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.AC_CHECK_DONE}><AddAcCheckDone /></ProtectRoute>} exact />
        <Route path="planning/ac-check-done/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.AC_CHECK_DONE}><AcCheckDoneList /></ProtectRoute>} exact />
        <Route path="planning/check-index/add" element={<ProtectRoute featureId={permissions.subModuleItems.AC_CHECK_INDEX}><CheckIndexAdd /></ProtectRoute>} exact />
        <Route path="planning/task-type" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_TYPE}><TaskTypes /></ProtectRoute>} exact />
        <Route path="planning/task-type/add" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_TYPE}><AddTaskType /></ProtectRoute>} exact />
        <Route path="planning/task-type/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.TASK_TYPE}><AddTaskType /></ProtectRoute>} exact />
        <Route path="planning/ac-check-index" element={<ProtectRoute featureId={permissions.subModuleItems.AC_CHECK_INDEX}><ACCheckIndex /></ProtectRoute>} exact />
        <Route path="planning/ac-check-index/add" element={<ProtectRoute featureId={permissions.subModuleItems.AC_CHECK_INDEX}><ACCheckIndexAdd /></ProtectRoute>} exact />
        <Route path="planning/ac-check-index/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.AC_CHECK_INDEX}><ACCheckIndexAdd /></ProtectRoute>} exact />
        <Route path="planning/ac-check-index/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.AC_CHECK_INDEX}><ACCheckIndexView /></ProtectRoute>} exact />
        <Route path="planning/nrc-control-list/report" element={<ProtectRoute featureId={permissions.subModuleItems.NRC_CONTROL_LIST}><NRCControlListView /></ProtectRoute>} exact />
        <Route path="planning/maintenance/defect-register" element={<ProtectRoute featureId={permissions.subModuleItems.MAINTENANCE_DEFECT_REGISTER}><MaintenanceDefectRegister /></ProtectRoute>} exact />
        <Route path="planning/engine/times/add" element={<ProtectRoute featureId={permissions.subModuleItems.ENGINE_INFORMATION}><EngineTimes /></ProtectRoute>} exact />
        <Route path="planning/engine/times/edit/:aircraftBuildId" element={<ProtectRoute featureId={permissions.subModuleItems.ENGINE_INFORMATION}><EngineTimes /></ProtectRoute>} exact />
        <Route path="planning/engine/times" element={<ProtectRoute featureId={permissions.subModuleItems.ENGINE_INFORMATION}><EngineTimesList /></ProtectRoute>} exact />
        <Route path="planning/engine/times/view/:aircraftBuildId" element={<ProtectRoute featureId={permissions.subModuleItems.ENGINE_INFORMATION}><EngineTimesView /></ProtectRoute>} exact />
        <Route path="planning/work-package-summary" element={<ProtectRoute featureId={permissions.subModuleItems.WORK_PACKAGE_SUMMARY}><WorkPackageSummaryList /></ProtectRoute>} exact />
        <Route path="planning/work-package-summary/add" element={<ProtectRoute featureId={permissions.subModuleItems.WORK_PACKAGE_SUMMARY}><AddWorkPackageSummary /></ProtectRoute>} exact />
        <Route path="planning/work-package-summary/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.WORK_PACKAGE_SUMMARY}><AddWorkPackageSummary /></ProtectRoute>} exact />
        <Route path="planning/work-package-summary/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.WORK_PACKAGE_SUMMARY}><WorkPackageSummary/></ProtectRoute>} exact />
        <Route path="planning/work-package-certification-record" element={<ProtectRoute featureId={permissions.subModuleItems.WORK_PACKAGE_CERTIFICATION_RECORD}><WorkPackageCertificationRecordList /></ProtectRoute>} exact />
        <Route path="planning/work-package-certification-record/add" element={<ProtectRoute featureId={permissions.subModuleItems.WORK_PACKAGE_CERTIFICATION_RECORD}><AddWorkPackageCertificationRecord /></ProtectRoute>} exact />
        <Route path="planning/work-package-certification-record/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.WORK_PACKAGE_CERTIFICATION_RECORD}><AddWorkPackageCertificationRecord /></ProtectRoute>} exact />
        <Route path="planning/work-package-certification-record/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.WORK_PACKAGE_CERTIFICATION_RECORD}><WorkPackageCertificationReport/></ProtectRoute>} exact />
        <Route path="planning/non-routine-card" element={<ProtectRoute featureId={permissions.subModuleItems.NON_ROUTINE_CARD}><NonRoutineCardList /></ProtectRoute>} exact />
        <Route path="planning/non-routine-card/add" element={<ProtectRoute featureId={permissions.subModuleItems.NON_ROUTINE_CARD}><AddNonRoutineCard /></ProtectRoute>} exact />
        <Route path="planning/non-routine-card/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.NON_ROUTINE_CARD}><NonRoutineCardDetails /></ProtectRoute>} exact />
        <Route path="planning/non-routine-card/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.NON_ROUTINE_CARD}><AddNonRoutineCard /></ProtectRoute>} exact />
        <Route path="planning/serials" element={<ProtectRoute featureId={permissions.subModuleItems.SERIAL}><SerialNoList /></ProtectRoute>} exact />
        <Route path="planning/serial/add" element={<ProtectRoute featureId={permissions.subModuleItems.SERIAL}><AddSerialNo /></ProtectRoute>} exact />
        <Route path="planning/serials/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.SERIAL}><AddSerialNo /></ProtectRoute>} exact />
        <Route path="planning/folder/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><FoldersByType /></ProtectRoute>} exact />
        <Route path="planning/folder/:id/:folderId" element={<ProtectRoute featureId={permissions.DEFAULT}><FilesByFolderId /></ProtectRoute>} exact />
        <Route path="planning/main-landing-gear-status" element={<ProtectRoute featureId={permissions.subModuleItems.MAIN_LANDING_GEAR_STATUS}><MainLandingGearStatus /></ProtectRoute>} exact />
        <Route path="planning/nose-landing-gear-status" element={<ProtectRoute featureId={permissions.subModuleItems.NOSE_LANDING_GEAR_STATUS}><NoseLandingGearStatus /></ProtectRoute>} exact />
        <Route path="planning/apu-llp-status" element={<ProtectRoute featureId={permissions.subModuleItems.APU_LLP_STATUS}><APULlp /></ProtectRoute>} exact />
        <Route path="planning/last-shop-info" element={<ProtectRoute featureId={permissions.subModuleItems.APU_LLP_LAST_SHOP_VISIT_INFO}><LastShopInfoList /></ProtectRoute>} exact />
        <Route path="planning/last-shop-info/add" element={<ProtectRoute featureId={permissions.subModuleItems.APU_LLP_LAST_SHOP_VISIT_INFO}><AddLastShopListInfo /></ProtectRoute>} exact />
        <Route path="planning/last-shop-info/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.APU_LLP_LAST_SHOP_VISIT_INFO}><AddLastShopListInfo /></ProtectRoute>} exact />
        <Route path="planning/last-shop-info/view/:id" element={<ProtectRoute featureId={permissions.subModuleItems.APU_LLP_LAST_SHOP_VISIT_INFO}><LastShopInfoDetails /></ProtectRoute>} exact />
        <Route path="planning/amp-revisions" element={<ProtectRoute featureId={permissions.subModuleItems.AMP_REVISION}><RevisionList /></ProtectRoute>} exact />
        <Route path="planning/amp-revisions/add" element={<ProtectRoute featureId={permissions.subModuleItems.AMP_REVISION}><AddRevision /></ProtectRoute>} exact />
        <Route path="planning/amp-revisions/edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.AMP_REVISION}><AddRevision /></ProtectRoute>} exact />
        <Route path="planning/removal-engine-llps-status" element={<ProtectRoute featureId={permissions.subModuleItems.REMOVED_ENGINE_LLP_STATUS}><RemovalEngineLLP /></ProtectRoute>} exact />
        <Route path="planning/nlg-removed-status" element={<ProtectRoute featureId={permissions.subModuleItems.REMOVED_NOSE_LANDING_GEAR_STATUS}><NlgRemovedStatus /></ProtectRoute>} exact />
        <Route path="planning/removal-apu-llps-status" element={<ProtectRoute featureId={permissions.subModuleItems.REMOVAL_APU_LLP_STATUS}><RemovalApuLLP /></ProtectRoute>} exact />
        <Route path="planning/mlg-removed-status" element={<ProtectRoute featureId={permissions.subModuleItems.REMOVED_MAIN_LANDING_GEAR_STATUS}><RemovedMLGReport /></ProtectRoute>} exact />
        {/* Reliability */}
        <Route path="reliability" element={<ProtectRoute featureId={permissions.DEFAULT}>< TechRecord/></ProtectRoute>} exact />
        <Route path="reliability/operational-statistics" element={<ProtectRoute featureId={permissions.DEFAULT}><OperationalStatistics /></ProtectRoute>} exact />
        <Route path="reliability/service-utilization" element={<ProtectRoute featureId={permissions.DEFAULT}><ServiceUtilization /></ProtectRoute>} exact />
        <Route path="reliability/fleet-utilization" element={<ProtectRoute featureId={permissions.DEFAULT}><FleetUtilization /></ProtectRoute>} exact />
        <Route path="reliability/incident-statistics" element={<ProtectRoute featureId={permissions.DEFAULT}><IncidentStatistics /></ProtectRoute>} exact />
        <Route path="reliability/technical-non-technical-incident" element={<ProtectRoute featureId={permissions.DEFAULT}><TechNonTechIncident /></ProtectRoute>} exact />
        <Route path="reliability/incident" element={<ProtectRoute featureId={permissions.DEFAULT}><Incident /></ProtectRoute>} exact />
        <Route path="reliability/incident/add" element={<ProtectRoute featureId={permissions.DEFAULT}><AddIncident /></ProtectRoute>} exact />
        <Route path="reliability/incident/edit/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><AddIncident /></ProtectRoute>} exact />
        <Route path="reliability/incident/view/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><IncidentDetails /></ProtectRoute>} exact />
        <Route path="reliability/engine-incidents" element={<ProtectRoute featureId={permissions.DEFAULT}><Engines /></ProtectRoute>} exact />
        <Route path="reliability/engine-incident/add" element={<ProtectRoute featureId={permissions.DEFAULT}><AddEngine /></ProtectRoute>} exact />
        <Route path="reliability/engine-incident/edit/:id" element={<ProtectRoute featureId={permissions.DEFAULT}><AddEngine /></ProtectRoute>} exact />
        <Route path="reliability/engine-incident" element={<ProtectRoute featureId={permissions.DEFAULT}><EngineIncidentReport /></ProtectRoute>} exact />
        <Route path="reliability/alert-level-report" element={<ProtectRoute featureId={permissions.DEFAULT}><AlertLevelReport /></ProtectRoute>} exact />
        <Route path="reliability/alert-level" element={<ProtectRoute featureId={permissions.DEFAULT}><AlertLevel /></ProtectRoute>} exact />
        <Route path="reliability/system-reliability" element={<ProtectRoute featureId={permissions.DEFAULT}><SystemReliablityReport /></ProtectRoute>} exact />
        <Route path="reliability/interruption" element={<ProtectRoute featureId={permissions.DEFAULT}><Interruption/></ProtectRoute>} exact />
        <Route path="reliability/interruption/add" element={<ProtectRoute featureId={permissions.DEFAULT}><AddInterruption/></ProtectRoute>} exact />
        <Route path="reliability/interruption/edit/:intId" element={<ProtectRoute featureId={permissions.DEFAULT}><AddInterruption/></ProtectRoute>} exact />
        <Route path="reliability/interruption/view/:intId" element={<ProtectRoute featureId={permissions.DEFAULT}><InterruptionDetails/></ProtectRoute>} exact />
        <Route path="reliability/cancellation" element={<ProtectRoute featureId={permissions.DEFAULT}><Cancellation/></ProtectRoute>} exact />
        <Route path="reliability/cancellation/add" element={<ProtectRoute featureId={permissions.DEFAULT}><AddCancellation/></ProtectRoute>} exact />
        <Route path="reliability/cancellation/edit/:cId" element={<ProtectRoute featureId={permissions.DEFAULT}><AddCancellation/></ProtectRoute>} exact />
        <Route path="reliability/dispatch-statistics" element={<ProtectRoute featureId={permissions.DEFAULT}><DispatchStatistics/></ProtectRoute>} exact />
        <Route path="reliability/dispatch-interruption" element={<ProtectRoute featureId={permissions.DEFAULT}><InterruptionReport/></ProtectRoute>} exact />
        <Route path="reliability/defect" element={<ProtectRoute featureId={permissions.DEFAULT}><DefectList/></ProtectRoute>} exact />
        <Route path="reliability/defect/add" element={<ProtectRoute featureId={permissions.DEFAULT}><AddDefect/></ProtectRoute>} exact />
        <Route path="reliability/defect/add-multiple-defect" element={<ProtectRoute featureId={permissions.DEFAULT}><AddMultipleDefect/></ProtectRoute>} exact />
        <Route path="reliability/defect/edit/:dId" element={<ProtectRoute featureId={permissions.DEFAULT}><AddDefect/></ProtectRoute>} exact />
        <Route path="reliability/defect/view/:dId" element={<ProtectRoute featureId={permissions.DEFAULT}><DefectDetails/></ProtectRoute>} exact />
        <Route path="reliability/systems" element={<ProtectRoute featureId={permissions.DEFAULT}><Systems/></ProtectRoute>} exact />
        <Route path="reliability/system/add" element={<ProtectRoute featureId={permissions.DEFAULT}><AddSystem/></ProtectRoute>} exact />
        <Route path="reliability/system/edit/:sId" element={<ProtectRoute featureId={permissions.DEFAULT}><AddSystem/></ProtectRoute>} exact />
        <Route path="reliability/top-ata-report" element={<ProtectRoute featureId={permissions.DEFAULT}><TopMostAtaReport/></ProtectRoute>} exact />
        <Route path="reliability/crr" element={<ProtectRoute featureId={permissions.DEFAULT}><CrrReport/></ProtectRoute>} exact />
        <Route path="technical-service" element={<ProtectRoute featureId={permissions.DEFAULT}>< TechnicalService/></ProtectRoute>} exact />
        <Route path="technical-service/task-status" element={<ProtectRoute featureId={permissions.DEFAULT}>< TaskStatusReport/></ProtectRoute>} exact />
        {/* configurations */}
        <Route path="configurations" element={ <ProtectRoute> <Configurations /> </ProtectRoute> } exact />
        <Route path="configurations/modules" element={ <ProtectRoute> <ModuleList /> </ProtectRoute> } exact />
        <Route path="configurations/module" element={ <ProtectRoute> <Module /> </ProtectRoute> } exact />
        <Route path="configurations/module/:id" element={ <ProtectRoute> <Module /> </ProtectRoute> } exact />
        <Route path="configurations/sub-modules" element={ <ProtectRoute> <SubModuleList /> </ProtectRoute> } exact />
        <Route path="configurations/sub-module" element={ <ProtectRoute> <Submodule /> </ProtectRoute> } exact />
        <Route path="configurations/sub-module/:id" element={ <ProtectRoute> <Submodule /> </ProtectRoute> } exact />
        <Route path="configurations/sub-module-items" element={ <ProtectRoute><SubModuleItemList /></ProtectRoute>} exact />
        <Route path="configurations/sub-module-item" element= {<ProtectRoute><SubModuleItem /></ProtectRoute>} exact />
        <Route path="configurations/sub-module-item/:id" element={ <ProtectRoute><SubModuleItem /></ProtectRoute>} exact />
        <Route path="approval-setting" element={ <ProtectRoute><ApprovalSetting /></ProtectRoute>} exact />
        <Route path="notification-setting" element={ <ProtectRoute><NotificationSetting /></ProtectRoute>} exact />
        <Route path="configurations/companies" element={ <ProtectRoute><CompanyLists /></ProtectRoute>} exact />
        <Route path="configurations/companies/add" element={ <ProtectRoute><Company /></ProtectRoute>} exact />
        <Route path="configuratsions/companies/add/:id" element= {<ProtectRoute><Company /></ProtectRoute>} exact />
        <Route path="configurations/companies" element={ <ProtectRoute><Company /></ProtectRoute>} exact />
        <Route path="configurations/companies/:id" element={ <ProtectRoute><Company /></ProtectRoute>} exact />
        <Route path="configurations/manufacturer/add" element={ <ProtectRoute featureId={permissions.subModuleItems.CONFIGURATION_MANUFACTURE}><ManufacturerAdd /></ProtectRoute>} exact />
        <Route path="configurations/manufacturer/edit/:id" element={ <ProtectRoute featureId={permissions.subModuleItems.CONFIGURATION_MANUFACTURE}><ManufacturerAdd /></ProtectRoute>} exact />
        <Route path="manufacturer/details/:id" element={ <ProtectRoute featureId={permissions.DEFAULT}><ManufacturerDetails/></ProtectRoute>} exact />
        <Route path="configurations/pending-manufacturers" element={ <ProtectRoute featureId={permissions.subModuleItems.CONFIGURATION_MANUFACTURER_PENDING_LIST}> <PendingManufacturer /> </ProtectRoute> } exact />
        <Route path="configurations/approved-manufacturers" element={ <ProtectRoute featureId={permissions.subModuleItems.CONFIGURATION_MANUFACTURER_APPROVED_LIST}> <ApprovedManufacturer /> </ProtectRoute> } exact />
        <Route path="configurations/sub-modules" element={ <ProtectRoute> <SubModuleList /> </ProtectRoute> } exact />
        <Route path="configurations/sub-module" element={ <ProtectRoute> <Submodule /> </ProtectRoute> } exact />
        <Route path="configurations/sub-module/:id" element={ <ProtectRoute> <Submodule /> </ProtectRoute> } exact />
        <Route path="configurations/sub-module-items" element={<ProtectRoute><SubModuleItemList /></ProtectRoute>} exact />
        <Route path="configurations/sub-module-item" element={<ProtectRoute><SubModuleItem /></ProtectRoute>} exact />
        <Route path="configurations/sub-module-item/:id" element={<ProtectRoute><SubModuleItem /></ProtectRoute>} exact />
        <Route path="configurations/add-base-plant" element={<ProtectRoute><Country /></ProtectRoute>} exact />
        <Route path="configurations/edit-base-plant/:id" element={ <ProtectRoute> <Country /> </ProtectRoute> } exact />
        <Route path="configurations/base-plant" element={<ProtectRoute><CountryTable /></ProtectRoute>} exact />
        <Route path="configurations/approval-setting" element={<ProtectRoute><ApprovalSetting /></ProtectRoute>} exact />
        <Route path="configurations/edit-approval-setting/:id" element={<ProtectRoute><ApprovalSetting /></ProtectRoute>} exact />
        <Route path="configurations/approval-setting-list" element={<ProtectRoute><ApprovalSettingList /></ProtectRoute>} exact />
        <Route path="configurations/notification-setting" element={<ProtectRoute><NotificationSetting /></ProtectRoute>} exact />
        <Route path="configurations/companies" element={<ProtectRoute><CompanyLists /></ProtectRoute>} exact />
        <Route path="configurations/companies/add" element={<ProtectRoute><Company /></ProtectRoute>} exact />
        <Route path="configurations/companies/edit/:id" element={<ProtectRoute><Company /></ProtectRoute>} exact />
        <Route path="configurations/city" element={<ProtectRoute><City /></ProtectRoute>} exact />
        <Route path="configurations/city/add" element={<ProtectRoute><CityAdd /></ProtectRoute>} exact />
        <Route path="configurations/city/edit/:id" element={<ProtectRoute><CityAdd /></ProtectRoute>} exact />
        <Route path="configurations/base" element={<ProtectRoute><City /></ProtectRoute>} exact />
        <Route path="configurations/base/add" element={<ProtectRoute><CityAdd /></ProtectRoute>} exact />
        <Route path="configurations/base/edit/:id" element={<ProtectRoute><CityAdd /></ProtectRoute>} exact />
        <Route path="configurations/roles" element={ <ProtectRoute> <RolesList /> </ProtectRoute> } exact />
        <Route path="configurations/add/role" element={ <ProtectRoute> <AddRole /> </ProtectRoute> } exact />
        <Route path="configurations/edit/role/:id" element={ <ProtectRoute> <AddRole /> </ProtectRoute> } exact />
        <Route path="configurations/users" element={ <ProtectRoute> <Users /> </ProtectRoute> } exact />
        <Route path="configurations/profile/:userId" element={ <ProtectRoute> <Profile /> </ProtectRoute> } exact />
        <Route path="configurations/users/add" element={ <ProtectRoute> <AddUsers /> </ProtectRoute> } exact />
        <Route path="configurations/users/edit/:id" element={ <ProtectRoute> <AddUsers /> </ProtectRoute> } exact />
        <Route path="configurations/roles/:id" element={ <ProtectRoute> <RolesList /> </ProtectRoute> } exact />
        <Route path="configurations/roles/duplicate/:id/:name" element={ <ProtectRoute> <AddRole /> </ProtectRoute> } exact />
        <Route path="configurations/roles/access-rights" element={ <ProtectRoute superAdminOnly={true}> <RolesAccessRights /> </ProtectRoute> } exact />
        <Route path="configurations/roles/features" element={ <ProtectRoute superAdminOnly={true}> <FeatureRole /> </ProtectRoute> } exact />
        <Route path="configurations/base" element={<ProtectRoute><City /></ProtectRoute>} exact />
        <Route path="configurations/location" element={ <ProtectRoute><Location /></ProtectRoute>} exact />
        <Route path="configurations/location/add" element={ <ProtectRoute><LocationAdd /></ProtectRoute>} exact />
        <Route path="configurations/location/edit/:id" element={ <ProtectRoute><LocationAdd /></ProtectRoute>} exact />
        <Route path="configurations/operator" element={ <ProtectRoute><ExternalDepartmentList/></ProtectRoute>} exact />
        <Route path="configurations/operator/add" element={ <ProtectRoute><ExternalDepartment/></ProtectRoute>} exact />
        <Route path="configurations/operator/edit/:id" element={ <ProtectRoute><ExternalDepartment/></ProtectRoute>} exact />
        <Route path="configurations/workflow-actions" element={ <ProtectRoute><WorkflowActionList/></ProtectRoute>} exact />
        <Route path="configurations/workflow-actions/add" element={ <ProtectRoute><WorkflowActions/></ProtectRoute>} exact />
        <Route path="configurations/workflow-actions/edit/:id" element={ <ProtectRoute><WorkflowActions/></ProtectRoute>} exact />
        <Route path="configurations/vendor-capabilities-list" element={ <ProtectRoute><VendorCapabilitiesList/></ProtectRoute>} exact />
        <Route path="configurations/add-vendor-capabilities" element={ <ProtectRoute><VendorCapabilities/></ProtectRoute>} exact />
        <Route path="configurations/edit-vendor-capabilities/:id" element={ <ProtectRoute><VendorCapabilities/></ProtectRoute>} exact />
        <Route path="store/stock-room" element={ <ProtectRoute><StockRoom/></ProtectRoute>} exact />
        <Route path="store/stock-room/add" element={ <ProtectRoute><StockRoomAdd/></ProtectRoute>} exact />
        <Route path="store/stock-room/edit/:id" element={ <ProtectRoute><StockRoomAdd/></ProtectRoute>} exact />
        {/*Currency*/}
        <Route path="configurations/currency" element={ <ProtectRoute><Currency/></ProtectRoute>} exact />
        <Route path="configurations/currency/add" element={ <ProtectRoute><AddCurrency/></ProtectRoute>} exact />
        <Route path="configurations/currency/edit/:id" element={ <ProtectRoute><AddCurrency/></ProtectRoute>} exact />
        {/* Quality */}
        <Route path="quality" element={ <ProtectRoute> <Quality /> </ProtectRoute> } exact />
        <Route path="quality/pending-manufacturers" element={ <ProtectRoute featureId={permissions.subModuleItems.QUALITY_MANUFACTURER_PENDING_LIST}> <PendingManufacturerQuality /> </ProtectRoute> } exact />
        <Route path="quality/manufacturer-edit/:id" element={ <ProtectRoute featureId={permissions.subModuleItems.QUALITY_MANUFACTURER_PENDING_LIST}> <QualityManufacturerEdit /> </ProtectRoute> } exact />
        <Route path="quality/approved-manufacturers" element={ <ProtectRoute featureId={permissions.subModuleItems.QUALITY_MANUFACTURER_APPROVED_LIST}> <ApprovedManufacturerQuality /> </ProtectRoute> } exact />
        <Route path="quality/suppliers-edit/:id" element={ <ProtectRoute featureId={permissions.subModuleItems.QUALITY_MANUFACTURER_PENDING_LIST}> <QualitySupplierEdit /> </ProtectRoute> } exact />
        <Route path="quality/pending-suppliers" element={ <ProtectRoute featureId={permissions.subModuleItems.QUALITY_SUPPLIER_APPROVED_LIST}> <PendingSupplierQuality /> </ProtectRoute> } exact />
        <Route path="quality/approved-suppliers" element={ <ProtectRoute> <ApprovedSupplierQuality /> </ProtectRoute> } exact />
        <Route path="quality/inspection-checklist-edit/:id" element={<ProtectRoute featureId={permissions.subModuleItems.QUALITY_PENDING_INSPECTION_CHECKLIST}> <QualityInspectionChecklist /> </ProtectRoute>} exact />
        <Route path="quality/pending-inspection-checklist" element={<ProtectRoute featureId={permissions.subModuleItems.QUALITY_PENDING_INSPECTION_CHECKLIST}> <PendingInspectionCheckListQuality /> </ProtectRoute>} exact />
        <Route path="quality/approved-inspection-checklist" element={<ProtectRoute featureId={permissions.subModuleItems.QUALITY_APPROVED_INSPECTION_CHECKLIST}> <ApprovedInspectionCheckListQuality /> </ProtectRoute>} exact />
        <Route path="quality/shipment-provider-edit/:id" element={ <ProtectRoute featureId={permissions.subModuleItems.QUALITY_SHIPMENT_PROVIDER_PENDING_LIST}><QualityShipmentProvider/></ProtectRoute>} exact />
         {/*
          <Route path="quality/pending-shipment-provider" element={ <ProtectRoute featureId={permissions.subModuleItems.QUALITY_SHIPMENT_PROVIDER_PENDING_LIST}><PendingShipmentProviderQuality/></ProtectRoute>} exact />
           <Route path="quality/approved-shipment-provider" element={ <ProtectRoute featureId={permissions.subModuleItems.QUALITY_SHIPMENT_PROVIDER_APPROVED_LIST}><ApprovedShipmentProviderQuality/></ProtectRoute>} exact />
         */}
        {/*Quotation*/}
        <Route path="material-management/quotation" element={ <ProtectRoute><QuotationList/></ProtectRoute>} exact />
        <Route path="material-management/quotation/add" element={ <ProtectRoute><Quotation/></ProtectRoute>} exact />
        <Route path="material-management/quotation/edit/:id" element={ <ProtectRoute><Quotation/></ProtectRoute>} exact />
        <Route path="material-management/quotation/details/:id" element={ <ProtectRoute><QuotationDetails/></ProtectRoute>} exact />

        {/*{QualityStoreInspectionEdit}*/}
        <Route path="storeInspector" element={<ProtectRoute> <StoreInspectorDash /> </ProtectRoute>} exact />
        <Route path="storeInspector/store-inspection" element={<ProtectRoute> <StoreInspection /> </ProtectRoute>} exact />
        <Route path="storeInspector/edit-store-inspection/:id" element={<ProtectRoute> <StoreInspection /> </ProtectRoute>} exact />
        <Route path="storeInspector/store-inspection-details/:id" element={<ProtectRoute> <StoreInspectionDetails /> </ProtectRoute>} exact />
        <Route path="storeInspector/store-inspection-list" element={<ProtectRoute> <StoreInspectionList /> </ProtectRoute>} exact />
        <Route path="storeInspector/inspection-checklist" element={<ProtectRoute featureId={permissions.subModuleItems.STORE_INSPECTOR_INSPECTION_CHECKLIST}> <InspectionChecklist /> </ProtectRoute>} exact />
        <Route path="storeInspector/edit-inspection-checklist/:id" element={<ProtectRoute featureId={permissions.subModuleItems.STORE_INSPECTOR_INSPECTION_CHECKLIST}> <InspectionChecklist /> </ProtectRoute>} exact />
        <Route path="storeInspector/pending-inspection-checklist" element={<ProtectRoute featureId={permissions.subModuleItems.STORE_INSPECTOR_PENDING_INSPECTION_CHECKLIST}> <PendingInspectionChecklist /> </ProtectRoute>} exact />
        <Route path="storeInspector/approved-inspection-checklist" element={<ProtectRoute featureId={permissions.subModuleItems.STORE_INSPECTOR_APPROVED_INSPECTION_CHECKLIST}> <ApprovedInspectionChecklist /> </ProtectRoute>} exact />
        <Route path="storeInspector/store-inspection-print" element={<ProtectRoute> <StoreInspectionPrint /> </ProtectRoute>} exact />
        <Route path="storeInspector/grn-list" element={<ProtectRoute> <GrnList /> </ProtectRoute>} exact />
        <Route path="storeInspector/grn" element={<ProtectRoute> <Grn /> </ProtectRoute>} exact />
        <Route path="storeInspector/edit-grn/:id" element={<ProtectRoute> <Grn /> </ProtectRoute>} exact />
        <Route path="storeInspector/grn-details/:id" element={<ProtectRoute> <GrnDetails /> </ProtectRoute>} exact />


        <Route path="material-management/shipment-provider/add" element={ <ProtectRoute featureId={permissions.subModuleItems.MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER}><ShipmentProvider/></ProtectRoute>} exact />
        <Route path="material-management/shipment-provider/edit/:id" element={ <ProtectRoute featureId={permissions.subModuleItems.MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER}><ShipmentProvider/></ProtectRoute>} exact />
        <Route path="material-management/pending-shipment-provider" element={ <ProtectRoute featureId={permissions.subModuleItems.MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_PENDING_LIST}><PendingShipmentProvider/></ProtectRoute>} exact />
        <Route path="material-management/approved-shipment-provider" element={ <ProtectRoute featureId={permissions.subModuleItems.MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_APPROVED_LIST}><ApprovedShipmentProvider/></ProtectRoute>} exact />


        {/* Audit */}
        <Route path="audit" element={ <ProtectRoute> <Audit /> </ProtectRoute> } exact />
        <Route path="audit/pending-audit-cs" element={ <ProtectRoute> <PendingAuditCS /> </ProtectRoute> } exact />
        <Route path="audit/approved-audit-cs" element={ <ProtectRoute> <ApprovedAuditCS /> </ProtectRoute> } exact />
        <Route path="audit/pending-audit-cs-disposal/add/:id"
          element={
            <ProtectRoute>
               <AuditDisposal
                 title="Pending Audit CS"
                 cardTitle="PENDING AUDIT CS DISPOSAL EDIT"
                 breadcrumbListUrl="/audit/pending-audit-cs"
               />
             </ProtectRoute> }
            exact
         />
        <Route path="audit/approved-audit-cs-disposal/edit/:id"
          element={
            <ProtectRoute>
               <AuditDisposal
                 title="Approved Audit CS"
                 cardTitle="Approved AUDIT CS DISPOSAL EDIT"
                 breadcrumbListUrl="/audit/approved-audit-cs"
               />
             </ProtectRoute> }
            exact
         />
        <Route path="audit/pending-cs-details/:id"
          element={
            <ProtectRoute>
              <CSDetails
                baseUrl="/audit"
                icon="fas fa-user-shield"
                breadcrumbTitle="audit"
                title="Pending Audit CS Details"
                breadcrumbListTitle="Pending Audit CS List"
                breadcrumbListUrl="/audit/pending-audit-cs"
                cardTitle="Comparative Statement"
                permission=""
              />
            </ProtectRoute> }
              exact
         />
        <Route path="audit/approved-cs-details/:id"
          element={ <ProtectRoute>
            <CSDetails
                baseUrl="/audit"
                icon="fas fa-user-shield"
                breadcrumbTitle="audit"
                title="Approved Audit CS Details"
                breadcrumbListTitle="Approved Audit CS List"
                breadcrumbListUrl="/audit/approved-audit-cs"
                cardTitle="Comparative Statement"
                permission=""
              />
            </ProtectRoute> }
              exact
         />

        <Route path="audit/procurement/approved-Purchase-invoice" element={ <ProtectRoute> <ApprovedAuditProcurementPi /> </ProtectRoute> } exact />
        <Route path="audit/procurement/pending-Purchase-invoice" element={ <ProtectRoute> <PendingAuditProcurementPi /> </ProtectRoute> } exact />
        <Route path="audit/procurement/pending-purchase-invoice/details/:id"
         element={<ProtectRoute>
            <PIDetails
              csType="material-management"
              baseUrl="/audit"
              url="/procurement/audit/parts-invoice"
              icon="fas fa-user-shield"
              breadcrumbTitle="Audit"
              breadcrumbListTitle="Pending Procurement PI List"
              breadcrumbListUrl="/audit/procurement/pending-Purchase-invoice"
              cardTitle="Pending Procurement PI Details"
              permission=""
            />
          </ProtectRoute>}
          exact
       />
        <Route path="audit/procurement/approved-purchase-invoice/details/:id"
         element={<ProtectRoute>
            <PIDetails
              csType="material-management"
              baseUrl="/audit"
              url="/procurement/audit/parts-invoice"
              icon="fas fa-user-shield"
              breadcrumbTitle="Audit"
              breadcrumbListTitle="Approved Procurement PI List"
              breadcrumbListUrl="/audit/procurement/approved-Purchase-invoice"
              cardTitle="Approved Procurement PI Details"
              permission=""
            />
          </ProtectRoute>}
          exact
       />
        <Route path="audit/logistic/approved-Purchase-invoice" element={ <ProtectRoute> <ApprovedAuditLogisticPi /> </ProtectRoute> } exact />
        <Route path="audit/logistic/pending-Purchase-invoice" element={ <ProtectRoute> <PendingAuditLogisticPi /> </ProtectRoute> } exact />
        <Route path="audit/logistic/pending-purchase-invoice/details/:id"
         element={<ProtectRoute>
            <PIDetails
              csType="logistic"
              baseUrl="/audit"
              url="/logistic/audit/parts-invoice"
              icon="fas fa-user-shield"
              breadcrumbTitle="Audit"
              breadcrumbListTitle="Pending Logistic PI List"
              breadcrumbListUrl="/audit/logistic/pending-Purchase-invoice"
              cardTitle="Pending Logistic PI Details"
              permission=""
            />
          </ProtectRoute>}
          exact
       />
        <Route path="audit/logistic/approved-purchase-invoice/details/:id"
         element={<ProtectRoute>
          <PIDetails
            csType="logistic"
            baseUrl="/audit"
            url="/logistic/audit/parts-invoice"
            icon="fas fa-user-shield"
            breadcrumbTitle="Audit"
            breadcrumbListTitle="Approved Logistic PI List"
            breadcrumbListUrl="/audit/logistic/approved-Purchase-invoice"
            cardTitle="Approved Logistic PI Details"
            permission=""
          />
        </ProtectRoute>}
        exact
      />

        {/*Logistic*/}
        <Route path="logistic" element={ <ProtectRoute> <Logistic /> </ProtectRoute> } exact />
        <Route path="logistic/shipment-provider-rfq" element={ <ProtectRoute> <ShipmentProviderRfq /> </ProtectRoute> } exact />
        <Route path="logistic/shipment-provider-rfq/:id" element={ <ProtectRoute> <ShipmentProviderRfq /> </ProtectRoute> } exact />
        <Route path="logistic/pending-shipment-provider-rfq" element={ <ProtectRoute> <PendingShipmentProviderRfq /> </ProtectRoute> } exact />
        <Route path="logistic/pending-shipment-provider-rfq/details/:id" element={ <ProtectRoute> <PendingLogisticRFQDetails /> </ProtectRoute> } exact />
        <Route path="logistic/approved-shipment-provider-rfq/details/:id" element={ <ProtectRoute> <ApprovedLogisticRFQDetails /> </ProtectRoute> } exact />
        <Route path="logistic/approved-shipment-provider-rfq" element={ <ProtectRoute> <ApprovedShipmentProviderRfq /> </ProtectRoute> } exact />
        <Route path="logistic/shipment-provider-quotation" element={ <ProtectRoute> < ShipmentProviderQuotationList/> </ProtectRoute> } exact />
        <Route path="logistic/add-shipment-provider-quotation" element={ <ProtectRoute> < ShipmentProviderQuotation/> </ProtectRoute> } exact />
        <Route path="logistic/edit-shipment-provider-quotation/:id" element={ <ProtectRoute> < ShipmentProviderQuotation/> </ProtectRoute> } exact />
        <Route path="logistic/shipment-provider-quotation/details/:id" element={ <ProtectRoute> < ShipmentProviderQuotationDetails/> </ProtectRoute> } exact />

        <Route path="logistic/duty-fees/List" element={ <ProtectRoute featureId={permissions.subModuleItems.DUTY_FEES}> <DutyFeesList /> </ProtectRoute> } exact />
        <Route path="logistic/duty-fees/add" element={ <ProtectRoute featureId={permissions.subModuleItems.DUTY_FEES}> <DutyFees /> </ProtectRoute> } exact />
        <Route path="logistic/duty-fees/edit/:id" element={ <ProtectRoute featureId={permissions.subModuleItems.DUTY_FEES}> <DutyFees /> </ProtectRoute> } exact />
        <Route path="logistic/duty-fees/List/:id" element={ <ProtectRoute featureId={permissions.subModuleItems.DUTY_FEES}> <DutyFeesDetails /> </ProtectRoute> } exact />

        {/* Logistic CS */}
        <Route exact path="logistic/comparative-statement" element={<ProtectRoute featureId={permissions.subModuleItems.GENERATE_CS} ><LogisticCS/></ProtectRoute>} />
        <Route exact path="logistic/comparative-statement/:edit" element={<ProtectRoute featureId={permissions.subModuleItems.GENERATE_CS} ><LogisticCS/></ProtectRoute>} />
        <Route exact path="logistic/comparative-statement/detail/:id"
                    element={
                    <ProtectRoute>
                      <LogisticCSDetails
                        baseUrl="/logistic"
                        icon="fas fa-hand-holding-box"
                        breadcrumbTitle="logistic"
                        title="Pending Logistic CS Details"
                        breadcrumbListTitle="Pending Logistic CS List"
                        breadcrumbListUrl="/logistic/pending-comparative-statement"
                        cardTitle="Comparative Statement"
                        permission="LOGISTIC_LOGISTIC_COMPARATIVE_STATEMENT_LOGISTIC_PENDING_CS_SAVE"
                      />
                    </ProtectRoute>}
        />
        <Route exact path="logistic/comparative-statement/edit/:id"
         element={
          <ProtectRoute>
              <LogisticCSEdit
                title="Pending Logistic CS"
                breadcrumbListUrl="/logistic/pending-comparative-statement"
                cardTitle="Pending Logistic CS Details"
              />
          </ProtectRoute>}
         />
        <Route exact path="logistic/comparative-statement/disposal/edit/:id"
          element={
            <ProtectRoute>
              <LogisticCSEdit
                isEditDisposal={true}
                title="Approved Logistic CS"
                breadcrumbListUrl="/logistic/approved-comparative-statement"
                cardTitle="Approved Logistic CS Details"
              />
            </ProtectRoute>}
          />
        <Route exact path="logistic/final-approved-comparative-statement/detail/:id"
          element={
            <ProtectRoute>
              <LogisticCSDetails
                baseUrl="/logistic"
                icon="fas fa-hand-holding-box"
                breadcrumbTitle="logistic"
                title="Approved Logistic CS Details"
                breadcrumbListTitle="Approved Logistic CS List"
                breadcrumbListUrl="/logistic/final-approved-comparative-statement"
                cardTitle="Comparative Statement"
                permission="LOGISTIC_LOGISTIC_COMPARATIVE_STATEMENT_LOGISTIC_PENDING_CS_SAVE"
              />
            </ProtectRoute>}
        />
        <Route exact path="logistic/pending-comparative-statement" element={<ProtectRoute featureId={permissions.subModuleItems.PENDING_CS} ><LogisticPendingCS/></ProtectRoute>} />
        <Route exact path="logistic/approved-comparative-statement" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_CS} ><LogisticFinalApprovedCS/></ProtectRoute>} />
        <Route exact path="logistic/final-approved-comparative-statement" element={<ProtectRoute featureId={permissions.subModuleItems.APPROVED_CS}><LogisticFinalApprovedCS/></ProtectRoute>} />

        {/* Logistic CS Audit */}
        <Route path="audit/logistic/pending-audit-cs" element={ <ProtectRoute> <LogisticPendingAuditCS /> </ProtectRoute> } exact />
        <Route path="audit/logistic/approved-audit-cs" element={ <ProtectRoute> <LogisticApprovedAuditCS /> </ProtectRoute> } exact />
        <Route path="audit/logistic/pending-audit-cs-disposal/add/:id"
            element={
              <ProtectRoute>
                <LogisticAuditDisposal
                  title=" Pending Logistic Audit CS"
                  cardTitle="PENDING LOGISTIC AUDIT CS DISPOSAL EDIT"
                  breadcrumbListUrl="/audit/logistic/pending-audit-cs"
                />
              </ProtectRoute> }
                exact
           />
           <Route path="audit/logistic/approved-audit-cs-disposal/edit/:id"
            element={
              <ProtectRoute>
                <LogisticAuditDisposal
                  title=" Approved Logistic Audit CS"
                  cardTitle="APPROVED LOGISTIC AUDIT CS DISPOSAL EDIT"
                  breadcrumbListUrl="/audit/logistic/approved-audit-cs"
                />
              </ProtectRoute> }
                exact
           />
        <Route path="audit/logistic/pending-audit-cs/detail/:id"
         element={ <ProtectRoute>
              <LogisticCSDetails
                baseUrl="/audit"
                icon="fas fa-user-shield"
                breadcrumbTitle="audit"
                title="Pending Audit Logistic CS Details"
                breadcrumbListTitle="Pending Audit Logistic CS List"
                breadcrumbListUrl="/audit/logistic/pending-audit-cs"
                cardTitle="Comparative Statement"
                permission=""
              />
            </ProtectRoute> }
          exact
         />
         <Route path="audit/logistic/approved-audit-cs/detail/:id"
           element={ <ProtectRoute>
              <LogisticCSDetails
                baseUrl="/audit"
                icon="fas fa-user-shield"
                breadcrumbTitle="audit"
                title="Approved Audit Logistic CS Details"
                breadcrumbListTitle="Approved Audit Logistic CS List"
                breadcrumbListUrl="/audit/logistic/approved-audit-cs"
                cardTitle="Comparative Statement"
                permission=""
              />
             </ProtectRoute> }
          exact
         />

        {/* Logistic PO */}
        <Route path="logistic/purchase-order" element={<ProtectRoute featureId={permissions.subModuleItems.PURCHASE_ORDER}><LogisticPoList /></ProtectRoute>} exact/>
        <Route path="logistic/pending-purchase-order" element={<ProtectRoute><LogisticPendingPO/></ProtectRoute>} exact/>
        <Route path="logistic/approved-purchase-order" element={<ProtectRoute><LogisticApprovedPO/></ProtectRoute>} exact/>
        <Route path="logistic/purchase-order/add" element={<ProtectRoute featureId={permissions.subModuleItems.PURCHASE_ORDER}><LogisticPO /></ProtectRoute>} exact/>
        <Route path="logistic/purchase-order/edit/:id" element={<ProtectRoute><LogisticPO /></ProtectRoute>} exact/>
        <Route path="logistic/purchase-order/detail/:id" element={<ProtectRoute><LogisticDetailPO /></ProtectRoute>} exact/>
        <Route path="logistic/purchase-order/edit/:id" element={<ProtectRoute><LogisticEditPO /></ProtectRoute>} exact/>
        <Route path="logistic/purchase-order/print-detail/:id" element={<ProtectRoute><LogisticPoPrintDetails /></ProtectRoute>} exact/>

        {/* Logistic Purchase Invoice  */}
        <Route path="logistic/purchase-invoice" element={<ProtectRoute><LogisticPurchaseInvoice/></ProtectRoute>} exact/>
        <Route path="logistic/purchase-invoice/:id" element={<ProtectRoute><LogisticPurchaseInvoice/></ProtectRoute>} exact/>
        <Route path="logistic/purchase-invoice/print" element={<ProtectRoute><LogisticPurchaseInvoicePrint/></ProtectRoute>} exact/>

        <Route path="logistic/purchase-invoice/approved" element={<ProtectRoute><LogisticApprovedInvoice/></ProtectRoute>} exact/>
        <Route path="logistic/purchase-invoice/pending" element={<ProtectRoute><LogisticPendingInvoice/></ProtectRoute>} exact/>
        <Route path="logistic/purchase-invoice/approve-details/:id"
          element={<ProtectRoute>
              <PIDetails
                csType="logistic"
                baseUrl="/logistic"
                url="/logistic/own_department/parts-invoice"
                icon="fas fa-hand-holding-box"
                breadcrumbTitle="Logistic"
                breadcrumbListTitle="Approved Logistic PI List"
                breadcrumbListUrl="/logistic/purchase-invoice/approved"
                cardTitle="Approved Logistic PI Details"
                permission=""
              />
            </ProtectRoute>}
             exact
          />
          <Route path="logistic/purchase-invoice/pending-details/:id"
            element={<ProtectRoute>
              <PIDetails
                csType="logistic"
                baseUrl="/logistic"
                url="/logistic/own_department/parts-invoice"
                icon="fas fa-hand-holding-box"
                breadcrumbTitle="Logistic"
                breadcrumbListTitle="Pending Logistic PI List"
                breadcrumbListUrl="/logistic/purchase-invoice/pending"
                cardTitle="Pending Logistic PI Details"
                permission=""
              />
            </ProtectRoute>}
             exact
          />

        {/* Logistic Tracker */}
        <Route path="logistic/tracker" element={<ProtectRoute featureId={permissions.subModuleItems.TRACKER}><Tracker/></ProtectRoute>} exact/>
        <Route path="logistic/tracker/:id" element={<ProtectRoute featureId={permissions.subModuleItems.TRACKER}><Tracker/></ProtectRoute>} exact/>
        <Route path="logistic/tracker-list" element={<ProtectRoute featureId={permissions.subModuleItems.TRACKER}><TrackerList/></ProtectRoute>} exact/>
        <Route path="logistic/tracker-list/details/:id" element={<ProtectRoute featureId={permissions.subModuleItems.TRACKER}><TrackerDetails/></ProtectRoute>} exact/>

        {/* Departments */}
        <Route path="employees/departments" element={<ProtectRoute featureId={permissions.DEFAULT}>< DepartmentList /></ProtectRoute>} exact />
        <Route path="employees/departments/add" element={<ProtectRoute featureId={permissions.DEFAULT}>< DepartmentAdd /></ProtectRoute>} exact />
        <Route path="employees/departments/add/:id" element={<ProtectRoute featureId={permissions.DEFAULT}>< DepartmentAdd /></ProtectRoute>} exact />
        <Route path="employees/departments/details/:id" element={<ProtectRoute featureId={permissions.DEFAULT}>< DepartmentDetails /></ProtectRoute>} exact />

        {/* Section */}
        <Route path="employees/sections" element={<ProtectRoute featureId={permissions.DEFAULT}>< SectionList /></ProtectRoute>} exact />
        <Route path="employees/sections/add" element={<ProtectRoute featureId={permissions.DEFAULT}>< SectionAdd /></ProtectRoute>} exact />
        <Route path="employees/sections/add/:id" element={<ProtectRoute featureId={permissions.DEFAULT}>< SectionAdd /></ProtectRoute>} exact />
        <Route path="employees/sections/details/:id" element={<ProtectRoute featureId={permissions.DEFAULT}>< SectionDetails /></ProtectRoute>} exact />

        {/* Designation */}
        <Route path="employees/designations" element={<ProtectRoute featureId={permissions.DEFAULT}>< DesignationList /></ProtectRoute>} exact />
        <Route path="employees/designations/add" element={<ProtectRoute featureId={permissions.DEFAULT}>< DesignationAdd /></ProtectRoute>} exact />
        <Route path="employees/designations/add/:id" element={<ProtectRoute featureId={permissions.DEFAULT}>< DesignationAdd /></ProtectRoute>} exact />
        <Route path="employees/designations/details/:id" element={<ProtectRoute featureId={permissions.DEFAULT}>< DesignationDetails /></ProtectRoute>} exact />

        {/* employees*/}
        <Route path="employees" element={<ProtectRoute featureId={permissions.modules.RESOURCE_MANAGEMENT}><EmployeeIndex /></ProtectRoute>} exact />
        {/* <Route path="employess" element={<ProtectRoute featureId={permissions.DEFAULT}> <Employees></Employees> </ProtectRoute>} exact /> */}
        <Route path="employees/employee" element={<ProtectRoute featureId={permissions.DEFAULT}>< EmployeeList /></ProtectRoute>} exact />
        <Route path="employees/employee/add" element={<ProtectRoute featureId={permissions.DEFAULT}>< EmployeeAdd /></ProtectRoute>} exact />
        <Route path="employees/employee/add/:id" element={<ProtectRoute featureId={permissions.DEFAULT}>< EmployeeAdd /></ProtectRoute>} exact />
        <Route path="employees/employee/details/:id" element={<ProtectRoute featureId={permissions.DEFAULT}>< EmployeeDetails /></ProtectRoute>} exact />

        {/*Finance*/}
        <Route path="finance" element={<ProtectRoute featureId={permissions.DEFAULT}>< Finance /></ProtectRoute>} exact />
        <Route path="finance/procurement/pending-purchase-invoice" element={<ProtectRoute featureId={permissions.DEFAULT}>< PendingFinanceProcurementPIList /></ProtectRoute>} exact />
        <Route path="finance/procurement/approved-purchase-invoice" element={<ProtectRoute featureId={permissions.DEFAULT}>< ApprovedFinanceProcurementPiList /></ProtectRoute>} exact />
        <Route path="finance/procurement/pending-purchase-invoice/details/:id"
          element={<ProtectRoute>
              <PIDetails
                csType="material-management_finance"
                baseUrl="/finance"
                url="/procurement/finance/parts-invoice"
                icon="fas fa-coins"
                breadcrumbTitle="Finance"
                breadcrumbListTitle="Pending Procurement PI List"
                breadcrumbListUrl="/finance/procurement/pending-purchase-invoice"
                cardTitle="Pending Procurement PI Details"
                permission=""
              />
            </ProtectRoute>}
             exact
          />
          <Route path="finance/procurement/approved-purchase-invoice/details/:id"
            element={<ProtectRoute>
              <PIDetails
                csType="material-management_finance"
                baseUrl="/finance"
                url="/procurement/finance/parts-invoice"
                icon="fas fa-coins"
                breadcrumbTitle="Finance"
                breadcrumbListTitle="Approved Procurement PI List"
                breadcrumbListUrl="/finance/procurement/approved-purchase-invoice"
                cardTitle="Approved Procurement PI Details"
                permission=""
              />
            </ProtectRoute>}
             exact
          />
        <Route path="finance/logistic/pending-purchase-invoice" element={<ProtectRoute featureId={permissions.DEFAULT}>< PendingFinanceLogisticPi /></ProtectRoute>} exact />
        <Route path="finance/logistic/approved-purchase-invoice" element={<ProtectRoute featureId={permissions.DEFAULT}>< ApprovedFinanceLogisticPiList /></ProtectRoute>} exact />
        <Route path="finance/logistic/pending-purchase-invoice/details/:id"
          element={<ProtectRoute>
              <PIDetails
                csType="logistic_finance"
                baseUrl="/finance"
                url="/logistic/finance/parts-invoice"
                icon="fas fa-coins"
                breadcrumbTitle="Finance"
                breadcrumbListTitle="Pending Logistic PI List"
                breadcrumbListUrl="/finance/logistic/pending-purchase-invoice"
                cardTitle="Pending Logistic PI Details"
                permission=""
              />
            </ProtectRoute>}
             exact
          />
          <Route path="finance/logistic/approved-purchase-invoice/details/:id"
            element={<ProtectRoute>
              <PIDetails
                csType="logistic_finance"
                baseUrl="/finance"
                url="/logistic/finance/parts-invoice"
                icon="fas fa-coins"
                breadcrumbTitle="Finance"
                breadcrumbListTitle="Approved Logistic PI List"
                breadcrumbListUrl="/finance/logistic/approved-purchase-invoice"
                cardTitle="Approved Logistic PI Details"
                permission=""
              />
            </ProtectRoute>}
            exact
          />
      </Routes>
    </AppProvider>
  );
}

export default App;