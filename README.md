# AI-Powered Resume Analyser

A comprehensive web application that analyzes resumes using AI to provide actionable feedback, skills assessment, and formatting suggestions. The platform is designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS) and better align with job descriptions.

## Tech Stack

This project is built using modern web development technologies:

- **Frontend:** React 18, Tailwind CSS, Radix UI components, React Hook Form, Wouter (for routing), Recharts (for data visualization).
- **Backend:** Node.js, Express, TypeScript, Passport.js (local authentication).
- **Database:** PostgreSQL (with Neon Serverless), Drizzle ORM.
- **AI Integrations:** OpenAI API, Groq SDK.
- **PDF Processing:** PDFKit, pdf-parse.
- **Build Tool:** Vite, esbuild.

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v20+ recommended)
- PostgreSQL database (or an equivalent service like Neon)
- API Keys for OpenAI and Groq

## Environment Variables

Create a `.env` file in the root directory and configure the following required environment variables:

```env
# Database Configuration
DATABASE_URL=postgres://user:password@hostname:port/database

# Secret Key for Session Management
REPL_ID=your_development_secret_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Groq
GROQ_API_KEY=your_groq_api_key
```

## Running the Project

Follow these steps to install and run the project locally.

### 1. Install Dependencies

Install all the required packages using npm:

```bash
npm install
```

### 2. Database Setup

Ensure your database is running and accessible via the `DATABASE_URL` you provided in the `.env` file. Then, push the database schema using Drizzle ORM:

```bash
npm run db:push
```

### 3. Start the Development Server

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

The application will start, and the backend server will usually run on port `5000` (or as configured). You can access the application at `http://localhost:5000`.

### 4. Build for Production

To create a production-ready build of the application:

```bash
npm run build
```

The output will be generated in the `dist/` directory.

### 5. Start the Production Server

After building the project, you can start the production server:

```bash
npm run start
```

## Features

- **Resume Upload & Parsing:** Support for PDF uploads to extract and process resume text.
- **AI-Powered Insights:** In-depth feedback on resume impact, action verbs, and ATS alignment.
- **Skill Assessment:** Identifies key skills and recommends improvements.
- **Interactive Dashboards:** Visualizations and metrics to track resume ATS score.
- **PDF Generation:** Download a highly optimized, fully formatted copy of the generated resume.
