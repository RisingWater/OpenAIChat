var db = require('./db.js');

exports.list_chat = function() {
    return db.load_chat_db();
}

exports.add_user_chat = function(input) {
    const now = new Date();
    const dateString = now.toLocaleString();

    var chat = db.load_chat_db();
    const newChat = [...chat, { name: 'You', role: 0, content: input, time: dateString }];
    db.save_chat_db(newChat);
}

exports.add_ai_chat = function(input) {
    const now = new Date();
    const dateString = now.toLocaleString();

    var chat = db.load_chat_db();
    const newChat = [...chat, { name: 'Chatgpt', role: 1, content: input, time: dateString }];
    db.save_chat_db(newChat);
}

exports.clear_chat = function() {
    const newChat = [];
    db.save_chat_db(newChat);
}