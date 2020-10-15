import WebSocket from "ws";
import Logger from "@ioc:Adonis/Core/Logger";
import Event from "@ioc:Adonis/Core/Event";
import Env from "@ioc:Adonis/Core/Env";
import {getMenu, parseData} from "App/Common/HelperFunctions";
import moment from "moment";

const wss = new WebSocket.Server({ port: <any>Env.get("WS_PORT") });

wss.on('connection', function connection(ws : any) {
  Logger.info("Client connected to WebSocket.")
  ws.on('message', async function incoming(message : Buffer) {
    Logger.info(`Got message "${message}" over websocket.`)
    const data = parseData(message.toString());
    if (data.action === "menu_update_test") {
      ws.send(JSON.stringify({
        "event": "menu_update",
        "message": await getMenu(moment(), false, true)
      }));
      Logger.info("Sent menu demo request to client.")
    }
    if (data.action === "menu_update_request") {
      ws.requested_updates = data.data;
      Logger.info("Added client demands to request table.")
    }
  });
});

wss.on('close', function close() {
  Logger.info("Client disconnected from WebSocket.")
});

Event.on("new:menu", async (msg) => {
  Logger.warn("WS Dispatcher is now running.");
  wss.clients.forEach(function each(client : any) {
    if (client.readyState === WebSocket.OPEN) {
      if (client.requested_updates?.includes("latest") || client.requested_updates?.includes("all"))  {
        client.send(JSON.stringify({
          "event": "menu_update",
          "message": msg.data
        }));
        Logger.info("Sent message to one WS client.")
      }
    }
  });
  Logger.warn("WS Dispatcher has now finished.");
});

Event.on("update:menu", async (msg) => {
  Logger.warn("WS Update Dispatcher is now running.");
  wss.clients.forEach(function each(client : any) {
    if (client.readyState === WebSocket.OPEN) {
      if (client.requested_updates?.includes(msg.date.format("YYYY-WW"))) {
        client.send(JSON.stringify({
          "event": "menu_update",
          "message": msg.data
        }));
        Logger.info("Sent message to one WS client.")
      }
    }
  });
  Logger.warn("WS Update Dispatcher has now finished.");
});

Logger.info(`WebSocket server started on port ${<any> Env.get("WS_PORT")}`)
