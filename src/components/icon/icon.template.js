export const iconTemplate = ({ className, id }) => `
	<svg
		class="${className || ''}"
		role="img"
	>
		<use xlink:href="#${id}"></use>
	</svg>
`;
