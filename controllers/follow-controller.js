const { prisma } = require('../prisma/prisma-client');

const FollowController = {
  followUser: async (req, res) => {
    res.send('followUser');
  },
  unfollowUser: async (req, res) => {
    res.send('unfollowUser');
  }
}

module.exports = FollowController;