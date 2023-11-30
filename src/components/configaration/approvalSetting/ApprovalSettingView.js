import {Col, Modal, Row} from "antd";

export default function ApprovalSettingView({handleCloseModal, isModalOpen, approval}) {
    return (
        <Modal
            title="Company"
            onOk={handleCloseModal}
            onCancel={handleCloseModal}
            visible={isModalOpen}
            width={1000}
        >
            <Row>
                <Col
                    span={24}
                    md={12}
                >
                    <Row>
                        <DetailItem label="Workflow Action" value={approval.workFlowActionName} />
                        <DetailItem label="Submodule Item" value={approval.subModuleItemName} />
                        <DetailItem label="Users" value={
                            <ul>
                                {
                                    approval.selectedUsers?.map(user => <li key={user.userId}>{user.logIn}</li>)
                                }
                            </ul>
                        } />
                    </Row>
                </Col>
            </Row>
        </Modal>
    )
}

function DetailItem({label, value}) {
    return (
        <>
            <Col
                span={12}
                style={{marginBottom: '10px'}}
            >
                {label}:
            </Col>

            <Col
                span={12}
                style={{marginBottom: '10px'}}
            >
                {value}
            </Col>
        </>
    )
}