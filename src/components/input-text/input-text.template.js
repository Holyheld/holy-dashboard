export const inputTextTemplate = ({
	className,
	type,
	name,
	value,
	autocomplete,
	maxButton
}) => `
	<div
		class="
			input-text
			js-input-text
			${className}
			${maxButton ? 'input-text_with-max-button' : ''}
		"
	>
		<input
			class="input-text__input js-input-text-input"
			type="${type}"
			name="${name}"
			value="${value}"
			autocomplete="${autocomplete}"
		/>
		${
			maxButton
				? `
			<button
				class="input-text__max-button js-input-text-max-button js-focus-visible"
				type="button"
			>
				Max
			</button>
		`
				: ''
		}
	</div>
`;
