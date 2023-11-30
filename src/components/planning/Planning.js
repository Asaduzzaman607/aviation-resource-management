import { List, Row, Col} from "antd";
import { Link } from "react-router-dom";
import ARMCard from "../common/ARMCard";
import permissions from "../auth/permissions";
import {useMemo, useState} from "react";
import useFeaturesPermission, {Types} from "../../lib/hooks/useFeaturesPermission";

export default function Planning() {

  const {hasPermission} = useFeaturesPermission();

  const [planningSubmodules] = useState([
    {
      name: "Aircraft",
      permission: permissions.subModules.AIRCRAFT,
      features: [
        { name: "Aircrafts", url: "aircraft", permission: permissions.subModuleItems.AIRCRAFT },
        { name: "Aircraft Check Done", url: "ac-check-done", permission: permissions.subModuleItems.AC_CHECK_DONE },
        {name: "Seating Configurations", url: "seating-configurations", permission: permissions.subModuleItems.SEATING_CONFIGURATION},
        { name: "Locations", url: "locations", permission: permissions.subModuleItems.AIRCRAFT_LOCATION },
        { name: "Positions", url: "positions", permission: permissions.subModuleItems.POSITION },
        { name: "Models", url: "models", permission: permissions.subModuleItems.MODEL },
        { name: "Parts", url: "parts", permission: permissions.subModuleItems.PARTS },
        { name: "Serials", url: "serials", permission: permissions.subModuleItems.SERIAL }, // doesn't have any sub-module-item code yet
        { name: "Model Trees", url: "model-trees", permission: permissions.subModuleItems.MODEL_TREES },
        { name: "Build Aircraft", url: "aircraft-builds", permission: permissions.subModuleItems.BUILD_AIRCRAFT },
        // { name: "A Phase Check", url: "phase-check" },
      ],
    },
    {
      name: "Configurations",
      permission: permissions.subModules.CONFIGURATIONS,
      features: [
        { name: "A/C Type", url: "aircraft-model-family", permission: permissions.subModuleItems.AC_TYPE },
        { name: "Airport", url: "airports", permission: permissions.subModuleItems.AIRPORT },
        { name: "Cabin (Seat Type)", url: "cabins", permission: permissions.subModuleItems.CABIN_SEAT_TYPE },
      ],
    },

    {
      name: "Aircraft Technical Log",
      permission: permissions.subModules.AIRCRAFT_TECHNICAL_LOG,
      features: [
        { name: "ATL Books", url: "atl-books", permission: permissions.subModuleItems.ATL_BOOKS },
        { name: "ATL", url: "atl", permission: permissions.subModuleItems.ATL },
        { name: "Daily Flying Hours & Cycles", url: "daily-flying-hours-and-cycles", permission: permissions.subModuleItems.DAILY_FLYING_HOURS_CYCLES },
        { name: "Daily Utilization Record", url: "daily-utilization-record", permission: permissions.subModuleItems.DAILY_UTILIZATION_RECORD },
        { name: "Monthly Utilization Record", url: "monthly-utilization-record", permission: permissions.DEFAULT },
        { name: "Yearly Utilization Record", url: "yearly-utilization-record", permission: permissions.DEFAULT },
        { name: "Sector-Wise Utilization", url: "sectorwise-utilization", permission: permissions.subModuleItems.SECTOR_WISE_UTILIZATION },
        { name: "Oil & Fuel Uplift Report", url: "oil-uplift-report", permission: permissions.subModuleItems.OIL_AND_FUEL_UPLIFT_RECORD },
        { name: "Aircraft MEL and CDL Status", url: "aircraft-mel-cdl-status", permission: permissions.subModuleItems.AIRCRAFT_MEL_CDL_STATUS },
        { name: "Non Routine Card", url: "non-routine-card", permission: permissions.subModuleItems.NON_ROUTINE_CARD },
        { name: "Maintenance / Defect Register", url: "maintenance/defect-register", permission: permissions.subModuleItems.MAINTENANCE_DEFECT_REGISTER },
        { name: "Signatures", url: "signatures", permission: permissions.subModuleItems.SIGNATURES },
      ],
    },

    {
      name: "Schedule Tasks",
      permission: permissions.subModules.SCHEDULE_TASKS,
      features: [
        { name: "Task Type", url: "task-type", permission: permissions.subModuleItems.TASK_TYPE },
        { name: "Task Records", url: "task-records", permission: permissions.subModuleItems.TASK_RECORDS },
        { name: "Task Done", url: "task-done-list", permission: permissions.subModuleItems.TASK_DONE },
        { name: "Aircraft Tasks", url: "aircraft-tasks", permission: permissions.subModuleItems.AIRCRAFT_TASK },
        { name: "Airframe & Appliance AD Status", url: "airframe-appliance-ad-status", permission: permissions.subModuleItems.AIRFRAME_AND_APPLIANCE_AD_STATUS },
        { name: "AMP Status", url: "amp-status", permission: permissions.subModuleItems.AMP_STATUS },
        { name: "Aircraft Hard Time Component Status", url: "aircraft-hard-time-component-status", permission: permissions.subModuleItems.AIRCRAFT_HARD_TIME_COMPONENT_STATUS },

        { name: "Service Bulletin List", url: "service-bulletin-list", permission: permissions.subModuleItems.SERVICE_BULLETIN_LIST },
        { name: "STC and MOD Status", url: "stc-and-mod-status", permission: permissions.subModuleItems.STC_AND_MOD_STATUS },
        { name: "Maintenance Work Orders", url: "mwos", permission: permissions.subModuleItems.MAINTENANCE_WORK_ORDERS },
        { name: "Task Forecasts", url: "task-forecasts", permission: permissions.subModuleItems.TASK_FORECASTS },

      ],
    },

    {
      name: "Engine, Propeller & Landing Gear",
      permission: permissions.subModules.ENGINE_PROPELLER_LANDING_GEAR,
      features: [
        { name: "Engine Information", url: "engine/times", permission: permissions.subModuleItems.ENGINE_INFORMATION },
        { name: "Engine LLP's Status", url: "engine-llps-status", permission: permissions.subModuleItems.ENGINE_LLP_STATUS },
        { name: "Removal Engine LLP's Status", url: "removal-engine-llps-status", permission: '' },
        { name: "Engine Ad Status", url: "engine-ad-status", permission: permissions.subModuleItems.ENGINE_AD_STATUS },
        { name: "Propeller Status", url: "propeller-status", permission: permissions.subModuleItems.PROPELLER_STATUS },
        { name: "Main Landing Gear Status", url: "main-landing-gear-status", permission: permissions.subModuleItems.MAIN_LANDING_GEAR_STATUS },
        { name: "Nose Landing Gear Status", url: "nose-landing-gear-status", permission: permissions.subModuleItems.NOSE_LANDING_GEAR_STATUS },
        { name: "Removed Nose Landing Gear Status", url: "nlg-removed-status", permission: permissions.DEFAULT },
        { name: "Removed Main Landing Gear Status", url: "mlg-removed-status", permission: permissions.DEFAULT },
      ],
    },

    {
      name: "Check",
      permission: permissions.subModules.CHECK,
      features: [
        { name: "Checks", url: "checks", permission: permissions.subModuleItems.CHECK },
        { name: "A/C Checks", url: "ac-checks", permission: permissions.subModuleItems.AC_CHECKS },
        { name: "A/C Check Index", url: "ac-check-index", permission: permissions.subModuleItems.AC_CHECK_INDEX },
        { name: "Work Scope Approval", url: "work-scope-approval", permission: permissions.subModuleItems.WORK_SCOPE_APPROVAL },
        { name: "Man Hours", url: "man-hours", permission: permissions.subModuleItems.MAN_HOURS },
        { name: "Work Package Summary", url: "work-package-summary", permission: permissions.subModuleItems.WORK_PACKAGE_SUMMARY },
        { name: "Work Package Certification Record", url: "work-package-certification-record", permission: permissions.subModuleItems.WORK_PACKAGE_CERTIFICATION_RECORD },
        { name: "NRC Control List", url: "nrc-control-list", permission: permissions.subModuleItems.NRC_CONTROL_LIST },
      ],
    },

    {
      name: "Settings",
      permission: permissions.DEFAULT,
      features: [
        { name: "AMP Revision", url: "amp-revisions", permission: permissions.DEFAULT, }
      ],
    },
    {
      name: "Others",
      permission: permissions.subModules.OTHERS,
      features: [
        { name: "Aircraft Component History Card", url: "aircraft-component-history-card", permission: permissions.subModuleItems.AIRCRAFT_COMPONENT_HISTORY_CARD, },
        { name: "On Condition Components List", url: "on-condition-component-status", permission: permissions.subModuleItems.ON_CONDITION_COMPONENT_LIST, },
        { name: "APU LLP Last Shop Visit Info", url: "last-shop-info", permission: permissions.DEFAULT, },
        { name: "APU LLP Status", url: "apu-llp-status", permission: permissions.DEFAULT, },
        { name: "REMOVAL APU LLP Status", url: "removal-apu-llps-status", permission: permissions.DEFAULT, }
        
      ],
    },
    {
      name: "Planning Folders",
      permission: permissions.subModules.PLANNING_FOLDERS,
      features: [
        { name: "ATL", url: "folder/atl-files", permission: permissions.subModuleItems.FOLDER_ATL, },
        { name: "Work Order", url: "folder/work-order-files", permission: permissions.subModuleItems.FOLDER_WORK_ORDER, },
        { name: "AD", url: "folder/ad-files", permission: permissions.subModuleItems.FOLDER_AD, },
        { name: "SB", url: "folder/sb-files", permission: permissions.subModuleItems.FOLDER_SB, },
        { name: "OUT OF PHASE TASK CARD", url: "folder/out-of-phase-task-card-files", permission: permissions.subModuleItems.FOLDER_OUT_OF_PHASE_TASK_CARD, },
        { name: "ARC", url: "folder/arc-files", permission: permissions.subModuleItems.FOLDER_ARC, },
        { name: "DMI LOG", url: "folder/dmi-log-files", permission: permissions.subModuleItems.FOLDER_DMI_LOG, },
        { name: "CDL LOG", url: "folder/cdl-log-files", permission: permissions.subModuleItems.FOLDER_CDL_LOG, },
        { name: "ON BOARD DOCUMENTS", url: "folder/on-board-document-files", permission: permissions.subModuleItems.FOLDER_ON_BOARD_DOCUMENTS, },
        { name: "LETTERS", url: "folder/letter-files", permission: permissions.subModuleItems.FOLDER_LETTERS, },
        { name: "TASK DONE", url: "folder/task-done-files", permission: permissions.DEFAULT, },
        { name: "OTHERS", url: "folder/other-files", permission: permissions.subModuleItems.FOLDER_OTHERS, },
      ],
    }
  ])
  const filteredPlanningSubmodules = useMemo(
    () => planningSubmodules
      .filter(item => hasPermission(item.permission, Types.SUB_MODULE))
      .map(({name, permission, features}) => {
        return {
          name,
          permission,
          features: features.filter(feature => hasPermission(feature.permission, Types.SUB_MODULE_ITEM))
        }
      }),
    [planningSubmodules]
  );

  return (
    // <CommonLayout>
      <Row gutter={[15, 25]}>
        {filteredPlanningSubmodules.map((subModule) => (
          <Col key={subModule.name} md={6} sm={12} xs={24}>
            <ARMCard title={subModule.name?.toUpperCase()}>
              <List
                itemLayout="horizontal"
                dataSource={subModule.features}
                renderItem={(item) => (
                  <List.Item>
                    <Link style={{ width: "100%" }} to={`/planning/${item.url}`}>
                      {item.name}
                    </Link>
                  </List.Item>
                )}
              />
            </ARMCard>
          </Col>
        ))}
      </Row>
    // </CommonLayout>
  );
}
