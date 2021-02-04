import { iconTemplate } from '../icon/icon.template';

export const buttonTemplate = ({
	className,
	mod,
	size,
	icon,
	text,
	type,
	href,
	target,
	title,
	rel,
	ariaLabel,
	disabled
}) => `
	<${href ? 'a' : 'button'}
		class="button js-focus-visible
			${className || ''}
			${size ? `button_${size}` : 'button_lg'}
			${mod ? `button_${mod}` : ''}
		"
		${!href ? `type=${type || 'button'}` : ''}
		${href ? `href=${href}` : ''}
		${href && target ? `target=${target}` : ''}
		${href && rel ? `rel=${rel}` : ''}
		${title ? `title=${title}` : ''}
		${ariaLabel ? `aria-label=${ariaLabel}` : ''}
		${disabled ? `disabled=${disabled}` : ''}
	>
		${
			icon
				? iconTemplate({
						className: 'button__icon',
						id: icon
				  })
				: ''
		}
		<span class="button__text">${text}</span>
	</${href ? 'a' : 'button'}>
`;
