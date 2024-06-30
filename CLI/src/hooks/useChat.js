import React from "react";
import { io } from 'socket.io-client';
import { nanoid } from 'nanoid'
import { useNavigate } from 'react-router-dom';

const SERVER_URL = 'http://localhost:3000'

export default function useChat(roomId) {
	const socketRef = React.useRef(null)
	const userId = localStorage.getItem('userId')
	const [data, setData] = React.useState([])
	const [messages, setMessages] = React.useState([])
	const [users, setUsers] = React.useState([])
	const navigate = useNavigate()

	React.useEffect(() => {
		socketRef.current = io(SERVER_URL, roomId ? { query: { roomId } } : null)

		socketRef.current.emit('room:get')
		socketRef.current.on('rooms', data => setData(data))

		socketRef.current.emit('message:get', { userId })
		socketRef.current.on('messages', data => setMessages(data))

		socketRef.current.emit('user:get')
		socketRef.current.on('users', data => setUsers(data))
	}, [])

	const createRoom = (room) => {
		const roomId = nanoid()
		socketRef.current.emit('room:add', { roomId, room, creator: userId })
		socketRef.current.emit('user:add', { roomId, userId })
		navigate(`/chat/${roomId}`)
	}

	const joinRoom = (roomId) => {
		socketRef.current.emit('user:add', { roomId, userId })
		navigate(`/chat/${roomId}`)
	}

	const addMessage = (message) => {
		socketRef.current.emit('message:add', { message, roomId })
	}

	const removeRoom = () => {
		socketRef.current.emit('room:remove', { roomId, userId })
		setMessages(null)
	}

	return { socketRef, data, messages, users, createRoom, joinRoom, addMessage, removeRoom }

};