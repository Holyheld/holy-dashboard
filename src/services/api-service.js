import axios from 'axios';

import httpService from './http-service';

export default class ApiService {
	static request({ url, method, data = {}, cancelToken }) {
		return new Promise((resolve, reject) => {
			httpService({
				url,
				method,
				data,
				cancelToken
			})
				.then(response => {
					const responseData = response.data;
					return resolve(responseData);
				})
				.catch(error => {
					if (!axios.isCancel(error)) {
						return reject(error);
					}
					return null;
				});
		});
	}
}
