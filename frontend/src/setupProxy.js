const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  const wsProxy = proxy('/socket.io', {target:'ws://localhost:4000/', changeOrigin: true, ws:true, logLevel: 'debug'});
  app.use(wsProxy);
};