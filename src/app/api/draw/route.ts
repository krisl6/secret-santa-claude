import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateAssignments } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, organizerId } = body

    if (!token || !organizerId) {
      return NextResponse.json(
        { error: 'Token and organizer ID are required' },
        { status: 400 }
      )
    }

    const team = await prisma.team.findUnique({
      where: { token },
      include: {
        participants: {
          include: {
            wishlistItems: true,
          },
        },
        exclusions: true,
      },
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
        { error: 'Only the organizer can trigger the draw' },
        { status: 403 }
      )
    }

    if (team.participants.length < 3) {
      return NextResponse.json(
        { error: 'Minimum 3 participants required for the draw' },
        { status: 400 }
      )
    }

    const participantsWithoutWishlist = team.participants.filter(
      (p) => p.wishlistItems.length === 0
    )

    if (participantsWithoutWishlist.length > 0) {
      return NextResponse.json(
        {
          error: 'All participants must have at least one wishlist item',
          participantsWithoutWishlist: participantsWithoutWishlist.map(
            (p) => p.displayName
          ),
        },
        { status: 400 }
      )
    }

    const participantIds = team.participants.map((p) => p.id)
    const exclusions = team.exclusions.map((e) => ({
      excluderId: e.excluderId,
      excludedId: e.excludedId,
    }))
    const assignments = generateAssignments(participantIds, exclusions)

    if (!assignments) {
      return NextResponse.json(
        { error: 'Failed to generate assignments. The exclusion rules may be too restrictive. Please adjust exclusions and try again.' },
        { status: 500 }
      )
    }

    await prisma.$transaction(async (tx) => {
      await tx.assignment.deleteMany({
        where: { teamId: team.id },
      })

      await tx.assignment.createMany({
        data: assignments.map((a) => ({
          teamId: team.id,
          giverId: a.giverId,
          receiverId: a.receiverId,
        })),
      })

      await tx.team.update({
        where: { id: team.id },
        data: {
          drawComplete: true,
          isLocked: true,
        },
      })
    })

    const finalAssignments = await prisma.assignment.findMany({
      where: { teamId: team.id },
      include: {
        giver: true,
        receiver: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Draw completed successfully',
      assignments: finalAssignments.map((a) => ({
        giver: a.giver.displayName,
        receiver: a.receiver.displayName,
      })),
    })
  } catch (error) {
    console.error('Error performing draw:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to perform draw'
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    )
  }
}
