import { registerStore } from '@wordpress/data';

const DEFAULT_STATE = {
	campaigns: {},
	isLoading: {},
	errors: {},
};

const storeConfig = {
	reducer(state = DEFAULT_STATE, action) {
		switch (action.type) {
			case 'SET_CAMPAIGN_DATA':
				return {
					...state,
					campaigns: {
						...state.campaigns,
						[action.campaignId]: action.data,
					},
					isLoading: {
						...state.isLoading,
						[action.campaignId]: false,
					},
					errors: {
						...state.errors,
						[action.campaignId]: null,
					},
				};
			case 'FETCH_CAMPAIGN_DATA':
				return {
					...state,
					isLoading: {
						...state.isLoading,
						[action.campaignId]: true,
					},
					errors: {
						...state.errors,
						[action.campaignId]: null,
					},
				};
			case 'FETCH_FAILED':
				return {
					...state,
					isLoading: {
						...state.isLoading,
						[action.campaignId]: false,
					},
					errors: {
						...state.errors,
						[action.campaignId]: action.error,
					},
				};
			default:
				return state;
		}
	},

	actions: {
		fetchCampaignData(campaignId) {
			return { type: 'FETCH_CAMPAIGN_DATA', campaignId };
		},
		setCampaignData(campaignId, data) {
			return { type: 'SET_CAMPAIGN_DATA', campaignId, data };
		},
		fetchFailed(campaignId, error) {
			return { type: 'FETCH_FAILED', campaignId, error };
		},
	},

	selectors: {
		getCampaignData(state, campaignId) {
			return state.campaigns[campaignId] || null;
		},
		isCampaignLoading(state, campaignId) {
			return state.isLoading[campaignId] || false;
		},
		getCampaignError(state, campaignId) {
			return state.errors[campaignId] || null;
		},
	},

	controls: {
		FETCH_CAMPAIGN_DATA(action) {
			return wp.apiFetch({ path: `/give-api/v2/p2p-campaigns/get-campaign?campaignId=${action.campaignId}` });
		},
	},

	resolvers: {
		*getCampaignData(campaignId) {
			const { select } = require('@wordpress/data');
			const dataExists = select('give-cover-block-extended/campaigns').getCampaignData(campaignId);
			const isLoading = select('give-cover-block-extended/campaigns').isCampaignLoading(campaignId);
			if (!dataExists && !isLoading) {
				try {
					const data = yield storeConfig.actions.fetchCampaignData(campaignId);
					yield storeConfig.actions.setCampaignData(campaignId, data);
				} catch (error) {
					yield storeConfig.actions.fetchFailed(campaignId, error.message);
				}
			}
		},
	},
};

registerStore('give-cover-block-extended/campaigns', {
	reducer: storeConfig.reducer,
	actions: storeConfig.actions,
	selectors: storeConfig.selectors,
	controls: storeConfig.controls,
	resolvers: storeConfig.resolvers,
});
