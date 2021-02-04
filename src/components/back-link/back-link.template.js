import { iconTemplate } from '../icon/icon.template';

export const backLinkTemplate = ({ className, title, href }) => `
	<a class="back-link ${className}" href="${href}" title="${title}">
		${iconTemplate({
			className: 'back-link__icon',
			id: 'icon-arrow-left'
		})}
	</a>
`;
