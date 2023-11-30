import {useMemo, useState} from "react";
import permissions from "../auth/permissions";
import useFeaturesPermission, {Types} from "../../lib/hooks/useFeaturesPermission";
import {Col, List, Row} from "antd";
import ARMCard from "../common/ARMCard";
import {Link} from "react-router-dom";
import CommonLayout from "../layout/CommonLayout";


export default function TechRecord() {

    const {hasPermission} = useFeaturesPermission();

    const [TechRecordSubmodules] = useState([

        {
            name: "Operation",
            permission: permissions.DEFAULT,
            features: [

                {name: "Operational Statistics", url: "operational-statistics",},
                {name: "Fleet Utilization", url: "fleet-utilization"},
                {name: "Service Utilization", url: "service-utilization"},
            ],
        },
        {
            name: "Dispatch",
            permission: permissions.DEFAULT,
            features: [
                {name: "Interruption", url: "interruption",},
                {name: "Cancellation", url: "cancellation"},
                {name: "Dispatch Statistics", url: "dispatch-statistics"},
                {name: "Dispatch Interruption", url: "dispatch-interruption"},
            ],
        },
        {
            name: "Incident",
            permission: permissions.DEFAULT,
            features: [

                {name: "Incident", url: "incident",},
                {name: "Incident Statistics", url: "incident-statistics",},
                {name: "Technical Incident", url: "technical-non-technical-incident",},
            ],
        },
        {
            name: "Engine Incident",
            permission: permissions.DEFAULT,
            features: [

                {name: "Engine", url: "engine-incidents",},
                {name: "Engine Incident", url: "engine-incident",},
            ],
        },
        {
            name: "Alert",
            permission: permissions.DEFAULT,
            features: [
                {name: "Alert Level", url: "alert-level",},
                {name: "Alert Level calculation", url: "alert-level-report",},
            ],
        },
        {
            name: "System",
            permission: permissions.DEFAULT,
            features: [

                {name: "System", url: "systems",},
                {name: "System Reliability", url: "system-reliability",},
            ],
        },
        {
            name: "Defects",
            permission: permissions.DEFAULT,
            features: [

                {name: "Defect", url: "defect"},
                {name: "CRR", url: "crr"},
                {name: "Top ATA", url: "top-ata-report"},
            ],
        }

    ])

    const filteredTechRecordSubmodules = useMemo(
        () => TechRecordSubmodules
            .filter(item => hasPermission(item.permission, Types.SUB_MODULE))
            .map(({name, permission, features}) => {
                return {
                    name,
                    permission,
                    features: features.filter(feature => hasPermission(feature.permission, Types.SUB_MODULE_ITEM))
                }
            }),

        [TechRecordSubmodules]
    );

    return (
        <CommonLayout>
            <Row gutter={[15, 25]}>
                {filteredTechRecordSubmodules.map((subModule) => (
                    <Col key={subModule.name} md={6} sm={12} xs={24}>
                        <ARMCard title={subModule.name?.toUpperCase()}>
                            <List
                                itemLayout="horizontal"
                                dataSource={subModule.features}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Link style={{width: "100%"}} to={`/reliability/${item.url}`}>
                                            {item.name}
                                        </Link>
                                    </List.Item>
                                )}
                            />
                        </ARMCard>
                    </Col>
                ))}
            </Row>

        </CommonLayout>
    );
}