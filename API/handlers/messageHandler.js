import data from "../data.js";

export default function messageHandler(io, socket) {
	const getMessages = ({ roomId = socket.roomId, userId }) => {
		const findRoom = data.rooms.find(room => roomId === room.roomId)
		const joinUser = findRoom?.users.some(user => user === userId)
		if (joinUser) {
			return io.in(socket.roomId).to(roomId).emit('messages', findRoom?.messages)
		}

		socket.emit('messages', null)
	}

	const addMessages = ({ roomId, message }) => {
		const findRoom = data.rooms.find(room => roomId === room.roomId)
		findRoom.messages.push(message)
		getMessages({ roomId, userId: message.senderId })
	}

	socket.on('message:get', getMessages)
	socket.on('message:add', addMessages)
}