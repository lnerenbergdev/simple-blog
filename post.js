module.exports = function(mongoose, Comment) {

	var PostSchema = new mongoose.Schema({
		name: String,
		content: String,
		votes: Number,
		// _id: ObjectId
		comments: [Comment] // subdocument
	});

	var Post = mongoose.model("Post", PostSchema);

	return Post;
};