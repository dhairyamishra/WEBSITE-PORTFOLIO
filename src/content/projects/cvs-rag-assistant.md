---
title: "RAG Support Assistant"
description: "Internal RAG-powered support assistant with Slack integration, OpenAI, and ChromaDB. Reduced manual ticket resolution time by 20% at CVS Health."
date: "2024-03"
tags: ["RAG", "OpenAI", "ChromaDB", "Slack", "Python", "LLM"]
featured: false
category: "ml-ai"
metric: "20%"
metricLabel: "Faster Resolution"
---

## Overview

Built an internal Retrieval-Augmented Generation (RAG) support assistant at CVS Health that integrates with Slack to provide self-serve troubleshooting for engineering teams. The system uses OpenAI for generation and ChromaDB for vector storage, achieving a **20% reduction** in manual ticket resolution time.

## Key Features

- **Slack Integration**: Native Slack bot for seamless team interaction
- **RAG Architecture**: ChromaDB vector store for document retrieval, OpenAI for answer generation
- **Self-Serve Troubleshooting**: Teams can resolve common issues without filing tickets
- **Context-Aware Responses**: Retrieves relevant documentation and past solutions

## Impact

- **20% reduction** in manual ticket resolution time
- Accelerated onboarding for new team members
- Reduced load on platform support teams
- Improved knowledge discoverability across engineering organization

## Tech Stack

- **AI/ML**: OpenAI API, ChromaDB (vector database), RAG pipeline
- **Integration**: Slack Bot API
- **Backend**: Python, FastAPI
- **Data**: Internal documentation corpus, runbook collection
