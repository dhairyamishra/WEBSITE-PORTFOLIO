---
title: "Teserax.io — Graph-Based AI Thinking Tool"
description: "A dual-lane, chat-first exploration tool that transforms linear LLM chat into a visual, non-linear graph canvas with AI orchestration, crosslink reasoning, multi-model BYOK support, and cloud persistence — shipped v2.0 with 64 issues closed across 5 development phases."
date: "2026-02"
tags: ["React", "React Flow", "Hono", "Zustand", "Supabase", "LLM", "GPT-4", "Grok", "Playwright", "Docker"]
featured: true
category: "full-stack"
github: "https://github.com/dhairyamishra/teserax"
liveUrl: "https://www.teserax.io"
metric: "v2.0"
metricLabel: "Shipped"
---

## Overview

Teserax is a graph-based thinking tool that transforms linear LLM chat into a visual, non-linear exploration space. Users ask questions in a persistent chat lane, watch responses decompose into structured graph nodes on an interactive canvas, branch into parallel threads, merge insights, cross-link between reasoning paths, and summarize — all with cloud persistence, multi-model LLM support, and bring-your-own-key for any provider.

The application matured through five development phases and a post-phase monetization sprint into a **dual-lane, chat-first exploration tool** with a versioned prompt registry, DAG-safe crosslink architecture, glassmorphism UI, deterministic tree layout with swim lanes, and production hosting on EC2 behind Cloudflare. Post-v2.0 additions include AI auto-orchestration, a node chat modal, auto-executing pipeline templates, crosslink context injection, and LLM-generated titles and summaries. 64 issues closed, 1 deferred (real-time CRDT collaboration).

## Key Features

- **Dual-Lane UI**: Three-panel layout — ChatPanel (persistent conversation, auto-analyze toggle), GraphCanvas (React Flow with swim lanes, crosslinks, viewport virtualization), and a slim Context Strip sidebar with ancestry chain and quick actions
- **AI Auto-Orchestration**: LLM planner decomposes any natural-language query into a 3–7 step structured execution plan, then a DAG pipeline engine runs all steps automatically with parallel execution and per-step progress tracking
- **Node Chat Modal**: Click any node to open a streaming chat modal for in-place iteration — apply changes to the node or spawn a child node, with ancestry-aware conversation context
- **Four-Handle Crosslinks**: DAG-safe architecture with structural edges (top/bottom, DFS cycle detection) and non-structural annotation crosslinks (left/right side tabs) with type, strength, and auto-detection via tag/topic Jaccard overlap
- **Multi-Model BYOK**: OpenAI (GPT-4o, GPT-4o-mini) and Grok/xAI (Grok-4.1, Grok-3, Grok-3-mini) via a universal adapter, plus bring-your-own-key for 8+ providers (OpenAI, Anthropic, Groq, Together, OpenRouter, Mistral, DeepSeek) with AES-256-GCM encryption at rest
- **Prompt Registry**: 8 versioned templates with `renderTemplate()` interpolation, canonical Zod schemas for structured output, corrective retry that feeds validation errors back to the LLM, and crosslink context injection into prompts with token budgeting
- **Glassmorphism Design**: `backdrop-blur` nodes with dynamic sizing, branch-colored borders, compact operator pills, shimmer skeletons, and hover-expand — plus LLM-generated titles and summaries via a debounced background sidecar
- **Cloud Persistence**: Supabase PostgreSQL with 10 RLS-protected tables, email/Google OAuth, dashboard with search and templates, `Ctrl+S` cloud save, named version history snapshots, and shareable read-only links
- **Pipeline Templates**: 3 auto-executing templates — Financial Analysis (6-step bull/bear framework), Pros & Cons (3-step balanced assessment), and Decision Matrix (4-step comparison merge)
- **Chunk Review**: Accept, reject, or inline-edit individual response chunks (9 typed chunk kinds: claim, step, example, definition, table, code, data_point, question, analysis) before they join the graph

## Architecture

Teserax uses a **dual-lane response model**. Every LLM operation emits immutable chat messages (Lane A) in parallel with graph nodes (Lane B), linked via `projectedNodeIds`. The graph stores both raw provider responses and derived `StructuredProjection` data (Zod-validated typed blocks).

**Core loop**: user sends a message in the ChatPanel → LLM responds via SSE streaming (server key or BYOK) → response is projected into a `StructuredProjection` with typed blocks → each block becomes a node on the graph canvas with structural DAG edges → user can branch (new swim lane thread), merge (converge), summarize (compress), or cross-link (annotate) — with full context lineage and token budget management trimming oldest messages at 80% capacity.

The AI orchestrator adds a second path: when auto-analyze is enabled, the `orchestrator.plan.v1` prompt asks the LLM to decompose the query into a multi-step JSON plan, then `templatePipeline.ts` executes it as a DAG with dependency-aware parallel step execution and a fallback 3-step plan on planner failure.

## Infrastructure & Quality

- **API Server**: Hono framework proxying LLM calls (keys stay server-side), with ES256/HS256 JWT auth, sliding-window rate limiting (100 req/hr), CSP/HSTS security headers, audit logging, and 5MB body / 100k character input limits
- **Hosting**: EC2 behind Cloudflare with Origin Certificate SSL, Nginx TLS 1.2/1.3, real IP restoration, Docker multi-stage builds, and a 7-step SSH deploy pipeline with swap management and health checks
- **Testing**: 226 Vitest tests across 22 files (API, component, prompt, stress, golden set) and 18 Playwright E2E spec files (a11y, auth, BYOK, canvas interaction, cloud persistence, export/import, keyboard shortcuts, and more) with mock LLM server, Stripe/Supabase stubs, and JWT factory
- **CI/CD**: GitHub Actions quality gate (lint, typecheck, build, unit tests, E2E, security audit) plus deploy workflow with Cloudflare Origin Cert install and concurrency groups
- **Observability**: In-memory execution trace collector, metrics API, Sentry error tracking (frontend + backend), and privacy-respecting Plausible analytics

## Tech Stack

- **Frontend**: React 18, React Flow v12 (`@xyflow/react`), Zustand + Immer, Tailwind CSS + shadcn/ui, Framer Motion, react-markdown + remark-gfm, cmdk, sonner
- **Backend**: Hono (Node.js), OpenAI SDK + xAI/Grok via `OpenAICompatAdapter`, Zod, tiktoken, Drizzle ORM, Supabase PostgreSQL, AES-256-GCM encryption
- **Testing**: Vitest (226 tests), Playwright (18 E2E specs, multi-browser + mobile)
- **Infra**: Docker + Docker Compose, Nginx, Cloudflare, EC2, GitHub Actions CI/CD, Supabase Auth + RLS
