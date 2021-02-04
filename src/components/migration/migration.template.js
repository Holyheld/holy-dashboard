import { buttonTemplate } from '../button/button.template';

export const migrationTemplate = ({
	title,
	text,
	buttonApprove,
	buttonMigrate,
	needToMigrate,
	pendingBonusHoly,
	isApproved
}) => `
	<section class="section migration js-migration ${
		isApproved ? 'is-approved' : ''
	}">
		<h2 class="migration__title">${title}</h2>
		<p class="migration__text">${text[0]} ${needToMigrate} ${
	text[1]
} ${pendingBonusHoly} ${text[2]}</p>
		${buttonTemplate({
			className:
				'migration__button migration__button_approve js-migrate-approve-button',
			mod: 'dark',
			text: buttonApprove
		})}
		${buttonTemplate({
			className:
				'migration__button migration__button_open-modal js-open-modal-migrate-tokens-button',
			mod: 'dark',
			text: buttonMigrate
		})}
	</section>
`;
