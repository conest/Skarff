// Protocol setting. HTTP / HTTPS

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

module.exports = function(app, SETTING) {

  if (SETTING.https.use) {

    // using HTTPS
    let keyPath = path.resolve(SETTING.rootPath, SETTING.https.key);
    let certPath = path.resolve(SETTING.rootPath, SETTING.https.cert);

    if ( !fs.existsSync(keyPath) || !fs.existsSync(certPath) ){
        console.error('Can not found HTTPS Keypair');
        process.exit(1);
    }
    let options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
        passphrase: SETTING.https.passphrase,
    };
    https.createServer(options, app.callback()).listen(SETTING.port);

    // HTTP redirection
    if (SETTING.redirection.use) {
      const statusCode = SETTING.redirection.statusCode;
      const listenPort = SETTING.redirection.listenPort;

      http.createServer(function (req, res) {
          res.writeHead(statusCode, { "Location": `https://${req.headers['host']}${req.url}` });
          res.end();
      }).listen(listenPort);
    }

  } else {
    app.listen(SETTING.port);
  }

};
