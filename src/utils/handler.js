export const decodeHeaders = (base64Headers) => {
	const headers = {}; // Use a plain object instead of `Headers`
	if (!base64Headers) {
		return headers;
	}

	try {
		const decodedString = atob(base64Headers);

		let headersObj;
		try {
			headersObj = JSON.parse(decodedString);
		} catch (error) {
			console.error('Error parsing JSON:', error, 'Decoded string:', decodedString);
			return headers;
		}

		Object.entries(headersObj).forEach(([key, value]) => {
			headers[key] = value;
		});
		headers['User-Agent'] =
			'Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
		return headers;
	} catch (error) {
		console.error('Error decoding base64:', error);
		return headers;
	}
};

export const handleRequest = (request) => {
	const url = new URL(request.url);
	const urlParams = url.searchParams;
	const encodedUrl = urlParams.get('url');
	const headersBase64 = urlParams.get('headers');
	if (!encodedUrl) {
		return new Response('Url is required!', {
			status: 400,
		});
	}
	let targetUrl;
	try {
		targetUrl = atob(encodedUrl);
	} catch (error) {
		targetUrl = encodedUrl;
	}

	const headers = decodeHeaders(headersBase64);

	return [targetUrl, headers, url.origin];
};
