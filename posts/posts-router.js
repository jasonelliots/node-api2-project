const express = require("express");

const Posts = require("../data/db.js"); 

const router = express.Router(); 

// When the client makes a POST request to /api/posts:

// If the request body is missing the title or contents property:

    // cancel the request.
    // respond with HTTP status code 400 (Bad Request).
    // return the following JSON response: { errorMessage: "Please provide title and contents for the post." }.
// If the information about the post is valid:

    // save the new post the the database.
    // return HTTP status code 201 (Created).
    // return the newly created post.
// If there's an error while saving the post:

    // cancel the request.
    // respond with HTTP status code 500 (Server Error).
    // return the following JSON object: { error: "There was an error while saving the post to the database" }.

router.post("/", (req, res) =>{
    Posts.insert(req.body)
    .then(post => {
        if(req.body.title && req.body.contents){
            res.status(201).json({post})
        } else {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
        }   
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: "There was an error while saving the post to the database"})
    })
})

// When the client makes a POST request to /api/posts/:id/comments:

// If the post with the specified id is not found:

    // return HTTP status code 404 (Not Found).
    // return the following JSON object: { message: "The post with the specified ID does not exist." }.

// If the request body is missing the text property:

    // cancel the request.
    // respond with HTTP status code 400 (Bad Request).
    // return the following JSON response: { errorMessage: "Please provide text for the comment." }.

// If the information about the comment is valid:

    // save the new comment the the database.
    // return HTTP status code 201 (Created).
    // return the newly created comment.

// If there's an error while saving the comment:

    // cancel the request.
    // respond with HTTP status code 500 (Server Error).
    // return the following JSON object: { error: "There was an error while saving the comment to the database" }.

router.post("/:id/comments", (req, res) => {
    const id = req.params.id; 

    if(!req.body.text){
        res.status(400).json({errorMessage: "Please provide text for the comment."})
    }

    Posts.insertComment(req.body)
    .then(comment => {
        res.status(201).json({comment}); 
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "There was an error while saving the comment to the database" })
    })
})


// When the client makes a GET request to /api/posts:

// If there's an error in retrieving the posts from the database:
    // cancel the request.
    // respond with HTTP status code 500.
    // return the following JSON object: { error: "The posts information could not be retrieved." }.

router.get("/", (req, res) => {
    Posts.find(req.body)
    .then(posts => {
        res.status(200).json({data: posts})
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: "The posts information could not be retrieved."})
    })
})

// When the client makes a GET request to /api/posts/:id:

// If the post with the specified id is not found:

    // return HTTP status code 404 (Not Found).
    // return the following JSON object: { message: "The post with the specified ID does not exist." }.

// If there's an error in retrieving the post from the database:

    // cancel the request.
    // respond with HTTP status code 500.
    // return the following JSON object: { error: "The post information could not be retrieved." }.

router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        console.log(post); 
        if(post.length > 0){ 
            res.status(200).json({post})
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    })
    .catch(error => { // does this automatically cancel the request? 
        console.log(error);
        res.status(500).json({error:"The post information could not be retrieved."})
    })
})

// When the client makes a GET request to /api/posts/:id/comments:

// If the post with the specified id is not found:

    // return HTTP status code 404 (Not Found).
    // return the following JSON object: { message: "The post with the specified ID does not exist." }.

// If there's an error in retrieving the comments from the database:

    // cancel the request.
    // respond with HTTP status code 500.
    // return the following JSON object: { error: "The comments information could not be retrieved." }.

router.get("/:id/comments", (req, res) => {

    const id = req.params.id; 


    Posts.findPostComments(id) 
    .then(comments => {
        if(comments > 0){
            res.status(200).json({comments})
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist."})
            // why cant I hit this? 
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "The comments information could not be retrieved." })
    })

})

// When the client makes a DELETE request to /api/posts/:id:

// If the post with the specified id is not found:

    // return HTTP status code 404 (Not Found).
    // return the following JSON object: { message: "The post with the specified ID does not exist." }.
// If there's an error in removing the post from the database:

    // cancel the request.
    // respond with HTTP status code 500.
    // return the following JSON object: { error: "The post could not be removed" }.

router.delete("/:id", (req, res) => {

    Posts.remove(req.params.id) 
    .then(post => {
        if(post > 0){
            res.status(200).json({ message: "The post has been removed", data: post})
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist."})
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "The post could not be removed" })
    })
})


// When the client makes a PUT request to /api/posts/:id:

// If the post with the specified id is not found:

    // return HTTP status code 404 (Not Found).
    // return the following JSON object: { message: "The post with the specified ID does not exist." }.

// If the request body is missing the title or contents property:

    // cancel the request.
    // respond with HTTP status code 400 (Bad Request).
    // return the following JSON response: { errorMessage: "Please provide title and contents for the post." }.

// If there's an error when updating the post:

    // cancel the request.
    // respond with HTTP status code 500.
    // return the following JSON object: { error: "The post information could not be modified." }.

// If the post is found and the new information is valid:

    // update the post document in the database using the new information sent in the request body.
    // return HTTP status code 200 (OK).
    // return the newly updated post.


router.put("/:id", (req, res) => {
    const changes = req.body; 
    
    Posts.update(req.params.id, changes)
    .then(post => {
        if(post){
            if(req.body.title && req.body.contents){
                res.status(200).json({post})
            } else {
                res.status(400).json({errorMessage: "Please provide title and contents for the post."})
            }
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    })
    .catch(error => {
        res.status(500).json({ error: "The post information could not be modified."})
    })
})

module.exports = router // this is same as export default router 