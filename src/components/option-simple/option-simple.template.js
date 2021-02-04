import { buttonTemplate } from '../button/button.template';

export const optionSimpleTemplate = ({
	disabled,
	title,
	description,
	pageName
}) => `
	<article class="option-simple">
		<div class="option-simple__col">
			<picture class="option-simple__picture">
				<source
					type="image/webp"
					media="(max-width: 1023px)"
					srcset="/assets/images/${pageName}-xs@2x.webp"
				/>
				<source
					media="(max-width: 1023px)"
					srcset="/assets/images/${pageName}-xs@2x.png"
				/>
				<source
					type="image/webp"
					srcset="/assets/images/${pageName}-sm@2x.webp"
				/>
				<img
					class="option-simple__image"
					src="/assets/images/${pageName}-sm@2x.png"
					srcset="/assets/images/${pageName}-sm@2x.png"
					alt=""
				/>
			</picture>
		</div>
		<div class="option-simple__col">
			<dl class="option-simple__info">
				<dt class="option-simple__name">${title}</dt>
				<dd class="option-simple__value">${description}</dd>
			</dl>
		</div>
		<div class="option-simple__col">
		
		</div>
		<div class="option-simple__col">
			${buttonTemplate({
				className: 'option-simple__button js-router-link',
				text: disabled ? 'Not available yet' : 'Select',
				href: disabled ? null : `/${pageName}/`,
				disabled
			})}
		</div>
	</article>
`;

// <dl class="option-simple__info">
// 	<dt class="option-simple__name">APY</dt>
// 	<dd class="option-simple__value">
// 		<span class="js-number" data-code="apy" data-name="${pageName}" data-decimal-places="2">0.00</span><span>%</span>
// 	</dd>
// </dl>
