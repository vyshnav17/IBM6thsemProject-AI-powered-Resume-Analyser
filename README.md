# CV AI Insights 🚀
### Next-Gen AI-Powered Resume Analysis & Building Engine

**CV AI Insights** is a powerful, microservices-based platform designed to revolutionize the way candidates prepare their professional profiles. Leveraging cutting-edge AI, the platform provides deep analysis of resumes, offers a professional building experience, and ensures a seamless user journey with a modern, high-energy Neon Glassmorphism interface.

---

## ✨ Key Features

- 🧠 **AI-Powered Analysis**: Upload your resume and get instant, intelligent feedback on content, structure, and keyword optimization.
- 🏗️ **Professional Resume Builder**: Create stunning resumes with real-time AI assistance and professional templates.
- 📂 **History Dashboard**: Keep track of all your previous analyses and resume drafts in one centralized location.
- 📄 **PDF Generation**: Export your optimized resumes into professional PDF formats with a single click.
- 🔒 **Secure User Management**: Robust authentication and profile management services.
- 🎨 **Modern UI/UX**: A premium Neon Glassmorphism aesthetic featuring mesh gradients and frosted glass components for a next-gen software experience.

---

## 🏗️ Architecture

The project is built on a scalable **Microservices Architecture**, ensuring high availability and separation of concerns:

- **API Gateway**: The central entry point for all frontend requests, managing routing and load balancing.
- **Frontend**: A high-performance React application built with Vite and styled with Tailwind CSS.
- **User Service**: Manages user registration, authentication, and profile data.
- **Analyzer Service**: Orchestrates the AI analysis of resumes using advanced LLMs (via Groq API).
- **Builder Service**: Handles the persistence and management of resume drafts and templates.
- **Report Service**: Generates professional PDF exports of resumes and analysis reports.
- **Notification Service**: Manages user alerts and system-wide notifications.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Lucide React, Wouter.
- **Backend**: Node.js, Express.
- **ORM & Database**: Drizzle ORM, PostgreSQL.
- **Infrastructure**: Docker, Docker Compose.
- **AI Integration**: Groq API.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose (optional, for containerized deployment)
- Groq API Key (for analyzer service)

### Local Development (Using Concurrently)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vyshnav17/IBM6thsemProject-AI-powered-Resume-Analyser.git
   cd IBM6thsemProject-AI-powered-Resume-Analyser
   ```

2. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root and relevant service directories with your configurations (API keys, DB credentials, etc.).

4. **Start all services**:
   ```bash
   npm start
   ```

### Using Docker

1. **Build and start the services**:
   ```bash
   docker-compose up --build
   ```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any bugs or feature requests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
