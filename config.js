// This module loads a config file in the current working directory
// matching the NODE_ENV variable.
//
// https://gist.github.com/cbumgard/4076234

var config,
    env = (process.env.NODE_ENV ? process.env.NODE_ENV : 'development');

var configFile = './config/' + env + '.json';

try {
  config = require(configFile);
}
catch (err) {
  if (err.code && err.code === 'MODULE_NOT_FOUND') {
    console.error('No config file matching NODE_ENV=' + env + '.'); 
    console.error('Requires "/config/' + __dirname + '/' + env + '.json"');
    process.exit(1);
  } else {
    throw err;
  }
}

module.exports = config;
