const fs = require('fs');
const yaml = require('js-yaml');

try {
  var doc = yaml.safeLoad(fs.readFileSync( __dirname + '/../../setting.yml', 'utf8'));
} catch (err) {
  console.log('[ERROR] 设置文档读取出错');
  console.log(err);
  process.exit(1);
}

doc.port = process.env.PORT || doc.port || 3000;
doc.env = process.env.NODE_ENV || doc.env || 'production';

module.exports = doc;
