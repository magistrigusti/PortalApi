// controllers/user-controller.js
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require('fs');
const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma/prisma-client");
const Jdenticon = require('jdenticon');

const UserController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({error: 'All fields are required'});
    }

    try {
      // Проверяем, существует ли пользователь с таким emai
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Пользователь уже существует" });
      }

      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);

      // Генерируем аватар для нового пользователя
      const png = Jdenticon.toPng(`${name}${Date.now()}`, 200);
      const avatarName = `${name}_${Date.now()}.png`;
      const avatarPath = path.join(__dirname, '/../uploads', avatarName);
      fs.writeFileSync(avatarPath, png);
  
      // Создаем пользователя
      const user = await prisma.user.create({
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
      res.status(500).json({ error: "Internal server error" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Все поля обязательны" });
    }

    try {
      // Find the user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Неверный логин или пароль" });
      }

      // Check the password
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json({ error: "Неверный логин или пароль" });
      }

      // Generate a JWT
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);

      res.json({ token });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getUserById: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.UserId;

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          followers: true,
          following: true,
        },
      });

      if (!user) {
        return res.status(404).json({error: 'Пользователь не найден'});
      }

      const isFollowing = await prisma.follows.findFirst({
        where: {
          AND: [
            { followerId: userId },
            { followingId: id }
          ]
        }
      });

      res.json({...user, isFollowing: Boolean(isFollowing)})
    } catch (error) {
      console.error('Get Current Error', error);

      res.status(500).json({ error: "Internal server error"});
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { email, name, dateOfBirth, bio, location } = req.body;

    let filePath;

    if (req.file && req.file.path) {
      filePath = req.file.path;
    }

    if (id !== req.user.userId) {
      return res.status(403).json({ error: 'Нет доступа'});
    }

    try {
      if (email) {
        const existingUser = await prisma.user.findFirst({
          where: { email: email }
        });

        if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ error: "Почта уже используеться"});
        }
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          email: email || undefined,
          name: name || undefined,
          avatarUrl: filePath ? `/${filePath}` : undefined,
          dateOfBirth: dateOfBirth || undefined,
          bio: bio || undefined,
          location: location || undefined
        }
      });

      res.json(user);
    } catch (error) {
      console.log('Update user error', error);
      res.status(500).json({ error: 'Internal server error'})
    }

  },
  current: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.userId 
        },
        include: {
          followers: {
            include: {
              follower: true
            }
          },
          following: {
            include: {
              following: true
            }
          }
        }
      });

      if (!user) {
        return res.status(400).json({ error: "Не удалось найти пользователя"});
      }
      
      res.json(user)
    } catch ( error ) {
      console.error('Get Current Error', error);

      res.status(500).json({ error: "Internal server error"});
    }
  },
  
}

module.exports = UserController;