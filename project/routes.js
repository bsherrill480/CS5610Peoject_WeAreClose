var mongoose    = require('mongoose');
var Location  = require('./location.schema.server.js');

module.exports = function(app) {

    //Recording part
    app.get('/locations', function(req, res){
        var query = Location.find({});
        query.exec(function(err, locations){
            if(err) {
                res.send(err);
            }
            res.json(locations);
        });
    });

    app.post('/locations', function(req, res){
        var newlocation = new Location(req.body);

        newlocation.save(function(err){
            if(err)
                res.send(err);

            res.json(req.body);
        });
    });

    //Find Part
    app.post('/query', function(req, res){
        var lat             = req.body.latitude;
        var long            = req.body.longitude;
        var distance        = req.body.distance;
        var male            = req.body.male;
        var female          = req.body.female;
        var other           = req.body.other;
        var minAge          = req.body.minAge;
        var maxAge          = req.body.maxAge;
        var favLang         = req.body.favlang;
        var reqVerified     = req.body.reqVerified;

        var query = Location.find({});

        if(distance){
            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},
                maxDistance: distance * 1609.34, spherical: true});
        }

        if(male || female){
            query.or([{ 'gender': male }, { 'gender': female }]);
        }

        if(minAge){
            query = query.where('age').gte(minAge);
        }

        if(maxAge){
            query = query.where('age').lte(maxAge);
        }

        if(favLang){
            query = query.where('favlang').equals(favLang);
        }

        if(reqVerified){
            query = query.where('htmlverified').equals("Real Data!");
        }

        query.exec(function(err, locations){
            if(err)
                res.send(err);

            res.json(locations);
        });
    });
};