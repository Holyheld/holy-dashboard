import NumbersService, { CODES } from '../../services/numbers-service';
import InfoService from '../../services/info-service';
import WalletService, { IDS } from '../../services/wallet-service';

import ModalMigrateTokens from '../modal-migrate-tokens/modal-migrate-tokens';
import Modal from '../modal/modal';

import { migrationTemplate } from '../migration/migration.template';
import { walletInfoTemplate } from '../wallet-info/wallet-info.template';

import data from '../../scripts/data';

import { timestampToDate } from '../../scripts/utils/date';
import { bnToDec } from '../../services/wallet/tokenutils';

export default class Home {
	constructor(element) {
		this.element = element;

		this.updateMetrics = this.updateMetrics.bind(this);
		this.updateWalletInfo = this.updateWalletInfo.bind(this);

		this.metricsData = {};
		this.walletInfoData = {};

		this.options = Object.entries(IDS).map(item => ({
			name: item[0],
			id: item[1]
		}));

		this.migrationContainer = this.element.querySelector('#migration');
		this.walletInfoContainer = this.element.querySelector('#wallet-info');

		this.migration = null;

		this.openMigrateTokensModalButton = null;
		this.migrateTokensModalId = 'modal-migrate-tokens';
		this.modalInstance = new Modal();
		this.migrateButton = null;
		this.migrateApproveButton = null;
		this.maskInstance = null;
		this.isUpdateHolyBalanceLoading = false;

		this.values = {
			[CODES.HOLY_BALANCE]: 0
		};

		this.init();
	}

	init() {
		this.updateMetrics();
		window.addEventListener('metrics:updated', this.updateMetrics);

		if (WalletService.isConnected) this.updateWalletInfo();
		window.addEventListener('wallet-info:updated', this.updateWalletInfo);

		new ModalMigrateTokens(
			this.element.querySelector('.js-modal-migrate-tokens')
		);

		this.initMigrateButton();
		this.checkMigrateButton();
	}

	destroy() {
		window.removeEventListener('metrics:updated', this.updateMetrics, false);
		window.removeEventListener(
			'wallet-info:updated',
			this.updateWalletInfo,
			false
		);
	}

	get isPageDestroyed() {
		return !document.body.contains(this.element);
	}

	updateMetrics() {
		const metricsData = InfoService.getHolyData();
		Object.keys(metricsData).forEach(key => {
			NumbersService.updateSomeNumber(
				key,
				metricsData[key],
				this.metricsData[key]
			);
		});
		this.metricsData = InfoService.getHolyData();
	}

