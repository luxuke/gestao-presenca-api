const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const waitingListRoutes = require("./routes/waitingListRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/waiting-list", waitingListRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("API Gestão Inteligente funcionando!");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});