const { prisma } = require("../prisma/prisma-client");

const LikeController = {
  likePost: async (req, res) => {
    res.send('likePost');
  },
  unlikePost: async (req, res) => {
    res.send('unlikePost');
  }
};

module.exports = LikeController;
