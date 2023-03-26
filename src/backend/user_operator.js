var db_controller = require('./db/userdb_controller.js')
var uuid = require('uuid');

exports.check = function(req, res) {
    var user = null;
    var result = {
        result : -1,
        userid : req.body.userid,
        username : "",
        isAdmin : false
    }    

    user = db_controller.finduser_byuserid(req.body.userid);

    if (user != null) {
        result.result = 0;
        result.username = user.username;
        result.isAdmin = user.isAdmin;
    }
    
    res.send(result);
}

exports.login = function (req, res) {
    var result = {
        result : -1,
        userid : "",
    }

    var user = db_controller.finduser_byusernameandpassword(req.body.username, req.body.password);

    if (user != null) {
        result.result = 0;
        result.userid = user.userid;
    } 
    
    res.send(result);   
}

exports.changepassword = function (req, res) {
    var user = null;
    var result = {
        result : -1
    }

    user = db_controller.finduser_byuserid(req.body.userid);

    if (user != null) {
        if (user.password == req.body.password) {
            user.password = req.body.password_new;
            db_controller.update_user(user);
            result.result = 0;
        }
    }

    res.send(result);   
}

exports.register = function (req, res) {
    var result = {
        result : -1,
        userid : "",
        username : "",
        isAdmin : false
    }

    var user = db_controller.finduser_byusername(req.body.username);

    if (user == null) {
        var new_user = {
            "userid" : uuid.v1(),
            "username" : req.body.username,
            "password" : req.body.password,
            "isAdmin" : false
        }
    
        db_controller.add_user(new_user);

        result.result = 0;
        result.userid = new_user.userid;
        result.username = new_user.username;
        result.isAdmin = new_user.isAdmin;
    }

    res.send(result);   
}

exports.getchatid = function (req, res) {
    var user = null;
    var result = {
        result : -1,
        chatid : ""
    }

    user = db_controller.finduser_byuserid(req.body.userid);

    if (user != null) {
        if (user.chatid == "") {
            user.chatid = uuid.v1();
            db_controller.update_user(user);
        }
        
        result.result = 0;
        result.chatid = user.chatid;
    }

    res.send(result);   
}

exports.newchatid = function (req, res) {
    var user = null;
    var result = {
        result : -1,
        chatid : ""
    }

    user = db_controller.finduser_byuserid(req.body.userid);

    if (user != null) {
        user.chatid = uuid.v1();
        db_controller.update_user(user);

        result.result = 0;
        result.chatid = user.chatid;
    }

    res.send(result);   
}