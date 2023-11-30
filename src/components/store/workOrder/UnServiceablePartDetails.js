import React from 'react';
import ResponsiveTable from "../../common/ResposnsiveTable";
import {Col, Row} from "antd";
import ARMTable from "../../common/ARMTable";

const UnServiceablePartDetails = (props) => {
    const {unSPartIdSingle} = props;
    console.log("child ",unSPartIdSingle)
    return (
        <ResponsiveTable style={{marginTop:"40px"}}>
            <ARMTable>
                <thead>
                <tr>
                    <th>Part Name</th>
                    <th>Serial No.</th>
                    <th>Station</th>
                    <th>QTY.</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{unSPartIdSingle.partNo}</td>
                    <td>{unSPartIdSingle.removedPartSerialNo}</td>
                    <td>{unSPartIdSingle.airportName}</td>
                    <td>1</td>
                </tr>
                </tbody>
                <thead>
                <tr>
                    <th rowSpan={2}>Form</th>
                    <th rowSpan={2}>Position</th>
                    <th colSpan={2}>Date</th>
                </tr>
                <tr>
                    <th>Removed</th>
                    <th>Received</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{unSPartIdSingle.aircraftName}</td>
                    <td>{unSPartIdSingle.position}</td>
                    <td>{unSPartIdSingle.removalDate}</td>
                    <td>{unSPartIdSingle.receiveDate}</td>
                </tr>
                </tbody>
            </ARMTable>
        </ResponsiveTable>
    );
};

export default UnServiceablePartDetails;