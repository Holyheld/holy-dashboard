import 'babel-polyfill';
import 'focus-visible';
import BigNumber from 'bignumber.js/bignumber';

import '../styles/index.scss';

import './utils/icons';
import './utils/polyfills';

import '../components/index';

import RouterService from '../services/router-service';
import InfoService from '../services/info-service';

document.addEventListener('DOMContentLoaded', () => {
	BigNumber.config({
		EXPONENTIAL_AT: 1000,
		DECIMAL_PLACES: 80
	});

	new RouterService();

	InfoService.update();

	window.addEventListener('web3:connected', () => {
		InfoService.update();
	});

	setInterval(() => {
		InfoService.update();
	}, 300000);
});
