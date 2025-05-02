const { prisma } = require('../prisma/prisma-client');

const PostController = {
  createPost: async (req, res) => {
    const { content } = req.body;
    const authorId = req.user.userId;

    if (!content) {
      return res.status(400).json({ error: 'Все поля обязательны'});
    }

    try {
      const post = await prismapost.create({
        data: {
          content,
          authorId
        }
      });

      res.json(post);
    } catch (error) {
      console.error('create post error');

      res.status(500).json({ error: 'Internal server error'});
    }
  },
  getAllPosts: async (req, res) => {
    const userId = req.user.userId;

    try {
      const posts = await prisma.post.findMany({
        include: {
          likes: true,
          author: true,
          comments: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const postWithLikeInfo = posts.map(post => ({
        ...post,
        likedBy
      }))
    } catch (error) {
      console.error('get all post error', error);

      res.status(500).json({ error: 'Internal server error'});
    }
  },
  getPostById: async (req, res) => {
    res.send('getPostById');
  },
  deletePost: async (req, res) => {
    res.send('deletePost');
  }
}