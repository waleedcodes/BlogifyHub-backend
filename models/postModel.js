const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	postImage: {
		type: String,
	},
	postTitle: {
		type: String,
		required: true,
	},
	postTags: [String],
	postDescription: {
		type: String,
		required: true,
	},
});

const PostModel = mongoose.model("post", postSchema);

module.exports = PostModel;
