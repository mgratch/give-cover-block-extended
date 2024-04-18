import { addFilter } from '@wordpress/hooks';
import extendMediaPlaceholder from './hocs/extendMediaPlaceholder';
import enhanceMediaReplaceFlow from './hocs/enhanceMediaReplaceFlow';
import './api/store';
import './blocks/cover/index';

addFilter('editor.MediaPlaceholder', 'my-plugin/extend-media-placeholder', extendMediaPlaceholder);
addFilter('editor.MediaReplaceFlow', 'my-plugin/enhance-media-replace-flow', enhanceMediaReplaceFlow);
