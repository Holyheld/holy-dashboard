import Navigo from 'navigo';

import Home from '../components/home/home';
import Option from '../components/option/option';

import { homeTemplate } from '../components/home/home.template';
import { optionTemplate } from '../components/option/option.template';

import data from '../scripts/data';

export default class RouterService {
	constructor() {
		this.router = null;
		this.container = null;

		this.firstRenderHappened = false;

		this.pageInstance = null;

		this.init();
	}

	init() {
		this.router = new Navigo(`${window.location.origin}/`);
		this.container = document.querySelector('.js-page');

		this.initRouting();
	}

	initRouting() {
		this.router.hooks({
			before: done => {
				window.dispatchEvent(new CustomEvent('router:before-change'));
				done();
			},
			after: () => {
				if (!this.firstRenderHappened) this.firstRenderHappened = true;

				setTimeout(() => {
					this.initLinks();
				}, 0);
			}
		});

		this.router
			.on({
				'/': () => {
					this.initHome();
				},
				'/:id': params => {
					this.initOption(params.id);
				}
			})
			.resolve();
	}

	initLinks() {
		const items = this.container.querySelectorAll('.js-router-link');

		items.forEach(item => {
			item.addEventListener('click', event => {
				event.preventDefault();
				this.router.navigate(item.getAttribute('href'));
			});
		});
	}

	renderPage(html) {
		this.container.innerHTML = html;
	}

	static updateMeta(title) {
		document.title = title;
	}

	initHome() {
		this.destroyCurrentInstance();

		if (this.firstRenderHappened) {
			const { intro, numbers, options, modalMigrateTokens } = data.home.body;

			RouterService.updateMeta(data.home.head.title);

			this.renderPage(
				homeTemplate({
					intro,
					numbers,
					options: {
						...options,
						items: [
							'ycrv',
							'holy_eth_uni_v2_lp',
							'uni_eth_uni_v2_lp',
							'yfi_eth_uni_v2_lp',
							'link_eth_uni_v2_lp',
							'snx_eth_uni_v2_lp',
							'ampl_eth_uni_v2_lp',
							'lend_eth_uni_v2_lp',
							'mkr_eth_uni_v2_lp',
							'comp_eth_uni_v2_lp'
						].map(item => ({
							pageName: item,
							...data[item]
						}))
					},
					modalMigrateTokens
				})
			);

			window.scroll(0, 0);
		}

		this.pageInstance = new Home(this.container.querySelector('.js-home'));
	}

	initOption(id) {
		if (this.firstRenderHappened) {
			const optionData = data[id];
			if (!optionData) return;

			this.destroyCurrentInstance();

			const {
				name,
				officialPoolLink,
				title,
				description,
				detailedDescription
			} = optionData.body;

			RouterService.updateMeta(optionData.head.title);

			this.renderPage(
				optionTemplate({
					name,
					id,
					officialPoolLink,
					title,
					description,
					detailedDescription,
					modalDepositTokens: data.option.modalDepositTokens
				})
			);

			window.scroll(0, 0);
		}

		this.pageInstance = new Option(this.container.querySelector('.js-option'));
	}

	destroyCurrentInstance() {
		if (this.pageInstance && this.pageInstance.destroy) {
			this.pageInstance.destroy();
			this.pageInstance = null;
		}
	}
}
