# Team Lunch App - Setup Guide

## 🚀 Epic A1 Implementation Complete!

You now have a fully functional team management system with:
- ✅ User authentication (email magic links)
- ✅ Team creation with map-based meeting points  
- ✅ Team member management
- ✅ Full API backend with validation
- ✅ PostgreSQL + PostGIS database schema
- ✅ Security and rate limiting

## 🏗️ Setup Instructions

### 1. Install Dependencies

```bash
cd team-lunch-app
npm install
```

### 2. Set up Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Database - Supabase Postgres URL with PostGIS extension
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[your-anon-key]"
SUPABASE_SECRET_KEY="[your-service-role-key]"

# Auth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[generate-random-secret]"

# Email (Gmail example)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="[your-app-password]"
EMAIL_FROM="noreply@yourdomain.com"

# Redis (optional for production)
UPSTASH_REDIS_REST_URL="your-upstash-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# External APIs (for future epics)
OVERPASS_API_URL="https://overpass-api.de/api/interpreter"
OPENROUTESERVICE_API_KEY="your-ors-api-key"
```

### 3. Set up Supabase Database

1. **Create a new Supabase project**: https://supabase.com/
2. **Enable PostGIS extension**:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```
3. **Push Prisma schema**:
   ```bash
   npx prisma db push
   ```
4. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

### 4. Set up Leaflet Map Icons

Download the marker icons:

```bash
# Create the public directory
mkdir -p public/leaflet

# Download Leaflet marker icons
curl -o public/leaflet/marker-icon.png https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png
curl -o public/leaflet/marker-icon-2x.png https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png
curl -o public/leaflet/marker-shadow.png https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png
```

### 5. Run the Application

```bash
npm run dev
```

Visit: http://localhost:3000

## 🔧 Quick Test Flow

1. **Visit the app** → Click "Get Started"
2. **Sign in** → Enter your email → Check email for magic link
3. **Create a team** → Set name, click map for meeting point, adjust settings
4. **View teams** → Your new team should appear

## 📁 Key Files Created

### Database & API
- `prisma/schema.prisma` - Database schema with PostGIS
- `src/lib/prisma.ts` - Database client
- `src/lib/supabase.ts` - Supabase client
- `src/app/api/auth/[...nextauth]/route.ts` - Authentication
- `src/app/api/teams/` - Team management APIs

### Frontend Components  
- `src/components/MapPicker.tsx` - Interactive map for location selection
- `src/components/CreateTeamForm.tsx` - Complete team creation form
- `src/components/auth/SignInForm.tsx` - Email magic link sign-in
- `src/app/teams/` - Team pages with real data

### Security & Validation
- `src/lib/auth.ts` - Auth helpers and RBAC
- `src/lib/validations.ts` - Zod schemas for all inputs
- `src/lib/middleware.ts` - Rate limiting and security

## 🚦 Next: Epic B - Restaurant Discovery

Once A1 is working, you can implement:
- **B1**: Search restaurants by name via Overpass API
- **B2**: Search restaurants by cuisine type  
- **C1**: Walking time calculations via OpenRouteService
- **D1-D3**: Polling and voting system
- **E1-E2**: History and reviews

## 🐛 Troubleshooting

**Map not loading?** 
- Check browser console for Leaflet errors
- Ensure marker icons are downloaded to `public/leaflet/`

**Authentication failing?**
- Verify email server credentials
- Check NEXTAUTH_SECRET is set
- Ensure Supabase RLS policies allow user creation

**Database errors?**
- Confirm PostGIS extension is enabled
- Verify DATABASE_URL format
- Run `npx prisma db push` to sync schema

**TypeScript errors?**
- Run `npm install` to ensure all dependencies
- Check that @mui/lab is installed for LoadingButton

---

🎯 **Status**: Epic A1 complete - ready for restaurant discovery!