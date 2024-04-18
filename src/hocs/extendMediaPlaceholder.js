import { useState, createElement, Fragment } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import CampaignsModal from '../components/CampaignsModal';
import { ModalProvider, useModal } from '../context/ModalContext';
import updateBlockAttributes from '../blocks/cover/updateAttributes';
import resetBlockAttributes from '../blocks/cover/resetAttributes';
import { __ } from '@wordpress/i18n';

const extendMediaPlaceholder = createHigherOrderComponent((OriginalComponent) => {
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

			if (innerProps.allowedTypes && innerProps.allowedTypes.includes('image')) {
				return createElement(
					Fragment,
					{},
					createElement(
						OriginalComponent,
						{ ...innerProps },
						createElement(
							Button,
							{
								onClick: () => handleOpenModal('image'),
								className: 'components-button is-tertiary',
							},
							__('Use Campaign Image', 'give-cover-block-extended')
						),
						createElement(
							Button,
							{
								onClick: () => handleOpenModal('logo'),
								className: 'components-button is-tertiary',
							},
							__('Use Campaign Logo', 'give-cover-block-extended')
						),
						innerProps.children
					),
					isOpen &&
						createElement(CampaignsModal, {
							isOpen,
							onClose: closeModal,
							onUse: handleUseCampaign,
							actionType,
						})
				);
			}

			return createElement(OriginalComponent, {
				...innerProps,
				onSelect: handleSelect,
				onToggleFeaturedImage: handleToggleFeaturedImage,
			});
		};

		return createElement(ModalProvider, {}, createElement(EnhancedComponent, { ...outerProps }));
	};
}, 'extendMediaPlaceholder');

export default extendMediaPlaceholder;
