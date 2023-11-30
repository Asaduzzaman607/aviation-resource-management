import { Breadcrumb, Checkbox } from 'antd';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';

const UnusableItemPrintFormat = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/store">
              {' '}
              <i className="fas fa-archive" /> &nbsp;Store
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;Unusable Item Print</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard title="Unusable Item Print">
        <ResponsiveTable ref={componentRef}>
          <ARMTable>
            <thead>
              <tr>
                <th rowSpan={2}>Return SL No</th>
                <th rowSpan={2}>Shop/Department No</th>
                <th rowSpan={2}>Location No</th>
                <th colSpan={2}>Work order</th>
                <th rowSpan={2}>A/C Reg No</th>
                <th rowSpan={2}>Stock Room No</th>
                <th rowSpan={2}>Return Voucher No</th>
                <th rowSpan={2}>Date</th>
              </tr>
              <tr>
                <th>Number</th>
                <th>Serial No</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </ARMTable>
          <ARMTable>
            <thead>
              <tr>
                <th>SL</th>
                <th>Part No</th>
                <th>Description</th>
                <th>Unit</th>
                <th>Qty. Return</th>
                <th>Unserviceable Qty.</th>
                <th>Serviceable Qty.</th>
                <th>Bin Balance</th>
                <th>Card Line No.</th>
                <th>Release No.</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  style={{ textAlign: 'left' }}
                >
                  Engg Applicable for Engg <br />
                  Department when Returning
                </td>
                <td
                  colSpan={2}
                  style={{ textAlign: 'left' }}
                >
                  Expenditure Account No Applicable <br /> for Dept Other than
                  Engg
                </td>
                <td>Returning Officer</td>
                <td>Return Approved By</td>
                <td colSpan={2}>Return Personal/Staff</td>
                <td colSpan={2}>Accepting Store Keeper Name</td>
                <td colSpan={2}>Entered on Bin Card and Computer</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <Checkbox.Group
                    style={{
                      display: 'flex',
                      justifyContent: 'start',
                      flexDirection: 'column',
                    }}
                  >
                    <Checkbox
                      style={{ marginLeft: '-.5px' }}
                      value="A"
                    >
                      Direct Material
                    </Checkbox>
                    <Checkbox
                      style={{ marginLeft: '-.5px' }}
                      value="A"
                    >
                      Shop Supplies
                    </Checkbox>
                    <Checkbox
                      style={{ marginLeft: '-.5px' }}
                      value="A"
                    >
                      Grocery
                    </Checkbox>
                    <Checkbox
                      style={{ marginLeft: '-.5px' }}
                      value="A"
                    >
                      Cloth
                    </Checkbox>
                  </Checkbox.Group>
                </td>
                <td colSpan={2}></td>
                <td>
                  <div
                    style={{
                      display: 'flex',
                      textAlign: 'left',
                      flexDirection: 'column',
                    }}
                  >
                    <span style={{ marginLeft: '-.5px' }}>
                      Staff No. ....................{' '}
                    </span>
                    <span style={{ marginLeft: '-.5px' }}>
                      Id No. .......................
                    </span>
                    <span style={{ marginLeft: '-.5px' }}>
                      Date..........................
                    </span>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      display: 'flex',
                      textAlign: 'left',
                      flexDirection: 'column',
                    }}
                  >
                    <span style={{ marginLeft: '-.5px' }}>
                      Designation ....................{' '}
                    </span>
                    <span style={{ marginLeft: '-.5px' }}>
                      Id No. .......................
                    </span>
                    <span style={{ marginLeft: '-.5px' }}>
                      Date..........................
                    </span>
                  </div>
                </td>
                <td colSpan={2}>
                  <div
                    style={{
                      display: 'flex',
                      textAlign: 'left',
                      flexDirection: 'column',
                    }}
                  >
                    <span style={{ marginLeft: '-.5px' }}>
                      Sign............................{' '}
                    </span>
                    <span style={{ marginLeft: '-.5px' }}>
                      Staff No. .......................
                    </span>
                    <span style={{ marginLeft: '-.5px' }}>
                      Date..........................
                    </span>
                  </div>
                </td>
                <td colSpan={2}>
                  <div
                    style={{
                      display: 'flex',
                      textAlign: 'left',
                      flexDirection: 'column',
                    }}
                  >
                    <span style={{ marginLeft: '-.5px' }}>
                      Sign............................{' '}
                    </span>
                    <span style={{ marginLeft: '-.5px' }}>
                      Staff No. .......................
                    </span>
                    <span style={{ marginLeft: '-.5px' }}>
                      Date..........................
                    </span>
                  </div>
                </td>
                <td colSpan={2}>
                  <div
                    style={{
                      display: 'flex',
                      textAlign: 'left',
                      flexDirection: 'column',
                    }}
                  >
                    <span style={{ marginLeft: '-.5px' }}>
                      Sign............................{' '}
                    </span>
                    <span style={{ marginLeft: '-.5px' }}>
                      Staff No. .......................
                    </span>
                    <span style={{ marginLeft: '-.5px' }}>
                      Date..........................
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </ARMTable>
        </ResponsiveTable>

        <ARMButton
          type="primary"
          onClick={handlePrint}
        >
          Print
        </ARMButton>
      </ARMCard>
    </CommonLayout>
  );
};

export default UnusableItemPrintFormat;
