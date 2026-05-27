const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();

  res.json(users);
};

const createUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  const senhaHash = await bcrypt.hash(senha, 10);

  const user = await prisma.user.create({
    data: {
      nome,
      email,
      senha: senhaHash
    }
  });

  res.status(201).json(user);
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    return res.status(404).json({
      error: "Usuário não encontrado"
    });
  }

  const senhaValida = await bcrypt.compare(senha, user.senha);

  if (!senhaValida) {
    return res.status(401).json({
      error: "Senha inválida"
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  res.json({
    message: "Login realizado com sucesso",
    token
  });
};

const getProfile = async (req, res) => {

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id
    },
    select: {
      id: true,
      nome: true,
      email: true,
      createdAt: true
    }
  });

  res.json(user);
};

module.exports = {
  getUsers,
  createUser,
  login,
  getProfile
};