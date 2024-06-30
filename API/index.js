import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import roomHandler from "./handlers/roomHandler.js";
import userHandler from "./handlers/userHandler.js";
import messageHandler from "./handlers/messageHandler.js";

const PORT = 3000
const app = express()
const server = createServer(app)
const io = new Server(server, {
	cors: {
		origin: '*'
	}
})

app.use(cors())

const onConnection = (socket) => {
	const { roomId } = socket.handshake.query
	socket.roomId = roomId
	socket.join(roomId)
	roomHandler(io, socket)
	userHandler(io, socket)
	messageHandler(io, socket)
}

io.on('connection', onConnection)

server.listen(PORT, err => {
	if (err) {
		return console.log('ОШИБКА ПРИ ЗАПУСКЕ СЕРВЕРА')
	}

	console.log('СЕРВЕР ЗАПУЩЕН НА ПОРТУ ', PORT)
})