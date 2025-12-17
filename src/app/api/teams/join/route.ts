import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, displayName } = body

    if (!token || !displayName) {
      return NextResponse.json(
        { error: 'Token and display name are required' },
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

    const existingParticipant = team.participants.find(
      (p) => p.displayName.toLowerCase() === displayName.toLowerCase()
    )

    if (existingParticipant) {
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
          id: existingParticipant.id,
          displayName: existingParticipant.displayName,
          isOrganizer: existingParticipant.isOrganizer,
        },
        isReturning: true,
      })
    }

    const participant = await prisma.participant.create({
      data: {
        teamId: team.id,
        displayName,
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
