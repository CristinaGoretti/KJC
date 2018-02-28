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

function updateUser(req, res, next) {

    console.log(req.user.firstname);

    //Vérification du premier nom

    if (req.body.firstname !== undefined){

        req.user.firstname= req.body.firstname;
    }

    //Vérification du lastname

    if (req.body.lastname !== undefined){

        req.user.lastname = req.body.lastname;
    }

    //Vérification du numéro de téléphone

    if (req.body.tel !== undefined){

        req.user.tel = req.body.tel;
    }

    //Vérification de la date de naissance

    if (req.body.birthday !== undefined){

        req.user.birthday = req.body.birthday;
    }

    //Vérification du mail

    if (req.body.mail !== undefined){

        req.user.mail = req.body.mail;
    }

    //Vérification du genre

    if (req.body.gender !== undefined){

        req.user.gender = req.body.gender;
    }



    req.user.save(function(err, updatedUser) {
        if (err) { return next(err); }
        res.send(updatedUser);
    });
}

function retrieveUser(req, res, next) {
    console.log(req.user);
    res.status(200).json(req.user);
}

function deleteUser(req, res, next) {

    req.user.remove(function(err) {
        if (err) { return next(err); }
        res.sendStatus(204);
    });
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

    User.find().count(function(err, total) {

        if (err) {
            return next(err);
        }

        console.log(total);

        let query = User.find();
        // Parse the "page" param (default to 1 if invalid)
        let page = parseInt(req.query.page, 10);
        if (isNaN(page) || page < 1) {
            page = 1;
            console.log("Moins d1 page");
        }
        // Parse the "pageSize" param (default to 100 if invalid)
        let pageSize = parseInt(req.query.pageSize, 10);
        if (isNaN(pageSize) || pageSize < 0 || pageSize > 100) {
            pageSize = 15;
            console.log("plusieurs pages");
        }
        // Apply skip and limit to select the correct page of elements
        query = query.skip((page - 1) * pageSize).limit(pageSize);

        query.sort('firstname').exec(function(err, users) {
            if (err) {
                return next(err);
            }

            res.send({
                page: page,
                pageSize: pageSize,
                total: total,
                data: users
            });
        });

    });
});

router.patch('/:id', loadUserFromParams, updateUser);
router.get('/:id', loadUserFromParams, retrieveUser);
router.delete('/:id', loadUserFromParams, deleteUser);



module.exports = router;
