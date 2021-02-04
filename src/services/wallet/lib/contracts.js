/* eslint-disable no-console */
import BigNumber from 'bignumber.js/bignumber';

import ERC20Abi from './abi/erc20.json';
import HolyKnightAbi from './abi/holyknight.json';
import HolyAbi from './abi/holy.json';
import UNIV2PairAbi from './abi/uni_v2_lp.json';
import WETHAbi from './abi/weth.json';
import HolyPassageAbi from './abi/holypassage.json';
import HolyVisorAbi from './abi/holyvisor.json';

import {
	contractAddresses,
	SUBTRACT_GAS_LIMIT,
	supportedPools
} from './constants';

export const ConfirmationType = {
	Hash: 0,
	Confirmed: 1,
	Both: 2,
	Simulate: 3
};

export class Contracts {
	constructor(provider, networkId, web3, options) {
		this.web3 = web3;
		this.defaultConfirmations = options.defaultConfirmations;
		this.autoGasMultiplier = options.autoGasMultiplier || 1.5;
		this.confirmationType =
			options.confirmationType || ConfirmationType.Confirmed;
		this.defaultGas = options.defaultGas;
		this.defaultGasPrice = options.defaultGasPrice;

		this.holy = new this.web3.eth.Contract(HolyAbi);
		this.holyKnight = new this.web3.eth.Contract(HolyKnightAbi);
		this.weth = new this.web3.eth.Contract(WETHAbi);
		this.holyV2 = new this.web3.eth.Contract(ERC20Abi);
		this.holyPassage = new this.web3.eth.Contract(HolyPassageAbi);
		this.holyVisor = new this.web3.eth.Contract(HolyVisorAbi);

		this.pools = supportedPools.map(pool =>
			Object.assign(pool, {
				lpAddress: pool.lpAddresses[networkId],
				tokenAddress: pool.tokenAddresses[networkId],
				lpContract: new this.web3.eth.Contract(UNIV2PairAbi),
				tokenContract: new this.web3.eth.Contract(ERC20Abi)
			})
		);

		this.setProvider(provider, networkId);
		this.setDefaultAccount(this.web3.eth.defaultAccount);
	}

	setProvider(provider, networkId) {
		const setProvider = (contract, address) => {
			contract.setProvider(provider);
			if (address) {
				contract.options.address = address;
			} else {
				console.error('Contract address not found in network', networkId);
			}
		};

		setProvider(this.holy, contractAddresses.holy[networkId]);
		setProvider(this.holyKnight, contractAddresses.holyKnight[networkId]);
		setProvider(this.holyPassage, contractAddresses.holyPassage[networkId]);
		setProvider(this.holyVisor, contractAddresses.holyVisor[networkId]);
		// setProvider(this.weth, contractAddresses.weth[networkId])

		this.pools.forEach(
			({ lpContract, lpAddress, tokenContract, tokenAddress }) => {
				setProvider(lpContract, lpAddress);
				setProvider(tokenContract, tokenAddress);
			}
		);
	}

	setDefaultAccount(account) {
		this.holy.options.from = account;
		this.holyKnight.options.from = account;
	}

