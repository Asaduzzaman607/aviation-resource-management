import moment from 'moment';
import { useEffect, useState } from 'react';
import { utils, writeFile } from 'xlsx';
import UnserviceableItemService from '../../../service/store/UnserviceableItemService';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';

export default function UnserviceableReportPrint({ downloadReport }) {
  const currentDate = moment();
  const [tableData, setTableData] = useState([]);

  const unserviceableReportData = async () => {
    try {
      const { data } =
        await UnserviceableItemService.getUnserviceableReportData();
      setTableData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    unserviceableReportData();
  }, []);

  const handleExcelDownload = () => {
    const table = document.getElementById('table-to-excel');
    const workbook = utils.table_to_book(table);
    writeFile(
      workbook,
      `unserviceableComponentList_${currentDate.format('YYYY-MM-DD')}.xlsx`
    );
  };

  useEffect(() => {
    downloadReport && handleExcelDownload();
  }, [downloadReport]);

  return (
    <ResponsiveTable style={{ display: 'none' }}>
      <ARMTable id="table-to-excel">
        <thead>
          <tr>
            <td>S/N</td>
            <td>PART NO</td>
            <td>DESCRIPTION</td>
            <td>SERIAL NO.</td>
            <td>REMOVED FROM</td>
            <td>REMOVED DATE</td>
            <td>REASON REMOVED</td>
            <td>RTND BY & ID</td>
            <td>RCVD BY & ID</td>
            <td>LOCATION</td>
            <td>REMARKS</td>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.partNo}</td>
              <td>{item.description}</td>
              <td>{item.serialNo}</td>
              <td>{item.removedFrom}</td>
              <td>{item.removedDate}</td>
              <td>{item.reasonRemoved}</td>
              <td>{item.rtndById}</td>
              <td>{item.rcvdById}</td>
              <td>{item.location}</td>
              <td>{item.remarks}</td>
            </tr>
          ))}
        </tbody>
      </ARMTable>
    </ResponsiveTable>
  );
}
