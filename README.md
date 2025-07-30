# Internal Audit Platform

A comprehensive internal audit management platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Audit Planning**: Create and manage audit plans with timeline views
- **Assignment Management**: Kanban board for audit assignments
- **Evidence Management**: Secure file upload and storage system
- **Risk Assessment**: Comprehensive risk tracking and assessment tools
- **Reporting**: Generate detailed audit reports
- **Dashboard**: Executive command center with KPI monitoring
- **Data Analytics**: AI-powered data analysis hub
- **Quality Assurance**: Review and approval workflows

## Local Development

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Docker (for containerized deployment)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd internal-audit-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and start the application**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop the application**
   ```bash
   docker-compose down
   ```

### Using Docker directly

1. **Build the image**
   ```bash
   docker build -t internal-audit-platform .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 -v $(pwd)/uploads:/app/uploads internal-audit-platform
   ```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# File upload configuration
UPLOAD_DIR=./uploads

# Database configuration (PostgreSQL)
DATABASE_URL=postgresql://audit_user:audit_password@localhost:5432/audit_platform

# Authentication (if implementing auth)
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Database

The application uses PostgreSQL for persistent data storage. The database includes:

### Core Tables
- **audit_plans** - Audit planning and management
- **assignments** - Task assignments and tracking
- **findings** - Audit findings and issues
- **evidence** - File metadata and relationships
- **reports** - Generated report metadata

### Sample Data
The database comes pre-populated with sample audit plans, assignments, and findings for testing.

### Database Connection
- **Host**: localhost (or postgres container)
- **Port**: 5432
- **Database**: audit_platform
- **User**: audit_user
- **Password**: audit_password

## File Storage

The application uses local file storage for uploaded documents. Files are stored in the `uploads` directory with the following structure:

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

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (main)/            # Main application routes
│   │   ├── assignments/   # Assignment management
│   │   ├── audit-plans/   # Audit planning
│   │   ├── dashboard/     # Main dashboard
│   │   ├── evidence-locker/ # File management
│   │   ├── findings/      # Audit findings
│   │   ├── reports/       # Report generation
│   │   └── settings/      # Application settings
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── public/                # Static assets
├── styles/                # Global styles
└── Dockerfile            # Docker configuration
```

## API Endpoints

### Core APIs
- `GET /api/health` - Health check
- `GET /api/audit-plans` - List audit plans
- `POST /api/audit-plans` - Create audit plan
- `GET /api/assignments` - List assignments
- `POST /api/assignments` - Create assignment
- `GET /api/findings` - List findings
- `POST /api/findings` - Create finding

### File Management
- `POST /api/files/upload` - Upload files with database metadata
- `GET /api/files/[category]/[entityId]/[filename]` - Download files
- `GET /api/evidence` - List evidence with filtering
- `POST /api/evidence` - Create evidence record

### Reports
- `POST /api/reports/generate` - Generate reports with database storage

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository.