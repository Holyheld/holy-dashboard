import {
	// HolyRequestService,
	WalletRequestService
} from './requests';

import WalletService from './wallet-service';

import { CODES } from './numbers-service';

const holyData = {
	[CODES.CIRCULATING_SUPPLY]: 0,
	[CODES.HOLY_PRICE]: 0,
	[CODES.TOTAL_VALUE_LOCKED]: 0,
	[CODES.HOLY_PER_BLOCK]: 0,
	[CODES.REMAINING_SUPPLY]: 0
};
let walletInfoData = null;

export default class InfoService {
	static update() {
		// HolyRequestService.getMetrics().then(data => {
		// 	holyData = data;
		// 	window.dispatchEvent(new CustomEvent('metrics:updated'));
		// });

		if (WalletService.isConnected) {
			WalletRequestService.getWalletInfo(WalletService.currentAddress)
				.then(data => {
					walletInfoData = data;
				})
				.catch(() => {
					walletInfoData = null;
				})
				.finally(() => {
					window.dispatchEvent(new CustomEvent('wallet-info:updated'));
				});
		}
	}

	static getHolyData() {
		return { ...holyData };
	}

	static getWalletInfoData() {
		return walletInfoData ? { ...walletInfoData } : walletInfoData;
	}
}
