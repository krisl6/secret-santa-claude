import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const participantId = searchParams.get('participantId')

    if (!participantId) {
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      )
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { participantId },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ wishlistItems })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { participantId, itemName, description, link, priceRange } = body

    if (!participantId || !itemName) {
      return NextResponse.json(
        { error: 'Participant ID and item name are required' },
        { status: 400 }
      )
    }

    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: { wishlistItems: true },
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      )
    }

    if (participant.wishlistItems.length >= 3) {
      return NextResponse.json(
        { error: 'Maximum 3 wishlist items allowed' },
        { status: 400 }
      )
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        participantId,
        itemName,
        description: description || null,
        link: link || null,
        priceRange: priceRange || null,
      },
    })

    return NextResponse.json({ wishlistItem })
  } catch (error) {
    console.error('Error creating wishlist item:', error)
    return NextResponse.json(
      { error: 'Failed to create wishlist item' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { wishlistItemId, participantId, itemName, description, link, priceRange } = body

    if (!wishlistItemId || !participantId) {
      return NextResponse.json(
        { error: 'Wishlist item ID and participant ID are required' },
        { status: 400 }
      )
    }

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: { id: wishlistItemId },
    })

    if (!wishlistItem) {
      return NextResponse.json(
        { error: 'Wishlist item not found' },
        { status: 404 }
      )
    }

    if (wishlistItem.participantId !== participantId) {
      return NextResponse.json(
        { error: 'You can only edit your own wishlist items' },
        { status: 403 }
      )
    }

    const updatedItem = await prisma.wishlistItem.update({
      where: { id: wishlistItemId },
      data: {
        itemName: itemName ?? wishlistItem.itemName,
        description: description !== undefined ? description : wishlistItem.description,
        link: link !== undefined ? link : wishlistItem.link,
        priceRange: priceRange !== undefined ? priceRange : wishlistItem.priceRange,
      },
    })

    return NextResponse.json({ wishlistItem: updatedItem })
  } catch (error) {
    console.error('Error updating wishlist item:', error)
    return NextResponse.json(
      { error: 'Failed to update wishlist item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { wishlistItemId, participantId } = body

    if (!wishlistItemId || !participantId) {
      return NextResponse.json(
        { error: 'Wishlist item ID and participant ID are required' },
        { status: 400 }
      )
    }

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: { id: wishlistItemId },
    })

    if (!wishlistItem) {
      return NextResponse.json(
        { error: 'Wishlist item not found' },
        { status: 404 }
      )
    }

    if (wishlistItem.participantId !== participantId) {
      return NextResponse.json(
        { error: 'You can only delete your own wishlist items' },
        { status: 403 }
      )
    }

    await prisma.wishlistItem.delete({
      where: { id: wishlistItemId },
    })

    return NextResponse.json({
      success: true,
      message: 'Wishlist item deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting wishlist item:', error)
    return NextResponse.json(
      { error: 'Failed to delete wishlist item' },
      { status: 500 }
    )
  }
}
