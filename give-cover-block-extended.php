<?php
/**
 * Plugin Name: Give Cover Block Extended
 * Description: Extends the cover image block to include "Use Campaign Image" and "Use Campaign Logo" options.
 * Version: 0.1.0
 * Author: Marc Gratch
 *
 * @package give-cover-block-extended
 */

use GiveP2P\P2P\Repositories\CampaignRepository;

defined( 'ABSPATH' ) || exit;

/**
 * Class Give_Cover_Block_Extended
 */
class Give_Cover_Block_Extended {

	/**
	 * Initialize the plugin by setting up hooks.
	 */
	public function init(): void {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_assets' ) );
		add_filter( 'render_block', array( $this, 'filter_block_content' ), 10, 2 );
	}

	/**
	 * Enqueue scripts and styles for block editor.
	 */
	public function enqueue_assets(): void {
		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
		wp_enqueue_script(
			'give-cover-block-extended',
			plugins_url( 'build/index.js', __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
	}

	/**
	 * Modify the block's HTML content based on specific attributes.
	 *
	 * @param string $block_content HTML of the block.
	 * @param array  $block Block information.
	 *
	 * @return string Modified block HTML.
	 */
	public function filter_block_content( string $block_content, array $block ): string {
		if ( $this->is_target_block( $block ) ) {
			return $this->process_block( $block_content, $block );
		}

		return $block_content;
	}

	/**
	 * Check if the block is the target block for modification.
	 *
	 * @param array $block Block data.
	 *
	 * @return bool True if it's a target block, false otherwise.
	 */
	private function is_target_block( array $block ): bool {
		return in_array( $block['blockName'], array( 'core/cover', 'core/image' ), true ) &&
				isset( $block['attrs']['useGiveCampaign'] ) &&
				'none' !== $block['attrs']['useGiveCampaign'];
	}

	/**
	 * Process and modify the block content.
	 *
	 * @param string $block_content Current HTML content of the block.
	 * @param array  $block Block data.
	 *
	 * @return string Modified block content.
	 */
	private function process_block( string $block_content, array $block ): string {
		if ( empty( $block['attrs']['giveCampaignId'] ) ) {
			return $block_content;
		}

		$media = $this->get_campaign_media( $block['attrs'] );

		return $this->replace_media_in_content( $block_content, $media, $block['blockName'] );
	}

	/**
	 * Retrieve the campaign image or logo URL.
	 *
	 * @param array $attrs Block attributes.
	 *
	 * @return string URL of the image or logo.
	 */
	private function get_campaign_media( array $attrs ): string {
		$campaign_repository = give( CampaignRepository::class );
		$campaign            = $campaign_repository->getCampaign( absint( $attrs['giveCampaignId'] ) );
		$media_method        = 'logo' === $attrs['useGiveCampaign'] ? 'getLogo' : 'getImage';

		if ( is_null( $campaign ) || ( ! method_exists( $campaign, $media_method ) ) ) {
			return '';
		}

		return $campaign->$media_method() ?? '';
	}

	/**
	 * Replace the image source in the block's content.
	 *
	 * @param string $block_content HTML content of the block.
	 * @param string $media New media URL to insert.
	 * @param string $block_name Name of the block.
	 *
	 * @return string Updated block content.
	 */
	private function replace_media_in_content( string $block_content, string $media, string $block_name ): string {
		if ( 'core/cover' === $block_name ) {
			$pattern = '/(<img [^>]*class="[^"]*wp-block-cover[^"]*"[^>]*src=")[^"]+(")/';
		} else { // 'core/image'
			$pattern = '/(img src=")[^"]*(")/';
		}

		return preg_replace( $pattern, '$1' . esc_url( $media ) . '$2', $block_content );
	}
}

add_action( 'plugins_loaded', array( new Give_Cover_Block_Extended(), 'init' ) );
