// Requires express, mongoose, body-parser

// Initialize express
var express = require("express");
// Initialize express app
var app = express();

// Initialize mongoose
var mongoose = require("mongoose");

// Initialize port constant
const PORT = process.env.port || 8000;

// Use mongoose to connect to mogo database
mongoose.connect("mongodb://localhost");

var CommentConstructor = require("./comment.js");
var Comment = CommentConstructor(mongoose);

var CommentSchema = new mongoose.Schema({
	author: String,
	content: String
});

// Initialize post constructor and Post collection
var PostConstructor = require("./post.js");
var Post = PostConstructor(mongoose, CommentSchema);

// Initialize bodyparser
var bodyParser = require("body-parser");
// Set body parser urlencoding 
app.use(bodyParser.urlencoded({extended: false}));
// Set first layer of express stack as bodyParser
app.use(bodyParser.json());


// Set secound layer of express stack to server index on get request to "/" 
app.get("/", (req, res) => {
	// Send index.html stored in current directory 
	res.sendFile(__dirname + "/index.html");
});

// Set third layer of express stack to serve unsorted Post collection
app.get("/api/posts", (req, res) => {
	// Find all posts and responed with findings 
	Post.find({}).exec((err, posts) =>{
		// Error handling 
		if (err) {
			res.status(500);
			res.send({status: "error", message: "post not found"});
			return;
		}
		// Send posts
		res.send(posts);
	});
});

// Set fourth layer of express stack to create and add new post upon post request to /api/post
app.post("/api/post", (req, res) => {
	//todo validate input

	// Create new instance of post object with name and content supplied in the parsed request
	var newPost = new Post({
		name: req.body.name,
		content: req.body.content
	});

	// Save the instance of post
	newPost.save((err) => {
		// Error handling
		if (err) {
			res.status(500);
			res.send({status: "error", message: "posts overload"});
			return;
		}
		// Send the new post in response
		res.send(newPost);
	});
});

// Set fith layer of express stack to update Post collection upon post request to /api/post/edit
app.post('/api/post/edit', (req, res) => {
	// Find post with id matching that supplied in the request and update name and content
	Post.findOneAndUpdate(
		// Id matching id suplied in request
		{_id : req.body._id },
		{
			name: req.body.name,
			content: req.body.content
		},
		{
			new: true
		},
		(err, data) => {
			// Error handling 
			if (err) {
				res.status(500);
				res.send({status: "error", message: "post overload"});
				return;
			}
			// Send the updated post
			console.log(req.body);
			res.send(data);
		}
	);
});


app.post('/api/post/comment', (req, res) => {

	// Create new comment

	console.log("Test");

	Post.findOne({_id:req.body._id}, (err, post) => {
		post.comments.push({author:"username",content:req.body.content});
		post.save((err) => {
			console.log(post.comments);
			res.send(post);
		});
	});

	var newComment = new Comment({
		author: 'username',
		content: req.body.content
	});

	newComment.save((err) => {
		if (err) {
			res.status(500);
			res.send({status: "error", message: "comment overload"});
			return;
		}
	});
});

// Express Stack: Error Handling 

// Handle 404 error
app.use((req, res, next) => {
	res.status(404);
	res.send("File not found.");
});

// Handle 500 error
app.use((err, req, res, next) => {
	res.status(500);
	res.send("500 Error: Too much sass");
});

// Set express app to listen on defined port constant
app.listen(PORT, () => {
	console.log("Blog server Port: " + PORT);
});