import Modal from '../modal/modal';

import WalletService from '../../services/wallet-service';

export default class ModalConnectWallet {
	constructor(element) {
		this.element = element;
		this.cancelModalButton = this.element.querySelector(
			'.js-modal-connect-wallet-cancel'
		);

		this.сonnectMetamaskButton = document.querySelector(
			'.js-modal-connect-wallet-metamask'
		);

		this.сonnectWalletConnectButton = document.querySelector(
			'.js-modal-connect-wallet-walletconnect'
		);

		this.closeNoMetabaskModalButton = document.querySelector(
			'.js-modal-no-metamask-download'
		);

		this.modalId = 'modal-connect-wallet';
		this.modalNoMetamaskId = 'modal-no-metamask';
		this.modalInstance = new Modal();

		this.setListeners();
	}

	setListeners() {
		window.addEventListener('web3:connected', () => {
			this.closeModal();
		});

		this.cancelModalButton.addEventListener('click', () => {
			this.closeModal();
		});

		this.сonnectMetamaskButton.addEventListener('click', () => {
			this.connectMetamask();
		});

		this.сonnectWalletConnectButton.addEventListener('click', () => {
			WalletService.сonnectWalletConnect();
		});

		this.closeNoMetabaskModalButton.addEventListener('click', () => {
			this.closeNoMetamaskModal();
		});
	}

	connectMetamask() {
		if (WalletService.noMetamaskExtension) {
			this.showNoMetamaskModal();
			return;
		}

		WalletService.connectMetamask();
	}

	closeModal() {
		this.modalInstance.close(this.modalId);
	}

	showNoMetamaskModal() {
		this.closeModal();
		setTimeout(() => {
			this.modalInstance.show(this.modalNoMetamaskId);
		}, 0);
	}

	closeNoMetamaskModal() {
		this.modalInstance.close(this.modalNoMetamaskId);
	}
}
