import { Modal, MenuItem, NavigableMenu, Button } from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';
import { useApiFetcher } from '../api/useApiFetcher';
import GiveIcon from './GiveIcon';
import { __ } from '@wordpress/i18n';

const CampaignsModal = ({ isOpen, onClose, onUse, actionType }) => {
	const [page, setPage] = useState(1);
	const {
		data: campaigns,
		pages,
		isLoading,
		isError,
	} = useApiFetcher(`/give-api/v2/p2p-campaigns/get-campaigns`, {
		page,
		sort: '',
		direction: '',
		status: 'all',
	});

	return (
		<Modal
			key="give_cover_block_extended"
			title={__('Select a Campaign', 'give-cover-block-extended')}
			icon={GiveIcon}
			isOpen={isOpen}
			onRequestClose={onClose}
		>
			{isLoading ? (
				<p>{__('Loading', 'give-cover-block-extended')}...</p>
			) : isError ? (
				<p>{__('Error loading campaigns', 'give-cover-block-extended')}.</p>
			) : (
				<Fragment>
					<NavigableMenu>
						{campaigns &&
							campaigns.map((campaign) => (
								<MenuItem key={campaign.campaign_id} onClick={() => onUse(campaign, actionType)}>
								{campaign.campaign_title}
								</MenuItem>
							))}
					</NavigableMenu>
					<Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
						{__('Previous', 'give-cover-block-extended')}
					</Button>
					<Button onClick={() => setPage((prev) => Math.min(prev + 1, pages))} disabled={page >= pages}>
						{__('Next', 'give-cover-block-extended')}
					</Button>
				</Fragment>
			)}
		</Modal>
	);
};

export default CampaignsModal;
