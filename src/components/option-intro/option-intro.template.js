import { backLinkTemplate } from '../back-link/back-link.template';

export const optionIntroTemplate = ({
	title,
	description,
	detailedDescription,
	pageName
}) => `
	<section class="section option-intro">
		${backLinkTemplate({
			className: 'option-intro__back-link js-router-link',
			title: 'Back',
			href: '/'
		})}
		<h1 class="option-intro__title">${title}</h1>
		<p class="option-intro__description">${detailedDescription || description}</p>
		<div class="option-intro__logos">
			<picture class="option-intro__picture">
				<source
					type="image/webp"
					srcset="/assets/images/${pageName}@2x.webp"
				></source>
				<img
					class="option-intro__image"
					src="/assets/images/${pageName}@2x"
					srcset="/assets/images/${pageName}@2x.png"
					alt=""
				/>
			</picture>
			<picture class="option-intro__picture">
				<source
					type="image/webp"
					srcset="/assets/images/logo-circle@2x.webp"
				></source>
				<img
					class="option-intro__image"
					src="/assets/images/logo-circle@2x.png"
					srcset="/assets/images/logo-circle@2x.png"
					alt=""
				/>
			</picture>
		</div>
	</section>
`;
