import moment from "moment";
import { useEffect, useState } from "react";
import { utils, writeFile } from 'xlsx';
import { notifyResponseError } from "../../../lib/common/notifications";
import StoreDashBoardService from "../../../service/store/StoreDashBoardService";

export function useDashBoard() {
  const currentDate = moment();
  const futureDate = moment().add(10, 'days');
  const pastDate = moment().subtract(10, 'days');
  const [demand, setDemand] = useState([])
  const [issue, setIssue] = useState([])
  const [requisition, setRequisition] = useState([])
  const [scrapPart, setScrapPart] = useState([])
  const [returnPart, setReturnPart] = useState([])
  const[scrapPartMonth,setScrapPartMonth]=useState('')
  const[returnPartMonth,setReturnPartMonth]=useState('')
  const [selectedDatedRange, setSelectedDatedRange] = useState([
    pastDate,
    futureDate,
  ]);
  const [dashboardTableData, setDashboardTableData] = useState([]);

  function getMonthName(monthNo) {
    let month;
    switch (monthNo) {
      case 1:
        month = "January";
        break;
      case 2:
        month = "February";
        break;
      case 3:
        month = "March";
        break;
      case 4:
        month = "April";
        break;
      case 5:
        month = "May";
        break;
      case 6:
        month = "June";
        break;
      case 7:
        month = "July";
        break;
      case 8:
        month = "August";
        break;
      case 9:
        month = "September";
        break;
      case 10:
        month = "October";
        break;
      case 11:
        month = "November";
        break;
      case 12:
        month = "December";
        break;
      default:
        break;
    }
    return month;
  }

  const getDashBoardItems = async () => {
    let {data} = await StoreDashBoardService.getAllDashBoardData();

    const {storeDemandData, storeIssueData, procurementRequisitionData, returnPartInfo, scrapPartInfo} = data;
    const demand = storeDemandData?.map((data) => {
      return{
        month:getMonthName(data.month),
        count:data.count
      }
    })
     setDemand(demand);
    const issue = storeIssueData?.map((data) => {
      return{
        month:getMonthName(data.month),
        count:data.count
      }
    })
    setIssue(issue);
    const requisition = procurementRequisitionData?.map((data) => {
      return{
        month:getMonthName(data.month),
        count:data.count
      }
    })
     setRequisition(requisition);
    const returnPart= returnPartInfo?.map((data)=>{
      setReturnPartMonth(getMonthName(data.month))
      return{
        type:data.partStatus,
        month:getMonthName(data.month),
        value:data.count
      }
    })
    setReturnPart(returnPart);
    const scrap = scrapPartInfo?.map((data) => {
      setScrapPartMonth(getMonthName(data.month))
      return{
        type:data.partClassification===0?"Rotable":"Consumable",
        month:getMonthName(data.month),
        value:data.count
      }
    })
    setScrapPart(scrap);
  }

  useEffect(() => {
    getDashBoardItems().catch(console.error)
  }, [])

  const filterTableDataByDateRange = async (
    dateRange = [pastDate, futureDate]
  ) => {
    try {
      const { data } = await StoreDashBoardService.getAllDashBoardInfo(
        dateRange[0].format('YYYY-MM-DD'),
        dateRange[1].format('YYYY-MM-DD')
      );
      setDashboardTableData(data);
      setSelectedDatedRange(dateRange);
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const handleExcelDownload = () => {
    const table = document.getElementById('table-to-excel');
    const workbook = utils.table_to_book(table);
    writeFile(
      workbook,
      `Life_Expired_Items_${currentDate.format('YYYY-MM-DD')}.xlsx`
    );
  };

  return {
    scrapPart,
    demand,
    issue,
    returnPart,
    requisition,
    scrapPartMonth,
    returnPartMonth,
    selectedDatedRange,
    setSelectedDatedRange,
    dashboardTableData,
    filterTableDataByDateRange,
    handleExcelDownload
  };
}