const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const expressWs = require('express-ws');
const app = express();
expressWs(app);

app.use(express.json());
app.use(cors());

const port = 8000;

const connections = {};
const messages = [];
app.ws('/chat', function (ws, req) {
  const id = nanoid();
  connections[id] = ws;
  ws.send(JSON.stringify(messages));

  ws.on('message', msg => {
    const parsed = JSON.parse(msg);
    messages.push(parsed);
    Object.keys(connections).forEach(connId => {
      const connection = connections[connId];
      connection.send(JSON.stringify(messages));
    })
  });

  ws.on('close', msg => {
    delete connections[id];
  });
});

app.listen(port, () => {
  console.log(`Server started on ${port} port!`);
});

