const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require('fs');
const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma/prisma-client");
const Jdenticon = require('jdenticon');

const UserController = {
  reqister: async (req, res) => {
    const {email, password, name} = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({error: 'All fields are required'});
    }

    try {
      const existingUser = awaitprisma.user.findUnique({ where: { email }});
      if (existingUser) {
        return res.status(400).json({error: ""});
      }

      const hashedPassword = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          avatarUrl: `/uploads/${avatarName}`,
        },
      });

      res.json(user);
    } catch (error) {
      console.error("Error in register:", error);
      res.status(500).json({error: "Internal server error"});
    }
  }
}