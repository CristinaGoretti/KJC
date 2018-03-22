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

        return res.status(422).send('USERID INVALID');
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

    //Vérification du rôle

    if (req.body.role !== undefined){

        req.user.role = req.body.role;
    }

    //Vérification de la date de création

    if (req.body.createdAt !== undefined){

        req.user.createdAt = req.body.createdAt;
    }

    req.user.save(function(err, updatedUser) {
        if (err) {
            //console.log(err);

           /*if (err.name = "ValidatorError") {
                res.status(204).send("blablabla");
           }*/

           return next(err);
        }

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

/* POST user in the database */
/**
 * @api {post} /users Post a user's information
 * @apiName PostUser
 * @apiGroup User
 *
 * @apiParam (Request body) {String{2..20}} firstname The firstname of the user
 * @apiParam (Request body) {String{2..20}} lastname The lastname of the user
 * @apiParam (Request body) {String="citizen,manager"} role The user's role
 *
 * @apiSuccess (200) {Number} id Unique identifier of the user
 * @apiSuccess (200) {String} firstName First name of the user
 * @apiSuccess (200) {String} lastName  Last name of the user
 * @apiSuccess (200) {String} role Role of the user
 * @apiSuccess (200) {Date} createdAt Date of the user's creation
 *
 *
 * @apiSuccessExample {json} Success
 *    [{
 *      "firstname": "Ruby",
 *      "lastname": "Black",
 *      "role": "manager",
 *      "created_at": "2018-03-08T09:52:26.166Z",
 *      "_id": "5aa107da12bf93588981a2ce"
 *      "__v": 0
 * }]
 *
 * @apiError (400) BadRequest Firstname is not valid
 * @apiError (400) BadRequest Lastname is not valid
 * @apiError (400) BadRequest Role is not valid
 * @apiError (422) Unprocessableentity User not valid
 *
 */

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
        res.status(200).send(savedUser);
    });
});


/* GET users listing. */
/**
 * @api {get} /users Request a list of users
 * @apiName GetUserList
 * @apiGroup User
 *
 * @apiSuccess {Number} id Unique identifier of the user
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 * @apiSuccess {String} role Role of the user
 * @apiSuccess {Date} createdAt Date of the user's creation
 *
 * @apiSuccessExample {json} Success
 *    [{
 *      "firstname": "Ruby",
 *      "lastname": "Black",
 *      "role": "manager",
 *      "created_at": "2018-03-08T09:52:26.166Z",
 *      "_id": "5aa107da12bf93588981a2ce"
 *      "__v": 0
 *    }]
 *
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

/**
 * @api {patch} /users/:id Modify a User
 * @apiName PatchUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess {Number} id Unique identifier of the user
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 * @apiSuccess {String} role Role of the user
 * @apiSuccess {Date} createdAt Date of the user's creation
 *
 * @apiSuccessExample {json} Success
 *    [{
 *      "firstname": "Ruby",
 *      "lastname": "Black",
 *      "role": "manager",
 *      "created_at": "2018-03-08T09:52:26.166Z",
 *      "_id": "5aa107da12bf93588981a2ce"
 *      "__v": 0
 *    }]
 *
 * @apiError (404) notFound User not found
 * @apiError (422) Unprocessableentity User not valid
 *
 */

router.patch('/:id', loadUserFromParams, updateUser);

/**
 * @api {get} /users/:id Get a user's information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess {Number} id Unique identifier of the user
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 * @apiSuccess {String} role Role of the user
 * @apiSuccess {Date} createdAt Date of the user's creation
 *
 * @apiSuccessExample {json} Success
 *    [{
 *      "firstname": "Ruby",
 *      "lastname": "Black",
 *      "role": "manager",
 *      "created_at": "2018-03-08T09:52:26.166Z",
 *      "_id": "5aa107da12bf93588981a2ce"
 *      "__v": 0
 *    }]
 *
 * @apiError (404) notFound User not found
 * @apiError (422) Unprocessableentity User not valid
 */

router.get('/:id', loadUserFromParams, retrieveUser);

/**
 * @api {delete} /users/:id Delete a User
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess (204) NoContent User deleted
 *
 * @apiError (404) notFound User not found
 * @apiError (422) Unprocessableentity User not valid
 */

router.delete('/:id', loadUserFromParams, deleteUser);



module.exports = router;
