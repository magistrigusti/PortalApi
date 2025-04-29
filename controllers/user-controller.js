// controllers/user-controller.js
const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcyptjs');

const UserController = {
  register: async (req, res) => {
    const {email, password, name} = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({error: 'All fields are required'});
    }

    try {

    } catch (error) {
      const existingUser = await prisma.user.findUnique(({ where: { email }}));

      if (existingUser) {
        return res.status(400).json({error: 'User already exists'});
      }

      const 
    }
  },
  login: async (req, res) => {
    res.send('login')
  },
  currentUser: async (req, res) => {
    res.send('current')
  },
  getUserById: async (req, res) => {
    res.send('getUserById')
  },
  updateUser: async (req, res) => {
    res.send('updateUser')
  },
  
}

module.exports = UserController;