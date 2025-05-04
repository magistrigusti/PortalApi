// 📁 controllers/follow-controller.js
const { prisma } = require('../prisma/prisma-client');

const FollowController = {
  followUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.userId;

    if (!followingId) {
      return res.status(400).json({error: 'Не передан ID пользователя для подписки'});
    }

    if (followingId === userId) {
      return res.status(400).json({error: 'Вы не можете подписаться на себя самого'});
    }

    try {
      const existingSubscription = await prisma.follows.findFirst({
        where: {
          AND: [
            { followerId: userId},
            { followingId }
          ]
        },
      });

      if (existingSubscription) {
        return res.status(400).json({error: 'Подписка уже существует'});
      }

      await prisma.follows.create({
        data: {
          follower: { connect: { id: userId }},
          following: { connect: { id: followingId }},
        },
      });

      res.status(201).json({message: 'Вы успешно подписались'});
    } catch (error) {
      console.error('Follow error', error);
      returnres.status(500).json({error: 'Internal server error'});
    }
  },
  unfollowUser: async (req, res) => {
    const userId = req.user.userId;
    const { id: followingId } = req.params;

    try{
      const follow = await prisma.follows.findFirst({
        where: {
          followerId: userId,
          followingId,
        },
      });

      if (!follow) {
        return res.status(404).json({error: 'Подписка не найдена'});
      }

      await prisma.follows.delete({
        where: {id: follow.id},
      });

      res.status(200).json({message: 'Вы отписались от пользователя'});
    } catch (error) {
      console.error('Unfollow error', error);
      return res.status(500).json({error: 'Internal server error'});
    }
  },
};

module.exports = FollowController;