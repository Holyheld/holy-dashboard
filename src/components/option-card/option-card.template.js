import { buttonTemplate } from '../button/button.template';

export const optionCardTemplate = ({
	disabled,
	label,
	title,
	description,
	shadow,
	pageName
}) => `
	<article class="option-card" style="box-shadow: 0 0 18px 0 ${shadow};">
		<picture class="option-card__picture">
			<source
				type="image/webp"
				srcset="/assets/images/${pageName}@2x.webp"
			/>
			<img
				class="option-card__image"
				src="/assets/images/${pageName}@2x.png"
				srcset="/assets/images/${pageName}@2x.png"
				alt=""
			/>
		</picture>
		<h3 class="h2 option-card__title">${title}</h3>
		<p class="option-card__description">${description}</p>

		${buttonTemplate({
			className: 'option-card__button js-router-link',
			text: disabled ? 'Not available yet' : 'Select',
			href: disabled ? null : `/${pageName}/`,
			disabled
		})}
		${
			label
				? `
			<picture class="option-card__label-picture">
				<source
					type="image/webp"
					srcset="/assets/images/label-${label}@2x.webp"
				/>
				<img
					class="option-card__label-image"
					src="/assets/images/label-${label}@2x.png"
					srcset="/assets/images/label-${label}@2x.png"
					alt=""
				/>
			</picture
		`
				: ''
		}
	</article>
`;

// <span class="option-card__apy">
//	<span>APY </span><span class="js-number" data-code="apy" data-name="${pageName}" data-decimal-places="2">0.00</span><span>%</span>
// </span>
