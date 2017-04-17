/**
 * Created by Bhuwan on 3/30/17.
 */
'use strict;'
var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    movie:      {type: String, required: true},
    reviewer:   {type: String, required: true},
    rating:     {type: Number, required:true, min: 0, max: 5},
    text:       {type: String, required: true},
})


var movieSchema = new mongoose.Schema({
    Title:          {type: String, required: true, unique: true},
    YearReleased:   {type: Number, required: true},
    Actors:         [{
                        Name: {type: String, required: true}
                    }]
})

var vault = require('avault').createVault(__dirname);
vault.get('GitVault', function (profileString) {
    if (!profileString) {
        console.log('Error: required vault is not found');
    } else {
        var profile = JSON.parse(profileString);
        console.log(profile);
    }
    var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
        replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

    var moviedb = mongoose.createConnection('mongodb://' + profile.username +':' + profile.password + '@ds149700.mlab.com:49700/movie',options);
    var Movie = moviedb.model('movies',movieSchema );
    var Review = moviedb.model('reviews', reviewSchema);

    module.exports = {
        Movies: Movie,
        Reviews: Review
    };
})

