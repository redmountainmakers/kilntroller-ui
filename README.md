## Kiln controller - UI

Webpack + React + Babel

### Installation

```sh
git clone https://github.com/redmountainmakers/kilntroller-ui
cd kilntroller-ui
npm install
```

### Development

Requires Node.js v6 or greater.

Requires GNU `make` or equivalent (if on Debian, try
`sudo apt-get install build-essential`).

Use `make run` to start
[webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html)
with live editing support via
[react-hot-loader](https://github.com/gaearon/react-hot-loader).

Use `make lint` to check coding style, and `make lint-fix` to automatically fix
many issues.

If you need to, you can create a config file `local.json` with any or all of
the following settings:

- `port` - port for development server (default 3000)
