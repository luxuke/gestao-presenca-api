const prisma = require("../lib/prisma");

const getDashboard = async (req, res) => {

  const usuarios = await prisma.user.count();

  const agendamentos = await prisma.appointment.count();

  const finalizados = await prisma.appointment.count({
    where: {
      status: "FINALIZADO"
    }
  });

  const pendentes = await prisma.appointment.count({
    where: {
      status: "PENDENTE"
    }
  });

  const filaEspera = await prisma.waitingList.count({
    where: {
      status: "AGUARDANDO"
    }
  });

const hoje = new Date();

const inicioHoje = new Date(
  hoje.getFullYear(),
  hoje.getMonth(),
  hoje.getDate()
);

const inicioSemana = new Date();

inicioSemana.setDate(
  hoje.getDate() - 7
);

const inicioMes = new Date(
  hoje.getFullYear(),
  hoje.getMonth(),
  1
);

const atendimentosHoje = await prisma.appointment.count({
  where: {
    createdAt: {
      gte: inicioHoje
    }
  }
});

const atendimentosSemana = await prisma.appointment.count({
  where: {
    createdAt: {
      gte: inicioSemana
    }
  }
});

const atendimentosMes = await prisma.appointment.count({
  where: {
    createdAt: {
      gte: inicioMes
    }
  }
});

  res.json({
    usuarios,
    agendamentos,
    finalizados,
    pendentes,
    filaEspera,
    atendimentosHoje,
atendimentosSemana,
atendimentosMes
    
  });

};

module.exports = {
  getDashboard
};