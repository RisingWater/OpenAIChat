var db = require('./db.js');

exports.list_chat = function(chatid) {
    return db.load_chat_db(chatid);
}

exports.add_user_chat = function(chatid, input) {
    const now = new Date();
    const dateString = now.toLocaleString();

    var chat = db.load_chat_db(chatid);
    const newChat = [...chat, { name: 'You', role: 0, content: input, time: dateString }];
    db.save_chat_db(chatid, newChat);
}

exports.add_ai_chat = function(chatid, input) {
    const now = new Date();
    const dateString = now.toLocaleString();

    var chat = db.load_chat_db(chatid);
    const newChat = [...chat, { name: 'Chatgpt', role: 1, content: input, time: dateString }];
    db.save_chat_db(chatid, newChat);
}
