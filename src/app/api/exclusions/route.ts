import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, participantId, excludedParticipantId } = body

    if (!token || !participantId || !excludedParticipantId) {
      return NextResponse.json(
        { error: 'Token, participant ID, and excluded participant ID are required' },
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
    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      )
    }

    const excludedParticipant = team.participants.find((p) => p.id === excludedParticipantId)
    if (!excludedParticipant) {
      return NextResponse.json(
        { error: 'Excluded participant not found' },
        { status: 404 }
      )
    }

    if (participantId === excludedParticipantId) {
      return NextResponse.json(
        { error: 'Cannot exclude yourself' },
        { status: 400 }
      )
    }

    // Check if exclusion already exists
    const existing = await prisma.exclusion.findUnique({
      where: {
        excluderId_excludedId: {
          excluderId: participantId,
          excludedId: excludedParticipantId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Exclusion already exists' },
        { status: 400 }
      )
    }

    const exclusion = await prisma.exclusion.create({
      data: {
        teamId: team.id,
        excluderId: participantId,
        excludedId: excludedParticipantId,
      },
    })

    return NextResponse.json({ success: true, exclusion })
  } catch (error) {
    console.error('Error creating exclusion:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create exclusion'
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, participantId, excludedParticipantId } = body

    if (!token || !participantId || !excludedParticipantId) {
      return NextResponse.json(
        { error: 'Token, participant ID, and excluded participant ID are required' },
        { status: 400 }
      )
    }

    const team = await prisma.team.findUnique({
      where: { token },
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    await prisma.exclusion.delete({
      where: {
        excluderId_excludedId: {
          excluderId: participantId,
          excludedId: excludedParticipantId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting exclusion:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete exclusion'
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const participantId = searchParams.get('participantId')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    const team = await prisma.team.findUnique({
      where: { token },
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    const where: { teamId: string; excluderId?: string } = { teamId: team.id }
    if (participantId) {
      where.excluderId = participantId
    }

    const exclusions = await prisma.exclusion.findMany({
      where,
      include: {
        excluder: { select: { id: true, displayName: true } },
        excluded: { select: { id: true, displayName: true } },
      },
    })

    return NextResponse.json({ exclusions })
  } catch (error) {
    console.error('Error fetching exclusions:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch exclusions'
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    )
  }
}

