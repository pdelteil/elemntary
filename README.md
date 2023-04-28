# Elemntary

Elemntary is a GUI application that allows your to control Wahoo Elemnt bicycle computers from a desktop PC providing
some insights and hidden features.

## Screenshot

![Elemntary](/screenshots/screenshot.png?raw=true "Elemntary")

## Features

- show software info;
- upload custom maps & routing tiles (OSM files can be generated by [wahooMapsCreator](https://github.com/treee111/wahooMapsCreator));
- upload themes;
- take device screenshots;
- enable/disable hidden features;
- web server management;
- config backup/restore;
- run system actions (clear cache, restart, reboot).

## Installation

The easiest way to install it is to download a pre-built release zip-file for your Operating System:

- [Windows](https://github.com/vti/elemntary/releases/download/v0.5.4/elemntary-win32-x64-0.5.4.zip) (application is not signed, you might need to add a security exception)
- [MacOS](https://github.com/vti/elemntary/releases/download/v0.5.4/elemntary-darwin-x64-0.5.4.zip) (application is not signed, you might need to add a security exception)
- [Linux](https://github.com/vti/elemntary/releases/download/v0.5.4/elemntary-linux-x64-0.5.4.zip)

## Usage

In order for your Wahoo computers to be controllable by Elemntary they need to be authorized. The authorization process
depends on the model. Follow the instructions:

1. turn the device on (make sure it's not connected via usb yet)
2. press keys on device
    - BOLT v1 and ROAM
        - press the power button (you enter the settings menu)
        - press the power button again (you return to the normal screen)
    - BOLT v2 and ROAM v2
        - press the power, up and down buttons at the same time (this is a bit hard, but give it several tries if it
          doesn't work)
3. connect the device to your pc

## Development

This is an Electron app, so JavaScript/Node knowledge is required.

### Environment

You need to have the following software installed:

- `node` (>= v16)
- `yarn` (or use `npm`)

NodeJS can be downloaded and installed for your operation system from the [official NodeJS downloads
page](https://nodejs.org/en/download/).

Yarn is optional and can be installed by following [their guide](https://yarnpkg.com/getting-started/install).

For MacOS it is also possible to use `brew`:

```bash
$ brew install node
$ brew install yarn
```

### Building

```bash
# Clone the project
$ git clone https://github.com/vti/elemntary
$ cd elemntary

# Install dependencies
$ yarn install

# Run tests
$ yarn test

# Start the application
$ yarn start

# Build the application for your current platform
$ yarn make
```

## Credits

This project is standing on the shoulders of the giants:

[@Intyre](https://github.com/Intyre) for reverse engineering

[@treee111](https://github.com/treee111) for [wahooMapsCreator](https://github.com/treee111/wahooMapsCreator)

[@thoughtgap](https://github.com/thoughtgap) for routing tiles upload

### Translations

- Dutch — [Ebe66](https://github.com/Ebe66)
- German — [@treee111](https://github.com/treee111)

## Author

Viacheslav Tykhanovskyi (vti AT uptosmth.com)

## Copyright and License

Copyright (C) 2022-2023, Viacheslav Tykhanovskyi

This program is free software, you can redistribute it and/or modify it under the terms of the GNU GENERAL PUBLIC
LICENSE v3 or later. See LICENSE file for details.
