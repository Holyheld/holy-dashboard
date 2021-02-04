import { introTemplate } from '../intro/intro.template';
// import { emojiItemsTemplate } from '../emoji-items/emoji-items.template';
import { optionsTemplate } from '../options/options.template';
import { modalMigrateTokensTemplate } from '../modal-migrate-tokens/modal-migrate-tokens.template';

export const homeTemplate = ({
	intro,
	// numbers,
	options,
	modalMigrateTokens
}) => `
	<div class="home js-home">
		${introTemplate(intro)}

		<div id="migration"></div>
		<div id="wallet-info"></div>
		${optionsTemplate(options)}
		${modalMigrateTokensTemplate({
			title: modalMigrateTokens.title,
			description: modalMigrateTokens.tokenName,
			buttons: modalMigrateTokens.buttons
		})}
	</div>
`;

// ${emojiItemsTemplate(numbers)}
