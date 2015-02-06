yaml = require('js-yaml');
fs   = require('fs');
file = '_config.yml';
request = require('request');
_ = require('underscore');

fs.readFile(file, function (err, data) {
  if (err) throw err;
  doc = yaml.safeLoad(data);
  request.get({
    url: 'http://en.wikipedia.org/w/api.php',
    method: 'GET',
    qs: {
      action: 'query',
      pageids: _.inject(doc.browsers, function(memo, item) {
        memo.push(item.pageid);
        return memo
      }, []).join('|'),
      format: 'json',
      continue: '',
      rvprop: 'content',
      prop: 'revisions'
    }
  }, function (error, response, body) {
    if (error) { throw error; }
    body = JSON.parse(body);

    for (browser in doc.browsers) {
      rev = body.query.pages[doc.browsers[browser].pageid].revisions[0]['*'];
      version = rev.match(/latest.release.version = ([\d\.]+)/)[1]
      doc.browsers[browser].version = version
    }

    fs.writeFile(file, yaml.safeDump(doc), function (err) {
      if (err) throw err;
      console.log('Done!');
    });
  });

});
