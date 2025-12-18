import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, password } = body

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Username/email and password are required' },
        { status: 400 }
      )
    }

    // Find participant by email or displayName
    const participant = await prisma.participant.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { displayName: identifier },
        ],
        passwordHash: { not: null },
      },
      include: {
        team: true,
      },
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Invalid username/email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, participant.passwordHash!)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid username/email or password' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      participant: {
        id: participant.id,
        displayName: participant.displayName,
        email: participant.email,
        isOrganizer: participant.isOrganizer,
      },
      team: {
        id: participant.team.id,
        name: participant.team.name,
        token: participant.team.token,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

