const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

var comm = require('./communication.js');
var chatdb_controller = require('./chatdb_controller.js')

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect("index.html");
});

app.get('/get_all_chat', (req, res) =>{
    var chats = chatdb_controller.list_chat();
    res.send(chats);
})

app.get('/clear_chat', (req, res) =>{
    var chats = chatdb_controller.clear_chat();
    res.send("ok");
})

app.post('/get_answer_directly', (req, res) => {
    comm.chat(req.body.input).then(
        result=>res.send(result)
    );
})

app.listen(80, () => {
    console.log('Server started on port 80');
});