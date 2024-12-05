import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { gameRoomCode } = await req.json()

    const waitingRoom = await prisma.waitingRoom.findUnique({
      where: {
        waiting_room_code: gameRoomCode
      },
      select: {
        waiting_room_id: true
      }
    })

    if (!waitingRoom) {
      return NextResponse.json({ error: '대기실을 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json({ gameRoomId: waitingRoom.waiting_room_id })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

