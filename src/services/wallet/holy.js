import Web3 from 'web3';

import { Contracts } from './lib/contracts';
import { contractAddresses } from './lib/constants';

export default class Holy {
	constructor(provider, networkId, options) {
		let realProvider;

		if (typeof provider === 'string') {
			if (provider.includes('wss')) {
				realProvider = new Web3.providers.WebsocketProvider(
					provider,
					options.ethereumNodeTimeout || 10000
				);
			} else {
				realProvider = new Web3.providers.HttpProvider(
					provider,
					options.ethereumNodeTimeout || 10000
				);
			}
		} else {
			realProvider = provider;
		}

		this.web3 = new Web3(realProvider);
		if (options.defaultAccount)
			this.web3.eth.defaultAccount = options.defaultAccount;
		this.contracts = new Contracts(realProvider, networkId, this.web3, options);

		this.holyAddress = contractAddresses.holy[networkId];
		this.holyKnightAddress = contractAddresses.holyKnight[networkId];
	}
}
