import React, { useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { Typography } from "antd";
import logo from "../../images/us-bangla-logo.png";
import moment from "moment";
import { DateFormat } from "../report/Common";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: `https://fonts.gstatic.com/s/sourcesanspro/v14/6xKydSBYKcSV-LCoeQqfX1RYOo3i54rAkA.ttf`,
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  section: {
    margin: 10,
    padding: 10,
    fontSize: 8,
  },
  image: {
    width: 330,
    height: 30,
  },
  logos: {
    margin: 10,
    padding: 10,
  },
  customH3: {
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 15,
    textDecoration: "underline",
    textDecorationColor: "black",
    marginBottom: 3,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  box: {
    width: "33%",
    height: 75,
    border: "1px solid black",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 8,
    marginLeft: 10,
    marginRight: 10,
  },
  content: {
    fontSize: 8,
    textAlign: "left",
    marginTop: 2,
    lineHeight: 0.8,
    padding: 2,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },

  tableCol1: {
    width: "3%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol2: {
    width: "41%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol3: {
    width: "16%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol4: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol5: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol6: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol7: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "3",
    marginTop: 5,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "left",
  },
  tableColumn: {
    fontFamily: "Roboto",
    margin: "3",
    marginTop: 5,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  CustomNoteDiv: {
    fontSize: 8,
    position: "absolute",
    bottom: 6,
    left: 6,
    right: 6,
    marginleft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  CustomCheckedDiv: {
    marginTop: 80,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    gap: 25,
    width: "100%",
  },
  CustomCheckedUl: {
    margin: 0,
    padding: 0,
  },
  CustomCheckedLi: {
    margin: "30px 0px",
    fontSize: 8,
  },
  pages: {
    flexDirection: "row",
    marginTop: 10,
  },
  containers: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 30,
    left: 6,
    right: 6,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  column: {
    fontSize: 12,
  },
  tableBox: {
    margin: 5,
    padding: 5,
  },
  boldContent: {
    fontFamily: "Roboto",
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 5,
  },
  boldNoteContent: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 7,
    bottom: 6,
  },
  CustomNoteBorder:{
    borderTop: "1px solid #000000",
    bottom: 7,
    marginLeft:10,
    marginRight:10
  }
});

const MultipleWorkOrder = ({ data }) => (
  console.log({ data }),
  (
    <Document>
      {data?.map((item,index) => (
        <Page
          wrap
          size="A4"
          orientation="landscape"
          style={{ padding: "0.2in" }}
          key={index}
        >
          <View fixed style={styles.header}>
            <View>
              <Text style={styles.logos}>
                <Image style={styles.image} src={logo} alt="" />
              </Text>
            </View>
            <View style={styles.section}>
              <Text>FORM: CAME-022</Text>
              <Text>ISSUE: 01</Text>
              <Text>DATE: 19-02-2023</Text>
            </View>
          </View>

          <View>
            <Text style={styles.customH3}>Maintenance work order</Text>
          </View>
          <View style={styles.container}>
            <View style={styles.box}>
              <Text style={styles.content}>
                AIRCRAFT REGEN:{" "}
                <Text
                  style={[styles.boldContent, { textDecoration: "underline" }]}
                >
                  {item.aircraftName}
                </Text>
              </Text>
              <Text style={styles.content}>
                AIRCRAFT SL. NO:{" "}
                <Text
                  style={[styles.boldContent, { textDecoration: "underline" }]}
                >
                  {item.airframeSerial}
                </Text>
              </Text>
              <Text style={styles.content}>
                WORK SHOP/MAINT:{" "}
                <Text
                  style={[styles.boldContent, { textDecoration: "underline" }]}
                >
                  {item.workShopMaint ? item.workShopMaint : "N/A"}
                </Text>
              </Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.content}>
                W/O NO:{" "}
                <Text
                  style={[styles.boldContent, { textDecoration: "underline" }]}
                >
                  {item.woNo}
                </Text>
              </Text>
              <Text style={styles.content}>
                DATE:{" "}
                <Text
                  style={[styles.boldContent, { textDecoration: "underline" }]}
                >
                  {DateFormat(item.date)}
                </Text>
              </Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.content}>
                TOTAL A/C HRS:{" "}
                <Text
                  style={[styles.boldContent, { textDecoration: "underline" }]}
                >
                  {(item.totalAcHours)}
                </Text>
              </Text>
              <Text style={styles.content}>
                TOTAL A/C LANDING:{" "}
                <Text
                  style={[styles.boldContent, { textDecoration: "underline" }]}
                >
                  {item.totalAcLanding}
                </Text>
              </Text>
              <Text style={styles.content}>
                TSN/CSN OF THE COMP:{" "}
                <Text
                  style={[styles.boldContent, { textDecoration: "underline" }]}
                >
                  {item.tsnComp ? item.tsnComp : "N/A"}
                </Text>
              </Text>
              <Text style={[styles.content,{fontSize:"8px"}]}>
                TSO/CSO OF THE COMP:{" "}
                <Text
                  style={[styles.boldContent, { textDecoration: "underline" }]}
                >
                  {item.tsoComp ? item.tsoComp : "N/A"}
                </Text>
              </Text>
              <Text style={styles.content}>
                AS OF (DATE):{" "}
                <Text
                  style={[styles.boldContent, { textDecoration: "underline" }]}
                >
                  {DateFormat(item.asOfDate)}
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.tableBox}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableColumn}>SL{"\n"} NO</Text>
                </View>
                <View style={styles.tableCol2}>
                  <Text style={[styles.tableColumn,{fontSize:"8px"}]}>
                    BERIEF DESCRIPTION (D.I/ PDC /ANY OTHER CHECK/{"\n"}{" "}
                    INSPECTION / MO / IO NO / COMPONENT CHANGE{"\n"} ETC,)
                  </Text>
                </View>
                <View style={styles.tableCol3}>
                  <Text style={styles.tableColumn}>
                    WORK CARD NO{"\n"} / M.O. / TO NO. P/N & S/N{"\n"} ETC.
                  </Text>
                </View>
                <View style={styles.tableCol4}>
                  <Text style={styles.tableColumn}>
                    COMPLIANCE{"\n"} REQUIRED BY DT,{"\n"} TAT. TAC ETC.
                  </Text>
                </View>
                <View style={styles.tableCol5}>
                  <Text style={styles.tableColumn}>
                    ACCOMPLISH-MENT {"\n"} DATE
                  </Text>
                </View>
                <View style={styles.tableCol6}>
                  <Text style={styles.tableColumn}>
                    SIG & AUTH.NO,{"\n"} OF SHIFT I/C OR{"\n"} SHOP I/C /AME
                  </Text>
                </View>
                <View style={styles.tableCol7}>
                  <Text style={styles.tableColumn}>REMARKS (IF ANY)</Text>
                </View>
              </View>

              {item.woTaskViewModelList.map((a, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol1}>
                    <Text style={styles.tableCell}>{a?.slNo}</Text>
                  </View>
                  <View style={styles.tableCol2}>
                    <Text style={styles.tableCell}>{a?.description}</Text>
                  </View>
                  <View style={styles.tableCol3}>
                    <Text style={styles.tableCell}>{a?.workCardNo}</Text>
                  </View>
                  <View style={styles.tableCol4}>
                    <Text style={[styles.tableCell,{textAlign:"center"}]}>
                      {a?.complianceDate
                        ? moment(a?.complianceDate).format("DD-MMM-YYYY")
                        : null}
                    </Text>
                  </View>
                  <View style={styles.tableCol5}>
                    <Text style={[styles.tableCell,{textAlign:"center"}]}>
                      {a?.accomplishDate
                        ? moment(a?.accomplishDate).format("DD-MMM-YYYY")
                        : null}
                    </Text>
                  </View>
                  <View style={styles.tableCol6}>
                    <Text style={[styles.tableCell,{textAlign:"center"}]}>{a?.authNo}</Text>
                  </View>
                  <View style={styles.tableCol7}>
                    <Text style={[styles.tableCell,{textAlign:"center"}]}>{a?.remarks}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.containers}>
            <View style={styles.column}>
              <View style={styles.CustomCheckedUl}>
                <View styel={styles.CustomCheckedLi}>
                  <Text style={{ fontSize: 8 }}>
                    PREPARED BY
                    :......................................................................................{" "}
                  </Text>
                  <View>
                    <Text style={{ fontSize: 8, marginLeft: 60 }}>
                      (ENGG. PLANNING)
                    </Text>
                  </View>
                </View>
                <Text>{"\n"}</Text>

                <View styel={styles.CustomCheckedLi}>
                  <Text style={{ fontSize: 8 }}>
                    APPROVED BY
                    :......................................................................................{" "}
                  </Text>
                  <View>
                    <Text style={{ fontSize: 8, marginLeft: 60 }}>
                      (MANAGER PLANNING )
                    </Text>
                  </View>
                </View>
                <Text>{"\n"}</Text>
                <View styel={styles.CustomCheckedLi}>
                  <Text style={{ fontSize: 8 }}>
                    RECEIVED BY
                    :.......................................................................................{" "}
                  </Text>
                  <View>
                    <Text style={{ fontSize: 8, marginLeft: 60 }}>
                      (MCC/PPC/DUTY ENGR/SHOP IN-CHARGE)
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.CustomCheckedUl}>
                <View styel={styles.CustomCheckedLi}>
                  <Text style={{ fontSize: 8 }}>
                    CHECKED BY :
                    ......................................................................................................{" "}
                  </Text>
                  <View>
                    <Text style={{ fontSize: 8, marginLeft: 120 }}>
                      (ENGG. PLANNING)
                    </Text>
                  </View>
                </View>
                <Text>{"\n"}</Text>
                <View styel={styles.CustomCheckedLi}>
                  <Text style={{ fontSize: 8 }}>
                    RECEIVED AND UPDATED BY
                    :............................................................................{" "}
                  </Text>
                  <View>
                    <Text style={{ fontSize: 8, marginLeft: 120 }}>
                      (TECH. RECORD)
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.CustomNoteDiv}>
            <Text style={styles.CustomNoteBorder}>
              <Text style={styles.boldNoteContent}> Note:</Text> To be raised in
              duplicate: One copy will remain with originator. Other copy is to
              be given to the concerned shop / section and after accomplishment
              of job same is to be returned to originator
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  )
);

export default MultipleWorkOrder;
