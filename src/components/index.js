import Vh from './vh/vh';
import ModalConnectWallet from './modal-connect-wallet/modal-connect-wallet';

import Header from './header/header';

document.addEventListener('DOMContentLoaded', () => {
	Vh.init();

	const modalConnectWallet = document.querySelector('.js-modal-connect-wallet');
	if (modalConnectWallet) new ModalConnectWallet(modalConnectWallet);

	const header = document.querySelector('.js-header');
	if (header) new Header(header);
});
