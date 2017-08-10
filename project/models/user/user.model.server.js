module.exports = function(mongoose){
    var userSchemaProject = require('./user.schema.server.js')(mongoose);
    var userModel = mongoose.model('UserProject', userSchemaProject);
    const findOrCreate = require('mongoose-findorcreate');
    userSchemaProject.plugin(findOrCreate);


    var api = {
        'createUser' : createUser,
        'findUserById' : findUserById,
        'findUserByUsername' : findUserByUsername,
        'findUserByCredentials' : findUserByCredentials,
        'updateUser' : updateUser,
        'deleteUser' : deleteUser,
        'findUserByFacebookId': findUserByFacebookId,
        'findAllUsers': findAllUsers
    };

    return api;

    function findUserByFacebookId(facebookId) {
        return userModel.findOne({'facebook.id': facebookId});
    }

    function createUser(user){
        var newUser = {
            username : user.username,
            password : user.password,
            facebook: user.facebook,
            role: user.role,
        };

        if(user.firstName){
            newUser.firstName = user.firstName;
        }
        if(user.lastName){
            newUser.lastName = user.lastName;
        }
        if(user.email){
            newUser.email = user.email;
        }
        if(user.phone){
            newUser.phone = user.phone;
        }

        return userModel.create(newUser);
    }

    function findUserById(userId){
        return userModel.findById(userId);
    }

    function findUserByUsername(username){
        return userModel.findOne({username : username})
    }


    function findUserByCredentials(username, password){
        return userModel.findOne({
            username : username,
            password : password
        });
    }

    function updateUser(userId, user){
        return userModel.update({
            _id : userId
        }, {
            username : user.username,
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            role : user.role
        });
    }

    function deleteUser(userId){
        return userModel.remove({
            _id : userId
        });
    }

    function findAllUsers() {
        console.log("here");
        return userModel.find();
    }
};