## Kiln controller - UI

Webpack + React + Babel

### Development Setup

```sh
git clone https://github.com/redmountainmakers/kilntroller-ui
cd kilntroller-ui
npm install
```

Requires Node.js v6 or greater.

Requires GNU `make` or equivalent (if on Debian, try
`sudo apt-get install build-essential`).

To develop the code on your computer, use `make run`.  This will start
[webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html)
with live editing support via
[react-hot-loader](https://github.com/gaearon/react-hot-loader).
(If you're using Windows, try `node server.js` instead).

Use `make lint` to check coding style, and `make lint-fix` to automatically fix
many issues.

If you need to, you can create a config file `local.json` with any or all of
the following settings:

- `port` - port for development server (default 3000)

### Deployment

You will need a SSH account on the `redmountainmakers.org` web server.  This
account must be a member of the `webadmin` group.

Run these commands:

```sh
make build
scp dist/* yourusername@redmountainmakers.org:/www/kiln/
```
