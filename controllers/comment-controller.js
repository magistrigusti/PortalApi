const { prisma } = require('../prisma/prisma-client');

const CommentController = {
  createComment: async (req, res) => {
    res.send('createComment');
  },
  deleteComment: async (req, res) => {
    res.send('deleteComment')
  }
}

module.export = CommentController