import { Col, Row } from "antd";

export default function ViewItem({ label, children }) {
	return <Row>
		<Col span={8} >
			<label>{label}:</label>
		</Col>
		
		<Col span={16}>
			{children}
		</Col>
	</Row>
}