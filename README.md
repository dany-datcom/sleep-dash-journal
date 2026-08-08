# Sleep Journal

Sleep Journal is a full-stack web application for tracking sleep habits, reviewing sleep patterns, and managing personal sleep entries over time. The app is designed as a simple, focused productivity tool that helps users log sleep data, monitor quality, and access their journal through a clean dashboard experience.

## Team Members

- Aurora Isabelle Norlund
- Carson Landvatter
- Dany Jimenez
- Mauro Jose Isa

## Live Deployment

- **Production URL:** https://sleep-dash-journal-djjg.vercel.app/

## Repository

- **GitHub Repo:** https://github.com/dany-datcom/sleep-dash-journal

## Project Overview

Sleep Journal uses the Next.js App Router, TypeScript, Tailwind CSS, and PostgreSQL. It includes authentication, protected routes, database-backed views, and CRUD functionality for sleep entries and user profile data.

### Main Features

- User authentication with login and logout
- Protected dashboard and journal routes
- Personalized sleep entry dashboard
- Create, read, update, and delete sleep entries
- Profile management for updating user information
- Responsive UI with reusable components
- Database-backed data flow using PostgreSQL

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Auth.js / NextAuth
- Node.js

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/dany-datcom/sleep-dash-journal.git
cd sleep-dash-journal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add the required values.

Example:

```env
DATABASE_URL=your_postgres_connection_string
AUTH_SECRET=your_auth_secret
```

If your deployment uses additional provider or auth settings, include those as needed.

### 4. Run the development server

```bash
npm run dev
```

The app should now be available at:

```bash
http://localhost:3000
```

## Build and Production

### Local production build

```bash
npm run build
npm start
```

## Authentication

This project uses credentials-based authentication through Auth.js / NextAuth. Protected routes redirect unauthenticated users to the login page.

If demo credentials are required for grading, add them here:

- **Demo Email:** add-test-email@example.com
- **Demo Password:** add-test-password

## App Structure

The project follows the Next.js App Router structure and separates concerns across pages, route handlers, reusable components, authentication files, and database utilities.

### Key Routes

- `/` — sleep dashboard
- `/login` — login page
- `/journal` — journal management page
- `/profile` — profile management page
- `/api/entries/[user_id]` — API route for fetching and creating entries

## API Notes

### `GET /api/entries/[user_id]`
Returns sleep entries for the authenticated user.

### `POST /api/entries/[user_id]`
Creates a new sleep entry for the authenticated user.

These route handlers are connected to PostgreSQL through the database utility functions in `lib/db.ts`.

## Known Issues / Opportunities

- Some database queries could be improved with additional parameterization for better security.
- The README can be expanded further if new features or routes are added.
- Additional accessibility and UI polish opportunities remain for future iterations.
- More API routes can be added to support a broader set of journal actions if needed.

## Development Notes

- Reusable components are used across the app for navigation, headers, journal cards, and auth controls.
- TypeScript is used throughout the project for props, data types, and server/client interactions.
- The codebase uses ESLint for formatting and code quality support.

## Course Submission Notes

This application is intended as the final team submission for W06 Team Project. It demonstrates:
- a deployed web application,
- App Router organization,
- authentication and protected routes,
- database-backed data flow,
- dynamic views,
- reusable UI components,
- and documentation for setup and API behavior.
