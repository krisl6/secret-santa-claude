import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, participantId, isPurchased, isReceived, photoUrl, thankYouMessage } = body

    if (!token || !participantId) {
      return NextResponse.json(
        { error: 'Token and participant ID are required' },
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

    // Find the assignment - check if participant is giver or receiver
    let assignment = await prisma.assignment.findUnique({
      where: { giverId: participantId },
      include: { team: true },
    })

    let isReceiver = false
    if (!assignment || assignment.team.token !== token) {
      // Try as receiver
      assignment = await prisma.assignment.findUnique({
        where: { receiverId: participantId },
        include: { team: true },
      })
      if (assignment && assignment.team.token === token) {
        isReceiver = true
      }
    }

    if (!assignment || assignment.team.token !== token) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    const updateData: {
      isPurchased?: boolean
      isReceived?: boolean
      photoUrl?: string | null
      thankYouMessage?: string | null
      purchasedAt?: Date | null
      receivedAt?: Date | null
    } = {}

    // Only giver can mark as purchased and add photo
    if (!isReceiver) {
      if (typeof isPurchased === 'boolean') {
        updateData.isPurchased = isPurchased
        updateData.purchasedAt = isPurchased ? new Date() : null
      }
      if (photoUrl !== undefined) {
        updateData.photoUrl = photoUrl || null
      }
    }

    // Only receiver can mark as received and add thank you
    if (isReceiver) {
      if (typeof isReceived === 'boolean') {
        updateData.isReceived = isReceived
        updateData.receivedAt = isReceived ? new Date() : null
      }
      if (thankYouMessage !== undefined) {
        updateData.thankYouMessage = thankYouMessage || null
      }
    }

    const updated = await prisma.assignment.update({
      where: { id: assignment.id },
      data: updateData,
      include: {
        giver: { select: { displayName: true } },
        receiver: { select: { displayName: true } },
      },
    })

    return NextResponse.json({ success: true, assignment: updated })
  } catch (error) {
    console.error('Error updating assignment:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update assignment'
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

    if (!token || !participantId) {
      return NextResponse.json(
        { error: 'Token and participant ID are required' },
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

    const assignment = await prisma.assignment.findUnique({
      where: { giverId: participantId },
      include: {
        giver: { select: { displayName: true } },
        receiver: { select: { displayName: true } },
      },
    })

    if (!assignment || assignment.teamId !== team.id) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ assignment })
  } catch (error) {
    console.error('Error fetching assignment:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch assignment'
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    )
  }
}

