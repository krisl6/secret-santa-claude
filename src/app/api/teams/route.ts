import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/utils'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { teamName, companyName, eventDate, organizerName, email, password, budget, currency } = body

    if (!teamName || !eventDate || !organizerName) {
      return NextResponse.json(
        { error: 'Team name, event date, and organizer name are required' },
        { status: 400 }
      )
    }

    // Require email and password for login capability
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required to create an account' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
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

    let token = generateToken(10)
    let existingTeam = await prisma.team.findUnique({ where: { token } })
    while (existingTeam) {
      token = generateToken(10)
      existingTeam = await prisma.team.findUnique({ where: { token } })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    const team = await prisma.team.create({
      data: {
        name: teamName,
        companyName: companyName || null,
        eventDate: new Date(eventDate),
        budget: budget ? parseFloat(budget) : null,
        currency: currency || 'MYR',
        token,
        participants: {
          create: {
            displayName: organizerName,
            email: email.toLowerCase(),
            passwordHash,
            isOrganizer: true,
          },
        },
      },
      include: {
        participants: true,
      },
    })

    const organizer = team.participants[0]

    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        companyName: team.companyName,
        eventDate: team.eventDate,
        token: team.token,
        budget: team.budget,
        currency: team.currency,
        isLocked: team.isLocked,
        drawComplete: team.drawComplete,
      },
      participant: {
        id: organizer.id,
        displayName: organizer.displayName,
        email: organizer.email,
        isOrganizer: organizer.isOrganizer,
      },
    })
  } catch (error) {
    console.error('Error creating team:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create team'
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
      include: {
        participants: {
          include: {
            wishlistItems: true,
            givenAssignment: {
              include: {
                receiver: {
                  include: {
                    wishlistItems: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    const participant = participantId
      ? team.participants.find((p) => p.id === participantId)
      : null

    const isOrganizer = participant?.isOrganizer ?? false

    const response: Record<string, unknown> = {
      team: {
        id: team.id,
        name: team.name,
        companyName: team.companyName,
        eventDate: team.eventDate,
        token: team.token,
        budget: team.budget,
        currency: team.currency,
        isLocked: team.isLocked,
        drawComplete: team.drawComplete,
        participantCount: team.participants.length,
      },
    }

    if (participant) {
      response.participant = {
        id: participant.id,
        displayName: participant.displayName,
        isOrganizer: participant.isOrganizer,
        wishlistItems: participant.wishlistItems,
      }

      if (team.drawComplete && participant.givenAssignment) {
        response.assignment = {
          id: participant.givenAssignment.id,
          receiver: {
            id: participant.givenAssignment.receiver.id,
            displayName: participant.givenAssignment.receiver.displayName,
            wishlistItems: participant.givenAssignment.receiver.wishlistItems,
          },
          isPurchased: participant.givenAssignment.isPurchased,
          isReceived: participant.givenAssignment.isReceived,
          photoUrl: participant.givenAssignment.photoUrl,
          thankYouMessage: participant.givenAssignment.thankYouMessage,
        }
      }
    }

    if (isOrganizer) {
      response.participants = team.participants.map((p) => ({
        id: p.id,
        displayName: p.displayName,
        isOrganizer: p.isOrganizer,
        wishlistItemCount: p.wishlistItems.length,
      }))

      if (team.drawComplete) {
        const assignments = await prisma.assignment.findMany({
          where: { teamId: team.id },
          include: {
            giver: true,
            receiver: true,
          },
        })
        response.assignments = assignments.map((a) => ({
          giver: a.giver.displayName,
          receiver: a.receiver.displayName,
        }))
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching team:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team'
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    )
  }
}
