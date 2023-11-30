import {useEffect, useRef, useState} from 'react';
import {useReactToPrint} from 'react-to-print';
import doubleline from '../../../components/images/double_line.png';
import logo from '../../../components/images/logo.svg';
import linewidth from '../../../components/images/widthline.png';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
// import linewidth from '../../../components/images/widthline.png';

import {Col, Row, Space} from 'antd';
import {useLocation, useParams} from 'react-router-dom';
import StoreInspectionService from '../../../service/storeInspector/StoreInspectionService';
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";

const ServiceableItemPrint = () => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const location = useLocation();
    const partData = location?.state?.partReturnData;
    const {
        partsDetailViewModels,
        lotNumber,
        serialViewModelLite,
        alternatePart,
        otherLocation,
    } = partData;

    const data = partsDetailViewModels[0];
    const {id} = useParams();
    const [storeInspection, setStoreInspection] = useState();
    const [partState, setPartState] = useState({
        new: '',
        oh: '',
        rep: '',
        mod: '',
        shpck: '',
        insp: '',
        test: '',
        wtck: '',
    });

    function getPartState(partStateNameList) {
        let state = {
            new: '',
            oh: '',
            rep: '',
            mod: '',
            shpck: '',
            insp: '',
            test: '',
            wtck: '',
        };

        partStateNameList.map((data) => {
            if (data === 'NEW') {
                state = {
                    ...state,
                    new: 'NEW',
                };
            }
            if (data === 'O/H') {
                state = {
                    ...state,
                    oh: 'O/H',
                };
            }
            if (data === 'REP') {
                state = {
                    ...state,
                    rep: 'REP',
                };
            }
            if (data === 'MOD') {
                state = {
                    ...state,
                    mod: 'MOD',
                };
            }
            if (data === 'SHP CK') {
                state = {
                    ...state,
                    shpck: 'SHP CK',
                };
            }
            if (data === 'INSP') {
                state = {
                    ...state,
                    insp: 'INSP',
                };
            }
            if (data === 'TEST') {
                state = {
                    ...state,
                    test: 'TEST',
                };
            }
            if (data === 'WT CK') {
                state = {
                    ...state,
                    wtck: 'WT CK',
                };
            }
        });
        setPartState(state);
    }

    const alternatePartData =
        alternatePart.length >= 1
            ? alternatePart.map((data) => {
                return data['partNo'];
            })
            : '';
    const getStoreInspection = async () => {
        let {data} = await StoreInspectionService.getAllStoreInspection(50, {
            id: id,
        });
        setStoreInspection(data.model[0]);
        data.model[0].partStateNameList.length >= 1 &&
        getPartState(data.model[0].partStateNameList);
    };
    useEffect(() => {
        getStoreInspection().catch(console.error);
    }, [id]);

    return (
        <CommonLayout>
            <ARMCard title={getLinkAndTitle("Serviceable Item Print", '/store/approved-parts-return', false)}>
                <div
                    style={{
                        width: '355.2px',
                        height: '650 px',
                        margin: 'auto',
                    }}
                >
                    <div
                        ref={componentRef}
                        style={{
                            backgroundColor: '#5FD58EA8',
                            padding: '10px',
                            paddingTop: '10px',
                            height: '660px',
                        }}
                    >
                        <div
                            className="header"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                height: '80px',
                            }}
                        >
                            {/* logo .................................. */}

                            <div className="logo">
                                <img
                                    src={logo}
                                    alt="logo"
                                    width={80}
                                    height={30}
                                />
                            </div>

                            <div className="serial-number">
                                <p style={{fontSize: '8px', textAlign: 'right'}}>
                                    Form: USBA/ENGG/MAINT/005 <br/>
                                    Issue:02, DT: 26-08-21
                                </p>
                                <div className="serial-number">
                                    <p style={{fontSize: '16px', fontWeight: '800'}}>
                                        US-BANGLA AIRLINES
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="body"
                            style={{position: 'relative'}}
                        >
                            {/* SideContent ..................................... */}
                            <div
                                className="SideContent"
                                style={{
                                    transform: 'rotate(-90deg)',
                                    position: 'absolute',
                                    left: '-105px',
                                    top: '265px',
                                }}
                            >
                                {/* Serviceable Title ..................................... */}
                                <h2 style={{fontWeight: '800', fontSize: '40px'}}>
                                    SERVICEABLE
                                </h2>
                                <div
                                    className="line-image"
                                    style={{
                                        transform: 'rotate(-90deg)',

                                        width: '0%',
                                        height: '19px',
                                        marginTop: '-12px',
                                        marginLeft: '-105px',
                                    }}
                                >
                                    <img
                                        src={doubleline}
                                        alt="line"
                                    />
                                </div>
                            </div>
                            {/* -------------- Body start ............................................ */}
                            <div
                                className="main-content"
                                style={{marginLeft: '48px'}}
                            >
                                {/* First Part .................................................................................. */}

                                <div
                                    className="first-part"
                                    style={{height: '98px', fontSize: '11px'}}
                                >
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>Part Name </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {partData.partDescription}
                    </span>
                                    </h6>
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>Part No: </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {partData.partNo}
                    </span>
                                    </h6>
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>ALTERNATE P/N: </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {alternatePartData === ''
                          ? '...............................................................................................................................'
                          : alternatePartData.toString()}
                    </span>
                                    </h6>
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>SERIAL NO: </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {data?.removedPartSerialNo.serialNo}
                    </span>
                                    </h6>
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>QTY: </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {partData.quantityReturn}
                    </span>
                                    </h6>

                                    {/* Checkbox  ......................... */}
                                    <div className="Checkbox ">
                                        <Row
                                            style={{
                                                fontWeight: '800',
                                                fontSize: '9px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <Space
                                                size={[14, 16]}
                                                wrap
                                            >
                                                <Col>
                                                    NEW
                                                    <Col>
                                                        {' '}
                                                        <input
                                                            readOnly
                                                            checked={partState.new}
                                                            type="checkbox"
                                                        />
                                                    </Col>
                                                </Col>
                                                <Col>
                                                    O/H
                                                    <Col>
                                                        {' '}
                                                        <input
                                                            readOnly
                                                            checked={partState.oh}
                                                            type="checkbox"
                                                        />
                                                    </Col>
                                                </Col>
                                                <Col>
                                                    REP
                                                    <Col>
                                                        {' '}
                                                        <input
                                                            checked={partState.rep}
                                                            readOnly
                                                            type="checkbox"
                                                        />
                                                    </Col>
                                                </Col>
                                                <Col>
                                                    MOD
                                                    <Col>
                                                        {' '}
                                                        <input
                                                            checked={partState.mod}
                                                            readOnly
                                                            type="checkbox"
                                                        />
                                                    </Col>
                                                </Col>
                                                <Col>
                                                    SHP CK
                                                    <Col>
                                                        {' '}
                                                        <input
                                                            readOnly
                                                            checked={partState.shpck}
                                                            type="checkbox"
                                                        />
                                                    </Col>
                                                </Col>
                                                <Col>
                                                    INSP
                                                    <Col>
                                                        {' '}
                                                        <input
                                                            checked={partState.insp}
                                                            readOnly
                                                            type="checkbox"
                                                        />
                                                    </Col>
                                                </Col>
                                                <Col>
                                                    TEST
                                                    <Col>
                                                        {' '}
                                                        <input
                                                            checked={partState.test}
                                                            readOnly
                                                            type="checkbox"
                                                        />
                                                    </Col>
                                                </Col>
                                                <Col>
                                                    WT CK
                                                    <Col>
                                                        {' '}
                                                        <input
                                                            checked={partState.wtck}
                                                            readOnly
                                                            type="checkbox"
                                                        />
                                                    </Col>
                                                </Col>
                                            </Space>
                                        </Row>
                                    </div>
                                </div>

                                {/* Second Part .............................................................. */}
                                <div
                                    className="SecondPart"
                                    style={{height: '185px', fontSize: '11px'}}
                                >
                                    <img
                                        src={linewidth}
                                        alt="line"
                                    />
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}> PO NO </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {partData.partOrderNo
                          ? partData.partOrderNo
                          : '..................................................................................................................................................'}
                    </span>
                                    </h6>
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>W.O:</span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {partData.workOrderNumber
                          ? partData.workOrderNumber
                          : '.......................................'}
                    </span>
                                    </h6>
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>DATE: </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {partData.sRcreateDate}
                    </span>
                                    </h6>
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>SHELF-LIFE: </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {serialViewModelLite.length >= 1
                          ? serialViewModelLite[0].selfLife
                              ? !serialViewModelLite[0].selfLife.includes('WT')
                                  ? serialViewModelLite[0].selfLife
                                  : '..............................'
                              : '.......................................................................'
                          : '.........................................................................................................'}
                    </span>
                                    </h6>
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>VALID UNTIL:</span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {serialViewModelLite.length >= 1
                          ? serialViewModelLite[0].validTill
                              ? serialViewModelLite[0].validTill
                              : '...............................'
                          : ' ....................................................................................................................................'}
                    </span>
                                    </h6>
                                    <h6>
                    <span style={{fontWeight: 'bold'}}>
                      HST/CAL/WT.CHK.DUE:
                    </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {serialViewModelLite.length >= 1
                          ? serialViewModelLite[0].selfLife
                              ? serialViewModelLite[0].selfLife.includes('WT')
                                  ? serialViewModelLite[0].selfLife
                                  : '.......................................'
                              : '.......................................................................'
                          : '.........................................................................................................'}
                    </span>
                                    </h6>
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>BATCH / LOT NO :</span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {lotNumber.length >= 1
                          ? lotNumber[0].partNo
                              ? lotNumber[0].partNo
                              : '..................................................'
                          : ' ..............................................................................................................................'}
                    </span>
                                    </h6>

                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>CERT NO.:</span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {storeInspection
                          ? storeInspection.certiNo
                              ? storeInspection.certiNo
                              : '.............................................................................................................'
                          : '.................................................................................................................................'}
                    </span>
                                    </h6>
                                    <img
                                        src={linewidth}
                                        alt="linewidth"
                                    />
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>G.R.NO. USBA: </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {serialViewModelLite.length >= 1
                          ? serialViewModelLite[0].grnNo
                              ? serialViewModelLite[0].grnNo
                              : '..................................'
                          : ' ....................................................................................................................................'}
                    </span>
                                    </h6>
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>DATE:</span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {partData.sRcreateDate}
                    </span>
                                    </h6>
                                </div>
                                {/* =====================Finish Second Part ====================== */}

                                {/* Third Part Start ................................... */}

                                <div
                                    className="Third-part"
                                    style={{height: '62px'}}
                                >
                                    <img
                                        src={linewidth}
                                        alt="linewidth"
                                    />
                                    <h6
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: '11px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <u>CERTIFICATION OF INSPECTION</u>
                                    </h6>
                                    <p style={{textAlign: 'center', fontSize: '9px'}}>
                                        I hereby certify that I have insepected this/these items in
                                        accordance with ANO(AW)part 145.42 and CAAB requirement.{' '}
                                    </p>
                                </div>

                                {/* Fourth Pat Start ===================================== */}

                                <div
                                    className="Fourth-Part"
                                    style={{height: '45px'}}
                                >
                                    <img
                                        src={linewidth}
                                        alt="linewidth"
                                    />
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'left',
                                            fontSize: '11px',
                                        }}
                                    >
                                        <h6>
                                            <span style={{fontWeight: 'bold'}}>TSN: </span>
                                            <span style={{fontWeight: 'lighter'}}>
                        {data?.tsn
                            ? data?.tsn
                            : '..............................'}
                      </span>
                                        </h6>
                                        <h6>
                                            <span style={{fontWeight: 'bold'}}>TSO: </span>
                                            <span style={{fontWeight: 'lighter'}}>
                        {data?.tso
                            ? data?.tso
                            : '..............................'}
                      </span>
                                        </h6>
                                        <h6>
                                            <span style={{fontWeight: 'bold'}}>TSR: </span>
                                            <span style={{fontWeight: 'lighter'}}>
                        {data?.tsr
                            ? data?.tsr
                            : '..............................'}
                      </span>
                                        </h6>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'left',
                                            fontSize: '10px',
                                        }}
                                    >
                                        <h6>
                                            <span style={{fontWeight: 'bold'}}>CSN: </span>
                                            <span style={{fontWeight: 'lighter'}}>
                        {data?.csn
                            ? data?.csn
                            : '..................................'}
                      </span>
                                        </h6>
                                        <h6>
                                            <span style={{fontWeight: 'bold'}}>CSO: </span>
                                            <span style={{fontWeight: 'lighter'}}>
                        {data?.cso
                            ? data?.cso
                            : '.................................'}
                      </span>
                                        </h6>
                                        <h6>
                                            <span style={{fontWeight: 'bold'}}>CSR: </span>
                                            <span style={{fontWeight: 'lighter'}}>
                        {data?.csr
                            ? data?.csr
                            : '.................................'}
                      </span>
                                        </h6>
                                    </div>
                                </div>

                                <div
                                    className="Fifth Part"
                                    style={{height: '62px', fontSize: '10px'}}
                                >
                                    <img
                                        src={linewidth}
                                        alt="linewidth"
                                    />
                                    <h6 style={{fontWeight: 'bold'}}>STORE INSPECTOR'S</h6>
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>SIGN & SEAL: </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      ......................................................................................................................................................
                    </span>
                                    </h6>
                                    <h6>
                    <span style={{fontWeight: 'bold'}}>
                      INSPECTION AUTH. NO:{' '}
                    </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {storeInspection
                          ? storeInspection.inspectionAuthNo
                              ? storeInspection.inspectionAuthNo
                              : '..................................................'
                          : '.................................................'}
                    </span>
                                    </h6>
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>DATE: </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {storeInspection
                          ? storeInspection.createdDate
                              ? storeInspection.createdDate
                              : '..................................................'
                          : '.................................................'}
                    </span>
                                    </h6>
                                </div>

                                <div
                                    className="Six Part"
                                    style={{height: '70px', fontSize: '11px'}}
                                >
                                    <img
                                        src={linewidth}
                                        alt="linewidth"
                                    />
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'left',
                                            fontSize: '11px',
                                        }}
                                    >
                                        <h6>
                                            <span style={{fontWeight: 'bold', }}>FITTED TO S2: </span>
                                            <span style={{fontWeight: 'lighter',   marginRight : '5px'}}>
                        {data?.aircraftName
                            ? data?.aircraftName
                                ? data?.aircraftName
                                : '..................................................'
                            : '.................................................'}
                      </span>
                                        </h6>
                                        <h6>
                                            <span style={{fontWeight: 'bold'}}>POSITION: </span>
                                            <span style={{fontWeight: 'lighter',  marginRight : '5px'}}>
                        {data?.position
                            ? data?.position
                            : '......................................................'}
                      </span>
                                        </h6>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'left',
                                            fontSize: '11px',
                                        }}
                                    >
                                        <h6>
                                            <span style={{fontWeight: 'bold'}}>SIGN: </span>
                                            <span style={{fontWeight: 'lighter',   marginRight : '5px'}}>
                         {data?.sign
                             ? data?.sign
                                 ? data?.sign
                                 : '..................................................'
                             : '.................................................'}
                      </span>
                                        </h6>
                                        <h6>
                      <span style={{fontWeight: 'bold'}}>
                        ENG / AUTH. NO:{' '}
                      </span>
                                            <span style={{fontWeight: 'lighter',  marginRight : '5px'}}>
                        {data?.authNo
                            ? data?.authNo
                                ? data?.authNo
                                : '..................................................'
                            : '.................................................'}
                      </span>
                                        </h6>
                                    </div>
                                    <h6>
                                        <span style={{fontWeight: 'bold'}}>DATE: </span>
                                        <span style={{fontWeight: 'lighter'}}>
                      {data?.createdDate
                          ? data?.createdDate
                              ? data?.createdDate
                              : '..................................................'
                          : '.................................................'}
                    </span>
                                    </h6>
                                    <img
                                        src={linewidth}
                                        alt="linewidth"
                                    />
                                    <div
                                        className="Seven Part"
                                        style={{height: '100px', fontSize: '11px'}}
                                    >
                                        <div style={{display: 'flex', fontSize: '11px'}}>
                                            <h4>
                                                STOCK LOC:
                                                <span>
                          {otherLocation.length >= 1
                              ? otherLocation[0].otherLocation
                                  ? otherLocation[0].otherLocation
                                  : '...............................'
                              : '........................'}
                        </span>
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ARMButton
                        onClick={handlePrint}
                        type="primary"
                        style={{marginTop: '10%'}}
                    >
                        Print this out!
                    </ARMButton>
                </div>
            </ARMCard>
        </CommonLayout>
    );
};

export default ServiceableItemPrint;
