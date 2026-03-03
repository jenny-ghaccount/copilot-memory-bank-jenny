import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeamMember, requireTeamOrganizer } from '@/lib/auth'
import { inviteUserSchema } from '@/lib/validations'

interface RouteParams {
  params: { id: string }
}

// GET /api/teams/[id]/members - List team members
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireTeamMember(params.id)

    const members = await prisma.teamMember.findMany({
      where: { teamId: params.id },
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
    })

    const formattedMembers = members.map((member: any) => ({
      ...member.user,
      role: member.role,
      joinedAt: member.joinedAt,
    }))

    return NextResponse.json({ members: formattedMembers })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

// POST /api/teams/[id]/members - Invite new member (organizer only)
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireTeamOrganizer(params.id)

    const body = await request.json()
    const { email } = inviteUserSchema.parse(body)

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0], // Default name from email
        },
      })
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: params.id,
          userId: user.id,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a team member' },
        { status: 400 }
      )
    }

    // Add user to team
    const membership = await prisma.teamMember.create({
      data: {
        teamId: params.id,
        userId: user.id,
        role: 'MEMBER',
      },
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
    })

    const member = {
      ...membership.user,
      role: membership.role,
      joinedAt: membership.joinedAt,
    }

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 }
      )
    }

    console.error('Error inviting team member:', error)
    return NextResponse.json(
      { error: 'Failed to invite team member' },
      { status: 500 }
    )
  }
}