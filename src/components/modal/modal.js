import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import MicroModal from 'micromodal';

const FOCUSABLE_ELEMENTS = [
	'input[type=text]',
	'a[href]',
	'button:not([disabled]):not([aria-hidden])'
];

export default class Modal {
	constructor() {
		if (Modal.instance) return Modal.instance;
		Modal.instance = this;

		this.micromodal = MicroModal;

		this.options = {
			onShow: modal => {
				Modal.onShow(modal);
				this.counter++;
				setTimeout(() => {
					Modal.focusFirstElement(modal);
				}, 200);
			},
			onClose: modal => {
				Modal.onClose(modal);
				this.counter--;
			},
			openTrigger: 'data-micromodal-open',
			closeTrigger: 'data-micromodal-close',
			openClass: 'is-open',
			disableScroll: false,
			disableFocus: true,
			awaitOpenAnimation: false,
			awaitCloseAnimation: false,
			debugMode: false
		};

		this.counter = 0;

		this.setListeners();

		return this;
	}

	setListeners() {
		window.addEventListener('router:before-change', () => {
			if (this.counter) {
				this.micromodal.close();
				this.counter = 0;
			}
		});
	}

	show(id) {
		this.micromodal.show(id, this.options);
	}

	close(id) {
		this.micromodal.close(id);
	}

	static focusFirstElement(modal) {
		const element = modal.querySelector(FOCUSABLE_ELEMENTS.join(','));
		if (element) element.focus();
	}

	static onShow(modal) {
		disableBodyScroll(Modal.getScrollNode(modal.id));
	}

	static onClose(modal) {
		enableBodyScroll(Modal.getScrollNode(modal.id));
	}

	static getScrollNode(id) {
		const modal = document.querySelector(`#${id}`);
		return modal.querySelector('.js-modal-dialog');
	}
}
