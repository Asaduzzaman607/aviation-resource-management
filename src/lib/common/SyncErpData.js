import {Button, Col, Row} from 'antd';
import React from 'react';
import {SyncOutlined} from "@ant-design/icons";
import {useErpData} from "../../components/employees/useErpData";

export const SyncErpData = (title) => {

    const { syncErpData } = useErpData()

    return (
        <Row justify="space-between">
            <Col>{title}</Col>
            <Col>
                <Button onClick = {syncErpData} type="primary" style={{backgroundColor: '#04aa6d', borderColor: 'transparent', borderRadius: '5px'}}>
                    <SyncOutlined spin = {false} /> Sync
                </Button>
            </Col>
        </Row>
    )
}