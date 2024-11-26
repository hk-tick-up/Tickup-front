// import { GameRoom, CreateRoomRequest } from '../types/game'

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1/waiting-room'

// export async function createPrivateRoom(request: CreateRoomRequest): Promise<GameRoom> {
//     const response = await fetch(`${API_BASE_URL}/create`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(request),
//     })
//     if (!response.ok) {
//         throw new Error('Failed to create private room')
//     }
//     return response.json()
// }

// export async function joinRandomRoom(gameType: string): Promise<GameRoom> { 
//     const response = await fetch(`${API_BASE_URL}/random-join?gameType=${gameType}`, {
//         method: 'POST',
//     })
//     if (!response.ok) {
//         throw new Error('Failed to join random room')
//     }
//     return response.json()
// }

// export async function getRoomInfo(roomId: string): Promise<GameRoom> {
//     const response = await fetch(`${API_BASE_URL}/${roomId}`)
//     if (!response.ok) {
//         throw new Error('Failed to get room info')
//     }
//     return response.json()
// }

