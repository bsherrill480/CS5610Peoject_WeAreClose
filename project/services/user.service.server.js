var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, models) {
    var users = [];

    // GET Calls.
    app.get('/api/user', findUserAllUser);
    app.get('/api/user/:uid', findUserById);
    app.get("/api/admin/user", findAllUsers);

    // POST Calls.
    app.post('/api/user', createUser);

    // PUT Calls.
    app.put('/api/user/:uid', updateUser);

    // DELETE Calls.
    app.delete('/api/user/:uid', deleteUser);

    //Local
    app.post('/api/login', passport.authenticate('LocalStrategy'), login);
    app.get('/api/checkLoggedIn', checkLoggedIn);
    app.post('/api/register', register);
    app.post('/api/logout', logout);

    //LocalStrategy
    passport.use('LocalStrategy', new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function localStrategy(username, password, done) {
        models
            .userModel
            // .findUserByCredentials(username, password)
            .findUserByUsername(username)
            .then(
                function(user) {
                    // if(user.username === username && user.password === password) {
                    if (user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    //Facebook
    // app.get('/auth/facebook', passport.authenticate('facebook'));
    // app.get('/auth/facebook/callback', passport.authenticate('facebook'), facebookLogin);

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email'}));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
            successRedirect: '/project/#!/profile',
            failureRedirect: '/project/#!/login'
        }));


    //FacebookStrategy
    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID || '1059354044195438',
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET || '97cc4ede7414cc8a5f08856748059e43',

        //Use for local:
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5000/auth/facebook/callback'

        //Use for heroku:
        // callbackURL  : process.env.FACEBOOK_CALLBACK_URL || 'http://webdev-luyingmin-cs5610.herokuapp.com/auth/facebook/callback'
    };

    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    function facebookStrategy(token, refreshToken, profile, done) {
        models
            .userModel
            .findUserByFacebookId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var newFacebookUser = {
                            username:  profile.displayName,
                            password: "password",
                            facebook: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return models
                            .userModel
                            .createUser(newFacebookUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }


    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        models
            .userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    // function facebookLogin(req, res) {
    //     if(req.user) {
    //         res.redirect('/assignment/#!/profile');
    //     } else {
    //         res.sendStatus(404);
    //     }
    // }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function checkLoggedIn(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        models
            .userModel
            .createUser(user)
            .then(
                function (user) {
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                }
            );
    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    //API
    function createUser(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);

        models
            .userModel
            .findUserByUsername(user.username)
            .then(
                function (response) {
                    if (response) {
                        res.sendStatus(400).send(error);
                    } else {
                        models
                            .userModel
                            .createUser(user)
                            .then(
                                function (newUser) {
                                    res.json(newUser);
                                },
                                function (error) {
                                    res.sendStatus(400).send(error);
                                }
                            );
                    }
                }
            );
    }

    function findUserAllUser(req, res) {
        models
            .userModel
            .findAllUsers()
            .then(
                function(users) {
                    console.log(users);
                    if(users) {
                        res.json(users);
                    }
                }
            )

    }

    function findUserById(req, res) {
        var uid = req.params.uid;
        models
            .userModel
            .findUserById(uid)
            .then(
                function (user) {
                    if (user) {
                        res.json(user);
                    } else {
                        user = null;
                        res.send(user);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function updateUser(req, res) {
        var uid = req.params.uid;
        var new_user = req.body;
        models
            .userModel
            .updateUser(uid, new_user)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function deleteUser(req, res) {
        var uid = req.params.uid;
        models
            .userModel
            .deleteUser(uid)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findAllUsers(req, res) {
        if (isAdmin(req.user)) {
            models
                .findAllUsers()
                .then(function (users) {
                    console.log(users);
                        res.json(users);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        } else {
            res.status(403);
        }
    }
};