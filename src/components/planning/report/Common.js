import moment from "moment";
import React from "react";
import FileServices from "../../../service/FileServices";
import {notifyResponseError} from "../../../lib/common/notifications";
import FolderServices from "../../../service/FolderServices";

const AH = "AH";
const AC = "AC";
const NA = "N/A";

const FH = "FH";
const FC = "FC";
const DY = "DY";


export const ApuHour = (value) => {
    if (value == -1) {
        return NA;
    } else if (value == 0.0) {
        return 0 + AH;
    } else if (value > -1) {
        return value + AH;
    } else {
        return NA;
    }
};

export const ApuCycle = (value) => {
    if (value == -1) {
        return "";
    } else if (value == 0) {
        return 0;
    } else if (value > -1) {
        return value;
    } else {
        return "";
    }
};

export const ApuHourDetails = (value) => {
    if (value == -1) {
        return "";
    } else if (value == 0.0) {
        return 0;
    } else if (value > -1) {
        return value;
    } else {
        return "";
    }
};
export const ApuHourDetailsWithFlag = (value) => {
    if (value == -1) {
        return "";
    } else if (value == 0) {
        return "0.00" + FH;
    } else if (value > -1) {
        return Number(value).toFixed(2).replace(".", ":") + FH
    } else {
        return "";
    }
};
export const ApuCycleDetailsWithFlag = (value) => {
    if (value == -1) {
        return "";
    } else if (value == 0) {
        return 0 + FC;
    } else if (value > -1) {
        return value + FC;
    } else {
        return "";
    }
};

export const ApuCycleDetails = (value) => {
    if (value == -1) {
        return "";
    } else if (value == 0) {
        return 0;
    } else if (value > -1) {
        return value;
    } else {
        return "";
    }
};

export const HourFormat = (value) => {
    if (value === 0) {
        return "0:00";
    } else if (value) {
        return Number(value).toFixed(2).replace(".", ":")

    } else {
        return "N/A";
    }
};

export const DailyFlyingHourFormat = (value) => {
    if (value === 0) {
        return "0:00";
    } else if (value) {
        return Number(value).toFixed(2).replace(".", ":")

    } else {
        return "";
    }
};


export const HourFormatWithName = (value) => {
    if (value == 0) {
        return "0:00" + FH;
    } else if (value) {
        return Number(value).toFixed(2).replace(".", ":") + FH;

    } else {
        return "N/A";
    }
};

export const DailyFlyingCycleFormat = (value) => {
    if (value === 0) {
        return "0";
    } else if (value) {
        return value;
    } else {
        return "";
    }
};

export const CycleFormat = (value) => {
    if (value === 0) {
        return "0";
    } else if (value) {
        return value;
    } else {
        return "N/A";
    }
};

export const CycleFormatWithFlag = (value) => {
    if (value === 0) {
        return "0" + FC;
    } else if (value) {
        return value + FC;
    } else {
        return "N/A";
    }
};

export const DateFormat = (date) => {
    if (date) {
        return moment(date).format("DD-MMM-YYYY");
    }
    return "N/A";
};

export const formatDate = (date) => {
    if (date) {
        return moment(date).format("YYYY-MM-DD");
    }
    return "";
};

export const DashboardDateFormat = (date) => {
    if (date) {
        return moment(date).format("DD-MMM-YYYY");
    }
    return "";
};

export const ViewDateFormat = (date) => {
    if (date) {
        return moment(date).format("DD-MM-YYYY");
    }
    return "";
};
export const ViewDateFormat2 = (date) => {
    if (date) {
        return moment(date).format("DD/MM/YYYY");
    }
    return "";
};

export const fhHour = (value) => {
    if (value ) {
        return Number(value).toFixed(2).replace(".", ":") ;
    } else if (value == 0 ) {
        return "0:00" ;
    } 
    return "N/A";
};

export const formatHour = (value, isApu) => {
    if (value && isApu) {
        return Number(value).toFixed(2).replace(".", ":") + AH;
    } else if (value && !isApu) {
        return Number(value).toFixed(2).replace(".", ":") + FH;
    } else if (value == 0 && !isApu) {
        return "0:00" + FH;
    } else if (value == 0 && isApu) {
        return "0:00" + AH;
    }
    return "N/A";
};
export const formatHourWithoutNotApplicable = (value, isApu) => {
    if (value && isApu) {
        return Number(value).toFixed(2).replace(".", ":") + AH;
    } else if (value && !isApu) {
        return Number(value).toFixed(2).replace(".", ":") + FH;
    } else if (value == 0 && !isApu) {
        return "0:00" + FH;
    } else if (value == 0 && isApu) {
        return "0:00" + AH;
    }
    return "";
};

export const formatCycleWithoutNotApplicable = (value, isApu) => {
    if (value && isApu) {
        return `${value}AC`;
    } else if (value && !isApu) {
        return `${value}FC`;
    } else if (value == 0 && isApu) {
        return "0" + AC;
    } else if (value == 0 && !isApu) {
        return "0" + FC;
    }
    return "";
};

export const formatCycle = (value, isApu) => {
    if (value && isApu) {
        return `${value} AC`;
    } else if (value && !isApu) {
        return `${value} FC`;
    } else if (value == 0 && isApu) {
        return "0" + AC;
    } else if (value == 0 && !isApu) {
        return "0" + FC;
    }
    return "N/A";
};

export const selectStatus = (id) => {
    switch (id) {
        case 0:
            return "OPEN";
        case 1:
            return "CLOSE";
        case 2:
            return "REP";
    }
};

export const CalculateTsnTsoTat = (value) => {
    if (value == 0) {
        return "0:00";
    } else if (value) {
        return Number(value).toFixed(2).replace(".", ":");
    } else {
        return "N/A";
    }
};

export const pageSerialNo = (currentPage, index) => {
    const serialNo = (currentPage - 1) * 10 + index;
    return serialNo;
};

export const pageSerialNoWithSize = (currentPage,size, index) => {
    const serialNo = (currentPage - 1) * size + index;
    return serialNo;
};

export const formatLifeLimitWithUnit = (value, unit) => {
    if (value && unit === 0) {
        return value + FH;
    } else if (value && unit === 1) {
        return value + FC;
    } else if (value && unit === 2) {
        return value + AH;
    } else if (value && unit === 3) {
        return value + AC;
    } else if (value && unit === 4) {
        return value + DY;
    } else {
        return "N/A";
    }
};


export const getFolderPathByMatchedString = async (matchedString) => {
    try {
        const {data} = await FolderServices.searchFolderMatchString(
            matchedString
        );

        if (data.folderPath) {
            window.open(`${data?.folderPath}/` + `${data?.id}`, '_blank')
        } else {
            return
        }

    } catch (er) {
        notifyResponseError(er)
    }
}

export const PercentageFormat = (value) => {
    if (value == 0) {
        return "0";
    } else if (value) {
        return Number(value).toFixed(2)

    } else {
        return "N/A";
    }
};

export const formatDuration = (value) => {
    if (value == 0) {
        return "0:00";
    } else if (value) {
        return Number(value).toFixed(2).replace(".", ":");

    } else {
        return "N/A";
    }
};
