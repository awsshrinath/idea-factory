# Backend Setup Instructions

## Environment Configuration

The backend requires specific environment variables to function properly. 

### Required Variables

Add these variables to your `backend/.env` file:

```bash
# Supabase Configuration (Required for backend database operations)
SUPABASE_URL=https://nphkufnrodsvvyxyaglc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Getting Your Supabase Keys

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/nphkufnrodsvvyxyaglc/settings/api
2. Copy the "service_role" key (NOT the anon key) for `SUPABASE_SERVICE_ROLE_KEY`
3. Copy the "JWT Secret" for `SUPABASE_JWT_SECRET`
4. Add both to your `.env` file

**Important:** 
- The service role key bypasses Row Level Security (RLS) and should be kept secure
- The JWT secret is used to verify authentication tokens

### Current Issues

- Backend fails to start without these environment variables
- Missing: `SUPABASE_SERVICE_ROLE_KEY`
- Missing: `SUPABASE_JWT_SECRET`

### API Endpoints

Once configured, the backend provides these endpoints:

- `GET /api/v1/health` - Health check
- `POST /api/v1/ai/generate-text` - Generate text content
- `POST /api/v1/ai/image` - Generate images
- `POST /api/v1/jobs/*` - Background job management
- `POST /api/v1/storage/*` - File storage operations

### Starting the Backend

Once configured:
```bash
cd backend
npm run dev
```

The backend should start on port 3001 and display a success message. 