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
  getHtml: function(template) {
    var html = '<html><head><style>' + template.css + '</style></head>'; 
    html += '<body>'+ template.html + '</body></html>';
    return html;
  }
};