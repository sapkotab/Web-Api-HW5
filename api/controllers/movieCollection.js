/**
 * Created by bhuwan on 3/30/17.
 */

'use strict;'

var db = require('../../config/db');
var async = require('async')


module.exports = {
    saveReview:saveReview,
    getrev:getrev,
    getAll : getAll,
    saveit : saveit,
    getOne : getOne,
    update : update,
    delMovie : delMovie
};

//POST /movie operationId
function saveReview(req, res, next) {
    var movie = req.body.movie;
    // make sure movie doesn't exit in database before saving
    db.Movies.find({Title: movie}, function (err, response) {
        if (err) throw {err:err};
        if (response.length === 0) {
            res.send({Error: "Movie does not exist for review"})
        }
        else {
            var newreview = new db.Reviews(req.body);
            newreview.save(function (err) {
                if (err) throw {err: err}
            })
            res.send({success: "New review successfully added to database"})
        }
    })
}

function getrev(req, res, next) {
    db.Reviews.find({}, function (err, reviews) {
        if (err) throw {err: err};
        res.send({Reviewlist: reviews})
    })
}

function getAll(req,res,next) {
    if (req.query.review === 'true') {
        db.Movies.aggregate([
            {
                $lookup: {
                    from: "reviews",
                    localField: "Title",
                    foreignField: "movie",
                    as: "review"
                }
            }
        ], function (err, result) {
            if (err) throw {err: err};
            else {
                res.send({Movielist: result});
            }
        });
    }
    else {
        db.Movies.find({}, function (err, movies) {
            if (err) throw {err: err};
            res.send({Movielist: movies})
        })
    }
}


//POST /movie operationId
function saveit(req, res, next) {
    var mTitle = req.body.Title;
    if(req.body.Actors.length < 3){
        res.send({Error: "At least 3 actors required"})
    }
    else {
        // make sure movie doesn't exit in database before saving
        db.Movies.find({Title: mTitle}, function (err, response) {
            if (err) throw {err: err};
            if (response.length === 0) {

                var newMovie = new db.Movies(req.body);
                newMovie.save(function (err) {
                    if (err) throw {err: err};
                });
                res.send({success: "New movie successfully added to database"})
            }
            else
                res.send({message: "Movie already exist"})
        })
    }
}
//GET /movie/{id} operationId
function getOne(req, res, next) {
    var Title = req.swagger.params.Title.value; //req.swagger contains the path parameters
    if (req.query.review === 'true') {
        db.Movies.aggregate([
            { $match : { Title : Title } },
            {
                $lookup: {
                    from: "reviews",
                    localField: "Title",
                    foreignField: "movie",
                    as: "review"
                }
            }
        ], function (err, result) {
            if (err) throw {err: err};
            else {
                res.send({Movie: result});
            }
        });
    }
    else {
        db.Movies.find({ Title : Title }, function (err, movie) {
            if (err) throw {err: err};
            res.send({Movie: movie})
        })
    }
}
//PUT /movie/{id} operationId
function update(req, res, next) {
    var mTitle = req.swagger.params.Title.value; //req.swagger contains the path parameters
    // make sure movie doesn't exit in database before saving
    db.Movies.find({Title: mTitle}, function (err, movie) {
        if (err) throw {err:err};
        if (movie.length === 0) {
            res.send({message: "No such movie is found"})
        }
        else {
            db.Movies.findOneAndUpdate({Title: mTitle},{$set: req.body},{new: true}, function (err, numUpdated) {
               // console.log(updated)
            });
             res.send({message: "Movie is updated"})
        }
        // res.send(req.body);
    })
}
//DELETE /movie/{id} operationId
function delMovie(req, res, next) {
    var Title = req.swagger.params.Title.value; //req.swagger contains the path parameters
    db.Movies.find({Title: Title}, function (err, response) {
        if (err) throw {err:err};
        // if movie doesn't exist send the message
        if (response.length === 0) {
            res.send({message: "No such movie is found"})
        }
        else {
            db.Movies.remove({ Title: Title }, function(err) {
               if(err) throw {err:err};
               res.send({message: "Movie successfully deleted"})
            });
        }
    })
}