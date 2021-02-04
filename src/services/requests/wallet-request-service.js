import axios from 'axios';
import ApiService from '../api-service';

const calls = {
	getWalletInfo: null
};

export default class WalletRequestService {
	static getWalletInfo(walletAddress) {
		if (calls.getWalletInfo) calls.getWalletInfo.cancel();
		calls.getWalletInfo = axios.CancelToken.source();

		return ApiService.request({
			url: `${
				process.env.API_GET_WALLET_INFO_URL
			}/${walletAddress.toLowerCase()}`,
			method: process.env.API_GET_WALLET_INFO_METHOD,
			cancelToken: calls.getWalletInfo.token
		});
	}
}
