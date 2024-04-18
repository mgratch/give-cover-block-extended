import { addFilter } from '@wordpress/hooks';

const registerAttributes = () => {
	addFilter('blocks.registerBlockType', 'custom-cover-image-options/extend-cover-block', (settings, name) => {
		if (name === 'core/cover' || name === 'core/image') {
			settings.attributes = {
				...settings.attributes,
				useGiveCampaign: {
					type: 'string',
					default: 'none',
				},
				giveCampaignId: {
					type: 'string',
					default: '',
				},
			};
		}
		return settings;
	});
};

export default registerAttributes;
