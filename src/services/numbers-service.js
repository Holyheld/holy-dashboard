import { CountUp } from 'countup.js';

const options = {
	separator: ',',
	decimal: '.'
};

export const CODES = {
	HOLY_PRICE: 'holyPrice',
	TOTAL_VALUE_LOCKED: 'totalValueLocked',
	CIRCULATING_SUPPLY: 'circulatingSupply',
	HOLY_PER_BLOCK: 'holyPerBlock',
	REMAINING_SUPPLY: 'remainingSupply',

	TOKEN_BALANCE: 'tokenBalance',
	STAKED_BALANCE: 'stakedBalance',
	EARNED: 'earned',

	HOLY_BALANCE: 'holyBalance'
};

export default class NumbersService {
	static updateSomeNumber(code, number, prevNumber, duration) {
		const elements = document.querySelectorAll(
			`.js-number[data-code='${code}']`
		);
		elements.forEach(element => {
			const decimalPlaces = +element.dataset.decimalPlaces;
			const numberToDivide = decimalPlaces === 4 ? 10000 : 100;
			const previous = prevNumber
				? Math.floor(prevNumber * numberToDivide) / numberToDivide
				: 0;
			const next = Math.floor(number * numberToDivide) / numberToDivide;

			let durationTime = element.classList.contains('animated') ? 1 : 0;
			if (typeof duration === 'number') {
				durationTime = duration;
			}

			const action = new CountUp(element, next, {
				...options,
				decimalPlaces,
				startVal: previous,
				duration: durationTime
			});
			action.start();
		});
	}
}
