const permissions = {

    DEFAULT: 0,

    modules: {
        STORE: 100, //yes
        //PROCUREMENT: 200, //yes
        PLANNING: 300, //yes
        CONFIGURATION: 400,
        MATERIAL_MANAGEMENT: 401,
        QUALITY: 500,
        STORE_INSPECTOR: 600, //yes
        LOGISTIC:700,
        AUDIT:800,
        FINANCE:900,
        RESOURCE_MANAGEMENT: 901,
        FRS: 902
    },

    subModules: {
        PARTS_DEMAND: 4000,
        PARTS_ISSUE: 4001,
        STORE_CONFIGURATION: 4002,
        PARTS_RETURN: 4003,
        PARTS_REQUISITION: 4004,
        UNSERVICEABLE_ITEM: 4005,
        SCRAP_PARTS: 4006,
        STORE_PARTS_AVAILABILITY: 4007,
        QUOTE_REQUEST: 4008,
        CONFIGURATION: 4018,
        ORDER: 4010,
        COMPARATIVE_STATEMENT: 4011,
        AIRCRAFT: 4012,
        CONFIGURATIONS: 4013,
        AIRCRAFT_TECHNICAL_LOG: 4014,
        SCHEDULE_TASKS: 4015,
       // REPORTS: 4016,
        CHECK: 4017,
        ADMINISTRATION: 4019,
        MANUFACTURER: 4020,
        STORE_INSPECTOR: 4022,
        INSPECTION_CHECKLIST: 4023,
        Aircraft_Information: 4024,
        Planning_Document: 4025,
        Flight_Data: 4026,
        Daily_Inspection_DI: 4027,
        CONFIGURATION_MANUFACTURER:4031,
        QUALITY_MANUFACTURER:4020,
        QUALITY_SUPPLIER:4021,
        MATERIAL_MANAGEMENT_SUPPLIER:4032,
        MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER:4033,
        QUALITY_SHIPMENT_PROVIDER:4030,
        QUALITY_INSPECTION_CHECKLIST:4034,
        ENGINE_PROPELLER_LANDING_GEAR:4035,
        OTHERS:4036,
        PLANNING_FOLDERS:4037,
        DASHBOARD:4038,
        LOGISTIC_PARTS_INVOICE_AUDIT:4045,
        MATERIAL_MANAGEMENT_PARTS_INVOICE_AUDIT:4043,
        MATERIAL_MANAGEMENT_PARTS_INVOICE_FINANCE:4044,
        LOGISTIC_PARTS_INVOICE_FINANCE:4046,
        RESOURCE_MANAGEMENT_SUBMODULE: 4047,
        PARTS_RECEIVE: 4048,
        SETTINGS: 4049,
        LOGISTIC_TRACKER:4051,
        DUTY_FEES: 4050
    },

    subModuleItems: {
        STORE_DEMAND: 50000,
        PENDING_DEMAND: 50001,
        APPROVED_DEMAND: 50002,
        DEMAND_REPORT: 50003,
        ISSUE_DEMAND: 50004,
        PENDING_ISSUES: 50005,
        APPROVED_ISSUES: 50006,
        ISSUE_REPORT: 50007,
        TECHNICAL_STORE: 50008,
        ROOM: 50009,
        RACK: 50010,
        RACK_ROW: 50011,
        RACK_ROW_BIN: 50012,
        STOCK_ROOM: 50013,
        UNIT_OF_MEASUREMENT: 50014,
        PARTS_RETURN: 50015,
        PENDING_PARTS_RETURN: 50016,
        APPROVED_PARTS_RETURN: 50017,
        MATERIAL_MANAGEMENT_REQUISITION: 50018,
        PENDING_MATERIAL_MANAGEMENT_REQUISITION: 50019,
        APPROVED_MATERIAL_MANAGEMENT_REQUISITION: 50020,
        MATERIAL_MANAGEMENT_REQUISITION_REPORT: 50021,
        UNSERVICEABLE_ITEM: 50022,
        SCRAP_PARTS: 50023,
        PENDING_SCRAP_PARTS: 50114,
        APPROVED_SCRAP_PARTS: 50115,
        STORE_PARTS: 50024,
        PARTS_AVAILABILITY: 50025,
        REQUEST_FOR_QUOTATION_RFQ: 50026,
        PENDING_RFQ: 50027,
        APPROVED_RFQ: 50028,
        QUOTATION: 50029,
        MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER: 50030,
        MATERIAL_MANAGEMENT_SUPPLIER: 50031,
        PURCHASE_ORDER: 50032,
        GENERATE_CS: 50033,
        PENDING_CS: 50034,
        APPROVED_CS: 50035,
        AIRCRAFT: 50036,
        SEATING_CONFIGURATION: 50037,
        AIRCRAFT_LOCATION: 50038,
        POSITION: 50039,
        MODEL: 50040,
        PARTS: 50041,
        MODEL_TREES: 50042,
        BUILD_AIRCRAFT: 50043,
        AC_TYPE: 50044,
        AIRPORT: 50045,
        CABIN_SEAT_TYPE: 50046,
        ATL: 50047,
        SIGNATURES: 50048,
       // ADD_MEL_CDL_STATUS: 50049,
        ATL_BOOKS: 50050,
        TASK_RECORDS: 50051,
        TASK_DONE: 50052,
        TASK_FORECASTS: 50053,
        AIRCRAFT_TASK: 50054,
        CONSUMABLE_PARTS: 50055,
        MAINTENANCE_WORK_ORDERS: 50056,
        TASK_TYPE: 50057,
        //AIRFRAME_APPLIANCE_AD_STATUS: 50058,
        DAILY_FLYING_HOURS_CYCLES: 50059,
        ENGINE_LLP_STATUS: 50060,
        AIRCRAFT_COMPONENT_HISTORY_CARD: 50061,
        AIRCRAFT_HARD_TIME_COMPONENT_STATUS: 50062,
        INSPECTION_CONTROL_CARD: 50063,
        AMP_STATUS: 50064,
        MAN_HOURS: 50065,
        AIRCRAFT_MEL_CDL_STATUS: 50066,
        NRC_CONTROL_LIST: 50067,
        WORK_PACKAGE_SUMMARY: 50068,
        WORK_PACKAGE_CERTIFICATION_RECORD: 50069,
        WORK_PACKAGE_TASK_INDEX: 50070,
        WORK_SCOPE_APPROVAL: 50071,
        ON_CONDITION_COMPONENT_LIST: 50072,
        SERVICE_BULLETIN_LIST: 50073,
        ENGINE_AD_STATUS: 50075,
        PROPELLER_STATUS: 50076,
        AIR_WORTHINESS_DIRECTIVE: 50077,
        //OIL_UPLIFT_REPORT: 50078,
        SECTOR_WISE_UTILIZATION: 50079,
        CHECK: 50080,
        AC_CHECKS: 50081,
        AC_CHECK_INDEX: 50082,
        BASE_PLANT: 50083,
        BASE: 50084,
        LOCATION: 50085,
        COMPANY: 50086,
        CONFIGURATION_MANUFACTURE: 50087,
        EXTERNAL_COMPANY: 50088,
        CURRENCY: 50089,
        VENDOR_CAPABILITIES: 50090,
        USERS: 50091,
        ROLES: 50092,
        ACCESS_RIGHTS: 50093,
        MODULE: 50094,
        SUB_MODULE: 50095,
        SUB_MODULE_ITEM: 50096,
        WORKFLOW_ACTIONS: 50097,
        APPROVAL_SETTINGS: 50098,
        NOTIFICATION_SETTINGS: 50099,
        CONFIGURATION_MANUFACTURER_PENDING_LIST: 50100,
        CONFIGURATION_MANUFACTURER_APPROVED_LIST: 50101,
        STORE_INSPECTION: 50102,
        STORE_INSPECTOR_INSPECTION_CHECKLIST: 50103,
        PARTS_INVOICE:50113,
        QUALITY_MANUFACTURER_PENDING_LIST:50120,
        QUALITY_SUPPLIER_PENDING_LIST:50124,
        QUALITY_SUPPLIER_APPROVED_LIST:50125,
        QUALITY_SHIPMENT_PROVIDER_PENDING_LIST:50122,
        QUALITY_SHIPMENT_PROVIDER_APPROVED_LIST:50123,
        QUALITY_PENDING_INSPECTION_CHECKLIST:50126,
        QUALITY_MANUFACTURER_APPROVED_LIST:50121,
        MATERIAL_MANAGEMENT_SUPPLIER_PENDING_LIST:50118,
        MATERIAL_MANAGEMENT_SUPPLIER_APPROVED_LIST:50119,
        MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_PENDING_LIST:50116,
        MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_APPROVED_LIST:50117,
        STORE_INSPECTOR_PENDING_INSPECTION_CHECKLIST: 50104,
        STORE_INSPECTOR_APPROVED_INSPECTION_CHECKLIST:50105,
        QUALITY_APPROVED_INSPECTION_CHECKLIST:50127,
        AC_CHECK_DONE:50128,
        SERIAL:50129,
        DAILY_FLYING_HOURS_AND_CYCLE:50130,
       // ENGINE_LLP_STATUS:50060,
        DAILY_UTILIZATION_RECORD:50131,
        OIL_AND_FUEL_UPLIFT_RECORD:50132,
        NON_ROUTINE_CARD:50133,
        MAINTENANCE_DEFECT_REGISTER:50134,
        AIRFRAME_AND_APPLIANCE_AD_STATUS:50135,
        STC_AND_MOD_STATUS: 50136,
        ENGINE_INFORMATION:50137,
        MAIN_LANDING_GEAR_STATUS:50138,
        NOSE_LANDING_GEAR_STATUS:50139,
       // ON_CONDITION_COMPONENT_LIST:50072,
        FOLDER_ATL:50140,
        FOLDER_WORK_ORDER:50141,
        FOLDER_AD:50142,
        FOLDER_SB:50143,
        FOLDER_OUT_OF_PHASE_TASK_CARD:50144,
        FOLDER_ARC:50145,
        FOLDER_DMI_LOG:50146,
        FOLDER_CDL_LOG:50147,
        FOLDER_ON_BOARD_DOCUMENTS:50148,
        FOLDER_LETTERS:50149,
        FOLDER_OTHERS:50150,
        DASHBOARD_ITEM:50151,
        MATERIAL_MANAGEMENT_PENDING_PARTS_INVOICE_AUDIT:50165,
        MATERIAL_MANAGEMENT_APPROVED_PARTS_INVOICE_AUDIT:50166,
        LOGISTIC_PENDING_PARTS_INVOICE_AUDIT:50169,
        LOGISTIC_APPROVED_PARTS_INVOICE_AUDIT:50170,
        MATERIAL_MANAGEMENT_PENDING_PARTS_INVOICE_FINANCE:50167,
        MATERIAL_MANAGEMENT_APPROVED_PARTS_INVOICE_FINANCE:50168,
        LOGISTIC_PENDING_PARTS_INVOICE_FINANCE:50171,
        LOGISTIC_APPROVED_PARTS_INVOICE_FINANCE:50172,
        DEPARTMENT: 50173,
        SECTION: 50174,
        DESIGNATION: 50175,
        EMPLOYEE: 50176,
        INWARD: 50177,
        REMOVED_MAIN_LANDING_GEAR_STATUS: 50178,
        REMOVED_NOSE_LANDING_GEAR_STATUS: 50179,
        REMOVED_ENGINE_LLP_STATUS: 50180,
        APU_LLP_STATUS : 50181,
        REMOVAL_APU_LLP_STATUS : 50182,
        APU_LLP_LAST_SHOP_VISIT_INFO : 50183,
        AMP_REVISION : 50184,
        FOLDER_TASK_DONE : 50185,
        MONTHLY_UTILIZATION_RECORD : 50186,
        YEARLY_UTILIZATION_RECORD : 50187,
        DUTY_FEES: 50189,
        TRACKER:50190
    }
}

export default permissions;
