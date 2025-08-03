const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

const { state, saveState } = useSingleFileAuthState("./auth.json");

const sock = makeWASocket({ auth: state });
sock.ev.on("creds.update", saveState);

app.post("/mensagem", async (req, res) => {
  const { telefone, mensagem, token } = req.body;

  if (token !== "GAwZJ87PwsYF9jK12qP4FekrA6G4wacC") {
    return res.status(403).send("Token inválido");
  }

  try {
    await sock.sendMessage(telefone + "@s.whatsapp.net", { text: mensagem });
    res.send({ status: "Mensagem enviada com sucesso!" });
  } catch (e) {
    res.status(500).send("Erro ao enviar mensagem");
  }
});

app.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000");
});
