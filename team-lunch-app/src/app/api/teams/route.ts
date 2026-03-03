import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createTeamSchema } from '@/lib/validations'

// GET /api/teams - List user's teams
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
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
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Transform the data to include user's role
    const teamsWithRole = teams.map((team: any) => {
      const userMembership = team.members.find((m: any) => m.userId === user.id)
      
      return {
        ...team,
        userRole: userMembership?.role,
        members: team.members.map((member: any) => ({
          ...member.user,
          role: member.role,
          joinedAt: member.joinedAt,
        })),
      }
    })

    return NextResponse.json({ teams: teamsWithRole })
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    )
  }
}

// POST /api/teams - Create a new team
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createTeamSchema.parse(body)

    // Convert meetingPoint to PostGIS geography format if provided
    let meetingPointWKT = null
    if (validatedData.meetingPoint) {
      const { lat, lng } = validatedData.meetingPoint
      meetingPointWKT = `POINT(${lng} ${lat})` // Note: PostGIS uses lng, lat order
    }

    const team = await prisma.team.create({
      data: {
        name: validatedData.name,
        meetingPoint: meetingPointWKT ? prisma.$queryRawUnsafe(
          `ST_GeogFromText('${meetingPointWKT}')`
        ) as any : null,
        settings: validatedData.settings || {
          maxWalkMinutes: 15,
          avoidRecentDays: 14,
          requireDietaryMatch: true,
        },
        members: {
          create: {
            userId: user.id,
            role: 'ORGANIZER',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
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

    // Transform response to match expected format
    const teamWithRole = {
      ...team,
      userRole: 'ORGANIZER',
      members: team.members.map((member: any) => ({
        ...member.user,
        role: member.role,
        joinedAt: member.joinedAt,
      })),
    }

    return NextResponse.json({ team: teamWithRole }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 }
      )
    }

    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    )
  }
}