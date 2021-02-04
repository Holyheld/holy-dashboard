export const linkTemplate = ({
	className,
	mod,
	text,
	href,
	target,
	rel,
	itemprop,
	title,
	ariaLabel
}) => `
	<${href ? 'a' : 'button'}
		class="link js-focus-visible
			${className || ''}
			${mod ? `link_${mod}` : ''}
		"
		${!href ? `type=${type || 'button'}` : ''}
		${href ? `href=${href}` : ''}
		${href && target ? `target=${target}` : ''}
		${href && rel ? `rel=${rel}` : ''}
		${title ? `title=${title}` : ''}
		${ariaLabel ? `aria-label=${ariaLabel}` : ''}
		${itemprop ? `itemprop=${itemprop}` : ''}
	>
		${text}
	</${href ? 'a' : 'button'}>
`;
