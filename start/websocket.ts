import WebSocket from "ws";
import Logger from "@ioc:Adonis/Core/Logger";
import Event from "@ioc:Adonis/Core/Event";
import Env from "@ioc:Adonis/Core/Env";

const wss = new WebSocket.Server({ port: <any>Env.get("WS_PORT") });

wss.on('connection', function connection(ws : WebSocket) {
  Logger.info("Client connected to WebSocket.")
  ws.on('message', function incoming(message) {
    Logger.info(`Got message "${message}" over websocket.`)
  });
});

wss.on('close', function close() {
  Logger.info("Client disconnected from WebSocket.")
});

Event.on("new:menu", async (msg) => {
  Logger.warn("WS Dispatcher is now running.");
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        "event": "menu_update",
        "data": msg.data
      }));
    }
  });
  Logger.warn("WS Dispatcher has now finished.");
});

Logger.info(`WebSocket server started on port ${<any> Env.get("WS_PORT")}`)
