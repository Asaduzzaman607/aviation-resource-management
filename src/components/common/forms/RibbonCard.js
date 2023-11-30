import { Badge, Card } from "antd";

const RIBBON_COLOR = '#04AA6DFF'

export default function RibbonCard({ children, ribbonText, bgColor }) {
	const ribbonStyles = {background: bgColor};
	const groupStyles = {marginBottom: '1em', paddingTop: '1em'};
	
	return (
		<Badge.Ribbon style={ribbonStyles} text={ribbonText} placement="start">
			<Card style={groupStyles}>
				{children}
			</Card>
		</Badge.Ribbon>
	)
}

RibbonCard.defaultProps = {
	bgColor: RIBBON_COLOR
}