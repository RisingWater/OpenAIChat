const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

var chat_operator = require('./chat_operator.js');
var user_operator = require('./user_operator.js');

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/user/check', user_operator.check);
app.post('/user/login', user_operator.login);
app.post('/user/register', user_operator.register);
app.post('/user/changepassword', user_operator.changepassword);
app.post('/user/getchatid', user_operator.getchatid);
app.post('/user/newchatid', user_operator.newchatid);

app.post('/chat/show_all', chat_operator.show_all);
app.post('/chat/chat_directly', chat_operator.chat_directly);

app.get('/', (req, res) => {
    res.redirect("index.html");
});

app.listen(80, () => {
    console.log('Server started on port 80');
});