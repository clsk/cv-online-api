var EJS = require('ejs');

module.exports = {
  get: function (id,cb){
    GLOBAL.sqlConnection.query('SELECT * FROM Templates where id=?',[id], function(err, templates) {
      cb(err || !templates.length, templates[0]);
    });
  },
  all: function (cb){
    GLOBAL.sqlConnection.query('SELECT * FROM Templates', function(err, templates) {
      cb(err || !templates.length, templates);
    });
  },
  getHtml: function(template, cv) {
        var obj = new EJS.compile(template.html);
        var body = obj({cv: cv});

        var html = '<!DOCTYPE html><html><head><link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" /><style type="text/css">' +  template.css + '</style></head><body>' + body + '<script src="/bootstrap/js/jquery-2.1.4.min.js" type="text/javascript"></script><script src="/bootstrap/js/bootstrap.min.js" type="text/javascript"></body></html>';
        console.log(html);

    return html;
  }
};