	updateWalletInfo() {
		const walletInfoData = InfoService.getWalletInfoData();

		if (walletInfoData === null) {
			this.walletInfoData = {
				totalEarnedHoly: (0).toFixed(4),
				pendingBonusHoly: (0).toFixed(4),
				needToMigrate: (0).toFixed(4),
				avgMultiplier: null,
				table: [],
				options: []
			};
			this.initMigration();
			this.initWalletInfo();

			return;
		}

		this.walletInfoData = {
			totalEarnedHoly: (
				Math.floor(bnToDec(walletInfoData.totalEarnedHoly || 0) * 10000) / 10000
			).toFixed(4),
			pendingBonusHoly: (
				Math.floor(bnToDec(walletInfoData.pendingBonusHoly || 0) * 10000) /
				10000
			).toFixed(4),
			avgMultiplier:
				typeof walletInfoData.AvgMultiplier === 'number'
					? Math.floor(walletInfoData.AvgMultiplier * 100) / 100
					: null,
			table: [],
			options: []
		};

		if (typeof walletInfoData.pendingBalances === 'object') {
			const options = this.options.filter(
				option =>
					walletInfoData.pendingBalances[option.id] &&
					typeof walletInfoData.pendingBalances[option.id] === 'object'
			);

			if (options.length) {
				this.walletInfoData.options = options.map(item => ({
					code: item.name,
					name: data[item.name].body.name,
					currentlyStaked: (
						Math.floor(
							bnToDec(
								walletInfoData.pendingBalances[item.id].currentlyStaked || 0
							) * 10000
						) / 10000
					).toFixed(4),
					pendingHoly: (
						Math.floor(
							bnToDec(
								walletInfoData.pendingBalances[item.id].unclaimedPendingHoly ||
									0
							) * 10000
						) / 10000
					).toFixed(4),
					multiplier:
						typeof walletInfoData.pendingBalances[item.id].avgMultiplier !==
							'number' ||
						(walletInfoData.pendingBalances[item.id].avgMultiplier === 1 &&
							walletInfoData.pendingBalances[item.id].unclaimedPendingHoly ===
								'0' &&
							walletInfoData.pendingBalances[item.id].pendingBonusHoly === '0')
							? null
							: Math.floor(
									walletInfoData.pendingBalances[item.id].avgMultiplier * 100
							  ) / 100
				}));
			}
		}

		if (typeof walletInfoData.stakingHistory === 'object') {
			const options = this.options.filter(
				option => walletInfoData.stakingHistory[option.id]
			);

			options.forEach(item => {
				const option = walletInfoData.stakingHistory[item.id];

				if (option.deposits && option.deposits.length) {
					option.deposits.forEach(deposit => {
						if (deposit.timestamp) {
							this.walletInfoData.table.push({
								name: data[item.name].body.name,
								id: deposit.txId,
								timestamp: deposit.timestamp,
								type: 'Deposit',
								amount: deposit.amount
									? (
											Math.floor(bnToDec(deposit.amount) * 10000) / 10000
									  ).toFixed(4)
									: null,
								rewards: deposit.earnedHoly
									? (
											Math.floor(bnToDec(deposit.earnedHoly) * 10000) / 10000
									  ).toFixed(4)
									: null,
								bonus:
									typeof deposit.multiplier === 'number'
										? Math.floor(deposit.multiplier * 100) / 100
										: null
							});
						}
					});
				}

				if (option.withdrawals && option.withdrawals.length) {
					option.withdrawals.forEach(withdrawal => {
						if (withdrawal.timestamp) {
							this.walletInfoData.table.push({
								name: data[item.name].body.name,
								id: withdrawal.txId,
								timestamp: withdrawal.timestamp,
								type: 'Withdrawal',
								amount:
									withdrawal.amount && withdrawal.amount !== '0'
										? (
												Math.floor(bnToDec(withdrawal.amount) * 10000) / 10000
										  ).toFixed(4)
										: null,
								rewards:
									withdrawal.earnedHoly && withdrawal.earnedHoly !== '0'
										? (
												Math.floor(bnToDec(withdrawal.earnedHoly) * 10000) /
												10000
										  ).toFixed(4)
										: null,
								bonus:
									withdrawal.earnedHoly &&
									withdrawal.earnedHoly !== '0' &&
									typeof withdrawal.multiplier === 'number'
										? Math.floor(withdrawal.multiplier * 100) / 100
										: null
							});
						}
					});
				}
			});

			this.walletInfoData.table.sort((a, b) => b.timestamp - a.timestamp);
			this.walletInfoData.table = this.walletInfoData.table.map(item => ({
				...item,
				type:
					item.type === 'Deposit' && item.amount === '0.0000'
						? 'Harvest'
						: item.type,
				date: timestampToDate(item.timestamp),
				transaction: item.id ? `https://etherscan.io/tx/0x${item.id}` : null
			}));
		}

		Promise.all(
			this.walletInfoData.options.map(item =>
				WalletService.getStakedBalance(item.code)
			)
		)
			.then(web3Data => {
				if (this.isPageDestroyed) return;

				web3Data.forEach((web3StakedBalanceItem, index) => {
					if (typeof web3StakedBalanceItem === 'number') {
						this.walletInfoData.options[index].currentlyStaked = (
							Math.floor(bnToDec(web3StakedBalanceItem) * 10000) / 10000
						).toFixed(4);
					}
				});
			})
			.finally(() => {
				if (this.isPageDestroyed) return;

				this.walletInfoData.options = this.walletInfoData.options.filter(
					option =>
						option.currentlyStaked !== '0.0000' ||
						option.pendingHoly !== '0.0000'
				);

				WalletService.getMigratedHoly()
					.then(response => {
						if (this.isPageDestroyed) return;
						if (response) {
							let needToMigrage =
								(walletInfoData.totalEarnedHoly || 0) - response;
							needToMigrage = needToMigrage > 0 ? needToMigrage : 0;
							this.walletInfoData.needToMigrate = (
								Math.floor(bnToDec(needToMigrage) * 10000) / 10000
							).toFixed(4);
						} else {
							this.walletInfoData.needToMigrate = this.walletInfoData.totalEarnedHoly;
						}
					})
					.catch(() => {
						if (this.isPageDestroyed) return;
						this.walletInfoData.needToMigrate = this.walletInfoData.totalEarnedHoly;
					})
					.finally(() => {
						if (this.isPageDestroyed) return;
						this.initMigration();
						this.initWalletInfo();
					});
			});
	}

