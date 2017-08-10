module.exports = function(mongoose){
    var Schema = mongoose.Schema;

    var userSchemaProject = new Schema({
        username : {type : String, required : true},
        password : {type : String, required : true},
        role: {type : String, default: 'User', enum: ['User', 'Admin']},
        firstName : String,
        lastName : String,
        email : String,
        phone : String,
        dateCreated : {
            type : Date,
            default: Date.now
        },
        facebook: {
            id: String,
            token: String
        }
    }, {collection: 'userProject'});

    return userSchemaProject;
};