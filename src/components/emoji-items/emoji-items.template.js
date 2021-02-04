export const emojiValueNumberTemplate = ({
	prefix,
	valueCode,
	fourDecimalPlaces
}) => `
	${prefix ? `<span>${prefix}</span>` : ''}<span
		class="js-number animated"
		data-code="${valueCode}"
		data-decimal-places="${fourDecimalPlaces ? 4 : 2}"
		>
		${fourDecimalPlaces ? '0.0000' : '0.00'}
	</span>
`;

export const emojiItemTemplate = ({
	emoji,
	name,
	nameNumberPostfix,
	prefix,
	nameCode,
	fourDecimalPlaces,
	valueCode,
	valueText
}) => `
	<li class="emoji-items__item">
	<span class="emoji-items__emoji">${emoji}</span>
	<dl class="emoji-items__info">
		<dt class="emoji-items__name">
			<span>${name}</span>
			${
				nameNumberPostfix
					? `<span> - </span><span class="js-number" data-code="${nameCode}">0.00</span><span>${nameNumberPostfix}</span>`
					: ''
			}
		</dt>
		<dd class="emoji-items__value">
			${valueText ||
				emojiValueNumberTemplate({ prefix, valueCode, fourDecimalPlaces })}
		</dd>
	</dl>
	</li>
`;

export const emojiItemsTemplate = ({ title, items }) => `
	<section class="section emoji-items">
		<h2 class="emoji-items__title">${title}</h2>
		<ul class="emoji-items__list">
			${items
				.filter(item => !item.isHidden)
				.reduce(
					(accumulator, current) => `
				${accumulator}
				${emojiItemTemplate(current)}
			`,
					''
				)}
		</ul>
	</section>
`;