	initMigration() {
		let isApproved = false;

		WalletService.getMigrateAllowance()
			.then(response => {
				isApproved = response;
			})
			.finally(() => {
				if (this.isPageDestroyed) return;

				this.migrationContainer.innerHTML = migrationTemplate({
					...data.home.body.migration,
					needToMigrate: this.walletInfoData.needToMigrate,
					pendingBonusHoly: this.walletInfoData.pendingBonusHoly,
					isApproved
				});

				this.migration = this.element.querySelector('.js-migration');

				this.migrateApproveButton = this.element.querySelector(
					'.js-migrate-approve-button'
				);
				this.openMigrateTokensModalButton = this.element.querySelector(
					'.js-open-modal-migrate-tokens-button'
				);

				this.migrateApproveButton.addEventListener('click', () => {
					this.approveMigrate();
				});

				this.openMigrateTokensModalButton.addEventListener('click', () => {
					if (this.isUpdateHolyBalanceLoading) return;
					this.isUpdateHolyBalanceLoading = true;

					this.updateHolyBalance()
						.then(() => {
							if (this.isPageDestroyed) return;

							this.modalInstance.show(this.migrateTokensModalId);
						})
						.finally(() => {
							if (this.isPageDestroyed) return;

							this.isUpdateHolyBalanceLoading = false;
						});
				});
			});
	}

	initWalletInfo() {
		this.walletInfoContainer.innerHTML = walletInfoTemplate({
			...data.home.body.walletInfo,
			...this.walletInfoData
		});
	}

	initMigrateButton() {
		this.migrateButton = this.element.querySelector('.js-migrate');

		this.migrateButton.addEventListener('click', () => {
			this.migrate();
		});
	}

	checkMigrateButton() {
		this.migrateButton.disabled = this.values[CODES.HOLY_BALANCE] === 0;
	}

	updateHolyBalance() {
		return new Promise((resolve, reject) => {
			WalletService.getHolyBalance()
				.then(response => {
					if (this.isPageDestroyed) {
						reject();
						return;
					}

					this.values[CODES.HOLY_BALANCE] = response;
					NumbersService.updateSomeNumber(
						CODES.HOLY_BALANCE,
						bnToDec(response),
						null,
						0
					);
					this.checkMigrateButton();
					resolve();
				})
				.catch(() => {
					reject();
				});
		});
	}

	approveMigrate() {
		WalletService.performMigrateApprove().then(response => {
			if (this.isPageDestroyed) return;

			if (response) {
				this.migration.classList.add('is-approved');
			}
		});
	}

	migrate() {
		WalletService.performMigrate().then(response => {
			if (this.isPageDestroyed) return;

			if (response) {
				NumbersService.updateSomeNumber(
					CODES.HOLY_BALANCE,
					bnToDec(0),
					bnToDec(this.values[CODES.HOLY_BALANCE])
				);
				this.values[CODES.HOLY_BALANCE] = 0;
				this.modalInstance.close(this.migrateTokensModalId);
				this.updateWalletInfo();
			}
		});
	}
}
