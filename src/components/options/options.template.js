import { optionCardTemplate } from '../option-card/option-card.template';
import { optionSimpleTemplate } from '../option-simple/option-simple.template';

export const optionsTemplate = ({ premium, other, items }) => `
	<section class="section options">
		<div class="options__block">
			<h2 class="options__title">${premium.title}</h2>
			<p class="options__description">${premium.description}</p>
			<ul class="options__cards">
				${items
					.filter((_, i) => i < 2)
					.reduce(
						(accumulator, current) => `
					${accumulator}
					<li class="options__card">${optionCardTemplate({
						disabled: current.body.disabled,
						label: current.body.label,
						title: current.body.title,
						description: current.body.description,
						shadow: current.body.shadow,
						pageName: current.pageName
					})}</li>
				`,
						''
					)}
			</ul>
		</div>
		<div class="options__block">
			<h2 class="options__title">${other.title}</h2>
			<p class="options__description">${other.description}</p>
			<ul class="options__list">
				${items
					.filter((_, i) => i > 1)
					.reduce(
						(accumulator, current) => `
					${accumulator}
					<li class="options__item">${optionSimpleTemplate({
						disabled: current.body.disabled,
						title: current.body.title,
						description: current.body.description,
						pageName: current.pageName
					})}</li>
				`,
						''
					)}
			</ul>
		</div>
	</section>
`;
