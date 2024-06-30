import data from "../data.js";

export default function roomHandler(io, socket) {
	const getRooms = () => {
		io.emit('rooms', data.rooms)
	}

	const addRoom = (roomParam) => {
		const room = {
			...roomParam,
			users: [],
			messages: []
		}
		data.rooms.push(room)
		getRooms()
	}

	const removeRoom = ({ roomId }) => {
		const findRoom = data.rooms.find(room => room.roomId === roomId)
		data.rooms = data.rooms.filter(room => room !== findRoom)
		io.to(roomId).emit('messages', findRoom.messages = null)
		getRooms()
	}

	socket.on('room:get', getRooms)
	socket.on('room:add', addRoom)
	socket.on('room:remove', removeRoom)
}