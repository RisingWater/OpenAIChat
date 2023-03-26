var path = require('path');
var fs = require('fs');

const db_dir = '../../../db/'

function load_db(filename) {
    var file = path.join(__dirname, filename);
    if (fs.existsSync(file)) {
        var data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        return data;
    } else {
        fs.writeFileSync(file, JSON.stringify([]));
        return [];
    }
}

function save_db(filename, data) {
    var file = path.join(__dirname, filename);
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
}

exports.load_chat_db = function(chatid) {
    return load_db(db_dir + 'chatdb/chatdb-' + chatid + '.js');
}

exports.save_chat_db = function(chatid, data) {
    return save_db(db_dir + 'chatdb/chatdb-' + chatid + '.js', data);
}

exports.load_user_db = function() {
    return load_db(db_dir + 'userdb.js');
}

exports.save_user_db = function(data) {
    return save_db(db_dir + 'userdb.js', data);
}