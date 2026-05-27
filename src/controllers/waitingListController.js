const prisma = require("../lib/prisma");

const getWaitingList = async (req, res) => {
  const waitingList = await prisma.waitingList.findMany();

  res.json(waitingList);
};

const createWaiting = async (req, res) => {
  const { nome, prioridade } = req.body;

  const waiting = await prisma.waitingList.create({
    data: {
      nome,
      prioridade
    }
  });

  res.status(201).json(waiting);
};

module.exports = {
  getWaitingList,
  createWaiting
};