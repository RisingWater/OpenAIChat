var db = require('./db.js');

exports.list_user = function () {
    return db.load_user_db();
}

exports.add_user = function (user) {
    var users = db.load_user_db();
    const newUsers = [...users, user];
    db.save_user_db(newUsers);
}

exports.update_user = function (user) {
    var users = db.load_user_db();
    users.some(element => {
        if (element.userid == user.userid) {
            element.username = user.username;
            element.password = user.password;
            element.isAdmin = user.isAdmin;
            element.chatid = user.chatid;
            return true;
        }
    });
    db.save_user_db(users);
}

exports.finduser_byusernameandpassword = function (username, password) {
    var user = null;
    db.load_user_db().some(element => {
        if (element.username == username
            && element.password == password) {
                user = element;
                return true;
            }
    });

    return user;
}

exports.finduser_byusername = function (username) {
    var user = null;
    db.load_user_db().some(element => {
        if (element.username == username) {
            user = element;
            return true;
        }
    });

    return user;
}

exports.finduser_byuserid = function (userid) {
    var user = null;
    db.load_user_db().some(element => {
        if (element.userid == userid) {
            user = element;
            return true;
        }
    });

    return user;
}

