const {default: mongoose} = require("mongoose");
const UserModel = require("../models/userModel");
const {setNotifications} = require("./notificationController");

const addUser = async (req, res) => {
	try {
		const filename = req.file.filename;
		const {fname, lname, profession, age, userId} = req.body;
		const result = await UserModel.create({
			userId,
			profileImg: filename,
			fname,
			lname,
			profession,
			age,
		});
		if (result) return res.json("Success");
	} catch (err) {
		console.log(err);
	}
};

const getSingleUser = async (req, res) => {
	try {
		const id = req.params.id;
		const user = await UserModel.findOne({userId: id});
		if (user) return res.json(user);
	} catch (err) {
		console.log(err);
	}
};

const followUser = async (req, res) => {
	try {
		const {authorId, userId} = req.body;
		const result = await UserModel.findOne({userId: authorId});
		result.followers.push(userId);
		result.save();
		//postId, userId, method
		// setNotifications(authorId, userId, "follow");
		res.json(result);
	} catch (err) {
		console.log(err);
	}
};

const unFollowUser = async (req, res) => {
	try {
		const {authorId, userId} = req.body;
		const result = await UserModel.findOneAndUpdate(
			{userId: authorId},
			{$pull: {followers: userId}}
		);
		result.save();
		res.json(result);
	} catch (err) {
		console.log(err);
	}
};

const updateUserAccount = async (req, res) => {
	try {
		const file = req.file;
		const {fname, lname, age, profession} = req.body;
		if (file) {
			await UserModel.findOneAndUpdate(
				{userId: req.body.userId},
				{profileImg: file.filename}
			);
		}
		const db = await UserModel.findOneAndUpdate(
			{userId: req.body.userId},
			{fname, lname, age, profession}
		);
		return res.json("Prfile updated");
	} catch (err) {
		console.log(err);
	}
};

const getAllFollowers = async (req, res) => {
	try {
		const id = req.params.id;
		const followers = await UserModel.aggregate([
			{
				$match: {
					userId: id,
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "followers",
					foreignField: "userId",
					as: "followersData",
				},
			},
		]);
		if (!followers)
			return res.json({error: "Something went wrong"}).status(400);
		return res.json(followers);
	} catch (err) {
		console.log(err);
	}
};

module.exports = {
	addUser,
	getSingleUser,
	followUser,
	unFollowUser,
	updateUserAccount,
	getAllFollowers,
};
