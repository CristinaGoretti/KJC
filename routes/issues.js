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

/* POST an issue in the database */
/**
 * @api {post} /issues/:id Post a issue's information
 * @apiName PostIssue
 * @apiGroup Issue
 *
 * @apiParam (Request body) {String{0..10000}} description The description of the issue
 * @apiParam (Request body) {String{0..500}} imageUrl The image of the issue
 * @apiParam (Request body) {Number} latitude The latitude of the issue
 * @apiParam (Request body) {Number} longitude The longitude of the issue
 * @apiParam (Request body) {String[]} tags The tags of the issue
 * @apiParam (Request body) {String="new, inProgress, canceled, completed"} status The issue's status
 * @apiParam (Request body) {Object} user The issue's user ID
 *
 * @apiSuccess (200) {String[]} tags Tags of the issue
 * @apiSuccess (200) {String} status Status of the issue
 * @apiSuccess (200) {Date} createdAt Date of the issue's creation
 * @apiSuccess (200) {Date} updatedAt Date of the issue's update
 * @apiSuccess (200) {Number} id Id of the issue
 * @apiSuccess (200) {String} description Description of the issue
 * @apiSuccess (200) {String} imageUrl Image of the issue
 * @apiSuccess (200) {Number} latitude Latitude of the issue
 * @apiSuccess (200) {Number} longitude Longitude of the issue
 * @apiSuccess (200) {Object} user Id of the user
 *
 *
 * @apiSuccessExample {json} Success
 *     [{
*    "tags": [
*       "blabla",
*       "blabla"
*    ],
*    "status": "new",
*    "createdAt": "2018-03-20T13:17:51.880Z",
*    "updatedAt": "2018-03-20T13:17:51.880Z",
*    "_id": "5ab109ff6c8e0a1ef823bf98",
*    "description": "Super description de l'issue 1",
*    "imageUrl": "http:www//jjfjdjdjd.ch",
*    "latitude": 342,
*    "longitude": 333,
*    "user": "5aa14067aaac8f820b443457",
*    "__v": 0
*
*    }]
 *
 * @apiError (400) BadRequest Fields are not valid
 * @apiError (422) Unprocessableentity Issue not valid
 *
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


/* GET issues listing. */
/**
 * @api {get} /issues Request a list of issues
 * @apiName GetIssueList
 * @apiGroup Issue
 *
 * @apiSuccess (200) {Number} id Unique identifier of the Issue
 * @apiSuccess (200) {String} description description of the issue
 * @apiSuccess (200) {String} imageUrl image of the issue
 * @apiSuccess (200) {Number} latitude latitude of the issue
 * @apiSuccess (200) {Number} longitude longitude of the issue
 * @apiSuccess (200) {String[]} tags tags of the issue
 * @apiSuccess (200) {String} status status of the issue
 * @apiSuccess (200) {Object} user user of the issue
 * @apiSuccess (200) {Date} createdAt Date of the issue's creation
 * @apiSuccess (200) {Date} updatedAt Date of the issue's update
 *
 * @apiSuccessExample {json} Success
 *    [{
 *    "tags": [
 *       "blabla",
 *       "blabla"
 *    ],
 *    "status": "new",
 *    "createdAt": "2018-03-20T13:17:51.880Z",
 *    "updatedAt": "2018-03-20T13:17:51.880Z",
 *    "_id": "5ab109ff6c8e0a1ef823bf98",
 *    "description": "Super description de l'issue 1",
 *    "imageUrl": "http:www//jjfjdjdjd.ch",
 *    "latitude": 342,
 *    "longitude": 333,
 *    "user": "5aa14067aaac8f820b443457",
 *    "__v": 0
 *
 *    }]
 *
 */

