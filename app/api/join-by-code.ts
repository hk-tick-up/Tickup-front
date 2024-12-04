import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
        const { gameRoomCode } = req.body

        const waitingRoom = await prisma.waitingRoom.findUnique({
            where: {
            waiting_room_code: gameRoomCode
            },
            select: {
            waiting_room_id: true
            }
        })

        if (!waitingRoom) {
            return res.status(404).json({ error: '대기실을 찾을 수 없습니다.' })
        }

        res.status(200).json({ gameRoomId: waitingRoom.waiting_room_id })
        } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ error: '서버 오류가 발생했습니다.' })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

