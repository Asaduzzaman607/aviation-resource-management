import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Empty, Pagination, Row } from 'antd';
import { createRef, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import StoreVoucherPrintFormat from '../../../lib/common/StoreVoucherPrintFormat';
import ItemDemandService from '../../../service/ItemDemandService';
import IssueDemandService from '../../../service/store/IssueDemandService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import logo from '../../images/us-bangla-logo.png';
import CommonLayout from '../../layout/CommonLayout';
import Loading from "../common/Loading";

const ApproveIssueDemandDetailsPrint = () => {
  let { id } = useParams();
  const componentRef = createRef();
  const [singleData, setSingleData] = useState([]);
  const [priority, setPriority] = useState();
  const [approvalStatus, setApprovalStatus] = useState([]);
  const [collection, setCollection] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState();
  const [issueById, setIssueById] = useState([]);
  const [partWizeTotal, setPartWizeTotal] = useState([]);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;
  let part;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getDemandById = async (iiid) => {
    let { data } = await ItemDemandService.getItemDemandById(iiid);
    setSingleData(data);
  };

  const getIssue = async () => {
    const { data } = await IssueDemandService.getIssueDemandById(id);
    let p = [];
    let partTotalPrice=[]
    data.storeIssueItemResponseDtos?.map((d) => {
      p.push(d.priorityType);
      const sum = d.grnAndSerialDtoList?.reduce((accumulator, object) => {
        return accumulator + object.price;
      }, 0);
      partTotalPrice.push({
        id:d.id,
        totalPrice:sum
      })
    });
    p.sort();
    setPriority(p[0]);
    setIssueById(data);
    setPartWizeTotal(partTotalPrice)
    getDemandById(data.storeDemandId);
    getIssuePrint(id, 1,partTotalPrice)
    let approvalStatusList = [];

    for (const approveStatus in data.approvalStatuses) {
      approvalStatusList.push(data.approvalStatuses[approveStatus]);
    }
    setApprovalStatus(approvalStatusList);
  };


  function getTotalPrise(partWizeTotal,id) {
    const {totalPrice}= partWizeTotal.find(element=>element.id===id)
   return totalPrice;
  }

  const getIssuePrint = async (id, pageNo,partTotalPrice) => {
  try {
    setLoading(true)
    const { data } = await IssueDemandService.getIssuePrintData(id, pageNo);
    let list = [];
    data.model.map((data) => {
      if (data.id === part) {
        list.push({
          id: null,
          partNo: ' ',
          partDescription: ' ',
          demandedUomCode: ' ',
          unitMeasurementCode: ' ',
          quantityDemanded: ' ',
          issuedQuantity: ' ',
          availablePart: ' ',
          cardLineNo: data.cardLineNo,
          grnNo: data.grnNo,
          serialNo: data.serialNo,
          price: data.price,
          totalPrice:' '
        });
      } else {

        list.push({
          ...data,
          totalPrice: getTotalPrise(partTotalPrice,data.id)
        })
        part = data.id;

      }
    });
    setCollection(list);
    setCurrentPage(data.currentPage);
    setTotalElements(data.totalElements);
  }catch (e) {
    console.log(e)
  }
  finally {
    setLoading(false)
  }
  };
  const paginate = (page) => {
    getIssuePrint(id, page,partWizeTotal);
  };

  useEffect(() => {
    id && getIssue().catch(console.error);
    // id && getIssuePrint(id, 1).catch(console.error);
  }, [id]);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/store">
              <i className="fas fa-archive" /> &nbsp;Store
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/store/approve-issues">&nbsp;Approved Issue</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/store/approve-issues/details/${id}`}>
              &nbsp;Approved Issue Details
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>&nbsp;print</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={
          <Row justify="space-between">
            <Col>Issue Details Print</Col>
            <Col>
              <Button
                type="primary"
                style={{
                  backgroundColor: '#04aa6d',
                  borderColor: 'transparent',
                  borderRadius: '5px',
                }}
              >
                <Link
                  title="back"
                  to={`/store/approve-issues/details/${id}`}
                >
                  <ArrowLeftOutlined /> Back
                </Link>
              </Button>{' '}
              &nbsp;&nbsp; &nbsp;&nbsp;
              <ARMButton
                type="primary"
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                Print
              </ARMButton>
            </Col>
          </Row>
        }
      >
        {
          !loading ? <>
            <StoreVoucherPrintFormat>
              <div
                id="container"
                ref={componentRef}
              >
                <div style={{padding: '15px'}}>
                  <div
                    className="row"
                    style={{width: '100%', height: '80px'}}
                  >
                    <img
                      alt={''}
                      style={{float: 'left', height: '70px'}}
                      src={logo}
                    />

                    <p
                      style={{
                        paddingTop: '40px',
                        fontSize: '20px',
                        paddingLeft: '400px',
                        height: '80px',
                        width: '100%',
                      }}
                    >
                      INTERNAL DEMAND & ISSUE VOUCHER
                    </p>
                  </div>
                  <div
                    className="row"
                    style={{width: '100%', height: '35px'}}
                  >
                    <div style={{float: 'left', width: '64%', height: '25px'}}>
                      <div style={{float: 'left', width: '61%', height: '25px'}}>
                        <p style={{paddingTop: '5px', fontSize: '15px'}}>
                          To Be completed by Demanding Department
                        </p>
                      </div>
                      <div
                        style={{
                          float: 'left',
                          width: '2%',
                          height: '100%',
                          marginTop: '10px',
                        }}
                      >
                        <p
                          style={{
                            float: 'left',
                            fontSize: '50px',
                            marginTop: '-30px',
                          }}
                        >
                          <i className="fa fa-caret-left"></i>
                        </p>
                      </div>
                      <div style={{float: 'left', width: '37%', height: '100%'}}>
                        <div
                          style={{
                            width: '100%',
                            height: '15px',
                            backgroundColor: 'black',
                            marginTop: '10px',
                          }}
                        ></div>
                      </div>
                    </div>
                    <div style={{float: 'left', width: '1%', height: '25px'}}>
                      <div
                        style={{
                          height: '100%',
                          width: '16px',
                          margineft: '-1px',
                          backgroundColor: 'black',
                          marginTop: '10px',
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        paddingBottom: '5px',
                        float: 'right',
                        width: '35%',
                        height: '35px',
                        fontSize: '10px',
                      }}
                    >
                      <span style={{float: 'right'}}>Appendix : "AA"</span>
                      <br/>
                      <span style={{float: 'right'}}>
                    Form No: USBA/Enggs/Storage/027
                  </span>
                    </div>
                  </div>

                  <div className="row">
                    <table
                      style={{
                        width: '100%',
                        height: '100%',
                        tableLayout: 'fixed',
                        fontSize: '12px',
                        textAlign: 'center',
                      }}
                    >
                      <thead>
                      <tr>
                        <th
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '10.85%',
                          }}
                        >
                          Demand No.
                        </th>
                        <th
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '10.85%',
                          }}
                        >
                          Shop/Dept No.
                        </th>
                        <th
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '10.85%',
                          }}
                        >
                          Priority
                        </th>
                        <th
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '10.85%',
                          }}
                        >
                          Location No.
                        </th>
                        <th
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '10.85%',
                          }}
                        >
                          Work Order No.
                        </th>
                        <th
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '9.80%',
                          }}
                        >
                          A/C Regn.
                        </th>
                        <th
                          style={{
                            tableLayout: 'fixed',
                            background: 'black',
                            border: '1px solid black',
                            width: '1.50%',
                          }}
                        ></th>
                        <th
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '11.6%',
                          }}
                        >
                          Stock Room No.
                        </th>
                        <th
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '11.5%',
                          }}
                        >
                          Issue Voucher No.
                        </th>
                        <th
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '11.6%',
                          }}
                        >
                          Date
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '10.85%',
                          }}
                        >
                          {issueById.storeDemandNo}
                        </td>
                        <td
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '10.85%',
                          }}
                        >
                          {singleData.departmentCode}
                        </td>
                        <td
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '10.85%',
                          }}
                        >
                          {priority}
                        </td>
                        <td
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '10.85%',
                          }}
                        >
                          {singleData.airportName}{' '}
                        </td>
                        <td
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '10.85%',
                          }}
                        >
                          {singleData.workOrderNo}
                        </td>
                        <td
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '9.80%',
                          }}
                        >
                          {singleData.aircraftName}
                        </td>
                        <td
                          style={{
                            tableLayout: 'fixed',
                            background: 'black',
                            border: '1px solid black',
                            width: '1.52%',
                          }}
                        ></td>
                        <td
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '11.6%',
                          }}
                        >
                          {issueById.storeStockRoom}
                        </td>
                        <td
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '11.5%',
                          }}
                        >
                          {issueById.voucherNo}
                        </td>
                        <td
                          style={{
                            tableLayout: 'fixed',
                            border: '1px solid grey',
                            width: '11.6%',
                          }}
                        >
                          {issueById.createdDate}
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    style={{
                      float: 'left',
                      width: '24.4%',
                      height: '18px',
                      marginLeft: '41%',
                      backgroundColor: 'black',
                      border: ' 1px solid black',
                    }}
                  ></div>
                  {/* 2nd Part  */}
                  <div
                    className="row"
                    style={{width: '100%', height: '390px', padding: '0px'}}
                  >
                    <div
                      style={{
                        float: 'left',
                        width: '100%',
                        height: '450px',
                        // marginTop:"2%",
                        padding: '0px',
                      }}
                    >
                      {/* Data Table Middle - 2nd Table  */}
                      <table
                        style={{
                          fontSize: '12px',
                          width: '100%',
                          tableLayout: 'fixed',
                          border: '1px solid black',
                          textAlign: 'center',
                        }}
                      >
                        <thead style={{border: '1px solid black'}}>
                        <tr>
                          <th style={{width: '4%', border: '1px solid grey'}}>
                            S/N
                          </th>
                          <th style={{width: '10%', border: '1px solid grey'}}>
                            Part Number
                          </th>
                          <th style={{width: '13%', border: '1px solid grey'}}>
                            Nomenclature
                          </th>
                          <th style={{width: '8%', border: '1px solid grey'}}>
                            Unit
                          </th>
                          <th style={{width: '5%', border: '1px solid grey'}}>
                            Qty. Required
                          </th>
                          <th
                            style={{width: '1.37%', backgroundColor: 'black'}}
                          ></th>
                          <th style={{width: '5%', border: '1px solid grey'}}>
                            Qty. Issued
                          </th>
                          <th style={{width: '6%', border: '1px solid grey'}}>
                            issued Unit
                          </th>
                          <th style={{width: '5%', border: '1px solid grey'}}>
                            Bin Balance
                          </th>
                          <th style={{width: '8%', border: '1px solid grey'}}>
                            Card Line No.
                          </th>
                          <th style={{width: '8%', border: '1px solid grey'}}>
                            SN:
                          </th>
                          <th style={{width: '8%', border: '1px solid grey'}}>
                            GRN:
                          </th>
                          <th style={{width: '8%', border: '1px solid grey'}}>
                            Unit Rate
                          </th>
                          <th style={{width: '8%', border: '1px solid grey'}}>
                            Total Price
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        {collection?.map((data, i) => (
                          <tr key={i}>
                            <td style={{border: '1px solid grey'}}>{i + 1}</td>
                            {data.id ? (
                              <>
                                <td
                                  style={{
                                    borderTop: '1px solid grey',
                                    borderBottom: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.partNo}
                                </td>
                                <td
                                  style={{
                                    borderTop: '1px solid grey',
                                    borderBottom: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.partDescription}
                                </td>
                                <td
                                  style={{
                                    borderTop: '1px solid grey',
                                    borderBottom: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.demandedUomCode}
                                </td>
                                <td
                                  style={{
                                    borderTop: '1px solid grey',
                                    borderBottom: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.quantityDemanded}
                                </td>
                                <td
                                  style={{
                                    backgroundColor: 'black',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                ></td>
                                <td
                                  style={{
                                    borderTop: '1px solid grey',
                                    borderBottom: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.issuedQuantity}
                                </td>
                                <td
                                  style={{
                                    borderTop: '1px solid grey',
                                    borderBottom: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.unitMeasurementCode}
                                </td>
                                <td
                                  style={{
                                    borderTop: '1px solid grey',
                                    borderBottom: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.availablePart}
                                </td>
                                <td
                                  style={{border: '1px solid grey'}}
                                >
                                  {data.cardLineNo}
                                </td>
                                <td style={{border: '1px solid grey'}}>
                                  {data.serialNo}
                                </td>
                                <td style={{border: '1px solid grey'}}>
                                  {data.grnNo}
                                </td>
                                <td
                                  style={{border: '1px solid grey'}}
                                >
                                  {data.price}
                                </td>
                                <td
                                  style={{
                                    borderTop: '1px solid grey',
                                    borderBottom: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.totalPrice}
                                </td>
                              </>
                            ) : (
                              <>
                                <td
                                  style={{
                                    borderBottom: 'none',
                                    borderTop: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.partNo}
                                </td>
                                <td
                                  style={{
                                    borderBottom: 'none',
                                    borderTop: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.partDescription}
                                </td>
                                <td
                                  style={{
                                    borderBottom: 'none',
                                    borderTop: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.unitMeasurementCode}
                                </td>
                                <td
                                  style={{
                                    borderBottom: 'none',
                                    borderTop: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.quantityDemanded}
                                </td>
                                <td
                                  style={{
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                    backgroundColor: 'black',
                                  }}
                                ></td>
                                <td
                                  style={{
                                    borderBottom: 'none',
                                    borderTop: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.issuedQuantity}
                                </td>
                                <td
                                  style={{
                                    borderBottom: 'none',
                                    borderTop: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.unitMeasurementCode}
                                </td>
                                <td
                                  style={{
                                    borderBottom: 'none',
                                    borderTop: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.availablePart}
                                </td>
                                <td
                                  style={{border: '1px solid grey'}}
                                >
                                  {data.cardLineNo}
                                </td>
                                <td style={{border: '1px solid grey'}}>
                                  {data.serialNo}
                                </td>
                                <td style={{border: '1px solid grey'}}>
                                  {data.grnNo}
                                </td>
                                <td
                                  style={{border: '1px solid grey'}}
                                >
                                  {data.price}
                                </td>
                                <td
                                  style={{
                                    borderBottom: 'none',
                                    borderTop: 'none',
                                    borderRight: '1px solid grey',
                                    borderLeft: '1px solid grey',
                                  }}
                                >
                                  {data.totalPrice}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                        </tbody>
                      </table>

                      {/* 3rd  Table */}
                      <table
                        style={{
                          width: '100%',
                          tableLayout: 'fixed',
                          border: '1px solid grey',
                        }}
                      >
                        <tbody>
                        <tr>
                          {/* Arrow Design Part  ........................*/}
                          <th
                            style={{
                              width: '19%',
                              border: '1px solid grey',
                              height: 'auto',
                            }}
                          >
                            <div style={{height: '120px'}}>
                              <div style={{display: 'flex', height: '50px'}}>
                                <p
                                  style={{
                                    width: '90px',
                                    fontSize: '10px',
                                    borderBottom: '1px solid black',
                                    marginLeft: '5px',
                                    marginTop: '5px',
                                  }}
                                >
                                  In Case of Issues of Engg. Dept Check Applicable
                                  box
                                </p>
                                <div
                                  style={{
                                    background: 'black',
                                    height: '18px',
                                    width: '50px',
                                    marginTop: '19px',
                                    marginLeft: '5px',
                                  }}
                                ></div>

                                <p
                                  style={{
                                    fontSize: '50px',
                                    marginLeft: '0px',
                                    marginTop: '-10px',
                                  }}
                                >
                                  <i className="fa fa-caret-right"></i>
                                </p>
                              </div>
                              <div
                                style={{
                                  background: 'black',
                                  width: '18px',
                                  height: '30px',
                                  marginTop: '0px',
                                  marginLeft: '40px',
                                }}
                              ></div>
                              <p
                                style={{
                                  fontSize: '50px',
                                  height: '20px',
                                  width: '10px',
                                  marginTop: '-32px',
                                  paddingLeft: '33.5px',
                                }}
                              >
                                <i className="fa fa-caret-down"></i>
                              </p>
                            </div>
                            <div>
                              <div
                                style={{background: 'black', height: '1px'}}
                              ></div>
                              <div
                                style={{
                                  display: 'flex',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}
                              >
                                &nbsp;
                                <input type="checkbox"/>
                                &nbsp;Direct Material
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}
                              >
                                &nbsp;
                                <input type="checkbox"/>
                                &nbsp;Shop Supplies
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}
                              >
                                &nbsp;
                                <input type="checkbox"/>
                                &nbsp;Stationary
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}
                              >
                                &nbsp;
                                <input type="checkbox"/>
                                &nbsp;Uniform
                              </div>
                            </div>
                          </th>
                          {/* Demand - Part , Right Side ................. */}
                          <th style={{width: '81%', border: '1px solid grey'}}>
                            <div style={{width: '100%', marginTop: '-2px'}}>
                              <div
                                className="left"
                                style={{
                                  display: 'flex',
                                  border: '1px solid grey',
                                  width: '100%',
                                }}
                              >
                                {/* Left Section  .............................*/}
                                <div style={{width: '27.32%', display: 'flex'}}>
                                  <div style={{width: '77.5%'}}>
                                    <p>Demeand For:</p>
                                    <p> {singleData.aircraftName}</p>
                                  </div>

                                  <div style={{width: '22.5%'}}>
                                    <div style={{marginBottom: '5px'}}>
                                      <h4
                                        style={{
                                          height: '14px',
                                          fontSize: '9px',
                                          fontWeight: '600',
                                          width: '50px',
                                          border: '1px solid grey',
                                          marginLeft: '1px',
                                        }}
                                      >
                                        B738
                                      </h4>
                                    </div>
                                    <div style={{marginBottom: '5px'}}>
                                      <h4
                                        style={{
                                          height: '14px',
                                          fontSize: '9px',
                                          fontWeight: '600',
                                          width: '50px',
                                          border: '1px solid grey',
                                          marginLeft: '1px',
                                        }}
                                      >
                                        Dash8
                                      </h4>
                                    </div>
                                    <div style={{marginBottom: '5px'}}>
                                      <h4
                                        style={{
                                          height: '14px',
                                          fontSize: '9px',
                                          fontWeight: '600',
                                          width: '50px',
                                          border: '1px solid grey',
                                          marginLeft: '3px',
                                        }}
                                      >
                                        ATR72
                                      </h4>
                                    </div>

                                    {/* Middle Verticle Color left => Black Design ................*/}
                                    <div
                                      style={{
                                        backgroundColor: 'black',
                                        width: '55px',
                                        height: '18px',
                                        border: '2px solid black',
                                        marginLeft: '2.5px',
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Middle Verticle Color  ......................*/}
                                <div
                                  style={{
                                    backgroundColor: 'black',
                                    width: '1.9%',
                                    height: '75px',
                                    marginLeft: '-2px',
                                    border: '2px solid black',
                                  }}
                                ></div>

                                {/* Middle Verticle Line => Right Section  .....................*/}

                                <div style={{width: '70.80%'}}>
                                  <div
                                    style={{
                                      marginBottom: '8px',
                                      marginTop: '5px',
                                    }}
                                  >
                                    <h4
                                      style={{
                                        height: '15px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        width: '70px',
                                        border: '1px solid grey',
                                        marginLeft: '5px',
                                      }}
                                    >
                                      ALL A/C
                                    </h4>
                                  </div>
                                  <div style={{marginBottom: '8px'}}>
                                    <h4
                                      style={{
                                        height: '15px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        width: '70px',
                                        border: '1px solid grey',
                                        marginLeft: '5px',
                                      }}
                                    >
                                      HIRED
                                    </h4>
                                  </div>
                                  <div style={{marginBottom: '8px'}}>
                                    <h4
                                      style={{
                                        height: '15px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        width: '70px',
                                        border: '1px solid grey',
                                        marginLeft: '5px',
                                      }}
                                    ></h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Table => Bottom Part ..............*/}
                            <>
                              <div
                                style={{
                                  display: 'flex',
                                  width: '100%',
                                  border: '1px solid grey',
                                  height: '130px',
                                }}
                              >
                                <div
                                  style={{
                                    width: '10.4%',
                                    border: '1px solid grey',
                                  }}
                                >
                                  <h5
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: '600',
                                    }}
                                  >
                                    In case of issues For other depts. Write
                                    Expenses Account No.
                                  </h5>
                                </div>

                                {approvalStatus?.length <= 5 && (
                                  <>
                                    <div
                                      style={{
                                        width: '11.0%',
                                        border: '1px solid grey',
                                      }}
                                    >
                                      <p>
                                        {approvalStatus.length >= 4
                                          ? approvalStatus[0].workFlowAction
                                          : ''}
                                      </p>
                                      <p>
                                        {approvalStatus.length >= 4
                                          ? approvalStatus[0].updatedByName
                                          : ''}
                                      </p>
                                      <p>
                                        ID NO:{' '}
                                        {approvalStatus.length >= 4
                                          ? approvalStatus[0].updatedBy
                                          : ''}
                                      </p>
                                    </div>
                                    <div
                                      style={{
                                        width: '1.9%',
                                        border: '1px solid black',
                                        background: 'black',
                                      }}
                                    ></div>
                                    <div
                                      style={{
                                        width: '19.2075%',
                                        border: '1px solid grey',
                                      }}
                                    >
                                      <p>
                                        {approvalStatus.length >= 4
                                          ? approvalStatus[1].workFlowAction
                                          : ''}
                                      </p>
                                      <p>
                                        {approvalStatus.length >= 4
                                          ? approvalStatus[1].updatedByName
                                          : ''}
                                      </p>
                                      <p>
                                        ID NO:
                                        {approvalStatus.length >= 4
                                          ? approvalStatus[1].updatedBy
                                          : ''}
                                      </p>
                                    </div>
                                    <div
                                      style={{
                                        width: '19.2075%',
                                        border: '1px solid grey',
                                      }}
                                    >
                                      <p>
                                        {approvalStatus.length >= 4
                                          ? approvalStatus[2].workFlowAction
                                          : ''}
                                      </p>
                                      <p>
                                        {approvalStatus.length >= 4
                                          ? approvalStatus[2].updatedByName
                                          : ''}
                                      </p>
                                      <p>
                                        ID NO:{' '}
                                        {approvalStatus.length >= 4
                                          ? approvalStatus[2].updatedBy
                                          : ''}
                                      </p>
                                    </div>
                                    <div
                                      style={{
                                        width: '19.1075%',
                                        border: '1px solid grey',
                                      }}
                                    >
                                      <p>
                                        {approvalStatus.length >= 4
                                          ? approvalStatus[3].workFlowAction
                                          : ''}
                                      </p>
                                      <p>
                                        {approvalStatus.length >= 4
                                          ? approvalStatus[3].updatedByName
                                          : ''}
                                      </p>
                                      <p>
                                        ID NO:{' '}
                                        {approvalStatus.length >= 4
                                          ? approvalStatus[3].updatedBy
                                          : ''}
                                      </p>
                                    </div>
                                    <div
                                      style={{
                                        width: '19.1775%',
                                        border: '1px solid grey',
                                      }}
                                    >
                                      <p>
                                        {approvalStatus.length === 5
                                          ? approvalStatus[4].workFlowAction
                                          : 'N/A'}
                                      </p>
                                      <p>
                                        {approvalStatus.length === 5
                                          ? approvalStatus[4].updatedByName
                                          : 'N/A'}
                                      </p>
                                      <p>
                                        ID NO:{' '}
                                        {approvalStatus.length === 5
                                          ? approvalStatus[4].updatedBy
                                          : ''}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </>
                          </th>
                        </tr>
                        </tbody>
                      </table>
                      <div
                        style={{
                          width: '100%',
                          paddingTop: '10px',
                          paddingLeft: '20px',
                          fontSize: '10px',
                          fontWeight: '500',
                        }}
                      >
                        <p>
                          Distribution: TO BE PREPARED IN TRIPLERUPLICATE AND
                          DISTRIBUTED AS FOLLOWS: 1. ORIGINAL-Store Accounts, 2.
                          DUPLICATES-Store Room 3. TRIPLICATE-Demander's Copy
                        </p>
                        <p>Issue: 02. Rev.01. Date: </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </StoreVoucherPrintFormat>
            <Row style={{marginTop: '12%'}}>
              <Col style={{margin: '0 auto'}}>
                {collection.length === 0 ? (
                  <Row justify="end">
                    <Empty style={{marginTop: '10px'}}/>
                  </Row>
                ) : (
                  <Row justify="center">
                    <Col style={{marginTop: 10}}>
                      <Pagination
                        showSizeChanger={false}
                        onShowSizeChange={console.log}
                        pageSize={pageSize}
                        current={currentPage}
                        onChange={paginate}
                        total={totalElements}
                      />
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </> : <Loading/>
        }
      </ARMCard>
    </CommonLayout>
  );
};

export default ApproveIssueDemandDetailsPrint;
