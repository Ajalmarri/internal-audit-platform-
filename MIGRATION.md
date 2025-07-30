# Migration from V0 Platform to Local Deployment

This document outlines the changes made to remove V0 platform dependencies and enable local Docker deployment.

## Changes Made

### 1. Removed V0 Dependencies

- **Removed Vercel Blob**: Replaced cloud file storage with local file system
- **Removed Neon Database**: Currently using mock data (can be replaced with any database)
- **Updated package.json**: Removed V0-specific dependencies and updated project metadata
- **Cleaned up layout.tsx**: Removed V0 generator reference

### 2. File Storage Migration

**Before (Vercel Blob)**:
```typescript
import { put } from "@vercel/blob"
const blob = await put(filename, file, {
  access: "public",
  token: BLOB_READ_WRITE_TOKEN,
})
```

**After (Local Storage)**:
```typescript
import { writeFile, mkdir } from "fs/promises"
const filePath = join(uploadPath, filename)
await writeFile(filePath, buffer)
```

### 3. Docker Configuration

Added comprehensive Docker support:

- **Dockerfile**: Multi-stage build for production
- **Dockerfile.dev**: Development environment with hot reloading
- **docker-compose.yml**: Standard deployment
- **docker-compose.prod.yml**: Production deployment with resource limits
- **docker-compose.dev.yml**: Development deployment with volume mounts

### 4. New Features

- **Health Check Endpoint**: `/api/health` for Docker health monitoring
- **Local File Serving**: Files are served directly from the filesystem
- **Environment Configuration**: Support for environment variables
- **Deployment Scripts**: Automated deployment with `scripts/deploy.sh`

## Deployment Options

### Option 1: Docker Compose (Recommended)

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Direct Docker

```bash
# Build and run
docker build -t internal-audit-platform .
docker run -p 3000:3000 -v $(pwd)/uploads:/app/uploads internal-audit-platform
```

### Option 3: Local Development

```bash
pnpm install
pnpm dev
```

## File Structure Changes

### New Files Added:
- `Dockerfile` - Production Docker configuration
- `Dockerfile.dev` - Development Docker configuration
- `docker-compose.yml` - Standard deployment
- `docker-compose.prod.yml` - Production deployment
- `docker-compose.dev.yml` - Development deployment
- `.dockerignore` - Docker build exclusions
- `scripts/deploy.sh` - Deployment automation
- `app/api/health/route.ts` - Health check endpoint
- `MIGRATION.md` - This migration guide

### Modified Files:
- `package.json` - Removed V0 dependencies, added Docker scripts
- `next.config.mjs` - Added standalone output for Docker
- `app/layout.tsx` - Removed V0 generator reference
- `app/api/files/upload/route.ts` - Replaced Vercel Blob with local storage
- `app/api/files/[fileId]/route.ts` - Added local file serving
- `README.md` - Complete rewrite with local deployment instructions

## Environment Variables

Create a `.env.local` file:

```env
# File upload configuration
UPLOAD_DIR=./uploads

# Database configuration (if using external database)
# DATABASE_URL=your_database_url_here

# Authentication (if implementing auth)
# NEXTAUTH_SECRET=your_secret_here
# NEXTAUTH_URL=http://localhost:3000
```

## Data Persistence

Files are stored in the `uploads` directory with the following structure:

```
uploads/
├── evidence/
│   └── assignment-id/
│       └── files...
├── reports/
│   └── report-id/
│       └── files...
└── general/
    └── entity-id/
        └── files...
```

## Next Steps

1. **Database Integration**: Replace mock data with a real database (PostgreSQL, MySQL, etc.)
2. **Authentication**: Implement user authentication and authorization
3. **Backup Strategy**: Implement file backup and recovery procedures
4. **Monitoring**: Add application monitoring and logging
5. **SSL/TLS**: Configure HTTPS for production deployments

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure uploads directory has proper permissions
   ```bash
   chmod 755 uploads
   ```

2. **Port Already in Use**: Change the port in docker-compose.yml
   ```yaml
   ports:
     - "3001:3000"  # Use port 3001 instead
   ```

3. **File Upload Fails**: Check disk space and directory permissions
   ```bash
   df -h
   ls -la uploads/
   ```

### Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart application
docker-compose restart

# Clean up
docker-compose down
docker system prune -f

# Check health
curl http://localhost:3000/api/health
```

## Support

For issues related to the migration or deployment, please:

1. Check the logs: `docker-compose logs -f`
2. Verify the health endpoint: `curl http://localhost:3000/api/health`
3. Check file permissions and disk space
4. Review the Docker configuration files 