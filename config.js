let localConfig = {
    port : 3000
};

try {
    localConfig = require('./local.json');
} catch (err) {}

module.exports = localConfig;
