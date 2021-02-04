import { buttonTemplate } from '../button/button.template';

export const modalMigrateTokensTemplate = ({ title, description, buttons }) => `
	<div
		class="modal modal-migrate-tokens js-modal-migrate-tokens"
		id="modal-migrate-tokens"
		aria-hidden="true"
		style="display: none;"
	>
		<div class="modal__shield" data-micromodal-close>
			<div
				class="modal__dialog js-modal-dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-migrate-tokens-title"
			>
				<header class="modal__header">
					<h2 class="h3 modal__title" id="modal-migrate-tokens-title">${title}</h2>
				</header>
				<div class="modal__content" id="modal-migrate-tokens-content">
					<div class="modal__body">
						<p class="modal-migrate-tokens__description">
							<span class="js-number animated" data-code="holyBalance" data-decimal-places="4">0.0000</span>
							<span> ${description}</span>
						</p>
					</div>
					<div class="modal__footer">
						${buttonTemplate({
							className: 'modal__footer-button js-modal-migrate-tokens-cancel',
							text: buttons[0]
						})}
						${buttonTemplate({
							className: 'modal__footer-button js-migrate',
							mod: 'dark',
							text: buttons[1]
						})}
					</div>
				</div>
			</div>
		</div>
	</div>
`;
