import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, organizerId, participantIdToRemove } = body

    if (!token || !organizerId || !participantIdToRemove) {
      return NextResponse.json(
        { error: 'Token, organizer ID, and participant ID to remove are required' },
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

    const organizer = team.participants.find((p) => p.id === organizerId)

    if (!organizer || !organizer.isOrganizer) {
      return NextResponse.json(
        { error: 'Only the organizer can remove participants' },
        { status: 403 }
      )
    }

    const participantToRemove = team.participants.find(
      (p) => p.id === participantIdToRemove
    )

    if (!participantToRemove) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      )
    }

    if (participantToRemove.isOrganizer) {
      return NextResponse.json(
        { error: 'Cannot remove the organizer' },
        { status: 400 }
      )
    }

    if (team.drawComplete) {
      return NextResponse.json(
        { error: 'Cannot remove participants after the draw has been completed' },
        { status: 400 }
      )
    }

    await prisma.participant.delete({
      where: { id: participantIdToRemove },
    })

    return NextResponse.json({
      success: true,
      message: 'Participant removed successfully',
    })
  } catch (error) {
    console.error('Error removing participant:', error)
    return NextResponse.json(
      { error: 'Failed to remove participant' },
      { status: 500 }
    )
  }
}
