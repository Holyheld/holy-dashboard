export const introTemplate = ({ title, description }) => `
	<section class="section intro">
		<h1 class="intro__title">${title}</h1>
		${description.reduce(
			(accumulator, current) => `
			${accumulator}
			<p class="intro__description">${current}</p>
		`,
			''
		)}
	</section>
`;
