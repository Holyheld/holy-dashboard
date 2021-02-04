import { buttonTemplate } from '../button/button.template';

export const notificationTemplate = ({
	title,
	emoji,
	subtitle,
	description,
	button,
	buttonClass
}) => `
	<section class="section notification">
		<h2 class="notification__title">${title}</h2>
		<div class="notification__body">
			<span class="notification__emoji">${emoji}</span>
			<h3 class="h2 notification__subtitle">${subtitle}</h2>
			<p class="notification__description">${description}</p>
			${buttonTemplate({
				className: `notification__button ${buttonClass}`,
				text: button
			})}
		</div>
	</section>
`;
