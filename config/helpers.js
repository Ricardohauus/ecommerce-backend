const MySqli = require('mysqli');

let conn = new MySqli({
  Host: 'localhost', // IP/domain name
  port: 3306, //port, default 3306
  user: 'root', //user name
  passwd: '', //password
  db: 'mega_shop', // can specify the database or not [optional]
});

let db = conn.emit(false, '');
//
module.exports = {
  database: db,
};
