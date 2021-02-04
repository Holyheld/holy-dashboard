import { linkTemplate } from '../link/link.template';

export const walletInfoItemTemplate = ({ title, quantity, multiplier }) => `
	<div class="wallet-info__item">
		<h3 class="h2 wallet-info__item-title">${title}</h3>
		<span class="wallet-info__value"><span>${quantity}</span></span>
		${
			typeof multiplier === 'number'
				? `<span class="wallet-info__value wallet-info__value_gradient"><span>${multiplier}x</span></span>`
				: ''
		}
	</div>
`;

export const walletInfoOptionsTemplate = ({
	pendingBalanceTitle,
	pendingHolyTitle,
	options
}) => `
	<ul class="wallet-info__list">
	${options.reduce(
		(accumulator, current) => `
		${accumulator}
		<li class="wallet-info__list-item">
			<div class="wallet-info__row">
				${walletInfoItemTemplate({
					title: `${pendingBalanceTitle} ${current.name}`,
					quantity: current.currentlyStaked
				})}
				${walletInfoItemTemplate({
					title: pendingHolyTitle,
					quantity: current.pendingHoly,
					multiplier: current.multiplier
				})}
			</div>
		</li>
	`,
		''
	)}
	</ul>
`;

export const walletInfoTableTemplate = ({ tableColumns, table }) => `
	<table class="wallet-info__table">
		<thead>
			<tr>
				${tableColumns.reduce(
					(accumulator, current) => `
					${accumulator}
					<td>${current}</td>
				`,
					''
				)}
			</tr>
		</thead>
		<tbody>
			${table.reduce(
				(accumulator, current) => `
				${accumulator}
				<tr>
					<td>${current.date !== null ? current.date : ''}</td>
					<td>${current.type !== null ? current.type : ''}</td>
					<td>${current.amount !== null ? `${current.amount} ${current.name}` : ''}</td>
					<td>${current.rewards !== null ? `${current.rewards} HOLY` : ''}</td>
					<td>${current.bonus !== null ? `${current.bonus}x` : ''}</td>
					<td>${
						current.transaction !== null
							? linkTemplate({
									mod: 'blue',
									text: 'Link',
									href: current.transaction,
									target: '_blank',
									rel: 'noreferrer noopener'
							  })
							: ''
					}</td>
				</tr>
			`,
				''
			)}
		</tbody>
	</table>
`;

export const walletInfoTemplate = ({
	title,
	totalEarnedHolyTitle,
	pendingBonusHolyTitle,
	pendingBalanceTitle,
	pendingHolyTitle,
	tableColumns,
	totalEarnedHoly,
	pendingBonusHoly,
	avgMultiplier,
	options,
	table
}) => `
	<section class="section wallet-info">
		<h2 class="wallet-info__title">${title}</h2>
		<div class="wallet-info__total">
			<div class="wallet-info__row">
				${walletInfoItemTemplate({
					title: totalEarnedHolyTitle,
					quantity: totalEarnedHoly
				})}
				${walletInfoItemTemplate({
					title: pendingBonusHolyTitle,
					quantity: pendingBonusHoly,
					multiplier: avgMultiplier
				})}
			</div>
		</div>
		${
			options.length
				? walletInfoOptionsTemplate({
						pendingBalanceTitle,
						pendingHolyTitle,
						options
				  })
				: ''
		}
		${table.length ? walletInfoTableTemplate({ tableColumns, table }) : ''}
	</section>
`;
