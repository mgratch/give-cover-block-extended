const resetBlockAttributes = () => {
	const { dispatch, select } = wp.data;
	const blockEditor = dispatch('core/block-editor');
	const selectedBlock = select('core/block-editor').getSelectedBlock();

	if (selectedBlock && (selectedBlock.name === 'core/cover' || selectedBlock.name === 'core/image')) {
		const newAttributes = {
			giveCampaignId: '',
			useGiveCampaign: 'none',
		};

		blockEditor.updateBlockAttributes(selectedBlock.clientId, newAttributes);
	}
};

export default resetBlockAttributes;
