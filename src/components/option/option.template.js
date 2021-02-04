import { optionIntroTemplate } from '../option-intro/option-intro.template';
import { modalDepositTokensTemplate } from '../modal-deposit-tokens/modal-deposit-tokens.template';

export const optionTemplate = ({
	name,
	id,
	officialPoolLink,
	title,
	description,
	detailedDescription,
	modalDepositTokens
}) => `
	<div class="options js-option"
		data-id="${id}"
		data-name="${name}"
		data-official-pool-link="${officialPoolLink}"
	>
		${optionIntroTemplate({
			title,
			description,
			detailedDescription,
			pageName: id
		})}
		<div id="need-to-connect"></div>
		<div id="forecasts"></div>
		<div id="need-to-approve"></div>
		<div id="current-state"></div>
		${modalDepositTokensTemplate({
			title: `${modalDepositTokens.title[0]} ${name} ${modalDepositTokens.title[1]}`,
			description: name,
			buttons: modalDepositTokens.buttons
		})}
	</div>
`;
