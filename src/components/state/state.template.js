import { buttonTemplate } from '../button/button.template';

export const stateTemplate = ({
	numberCode,
	title,
	blue,
	description,
	buttons
}) => `
	<section class="section state">
		<div class="state__header">
			<h2 class="state__title">${title}</h2>
			<span class="state__value ${
				blue ? 'state__value_blue' : ''
			} js-number animated" data-code="${numberCode}" data-decimal-places="4">0.0000</span>
		</div>
		<p class="state__description">${description}</p>
		<div class="state__buttons">
			${buttons.reduce(
				(accumulator, current) => `
				${accumulator}
				${buttonTemplate(current)}
			`,
				''
			)}
		</div>
	</section>
`;