	async callContractFunction(method, options) {
		const {
			confirmations,
			confirmationType,
			autoGasMultiplier,
			...txOptions
		} = options;

		if (!this.blockGasLimit) {
			await this.setGasLimit();
		}

		if (!txOptions.gasPrice && this.defaultGasPrice) {
			txOptions.gasPrice = this.defaultGasPrice;
		}

		if (confirmationType === ConfirmationType.Simulate || !options.gas) {
			let gasEstimate;
			if (this.defaultGas && confirmationType !== ConfirmationType.Simulate) {
				txOptions.gas = this.defaultGas;
			} else {
				try {
					console.log('estimating gas');
					gasEstimate = await method.estimateGas(txOptions);
				} catch (error) {
					const data = method.encodeABI();
					const { from, value } = options;
					// eslint-disable-next-line no-underscore-dangle
					const to = method._parent._address;
					error.transactionData = { from, value, data, to };
					throw error;
				}

				const multiplier = autoGasMultiplier || this.autoGasMultiplier;
				const totalGas = Math.floor(gasEstimate * multiplier);
				txOptions.gas =
					totalGas < this.blockGasLimit ? totalGas : this.blockGasLimit;
			}

			if (confirmationType === ConfirmationType.Simulate) {
				const g = txOptions.gas;
				return { gasEstimate, g };
			}
		}

		if (txOptions.value) {
			txOptions.value = new BigNumber(txOptions.value).toFixed(0);
		} else {
			txOptions.value = '0';
		}

		const promi = method.send(txOptions);

		const OUTCOMES = {
			INITIAL: 0,
			RESOLVED: 1,
			REJECTED: 2
		};

		let hashOutcome = OUTCOMES.INITIAL;
		let confirmationOutcome = OUTCOMES.INITIAL;

		const t =
			confirmationType !== undefined ? confirmationType : this.confirmationType;

		if (!Object.values(ConfirmationType).includes(t)) {
			throw new Error(`Invalid confirmation type: ${t}`);
		}

		let hashPromise;
		let confirmationPromise;

		if (t === ConfirmationType.Hash || t === ConfirmationType.Both) {
			hashPromise = new Promise((resolve, reject) => {
				promi.on('error', error => {
					if (hashOutcome === OUTCOMES.INITIAL) {
						hashOutcome = OUTCOMES.REJECTED;
						reject(error);
						const anyPromi = promi;
						anyPromi.off();
					}
				});

				promi.on('transactionHash', txHash => {
					if (hashOutcome === OUTCOMES.INITIAL) {
						hashOutcome = OUTCOMES.RESOLVED;
						resolve(txHash);
						if (t !== ConfirmationType.Both) {
							const anyPromi = promi;
							anyPromi.off();
						}
					}
				});
			});
		}

		if (t === ConfirmationType.Confirmed || t === ConfirmationType.Both) {
			confirmationPromise = new Promise((resolve, reject) => {
				promi.on('error', error => {
					if (
						(t === ConfirmationType.Confirmed ||
							hashOutcome === OUTCOMES.RESOLVED) &&
						confirmationOutcome === OUTCOMES.INITIAL
					) {
						confirmationOutcome = OUTCOMES.REJECTED;
						reject(error);
						const anyPromi = promi;
						anyPromi.off();
					}
				});

				const desiredConf = confirmations || this.defaultConfirmations;
				if (desiredConf) {
					promi.on('confirmation', (confNumber, receipt) => {
						if (confNumber >= desiredConf) {
							if (confirmationOutcome === OUTCOMES.INITIAL) {
								confirmationOutcome = OUTCOMES.RESOLVED;
								resolve(receipt);
								const anyPromi = promi;
								anyPromi.off();
							}
						}
					});
				} else {
					promi.on('receipt', receipt => {
						confirmationOutcome = OUTCOMES.RESOLVED;
						resolve(receipt);
						const anyPromi = promi;
						anyPromi.off();
					});
				}
			});
		}

		if (t === ConfirmationType.Hash) {
			const transactionHash = await hashPromise;
			if (this.notifier) {
				this.notifier.hash(transactionHash);
			}
			return { transactionHash };
		}

		if (t === ConfirmationType.Confirmed) {
			return confirmationPromise;
		}

		const transactionHash = await hashPromise;
		if (this.notifier) {
			this.notifier.hash(transactionHash);
		}
		return {
			transactionHash,
			confirmation: confirmationPromise
		};
	}

	// eslint-disable-next-line class-methods-use-this
	async callConstantContractFunction(method, options) {
		const m2 = method;
		const { blockNumber, ...txOptions } = options;
		return m2.call(txOptions, blockNumber);
	}

	async setGasLimit() {
		const block = await this.web3.eth.getBlock('latest');
		this.blockGasLimit = block.gasLimit - SUBTRACT_GAS_LIMIT;
	}
}
