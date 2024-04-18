import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';

const enhanceBlockEdit = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, attributes, setAttributes } = props;
		const { useGiveCampaign, giveCampaignId } = attributes;

		// Early exit for non-applicable blocks to prevent unnecessary logic execution
		if (name !== 'core/cover' && name !== 'core/image') {
			return <BlockEdit {...props} />;
		}

		const { campaignData, isLoading } = useSelect(
			(select) => {
				const { getCampaignData, isCampaignLoading } = select('give-cover-block-extended/campaigns');
				return {
					campaignData: getCampaignData(giveCampaignId),
					isLoading: isCampaignLoading(giveCampaignId),
				};
			},
			[giveCampaignId]
		);

		const { fetchCampaignData } = useDispatch('give-cover-block-extended/campaigns');

		// Fetch data as soon as possible if it's not already being loaded
		useEffect(() => {
			if (giveCampaignId && useGiveCampaign !== 'none' && campaignData === undefined && !isLoading) {
				fetchCampaignData(giveCampaignId);
			}
		}, [giveCampaignId, useGiveCampaign, campaignData, isLoading]);

		// Memoizing the URL update logic to prevent unnecessary recalculations
		const newUrl = useMemo(() => {
			if (campaignData?.data) {
				return useGiveCampaign === 'image' ? campaignData.data.campaign_image : campaignData.data.campaign_logo;
			}
		}, [campaignData, useGiveCampaign]);

		useEffect(() => {
			if (newUrl && attributes.url !== newUrl) {
				setAttributes({ url: newUrl });
			}
		}, [newUrl, attributes.url, setAttributes]);

		return <BlockEdit {...props} />;
	};
}, 'enhanceBlockEdit');

addFilter('editor.BlockEdit', 'give-cover-block-extended/enhance-block-edit', enhanceBlockEdit);
