import Modal from '../modal/modal';

export default class ModalMigrateTokens {
	constructor(element) {
		this.element = element;
		this.cancelModalButton = this.element.querySelector(
			'.js-modal-migrate-tokens-cancel'
		);

		this.modalId = 'modal-migrate-tokens';
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
