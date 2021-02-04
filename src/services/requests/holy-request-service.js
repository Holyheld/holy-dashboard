import axios from 'axios';
import ApiService from '../api-service';

const calls = {
	getMetrics: null
};

export default class HolyRequestService {
	static getMetrics() {
		if (calls.getMetrics) calls.getMetrics.cancel();
		calls.getMetrics = axios.CancelToken.source();

		return ApiService.request({
			url: process.env.API_GET_HOLY_METRICS_URL,
			method: process.env.API_GET_HOLY_METRICS_METHOD,
			cancelToken: calls.getMetrics.token
		});
	}
}
