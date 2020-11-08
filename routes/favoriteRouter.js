const express = require('express');
const Favorite = require('../models/campsite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route ('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({user: req.user._id})
            .populate('user')
            .populate('campsites')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch((err) => next(err));
        }
    )
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({user: req.user._id})
            .then((favorite) => {
                if (favorite) {
                    req.body.forEach((fav) => {
                        if(!favorites.campsites.includes(fav._id)){
                            favorite.campsites.push(fav._id)
                        }
                    });
                favorite.save()
                .then((favorite => {
                res.status = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch((err => next(err)));
        } else {
            Favorite.create({user: req.user._id, campsites:req.body});
            favorite.save()
            .then((favorite => {
                res.status = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
            }
        })
        .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res)=> {
        res.statusCode = 403;
        res.end("Put operation not supported on /favorites");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndRemove(req.params.favoriteId)
            .then((favorite) => {
                if(favorite) {
                    console.log("Favorite deleted");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                }
                res.setHeader("Content-Type","text/plain");
                res.end("You do not have any favorites to delete.");
            })
            .catch((err) => next(err));
    });

    favoriteRouter.route ('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end("Get operation not supported on /favorites");
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        Favorite.findOne(req.params.favoriteId)
            .then((favorite) => {
                if (favorite.campsites.includes(req.params.campsiteId)) {
                    favorite.campsites.push(req.params.campsiteId);
                    favorite.save()
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite.campsites);
            })
            .catch(err => next(err));
        } else {
            err = new Error(
                `This campsite is already ${req.params.favoriteId} in the list of favorites`
            );
            err.status = 404;
            return next(err);
        }
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res)=> {
        res.statusCode = 403;
        res.end("Put operation not supported on /favorites");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndRemove(req.params.favoriteId)
            .then((favorite) => {
                if(favorite) {
                    console.log("Favorite deleted");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                }
                res.setHeader("Content-Type","text/plain");
                res.end("You do not have any favorites to delete.");
            })
            .catch((err) => next(err));
    });

    module.exports = favoriteRouter;