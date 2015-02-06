yaml = require('js-yaml');
fs   = require('fs');
file = '_config.yml';

fs.readFile(file, function (err, data) {
  if (err) throw err;
  doc = yaml.safeLoad(data);

  // Update chrome version
  doc.browsers.chrome.name = 'Google Chrome';
  doc.browsers.chrome.version = '40.0.1';

  fs.writeFile(file, yaml.safeDump(doc), function (err) {
    if (err) throw err;
    console.log('Done!');
  });
});
