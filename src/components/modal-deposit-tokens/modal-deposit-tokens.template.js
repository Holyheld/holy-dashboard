import { inputTextTemplate } from '../input-text/input-text.template';
import { buttonTemplate } from '../button/button.template';

export const modalDepositTokensTemplate = ({ title, description, buttons }) => `
	<div
		class="modal modal-deposit-tokens js-modal-deposit-tokens"
		id="modal-deposit-tokens"
		aria-hidden="true"
		style="display: none;"
	>
		<div class="modal__shield" data-micromodal-close>
			<div
				class="modal__dialog js-modal-dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-deposit-tokens-title"
			>
				<header class="modal__header">
					<h2 class="h3 modal__title" id="modal-deposit-tokens-title">${title}</h2>
				</header>
				<div class="modal__content" id="modal-deposit-tokens-content">
					<div class="modal__body">
						<p class="modal-deposit-tokens__description">
							<span class="js-number" data-code="tokenBalance" data-decimal-places="4">0.0000</span>
							<span> ${description}</span>
						</p>
						${inputTextTemplate({
							className: 'modal-deposit-tokens__input js-deposit-tokens-input',
							type: 'text',
							name: 'input_tokens',
							value: '0.0000',
							autocomplete: 'off',
							maxButton: true
						})}
					</div>
					<div class="modal__footer">
						${buttonTemplate({
							className: 'modal__footer-button js-modal-deposit-tokens-cancel',
							text: buttons[0]
						})}
						${buttonTemplate({
							className: 'modal__footer-button js-stake',
							mod: 'dark',
							text: buttons[1]
						})}
					</div>
				</div>
			</div>
		</div>
	</div>
`;
