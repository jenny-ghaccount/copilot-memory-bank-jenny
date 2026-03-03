import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeamMember, requireTeamOrganizer } from '@/lib/auth'
import { updateTeamSchema } from '@/lib/validations'

interface RouteParams {
  params: { id: string }
}

// GET /api/teams/[id] - Get team details
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { user, membership } = await requireTeamMember(params.id)

    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                dietaryTags: true,
              },
            },
          },
          orderBy: [
            { role: 'asc' }, // ORGANIZER first
            { joinedAt: 'asc' },
          ],
        },
        polls: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            winner: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                votes: true,
                suggestions: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            polls: true,
          },
        },
      },
    })

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Parse meetingPoint from PostGIS format
    let meetingPoint = null
    if (team.meetingPoint) {
      // You would typically use a PostGIS function here to extract coordinates
      // For now, we'll leave it as null and handle this in the frontend
      // In production, you'd use ST_X, ST_Y functions
      meetingPoint = null // TODO: Extract from PostGIS geometry
    }

    const teamWithDetails = {
      ...team,
      meetingPoint,
      userRole: membership.role,
      members: team.members.map(member => ({
        ...member.user,
        role: member.role,
        joinedAt: member.joinedAt,
      })),
    }

    return NextResponse.json({ team: teamWithDetails })
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team' },
      { status: 500 }
    )
  }
}

// PATCH /api/teams/[id] - Update team (organizer only)
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { user, membership } = await requireTeamOrganizer(params.id)

    const body = await request.json()
    const validatedData = updateTeamSchema.parse(body)

    // Convert meetingPoint to PostGIS format if provided
    let updateData: any = {}
    
    if (validatedData.name) {
      updateData.name = validatedData.name
    }
    
    if (validatedData.settings) {
      updateData.settings = validatedData.settings
    }
    
    if (validatedData.meetingPoint) {
      const { lat, lng } = validatedData.meetingPoint
      const meetingPointWKT = `POINT(${lng} ${lat})`
      updateData.meetingPoint = prisma.$queryRawUnsafe(
        `ST_GeogFromText('${meetingPointWKT}')`
      ) as any
    }

    const team = await prisma.team.update({
      where: { id: params.id },
      data: updateData,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                dietaryTags: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            polls: true,
          },
        },
      },
    })

    const teamWithRole = {
      ...team,
      userRole: membership.role,
      members: team.members.map(member => ({
        ...member.user,
        role: member.role,
        joinedAt: member.joinedAt,
      })),
    }

    return NextResponse.json({ team: teamWithRole })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 }
      )
    }

    console.error('Error updating team:', error)
    return NextResponse.json(
      { error: 'Failed to update team' },
      { status: 500 }
    )
  }
}

// DELETE /api/teams/[id] - Delete team (organizer only)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireTeamOrganizer(params.id)

    await prisma.team.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Team deleted successfully' })
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json(
      { error: 'Failed to delete team' },
      { status: 500 }
    )
  }
}