router.get('/', function(req, res, next) {

    Issue.find().count(function(err, total) {

        if (err) {
            return next(err);
        }

        console.log(total);

        let query = Issue.find();
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
 * @api {patch} /issues/:id Modify an Issue
 * @apiName PatchIssue
 * @apiGroup Issue
 *
 * @apiParam {Number} id Unique identifier of the Issue
 *
 * @apiSuccess (200) {Number} id Unique identifier of the Issue
 * @apiSuccess (200) {String} description description of the issue
 * @apiSuccess (200) {String} imageUrl image of the issue
 * @apiSuccess (200) {Number} latitude latitude of the issue
 * @apiSuccess (200) {Number} longitude longitude of the issue
 * @apiSuccess (200) {String[]} tags tags of the issue
 * @apiSuccess (200) {String} status status of the issue
 * @apiSuccess (200) {Object} user user of the issue
 * @apiSuccess (200) {Date} createdAt Date of the issue's creation
 * @apiSuccess (200) {Date} updatedAt Date of the issue's update
 *
 * @apiSuccessExample {json} Success
 *    [{
 *    "tags": [
 *       "blabla",
 *       "blabla"
 *    ],
 *    "status": "new",
 *    "createdAt": "2018-03-20T13:17:51.880Z",
 *    "updatedAt": "2018-03-20T13:17:51.880Z",
 *    "_id": "5ab109ff6c8e0a1ef823bf98",
 *    "description": "Super description de l'issue 1",
 *    "imageUrl": "http:www//jjfjdjdjd.ch",
 *    "latitude": 342,
 *    "longitude": 333,
 *    "user": "5aa14067aaac8f820b443457",
 *    "__v": 0
 *
 *    }]
 *
 * @apiError (404) notFound Issue not found
 * @apiError (422) Unprocessableentity Issue not valid
 *
 */

router.patch('/:id', loadIssueFromParams, updateIssue);

/**
 * @api {get} /issues/:id Get a issue's information
 * @apiName GetIssue
 * @apiGroup Issue
 *
 * @apiParam {Number} id Unique identifier of the issue
 *
 * @apiSuccess (200) {Number} id Unique identifier of the Issue
 * @apiSuccess (200) {String} description description of the issue
 * @apiSuccess (200) {String} imageUrl image of the issue
 * @apiSuccess (200) {Number} latitude latitude of the issue
 * @apiSuccess (200) {Number} longitude longitude of the issue
 * @apiSuccess (200) {String[]} tags tags of the issue
 * @apiSuccess (200) {String} status status of the issue
 * @apiSuccess (200) {Object} user user of the issue
 * @apiSuccess (200) {Date} createdAt Date of the issue's creation
 * @apiSuccess (200) {Date} updatedAt Date of the issue's update
 *
 * @apiSuccessExample {json} Success
 *    [{
 *    "tags": [
 *       "blabla",
 *       "blabla"
 *    ],
 *    "status": "new",
 *    "createdAt": "2018-03-20T13:17:51.880Z",
 *    "updatedAt": "2018-03-20T13:17:51.880Z",
 *    "_id": "5ab109ff6c8e0a1ef823bf98",
 *    "description": "Super description de l'issue 1",
 *    "imageUrl": "http:www//jjfjdjdjd.ch",
 *    "latitude": 342,
 *    "longitude": 333,
 *    "user": "5aa14067aaac8f820b443457",
 *    "__v": 0
 *
 *    }]
 *
 * @apiError (404) notFound Issue not found
 * @apiError (422) Unprocessableentity Issue not valid
 */

router.get('/:id', loadIssueFromParams, retrieveIssue);

/**
 * @api {get} /issues/:id Retrieve Issues from an User
 * @apiName RetrieveIssuesFromUsers
 * @apiGroup Issue
 *
 * @apiParam {Number} id Unique identifier of the issue
 * @apiParam {ObjectID} [userId] The ID of the user who create the issue to retrieve
 *
 * @apiSuccess (200) {Number} id Unique identifier of the Issue
 * @apiSuccess (200) {String} description description of the issue
 * @apiSuccess (200) {String} imageUrl image of the issue
 * @apiSuccess (200) {Number} latitude latitude of the issue
 * @apiSuccess (200) {Number} longitude longitude of the issue
 * @apiSuccess (200) {String[]} tags tags of the issue
 * @apiSuccess (200) {String} status status of the issue
 * @apiSuccess (200) {Object} user user of the issue
 * @apiSuccess (200) {Date} createdAt Date of the issue's creation
 * @apiSuccess (200) {Date} updatedAt Date of the issue's update
 *
 * @apiSuccessExample {json} Success
 *    [{
 *    "tags": [
 *       "blabla",
 *       "blabla"
 *    ],
 *    "status": "new",
 *    "createdAt": "2018-03-20T13:17:51.880Z",
 *    "updatedAt": "2018-03-20T13:17:51.880Z",
 *    "_id": "5ab109ff6c8e0a1ef823bf98",
 *    "description": "Super description de l'issue 1",
 *    "imageUrl": "http:www//jjfjdjdjd.ch",
 *    "latitude": 342,
 *    "longitude": 333,
 *    "user": "5aa14067aaac8f820b443457",
 *    "__v": 0
 *
 *    }]
 *
 * @apiError (404) notFound Issue not found
 * @apiError (422) Unprocessableentity Issue not valid
 *
 */


router.get('/',retrieveIssuesFromUser);

/**
 * @api {delete} /issues/:id Delete an Issue
 * @apiName DeleteIssue
 * @apiGroup Issue
 *
 * @apiParam {Number} id Unique identifier of the issue
 *
 * @apiSuccess (204) NoContent Issue deleted
 *
 * @apiError (404) notFound Issue not found
 * @apiError (422) Unprocessableentity Issue not valid
 */

router.delete('/:id', loadIssueFromParams, deleteIssue);

module.exports = router;
