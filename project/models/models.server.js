module.exports = function() {
    var connectionString =  null;

    if (process.env.MONGODB_URI) {
        // connectionString = 'mongodb://heroku_cs7lkstk:pgi614qmuedmc4nu1fvqk9q8rb@ds127063.mlab.com:27063/heroku_cs7lkstk';
        connectionString = 'mongodb://heroku_h3f14m6h:ph6vgstc8mq367omjc6dncao26@ds139761.mlab.com:39761/heroku_h3f14m6h';
    }
    else {
        connectionString = 'mongodb://localhost:27017/cs5610';
    }

    var mongoose = require('mongoose');
    mongoose.connect(connectionString);
    mongoose.Promise = require('q').Promise;

    var userModel = require("./user/user.model.server.js")(mongoose);


    var models = {
        'userModel' : userModel
    };

    return models;

};