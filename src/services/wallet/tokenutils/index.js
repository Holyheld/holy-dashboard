import BigNumber from 'bignumber.js';

export { default as formatAddress } from './formatAddress';

export const bnToDec = (number, decimals = 18) => {
	return new BigNumber(number)
		.dividedBy(new BigNumber(10).pow(decimals))
		.toNumber();
};

export const decToBn = (dec, decimals = 18) => {
	return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals));
};
