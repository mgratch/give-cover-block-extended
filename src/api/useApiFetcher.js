import useSWR from 'swr';
import { apiFetchJson } from './apiUtils';

export const useApiFetcher = (endpoint, params = {}) => {
	const queryString = new URLSearchParams(params).toString();
	const fullUrl = `${endpoint}?${queryString}`;

	const { data, error, isValidating, mutate } = useSWR(fullUrl, () => apiFetchJson(endpoint, params), {
		revalidateOnFocus: false,
	});

	return {
		data: data ? data.data : null,
		pages: data ? data.pages : 0,
		isLoading: !error && !data && isValidating,
		isError: error,
		mutate,
	};
};
