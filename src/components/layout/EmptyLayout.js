export default function EmptyLayout({children, ...rest}) {
	return (
		<div {...rest}>
			{children}
		</div>
	)
}