# Studio Forge - Complete SaaS Platform

A powerful visual design tool built with React, Vite, and modern SaaS infrastructure.

## 🚀 Features

- **Visual Canvas Editor** - Infinite canvas with layers, frames, and components
- **AI Integration** - AI-powered design suggestions and generation
- **Authentication** - Secure auth with Clerk (Google & GitHub login)
- **Subscription Plans** - Stripe-powered subscription system
- **Project Publishing** - Share projects with unique public URLs
- **Real-time Collaboration** - Team workspace features
- **Theme System** - Dark, Light, and High Contrast modes

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **Payments**: Stripe
- **Deployment**: Vercel

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Fill in your API keys in .env.local

# Run database migrations
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev
```

## 🔑 Environment Variables

See `.env.example` for required variables:
- Clerk (Authentication)
- Supabase (Database)
- Stripe (Payments)

## 📖 Documentation

- See `DEPLOYMENT.md` for deployment instructions
- See `implementation_plan.md` for architecture details

## 🌐 Deployment

This project is configured for Vercel deployment. See `DEPLOYMENT.md` for full instructions.

## 📝 License

MIT

## 👨‍💻 Author

Egehan Doğan
