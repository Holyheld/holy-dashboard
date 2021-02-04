import WalletConnectProvider from '@walletconnect/web3-provider';
import BigNumber from 'bignumber.js';

import {
	getContract,
	getBalance,
	getAllowance as getTokenAllowance
} from './wallet/tokenutils/erc20';

import {
	getHolyKnightContract,
	getHolyPassageContract,
	getHolyContract,
	approve,
	getStaked,
	getEarned,
	stake,
	unstake,
	harvest,
	approveMigrate,
	migrate,
	getMigratedTokens
} from './wallet/lib/interaction';

import Holy from './wallet/holy';

const INFURA_ID = 'd7de8e7d8f364da0b0f4b4be9a1636fd';

const HOLY_OPTIONS = {
	defaultConfirmations: 1,
	autoGasMultiplier: 1.5,
	testing: false,
	defaultGas: '6000000',
	defaultGasPrice: '1000000000000',
	accounts: [],
	ethereumNodeTimeout: 10000
};

const ADDRESSES = {
	ycrv: '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8',
	holy_eth_uni_v2_lp: '0xb6c8e5f00117136571d260bfb1baff62ddfd9960',
	uni_eth_uni_v2_lp: '0xd3d2e2692501a5c9ca623199d38826e513033a17',
	yfi_eth_uni_v2_lp: '0x2fdbadf3c4d5a8666bc06645b8358ab803996e28',
	link_eth_uni_v2_lp: '0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974',
	lend_eth_uni_v2_lp: '0xab3f9bf1d81ddb224a2014e98b238638824bcf20',
	ampl_eth_uni_v2_lp: '0xc5be99a02c6857f9eac67bbce58df5572498f40c',
	snx_eth_uni_v2_lp: '0x43ae24960e5534731fc831386c07755a2dc33d47',
	comp_eth_uni_v2_lp: '0xcffdded873554f362ac02f8fb1f02e5ada10516f',
	mkr_eth_uni_v2_lp: '0xc2adda861f89bbb333c90c492cb837741916a225'
};

export const IDS = {
	ycrv: 0,
	uni_eth_uni_v2_lp: 1,
	yfi_eth_uni_v2_lp: 2,
	link_eth_uni_v2_lp: 3,
	lend_eth_uni_v2_lp: 4,
	ampl_eth_uni_v2_lp: 5,
	snx_eth_uni_v2_lp: 6,
	comp_eth_uni_v2_lp: 7,
	mkr_eth_uni_v2_lp: 8,
	holy_eth_uni_v2_lp: 9
};

let holyInstance = null;

export default class WalletService {
	static get noMetamaskExtension() {
		return !window.ethereum;
	}

	static get isConnected() {
		return !!holyInstance;
	}

