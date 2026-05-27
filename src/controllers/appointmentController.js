const prisma = require("../lib/prisma");

const getAppointments = async (req, res) => {

  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 5;

  const {
  status,
  prioridade,
  order,
  search
} = req.query;

  const skip = (page - 1) * limit;

  const appointments = await prisma.appointment.findMany({
    skip,
    take: limit,

    where: {
  ...(status && { status }),

  ...(prioridade && { prioridade }),

  ...(search && {
    OR: [
      {
        titulo: {
          contains: search
        }
      },
      {
        descricao: {
          contains: search
        }
      }
    ]
  })
},

    include: {
      user: true
    },
    orderBy: {
  createdAt: order === "asc" ? "asc" : "desc"
}
    
  });

  const total = await prisma.appointment.count({
    where: {
  ...(status && { status }),

  ...(prioridade && { prioridade }),

  ...(search && {
    OR: [
      {
        titulo: {
          contains: search
        }
      },
      {
        descricao: {
          contains: search
        }
      }
    ]
  })
}
  });

  res.json({
    page,
    limit,
    total,
    data: appointments
  });

};

const createAppointment = async (req, res) => {

  try {

    const {
      titulo,
      descricao,
      data,
      prioridade,
      userId
    } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        titulo,
        descricao,
        data: new Date(data),
        prioridade,
        userId
      }
    });

    await prisma.auditLog.create({
  data: {
    acao: "CRIAR_ATENDIMENTO",
    descricao: `Atendimento ${titulo} criado`
  }
});
    res.status(201).json({
      success: true,
      message: "Atendimento criado com sucesso",
      data: appointment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;

  const { status } = req.body;

  const appointment = await prisma.appointment.update({
    where: {
      id: Number(id)
    },
    data: {
      status
    }
  });

  // Se cancelar atendimento
  if (status === "CANCELADO") {

    // Busca próxima pessoa da fila
    const nextWaiting = await prisma.waitingList.findFirst({
      where: {
        status: "AGUARDANDO"
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    // Atualiza status da fila
    if (nextWaiting) {
      await prisma.waitingList.update({
        where: {
          id: nextWaiting.id
        },
        data: {
          status: "CHAMADO"
        }
      });
    }
  }

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
  res.json(appointment);
};


module.exports = {
  getAppointments,
  createAppointment,
  updateAppointmentStatus
};