import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, displayName, email, password } = body

    if (!token || !displayName) {
      return NextResponse.json(
        { error: 'Token and display name are required' },
        { status: 400 }
      )
    }

    // Require email and password for login capability
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required to join' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const team = await prisma.team.findUnique({
      where: { token },
      include: { participants: true },
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Invalid token. Team not found.' },
        { status: 404 }
      )
    }

    if (team.isLocked) {
      return NextResponse.json(
        { error: 'This team is locked. New participants cannot join.' },
        { status: 403 }
      )
    }

    // Check if email is already used
    const existingEmail = await prisma.participant.findFirst({
      where: { email: email.toLowerCase() },
    })
    if (existingEmail) {
      return NextResponse.json(
        { error: 'This email is already registered. Please login instead.' },
        { status: 400 }
      )
    }

    const existingParticipant = team.participants.find(
      (p) => p.displayName.toLowerCase() === displayName.toLowerCase()
    )

    if (existingParticipant) {
      // If participant exists but has no password, they need to login differently
      if (existingParticipant.passwordHash) {
        return NextResponse.json(
          { error: 'This name is already taken. Please login instead.' },
          { status: 400 }
        )
      }
      // Update existing participant with email and password
      const passwordHash = await bcrypt.hash(password, 10)
      const updatedParticipant = await prisma.participant.update({
        where: { id: existingParticipant.id },
        data: {
          email: email.toLowerCase(),
          passwordHash,
        },
      })
      return NextResponse.json({
        team: {
          id: team.id,
          name: team.name,
          companyName: team.companyName,
          eventDate: team.eventDate,
          token: team.token,
          isLocked: team.isLocked,
          drawComplete: team.drawComplete,
        },
        participant: {
          id: updatedParticipant.id,
          displayName: updatedParticipant.displayName,
          email: updatedParticipant.email,
          isOrganizer: updatedParticipant.isOrganizer,
        },
        isReturning: true,
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    const participant = await prisma.participant.create({
      data: {
        teamId: team.id,
        displayName,
        email: email.toLowerCase(),
        passwordHash,
      },
    })

    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        companyName: team.companyName,
        eventDate: team.eventDate,
        token: team.token,
        isLocked: team.isLocked,
        drawComplete: team.drawComplete,
      },
      participant: {
        id: participant.id,
        displayName: participant.displayName,
        email: participant.email,
        isOrganizer: participant.isOrganizer,
      },
      isReturning: false,
    })
  } catch (error) {
    console.error('Error joining team:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to join team'
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    )
  }
}
