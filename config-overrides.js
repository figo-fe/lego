/* config-overrides.js */
const { alias } = require('react-app-rewire-alias');

module.exports = function override(config, env) {
  alias({
    '@jsoneditor': 'src/lib/jsoneditor',
    '@lang': 'src/lang',
  })(config);
  return config;
};
