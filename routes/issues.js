const express = require('express');
const router = express.Router();
const Issue = require('../models/issue');
const mongoose = require('mongoose');
const User = require('../models/user');

function loadIssueFromParams(req, res, next) {
    if (mongoose.Types.ObjectId.isValid(req.params.id)){
        Issue.findById(req.params.id).exec(function(err, issue) {
            if (err) {
                return next(err);
            } else if (!issue) {
                return res.status(404).send('No issue found with ID ' + req.params.id);
            }
            req.issue = issue;
            next();
        });
    }
    else{
        return res.status(404).send('ISSUEID INVALID');
    }

}

function updateIssue(req, res, next) {

    //Vérification du status

    if(req.body.status !== undefined){
        if(req.issue.status === "new" && req.body.status === "inProgress"){
            req.issue.status= req.body.status;
        }
        else if((req.issue.status === "new" || req.issue.status === "inProgress") && req.body.status === "canceled"){
            req.issue.status= req.body.status;
        }
        else if(req.issue.status === "inProgress" && req.body.status === "completed"){
            req.issue.status= req.body.status;
        }
        else{
            const errorStatus = new Error("le passage de statut est mal réalisé");
            return next(errorStatus);
        }
    }

    //Vérification de la description

    if (req.body.description !== undefined){

        req.issue.description = req.body.description;
    }
    //Vérification de la image url

    if (req.body.imageUrl !== undefined){

        req.issue.imageUrl = req.body.imageUrl;
    }
    //Vérification de la latitude

    if (req.body.latitude !== undefined){

        req.issue.latitude = req.body.latitude;
    }
    //Vérification de la longitude

    if (req.body.longitude !== undefined){

        req.issue.longitude = req.body.longitude;
    }
    //Vérification de la description

    if (req.body.tags !== undefined){

        req.issue.tags = req.body.tags;
    }
    req.issue.updatedAt = Date.now();

    req.issue.save(function(err, updatedIssue) {
        if (err) { return next(err); }
        res.send(updatedIssue);
    });
}

function retrieveIssue(req, res, next) {
    console.log(req.issue);
    res.status(200).json(req.issue);
}

function deleteIssue(req, res, next) {

    req.issue.remove(function(err) {
        if (err) { return next(err); }
        res.sendStatus(204);
    });
}
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
function retrieveIssuesFromUser(req,res,next) {
	let query = Issue.find();
	// Filter issues by user
	if (Array.isArray(req.query.user)) {
		// Find all issues created by any of the specified users
		const users = req.query.user.filter(mongoose.Types.ObjectId.isValid);
		query = query.where('user.id').in(users);
	} else if (mongoose.Types.ObjectId.isValid(req.query.user)) {
		// Find all issues created by a specific users
		query = query.where('user.id').equals(req.query.user);
	}
	// Execute the query
  	query.exec(function(err, issuesUser) {
    if (err) {
      return next(err);
    }
    res.send(issuesUser);
  });
};


/**
 * @api {post} /users/ Add a new issue
 * @apiName CreateIssue
 * @apiGroup Issue
 *
 * @apiParam {name} issue's name
 * @apiParam {place} issue's place where it is
 * @apiParam {user.id} users' id of whom created the issue
 *
 * @apiSuccess {name} issue's name created
 * @apiParam {place} issue's place created
 * @apiParam {user.id} users' id of whom created the issue
 */
router.post('/', function(req, res, next) {
    // Create a new document from the JSON in the request body
    const newIssue = new Issue(req.body);
    // Save that document
    newIssue.save(function(err, savedIssue) {
        if (err) {
            return next(err);
        }
        // Send the saved document in the response
        res.send(savedIssue);
    });
});

/* GET issues listing.
 router.get('/', function(req, res, next) {
 res.send('respond with a resource');
 });*/

/* GET issues listing. */
/**
 * @api {get} /issues/:id Request a issue's information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 */
/*router.get('/', function(req, res, next) {
    Issue.find().sort('name').exec(function(err, issues) {
        if (err) {
            return next(err);
        }
        res.send(issues);
    });
});*/



router.patch('/:id', loadIssueFromParams, updateIssue);
router.get('/:id', loadIssueFromParams, retrieveIssue);
router.get('/',retrieveIssuesFromUser);
router.delete('/:id', loadIssueFromParams, deleteIssue);

module.exports = router;
