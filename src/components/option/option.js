import IMask from 'imask';

import Modal from '../modal/modal';
import ModalDepositTokens, {
	MASK_OPTIONS,
	START_INPUT_VALUE
} from '../modal-deposit-tokens/modal-deposit-tokens';

import WalletService from '../../services/wallet-service';
import NumbersService, { CODES } from '../../services/numbers-service';

import { bnToDec, decToBn } from '../../services/wallet/tokenutils';

import data from '../../scripts/data';

import { notificationTemplate } from '../notification/notification.template';
import { emojiItemsTemplate } from '../emoji-items/emoji-items.template';
import { stateTemplate } from '../state/state.template';

const UPDATE_VALUES_INTERVAL = 20000;

export default class Option {
	constructor(element) {
		this.element = element;

		this.id = this.element.dataset.id;
		this.name = this.element.dataset.name;
		this.officialPoolLink = this.element.dataset.officialPoolLink;

		// this.openDepositTokensModalButton = null;
		this.openConnectWalletModalButton = null;
		this.depositTokensModalId = 'modal-deposit-tokens';
		this.connectWalletModalId = 'modal-connect-wallet';
		this.modalInstance = new Modal();

		this.depositTokensInput = this.element.querySelector(
			'.js-deposit-tokens-input .js-input-text-input'
		);
		this.depositTokensMaxButton = this.element.querySelector(
			'.js-deposit-tokens-input .js-input-text-max-button'
		);
		this.maskInstance = null;

		this.needToConnectContainer = this.element.querySelector(
			'#need-to-connect'
		);
		this.forecastsContainer = this.element.querySelector('#forecasts');
		this.needToApproveContainer = this.element.querySelector(
			'#need-to-approve'
		);
		this.currentStateContainer = this.element.querySelector('#current-state');

		this.harvestButton = null;
		this.harvestAndUnstakeButton = null;
		this.stakeButton = null;

		this.values = {
			[CODES.TOKEN_BALANCE]: 0,
			[CODES.STAKED_BALANCE]: 0,
			[CODES.EARNED]: 0
		};

		this.interval = null;

		this.connect = this.connect.bind(this);

		this.init();
	}

	init() {
		if (WalletService.isConnected) {
			this.connect();
		} else {
			this.initNeedToConnect();
			window.addEventListener('web3:connected', this.connect);
		}
	}

	destroy() {
		clearInterval(this.interval);
		window.removeEventListener('web3:connected', this.connect, false);
	}

	get isPageDestroyed() {
		return !document.body.contains(this.element);
	}

	initNeedToConnect() {
		this.needToConnectContainer.innerHTML = notificationTemplate({
			...data.option.needToConnect,
			buttonClass: 'js-connect-wallet',
			title: `${data.option.needToConnect.title} ${this.name}`
		});

		this.openConnectWalletModalButton = this.element.querySelector(
			'.js-connect-wallet'
		);

		this.openConnectWalletModalButton.addEventListener('click', () => {
			this.modalInstance.show(this.connectWalletModalId);
		});
	}

	destroyNeedToConnect() {
		this.needToConnectContainer.innerHTML = '';
	}

	initForecasts() {
		this.forecastsContainer.innerHTML = emojiItemsTemplate({
			...data.option.forecasts,
			title: `${this.name} ${data.option.forecasts.title}`
		});
	}

	initNeedToApprove() {
		this.needToApproveContainer.innerHTML = notificationTemplate({
			...data.option.needToApprove,
			buttonClass: 'js-approve',
			title: `${data.option.needToApprove.title} ${this.name}`
		});

		const approveButton = this.element.querySelector('.js-approve');

		approveButton.addEventListener('click', () => {
			WalletService.performApprove(this.id).then(response => {
				if (response) {
					if (this.isPageDestroyed) return;
					this.destroyNeedToApprove();
					this.initCurrentState();
					this.start();
				}
			});
		});
	}

	destroyNeedToApprove() {
		this.needToApproveContainer.innerHTML = '';
	}

	initDepositInput() {
		this.maskInstance = new IMask(this.depositTokensInput, MASK_OPTIONS);

		this.depositTokensInput.addEventListener('input', () => {
			this.checkInputValue();
		});

		this.depositTokensInput.addEventListener('blur', () => {
			if (!this.maskInstance.unmaskedValue) {
				this.maskInstance.unmaskedValue = START_INPUT_VALUE;
				this.checkInputValue();
			}
		});

		this.depositTokensMaxButton.addEventListener('click', () => {
			this.maskInstance.unmaskedValue = `${bnToDec(
				this.values[CODES.TOKEN_BALANCE]
			)}`;
			this.checkInputValue();
		});
	}

