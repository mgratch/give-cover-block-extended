import { useState, createElement, Fragment } from '@wordpress/element';
import { NavigableMenu, MenuItem } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import CampaignsModal from '../components/CampaignsModal';
import GiveIcon from '../components/GiveIcon';
import { ModalProvider, useModal } from '../context/ModalContext';
import updateBlockAttributes from '../blocks/cover/updateAttributes';
import resetBlockAttributes from '../blocks/cover/resetAttributes';
import { __ } from '@wordpress/i18n';

const enhanceMediaReplaceFlow = createHigherOrderComponent((MediaReplaceFlow) => {
	return (outerProps) => {
		const EnhancedComponent = (innerProps) => {
			const { isOpen, openModal, closeModal } = useModal();
			const [actionType, setActionType] = useState(null);

			const handleSelect = (media) => {
				if (innerProps.onSelect) {
					innerProps.onSelect(media);
				}
				resetBlockAttributes();
			};

			const handleToggleFeaturedImage = () => {
				if (innerProps.onToggleFeaturedImage) {
					innerProps.onToggleFeaturedImage();
				}
				resetBlockAttributes();
			};

			const handleOpenModal = (type) => {
				setActionType(type);
				openModal();
			};

			const handleUseCampaign = (campaign, type) => {
				closeModal();
				updateBlockAttributes(campaign, type);
			};

			const modalComponent = isOpen
				? createElement(CampaignsModal, {
						isOpen,
						onClose: closeModal,
						onUse: handleUseCampaign,
						actionType,
					})
				: null;

			const newItems = createElement(
				NavigableMenu,
				{},
				createElement(
					MenuItem,
					{
						icon: GiveIcon,
						onClick: () => handleOpenModal('image'),
					},
					__('Use Campaign Image', 'give-cover-block-extended')
				),
				createElement(
					MenuItem,
					{
						icon: GiveIcon,
						onClick: () => handleOpenModal('logo'),
					},
					__('Use Campaign Logo', 'give-cover-block-extended')
				)
			);

			const childrenWithNewItems = createElement(Fragment, {}, innerProps.children, newItems);

			return createElement(
				Fragment,
				{},
				createElement(MediaReplaceFlow, {
					...innerProps,
					children: childrenWithNewItems,
					onSelect: handleSelect,
					onToggleFeaturedImage: handleToggleFeaturedImage,
				}),
				modalComponent
			);
		};

		return createElement(ModalProvider, {}, createElement(EnhancedComponent, { ...outerProps }));
	};
}, 'enhanceMediaReplaceFlow');

export default enhanceMediaReplaceFlow;
