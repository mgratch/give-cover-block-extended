const updateBlockAttributes = (campaign, type) => {
	const { dispatch, select } = wp.data;
	const blockEditor = dispatch('core/block-editor');
	const selectedBlock = select('core/block-editor').getSelectedBlock();

	if (selectedBlock && (selectedBlock.name === 'core/cover' || selectedBlock.name === 'core/image')) {
		const newAttributes = {
			giveCampaignId: campaign.campaign_id,
			useGiveCampaign: type,
		};

		if (type === 'image') {
			newAttributes.url = campaign.campaign_image; // Assuming campaign_image is the attribute
		} else if (type === 'logo') {
			newAttributes.url = campaign.campaign_logo; // Assuming campaign_logo is the attribute
		}

		blockEditor.updateBlockAttributes(selectedBlock.clientId, newAttributes);
	}
};

export default updateBlockAttributes;
