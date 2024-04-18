# Give Cover Block Extended Plugin

This plugin extends the Cover and Image blocks to dynamically use GiveWP P2P Campaign Images and Logos.

## Prerequisites

- WordPress 6.0 or later
- GiveWP 3.0 or later
- GiveWP P2P 2.1 or later

## Installation

To install the plugin, follow these steps:
1. Download the latest release [here](https://github.com/mgratch/give-cover-block-extended/releases/latest/download/give-cover-block-extended.zip).
2. Extract the contents of the downloaded ZIP file.
3. Upload the extracted folder to the `wp-content/plugins` directory of your WordPress installation.
4. Activate the plugin through the WordPress admin panel.
5. Use the plugin in the editor to dynamically use GiveWP P2P Campaign Images and Logos.
6. Enjoy!

## Building the Plugin

To build the plugin, run the following command from the root of the plugin directory:
```bash
npm install &&
npm run build
```
This command compiles the source files into the `build` directory, making it ready to be used in a WordPress environment.

The plugin includes a `start` script that watches for changes in the source files and automatically compiles them. To use this script, run the following command:
```bash
npm start
```

## Usage

Activate the plugin through the WordPress admin panel. Once activated, it will extend the existing cover block functionalities in the editor.

## Contributing

Contributions are welcome. Please fork the repository and submit pull requests to the main branch.

## License

This plugin is licensed under the [GPLv2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html) or later.
