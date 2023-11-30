import useFeaturesPermission, {Types} from "../../lib/hooks/useFeaturesPermission";
import {useMemo, useState} from "react";
import permissions from "../auth/permissions";
import CommonLayout from "../layout/CommonLayout";
import {Col, List, Row} from "antd";
import ARMCard from "../common/ARMCard";
import {Link} from "react-router-dom";

export default function TechnicalService() {

    const {hasPermission} = useFeaturesPermission();

    const [TechnicalServiceSubmodules] = useState([

        {
            name: "Task Status",
            permission: permissions.DEFAULT,
            features: [

                {name: "Task Status Report", url: "task-status"},
            ],
        },


    ])

    const filteredTechnicalServiceSubmodules = useMemo(
        () => TechnicalServiceSubmodules
            .filter(item => hasPermission(item.permission, Types.SUB_MODULE))
            .map(({name, permission, features}) => {
                return {
                    name,
                    permission,
                    features: features.filter(feature => hasPermission(feature.permission, Types.SUB_MODULE_ITEM))
                }
            }),

        [TechnicalServiceSubmodules]
    );

    return (
        <CommonLayout>
            <Row gutter={[15, 25]}>
                {filteredTechnicalServiceSubmodules.map((subModule) => (
                    <Col key={subModule.name} md={6} sm={12} xs={24}>
                        <ARMCard title={subModule.name?.toUpperCase()}>
                            <List
                                itemLayout="horizontal"
                                dataSource={subModule.features}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Link style={{width: "100%"}} to={`/technical-service/${item.url}`}>
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