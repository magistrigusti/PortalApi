// controllers/index.js
const UserController = require('./user-controller');
const PostController = requie('./post-controller');
const CommentController = require('./comment-controller');

module.exports = { UserController, PostController, CommentController }