	static get currentAddress() {
		if (!this.isConnected) return null;
		const { currentProvider } = holyInstance.web3;
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);
		return account;
	}

	static connectMetamask() {
		if (!window.ethereum) return;

		window.ethereum.enable().then(() => {
			holyInstance = WalletService.createHolyInstance(window.ethereum);
			window.dispatchEvent(new CustomEvent('web3:connected'));
		});
	}

	static сonnectWalletConnect() {
		const provider = new WalletConnectProvider({
			infuraId: INFURA_ID
		});

		provider.enable().then(() => {
			holyInstance = WalletService.createHolyInstance(provider);
			window.dispatchEvent(new CustomEvent('web3:connected'));
		});
	}

	static createHolyInstance(provider) {
		return new Holy(provider, 1, {
			...HOLY_OPTIONS,
			defaultAccount: provider.selectedAddress
		});
	}

	static async performApprove(nameOfPage) {
		const { currentProvider } = holyInstance.web3;
		const address = ADDRESSES[nameOfPage];
		const lpContract = getContract(currentProvider, address);
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);
		const holyKnightContract = getHolyKnightContract(holyInstance);

		try {
			const tx = await approve(lpContract, holyKnightContract, account);
			return tx;
		} catch (e) {
			return false;
		}
	}

	static async getAllowance(nameOfPage) {
		const { currentProvider } = holyInstance.web3;
		const address = ADDRESSES[nameOfPage];
		const lpContract = getContract(currentProvider, address);
		const holyKnightContract = getHolyKnightContract(holyInstance);
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);

		try {
			const allowance = await getTokenAllowance(
				lpContract,
				holyKnightContract,
				account
			);
			return allowance !== '0';
		} catch (e) {
			return false;
		}
	}

	static async getStakedBalance(nameOfPage) {
		const { currentProvider } = holyInstance.web3;
		const holyKnightContract = getHolyKnightContract(holyInstance);
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);
		const pid = IDS[nameOfPage];

		let balance = new BigNumber(0);
		if (holyKnightContract && account) {
			balance = await getStaked(holyKnightContract, pid, account);
		}
		return +balance;
	}

	static async getTokenBalance(nameOfPage) {
		const { currentProvider } = holyInstance.web3;
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);
		const address = ADDRESSES[nameOfPage];

		let balance = new BigNumber(0);
		if (currentProvider && account) {
			balance = await getBalance(currentProvider, address, account);
		}
		return +balance;
	}

	static async getEarnings(nameOfPage) {
		const { currentProvider } = holyInstance.web3;
		const holyKnightContract = getHolyKnightContract(holyInstance);
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);
		const pid = IDS[nameOfPage];

		let balance = new BigNumber(0);
		if (holyKnightContract && account) {
			balance = await getEarned(holyKnightContract, pid, account);
		}
		return +balance;
	}

	static async performStake(nameOfPage, amount) {
		const { currentProvider } = holyInstance.web3;
		const holyKnightContract = getHolyKnightContract(holyInstance);
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);
		const pid = IDS[nameOfPage];

		try {
			const tx = await stake(holyKnightContract, pid, amount, account);
			return tx;
		} catch (e) {
			return false;
		}
	}

	static async performUnstake(nameOfPage, amount) {
		const { currentProvider } = holyInstance.web3;
		const holyKnightContract = getHolyKnightContract(holyInstance);
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);
		const pid = IDS[nameOfPage];

		try {
			const tx = await unstake(holyKnightContract, pid, amount, account);
			return tx;
		} catch (e) {
			return false;
		}
	}

	static async getReward(nameOfPage) {
		const { currentProvider } = holyInstance.web3;
		const holyKnightContract = getHolyKnightContract(holyInstance);
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);
		const pid = IDS[nameOfPage];

		try {
			const tx = await harvest(holyKnightContract, pid, account);
			return tx;
		} catch (e) {
			return false;
		}
	}

	static async getHolyBalance() {
		const { currentProvider } = holyInstance.web3;
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);
		const address = holyInstance.holyAddress;

		let balance = new BigNumber(0);
		if (currentProvider && account) {
			balance = await getBalance(currentProvider, address, account);
		}
		return +balance;
	}

	static async getMigratedHoly() {
		const { currentProvider } = holyInstance.web3;
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);
		const holyPassageContract = getHolyPassageContract(holyInstance);

		let qt = new BigNumber(0);
		if (currentProvider && account) {
			qt = await getMigratedTokens(holyPassageContract, account);
		}
		return +qt;
	}

	static async performMigrateApprove() {
		const { currentProvider } = holyInstance.web3;
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);
		const holyPassageContract = getHolyPassageContract(holyInstance);
		const holyContract = getHolyContract(holyInstance);

		try {
			const tx = await approveMigrate(
				holyContract,
				holyPassageContract,
				account
			);
			return tx;
		} catch (e) {
			return false;
		}
	}

	static async getMigrateAllowance() {
		const { currentProvider } = holyInstance.web3;
		const holyContract = getHolyContract(holyInstance);
		const holyPassageContract = getHolyPassageContract(holyInstance);
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);

		try {
			const allowance = await getTokenAllowance(
				holyContract,
				holyPassageContract,
				account
			);
			return allowance !== '0';
		} catch (e) {
			return false;
		}
	}

	static async performMigrate() {
		const { currentProvider } = holyInstance.web3;
		const holyPassageContract = getHolyPassageContract(holyInstance);
		const account =
			currentProvider.selectedAddress ||
			(currentProvider.accounts.length ? currentProvider.accounts[0] : null);

		try {
			const tx = await migrate(holyPassageContract, account);
			return tx;
		} catch (e) {
			return false;
		}
	}
}
