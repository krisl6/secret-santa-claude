import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, participantId, lock } = body

    if (!token || !participantId) {
      return NextResponse.json(
        { error: 'Token and participant ID are required' },
        { status: 400 }
      )
    }

    const team = await prisma.team.findUnique({
      where: { token },
      include: { participants: true },
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    const participant = team.participants.find((p) => p.id === participantId)

    if (!participant || !participant.isOrganizer) {
      return NextResponse.json(
        { error: 'Only the organizer can lock/unlock the team' },
        { status: 403 }
      )
    }

    const updatedTeam = await prisma.team.update({
      where: { id: team.id },
      data: { isLocked: lock ?? true },
    })

    return NextResponse.json({
      success: true,
      isLocked: updatedTeam.isLocked,
    })
  } catch (error) {
    console.error('Error locking team:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to lock team'
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    )
  }
}
