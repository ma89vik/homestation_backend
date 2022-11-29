var sqlite3 = require('sqlite3');
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var fs = require('fs')
var ini = require('ini')

mkdirp.sync('./var/db');

var db = new sqlite3.Database('./var/db/todos.db');
var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

db.serialize(function() {
  // create the database schema for the todos app
  db.run("CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB \
  )");

  db.run("CREATE TABLE IF NOT EXISTS apikeys ( \
    id INTEGER PRIMARY KEY, \
    key TEXT UNIQUE \
  )");

  db.run("CREATE TABLE IF NOT EXISTS todos ( \
    id INTEGER PRIMARY KEY, \
    title TEXT NOT NULL, \
    owner_id TEXT NOT NULL \
    completed INTEGER \
  )");

  // create an initial user (username: alice, password: letmein)
  var salt = crypto.randomBytes(16);
  db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
    config.user,
    crypto.pbkdf2Sync(config.pw, salt, 310000, 32, 'sha256'),
    salt
  ]);

  db.run('INSERT OR IGNORE INTO apikeys (key) VALUES (?)', [
    config.apikey
  ]);
});

module.exports = db;