	initCurrentState() {
		this.currentStateContainer.innerHTML = `
			${stateTemplate({
				...data.option.staking,
				title: `${data.option.staking.title} ${this.name}`,
				numberCode: 'stakedBalance',
				description: `${data.option.staking.description[0]} <span class="js-number" data-code="stakedBalance" data-decimal-places="4">0.0000</span> ${this.name} ${data.option.staking.description[1]}`,
				buttons: [
					{
						text: data.option.staking.buttons[0],
						className: 'js-harvest-and-unstake'
					},
					{
						text: data.option.staking.buttons[1],
						href: this.officialPoolLink,
						target: '_blank',
						rel: 'noreferrer noopener'
					}
					// {
					// 	text: data.option.staking.buttons[2],
					// 	className: 'js-open-modal-deposit-tokens-button',
					// 	mod: 'dark'
					// }
				]
			})}
			${stateTemplate({
				...data.option.earned,
				blue: true,
				numberCode: 'earned',
				description: `${data.option.earned.description[0]} <span class="js-number" data-code="earned" data-decimal-places="4">0.0000</span> ${data.option.earned.description[1]}`,
				buttons: [
					{
						text: `${data.option.earned.buttons[0][0]} <span class="js-number" data-code="earned" data-decimal-places="4">0.0000</span> ${data.option.earned.buttons[0][1]}`,
						className: 'js-harvest'
					}
				]
			})}
		`;

		new ModalDepositTokens(
			this.element.querySelector('.js-modal-deposit-tokens')
		);

		// this.openDepositTokensModalButton = this.element.querySelector(
		// 	'.js-open-modal-deposit-tokens-button'
		// );

		// this.openDepositTokensModalButton.addEventListener('click', () => {
		// 	this.maskInstance.unmaskedValue = START_INPUT_VALUE;
		// 	this.checkInputValue();
		// 	this.modalInstance.show(this.depositTokensModalId);
		// });

		this.initButtons();
		this.checkButtons();
		this.initDepositInput();
	}

	start() {
		this.getAllValues();

		this.interval = setInterval(() => {
			this.getAllValues();
		}, UPDATE_VALUES_INTERVAL);
	}

	connect() {
		this.destroyNeedToConnect();
		// this.initForecasts();

		WalletService.getAllowance(this.id)
			.then(response => {
				if (this.isPageDestroyed) return;

				if (response) {
					this.initCurrentState();
					this.start();
				} else {
					this.initNeedToApprove();
				}
			})
			.catch(() => {
				this.initNeedToApprove();
			});
	}

	getAllValues() {
		WalletService.getStakedBalance(this.id).then(response => {
			if (this.isPageDestroyed) return;
			NumbersService.updateSomeNumber(
				CODES.STAKED_BALANCE,
				bnToDec(response),
				bnToDec(this.values[CODES.STAKED_BALANCE])
			);
			this.values[CODES.STAKED_BALANCE] = response;
			this.checkButtons();
			this.checkInputValue();
		});
		WalletService.getTokenBalance(this.id).then(response => {
			if (this.isPageDestroyed) return;
			NumbersService.updateSomeNumber(
				CODES.TOKEN_BALANCE,
				bnToDec(response),
				bnToDec(this.values[CODES.TOKEN_BALANCE])
			);
			this.values[CODES.TOKEN_BALANCE] = response;
			this.checkButtons();
			this.checkInputValue();
		});
		WalletService.getEarnings(this.id).then(response => {
			if (this.isPageDestroyed) return;
			NumbersService.updateSomeNumber(
				CODES.EARNED,
				bnToDec(response),
				bnToDec(this.values[CODES.EARNED])
			);
			this.values[CODES.EARNED] = response;
			this.checkButtons();
			this.checkInputValue();
		});
	}

	initButtons() {
		this.stakeButton = this.element.querySelector('.js-stake');
		this.harvestButton = this.element.querySelector('.js-harvest');
		this.harvestAndUnstakeButton = this.element.querySelector(
			'.js-harvest-and-unstake'
		);

		this.stakeButton.addEventListener('click', () => {
			this.stake();
		});

		this.harvestButton.addEventListener('click', () => {
			this.harvest();
		});

		this.harvestAndUnstakeButton.addEventListener('click', () => {
			this.unstake();
		});
	}

	checkButtons() {
		this.harvestButton.disabled = this.values[CODES.EARNED] === 0;
		this.stakeButton.disabled = this.values[CODES.TOKEN_BALANCE] === 0;
		this.harvestAndUnstakeButton.disabled =
			this.values[CODES.STAKED_BALANCE] === 0 &&
			this.values[CODES.EARNED] === 0;
	}

	checkInputValue() {
		this.stakeButton.disabled =
			!+this.maskInstance.unmaskedValue ||
			+decToBn(+this.maskInstance.unmaskedValue) >
				this.values[CODES.TOKEN_BALANCE];
	}

	stake() {
		if (
			this.values[CODES.TOKEN_BALANCE] > 0 &&
			+this.maskInstance.unmaskedValue
		) {
			const amount = +decToBn(+this.maskInstance.unmaskedValue);
			WalletService.performStake(this.id, amount).then(response => {
				if (response) {
					if (this.isPageDestroyed) return;
					this.getAllValues();
					this.modalInstance.close(this.depositTokensModalId);
				}
			});
		}
	}

	unstake() {
		if (this.values[CODES.STAKED_BALANCE] === 0) return;

		WalletService.performUnstake(
			this.id,
			this.values[CODES.STAKED_BALANCE]
		).then(response => {
			if (response) {
				if (this.isPageDestroyed) return;
				this.getAllValues();
			}
		});
	}

	harvest() {
		if (this.values[CODES.EARNED] === 0) return;

		WalletService.getReward(this.id).then(response => {
			if (response) {
				if (this.isPageDestroyed) return;
				this.getAllValues();
			}
		});
	}
}
