import { Card, Col, DatePicker, Empty, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import Store from '../Store';
import PartDetails from './PartDetails';
import StoreDashBoardItem from './StoreDashBoardItem';
import StoreDashBoardTab from './StoreDashBoardTab';
import { useDashBoard } from './useDashBoard';
import ARMCard from "../../common/ARMCard";

const { RangePicker } = DatePicker;

const style = {
  yellow: {
    backgroundColor: '#ffedd5',
    color: '#fb923c',
    padding: '4px 10px',
    textAlign: 'center',
    borderRadius: '15px',
  },
  red: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    padding: '4px 10px',
    textAlign: 'center',
    borderRadius: '15px',
  },
  green: {
    backgroundColor: '#dcfce7',
    color: '#04aa6d',
    padding: '4px 10px',
    textAlign: 'center',
    borderRadius: '15px',
  },
};

const StoreDashBoard = ({ storeTab, setStoreTab }) => {
  const [partId, setPartId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    selectedDatedRange,
    setSelectedDatedRange,
    dashboardTableData,
    filterTableDataByDateRange,
    handleExcelDownload,
  } = useDashBoard();

  const overdue = (expireDate) => {
    let start = moment(expireDate, 'YYYY-MM-DD');
    let end = moment(new Date()).format('YYYY-MM-DD');

    // Difference between expireDate Date & Current Date
    let day = moment.duration(start.diff(end)).asDays();

    return day;
  };

  const calcOverdue = (over) => {
    if (over < 0) {
      return Math.abs(over) + ' Days';
    } else if (over === 0) {
      return 'Today';
    } else if (over === 1) {
      return 'Tomorrow';
    } else {
      return over + ' Days';
    }
  };

  const tableBody = () => {
    const tBody = dashboardTableData?.map((data, index) => {
      const over = overdue(data.expireDate);
      return (
        <tr
          key={index}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setIsModalOpen(true);
            setPartId(data.partId);
          }}
          title="Click for Details"
        >
          <td>{index + 1}</td>
          <td>{data.inspDate}</td>
          <td>{data.nomenclature}</td>
          <td>{data.partNo}</td>
          <td>{data.serialNo}</td>
          <td>{data.qty}</td>
          <td>{data.uom}</td>
          <td>{data.grnNo}</td>
          <td>{data.shelfLife}</td>
          <td>
            <span
              style={
                over < 0
                  ? style.red
                  : over >= 0 && over <= 3
                  ? style.yellow
                  : style.green
              }
            >
              {calcOverdue(over)}
            </span>
          </td>
          <td>
            <span
              style={
                over < 0
                  ? style.red
                  : over >= 0 && over <= 3
                  ? style.yellow
                  : style.green
              }
            >
              {over < 0
                ? 'Expired'
                : over >= 0 && over <= 3
                ? 'Expiring Soon'
                : over + ' days to Expire'}
            </span>
          </td>
          <td>{data.expireDate}</td>
          <td>{data.acType}</td>
        </tr>
      );
    });
    return tBody;
  };

  useEffect(() => {
    filterTableDataByDateRange();
  }, []);

  return (
    <CommonLayout>
      <StoreDashBoardTab>
        <div
          style={{
            marginTop: '15px',
            boxShadow:"5px 5px 5px 2px rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
          }}
          className={'button-background'}
        >
          <button
            className={storeTab === 1 ? 'button button-active' : 'button'}
            onClick={() => setStoreTab(1)}
          >
            <i className="fal fa-chart-line"></i>
            <span style={{ marginLeft: '5px' }}>Dashboard</span>
          </button>
          <button
            onClick={() => setStoreTab(2)}
            className={storeTab === 2 ? 'button button-active' : 'button'}
          >
            <i className="fal fa-bars"></i>
            <span style={{ marginLeft: '5px' }}>Menus</span>
          </button>
        </div>

        {storeTab === 1 && (
          <ARMCard
            title="EXPIRED & ABOUT TO EXPIRE"
            style={{
                margin: '25px 20px 0px 20px',
                borderRadius: '14px'
              }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <RangePicker
                  value={selectedDatedRange}
                  onChange={(value) => setSelectedDatedRange(value)}
                  style={{ marginBottom: '20px' }}
                  allowClear={false}
                />
                <ARMButton
                  onClick={() => filterTableDataByDateRange(selectedDatedRange)}
                  type="primary"
                  style={{
                    marginLeft: '15px',
                  }}
                >
                  Filter
                </ARMButton>
                <ARMButton
                  onClick={() => filterTableDataByDateRange()}
                  type="primary"
                  danger
                  style={{
                    marginLeft: '15px',
                  }}
                >
                  Reset
                </ARMButton>
              </div>
              <div>
                <ARMButton
                  onClick={handleExcelDownload}
                  type="primary"
                  danger
                  style={{
                    backgroundColor: '#04aa6d',
                    border: '1px solid #04aa6d',
                  }}
                >
                  Download
                </ARMButton>
              </div>
            </div>
            <div
              style={{
                overflow: 'auto',
                maxHeight: '406px',
              }}
            >
              <ResponsiveTable>
                <ARMTable id="table-to-excel">
                  <thead
                    style={{
                      backgroundColor: '#F3F5F9',
                    }}
                  >
                    <tr>
                      <th>SL No</th>
                      <th>Insp.Date</th>
                      <th>Nomenclature</th>
                      <th>Part No</th>
                      <th>Serial No.</th>
                      <th>Qty</th>
                      <th>UOM</th>
                      <th>Release No.(GRN)</th>
                      <th>Shelf Life</th>
                      <th>Overdue</th>
                      <th>Status</th>
                      <th>Expire Date</th>
                      <th>A/c Type</th>
                    </tr>
                  </thead>
                  <tbody>{tableBody()}</tbody>
                </ARMTable>
              </ResponsiveTable>
            </div>
            <Row>
              <Col style={{ margin: '0 auto' }}>
                {!dashboardTableData?.length && (
                  <Row>
                    <Empty style={{ marginTop: '20px' }} />
                  </Row>
                )}
              </Col>
            </Row>
          </ARMCard>
        )}

        <div className="content-tabs">
          <div
            className={storeTab === 1 ? 'content  active-content' : 'content'}
          >
            <StoreDashBoardItem />
          </div>
          <div
            className={storeTab === 2 ? 'content  active-content' : 'content'}
          >
            <Store />
          </div>
        </div>
      </StoreDashBoardTab>
      <PartDetails
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        partId={partId}
      />
    </CommonLayout>
  );
};

export default StoreDashBoard;
