const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

function loadUserFromParams(req, res, next) {
    if (mongoose.Types.ObjectId.isValid(req.params.id)){
        User.findById(req.params.id).exec(function(err, user) {
            if (err) {
                return next(err);
            } else if (!user) {
                return res.status(404).send('No person found with ID ' + req.params.id);
            }
            req.user = user;
            next();
        });
    }
    else{
        return res.status(404).send('USERID INVALID');
    }

}

function UpdateUser(req, res, next) {

    req.user.firstname = req.body.firstname;
    req.user.lastname = req.body.lastname;
    
    req.user.save(function(err, updatedUser) {
        if (err) { return next(err); }
        res.send(updatedUser);
    });
}

function RetrieveUser(req, res, next) {
    console.log(req.user);
    res.status(200).json(req.user);
}

/* POST new user */
router.post('/', function(req, res, next) {
    // Create a new document from the JSON in the request body
    const newUser = new User(req.body);
    // Save that document
    newUser.save(function(err, savedUser) {
        if (err) {
            return next(err);
        }
        // Send the saved document in the response
        res.send(savedUser);
    });
});

/* GET users listing.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

/* GET users listing. */
/**
 * @api {get} /users/:id Request a user's information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 */
router.get('/', function(req, res, next) {
    User.find().sort('firstname').exec(function(err, users) {
        if (err) {
            return next(err);
        }
        res.send(users);
    });
});

router.patch('/:id', loadUserFromParams, UpdateUser);
router.get('/:id', loadUserFromParams, RetrieveUser);

module.exports = router;
