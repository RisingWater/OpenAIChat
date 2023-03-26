var comm = require('./communication.js');
var chatdb_controller = require('./db/chatdb_controller.js');

exports.show_all = function (req, res) {
    var chats = chatdb_controller.list_chat(req.body.chatid);
    res.send(chats);
}

exports.chat_directly = function (req, res) {
    comm.chat(req.body.chatid, req.body.input).then(
        result=>res.send(result)
    );
}