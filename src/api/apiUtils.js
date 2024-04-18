export const apiFetchJson = async (path, params = {}) => {
	const queryString = new URLSearchParams(params).toString();
	const url = `${path}?${queryString}`;

	try {
		return await wp.apiFetch({ path: url });
	} catch (error) {
		console.error('API Fetch Error:', error);
		throw error;
	}
};
