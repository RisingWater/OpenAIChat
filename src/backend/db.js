var path = require('path');
var fs = require('fs');

const db_dir = '../../db/'

function load_db(filename) {
    var file = path.join(__dirname, filename);
    var data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return data;
}

function save_db(filename, data) {
    var file = path.join(__dirname, filename);
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
}

exports.load_chat_db = function() {
    return load_db(db_dir + 'chatdb.js');
}

exports.save_chat_db = function(data) {
    return save_db(db_dir + 'chatdb.js', data);
}