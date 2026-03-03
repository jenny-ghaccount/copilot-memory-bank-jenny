import NextAuth, { AuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      // Custom email templates
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const { host } = new URL(url)
        
        // In production, you'd use a proper email service
        // For now, we'll use the default nodemailer setup
        const nodemailer = await import('nodemailer')
        const transport = nodemailer.createTransport(provider.server)
        
        const result = await transport.sendMail({
          to: email,
          from: provider.from,
          subject: `🍽️ Sign in to Team Lunch App`,
          text: `Sign in to ${host}\n\n${url}\n\n`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1976d2;">🍽️ Team Lunch App</h2>
              <p>Click the link below to sign in to your account:</p>
              <div style="margin: 20px 0;">
                <a href="${url}" style="background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Sign in to Team Lunch App
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">
                If you didn't request this email, you can safely ignore it.
              </p>
            </div>
          `,
        })
        
        const failed = result.rejected.concat(result.pending).filter(Boolean)
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`)
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user && user) {
        (session.user as any).id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
  events: {
    async createUser(message) {
      // Log new user creation for analytics
      console.log('New user created:', message.user.email)
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }