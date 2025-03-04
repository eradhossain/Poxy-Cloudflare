export const thumbnailHandler = async (url, headers, origin) => {
	const resp = await fetch(url, {
		...headers,
		redirect: 'follow',
		'User-Agent':
			'Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
	});

	if (resp.status !== 200) {
		return new Response(resp.status, resp);
	}
	const timestampRegex = /(?<=\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\s)(.*)/gm;
	const responseBody = await resp.text();
	const baseUrl = url.substring(0, url.lastIndexOf('/'));
	const modifiedBody = responseBody.replace(timestampRegex, (match) => {
		const fullUrl = match.startsWith('http') ? match : match.startsWith('/') ? `${baseUrl}/${match}` : `${baseUrl}/${match}`;
		return `${origin}/cors?url=${encodeURIComponent(btoa(fullUrl))}`;
	});
	return new Response(modifiedBody, {
		headers: {
			...resp.headers,
			'Access-Control-Allow-Origin': '*',
		},
	});
};
