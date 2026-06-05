# VerdictFlow AI - Legal Intake Automation

VerdictFlow AI is a multi-tenant SaaS platform designed for personal injury law firms to automate lead capture, qualification, and conversion.

## Overview

This MVP (Phase 1) implements the core AI Intake Agent that engages leads via web chat and SMS, qualifies them based on practice-specific criteria, and integrates with legal CRMs like Clio.

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [TypeScript](https://www.typescriptlang.org/)
- **Backend**: Next.js API Routes, [Prisma ORM](https://www.prisma.io/)
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **AI Engine**: OpenAI (GPT-4o)
- **Communication**: Twilio (SMS Webhooks)
- **Task Queue**: [BullMQ](https://docs.bullmq.io/) with Redis for background follow-ups

## Architecture

- **Multi-tenancy**: Shared-schema approach with tenant isolation.
- **AI Agent**: Stateful conversation management in `lib/ai-agent.ts`.
- **Background Jobs**: Automated lead re-engagement via BullMQ.
- **CRM Integration**: Modular adapter layer for pushing qualified leads to external systems.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Redis (for BullMQ)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ritvikkorrapati05/Business.git
   cd Business
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   # Add your OPENAI_API_KEY, REDIS_URL, etc.
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The dashboard will be available at `http://localhost:3000`.

## Features

- **24/7 Web Chat Widget**: Instant engagement for website visitors.
- **SMS Intake**: Conversational intake via text message.
- **Lead Qualification**: Automated screening based on injury type and liability.
- **Admin Dashboard**: Real-time lead tracking and conversation review.
- **Automated Follow-ups**: Scheduled re-engagement sequences.
- **CRM Sync**: Direct push of qualified leads to Clio.

---
Built by Team VerdictFlow AI.
