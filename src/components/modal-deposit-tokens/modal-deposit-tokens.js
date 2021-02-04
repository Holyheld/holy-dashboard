import Modal from '../modal/modal';

export const MASK_OPTIONS = {
	mask: Number,
	scale: 4,
	thousandsSeparator: ',',
	radix: '.',
	normalizeZeros: false,
	padFractionalZeros: true,
	mapToRadix: [',', '.']
};
export const START_INPUT_VALUE = '0';

export default class ModalDepositTokens {
	constructor(element) {
		this.element = element;
		this.cancelModalButton = this.element.querySelector(
			'.js-modal-deposit-tokens-cancel'
		);

		this.modalId = 'modal-deposit-tokens';
		this.modalInstance = new Modal();

		this.setListeners();
	}

	setListeners() {
		this.cancelModalButton.addEventListener('click', () => {
			this.closeModal();
		});
	}

	closeModal() {
		this.modalInstance.close(this.modalId);
	}
}
