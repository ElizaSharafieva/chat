import data from "../data.js"

export default function userHandler(io, socket) {
	const getUsers = (roomId = socket.roomId) => {
		const findRoom = data.rooms.find(room => room.roomId === roomId)
		io.in(socket.roomId).to(roomId).emit('users', findRoom?.users)
	}

	const addUsers = ({ roomId, userId }) => {
		const findRoom = data.rooms.find(room => room.roomId === roomId)
		const user = findRoom.users.some(user => user === userId)
		if (!user) {
			findRoom.users.push(userId)
		}
		io.emit('rooms', data.rooms)
		getUsers(roomId)
	}

	socket.on('user:get', getUsers)
	socket.on('user:add', addUsers)
}