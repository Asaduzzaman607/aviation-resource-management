import { Breadcrumb } from 'antd';
import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import line from '../../../components/images/line.png';
import linewidth from '../../../components/images/line_width.png';
import logo from '../../../components/images/logo.svg';
import smallwidth from '../../../components/images/smallwidth.png';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';

const UnserviceableItemPrint = () => {
  const componentRef = useRef();
  const location = useLocation();
  const partData = location?.state?.partReturnData;
  const {partsDetailViewModels} = partData;
  const data = partsDetailViewModels[0];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="#">
              <i className="fas fa-archive" /> &nbsp;Store
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="#">&nbsp;Approved Parts Return</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp; Unserviceable Item Print</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(
          `Unserviceable Item Print`,
          `/store/approved-parts-return`
        )}
      >
        <div
          style={{
            width: '355.2px',
            height: '640 px',
            margin: 'auto',
          }}
        >
          <div
            ref={componentRef}
            style={{
              backgroundColor: '#fda4af',
              padding: '5px',
              paddingTop: '35px',
            }}
          >
            <div
              className="header"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0px',
              }}
            >
              <div className="logo">
                <img
                  src={logo}
                  alt="logo"
                  width={90}
                  height={70}
                />
              </div>
              <div className="serial-number">
                <p style={{ fontSize: '10px' }}>Form: USBA/ENGG/MAINT/005</p>
              </div>
            </div>
            <div
              className="body"
              style={{ position: 'relative' }}
            >
              <div
                className="SideContent"
                style={{
                  transform: 'rotate(-90deg)',
                  position: 'absolute',
                  left: '-128px',
                  top: '220px',
                }}
              >
                <h1 style={{ fontWeight: '800', fontSize: '40px' }}>
                  UNSERVICEABLE
                </h1>
                <div
                  className="line-image"
                  style={{
                    transform: 'rotate(-90deg)',

                    width: '0%',
                    height: '18px',
                    marginTop: '-18px',
                    marginLeft: '-105px',
                  }}
                >
                  <img
                    src={line}
                    alt="line"
                  />
                </div>
              </div>

              <div
                className="main-content"
                style={{ marginLeft: '55px' }}
              >
                <div className="first-part">
                  <h4>
                    <span style={{ fontWeight: 'bold' }}>Part Name : </span>
                    <span style={{ fontWeight: 'lighter' }}>
                      {partData.partDescription?partData.partDescription:"........................................"}
                    </span>
                  </h4>
                  <h4>
                    <span style={{ fontWeight: 'bold' }}>Part No : </span>
                    <span style={{ fontWeight: 'lighter' }}>{partData?.partNo}</span>
                  </h4>
                  <div>
                    <h4 style={{ fontWeight: 'bold' }}>Serial No :</h4>
                    <div style={{ marginLeft: '35px' }}>
                      <h4>
                        <span style={{ fontWeight: 'bold' }}>Removed </span>
                        <span style={{ fontWeight: 'lighter' }}>
                          {
                            data?.removedPartSerialNo
                              .serialNo
                          }
                        </span>{' '}
                      </h4>
                      <h4>
                        <span style={{ fontWeight: 'bold' }}>Installed </span>
                        <span style={{ fontWeight: 'lighter' }}>
                          {
                            data?.installedPartSerialNo
                              .serialNo
                          }
                        </span>
                      </h4>
                    </div>
                  </div>
                  <div style={{ marginTop: '25px' }}>
                    <h4>
                      <span style={{ fontWeight: 'bold' }}>Auth Code No. </span>
                      <span style={{ fontWeight: 'lighter' }}>
                        {data?.authCodeNo}
                      </span>{' '}
                    </h4>
                    <h4>
                      <span style={{ fontWeight: 'bold' }}>
                        Reason Removed{' '}
                      </span>
                      <span style={{ fontWeight: 'lighter' }}>
                        {data?.reasonRemoved}
                      </span>
                    </h4>
                  </div>
                </div>
                <div
                  className="second-part"
                  style={{ marginTop: '0px' }}
                >
                  <div
                    style={{
                      height: '3px',

                      marginBottom: '0px',
                    }}
                  >
                    <img
                      src={linewidth}
                      alt="linewidth"
                    />
                  </div>
                  <h4
                    className="second-part"
                    style={{ marginTop: '20px' }}
                  >
                    <span style={{ fontWeight: 'bold' }}>Removed From </span>
                    <span style={{ fontWeight: 'lighter' }}>
                      {data.aircraftName?data.aircraftName:"..................................................."}
                    </span>
                  </h4>
                  <h4>
                    <span style={{ fontWeight: 'bold' }}>Position </span>
                    <span style={{ fontWeight: 'lighter' }}>
                      {data.position?data?.position:"......................................"}
                    </span>
                  </h4>
                  <h4>
                    <span style={{ fontWeight: 'bold' }}>At Station </span>
                    <span style={{ fontWeight: 'lighter' }}>
                     {data.airportName?data.airportName:" .............................................................."}
                    </span>
                  </h4>
                  <h4>
                    <span style={{ fontWeight: 'bold' }}>Date : </span>
                    <span style={{ fontWeight: 'lighter' }}>
                      {data?.removalDate}
                    </span>
                  </h4>
                </div>
                <div
                  className="third-part"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    marginTop: '0px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        height: '3px',
                      }}
                    >
                      {' '}
                      <img
                        src={smallwidth}
                        alt="line"
                      />
                    </div>
                    <div style={{ marginTop: '15px' }}></div>
                    <h4 style={{ fontWeight: 'bold' }}>Sig. & Date</h4>
                  </div>
                  <div>
                    <div
                      style={{
                        height: '3px',
                      }}
                    >
                      <img
                        src={smallwidth}
                        alt="line"
                      />
                    </div>
                    <div style={{ marginTop: '15px' }}></div>
                    <h4 style={{ fontWeight: 'bold' }}>Authority</h4>
                  </div>
                </div>
                <div
                  className="forth-part"
                  style={{ marginTop: '10px' }}
                >
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <h4>
                      <span style={{ fontWeight: 'bold' }}>TSN </span>
                      <span style={{ fontWeight: 'lighter' }}>
                        {data?.tsn}
                      </span>
                    </h4>
                    <h4>
                      <span style={{ fontWeight: 'bold' }}>CSN </span>
                      <span style={{ fontWeight: 'lighter' }}>
                        {data?.csn}
                      </span>
                    </h4>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <h4>
                      <span style={{ fontWeight: 'bold' }}>TSO </span>
                      <span style={{ fontWeight: 'lighter' }}>
                        {data?.tso}
                      </span>
                    </h4>
                    <h4>
                      <span style={{ fontWeight: 'bold' }}>CSO </span>
                      <span style={{ fontWeight: 'lighter' }}>
                        {data?.cso}
                      </span>
                    </h4>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <h4>
                      <span style={{ fontWeight: 'bold' }}>TSR </span>
                      <span style={{ fontWeight: 'lighter' }}>
                        {data?.tsr}
                      </span>
                    </h4>
                    <h4>
                      <span style={{ fontWeight: 'bold' }}>CSR </span>
                      <span style={{ fontWeight: 'lighter' }}>
                        {data?.csr}
                      </span>
                    </h4>
                  </div>
                  <h4>
                    <span style={{ fontWeight: 'bold' }}>Work Order </span>
                    <span style={{ fontWeight: 'lighter' }}>
                     {partData.workOrderNumber?partData.workOrderNumber:" ......................................................"}
                    </span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <ARMButton
            onClick={handlePrint}
            type="primary"
            style={{ marginTop: '15px' }}
          >
            Print this out!
          </ARMButton>
        </div>
      </ARMCard>
    </CommonLayout>
  );
};

export default UnserviceableItemPrint;
