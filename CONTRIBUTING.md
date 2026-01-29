# Contributing to ReCole

Thank you for your interest in contributing to ReCole! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 18.17 or later
- PostgreSQL database (local or cloud-hosted)
- pnpm, npm, or yarn

### Getting Started

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ReCole.git
   cd ReCole
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following in `.env.local`:
   - `DATABASE_URL` - PostgreSQL connection string
   - `DIRECT_URL` - Direct database URL for migrations
   - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
   - `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Code Style

- We use TypeScript for type safety
- ESLint is configured for code linting
- Follow the existing code patterns in the codebase
- Use descriptive variable and function names
- Add comments only when the code isn't self-explanatory

### Running Linting

```bash
npm run lint
```

### Running Tests

```bash
npm run test        # Watch mode
npm run test:run    # Single run
```

## Pull Request Process

1. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Test your changes**:
   ```bash
   npm run lint
   npm run test:run
   npm run build
   ```

4. **Commit your changes** with a clear commit message:
   ```bash
   git commit -m "Add feature: brief description"
   ```

5. **Push to your fork** and create a Pull Request

6. **In your PR description**, include:
   - What the change does
   - Why it's needed
   - How to test it
   - Screenshots (for UI changes)

## Reporting Issues

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser/OS information for frontend issues

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── actions/      # Server actions
│   ├── api/          # API routes
│   └── [pages]/      # Page components
├── components/       # React components
│   ├── ui/           # Reusable UI components
│   └── [feature]/    # Feature-specific components
├── lib/              # Utility functions and configurations
└── types/            # TypeScript type definitions
```

## Questions?

Feel free to open an issue for any questions about contributing.

Thank you for helping make ReCole better!
