module.exports = function(mongoose) {
	var CommentSchema = new mongoose.Schema({
		author: String,
		content: String
	});

	var Comment = mongoose.model("Comment", CommentSchema);

	return Comment;
};
